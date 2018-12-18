// This is a parent controller and is reused by allocation and de-allocation controllers
function accessibilityCtrl($scope) {

    $scope.sortType = 'ninoOrCrn'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order

    $scope.onKeyPress = function (event, sortType) {
        if (event.keyCode == 32 || event.keyCode == 13) {
            $scope.sortType = sortType;
            $scope.sortReverse = !$scope.sortReverse;
        }
    };
}

module.exports = accessibilityCtrl;