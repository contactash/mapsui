function constants() {
    "use strict";

    return {
        "DE_ALLOCATION_CONFIRMATION": "You have chosen to de-allocate the selected assessments from the health professional. Do you wish to proceed?",
        "DOWNLOADED_CONFIRMATION": "At least one assessment has been downloaded but not yet submitted. If you deallocate you will lose any report data held in PIPAT Mobile. Are you sure you want to deallocate?",
        "TECHNICAL_ERROR_MSG": "Operation has failed due an IT problem, please try again or contact your help desk.",
        "PRIVILEGES_ERROR_MSG": "You do not have sufficient privileges to view the assessment(s) allocated to this health professional.",
        "SEARCH_INPUT_FORMAT_MSG": "Incorrect format. Health Professional's unique ID's are numerical and require eight digits. Please try again.",
        "SEARCH_CLAIMANT_INPUT_FORMAT_MSG": "Entry is in an invalid format. Please check and try again.",
        "NO_ASSESSMENTS_FOUND" : "No assessment has been found that matches your search.",
        "NO_ASSESSMENTS_ALLOCATED" : "This health professional does not currently have any assessments allocated to them.",
        "ALLOCATE_ALL" : "You are about to allocate all the assessments to #staffNumber. Are you sure?",
        "REMOVE_ALL": "You are about to remove all assessments from the Allocation table. Are you sure?",
        "LOT_PRIVILEGES": "You do not hold the correct LOT privileges to search for this assessment.",
        "INPUT_FIELDS" : {
            "CURRENT" : "CURRENT",
            "NEW" : "NEW",
            "CONFIRM" : "CONFIRM"
        } ,
        "ERROR_MAP": {
            "8000": "Unable to allocate assessment(s) as either the chosen Health Professional's user number is invalid or LOT ID's do not match.",
            "8001": "Operation has failed due an IT problem, please try again or contact your help desk.",
            "8002": "This assessment is no longer available for allocation.",
            "8003": "You cannot allocate this assessment to the chosen health professional as their LOT ID's do not match.",
            "UNKNOWN": "Operation has failed due an IT problem, please try again or contact your help desk.",
            "INVALID_STATE": "You cannot allocate this assessment as it does not have a status of 'Available'",
            "9000": "Assessment does not exists in MAPS.",
            "9001": "You cannot de-allocate this assessment as it has already been de-allocated. It will now be removed from this table.",
            "9002": "Assessment Lot does not match the request.",
            "9003": "De-Allocate failed to Unlock Assessment on PIPAT."
        },
        SECURITY_STATUS_CODES: {
            Login: {
                OK: '0',
                NO_RESPONSE: 'PERR10',
                PASSWORD_DUE_TO_EXPIRE: 'PERR21',
                INVALID_CREDENTIALS: 'PERR11',
                EXCEEDED_MAX_NO_OF_ATTEMPTS: 'PERR20',
                PASSWORD_EXPIRED: 'PERR12',
                UNKNOWN_FAILURE: 'PERR13',
                OFFLINE_NO_CREDENTIALS: 'OFFLINE_NO_CREDENTIALS',
                REDIRECT_TO_LOGIN: 'REDIRECT_TO_LOGIN'
            },
            ChangePassword: {
                OK: '0',
                NO_RESPONSE: 'PERR22',
                FAILED: 'PERR22',
                UNKNOWN_FAILURE: 'PERR22',
                REDIRECT_TO_LOGIN: 'REDIRECT_TO_LOGIN'
            }
        }
    }
}

module.exports = constants;
