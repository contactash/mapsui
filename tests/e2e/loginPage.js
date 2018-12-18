module.exports = new LoginPage();

function LoginPage() {

    var userInput,
        passwordInput,
        loginButton,
        logoutLink,
        menu;

    function getAllLoginElements() {
        userInput = element(by.id("username"));
        passwordInput = element(by.id("userpassword"));
        loginButton = element(by.css('[data-ng-click="login(credentials)"]'));
        logoutLink = element(by.css('[data-ng-click="logout(null)"]'));
        menu = element(by.id('menu'));
    }

    function login() {
        userInput.sendKeys("MapsUser");
        passwordInput.sendKeys("MapsPass1234");
        loginButton.click();
    }

    function clickYes() {
        element(by.css('[data-ng-click="modalOptions.ok();"]')).click();
        browser.waitForAngular();
    }

    function logout() {
        menu.click();
        logoutLink.click();
        clickYes();
    }

    return {
        getAllLoginElements: getAllLoginElements,
        login: login,
        logout : logout
    }

}