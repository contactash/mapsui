describe("Landing Page display", function () {

    var controller, $controller, $rootScope, scope;

    beforeEach(module("mapsUIApp"));

    beforeEach(inject(function(_$rootScope_, _$controller_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function () {
       controller = $controller("loginCtrl", {$rootScope: $rootScope});
    });

   it("should get the user first and last name and lot ids from the login session", function () {
       scope = $rootScope.$new();
       $rootScope.loggedInUserObj.firstName = "John";
       $rootScope.loggedInUserObj.lastName = "Doe";
       $rootScope.loggedInUserObj.lotIds = "Lot 2, 1";
       scope.$apply();
       expect(controller.loginName).toBe("John Doe");
       expect(controller.lotIds).toBe(' 2, 1');
   });
});