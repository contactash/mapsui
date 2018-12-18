var loginPage = require('./loginPage.js'),
    inNavigationSection = require('./navigationPage.js'),
    ui = require('./landingPage.js');

describe('US 3.1: Search Health Professional', function() {

    beforeAll(ui.openPage);
    
    afterEach(function () {
        ui.searchHpInput().clear();
    });
    
    it("should login", function () {
        loginPage.login();
    });

    it('AC3.1-1: The text "Type HPs unique ID" must pre-populate the HP search bar in soft colour and italics', function () {
        expect(ui.searchPractitioner().isPresent()).toBe(true);
        expect(ui.searchPractitioner().getAttribute('placeholder')).toBe('Type HP unique ID');
        expect(ui.searchPractitioner().getAttribute('class')).toBe('search-box ng-pristine ng-untouched ng-invalid ng-invalid-required ng-valid-maxlength');
    });

    it('AC3.1-3: A MAPS UI user must be able to use the HP search bar to search for a specific health professional using the HPs unique identifier (DWP staff number)', function () {
       expect(ui.searchHpInput().isPresent()).toBe(true);
    });

    it('AC3.1-6: MAPS UI must limit the HP Search bar to a maximum of eight numeric characters.', function () {
        ui.searchHpInput().sendKeys('1234567890');
        expect(ui.searchPractitioner().getAttribute('value')).toBe('12345678');
    });

    it('AC3.1-7: A successful search for a health professional populates the HPs current allocations table with the health professionals staff number (unique identifier).', function () {
        ui.searchForHealthProf('12345678');
        expect(ui.hpStaffNumber()).toBe('HP Staff Number: 12345678');
        loginPage.logout();
        loginPage.login();
        //make sure staff number is cleared from root scope on logout
        expect(ui.hpStaffNumber()).toBe('HP Staff Number:');
    });

    it('AC3.1-8: A successful search must populate the HPs current allocations table with all assessments that are currently allocated to the health professional.', function () {
        ui.searchForHealthProf('12345678');
        expect(ui.numberOfRows()).toEqual(4);
    });

    it("AC3.1-9: If the successful search finds that the HP does not currently have any allocated assessments to display, a message must display below the HP Current Allocations Table.\
        <LBR>1. Validating the results appear in table when allocations are present", function () {
        expect(element(by.id('noAllocations')).isDisplayed()).toBeFalsy();
        ui.searchForHealthProf('12341234'); 
        expect(element(by.id('noAllocations')).isDisplayed()).toBeTruthy();
        ui.searchForHealthProf('12345678'); 
        expect(element(by.id('noAllocations')).isDisplayed()).toBeFalsy();
    });

    it('AC3.1-10: At the end of each row of the Health Professionals Current Allocations table, there must be a Select button.', function () {
        ui.searchForHealthProf('12341234'); 
        expect(element.all(by.id('btn')).count()).toBe(0);
        ui.searchForHealthProf('12345678'); 
        expect(element.all(by.id('btn')).count()).toBe(4);
    });

    it('AC3.1-11: The user must have the option to Select all. This must display as a button located above the first results row, in the same column as the Select button.', function () {
        ui.searchForHealthProf('12341234'); 
        expect(ui.selectAllButton().isPresent()).toBe(true);
        expect(ui.selectAllButton().isEnabled()).toMatch('false');
        ui.searchForHealthProf('12345678'); 
        expect(element.all(by.id('selectAll')).isEnabled()).toMatch('true');
    });

    it('AC3.1-14: When the user types a new unique ID into the HP search bar and conducts a new successful search, the HP current allocations table must replace all data fields with the new data results from the new search.', function () {
        ui.searchForHealthProf('12341234'); 
        expect(ui.numberOfRows()).toEqual(0);
        ui.searchForHealthProf('12345678'); 
        expect(ui.numberOfRows()).toEqual(4);
    });
    
    it("AC3.1-15: When submitting a new search and the search fails for any reason, the 'HP's Current Allocations table' must remove all previous results and become empty.\
    <LBR>1. Search for a valid health professional with allocations\
    <LBR>2. Search for an invalid health professional and validate that previous search results are cleared and appropriate message is displayed", function () {
        ui.searchForHealthProf('12345678'); 
        expect(ui.numberOfRows()).toEqual(4);
        expect(ui.hpStaffNumber()).toBe('HP Staff Number: 12345678');
        inNavigationSection.clickOnAllocateLink();
        ui.clearClaimantField();
        ui.searchClaimant("FF777777F");
        ui.selectAssessment(0);
        expect(ui.allocateBtn().isEnabled()).toBe(true);
        ui.searchForHealthProf('1234567a');
        expect(ui.searchInputNotValid().isPresent()).toBe(true);
        expect(ui.searchInputNotValid().getText()).toBe(" Incorrect format. Health Professional's unique ID's are numerical and require eight digits. Please try again.");
        expect(ui.allocateBtn().isEnabled()).toBe(false);
        expect(ui.numberOfRows()).toEqual(0);
        expect(ui.hpStaffNumber()).toBe('HP Staff Number:');
    });
});