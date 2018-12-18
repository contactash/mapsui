function config() {

    return {
        "URL" : "http://localhost:8080/mapsmock/mock",
        "SEARCH_ASSESSMENTS_PATH" : "MAPSAssessmentMetadataDetailListBinding",
        "DEALLOCATE_ALLOCATIONS_PATH" : "MAPSAllocateDeallocateUserBinding",
        "SEARCH_CLAIMANTS_PATH" : "MAPSAssessmentMetadataDetailListBinding",
        "ALLOCATE_ASSESSMENT_PATH": "MAPSAllocateDeallocateUserBinding",
        "AUTH2": "http://localhost:8090/mockSecurityTokenServiceSoapBinding",
        "CHANGE_PASSWORD2": "http://localhost:8090/mockwsHttpEndpoint",
        "AUTH": "http://localhost:8081/requestsecuritytoken",
        "CHANGE_PASSWORD": "http://localhost:8081/changepassword",
        "AUTH3": "http://localhost:8090/authentication/mockSecurityTokenServiceSoapBinding",
        "CHANGE_PASSWORD3": "http://localhost:8090/passwordchangeservice/mockwsHttpEndpoint",
        "SYNC_DB_VERSION" : "1",
        "TECHNICAL_EXCEPTION_LOG_LIMIT": "1000",
        "SESSION_TIMEOUT": 5400000,
        "DEV" : true,
        "NO_AUTH" : true,
        "PASSWORD_EXPIRY": {
            "MIN": 2,
            "MAX": 14
        }

    }
}
module.exports = config;
