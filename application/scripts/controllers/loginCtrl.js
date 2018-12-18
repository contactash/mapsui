function loginCtrl($rootScope) {
    var vm = this;
    vm.loginName = '';
    vm.lotIds = '';
    
    $rootScope.$watch('loggedInUserObj', function (newVal, oldVal) {
        vm.lotIds = $rootScope.loggedInUserObj.lotIds.toString().replace(/Lot/g , "");
        vm.loginName = $rootScope.loggedInUserObj.firstName + " " + $rootScope.loggedInUserObj.lastName;
    });   
}

module.exports = loginCtrl;
