var main = function (encryption, _, constants) {
  var errors = [], 
    checkAllFieldsEntered = function (oldPassword, newPassword, confirmNewPassword) {
      return !_.isEmpty(oldPassword) && !_.isEmpty(newPassword) && !_.isEmpty(confirmNewPassword);
    },
    validatePasswordString = function (passwordString, label, errorField) {
      if (passwordString) {
        if (passwordString.toLowerCase().indexOf('password') !== -1) {
          errors.push({'msg': label + " Password cannot contain the word 'password'", 'errorFiled': [errorField]});
        }

        if (passwordString.length < 12) {
          errors.push({'msg': " Invalid user name or password entered.", 'errorFiled': [errorField]});
        }
      } else {
        errors.push({'msg': label + ' Password is required', 'errorFiled': [errorField]});
      }
    },
    validatePasswords = function (storedPassword, oldPassword, newPassword, confirmNewPassword) {
      var allFieldsEntered = checkAllFieldsEntered(oldPassword, newPassword, confirmNewPassword);
      errors = [];
      return Promise.resolve()
        .then(function () {
          if (allFieldsEntered) {
            return encryption.hash(oldPassword)
              .then(function (hashedOldPassword) {
                if (hashedOldPassword !== storedPassword) {
                  errors.push({'msg': 'Current password incorrect, please try again.', 'errorFiled': [constants.INPUT_FIELDS.CURRENT]});
                }
                if (oldPassword === newPassword) {
                  errors.push({'msg': 'New Password cannot be the same as the Current Password', 'errorFiled': [constants.INPUT_FIELDS.CURRENT, constants.INPUT_FIELDS.NEW]});
                }
                if (newPassword !== confirmNewPassword) {
                  errors.push({'msg': 'New Password and Confirm Password do not match', 'errorFiled': [constants.INPUT_FIELDS.NEW, constants.INPUT_FIELDS.CONFIRM]});
                }
                validatePasswordString(newPassword, 'New', constants.INPUT_FIELDS.NEW);
              });
          } else {
            errors.push({'msg': 'All fields must be entered.'});
          }
        })
        .then(function() {
          return errors;
        });
    };

  return {
    validatePasswords: validatePasswords
  };
};
if (typeof module !== 'undefined') {
  module.exports = main;
}
if (typeof define === 'function') {
  define(main);
}
