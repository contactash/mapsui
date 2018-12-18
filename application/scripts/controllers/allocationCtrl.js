function allocationCtrl($scope, allocationService, assessmentService, $uibModal, $rootScope, constants, commonService, config) {

    $scope.assessmentAllocations = [];

    var notToAllocateStates = ['Not Available', 'Allocated', 'Downloaded', 'Submitted', 'Submitted Incomplete'];

    $scope.allocate = function () {
        resetErrorMsg();
        if ($scope.selectedAllAlloc) {
            open('allocate');
        } else {
            doAllocate();
        }
    };

    $rootScope.$watch('staffNumber', function (newVal, oldVal) {
        if (($rootScope.staffNumber !== '') && ($rootScope.staffNumber !== undefined)) {
            // re evaluate selected states
            $scope.setClickedRowAlloc(null);
        } else {
            $scope.disableAllocate = true;
        }
    });

    function doAllocate() {
        $rootScope.lastSessionActivityTime = Date.now();
        var found = false;
        var assessmentAllocations = $scope.assessmentAllocations;

        function stateIsNotAllotable() {
            return notToAllocateStates.indexOf(commonService.parseStatus(assessmentAllocation.state)) != -1;
        }

        for (var i = 0; i < assessmentAllocations.length; i++) {
            var assessmentAllocation = assessmentAllocations[i];
            if (assessmentAllocation.selected === true && stateIsNotAllotable()) {
                found = true;
                assessmentAllocation.errorMessage = constants.ERROR_MAP["INVALID_STATE"];
            } else if (assessmentAllocation.selected === true) {
                assessmentAllocation.errorMessage = null;
            }
        }
        allocateSubmit();
    }

    function allocateSubmit() {

        var toAllocate = [];
        var assessmentAllocations = $scope.assessmentAllocations;
        for (var i = 0; i < assessmentAllocations.length; i++) {
            // which doesn't have error message and selected
            var assessmentAllocation = assessmentAllocations[i];
            if ((assessmentAllocation.selected === true) && (assessmentAllocation.errorMessage === null)) {
                toAllocate.push(assessmentAllocation);
            }
        }

        if (toAllocate.length == 0) return;
        allocationService.allocate(toAllocate)
            .then(allocationSuccess, allocationFailure);
    }

    function allocationSuccess(datas) {
        var _cnt = datas.length - 1;
        var FaultCodeArr = [];
        var assessmentAllocations = $scope.assessmentAllocations;
        for (var i = assessmentAllocations.length - 1; i >= 0; i--) {
            // if error message is not present - which is not submitted for allocation
            var assessmentAllocation = assessmentAllocations[i];
            if (assessmentAllocation.selected === true && (assessmentAllocation.errorMessage === null)) {
                var data = datas[_cnt];
                if (data.ResponseStatus === "0") {
                    // For Demo only - need to remove below 2 lines
                    if(config.DEV) {
                        assessmentAllocation.state = "Allocated";
                        assessmentAllocation.allocatedUserId = "12345678";
                    }
                    $rootScope.$emit('UpdateAllocations', { allocation: assessmentAllocation });
                    // remove
                    assessmentAllocations.splice(i, 1);

                } else {
                    if (["8000", "8001", "8002", "8003", "INVALID_STATE"].indexOf(data.FaultCode) !== -1) {
                        assessmentAllocation.errorMessage = constants.ERROR_MAP[data.FaultCode];
                    } else {
                        assessmentAllocation.errorMessage = constants.ERROR_MAP["UNKNOWN"];
                    }
                    FaultCodeArr.push({ Assessment: assessmentAllocation, ErrorCode: data });
                }
                _cnt--;
            }
        }

        // re evaluate selected states
        $scope.setClickedRowAlloc(null);

        // if no data
        if (assessmentAllocations.length === 0) {
            $scope.selectedAllAlloc = false;
            $scope.disableAllocate = true;
        }
    }

    function allocationFailure() {
        var assessmentAllocations = $scope.assessmentAllocations;
        for (var i = 0; i < assessmentAllocations.length; i++) {
            var assessmentAllocation = assessmentAllocations[i];
            if (assessmentAllocation.selected === true && (assessmentAllocation.errorMessage === null)) {
                assessmentAllocation.errorMessage = constants.ERROR_MAP["UNKNOWN"];
            }
        }
    }

    $scope.search = function () {
        $rootScope.lastSessionActivityTime = Date.now();
        resetErrorMsg();
        if (searchInputIsValid()) {
            assessmentService.searchAssessments($scope.searchClaimant, true).
            then(searchSuccess, searchFailure)
        }

        function searchSuccess(response) {

            var assessments = null,
                filtered = false,
                userLotIds = $rootScope.loggedInUserObj.lotIds.toString().replace(/Lot/g , "");

            if (response !== null) {
                assessments = [];
                for (var i = 0; i < response.length; i++) {
                    var assessmentProviderLotId = response[i].AssessmentProviderLotId;
                    if (assessmentProviderLotId && assessmentProviderLotId["#text"]) {
                        if (userLotIds.indexOf(assessmentProviderLotId["#text"]) != -1) {
                            assessments.push(response[i]);
                        } else {
                            filtered = true;
                        }
                    }
                }
            }

            if (assessments !== null && assessments.length > 0) {
                for (var k = 0; k < assessments.length; k++) {
                    // remove existing - toDo not preserving selected state
                    for (var j = $scope.assessmentAllocations.length - 1; j >= 0; j--) {
                        if (((assessments[k].NINO && assessments[k].NINO["#text"] && $scope.assessmentAllocations[j].ninoOrCrn === assessments[k].NINO["#text"]) || (assessments[k].CRN && assessments[k].CRN["#text"] && $scope.assessmentAllocations[j].ninoOrCrn === assessments[k].CRN["#text"]))) {
                            $scope.assessmentAllocations.splice(j, 1);
                        }
                    }
                }

                for (var l = 0; l < assessments.length; l++) {
                    if (assessments[l].NINO === null || assessments[l].NINO == undefined || ((assessments[l].NINO["#text"] === null) || (assessments[l].NINO["#text"] === "?") || (assessments[l].NINO["#text"] == undefined) || (assessments[l].NINO["#text"] === ""))) {
                        if (assessments[l].CRN && assessments[l].CRN["#text"])
                            assessments[l].ninoOrCrn = assessments[l].CRN["#text"];
                    } else {
                        if (assessments[l].NINO && assessments[l].NINO["#text"])
                            assessments[l].ninoOrCrn = assessments[l].NINO["#text"];
                    }
                    if (assessments[l].CreatedDateTime && assessments[l].CreatedDateTime["#text"])
                        assessments[l].caseCreated = assessments[l].CreatedDateTime["#text"];
                    if (assessments[l].State && assessments[l].State["#text"])
                        assessments[l].state = commonService.parseStatus(assessments[l].State["#text"]);
                    if (assessments[l].StateDateTime && assessments[l].StateDateTime["#text"])
                        assessments[l].stateDateTime = assessments[l].StateDateTime["#text"];
                    if (assessments[l].AllocatedUserId && assessments[l].AllocatedUserId["#text"])
                        assessments[l].allocatedUserId = assessments[l].AllocatedUserId["#text"];
                    if (assessments[l].AssessmentId && assessments[l].AssessmentId["#text"])
                        assessments[l].assessmentId = assessments[l].AssessmentId["#text"];
                    assessments[l].selected = false;

                    $scope.assessmentAllocations.push(assessments[l]);
                    init($scope.assessmentAllocations.length - 1);
                }

                $scope.setClickedRowAlloc(null);

            } else {
                $scope.assessmentsError = true;
                $scope.assessmentsErrorMsg = constants.NO_ASSESSMENTS_FOUND;
            }

            if (filtered) {
                $scope.assessmentsError = true;
                $scope.assessmentsErrorMsg = constants.LOT_PRIVILEGES;
            }
        }

        function searchFailure() {
            showTechnicalErrorMsg(constants.TECHNICAL_ERROR_MSG);
        }
    };

    function searchInputIsValid() {

        var regExp1 = /^[A-Z]{2}[0-9]{6}[A-Z]$/i;
        var regExp2 = /^[0-9]{1,18}$/;
        var _valid = regExp1.test($scope.searchClaimant) || regExp2.test($scope.searchClaimant);

        if (!_valid) {
            $scope.searchClaimantNotValid = true;
            $scope.claimantInputFormatMsg = constants.SEARCH_CLAIMANT_INPUT_FORMAT_MSG;
            return false;
        } else {
            return true;
        }

    }

    function showTechnicalErrorMsg(msg) {
        $scope.technicalError = true;
        $scope.technicalErrorMsg = msg;
    }

    function resetErrorMsg() {
        $scope.searchClaimantNotValid = false;
        $scope.assessmentsError = false;
        $scope.technicalError = false;
    }

    // reset variables
    $scope.selectedAllAlloc = false;
    $scope.disableAllocate = true;

    function init(index) {
        $scope.selectedAllAlloc = false;
        $scope.assessmentAllocations[index].selected = false;
    }

    $scope.setClickedRowAlloc = function (item) {
        $scope.disableAllocate = true;

        var index = -1;
        if (item !== null)
            index = $scope.assessmentAllocations.indexOf(item);

        // if no data
        if ($scope.assessmentAllocations.length === 0) {
            $scope.selectedAllAlloc = false;
            return;
        }

        // toggle status
        if (index !== -1) {
            $scope.assessmentAllocations[index].selected = !$scope.assessmentAllocations[index].selected;
            if ($scope.assessmentAllocations[index].selected === false) {
                $scope.selectedAllAlloc = false;
            }
        }

        // flag for if all selected
        var _selectedFlag = true;
        for (var i = 0; i < $scope.assessmentAllocations.length; i++) {
            if ($scope.assessmentAllocations[i].selected === false) {
                _selectedFlag = false;
            } else {

                if ($rootScope.staffNumber !== '' && $rootScope.staffNumber !== undefined) {
                    $scope.disableAllocate = false;
                }
            }
        }

        if (_selectedFlag) {
            $scope.selectedAllAlloc = true;
        }
    };

    // De-Select All button clicked
    $scope.selectAllAlloc = function () {

        // if no data
        if ($scope.assessmentAllocations.length == 0) {
            $scope.selectedAllAlloc = false;
            $scope.disableAllocate = true;
            return;
        }

        // toggle status
        $scope.selectedAllAlloc = !$scope.selectedAllAlloc;
        $scope.disableAllocate = true;

        if ($scope.selectedAllAlloc === false) {
            for (var i = 0; i < $scope.assessmentAllocations.length; i++) {
                $scope.assessmentAllocations[i].selected = false;
            }
        } else {
            for (var j = 0; j < $scope.assessmentAllocations.length; j++) {
                if ($rootScope.staffNumber !== '' && $rootScope.staffNumber !== undefined) {
                    $scope.disableAllocate = false;
                }
                $scope.assessmentAllocations[j].selected = true;
            }
        }
    };

    function open(task) {
        var message;
        this.task = task;
        switch (task) {
            case "allocate":
                message = constants.ALLOCATE_ALL.replace('#staffNumber', $rootScope.staffNumber);
                break;
            case "alreadyAllocated":
                message = constants.INVALID_STATE;
                break;
            case "8000":
                message = constants.ERROR_MAP['8000'];
                break;
            case "8001":
                message = constants.ERROR_MAP['8001'];
                break;
            case "8002":
                message = constants.ERROR_MAP['8002'];
                break;
            case "8003":
                message = constants.ERROR_MAP['8003'];
                break;
            default:
                message = constants.REMOVE_ALL;
        }

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modalDialog.html',
            controller: 'modalInstanceCtrl',
            resolve: {
                modalOptions: {
                    message: message,
                    hideCancel: false
                }
            }
        });

        modalInstance.result.then(function () {
            if (task === "allocate") {
                doAllocate();
            } else if (task === "alreadyAllocated") {
                // AC3.5.10 needs updated AC for multiple selection
            } else if (task === "remove") {
                removeSubmit();
            }
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    // remove selected
    function removeSubmit() {
        for (var i = $scope.assessmentAllocations.length - 1; i >= 0; i--) {
            if ($scope.assessmentAllocations[i].selected === true) {
                $scope.assessmentAllocations.splice(i, 1);
            }
        }

        // re evaluate selected states
        $scope.setClickedRowAlloc(null);
    }

    // remove
    $scope.remove = function () {
        resetErrorMsg();
        if ($scope.selectedAllAlloc === false) {
            var assessmentAllocations = $scope.assessmentAllocations;
            for (var i = 0; i < assessmentAllocations.length; i++) {
                if (assessmentAllocations[i].selected == true) {
                    removeSubmit();
                    break;
                }
            }
        } else {
            open('remove');
        }
    };
}

module.exports = allocationCtrl;