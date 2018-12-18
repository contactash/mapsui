function logger($rootScope, syncPersistenceService) {

    return {
        addErrorLog : addErrorLog
    };

    function addErrorLog(error, faultString, requestJson, operationType, staffNumber, crn, assessmentId) {

        crn = crn || "NA";
        assessmentId = assessmentId || "NA";
        staffNumber = staffNumber || "NA";
        var userId = $rootScope.loggedInUserObj.userId,
            faultActor = 'MAPS UI',
            faultDetails = "Response Status "+ error.status +" was received from MAPS after a  request was sent from the user '"+ $rootScope.loggedInUserObj.userId+"'. The request message details were - "+ JSON.stringify(requestJson);

        syncPersistenceService.addLogEntry(userId, operationType, faultActor, staffNumber, crn, assessmentId, faultString, faultDetails);
    }

}

module.exports = logger;