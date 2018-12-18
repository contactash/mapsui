module.exports = new ChngPasswdPage();
var loginPage = require('./loginPage.js'),
    constant = require('./constant.js');

function ChngPasswdPage() {

    function openPage(done) {
        return browser.get(constant.getApplicationURL())
            .then(function(){
                loginPage.getAllLoginElements();
            })
            .then(done);
    }
    
    function changePassword() {
        return element(by.id('changePassword'));
    }
    
    function menu() {
        return element(by.id('menu'));
    }
    
    function confirmNewPassDescrip() {
        return element(by.id('confirmNewPasswordLabel')).getText();
    }
    
    function newPassDescrip() {
        return element(by.id('newPasswordLabel')).getText();
    }
    
    function currentPassDescrip() {
        return element(by.id('currentPasswordLabel')).getText();
    }
    
    function confirmNewPassField() {
        return element(by.id("confirmNewPassword"));
    }
    
    function newPassField() {
        return element(by.id("newPassword"));
    }
    
    function currentPassField() {
        return element(by.id("currentPassword"));
    }
    
    function textInChangePassBox() {
        return element(by.css('div.modal-body form')).getText();
    }
    
    function confirmBtn() {
        return element(by.css('[data-ng-click="ok();"]'));
    }
    
    function cancelBtn() {
        return element(by.css('[data-ng-click="close()"]'));
    }
    
    function errorMsg() {
        return element(by.css(' [data-ng-repeat="err in formErrors"]')).getText();
    }
    
    function popUpBoxVisible() {
        return element(by.css('.modal-dialog')).isPresent();
    }
    
    function warningImage() {
        return element(by.id('img'));
    }
    
    function newPassFieldValue() {
        return newPassField().getAttribute('value');
    }
    
    function currPassFieldValue() {
        return currentPassField().getAttribute('value');
    }
    
    function confNewPassFieldValue() {
        return confirmNewPassField().getAttribute('value');
    }
    
    function clickChangePassword() {
        return element(by.id('changePassword')).click();
    }
    
    function popUpBoxText() {
        return element(by.css(' [data-ng-bind-html="modalOptions.bodyText"]')).getText();
    }
    
    function clickOk() {
        return element(by.css('[data-ng-click="modalOptions.ok();"]')).click();
    }
    
    
    return {
        openPage : openPage,
        changePassword : changePassword,
        menu : menu,
        confirmNewPassDescrip : confirmNewPassDescrip,
        newPassDescrip : newPassDescrip,
        currentPassDescrip : currentPassDescrip,
        confirmNewPassField : confirmNewPassField,
        newPassField : newPassField,
        currentPassField : currentPassField,
        textInChangePassBox : textInChangePassBox,
        confirmBtn : confirmBtn,
        cancelBtn : cancelBtn,
        errorMsg : errorMsg,
        popUpBoxVisible : popUpBoxVisible,
        warningImage : warningImage,
        newPassFieldValue : newPassFieldValue,
        currPassFieldValue : currPassFieldValue,
        confNewPassFieldValue : confNewPassFieldValue,
        clickChangePassword : clickChangePassword,
        popUpBoxText : popUpBoxText,
        clickOk : clickOk   
    }
}