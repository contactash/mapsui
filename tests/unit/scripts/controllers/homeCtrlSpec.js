describe("Home Ctrl", function () {

    // load the controller's module
    beforeEach(module('mapsUIApp'));

    var rootScope,
        location;

    // Initialize the controller and a mock scope
    function initController(loggedInUserId) {
        inject(function ($controller,$rootScope, $location) {
            rootScope = $rootScope;
            location = $location;
            rootScope.loggedInUserId = loggedInUserId;
            $controller('homeCtrl');
        });
    }


    it("should take user to the landing page if the user is logged in", function () {
        initController("John");
        expect(rootScope.loggedInUserId).toBe('John');                                  
        expect(location.path()).toBe("/index");
    });


    it("should take user to the login page if the user is logged out", function () {
        initController("");
        expect(rootScope.loggedInUserId).toBe('');
        expect(location.path()).toBe("/login");
    });
});