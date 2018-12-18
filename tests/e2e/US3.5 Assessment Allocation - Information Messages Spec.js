var constant = require('./constant'),
    ui = require('./landingPage.js'),
    inNavigationSection = require('./navigationPage.js'),
    loginPage = require('./loginPage.js');

describe('US3.5 Assessment Allocation - Information Messages', function () {

    beforeAll(ui.openPage);
    
    afterEach(function () {
        ui.clearClaimantField();
    });
    
     it("should loginPage", function () {
        loginPage.login();
    });
    
    describe("", function () {

        it("AC3.5-3: An on-screen error message is presented when a search is conducted in the 'Claimant Search bar', and the assessment's LOT ID does not match the user's ID", function () {
            
            ui.searchClaimant("FF777777K");
            expect(ui.assessmemntsError()).toBe(true);
            expect(ui.assessmemntsErrTxt()).toBe(' You do not hold the correct LOT privileges to search for this assessment.');
            expect(ui.getAllAssessmentsRows().count()).toBe(1);
            expect(ui.ninoOrCrn(0)).toBe("LR000001A");
            expect(ui.caseCreatedDate(0)).toBe("20/11/2015 15:46");
            expect(ui.statusOfAssessment(0)).toBe("Downloaded");
            expect(ui.statusUpdatedDate(0)).toBe("20/11/2015 16:39");
            expect(ui.allocatedTo(0)).toBe("smithdor");

        });

        it("AC3.5-1: An on-screen error message is presented when a search is conducted in the 'Claimant Search bar' and the entry is found to be in an incorrect format.\
        <LBR>1. Validating the error text is displayed\
        <LBR>2. Validating the errror text", function () {
            
            ui.searchClaimant("FF1234");           
            expect(ui.clmntSearchErrDisplayed()).toBe(true);
            expect(ui.clmntSearchErrText()).toBe(' Entry is in an invalid format. Please check and try again.');
         });
        
        it("AC3.5-2: An on-screen error message is presented when a search is conducted in the 'Claimant Search bar', and the assessment is not found in MAPS.\
        <LBR>1. Validating the error text is present\
        <LBR>2. Validating the errror text", function () {
            
            ui.searchClaimant("FF777777Q");
            expect(ui.assessmemntsError()).toBe(true);
            expect(ui.assessmemntsErrTxt()).toBe(' No assessment has been found that matches your search.');
        });

        it("AC3.5-4:When the user clicks the 'Remove' button, and ALL rows have been selected, a warning message must be displayed in a dialogue box .\
        <LBR>1. Validating no dialog window present\
        <LBR>2. Validating the dialog window is shown after clicking remove\
        <LBR>3. Validating 'Removing All' error message is shown", function () {
            
            ui.searchClaimant("FF777777E");
            ui.searchForHealthProf(12345678);
            inNavigationSection.clickOnAllocateLink();
            ui.btnSelectAllAssessAlloc().click();
            expect(ui.popUpMessage().isPresent()).toBe(false);
            ui.clickRemove();
            expect(ui.popUpMessage().isPresent()).toBe(true);
            expect(ui.modalPopUpText()).toBe("You are about to remove all assessments from the Allocation table. Are you sure?");
            ui.clickNo();
        });
        
        it("AC3.5-5: When the user clicks the 'Allocate' button, and ALL rows have been selected, a warning message must be displayed in a dialogue box .\
        <LBR>1. Validating no dialog window present\
        <LBR>2. Validating the dialog window is shown after clicking allocate\
        <LBR>3. Validating 'Allocating All' error message is shown", function () {
            
            ui.searchClaimant("FF777777I");
            inNavigationSection.clickOnDeAllocateLink();
            ui.searchForHealthProf(12345678);
            inNavigationSection.clickOnAllocateLink();
            ui.btnSelectAllAssessAlloc().click();
            expect(ui.popUpMessage().isPresent()).toBe(false);
            ui.allocateBtn().click();
            expect(ui.popUpMessage().isPresent()).toBe(true);
            expect(ui.modalPopUpText()).toBe("You are about to allocate all the assessments to 12345678. Are you sure?");
            element(by.css(' [data-ng-click="cancel()"]')).click();
        });

        it("AC3.5-3: An on-screen error message is presented when a search is conducted in the 'Claimant Search bar', and the assessment's LOT ID does not match the user's ID.\
        <LBR>1. Validating no assessment error shown for search\
        <LBR>2. Validating LOT privileges error\
        <LBR>3. Validating no assessment error shown for search\
        <LBR>4. Validating LOT privileges error", function () {
            
            ui.searchClaimant("FF777777I");
            expect(ui.assessmemntsError()).toBe(true);
            expect(ui.assessmemntsErrTxt()).toBe(' You do not hold the correct LOT privileges to search for this assessment.');
            ui.clearClaimantField();
            ui.searchClaimant("FF777777J");
            expect(ui.assessmemntsError()).toBe(true);
            expect(ui.assessmemntsErrTxt()).toBe(' You do not hold the correct LOT privileges to search for this assessment.');  
        });

        // USS 7.2
        it("AC3.5-6: An on-screen error message is displayed if an assessment is allocated by another user in the time between searching for the assessment and clicking the 'Allocate' button.\
        <LBR>1. Validating the dialog window is not present after selectAll click\
        <LBR>2. Validating the dialog window is present after clicking selectAll\
        <LBR>3. Validating the dialog window text - for removing all assessments\
        <LBR>4. Validating the dialog window is not present before allocating\
        <LBR>5. Validating the dialog window is not present after clicking allocate\
        <LBR>6. Validating the error message shown on the corresponding row", function () {
            
            ui.btnSelectAllAssessAlloc().click();
            expect(ui.popUpMessage().isPresent()).toBe(false);
            ui.clickRemove();
            expect(ui.popUpMessage().isPresent()).toBe(true);
            expect(ui.modalPopUpText()).toBe("You are about to remove all assessments from the Allocation table. Are you sure?");
            ui.clickYes();
            ui.clearClaimantField();
            ui.searchClaimant("FF777777L");
            ui.btnSelectAllAssessAlloc().click();
            expect(ui.popUpMessage().isPresent()).toBe(false);
            inNavigationSection.clickOnAllocateLink();
            ui.allocateBtn().click();
            expect(ui.popUpMessage().isPresent()).toBe(true);
            expect(ui.modalPopUpText()).toBe("You are about to allocate all the assessments to 12345678. Are you sure?");
            ui.clickYes();
            expect (ui.getErrTxtOnAssessAllocRow(2)).toBe(" This assessment is no longer available for allocation.");
        });
        
        
        /* This needs to be tested offline */
        xit("AC3.5-7: If MAPS UI fails to allocate an assessment due to an I.T error, an on-screen error message is displayed.", function () {
            
            ui.clearClaimantField();
            ui.searchClaimant("FF777777F");
            var techError = element(by.id("techError"));
            expect(techError.isPresent()).toBe(true);
            expect(techError.getText()).toBe(" Operation has failed due an IT problem, please try again or contact your help desk.").pend("This can only be tested when browser security is enabled and does not allow Cross Origin Resource Sharing");
        });
        
        // online - error
        it("AC3.5-7: If MAPS UI fails to allocate an assessment due to an I.T error, an on-screen error message is displayed.", function () {
            
            expect (ui.getErrTxtOnAssessAllocRow(1)).toBe(" Operation has failed due an IT problem, please try again or contact your help desk.");                      
        });
        
        it("AC3.5-10: If the user clicks the 'Allocate' button, all selected rows that have the status of 'Not available', 'Allocated', 'Downloaded, 'Submitted' or 'Submitted Incomplete' should display an on-screen error message.", function () {
            
            expect(ui.statusOfAssessment(0)).toBe("Submitted Incomplete");
            expect(ui.getErrTxtOnAssessAllocRow(0)).toBe(" You cannot allocate this assessment as it does not have a status of 'Available'");
        });
        
        it("AC3.5-11: When the user clicks the 'Allocate' button, any assessments that have a LOT ID that do not match the LOT ID of the health professional in the 'Health Professional's Current Allocations' table must NOT be allocated and an on-screen error message must be displayed on the relevant row(s).", function () {
            
            expect(ui.getErrTxtOnAssessAllocRow(3)).toBe(" You cannot allocate this assessment to the chosen health professional as their LOT ID's do not match.");                        
        });
        
        it("AC3.5-12: An on-screen error message is presented when a user attempts to allocate an assessment(s) and the Health Professional unique ID entered (at the initial search) is not found in MAPS  .", function () {
            
            expect(ui.getErrTxtOnAssessAllocRow(4)).toBe(" Unable to allocate assessment(s) as either the chosen Health Professional's user number is invalid or LOT ID's do not match.");
        });
    });
});
