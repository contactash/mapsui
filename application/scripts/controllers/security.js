var signalling = require('../signalling'),
    moment = require('moment');
var main = function ($timeout, $scope, $rootScope, $sce, $location, securityService, config, constants, modalService, $uibModal) {
  var setUp = function () {
    $timeout(function () {
      $scope.formErrors = {};
      $scope.securityDisabled = config.NO_AUTH === true;
    });
  },
    setLoggedInState = function (userId, password) {
      $rootScope.loggedInUserId = userId;
      $rootScope.loginComplete = true;
    },
    doChangePassword = function (dueToExpire) {
      return modalService.showModal({
        backdrop: true,
        keyboard: true,
        modalFade: true,
        templateUrl: 'views/changePassword.html',
        controller: 'change-password',
        size: 'lg',
        resolve: {
          data: function () {
            return {
              credentials: {
                'oldPassword': '',
                'newPassword': ''
              },
              headerText: 'Change Password',
              closeButtonText: 'Cancel',
              actionButtonText: 'Confirm',
              dueToExpire: dueToExpire
            };
          }
        }
      }, {})
        .then(function (confirmed) {
          if (confirmed) {
            modalService.showModal({}, {
              headerText: 'Change Password',
              closeButtonText: '',
              actionButtonText: 'OK',
              bodyText: $sce.trustAsHtml('Your password has been successfully changed')
            }).then(function (result) {
                if (showPasswordScreen) {
                  showPasswordScreen = false;

                  $rootScope.loginComplete = false;
                  $rootScope.loggedInUserObj.userId = '';
                  $location.path('/login');
                }
            });
          }
        }, function () {
          if (dueToExpire) {
            //$scope.$apply(function () {
              $location.path("/login");
            //});
          }
        });
    },
    open = function (msg) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modalDialog.html',
            controller: 'modalInstanceCtrl',
            resolve: {
                modalOptions: {
                  message: $sce.trustAsHtml(msg),               
                  hideCancel: true,
                  headerText: 'Password Expiry'
                }
            }
        });

        modalInstance.result.then(function () {
          if(showPasswordScreen){
            doChangePassword(true);
          }
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    },
    renderSimpleModal = function (msg) {
      open(msg);
    },
    errorMap = {
      PERR10: 'Log on has failed due an IT problem, please try again or contact your help desk.',
      PERR11: 'Invalid user name or password entered',
      PERR12: 'Password has expired, please reset your password or call your help desk',
      PERR13: 'Log on has failed due an IT problem, please try again or contact your help desk.',
      PERR15: 'Authorisation failed please connect to the network when logging on',
      PERR20: 'Log-on has failed. Please contact your help desk',
      PERR21: 'Your password is due to expire. Please change your password',
      CREDENTIALS: 'User ID and Password are required',
      OFFLINE_NO_CREDENTIALS: 'Log in has failed. Please connect to the network before logging in.'
    };
  var showPasswordScreen = false;
  setUp();
  signalling.await('userLoaded').then(setUp);
    $rootScope.logout = function () {
        // clear credentials and user properties:
        //securityService.performLogout();
        $rootScope.loginComplete = false;
        $rootScope.loggedInUserObj = {};
        $rootScope.loggedInUserObj.lotIds = [];
        $rootScope.loggedInUserId = '';
        $rootScope.staffNumber = '';
        $location.path('/login');
    };

  $scope.login = function (credentials) {
      $rootScope.timedOut = false;
    if (!credentials || !credentials.username || !credentials.password) {
      $scope.formErrors.errors = errorMap.CREDENTIALS;
    } else {
      securityService.authenticate(credentials.username, credentials.password)
        .then(function (result) {
            doLogin(result, credentials);
        }).catch(function (e){
          doLogin(e, credentials);
        })
    }
  };
  
  function doLogin(result, credentials){
    if (result.Status === constants.SECURITY_STATUS_CODES.Login.OK) {

        if($rootScope.loggedInUserObj.roles.indexOf('Allocate') == -1){
            $scope.$apply(function () {
              $scope.formErrors.errors = $rootScope.offline ? 'Log-in has failed. Please connect to the network before logging on.' : 'You do not have the correct MAPS role to access MAPS UI.';
            });
            $scope.credentials.password = '';
            return;
        }

            var minDate = moment().add(config.PASSWORD_EXPIRY.MIN, 'days').unix() * 1000,
                maxDate = moment().add(config.PASSWORD_EXPIRY.MAX, 'days').unix() * 1000,
                oneDay = moment().add(1, 'days').unix() * 1000;

            if (result.passwordExpiryReminder) {
              renderSimpleModal(errorMap.PERR21);
            }

            //var expDate = moment().add(23, 'hours').unix() * 1000;

            var expDate = result.passwordExpiryDate;

            if (expDate) {
              // to do maps - moment.js
             // less than 24 hours
             if (expDate <= oneDay) {
                  showPasswordScreen = true;
                  renderSimpleModal('Your password is due to expire today');
              // more than 24 hours
              } else if (expDate >= (minDate-oneDay) && expDate <= maxDate) {
                  renderSimpleModal('Your password is due to expire. Please change your password as soon as possible.');
                  $scope.$apply(function () {
                    $location.path("/index");
                  });
                  setLoggedInState(credentials.username, credentials.password);
              } else {
                  $scope.$apply(function () {
                    $location.path("/index");
                  });
                  setLoggedInState(credentials.username, credentials.password);
              }
            }
            
     } else {
            if (result.status === constants.SECURITY_STATUS_CODES.Login.EXCEEDED_MAX_NO_OF_ATTEMPTS) {
              $scope.$apply(function () {
                $scope.formErrors.errors = $rootScope.offline ? 'Log-in has failed. Please connect to the network before logging on.' : 'Log-in has failed. Please contact your help desk to reset your password.';
              });
            } else {
              $scope.$apply(function () {
                  var faultCode = result.faultCode ? " (" + result.faultCode +")" : "";
                  $scope.formErrors.errors = errorMap[result.status] +  faultCode;
              });

            }
            $scope.credentials.password = '';
          }
  }

  $scope.changePassword = function (event) {
    if(event != null){
      if(event.keyCode != 32 && event.keyCode != 13){
          return;
      }
    }
    doChangePassword(false);
  };

  $scope.logout = function (event) {

    if(event != null){
      if(event.keyCode != 32 && event.keyCode != 13){
          return;
      }
    }

    modalService.showModal({},
      {
        closeButtonText: 'No',
        actionButtonText: 'Yes',
        headerText: 'Logout',
        bodyText: $sce.trustAsHtml('Are you sure you want to exit MAPS UI?')
      }).then(function logoutSuccess() {
        // clear credentials and user properties:
        $rootScope.loginComplete = false;
        $rootScope.loggedInUserObj = {};
        $rootScope.loggedInUserObj.lotIds = [];
        $rootScope.loggedInUserId = '';
        $rootScope.staffNumber = '';
        $location.path('/login');
    });
  };
};
if (typeof module !== 'undefined') {
  module.exports = main;
}
if (typeof define === 'function') {
  define(main);
}
