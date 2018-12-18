var ui = require('./landingPage.js'),
    inNavigationSection = require('./navigationPage.js'),
    loginPage = require('./loginPage.js');

describe('US 3.3 Assessment De-Allocation', function () {

    beforeAll(ui.openPage);

    beforeEach(function () {
        ui.getElementsOnPage();
    });

    it("should loginPage", function () {
        loginPage.login();
    });

    it('Tabs and Enter should always sort the table contents in Allocation. Click on the table headers should also always sort the table contents.', function () {
        ui.searchHealthProfessional(12345678);
        expect(ui.statusOfRow(0)).toBe('Submitted');
        expect(ui.statusOfRow(1)).toBe('Allocated');
        expect(ui.statusOfRow(2)).toBe('Downloaded');
        expect(ui.statusOfRow(3)).toBe('Allocated');
        ui.pressTABKey();
        ui.pressTABKey();
        ui.pressEnterKey();
        expect(ui.statusOfRow(0)).toBe('Submitted');
        expect(ui.statusOfRow(1)).toBe('Downloaded');
        expect(ui.statusOfRow(2)).toBe('Allocated');
        expect(ui.statusOfRow(3)).toBe('Allocated');
        ui.statusHeader().click();
        expect(ui.statusOfRow(0)).toBe('Allocated');
        expect(ui.statusOfRow(1)).toBe('Allocated');
        expect(ui.statusOfRow(2)).toBe('Downloaded');
        expect(ui.statusOfRow(3)).toBe('Submitted');
        ui.pressEnterKey();
        expect(ui.statusOfRow(0)).toBe('Submitted');
        expect(ui.statusOfRow(1)).toBe('Downloaded');
        expect(ui.statusOfRow(2)).toBe('Allocated');
        expect(ui.statusOfRow(3)).toBe('Allocated');
        inNavigationSection.clickOnAllocateLink();
        ui.searchClaimant('FF777777L');
        expect(ui.statusOfAssessment(0)).toBe('Submitted Incomplete');
        expect(ui.statusOfAssessment(1)).toBe('Available');
        expect(ui.statusOfAssessment(2)).toBe('Available');
        expect(ui.statusOfAssessment(3)).toBe('Available');
        expect(ui.statusOfAssessment(4)).toBe('Available');
        ui.pressTABKey();
        ui.pressTABKey();
        ui.pressTABKey();
        ui.pressEnterKey();
        ui.pressEnterKey();
        expect(ui.statusOfAssessment(0)).toBe('Available');
        expect(ui.statusOfAssessment(1)).toBe('Available');
        expect(ui.statusOfAssessment(2)).toBe('Available');
        expect(ui.statusOfAssessment(3)).toBe('Available');
        expect(ui.statusOfAssessment(4)).toBe('Submitted Incomplete');
        ui.assessmentsStatusHeader().click();
        expect(ui.statusOfAssessment(0)).toBe('Submitted Incomplete');
        expect(ui.statusOfAssessment(1)).toBe('Available');
        expect(ui.statusOfAssessment(2)).toBe('Available');
        expect(ui.statusOfAssessment(3)).toBe('Available');
        expect(ui.statusOfAssessment(4)).toBe('Available');
        ui.pressEnterKey();
        ui.pressEnterKey();
        expect(ui.statusOfAssessment(0)).toBe('Submitted Incomplete');
        expect(ui.statusOfAssessment(1)).toBe('Available');
        expect(ui.statusOfAssessment(2)).toBe('Available');
        expect(ui.statusOfAssessment(3)).toBe('Available');
        expect(ui.statusOfAssessment(4)).toBe('Available');

    });
});