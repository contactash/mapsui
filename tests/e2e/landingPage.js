module.exports = new LandingPage();
var loginPage = require('./loginPage.js'),
    constant = require('./constant.js');

function LandingPage() {
    var searchInput,
        searchButton;

    function openPage(done) {
        return browser.get(constant.getApplicationURL())
            .then(function(){
                loginPage.getAllLoginElements();
            })
            .then(done);
    }

    function popUpMessage() {
        return element(by.css('.modal-dialog'));
    }

    function clickSelectAll() {
        selectAllButton().click();
    }

    function clickDeSelectAll() {
        clickSelectAll();
    }

    function getAllHeaders() {
        return element.all(by.css('.sortable-th'));
    }

    function statusHeader() {
        return getAllHeaders().get(1);
    }

    function numberOfRows() {
        return getCurrAllocRows().count();
    }

    function clickYes() {
        element(by.css('[data-ng-click="ok()"]')).click();
        browser.waitForAngular();
    }

    function clickNo() {
        element(by.css('[data-ng-click="cancel()"]')).click();
        browser.waitForAngular();
    }

    function deAllocate() {
        clickDeAllocateButton();
        clickYes();
    }

    function clickDeAllocateButton() {
        deAllocateButton().click();
        browser.waitForAngular();
    }

    function selectRow(rowNum) {
        element.all(by.id('btn')).then(function (row) {
            row[rowNum].click();
        });
    }

    function deSelectRow(rowNum) {
        selectRow(rowNum);
    }

    function selectAssessment(rowNum) {
        element.all(by.repeater('assessmentAllocation in assessmentAllocations'))
            .then(function (row) {
            row[rowNum].click();
        });
    }

    function buttonTextOnRow(rowNum) {
        return getCurrAllocRows().get(rowNum).$$("td").get(4).getText();
    }

    function statusOfRow(rowNum) {
        return getCurrAllocRows().get(rowNum).$$("td").get(1).getText();
    }

    function searchHealthProfessional(hpId) {
        searchInput.clear();
        searchInput.sendKeys(hpId);
        searchButton.click();
    }
    
    function searchForHealthProf(hpId) {
        element(by.model('searchHP')).clear();
        element(by.model('searchHP')).sendKeys(hpId);
        element(by.css('[data-ng-click="getAllocations()"]')).click();
    }

    function popUpText() {
        var modal = element(by.css('.modal-content'));
        return modal.all(by.tagName('text')).getText();
    }

    function noAllocationsMessage() {
        return element(by.id('noAllocations')).isDisplayed();
    }

    function noAllocationsMessageText() {
        return element(by.id('noAllocations')).getText();
    }

    function getElementsOnPage() {
        searchInput = element(by.model('searchHP'));
        searchButton = element(by.id('search'));
    }

    function selectAllButton() {
        return element(by.id('selectAll'));
    }

    function deAllocateButton() {
        return element(by.id('de-Allocate'));
    }

    function getErrorTextOnRow(rowNum) {
        return getCurrAllocRows().get(rowNum).$$("td").get(5).getText()
    }
    
    function getErrTxtOnAssessAllocRow(rowNum) {
        return getAllAssessmentsRows().get(rowNum).$$("td").get(6).getText();
    }

    function getAllocationStatusOnRow(rowNum) {
        return getCurrAllocRows().get(rowNum).$$("td").get(1).getText()
    }

    function warningImage() {
        return element(by.css('[data-ng-show="allocation.errorMessage"]'));
    }
        
    function btnSelectAllAssessAlloc() {
        return element(by.css('[data-ng-click="selectAllAlloc()"]'));
    }
    
    function clickAllocRow() {
        return element.all(by.css('[data-ng-click="setClickedRowAlloc(assessmentAllocation)"]'));
    }
    
    function allocateBtn() {
        return element(by.css('[data-ng-click="allocate()"]'));
    }
    
    function clickRemove() {
        return element(by.css('[data-ng-click="remove()"]')).click();
    }
    
    function cancelBtn() {
        return element(by.css(' [data-ng-click="cancel()"]'));
    }
    
    function yesBtn() {
        return element(by.css(' [data-ng-click="ok()"]'));
    }
    
    function getCurrAllocRows() {
        return element.all(by.repeater('allocation in allocations'));
    }
    
    function getCurrAllocAssessOnRow(rownum) {
        return getCurrAllocRows().get(rownum).$$("td").get(0).getText();
    }
    
    function getNinoCrnOnRow(rownum) {
        return getAllAssessmentsRows().get(rownum).$$("td").get(0).getText();
    }
    
    function getStatusUpdatedOnRow(rownum) {
        return getAllAssessmentsRows().get(rownum).$$("td").get(3).getText();
    }
    
    function buttonStatusOnRow(rownum) {
        return element.all(by.id('btn')).get(rownum).getText();
    }
    
    function row(rownum) {
        return clickAllocRow().get(rownum).getAttribute("class");
    }
    
    function clearClaimantField() {
        element(by.model('searchClaimant')).clear();
    }

    function pressTABKey() {
        browser.actions().sendKeys(protractor.Key.TAB).perform();
    }

    function pressSHIFTPlusTABKey() {
        browser.actions().sendKeys(protractor.Key.SHIFT, protractor.Key.TAB).perform();
    }

    function pressEnterKey() {
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    function searchClaimant(input) {
        element(by.model('searchClaimant')).sendKeys(input);
        element(by.id('searchClaimantBtn')).click();
    }

    function getAllAssessmentsRows() {
        return element.all(by.repeater('assessmentAllocation in assessmentAllocations'));
    }

    function ninoOrCrn(rowNum) {
        return getAllAssessmentsRows().get(rowNum).$$("td").get(0).getText();
    }

    function caseCreatedDate(rowNum) {
        return getAllAssessmentsRows().get(rowNum).$$("td").get(1).getText();
    }

    function statusOfAssessment(rowNum) {
        return getAllAssessmentsRows().get(rowNum).$$("td").get(2).getText();
    }

    function statusUpdatedDate(rowNum) {
        return getAllAssessmentsRows().get(rowNum).$$("td").get(3).getText();
    }

    function allocatedTo(rowNum) {
        return getAllAssessmentsRows().get(rowNum).$$("td").get(4).getText();
    }

    function assessmentsStatusHeader() {
        return getAllHeaders().get(6);
    }

    function getAllocationDateOnRow(rowNum) {
        return getCurrAllocRows().get(rowNum).$$("td").get(2).getText();
    }
    
    function getNumberOfAssessRows() {
        return getAllAssessmentsRows().count().then(returnPromise);
    }
    
    function returnPromise(result) {   
        return result;
    }
    
    function clmntSearchErrDisplayed() {
        return (element(by.css('[data-ng-show="searchClaimantNotValid"]')).isDisplayed());
    }
    
    function clmntSearchErrText() {
        return (element(by.css('[data-ng-show="searchClaimantNotValid"]')).getText());
    }
    
    function assessmemntsErrTxt() {
        return (element(by.css('[data-ng-show="assessmentsError"]')).getText());
    }
    
    function assessmemntsError() {
        return (element(by.css('[data-ng-show="assessmentsError"]')).isDisplayed());
    }
    
    function modalPopUpText() {
        return element(by.id('modalText')).getText();
    }
    
    function userInput() {
        return element(by.id("username"));
    }
    
    function passwordInput() {
        return element(by.id("userpassword"));
    }
    
    function loginButton() {
        return element(by.css(' [data-ng-click="login(credentials)"]'));
    }
    
    function okBtn() {
        return element(by.css('[data-ng-click="modalOptions.ok();"]'));
    }
    
    function noBtn() {
        return element(by.css('[data-ng-click="modalOptions.close()"]'));
    }
    
    function menu() {
        return element(by.id('menu'));
    }
    
    function logOut() {
        return element(by.id('logout'));
    }
    
    function changePassword() {
        return element(by.id('changePassword'));
    }
    
    function popUpBoxText() {
        return element(by.css('div.modal-body p.ng-binding')).getText();
    }
    
    function searchClmntField() {
        return element(by.model('searchClaimant')).isPresent();
    }
    
    function dialogBoxVisible() {
        return element(by.css('.modal-dialog')).isPresent();
    }
    
    function hpStaffNumber() {
        return element(by.id('hpStaffNumberText')).getText();
    }
    
    function numberOfRows() {
        return element.all(by.repeater('allocation in allocations')).count();
    }
    
    function searchInputNotValid() {
        return $('[data-ng-show="searchInputNotValid"]');
    }
    
    function searchPractitioner() {
        return element(by.id('searchPractitioner'));
    }
    
    function searchHpInput() {
        return element(by.model('searchHP'));
    }
    
    function privilegeError() {
        return $('[data-ng-show="privilegesError"]');
    }
    
    function hpSearchButton() {
        return element(by.id('search'));
    }
    
    function welcomeBannerTxt() {
        return element(by.id('welcome')).getText();
    }
    
    function loginButton() {
        return element(by.css('[data-ng-click="login(credentials)"]'));
    }
    
    function errors() {
        return element(by.css(' [data-ng-show="formErrors.errors"]'));
    }
    
    function userLabel() {
        return element(by.id('userLabel'));
    }
    
    function passwordLabel() {
        return element(by.id('passwordLabel'));
    }
    
    function welcome() {
        return element(by.id('welcomeText'));
    }
    
    function selectBox() {
        return element(by.css('option[selected="selected"]'));
    }
    
    return {
        openPage : openPage,
        popUpMessage : popUpMessage,
        clickSelectAll : clickSelectAll,
        clickDeSelectAll : clickDeSelectAll,
        numberOfRows : numberOfRows,
        statusHeader : statusHeader,
        clickYes : clickYes,
        clickNo : clickNo,
        deAllocate : deAllocate,
        clickDeAllocateButton : clickDeAllocateButton,
        selectRow : selectRow,
        selectAssessment : selectAssessment,
        deSelectRow : deSelectRow,
        buttonTextOnRow : buttonTextOnRow,
        statusOfRow : statusOfRow,
        searchHealthProfessional : searchHealthProfessional,
        popUpText : popUpText,
        noAllocationsMessage : noAllocationsMessage,
        noAllocationsMessageText : noAllocationsMessageText,
        getElementsOnPage : getElementsOnPage,
        selectAllButton : selectAllButton,
        deAllocateButton : deAllocateButton,
        getErrorTextOnRow : getErrorTextOnRow,
        getAllocationStatusOnRow : getAllocationStatusOnRow,
        warningImage : warningImage,
        pressTABKey : pressTABKey,
        pressEnterKey : pressEnterKey,
        pressSHIFTPlusTABKey : pressSHIFTPlusTABKey,
        searchClaimant : searchClaimant,
        statusOfAssessment : statusOfAssessment,
        assessmentsStatusHeader : assessmentsStatusHeader,
        getAllocationDateOnRow : getAllocationDateOnRow,
        ninoOrCrn : ninoOrCrn,
        caseCreatedDate : caseCreatedDate,
        statusUpdatedDate : statusUpdatedDate,
        allocatedTo : allocatedTo,
        getAllAssessmentsRows : getAllAssessmentsRows,
        btnSelectAllAssessAlloc : btnSelectAllAssessAlloc,
        clickAllocRow : clickAllocRow,
        allocateBtn : allocateBtn,
        clickRemove :  clickRemove,
        cancelBtn : cancelBtn,
        yesBtn : yesBtn,
        getCurrAllocRows : getCurrAllocRows,
        getCurrAllocAssessOnRow: getCurrAllocAssessOnRow,
        getNinoCrnOnRow : getNinoCrnOnRow,
        getStatusUpdatedOnRow : getStatusUpdatedOnRow,
        buttonStatusOnRow : buttonStatusOnRow,
        row : row,
        clearClaimantField : clearClaimantField,
        searchForHealthProf : searchForHealthProf,
        getNumberOfAssessRows : getNumberOfAssessRows,
        getErrTxtOnAssessAllocRow : getErrTxtOnAssessAllocRow,
        clmntSearchErrDisplayed : clmntSearchErrDisplayed,
        clmntSearchErrText : clmntSearchErrText,
        assessmemntsErrTxt : assessmemntsErrTxt,
        assessmemntsError : assessmemntsError,
        modalPopUpText : modalPopUpText,
        userInput : userInput,
        passwordInput : passwordInput,
        loginButton : loginButton,
        okBtn : okBtn,
        noBtn : noBtn,
        menu : menu,
        logOut : logOut,
        changePassword : changePassword,
        popUpBoxText : popUpBoxText,
        searchClmntField : searchClmntField,
        dialogBoxVisible : dialogBoxVisible,
        hpStaffNumber : hpStaffNumber,
        numberOfRows : numberOfRows,
        searchInputNotValid : searchInputNotValid,
        searchPractitioner : searchPractitioner,
        searchHpInput : searchHpInput,
        privilegeError : privilegeError,
        hpSearchButton :hpSearchButton,
        welcomeBannerTxt : welcomeBannerTxt,
        loginButton : loginButton,
        errors : errors,
        userLabel : userLabel,
        passwordLabel : passwordLabel,
        welcome : welcome,
        selectBox : selectBox

    }
}