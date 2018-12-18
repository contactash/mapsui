var loginPage = require('./loginPage.js'),
    ui = require('./landingPage.js');

describe('US 3.2: Search Health Professional - Information Messages', function() {

    beforeAll(ui.openPage);

    it("should login", function () {
        loginPage.login();
    });

    it("AC3.2-1: An on-screen error message is produced if anything other than eight numerical characters is input into the search field. Error message must appear only after the user has clicked the search button.", function () {
        ui.searchHpInput().clear();
        ui.searchHpInput().sendKeys('1234');
        expect(ui.searchInputNotValid().isDisplayed()).toBeFalsy();
        ui.hpSearchButton().click();
        expect(ui.searchInputNotValid().isDisplayed()).toBeTruthy();
    });
    
    it("AC3.2-4: An on-screen error message is produced when the User's LOT ID does not match the LOT ID of any of the health professional's current allocated assessments.", function () {
        ui.searchHpInput().clear();
        ui.searchHpInput().sendKeys('12345677');
        expect(ui.privilegeError().isDisplayed()).toBeFalsy();
        ui.hpSearchButton().click();
        expect(ui.privilegeError().isDisplayed()).toBeTruthy();
        expect(ui.privilegeError().getText()).toBe(' You do not have sufficient privileges to view the assessment(s) allocated to this health professional.');
    });

    it("AC3.2-4: An on-screen error message is produced when the User's LOT ID does not match the LOT ID of any of the health professional's current allocated assessments.", function () {
        ui.searchHpInput().clear();
        ui.searchHpInput().sendKeys('12345678');
        ui.hpSearchButton().click();
        ui.searchHpInput().clear();
        ui.searchHpInput().sendKeys('12345675');
        expect(ui.privilegeError().isDisplayed()).toBeFalsy();
        ui.hpSearchButton().click();
        expect(ui.privilegeError().isDisplayed()).toBeTruthy();
        expect(ui.privilegeError().getText()).toBe(' You do not have sufficient privileges to view the assessment(s) allocated to this health professional.');
    });
});