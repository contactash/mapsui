describe("logs controller", function () {

    // load the controller's module
    beforeEach(module('mapsUIApp'));

    var scope,
        rootScope,
        location;

    // Initialize the controller and a mock scope
    function initController(loggedInUserId) {
        inject(function ($controller, $rootScope, $location) {
            scope = $rootScope.$new();
            location = $location;
            rootScope = $rootScope;
            rootScope.loggedInUserId = loggedInUserId;
            $controller('logs', {
                $scope: scope
            });
        });
    }

    it("should take user to the landing page if the user is logged in", function () {
        initController('John');
        expect(rootScope.loggedInUserId).toBe('John');
        expect(location.path()).toBe('');
    });

    it("should take user to the login page if the user is logged out", function () {
        initController('');
        expect(rootScope.loggedInUserId).toBe('');
        spyOn(scope, 'reloadLogs');
        expect(location.path()).toBe('/login');
        expect(scope.reloadLogs).not.toHaveBeenCalled();
    });

});