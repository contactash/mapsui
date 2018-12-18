describe('Controller: mapsUIApp.deAllocationCtrl', function () {

    // load the controller's module
    beforeEach(module('mapsUIApp'));

    var ctrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('deAllocationCtrl', {
            $scope: scope
        });
    }));

    it('should have "Select All" and "De-Allocate" buttons disabled when no rows are selected', function () {
        expect(ctrl).toBeDefined();
        expect(scope.disableSelectAll).toBe(true);
        expect(scope.disableDeAllocate).toBe(true);
    });
    
});
