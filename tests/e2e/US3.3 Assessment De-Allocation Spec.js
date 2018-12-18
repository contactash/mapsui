var ui = require('./landingPage.js'),
    inNavigationSection = require('./navigationPage.js'),
    loginPage = require('./loginPage.js'),
    constant  = require('./constant'),
    moment = require('moment');

describe('US 3.3 Assessment De-Allocation', function () {

    beforeAll(ui.openPage);

    beforeEach(function () {
        ui.getElementsOnPage();
    });

    it("should loginPage", function () {
        loginPage.login();
    });

    it('AC3.3-1: In the Health Professionals current allocations table, when the user clicks the Select button, the assessment must be selected, the row must be highlighted and the button must change to display Deselect.', function () {
        ui.searchHealthProfessional(12345678);
        expect(ui.buttonTextOnRow(0)).toBe('Select');
        expect(ui.buttonTextOnRow(1)).toBe('Select');
        ui.selectRow(1);
        expect(ui.buttonTextOnRow(1)).toBe('De-Select');
        expect(ui.buttonTextOnRow(0)).toBe('Select');
    });

    it("AC3.3-2: In the 'Health Professional's current allocations table', clicking the 'Deselect' button (for an assessment that has already been selected) must undo the original selection, de-highlight it and the Deselect button must change to display 'Select'.", function () {
        expect(ui.buttonTextOnRow(1)).toBe('De-Select');
        ui.deSelectRow(1);
        expect(ui.buttonTextOnRow(1)).toBe('Select');
    });

    it("AC3.3-3: When the 'Select All' button is clicked, all rows in the 'HP's current allocations table' must be: selected, highlighted, all 'Select' buttons must change to display 'Deselect' & the 'Select All' button must change to display 'Deselect All'.", function () {
        ui.clickSelectAll();
        expect(ui.buttonTextOnRow(0)).toBe('De-Select');
        expect(ui.buttonTextOnRow(1)).toBe('De-Select');
        expect(ui.buttonTextOnRow(2)).toBe('De-Select');
        expect(ui.buttonTextOnRow(3)).toBe('De-Select');
        expect(ui.selectAllButton().getText()).toBe('De-Select All');

        ui.clickDeSelectAll();
        expect(ui.buttonTextOnRow(0)).toBe('Select');
        expect(ui.buttonTextOnRow(1)).toBe('Select');
        expect(ui.buttonTextOnRow(2)).toBe('Select');
        expect(ui.buttonTextOnRow(3)).toBe('Select');
        expect(ui.selectAllButton().getText()).toBe('Select All');
    });


    it("AC3.3-4: When the 'De-allocate' button is clicked, a warning message is presented in a dialogue box.", function () {
        ui.selectRow(1);
        ui.clickDeAllocateButton();
        expect(ui.popUpMessage().isPresent()).toBe(true);
        ui.clickNo();
    });

    it("AC3.3-5: When the user is presented with the de-allocation warning message and selects 'Yes', and at least one of the allocated assessments has a status of 'Downloaded', MAPS UI must display a second warning message in a dialogue box.", function () {
        ui.searchHealthProfessional(12345678);
        ui.selectRow(2);
        expect(ui.statusOfRow(2)).toBe('Downloaded');
        ui.deAllocate();
        expect(ui.popUpMessage().isPresent()).toBe(true);
        expect(ui.popUpText()).toMatch('At least one assessment has been downloaded but not yet submitted. If you deallocate you will lose any report data held in PIPAT Mobile. Are you sure you want to deallocate?');
        ui.clickYes();
        expect(ui.popUpMessage().isPresent()).toBe(false);
    });

    describe("AC3.3-6: When the user is presented with the de-allocation warning message (or the second warning message) and selects 'Yes', MAPS UI must de-allocate the selected assessments from the HP and remove the relevant assessment(s) from the table.	", function () {

        beforeEach(function () {
            ui.searchHealthProfessional(12345678);
            browser.waitForAngular();
        });

        it("should select all and deallocate. this should then remove all rows from the table", function () {
            expect(ui.numberOfRows()).toEqual(4);

            ui.clickSelectAll();
            ui.deAllocate();
            expect(ui.popUpMessage().isPresent()).toBe(true);

            ui.clickYes();
            expect(ui.popUpMessage().isPresent()).toBe(false);
            expect(ui.numberOfRows()).toBe(0);

        });

        it("should select one row from the table and deallocate. On each successful de-allocation the application should remove de-allocated row from the table. And it should keep the remaining rows in the table. \ " +
            "<LBR>1. DeAllocate one row at a time and check that particular row is removed from the table", function () {
            expect(ui.numberOfRows()).toEqual(4);

            ui.selectRow(1);
            ui.deAllocate();
            expect(ui.numberOfRows()).toBe(3);
            expect(ui.statusOfRow(0)).toBe('Submitted');
            expect(ui.statusOfRow(1)).toBe('Downloaded');
            expect(ui.statusOfRow(2)).toBe('Allocated');

            ui.selectRow(2);
            ui.deAllocate();
            expect(ui.numberOfRows()).toBe(2);
            expect(ui.statusOfRow(0)).toBe('Submitted');
            expect(ui.statusOfRow(1)).toBe('Downloaded');

            ui.selectRow(0);
            ui.deAllocate();
            expect(ui.statusOfRow(0)).toBe('Downloaded');
            expect(ui.numberOfRows()).toBe(1);

            ui.selectRow(0);
            ui.deAllocate();
            ui.clickYes();
            expect(ui.numberOfRows()).toBe(0);

        });
    });

    it("AC3.3-7: When the user is presented with either de-allocation warning message and the user selects 'No', the de-allocate action is cancelled and the user is returned to the screen as it was before they clicked the 'de-allocation' button.", function () {
        ui.searchHealthProfessional(12345678);
        expect(ui.numberOfRows()).toEqual(4);

        ui.clickSelectAll();
        ui.clickDeAllocateButton();
        expect(ui.popUpMessage().isPresent()).toBe(true);
        ui.clickNo();
        expect(ui.numberOfRows()).toBe(4);
        expect(ui.popUpMessage().isPresent()).toBe(false);

    });

    it("AC3.3-8: The user should not be able to click the 'De-allocate' button if no rows have been selected.\
    <LBR>1. Validate that De-Allocate button is disabled when no rows are selected\
    <LBR>2. Validate that De-Allocate button is enabled when atleast one row is selected\
    <LBR> 3. Validate that De-Allocate button is disabled when 'De-Select All' is clicked\
    <LBR> 4. Validate that De-Allocate button is enabled when 'Select All' is clicked", function () {
        ui.searchHealthProfessional(12345678);
        expect(ui.deAllocateButton().isEnabled()).toBe(false);
        ui.selectRow(1);
        expect(ui.deAllocateButton().isEnabled()).toBe(true);
        ui.deSelectRow(1);
        expect(ui.deAllocateButton().isEnabled()).toBe(false);
        ui.clickSelectAll();
        expect(ui.deAllocateButton().isEnabled()).toBe(true);
        ui.clickDeSelectAll();
        expect(ui.deAllocateButton().isEnabled()).toBe(false);
    });

    it("AC3.3-9: If an assessment is de-allocated by another user in the time between searching for the health professional (and therefore displaying their current allocations) and de-allocating the assessment, an error message is presented in a dialogue box.", function () {
        ui.searchHealthProfessional(12345676);
        ui.selectRow(0);
        ui.clickDeAllocateButton();
        expect(ui.popUpMessage().isPresent()).toBe(true);
        expect(ui.popUpText()).toMatch('You have chosen to de-allocate the selected assessments from the health professional. Do you wish to proceed?');
        ui.clickYes();
        expect(ui.popUpMessage().isPresent()).toBe(true);
        expect(ui.popUpText()).toMatch('You cannot de-allocate this assessment as it has already been de-allocated. It will now be removed from this table.');
        ui.clickYes();
    });

    it("AC3.3-12: Clicking the left hand side navigational 'Health Professionals' Current Allocations' button must instantly navigate the user to a part of the screen that allows them to view all the 'Health Professional's current allocations table'.", function () {
        expect(browser.getLocationAbsUrl()).toBe("/index");
        inNavigationSection.clickOnAllocateLink();
        expect(browser.getLocationAbsUrl()).toBe("/index#allocate");
        inNavigationSection.clickOnDeAllocateLink();
        expect(browser.getLocationAbsUrl()).toBe("/index#deAllocate");
    });

    it("AC3.3-13: If by de-allocating the assessment(s) the 'HP's Current Allocations' table becomes empty, the on-screen message stating that the health professional does not have any current allocations should display (as per 3.1-9).\
    <LBR>1. De-Allocate all the rows in the table and validate that the message appears on the screen where the table is", function () {
        ui.searchHealthProfessional(12345678);
        ui.clickSelectAll();
        ui.deAllocate();
        ui.clickYes();
        expect(ui.noAllocationsMessage()).toBeTruthy();
        expect(ui.noAllocationsMessageText()).toMatch('This health professional does not currently have any assessments allocated to them.');
        expect(ui.selectAllButton().isEnabled()).toBe(false);
        expect(ui.deAllocateButton().isEnabled()).toBe(false);
    });

    it("AC3.3-14: All on-screen error messages must appear to the right of each row in the 'Health Proffesional's Current Allocations' table. \
    <LBR>1. Verify that the SOAP fault message are displayed on screeen \
    <LBR>2. Verify that the warning image appears with the warning message \
    <LBR>3. Verify that the valid rows are deallocated and removed from table\
    <LBR>4. Verify that already deAllocated rows are removed and pop up warning is displayed,\
    <LBR>5. Verify that the status are displayed correctly", function () {

        ui.searchHealthProfessional(12345600);
        expect(ui.numberOfRows()).toBe(5);
        expect(ui.getErrorTextOnRow(0)).toBe(' ');
        expect(ui.getErrorTextOnRow(1)).toBe(' ');
        expect(ui.getErrorTextOnRow(2)).toBe(' ');
        expect(ui.getErrorTextOnRow(3)).toBe(' ');
        expect(ui.getErrorTextOnRow(4)).toBe(' ');
        expect(ui.getAllocationStatusOnRow(0)).toBe('Not Available');
        expect(ui.getAllocationStatusOnRow(1)).toBe('Available');
        expect(ui.getAllocationStatusOnRow(2)).toBe('Not Available');
        expect(ui.getAllocationStatusOnRow(3)).toBe('Submitted Incomplete');
        expect(ui.warningImage().isDisplayed()).toBeFalsy();
        ui.clickSelectAll();
        ui.deAllocate();
        ui.clickYes();
        expect(ui.numberOfRows()).toBe(3);
        expect(ui.warningImage().isDisplayed()).toBeTruthy();
        expect(ui.getErrorTextOnRow(0)).toBe(" Operation has failed due an IT problem, please try again or contact your help desk.");
        expect(ui.getErrorTextOnRow(1)).toBe(" De-Allocate failed to Unlock Assessment on PIPAT.");
        expect(ui.getErrorTextOnRow(2)).toBe(" Assessment Lot does not match the request.");
    });

    it("should verify date format is correct or date being optional is blank", function () {
        ui.searchHealthProfessional(12345671);
        ui.getAllocationDateOnRow(0).then(evaluate);
        ui.getAllocationDateOnRow(1).then(evaluate);
        ui.getAllocationDateOnRow(2).then(evaluate);
        ui.searchHealthProfessional(12345678);
        ui.getAllocationDateOnRow(0).then(evaluate);
        ui.getAllocationDateOnRow(1).then(evaluate);
        ui.getAllocationDateOnRow(2).then(evaluate);
        ui.getAllocationDateOnRow(3).then(evaluate);

        function evaluate(result) {
            if (result) {
                expect(moment(result, ["DD/MM/YYYY HH:mm"], true).isValid()).toBe(true);
            } else  {
                expect(result).toBe('');
            }
        }

    });
});