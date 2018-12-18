var ui = require('./landingPage.js'),
    loginPage = require('./loginPage.js'),
    inNavigationSection = require('./navigationPage.js'),
    constant = require('./constant');

describe('US 3.4 MapsUI Assessment Allocation', function () {
    
    var selected = 'ng-scope selected-row',
        deselected = 'ng-scope';
    
    beforeAll(ui.openPage);

     it("should loginPage", function () {
        loginPage.login();
    });

    describe("", function () {

        beforeEach(function () {
            inNavigationSection.clickOnAllocateLink();
        });
        
        it("AC3.4-1: When an entry has been input into the Claimant Search bar, and the user selects 'search', MAPS UI must run a search against the entry.\ " +
        "<LBR>1. Validates Case insensitive search", function () {
            
            function searchAndVerify(input) {
                ui.searchClaimant(input);
                expect(ui.getAllAssessmentsRows().count()).toEqual(2);
            }
            searchAndVerify('fF777777F');
            searchAndVerify('ff777777F');
            searchAndVerify('fF777777f');
        });

        it('AC3.4-2: When a valid entry has been input into the Claimant Search bar and the search is successful, the table columns must be populated with data pulled from MAPS\
        <LBR>1. Validates there row count to be 2\
        <LBR>2. Validates the result for NINO column data\
        <LBR>3. Validates the result for NINO column data for row 2\
        <LBR>4. Validates the result for Date column data', function () {

            ui.searchClaimant('FF777777F');
            expect(ui.getAllAssessmentsRows().count()).toEqual(2);
            expect(ui.getNinoCrnOnRow(0)).toBe('FF777777F');
            expect(ui.getNinoCrnOnRow(1)).toBe('FF777777F');
            expect(ui.getStatusUpdatedOnRow(0)).toBe('15/06/2009 13:45');
        });

        it('AC3.4-6: The Assessment Allocation table must automatically populate a new row at the bottom of the Assessment Allocation table when a NINO/CRN is successfully searched for and retrieved\
        <LBR>1. Validates the row count to be 2\
        <LBR>2. Validates the row count to be 3 after making a search\
        <LBR>3. Validates the NINO Column based on the sort order', function () {
            // update -   | orderBy:sortType:sortReverse
            expect(ui.getAllAssessmentsRows().count()).toEqual(2);
            ui.clearClaimantField();
            ui.searchClaimant('FF777777E');
            expect(ui.getAllAssessmentsRows().count()).toEqual(3);
            // default sorting - so ordered ascending
            expect(ui.getNinoCrnOnRow(2)).toBe('FF777777F');
        });

        it('AC3.4-10: When the \'Select\' button is clicked, the assessment must be selected, highlighted and the \'Select\' button must change to display \'De-select\'.\
        <LBR>1. Validates button text to be \'De-Select\' for first row\
        <LBR>2. Validates the selected row css style for first row\
        <LBR>3. Validates button text to be \'Select\' for second row\
        <LBR>4. Validates the selected row css style for second row', function () {

            ui.getAllAssessmentsRows().get(0).click();
            expect(ui.buttonStatusOnRow(0)).toBe('De-Select');
            expect(ui.row(0)).toBe(selected);
            expect(ui.buttonStatusOnRow(1)).toBe('Select');
            expect(ui.row(1)).toBe(deselected);
        });

        it('AC3.4-11: When the user clicks the \'Select All\' button, each row must be selected, highlighted and the \'Select All\' button must change to display \'De-select All\'\
        <LBR>1. Validates Select All button label\
        <LBR>2. Validates button label to be \'De-Select All\' after clicking\
        <LBR>3. Validates the result for NINO column data for row 2\
        <LBR>4. Validates button label to be \'De-Select\' and its css - Looping\
        <LBR>5. Validates button label to be \'De-Select All\'', function () {
            
            expect(ui.btnSelectAllAssessAlloc().getText()).toBe('Select All');
            ui.btnSelectAllAssessAlloc().click().then(function (val) {
                expect(ui.btnSelectAllAssessAlloc().getText()).toBe('De-Select All');
            
                var rowCount = ui.getAllAssessmentsRows().count();
                return rowCount.then(function(rows) {
                    for (var i = 0; i < rows; i++) {
                        expect(ui.buttonStatusOnRow(i)).toBe('De-Select');
                        expect(ui.getNinoCrnOnRow(1)).toBe('FF777777F');
                        expect(ui.row(i)).toBe(selected);
                    }
                });
            });
             
            expect(ui.btnSelectAllAssessAlloc().getText()).toBe('De-Select All');
            ui.btnSelectAllAssessAlloc().click().then(function (val) {
                expect(ui.btnSelectAllAssessAlloc().getText()).toBe('Select All'); //});
                    
                var rowCount = ui.getAllAssessmentsRows().count();
                return rowCount.then(function(rows) {
                    for (var i = 0; i < rows; i++) {
                        expect(ui.buttonStatusOnRow(i).getText()).toBe('Select');
                        expect(ui.getNinoCrnOnRow(1)).toBe('FF777777F');
                        expect(ui.row(i)).toBe(deselected);    
                    }
                });
            });
        });

        it('AC3.4-12: When at least one row has been \'selected\' AND a health professional has been loaded into the \'Health Professional\'s current allocations table\', the user can click the \'Allocate\' button.\
        <LBR>1. Validates the allocate button is disabled\
        <LBR>2. Validates the allocate button is still disabled after selecting the row\
        <LBR>3. Validates the allocate button is enabled after making the HP search', function () {
            
            expect(ui.allocateBtn().isEnabled()).toBe(false);                
            ui.getAllAssessmentsRows().get(0).click();
            expect(ui.allocateBtn().isEnabled()).toBe(false);
            ui.searchForHealthProf('12345678');
            inNavigationSection.clickOnAllocateLink();
            expect(ui.allocateBtn().isEnabled()).toBe(true);
        });

        it('AC3.4-14:When the user clicks the \'Remove\' button and at least one row is unselected, the selected rows must be removed from the \'Assessment Allocation\' table and the table should be re-arranged accordingly (shifting cells up).\
        <LBR>1. Validates the row count to be 2\
        <LBR>2. Validates the row count to be 3 after making a search\
        <LBR>3. Validates the result for NINO column data for row 2\
        <LBR>4. Validates the NINO Column based on the sort order', function () {
            
            expect(ui.getAllAssessmentsRows().count()).toBe(3);      
            ui.clickRemove();
            expect(ui.getAllAssessmentsRows().count()).toBe(2);                                             
            expect(ui.getNinoCrnOnRow(0)).toBe('FF777777F');
            expect(ui.getNinoCrnOnRow(1)).toBe('FF777777F');
        });

        it('AC3.4-16: When the user clicks "No" on the remove warning message, the action must be cancelled and the user is returned to the screen as it was before they clicked the \'remove\' button.\
        <LBR>1. Validates the row count to be 2\
        <LBR>2. Validates the row count to be 2 after clicking Select All, Remove and Cancel buttons', function () {
            
            expect(ui.getAllAssessmentsRows().count()).toBe(2);
            ui.btnSelectAllAssessAlloc().click();
            ui.clickRemove();
            ui.cancelBtn().click();
            expect(ui.getAllAssessmentsRows().count()).toBe(2);
        });

        it('AC3.4-15: When the user clicks "Yes" on the remove warning message, all selected rows must be removed from the \'Assessment Allocation\' table and the table should be re-arranged accordingly (shifting cells up)\
        <LBR>1. Validates the row count to be 2\
        <LBR>2. Validates the OK button to be present after clicking Remove button\
        <LBR>3. Validates the row count to be 0 after clicking OK button', function () {
            
            expect(ui.getAllAssessmentsRows().count()).toBe(2);
            ui.clickRemove();
            expect(ui.yesBtn().isPresent()).toBe(true);
            ui.yesBtn().click();
            expect(ui.getAllAssessmentsRows().count()).toBe(0);
        });

        it('AC3.4-17: When the user clicks the \'Allocate\' button and at least one row is unselected, the selected rows must be allocated to the health professional displaying in the \'Health Professional\'s current Allocations table\'.\
        <LBR>1. Validates the row count to be 3\
        <LBR>2. Validates the row count to be 1 after allocation\
        <LBR>3. Validates the NINO column text\
        <LBR>4. Validates the Allocation table row count to be 6\
        <LBR>5. Validates the NINO column text\
        <LBR>6. Validates the NINO column text', function () {

            expect(ui.getCurrAllocRows().count()).toBe(4);
            var hpRowsBefore = ui.getCurrAllocRows().count().then(function(currAllocRowsBefore) {
                return currAllocRowsBefore;
            });
            ui.clearClaimantField();
            ui.searchClaimant('FF777777F');
            ui.clearClaimantField();
            ui.searchClaimant('FF777777E');
            expect(ui.getAllAssessmentsRows().count()).toBe(3);
            ui.getAllAssessmentsRows().get(0).click();
            ui.getAllAssessmentsRows().get(1).click();
            inNavigationSection.clickOnAllocateLink();
            ui.allocateBtn().click();
            expect(ui.getAllAssessmentsRows().count()).toBe(1);
            expect(ui.getNinoCrnOnRow(0)).toBe('FF777777F');
            var hpRowsAfter = ui.getCurrAllocRows().count().then(function(currAllocRowsAfter) {
                return currAllocRowsAfter;
            });
            protractor.promise.all([hpRowsBefore, hpRowsAfter]).then(function(values)  {    
                var hpRowsAdded = values[1] - values[0];
                var numberOfRowsAllocated = 2;
                expect(hpRowsAdded).toBe(numberOfRowsAllocated);
            });
            expect(ui.getCurrAllocAssessOnRow(4)).toBe('FF777777E');
            expect(ui.getCurrAllocAssessOnRow(5)).toBe('FF777777F');
        });
        
        it('AC3.4-18: When the user clicks the \'Allocate\' button and at least one row is unselected, a warning message MUST NOT be presented.', function () {
            
            ui.clearClaimantField();
            ui.searchClaimant('FF777777F');
            ui.searchForHealthProf('12345678');
            inNavigationSection.clickOnAllocateLink();
            ui.btnSelectAllAssessAlloc().click();  
            ui.getAllAssessmentsRows().get(0).click(); 
            ui.allocateBtn().click();
            expect(ui.popUpMessage().isPresent()).toBe(false);
        });

        it('AC3.4-21: If the user clicks \'No\' on the allocation warning message, the action must be cancelled and the user is returned to the screen as it was before they clicked the \'Allocate\' button.', function () {
            
            ui.clearClaimantField();
            ui.searchClaimant('FF777777F');
            ui.clearClaimantField();
            ui.searchClaimant('FF777777E');
            inNavigationSection.clickOnAllocateLink();
            var rowsBefore = ui.getNumberOfAssessRows();
            expect(rowsBefore).toBe(3);
            ui.btnSelectAllAssessAlloc().click();
            ui.allocateBtn().click();
            ui.cancelBtn().click();
            var rowsAfter = ui.getNumberOfAssessRows();
            expect(rowsAfter).toEqual(rowsBefore);
        });
        
        it('AC3.4-19: If the user clicks \'Yes\' on the allocation warning message, MAPS UI must allocate all the selected assessments to the health professional displaying in the \'Health Professional\'s current allocations table\'\
        <LBR>1. Validates the row count to be 3\
        <LBR>2. Validates the row count to be 4 after making a search\
        <LBR>3. Validates the row count to be 0 after allocating all\
        <LBR>4. Validates the allocation table row count to be 7', function () {
            
            expect(ui.getNumberOfAssessRows()).toBe(3);
            ui.searchForHealthProf('12345678');
            inNavigationSection.clickOnAllocateLink();
            var hpRowsBefore = ui.getCurrAllocRows().count().then(function(currAllocRowsBefore) {
                return currAllocRowsBefore;
            });
            ui.allocateBtn().click();
            ui.yesBtn().click();
            var hpRowsAfter = ui.getCurrAllocRows().count().then(function(currAllocRowsAfter) {
                return currAllocRowsAfter;
            });
            protractor.promise.all([hpRowsBefore, hpRowsAfter]).then(function(values)  {    
                var hpRowsAdded = values[1] - values[0];
                var numberOfRowsAllocated = 3;
                expect(hpRowsAdded).toBe(numberOfRowsAllocated);
            });    
        });
        
        it('AC3.4-20: When an assessment is successfully allocated, the \'Health Professional\'s current allocations table\' must be automatically updated.\
        <LBR>1. Validates the row count to be 7\
        <LBR>2. Validates the Allcoated assessment column text - row 4\
        <LBR>3. Validates the Allcoated assessment column text - row 5\
        <LBR>4. Validates the Allcoated assessment column text - row 6', function () {
            
            expect(ui.getCurrAllocRows().count()).toBe(7);
            expect(ui.getCurrAllocAssessOnRow(4)).toBe('FF777777E');
            expect(ui.getCurrAllocAssessOnRow(5)).toBe('FF777777F');
            expect(ui.getCurrAllocAssessOnRow(6)).toBe('FF777777F');
        });

        it('AC3.4-22: Once MAPS UI has successfully allocated the selected assessments, they are automatically removed from the \'Assessment Allocation\' table.', function () {
            
            expect(ui.getNumberOfAssessRows()).toBe(0);
        });

        it('AC3.4-23: If MAPS UI fails to allocate an assessment for any reason, it must still display in the \'Allocate Assessments table\'.\
        <LBR>1. Validates the row count to be 1\
        <LBR>2. Validates the row count for allocation table to be 4\
        <LBR>3. Validates the row count for allocation table to be 4 even after failing allocation\
        <LBR>4. Validates the row count to be 1 even after failing', function () {
            
            ui.searchForHealthProf('12345678');
            inNavigationSection.clickOnAllocateLink();
            ui.clearClaimantField();
            ui.searchClaimant('FF777777H');
            var rowsBefore = ui.getNumberOfAssessRows();
            expect(rowsBefore).toBe(1);
            expect(ui.getCurrAllocRows().count()).toBe(4);
            ui.btnSelectAllAssessAlloc().click();
            inNavigationSection.clickOnAllocateLink();
            ui.allocateBtn().click();  
            ui.yesBtn().click();   
            expect(ui.getErrTxtOnAssessAllocRow(0)).toBe(" Operation has failed due an IT problem, please try again or contact your help desk.");
            expect(ui.getCurrAllocRows().count()).toBe(4);
            var rowsAfter = ui.getNumberOfAssessRows();
            expect(rowsAfter).toBe(1);
        });

        it('AC3.4-25: MAPS UI users must only be able to allocate assessments to health professionals with a LOT ID that matches their own.\
        <LBR>1. Validates the row count to be 1\
        <LBR>2. Validates the row count to be 1 after making a NINO search - filtered different LOT IDs\
        <LBR>3. Validates the row count to be 2 after making a NINO search - filtered 1 No with different LOT IDs', function () {
 
            var rowsBefore = ui.getNumberOfAssessRows();
            expect(rowsBefore).toBe(1);
            ui.clearClaimantField();
            ui.searchClaimant('FF777777J');
            var rowsAfter = ui.getNumberOfAssessRows();
            expect(rowsAfter).toBe(1); // four Lot Ids with '2' not shown
            ui.clearClaimantField();
            ui.searchClaimant('FF777777I');
            rowsAfter = ui.getNumberOfAssessRows();
            expect(rowsAfter).toBe(2); // two Lot Ids with '2' not shown and '1' Lot Ids with '1' are inserted
            expect(ui.assessmemntsError()).toBe(true);
            expect(ui.assessmemntsErrTxt()).toBe(' You do not hold the correct LOT privileges to search for this assessment.');
        });
    });
});