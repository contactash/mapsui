function requestService() {

    return {
        createRequestToGetAssessments : createRequestToGetAssessments,
        allocateAssessment : allocateAssessment,
        deallocateAssessment : deallocateAssessment
    };

    function createRequestToGetAssessments(staffNumber, now, userId, ipAddress) {
        return {
            "soap:Body": {
                "uk:MAPSAssessmentMetadataDetailListRequest": {
                    "uk:MAPSOpsRequestHeader": {
                        "uk:ClientRequestId": staffNumber,
                        "uk:UserId": userId,
                        "uk:Benefit": "PIP",
                        "uk:Operation": "GetAssessmentMetadata",
                        "uk:IPAddress": ipAddress,
                        "uk:HostName": window.location.hostname,
                        "uk:RequestDateTime": now
                    },
                    "uk:MAPSAssessmentMetadataDetailListRequestBody": {
                    }
                }
            }
        };
    }

    function allocateAssessment(allocation, userId, ipAddress, now, staffNumber) {
        var assessmentId = allocation.AssessmentId["#text"],
            assessmentProviderLotId = allocation.AssessmentProviderLotId["#text"];

        return {
            "soap:Body": {
                "uk:MAPSAllocateUserRequest": {
                    "uk:MAPSOpsRequestHeader": {
                        "uk:ClientRequestId": assessmentId,
                        "uk:UserId": userId,
                        "uk:Benefit": "PIP",
                        "uk:Operation": "Allocate",
                        "uk:IPAddress": ipAddress,
                        "uk:HostName": window.location.hostname,
                        "uk:RequestDateTime": now
                    },
                    "uk:MAPSAllocateUserRequestBody": {
                        "uk:UserToBeAllocated": staffNumber,
                        "uk:Benefit": "PIP",
                        "uk:AssessmentId": assessmentId,
                        "uk:AssessmentProviderLotId": assessmentProviderLotId,
                        "uk:AppointmentDateTime": now
                    }
                }
            }
        };
    }

    function deallocateAssessment(assessment, userId, ipAddress, now) {
        var assessmentId = assessment.AssessmentId['#text'],
            assessmentProviderLotId = assessment.AssessmentProviderLotId["#text"];

        return {
            "soap:Body": {
                "uk:MAPSDeallocateUserRequest": {
                    "uk:MAPSOpsRequestHeader": {
                        "uk:ClientRequestId": assessmentId,
                        "uk:UserId": userId,
                        "uk:Benefit": "PIP",
                        "uk:Operation": "Deallocate",
                        "uk:IPAddress": ipAddress,
                        "uk:HostName": window.location.hostname,
                        "uk:RequestDateTime": now
                    },
                    "uk:MAPSDeallocateUserRequestBody": {
                        "uk:AssessmentId": assessmentId,
                        "uk:AssessmentProviderLotId": assessmentProviderLotId
                    }
                }
            }
        };
    }

}

module.exports = requestService;