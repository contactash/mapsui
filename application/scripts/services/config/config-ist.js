function config() {

    return {
        "URL" : "http://172.17.105.212:8181/cxf/",
        "SEARCH_ASSESSMENTS_PATH" : "getAssessmentMetadataDetailList",
        "DEALLOCATE_ALLOCATIONS_PATH" : "allocate",
        "SEARCH_CLAIMANTS_PATH" : "getAssessmentMetadataDetailList",
        "ALLOCATE_ASSESSMENT_PATH": "allocate",
        "SYNC_DB_VERSION" : "1",
        "TECHNICAL_EXCEPTION_LOG_LIMIT": "1000",
        "SESSION_TIMEOUT": 5400000,
        "NO_AUTH" : true,
        "PASSWORD_EXPIRY": {
            "MIN": 2,
            "MAX": 14
        }
    }

}
module.exports = config;
