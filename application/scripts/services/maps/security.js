var moment = require('moment');
var main = function (constants, config, syncPersistenceService, global, xmlService, xmlConstants, requestGenerator) {
    var faultActor = 'PIPOT';

    return {
        invoke: invoke,
        sendRequest: sendRequest,
        logError: logError,
        authenticate: authenticate,
        handleSecurityError: handleSecurityError,
        handleSecurityResponse: handleSecurityResponse
    };

    function invoke(userId, params, operationType) {
        if (operationType === 'authenticate') {
            return authenticate(userId, params.password);
        } else {
            return changePassword(userId, params.password, params.newPassword);
        }
    }

     function sendRequest(userId, url, data, operationType) {
        return new Promise(function (resolve, reject) {
            var ajax = new global.XMLHttpRequest();
            ajax.open('POST', url, true);

            ajax.onreadystatechange = function () {
                if (ajax.readyState === 4) {
                    if (ajax.status === 200) {
                        /*jshint -W024 */
                        resolve(handleSecurityResponse(ajax.responseText, userId, operationType));
                    } else {
                        /*jshint -W024 */
                        reject(handleSecurityError(ajax.responseText, operationType));
                    }
                }
            };
            ajax.send(data.xmlRequest);
        });
    }

    function logError(userId, operationType, faultString, faultDetails, pipotErrorCode) {
        syncPersistenceService.addSecurityLog(userId, operationType, faultActor, faultString, faultDetails, pipotErrorCode);
    }

    function handleSecurityResponse(response, userId, operationType) {

        function getExpiryDateString(date) {
            return date.toString().trim().toLowerCase();
        }

        try {
            var result = {},
                operationQuery = operationType === 'authenticate' ? 'RequestedSecurityToken' : 'ChangePasswordResponse',
                xmlDoc = xmlService.getXMLDoc(response);

            if (operationType === 'authenticate') {
                var xmlDate = xmlService.getNodeValues(xmlDoc, xmlConstants.PASSWORD_EXPIRY_DATE),
                    DATE_FORMAT = "DD/MM/YYYY";
                if(getExpiryDateString(xmlDate) === 'never') {
                    //if date is 'never' set it as 1 year in the future
                    xmlDate = moment().add(1, 'y').format(DATE_FORMAT);
                }

                var parsedDate = moment(xmlDate, DATE_FORMAT);
                result.passwordExpiryDate = parsedDate.unix() * 1000;
                result.userFirstName = xmlService.getNodeValues(xmlDoc, xmlConstants.GIVEN_NAME);
                result.userLastName = xmlService.getNodeValues(xmlDoc, xmlConstants.LAST_NAME);
                result.lotIds = xmlService.getNodeValues(xmlDoc, xmlConstants.MAPS_LOT);
                result.roles = xmlService.getNodeValues(xmlDoc, xmlConstants.MAPS_ROLE);
            }

            /* If the operation type is authenticate, operationValue will be the token.
             If the operation type is 'changepassword', operationValue will not have a result*/
            result.operationValue = xmlService.getOperationValue(xmlDoc, operationQuery);
            return result;
        } catch (error) {
            logError(userId,operationType, error, response);
            console.error("Error in handling the security response "+ error);
            return error;
        }
    }

    function prepareError(status, faultCode) {
        return { status : status, faultCode : faultCode };
    }

    function handleSecurityError(errorResponse, operationType) {
        var errorObj = {};
        const login = constants.SECURITY_STATUS_CODES.Login;
        const password = constants.SECURITY_STATUS_CODES.ChangePassword;
        if (errorResponse) {
            try {
                var querySelect = 'Subcode',
                    xmlPayload = errorResponse.replace(/(\r\n|\n|\r)/gm, "").replace(/\t/g, ''),
                    xmlDoc = xmlService.getXMLDoc(xmlPayload),
                    faultCode = xmlDoc.querySelector(querySelect).querySelector('Value').innerHTML;

                if (faultCode === undefined) {
                    faultCode = xmlDoc.querySelector(querySelect).querySelector('Value').childNodes[0].nodeValue;
                }
                switch (faultCode) {
                    case 'data:525':
                        errorObj = prepareError(login.INVALID_CREDENTIALS, null);
                        break;
                    case 'data:52e':
                        errorObj = prepareError(login.INVALID_CREDENTIALS, null);
                        break;
                    default:
                        errorObj.status = operationType === 'authenticate' ? login.NO_RESPONSE : password.NO_RESPONSE;
                        errorObj.faultCode =  faultCode;
                        break;
                }
                return errorObj;
            } catch (err) {
                errorObj.status = operationType === 'authenticate' ? login.NO_RESPONSE : password.NO_RESPONSE;
                return errorObj;
            }
        }

        var status = operationType === 'authenticate' ? login.UNKNOWN_FAILURE : password.UNKNOWN_FAILURE;

        return {
            status: status,
            faultCode : faultCode
        };
    }

    function authenticate(userId, password) {
        var operationType = 'authenticate';
        return new Promise(function (resolve, reject) {
            return sendRequest(userId, config.AUTH, {
                    'xmlRequest': requestGenerator.generateAuthRequest(userId, password)
                }, operationType)
                .then(function (authResponse) {
                    if (authResponse) {
                        resolve({
                            Status: constants.SECURITY_STATUS_CODES.Login.OK,
                            Token: authResponse.operationValue,
                            FirstName: authResponse.userFirstName,
                            LastName: authResponse.userLastName,
                            PasswordExpiryDate: authResponse.passwordExpiryDate,
                            LotIDs: authResponse.lotIds,
                            Roles: authResponse.roles
                        });
                    }
                }, function authenticationFailure(e) {
                    logError(userId, operationType, e.ErrorDetail, e.FaultString, e.ErrCode);
                    reject(e);
                })
                /*jshint -W024 */
                .catch(function (e) {
                    logError(userId, operationType, e.ErrorDetail, e.FaultString, e.ErrCode);
                    reject(e);
                });
        });
    }

    function changePassword(username, password, newPassword) {
        var operationType = 'changepassword';
        return new Promise(function (resolve, reject) {
            var promise;
            if (config.NO_AUTH === true) {
                promise = Promise.resolve({Status: constants.SECURITY_STATUS_CODES.ChangePassword.OK, ErrorDetail: '' });
            } else {
                promise = sendRequest(username, config.CHANGE_PASSWORD,
                    { 'xmlRequest': requestGenerator.generateChangePasswordRequest(username, password, newPassword) }, operationType);
            }
            return promise
                .then(function (changePasswordResponse) {
                    resolve({Status: constants.SECURITY_STATUS_CODES.ChangePassword.OK, ErrorDetail: '' });
                }, function failChangePassword(error) {
                    reject({ Status: constants.SECURITY_STATUS_CODES.ChangePassword.NO_RESPONSE, ErrorDetail: 'Operation has failed due an IT problem, please try again or contact your help desk.' });
                })
                /*jshint -W024 */
                .catch(function (e) {
                    logError(username, operationType, 'Change Password response not received', 'For PIPOT change password request for user ' + username, 'PERR22');
                    reject({ Status: constants.SECURITY_STATUS_CODES.ChangePassword.NO_RESPONSE, ErrorDetail: 'Operation has failed due an IT problem, please try again or contact your help desk.' });
                });
        });
    }

};
if (typeof module !== 'undefined') {
    module.exports = main;
}
if (typeof define === 'function') {
    define(main);
}
