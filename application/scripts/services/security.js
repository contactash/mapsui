var main = function ($rootScope, config, constants, securityMapsService, encryption) {
    function encodeSpecialCharacters(password) {
    //encode special characters in new password
        password = password.split('&').join('&amp;');
        password = password.split('<').join('&lt;');
        password = password.split('>').join('&gt;');
        password = password.split("'").join('&apos;');
        password = password.split('"').join('&quot;');
        return password;
    }

    var loginConfig = constants.SECURITY_STATUS_CODES.Login,

    lockUserAccount = function (username) {
      return true;
    },
    storeLoggedInUserDetails = function (userId) {
      $rootScope.username = userId;
    },
    getUserToken = function (username) {
      return null;
    },
    validateResponse = function (username, authenticationResult) {
      var isValid = (authenticationResult && authenticationResult.Status) ? true: false;
      return Promise.resolve()
        .then(function () {
          if (isValid) {
            if (authenticationResult.Status === loginConfig.EXCEEDED_MAX_NO_OF_ATTEMPTS) {
              // locking in case user switches from online to offline or vice versa so we retain a lock status:
              return lockUserAccount(username)
                .then(function () {
                  isValid = false;
                });
            }
            isValid = [loginConfig.OK, loginConfig.PASSWORD_DUE_TO_EXPIRE].indexOf(authenticationResult.Status) >= 0;
          }
          return isValid;
        })
    },
    doOnlineAuthentication = function (username, password) {
      var authenticationResult, promise, hoursOfValidity;
      if (config.NO_AUTH === true) {
        // "today" brings up the change password prompt
        // "soon" brings up the password changes soon prompt
        // otherwise 30 days of validity
        hoursOfValidity = password === 'today' ? 12 : password === 'soon' ? 72 : 24 * 30;
        $rootScope.loggedInUserObj.userId = username;
        $rootScope.loggedInUserObj.firstName = username;
        promise = Promise.resolve({
          Status: constants.SECURITY_STATUS_CODES.Login.OK,
          Token: '',
          FirstName: username,
          LastName: '',
          PasswordExpiryDate: Date.now() + 1000 * 60 * 60 * hoursOfValidity,
          LotIDs: ['1'],
          Roles: ['Allocate']
        });
      } else {
        promise = securityMapsService.invoke(username, { password: encodeSpecialCharacters(password) }, 'authenticate');
      }

      return promise.then(function (tempAuthenticationResult) {
        authenticationResult = tempAuthenticationResult;
        return validateResponse(username, authenticationResult);
      })
        .then(function (isValid) {
          if (isValid) {
            return encryption.hash(password)
              .then(function (hashedPassword) {
                storeLoggedInUserDetails(username);
                $rootScope.loggedInUserObj =
                {
                  user: username,
                  userId: username,
                  password: hashedPassword,
                  loginAttempts: 0,
                  lockedStatus: false,
                  lastAccessTime: Date.now(),
                  token: authenticationResult.Token,
                  firstName: authenticationResult.FirstName,
                  lastName: authenticationResult.LastName,
                  passwordExpiryDate: authenticationResult.PasswordExpiryDate,
                  lotIds: authenticationResult.LotIDs,
                  roles: authenticationResult.Roles
                };
                return $rootScope.loggedInUserObj;
              })
              .then(function () {
                return {
                  Status: loginConfig.OK,
                  passwordExpiryReminder: authenticationResult.Status === loginConfig.PASSWORD_DUE_TO_EXPIRE,
                  passwordExpiryDate: authenticationResult.PasswordExpiryDate
                };
              });
          }
          return { 'Status': authenticationResult.Status };
        })
      /*jshint -W024 */
        .catch(function (e) {
          return e;
        });
    },
    authenticate = function (username, password) {
      return doOnlineAuthentication(username, password);
    },
    changePassword = function (username, oldPassword, newPassword) {
      oldPassword = encodeSpecialCharacters(oldPassword);
      newPassword = encodeSpecialCharacters(newPassword);
      return securityMapsService.invoke(username, { password: oldPassword, newPassword: newPassword }, 'changepassword')
        .then(function (result) {
          if (result) {
            // store new password:
            
            return encryption.hash(newPassword)
              .then(function (hashedNewPassword) {
                $rootScope.loggedInUserObj.user = username;
                $rootScope.loggedInUserObj.password = hashedNewPassword;
                return $rootScope.loggedInUserObj;
              })
              .then(function () {
                return result;
              });
          }
          return result;
        })
        /*jshint -W024 */
        .catch(function (e) {
          return e;
        });
    };

  return {
    authenticate: authenticate,
    changePassword: changePassword,
    getUserToken: getUserToken
    //performLogout: performLogout
  };
};
if (typeof module !== 'undefined') {
  module.exports = main;
}
if (typeof define === 'function') {
  define(main);
}
