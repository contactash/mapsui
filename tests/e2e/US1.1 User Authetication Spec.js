describe('user auth', () => {
    it('should do this or that',  () => {
        expect(true).toBe(true);
    });
});



var constant = require('./constant'),
    ui = require('./landingPage.js');

describe('US 1.1 User Authentication', function () {
    
    beforeAll(function (done) {
        return browser.get(constant.getApplicationURL())
            .then(function(){
                return true;
            })
            .then(done);
    });
    
    it('AC1.1-1: The screen must display the title of \'Welcome to MAPS\'', function () {
        
        expect(ui.welcome().getText()).toBe("Welcome to MAPS");
    });
    
    it('AC1.1-2: Underneath the Title, a dropdown box must be displayed to select which benefit the user is wishing to allocate assessments for. This must be defaulted to \'PIP\'.', function () {
        
        expect(ui.selectBox().getText()).toBe("PIP");
    });

    it('AC1.1-3: Error messages for this functionality should appear in red text with an exclamation symbol before the text. All the error messages must appear beneath the space where the drop-down menu will go.', function () {

        ui.loginButton().click();
        expect(ui.errors().getText()).toBe("User ID and Password are required");
    });
    
    it('AC1.1-4: The Log In screen must have two fields that the user can input information into, titled \'User ID\' and \'Password\'\
    <LBR>1. Validating User ID label\
    <LBR>2. Validating Password label\
    <LBR>3. Validating User ID Input is present\
    <LBR>4. Validating Password Input is present', function () {
        
        expect(ui.userLabel().getText()).toBe('User ID');
        expect(ui.passwordLabel().getText()).toBe('Password');
        expect(ui.userInput().isPresent()).toBe(true);
        expect(ui.passwordInput().isPresent()).toBe(true);
    });
    
    it('AC1.1-5: There must be one clickable button below the text fields displaying \'Log In\'.\
    <LBR>1. Validating Login Button\
    <LBR>2. Validating Login Button label', function () {
        
        expect(ui.loginButton().isDisplayed()).toBeTruthy();
        expect(ui.loginButton().getText()).toBe('Log In');
    });
    
    it("AC1.1-6: The user must input a valid User ID and password to be authenticated and access MAPS UI.\
    <LBR>1. Clicking Login button without any input values\
    <LBR>2. Clicking Login button after only user id inputted\
    <LBR>3. Clicking Login button after only password inputted\
    <LBR>4. Validating Password Input is present", function () {
        
        // No Input
        ui.userInput().clear();
        ui.passwordInput().clear();
        ui.loginButton().click();
        expect(ui.errors().getText()).toBe("User ID and Password are required");
        
        // Only User Name
        ui.userInput().sendKeys('MapsUser');
        ui.loginButton().click();
        expect(ui.errors().getText()).toBe("User ID and Password are required");
        
        // Only Password
        ui.userInput().clear();
        ui.passwordInput().sendKeys('MapsPassword');
        ui.loginButton().click();
        expect(ui.errors().getText()).toBe("User ID and Password are required");
    });
    
    it("AC1.1-12: When the user clicks 'Log In' and all fields are correct, MAPS UI must authenticate the user and navigate them to the functionality page", function () {
        
        // No Input
        ui.userInput().clear();
        ui.passwordInput().clear();
        ui.userInput().sendKeys('MapsUser');
        ui.passwordInput().sendKeys('MapsPassword');
        ui.loginButton().click();
        
        //browser.pause();
        expect(browser.getLocationAbsUrl()).toBe("/index");
    });
    
});