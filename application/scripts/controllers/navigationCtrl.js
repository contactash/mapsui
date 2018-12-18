function navigationCtrl($scope, $location, $anchorScroll, $rootScope) {
    $scope.scrollTo = function (id) {
        $location.hash(id);
        $anchorScroll();
    };
    
    $rootScope.$on('UpdateAllocations', function (event, args) {
        $scope.scrollTo('deAllocate');
 	});
}

module.exports = navigationCtrl;
