var constant = require('./constant'),
    loginPage = require('./loginPage.js'),
    ui = require('./landingPage.js');

describe('US 3.6 Logoff', function () {
    
    beforeAll(ui.openPage);

        it("should loginPage", function () {
        loginPage.login();
    });

    it("AC3.6-2: When a user clicks the 'Logged In' button in the black banner at the top of the screen, a drop down menu is presented with two options - 'Log Out and 'Change Password'.\
    <LBR>1. Validating the URL before clicking Logout to be 'login'\
    <LBR>2. Validating menu label for logout to be present\
    <LBR>3. Validating menu label for change password to be present\
    <LBR>4. Validating menu label for logout\
    <LBR>5. Validating menu label for change password", function () {
        
        ui.menu().click();
        expect(ui.logOut().isPresent()).toBe(true);
        expect(ui.changePassword().isPresent()).toBe(true);
        expect(ui.logOut().getText()).toBe('Log Out');
        expect(ui.changePassword().getText()).toBe('Change Password');

    });
    
    it("AC3.6-3: When the user clicks the 'Log Out' option, the user is presented with a warning message.", function () {
        
        ui.logOut().click();
        expect(ui.popUpBoxText()).toBe('Are you sure you want to exit MAPS UI?');
    });
    
    it("AC3.6.5: When the user clicks 'No' on the warning message they must be returned to the screen as it was before they clicked 'Log Out'.\
    <LBR>1. Validating the URL before clicking 'No' button\
    <LBR>2. Validating the URL after clicking 'No' button", function () {        
        
        expect(browser.getLocationAbsUrl()).toBe("/index");
        ui.noBtn().click();
        expect(browser.getLocationAbsUrl()).toBe("/index");
    });

    describe("AC3.6-1: A MAPS UI user must be able to log off MAPS UI at all times.", function () {
    describe("AC3.6-4: When the user clicks 'Yes' on the warning message they must be logged off from MAPS UI.", function () {
        it("AC3.6-6: When the user is logged out, they are directed to a screen that confirms they have logged out and gives them the opportunity to log back in.\
        <LBR>1. Validating the URL before logging out\
        <LBR>2. Validating it is in the Landing page before Login\
        <LBR>3. Validating the URL after Logout\
        <LBR>4. Validating Landing page element is not present", function () {

            expect(browser.getLocationAbsUrl()).toBe("/index");
            expect(ui.searchClmntField()).toBe(true);
            ui.menu().click();
            ui.logOut().click();
            ui.okBtn().click();
            expect(browser.getLocationAbsUrl()).toBe("/login");
            expect(ui.searchClmntField()).toBe(false);
        });
    });
    });
});