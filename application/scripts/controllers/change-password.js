var main = function ($scope, $rootScope, $modalInstance, data, passwordValidationService, securityService, config, constants) {
    var setUp = function () {
        $scope.credentials = data.credentials;
        $scope.confirmNewPassword = '';
        $scope.headerText = data.headerText;
        $scope.closeButtonText = data.closeButtonText;
        $scope.actionButtonText = data.actionButtonText;
        $scope.dueToExpire = data.dueToExpire;
        $scope.bodyText = '';
        $scope.submitted = false;
        $scope.formErrors = data.dueToExpire ? [{ 'msg': 'Your password is due to expire today' }] : [];
    };

    setUp();

    var validatePasswordChange = function () {
        $scope.formErrors = [];
        passwordValidationService.validatePasswords($rootScope.loggedInUserObj.password, $scope.credentials.oldPassword, $scope.credentials.newPassword, $scope.confirmNewPassword)
            .then(function (result) {
                if (result.length === 0) {
                    return securityService.changePassword($rootScope.loggedInUserObj.userId, $scope.credentials.oldPassword, $scope.credentials.newPassword)
                        .then(function (result) {
                            if (result.Status !== constants.SECURITY_STATUS_CODES.ChangePassword.OK) {
                                $scope.$apply(function () {
                                    $scope.formErrors = [{ 'msg': result.ErrorDetail }];
                                });
                            } else {
                                //Security risk in accessing the password in plain text
                                // and assigning it to root scope. Hence, code below is commented.
                                //$rootScope.password = $scope.credentials.newPassword;
                                $modalInstance.close(result);
                            }
                        });
                } else {
                    $scope.$apply(function () {
                        $scope.formErrors = result;
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].errorFiled && result[i].errorFiled.indexOf(constants.INPUT_FIELDS.CONFIRM) != -1) {
                                $scope.confirmNewPassword = '';
                                $scope.credentials.newPassword = '';
                            }
                            if (result[i].errorFiled && result[i].errorFiled.indexOf(constants.INPUT_FIELDS.NEW) != -1) {
                                $scope.credentials.newPassword = '';
                                $scope.confirmNewPassword = '';
                            }
                            if (result[i].errorFiled && result[i].errorFiled.indexOf(constants.INPUT_FIELDS.CURRENT) != -1) {
                                $scope.credentials.oldPassword = '';
                            }

                        }
                    });
                }
            });
    };

    $scope.ok = function () {
        validatePasswordChange();
    };

    $scope.close = function () {
        $modalInstance.dismiss();
    };
};
if (typeof module !== 'undefined') {
    module.exports = main;
}
if (typeof define === 'function') {
    define(main);
}