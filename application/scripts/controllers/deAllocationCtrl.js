function deAllocationCtrl($scope, deAllocationService, assessmentService, $uibModal, constants, $rootScope, commonService, config) {
    "use strict";

    $scope.disableSelectAll = true;
    $scope.disableDeAllocate = true;

    function getMessage(task) {
        var message;
        var soapFaultMsgFor = constants.ERROR_MAP;
        switch (task) {
            case "confirmation":
                message = constants.DE_ALLOCATION_CONFIRMATION;
                break;
            case "deAllocate":
                message = constants.DOWNLOADED_CONFIRMATION;
                break;
            case "9001":
                message = soapFaultMsgFor['9001'];
                break;
        }
        return message;
    }

    function displayPopupMessage(task, hideCancel) {
        var message = getMessage(task);

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modalDialog.html',
            controller: 'modalInstanceCtrl',
            resolve: {
                modalOptions: {
                    message: message,
                    hideCancel: hideCancel
                }
            }
        });

        modalInstance.result.then(function () {
            if (task === 'confirmation') {
                var found = false;

                $scope.allocations.forEach(function (allocation) {
                    if (!found) {
                        if ((allocation.state === "Downloaded") &&
                            (allocation.selected === true)) {
                            found = true;
                        }
                    }
                }, this);

                if (found) {
                    displayPopupMessage('deAllocate');
                } else {
                    $scope.deAllocateSubmit();
                }
            } else {
                $scope.deAllocateSubmit();
            }

        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.deAllocate = function () {
        displayPopupMessage('confirmation');
    };

    $scope.deAllocateSubmit = function () {
        $rootScope.lastSessionActivityTime = Date.now();
        resetErrorMsg();

        var toDeAllocate = [];
        var allocations = $scope.allocations;
        for (var i = 0; i < allocations.length; i++) {
            var allocation = allocations[i];
            if (allocation.selected == true) {
                toDeAllocate.push(allocation);
            }
        }

        deAllocationService.deAllocate(toDeAllocate)
            .then(deAllocationSuccess, deAllocationFailure);

        function handleSoapFaults(faultCode, index, allocation) {
            if (faultCode === "9001") {
                displayPopupMessage('9001', true);
                $scope.allocations.splice(index, 1);
                //if no more rows
                if ($scope.allocations.length === 0) {
                    displayMessageAndDisableButtons();
                }
            } else {
                var errorMap = constants.ERROR_MAP;
                if ((faultCode === "9002")) {
                    allocation.errorMessage = errorMap["9002"];
                } else if ((faultCode === "9003")) {
                    allocation.errorMessage = errorMap["9003"];
                } else {
                    // all others
                    allocation.errorMessage = errorMap["UNKNOWN"];
                }
            }
        }

        function deAllocationSuccess(responses) {
            var _cnt = responses.length - 1;
            for (var i = allocations.length - 1; i >= 0; i--) {
                var allocation = allocations[i];
                if (allocation.selected === true) {
                    var faultCode = responses[_cnt].FaultCode;
                    if (faultCode !== null) {
                        handleSoapFaults(faultCode, i, allocation);
                    } else {
                        allocations.splice(i, 1);
                        //if no more rows
                        if (allocations.length === 0) {
                            displayMessageAndDisableButtons();
                        }
                    }
                    _cnt--;
                }

            }
        }

        function deAllocationFailure() {
            for (var i = 0; i < allocations.length; i++) {
                var allocation = allocations[i];
                if (allocation.selected === true) {
                    allocation.errorMessage = constants.ERROR_MAP["UNKNOWN"];
                }
            }
        }
    };

    $scope.getAllocations = function (reloading) {
        $rootScope.lastSessionActivityTime = Date.now();
        $scope.allocations = [];
        if (!reloading)
            $scope.staffNumber = $rootScope.staffNumber = '';
        resetErrorMsg();
        $scope.disableDeAllocate = true;
        if (searchInputIsValid()) {
            if (!reloading)
                $scope.staffNumber = $rootScope.staffNumber = $scope.searchHP;

            assessmentService.searchAssessments($scope.staffNumber, false)
                .then(getAllocationsSuccess, getAllocationsFailure);
        }

        function getAllocationsSuccess(data) {
            resetAll();
            if (data === null) {
                displayMessageAndDisableButtons();
            } else {
                var privilegeViolation = false,
                    allocations = [],
                    userLotIds = $rootScope.loggedInUserObj.lotIds.toString().replace(/Lot/g , "");
                for (var i = 0; i < data.length; i++) {
                    var assessmentProviderLotId = data[i].AssessmentProviderLotId;
                    if (assessmentProviderLotId && assessmentProviderLotId["#text"]) {
                        if (userLotIds.indexOf(assessmentProviderLotId["#text"]) != -1) {
                            allocations.push(data[i]);
                            console.log(userLotIds + "<<:>>" + (assessmentProviderLotId["#text"]));
                        } else {
                            privilegeViolation = true;
                        }
                    }
                }

                if (allocations != null && allocations.length > 0) {
                    $scope.allocations = allocations;
                    $scope.noAllocations = false;
                    $scope.disableSelectAll = false;

                    for (var j = 0; j < allocations.length; j++) {
                        var allocation = allocations[j];
                        if (allocation.AssessmentId && allocation.AssessmentId["#text"])
                            allocation.assessmentId = allocation.AssessmentId["#text"];
                        if (allocation.State && allocation.State["#text"])
                            allocation.state = commonService.parseStatus(allocation.State["#text"]);
                        if (allocation.AllocatedDateTime && allocation.AllocatedDateTime["#text"])
                            allocation.allocatedDateTime = allocation.AllocatedDateTime["#text"];
                        if (allocation.AllocatedUserId && allocation.AllocatedUserId["#text"])
                            allocation.allocatedUserId = allocation.AllocatedUserId["#text"];
                        if (allocation.AllocatingUserId && allocation.AllocatingUserId["#text"])
                            allocation.allocatingUserId = allocation.AllocatingUserId["#text"];
                        if (allocation.NINO == null || allocation.NINO == undefined || ((allocation.NINO["#text"] == null) || (allocation.NINO["#text"] == "?") || (allocation.NINO["#text"] == undefined) || (allocation.NINO["#text"] == ""))) {
                            if (allocation.CRN && allocation.CRN["#text"])
                                allocation.ninoOrCrn = allocation.CRN["#text"];
                        } else {
                            if (allocation.NINO && allocation.NINO["#text"])
                                allocation.ninoOrCrn = allocation.NINO["#text"];
                        }
                        allocation.selected = false;
                        init($scope.allocations.length - 1);
                    }

                }
            }
            if (privilegeViolation) {
                showPrivilegesErrorMsg();
            }
        }
        function getAllocationsFailure() {
            resetAll();
            showTechnicalErrorMsg();
            $scope.staffNumber = $rootScope.staffNumber = '';
        }
    };

    function searchInputIsValid() {
        // only 8 numbers
        var regExp = /^[0-9]{8}$/,
            _valid = regExp.test($scope.searchHP);
        if (!_valid) {
            $scope.searchInputNotValid = true;
            $scope.healthSearchInputFormatMsg = constants.SEARCH_INPUT_FORMAT_MSG;
            return false;
        } else {
            return true;
        }
    }

    function resetErrorMsg() {
        $scope.searchInputNotValid = false;
        $scope.technicalError = false;
        $scope.privilegesError = false;
    }

    function showTechnicalErrorMsg() {
        $scope.technicalError = true;
        $scope.technicalErrorMsg = constants.TECHNICAL_ERROR_MSG;
    }

    function showPrivilegesErrorMsg() {
        $scope.privilegesError = true;
        $scope.privilegesErrorMsg = constants.PRIVILEGES_ERROR_MSG;
    }

    // Listen for the event
    $rootScope.$on('UpdateAllocations', function (event, args) {
        $rootScope.lastSessionActivityTime = Date.now();
        if (!$scope.allocations) {
            $scope.noAllocations = false;
            $scope.allocations = [];
            resetAll();
        }
        // for connecting to real service - uncomment
        if (config.DEV) {
            args.allocation.selected = false;
            var allocations = $scope.allocations;
            allocations.push(args.allocation);
        } else {
            $scope.getAllocations(true);
        }
    });

    // when data set, reset variables
    function resetAll() {
        $scope.selectedAllDeAlloc = false;
    }

    function init(index) {
        $scope.selectedAllDeAlloc = false;
        $scope.allocations[index].selected = false;
    }

    $scope.setClickedRowDeAlloc = function (item) {

        var index = -1;
        var allocations = $scope.allocations;
        if (item != null)
            index = allocations.indexOf(item);

        // toggle status
        var allocation = allocations[index];
        allocation.selected = !allocation.selected;

        if (allocation.selected === false) {
            $scope.selectedAllDeAlloc = false;
        }

        // flag for if all selected
        var _selectedFlag = true;
        for (var i = 0; i < allocations.length; i++) {
            if (allocations[i].selected === false) {
                _selectedFlag = false;
                break;
            }
        }

        if (_selectedFlag) {
            $scope.selectedAllDeAlloc = true;
        }
        toggleDeAllocateButton();
    };

    // De-Select All button clicked
    $scope.selectAllDeAlloc = function () {

        // toggle status
        $scope.selectedAllDeAlloc = !$scope.selectedAllDeAlloc;

        if ($scope.selectedAllDeAlloc === false) {
            selectAllAllocations(false);
        } else {
            selectAllAllocations(true);
        }

        toggleDeAllocateButton();
    };

    function selectAllAllocations(selected) {
        var allocations = $scope.allocations;
        for (var i = 0; i < allocations.length; i++) {
            allocations[i].selected = selected;
        }
    }

    function toggleDeAllocateButton() {
        var allocations = $scope.allocations;
        for (var j = 0, x = allocations.length; j < x; j++) {
            if (allocations[j].selected === false) {
                $scope.disableDeAllocate = true;
            } else {
                $scope.disableDeAllocate = false;
                return;
            }
        }
    }

    function displayMessageAndDisableButtons() {
        $scope.disableSelectAll = true;
        $scope.disableDeAllocate = true;
        $scope.noAllocations = true;
        $scope.noAllocationsMsg = constants.NO_ASSESSMENTS_ALLOCATED;
    }
}

module.exports = deAllocationCtrl;