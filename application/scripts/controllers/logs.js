function logs($scope, $rootScope, syncPersistenceService, _, $timeout, $location) {
    $scope.deleteItem = function (key) {
        syncPersistenceService.deleteLogEntry($rootScope.loggedInUserId, key)
            .then(function (result) {
                $timeout(function () {
                    //remove item from $scope.logs
                    _.remove($scope.logs,{key:result});
                });
            });
    };
    $scope.deleteAll = function () {
        syncPersistenceService.purgeAllLogEntries($rootScope.loggedInUserId)
            .then(function () {
                $timeout(function () {
                    $scope.logs = [];
                });
            });
    };
    $scope.reloadLogs = function () {
        syncPersistenceService.getLogs($rootScope.loggedInUserId)
            .then(function (logs) {
                $timeout(function () {
                    $scope.logs = logs;
                });
            });
    };

    if ($rootScope.loggedInUserId) {
        $scope.reloadLogs();
    } else {
        $location.path('/login');
    }
}

module.exports =logs;