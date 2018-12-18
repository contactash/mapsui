function config() {

    return {
        "URL" : "https://mapsservice.dwp.gov.uk/cxf/",
        "SEARCH_ASSESSMENTS_PATH" : "getAssessmentMetadataDetailList",
        "DEALLOCATE_ALLOCATIONS_PATH" : "allocate",
        "SEARCH_CLAIMANTS_PATH" : "getAssessmentMetadataDetailList",
        "ALLOCATE_ASSESSMENT_PATH": "allocate",
        "AUTH" : "https://stsproxy.dwp.gov.uk/adfs/services/trust/13/usernamemixed",
        "CHANGE_PASSWORD" : "https://passwordchange.dwp.gov.uk/PasswordChangeService/PasswordChangeService.svc",
        "SYNC_DB_VERSION" : "1",
        "TECHNICAL_EXCEPTION_LOG_LIMIT": "1000",
        "SESSION_TIMEOUT": 5400000,
        "NO_AUTH" : false,
        "PASSWORD_EXPIRY": {
            "MIN": 2,
            "MAX": 14
        }
    }

}
module.exports = config;
