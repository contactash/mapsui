var constant = require('./constant'),
    inNavigationSection = require('./navigationPage.js'),
    cp = require('./changePasswordPage.js'),
    //ui = require('./landingPage.js'),
    loginPage = require('./loginPage.js');

describe('US 1.3 Change Password', function () {
    
    beforeAll(cp.openPage);
    
    it("should loginPage", function () {
        loginPage.login();
    });

    beforeAll(function (done) {
        return browser.get(constant.getApplicationURL())
         .then(done);
    });

    it("AC1.3-1: The screen must display the title of 'Change Password' and contain on-screen instructions about password requirements (see AC1.3-4).", function () {
        
        cp.menu().click();
        expect(element(by.id('changePassword')).isPresent()).toBe(true);   
    });

    it("AC1.3-3: The change password screen must have three fields that the user can input information into, titled 'Current Password', 'New Password' and 'Confirm New Password'.\
    <LBR>1. Validates Confirm New Password Label\
    <LBR>2. Validates Confirm Password Label\
    <LBR>3. Validates Current Password\
    <LBR>4. Validates Confirm New Password Input\
    <LBR>5. Validates Confirm Password Input\
    <LBR>6. Validates Current Password Input", function () {
        
        cp.changePassword().click();
        expect(cp.confirmNewPassDescrip()).toBe('Confirm New Password');
        expect(cp.newPassDescrip()).toBe('New Password');
        expect(cp.currentPassDescrip()).toBe('Current Password');
        expect(cp.confirmNewPassField().isPresent()).toBe(true);
        expect(cp.newPassField().isPresent()).toBe(true);
        expect(cp.currentPassField().isPresent()).toBe(true);
    });

    it('AC1.3-4: On-screen password requirements - \
     "Password must:\
    - Contain characters from three of the following four categories: Uppercase, Lowercase, Numerical, Non-alphabetic.\
    - Be at least 12 characters in length\
    - Not contain the ‘User ID’ or parts of the user’s full name (which exceed two consecutive characters)\
    - Not be a previous password"\
    <LBR>1. Validates Label - \'Password Must\'\
    <LBR>2. Validates Label - \'Password Contain characters\'\
    <LBR>3. Validates Label - \'Uppercase, Lowercase, Numerical, Non-alphabetic.\'\
    <LBR>4. Validates Label - \'12 characters in length\'\
    <LBR>5. Validates Label - \'Not contain User ID or full name\'\
    <LBR>6. Validates Label - \'Consecutive Characters\'\
    <LBR>7. Validates Label - \'Not to be previous password\'', function () {

        expect(cp.textInChangePassBox()).toContain("Password must:");
        expect(cp.textInChangePassBox()).toContain("Contain characters from three of the following four categories:");
        expect(cp.textInChangePassBox()).toContain("Uppercase, Lowercase, Numerical, Non-alphabetic.");
        expect(cp.textInChangePassBox()).toContain("Be at least 12 characters in length");
        expect(cp.textInChangePassBox()).toContain("Not contain the ‘User ID’ or parts of the user’s full name");
        expect(cp.textInChangePassBox()).toContain("(which exceed two consecutive characters)");
        expect(cp.textInChangePassBox()).toContain("Not be a previous password");
    });

    it("AC1.3-5: There must be two clickable buttons below the text fields displaying 'Cancel' and 'Confirm'.\
    <LBR>1. Validates OK Button Present or not\
    <LBR>2. Validates Confirm Text on the button\
    <LBR>3. Validates No Button Label Present or not\
    <LBR>4. Validates Cancel Label", function () {
        
        expect(cp.confirmBtn().isPresent()).toBe(true);
        expect(cp.confirmBtn().getText()).toBe('Confirm');
        expect(cp.cancelBtn().isPresent()).toBe(true);
        expect(cp.cancelBtn().getText()).toBe('Cancel');
    });

    xit("AC1.3.19:  If MAPS UI fails to successfully allow a user to attempt to change their password due to an I.T error, an on-screen error message is displayed.", function () {
        
        cp.currentPassField().clear();
        cp.newPassField().clear();
        cp.confirmNewPassField().clear();
        expect(element(by.id('img')).isPresent()).toBe(true);
        cp.currentPassField().sendKeys('MapsPassword');
        cp.newPassField().sendKeys('MapsPwd1');
        cp.confirmNewPassField().sendKeys('MapsPwd1');
        cp.confirmBtn().click();
        expect(cp.warningImage().isDisplayed()).toBe(true);
        expect(cp.errorMsg()).toBe(' Operation has failed due an IT problem, please try again or contact your help desk.');
    }).pend("To be tested against the service fault");

    it("AC1.3-6: The user must correctly input their current password in the 'Current Password' field and the new password in the 'New Password' field and the new password in the 'Confirm New Password' field must match in order for MAPS UI to accept the password change and save.\
    <LBR>1. Validates modal dialog is present\
    <LBR>2. Validates Exclamation image is not present\
    <LBR>3. Validates modal dialog is present after clicking OK when nothing inputted\
    <LBR>4. Validates Exclamation image is visible\
    <LBR>5. Validates modal dialog is present after inputting correct password in the New Password Input field\
    <LBR>6. Validates modal dialog is present after inputting the correct password in the Confirm New Password Field", function () {
        
        // No Input
        cp.currentPassField().clear();
        cp.newPassField().clear();
        cp.confirmNewPassField().clear();
        expect(cp.popUpBoxVisible()).toBe(true);
        // For AC1.3.2
        expect(cp.warningImage().isPresent()).toBe(false);
        cp.confirmBtn().click();
        expect(cp.popUpBoxVisible()).toBe(true);
        expect(cp.warningImage().isDisplayed()).toBe(true);
        // New Password
        cp.newPassField().sendKeys('MapsPassword1');
        cp.confirmBtn().click();
        expect(cp.popUpBoxVisible()).toBe(true);
        // Confirm New Password and New Password
        cp.confirmNewPassField().sendKeys('MapsPassword2');
        cp.confirmBtn().click();
        expect(cp.popUpBoxVisible()).toBe(true);
    });
//
    it("AC1.3-2: Error messages for this functionality should appear in red text with an exclamation symbol before the text. All the error messages must appear inbetween the 'Change Password' title and the password requirements.", function () {
        
        expect(cp.warningImage().isDisplayed()).toBe(true);
        // error message validation on AC1.3-7
    });

    it("AC1.3-7: If the user clicks 'Confirm' and they have not completed all fields, an error message is displayed.", function () {
        
        expect(cp.errorMsg()).toBe(' All fields must be entered.');
    });

    it("AC1.3-8: If the user clicks 'Confirm' and their current password has been input incorrectly, an error message is displayed.", function () {
        
        cp.currentPassField().sendKeys('MapsPassword3');
        cp.confirmBtn().click();
        expect(cp.errorMsg()).toBe(' Current password incorrect, please try again.');
    });

    it("AC1.3-9: If the user clicks 'Confirm' and their 'new password' is not identical to their 'confirm new password', an error message is displayed.", function () {
        
        cp.currentPassField().clear();
        cp.currentPassField().sendKeys('MapsPass1234');
        cp.newPassField().sendKeys('MapsPassword1');
        cp.confirmNewPassField().sendKeys('MapsPassword2');
        cp.confirmBtn().click();
        // AC needs to be updated to match the error response
        expect(cp.errorMsg()).toBe(' New Password and Confirm Password do not match');
    });

    //PIP-1671 password check needs to be removed as per requirment
    xit("AC1.3-10: If the user inputs a new password that does not meet the password requirements an error message is displayed.", function () {
        
        cp.newPassField().sendKeys('MapsPwd');
        cp.confirmNewPassField().sendKeys('MapsPwd');
        cp.confirmBtn().click();
        expect(cp.errorMsg()).toBe(' New Password must be between 8-12 and must contain letters and numbers');
    });

    // AC1.3-10 - is a generic message
    // AC1.3-11 - descoped
    
    it("AC1.3-12.1: When the user clicks 'Cancel' the user is returned to the MAPS UI functionality page and any fields that have been completed are not saved.\
    <LBR>1. Validates modal dialog is present\
    <LBR>2. Validates modal dialog is not pre sent after clicking no button", function () {
        
        cp.newPassField().clear();
        cp.confirmNewPassField().clear();
        cp.currentPassField().clear();
        cp.currentPassField().sendKeys('MapsPassword');
        cp.newPassField().sendKeys('Maps1234567890');
        cp.confirmNewPassField().sendKeys('Maps1234567890');
        expect(cp.popUpBoxVisible()).toBe(true);
        cp.cancelBtn().click();
    });

    it("AC1.3-12.2: should not logout when change password is cancelled and navigation links are clicked", function () {

        browser.sleep(1000);
        inNavigationSection.clickOnDeAllocateLink();
        expect(browser.getLocationAbsUrl()).toBe("/index#deAllocate");
        inNavigationSection.clickOnAllocateLink();
        expect(browser.getLocationAbsUrl()).toBe("/index#allocate");
        expect(cp.popUpBoxVisible()).toBe(false);
    });

    it("AC1.3.18.1: When a user has entered an incorrect password and confirmed the error message presented they should be presented with a blank password field allowing them another password entry attempt.\
    <LBR>1. When Current Password incorrect a. Current password cleared b. New Password not cleared c. Confirm password not cleared", function () {
        
        cp.menu().click();
        cp.clickChangePassword();
        
        //// incorrect current password
        cp.newPassField().clear();
        cp.confirmNewPassField().clear();
        cp.currentPassField().clear();
        cp.currentPassField().sendKeys('TestPassword');
        cp.newPassField().sendKeys('MapsPwd12345');        
        cp.confirmNewPassField().sendKeys('MapsPwd12345'); 
        cp.confirmBtn().click();
        expect(cp.currPassFieldValue()).toEqual('');
        expect(cp.newPassFieldValue()).toEqual('MapsPwd12345');
        expect(cp.confNewPassFieldValue()).toEqual('MapsPwd12345');
        expect(cp.errorMsg()).toBe(' Current password incorrect, please try again.');
    });

        it("AC1.3.18.2: When a user has entered an incorrect password and confirmed the error message presented they should be presented with a blank password field allowing them another password entry attempt.\
    <LBR>2. When same password entered for all a. Current password cleared b. New Password cleared c. Confirm New Password cleared", function () {
        
         //all are equal
        cp.newPassField().clear();
        cp.confirmNewPassField().clear();
        cp.currentPassField().clear();
        cp.currentPassField().sendKeys('MapsPass1234');
        cp.newPassField().sendKeys('MapsPass1234');
        cp.confirmNewPassField().sendKeys('MapsPass1234');
        cp.confirmBtn().click();
        expect(cp.currPassFieldValue()).toEqual('');
        expect(cp.newPassFieldValue()).toEqual('');
        expect(cp.confNewPassFieldValue()).toEqual('');
        expect(cp.errorMsg()).toBe(' New Password cannot be the same as the Current Password');
    });

            it("AC1.3.18.3: When a user has entered an incorrect password and confirmed the error message presented they should be presented with a blank password field allowing them another password entry attempt.\
    <LBR>3. When incorrect new password entered a. Current password not cleared b. New Password cleared c. Confirm New Password cleared", function () {
        
         //incorrect new password
        cp.newPassField().clear();
        cp.confirmNewPassField().clear();
        cp.currentPassField().clear();
        cp.currentPassField().sendKeys('MapsPass1234');
        cp.newPassField().sendKeys('maps');
        cp.confirmNewPassField().sendKeys('maps');
        cp.confirmBtn().click();
        expect(cp.currPassFieldValue()).toEqual('MapsPass1234');
        expect(cp.newPassFieldValue()).toEqual('');
        expect(cp.confNewPassFieldValue()).toEqual('');
        expect(cp.errorMsg()).toBe('  Invalid user name or password entered.');
    });

                it("AC1.3.18.4: When a user has entered an incorrect password and confirmed the error message presented they should be presented with a blank password field allowing them another password entry attempt.\
    <LBR>4. When Passwords doesn\'t match a. Current Password not cleared b. New Password cleared c. Confirm New Password cleared", function () {
        
        // new and confirm doesn't match
        cp.newPassField().clear();
        cp.confirmNewPassField().clear();
        cp.currentPassField().clear();
        cp.currentPassField().sendKeys('MapsPass1234');
        cp.newPassField().sendKeys('MapsPwd12345');
        cp.confirmNewPassField().sendKeys('MapsPwd12346');
        cp.confirmBtn().click();
        expect(cp.currPassFieldValue()).toEqual('MapsPass1234');
        expect(cp.newPassFieldValue()).toEqual('');
        expect(cp.confNewPassFieldValue()).toEqual('');
        expect(cp.errorMsg()).toBe(' New Password and Confirm Password do not match');
        cp.cancelBtn().click();

    });

    xit("AC1.3.20:  If the user has successfully changed their password, an on-screen error message is displayed.\
    <LBR>1. Validates modal dialog is present after clicking Change Password\
    <LBR>2. Validates modal dialog is present after clicking OK button\
    <LBR>3. Validates modal dialog label for Successfully changed", function () {
        
        cp.menu().click();
        cp.clickChangePassword();
        cp.newPassField().clear();
        cp.confirmNewPassField().clear();
        cp.currentPassField().clear();
        cp.currentPassField().sendKeys('MapsPass1234');
        cp.newPassField().sendKeys('Maps12345678');
        cp.confirmNewPassField().sendKeys('Maps12345678');
        cp.confirmBtn().click();
        expect(cp.popUpBoxText()).toBe('Your password has been successfully changed');
    });

    // AC1.3-14 - Backend. AC1.3-13 also verifies password change
    
    xit("AC1.3-13: When the user clicks 'Confirm' and all fields are correct, MAPS UI must save the user's new password and return the user to the functionality page\
    <LBR>1. Validates modal dialog is not present before clicking confirmation button\
    <LBR>2. Validates the location URL\
    <LBR>3. Validates the current password incorrect error message is shown when entered the previous password", function () {
        
        cp.clickOk();
        expect(browser.getLocationAbsUrl()).toBe("/index");
        cp.menu().click();
        cp.clickChangePassword();
        cp.newPassField().clear();
        cp.confirmNewPassField().clear();
        cp.currentPassField().clear();
        cp.currentPassField().sendKeys('MapsPass1234');
        cp.newPassField().sendKeys('Maps12345678');
        cp.confirmNewPassField().sendKeys('Maps12345678');
        cp.confirmBtn().click();
        expect(cp.errorMsg()).toBe(' Current password incorrect, please try again.');
    });
});