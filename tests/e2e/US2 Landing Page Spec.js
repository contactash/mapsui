var constant = require('./constant'),
        ui = require('./landingPage.js'),
        loginPage = require('./loginPage.js');

describe('US 2.1: Landing Page - Design', function() {
    
    beforeAll(function (done) {
        return browser.get(constant.getApplicationURL())
        .then(done);
    });

    beforeAll(ui.openPage);
    
    it("should login", function () {
        loginPage.login();
    });

    it('AC2.1-1: The functionality screen must display the standard gov.uk black banner and MAPS UI label\
    <LBR>1. Validates MAPS UI Label is present\
    <LBR>2. Validates label MAPS UI', function() {
        expect(element(by.css('.navbar-brand')).isDisplayed()).toBeTruthy();
        expect(element(by.css('.navbar-brand')).getText()).toBe('MAPS UI');
    });

    it('AC2.1-2: The screen must display a welcome message', function() {
        expect(ui.welcomeBannerTxt()).toContain("Welcome, MapsUser");
    });

    it("AC2.1-4: The screen must display a static 'HP search bar', the title for the search bar must be placed to the left of search bar itself, with the wording 'Search Health Professional'.", function () {
        expect(element(by.tagName('label')).getText()).toBe('Search for Health Professional');
    });

    it('AC2.1-5: The screen must display a label titled \'Health Professional\'s Current Allocations\'', function() {
        expect(element(by.id('currentAllocationsText')).getText()).toBe('Health Professional\'s Current Allocations');
    });

   it('AC2.1-7: The \'Health Professional\'s Current Allocations table\' must have a row that displays \'HP Staff Number\'', function() {
        ui.searchForHealthProf('12345678');
        expect(element(by.id('hpStaffNumberText')).getText()).toBe('HP Staff Number: 12345678');
    });

    it("AC2.1-8: The 'Health Professional's Current Allocations table' must display four columns titled 'Current Allocated Assessments', 'Status', 'Date/Time Allocated' and 'Allocated by'.\
    <LBR>1. Validates table column heading \'Current Allocated Assessments\'\
    <LBR>2. Validates table column heading \'Status\'\
    <LBR>3. Validates table column heading \'Allocated On\'\
    <LBR>4. Validates table column heading \'Allocated by\'", function () {
        expect(element(by.css(" [data-ng-click=\"sortType = 'ninoOrCrn'; sortReverse = !sortReverse\"]")).getText()).toBe('Current Allocated\nAssessments');
        expect(element(by.css(" [data-ng-click=\"sortType = 'state'; sortReverse = !sortReverse\"]")).getText()).toBe('Status');
        expect(element(by.css(" [data-ng-click=\"sortType = 'stateDateTime'; sortReverse = !sortReverse\"]")).getText()).toBe('Allocated On');
        expect(element(by.css(" [data-ng-click=\"sortType = 'allocatingUserId'; sortReverse = !sortReverse\"]")).getText()).toBe('Allocated by');
    });

    it("AC2.1-10: The 'Health Professional's Current Allocations table' must display a 'De-allocate' button that remains beneath the 'select' button of the lowest result row.", function () {
        expect(ui.deAllocateButton().isPresent()).toBe(true);
    });
    
    it("AC2.1-12: The Assessment Allocation table must have five columns titled 'NINO/CRN', 'Case Created', 'Status', 'Date Status Updated' and 'Allocated to'.\
    <LBR>1. Validates table column heading \'NINO/CRN\'\
    <LBR>2. Validates table column heading \'Case Created\'\
    <LBR>3. Validates table column heading \'Status\'\
    <LBR>4. Validates table column heading \'Status Updated\'\
    <LBR>5. Validates table column heading \'Allocated to\'", function () {
        expect(element(by.css("[tabindex=\"502\"]")).getText()).toBe('NINO/CRN');
        expect(element(by.css("[tabindex=\"503\"]")).getText()).toBe('Case Created');
        expect(element(by.css("[tabindex=\"504\"]")).getText()).toBe('Status');
        expect(element(by.css("[tabindex=\"505\"]")).getText()).toBe('Status Updated');
        expect(element(by.css("[tabindex=\"506\"]")).getText()).toBe('Allocated to');
    });

    it("AC2.1-18: The 'Assessment Allocation table' must display an 'Allocate' button that remains beneath the 'select' button of the lowest row.", function () {
        expect(element(by.id('allocateId')).isPresent()).toBe(true);
    });

    it("AC2.1-19: The 'Assessment Allocation table' must display a 'Remove' button that remains beside the 'Allocate' button.", function () {
        expect(element(by.css('[data-ng-click="remove()"]')).isPresent()).toBe(true);
    });

    it("AC2.1-22: The screen must display a 'Claimant Search' search bar, the title for the search bar must be placed to the left of search bar itself, with the wording 'Search for Claimant Assessment'\
    <LBR>1. Validates label \'Search for Claimant Assessment\'\
    <LBR>2. Validates label \'Search for Claimant Assessment\' is present\
    <LBR>3. Validates place holder text", function () {
        expect(element(by.id('searchId')).getText()).toBe('Search for Claimant Assessment');
        expect(element(by.id('searchClaimant')).isPresent()).toBe(true);
        expect(element(by.id('searchClaimant')).getAttribute('placeholder')).toBe('Type NINO/CRN');
    });
    
    it("AC2.1-24: To the right of the user's name - 'LOT' should display, followed by the user's LOT ID - eg - '1', '2', '1 & 3', 1, 2 & 3' etc.", function () {
        expect(ui.welcomeBannerTxt()).toContain("LOT : 1");
    });
});