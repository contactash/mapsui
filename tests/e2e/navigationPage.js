module.exports = new NavigationPage();

function NavigationPage() {

    var navigationBlock = element(by.id('mapsScrollspy'));

    function clickOnDeAllocateLink() {
        navigationBlock.all(by.css('.nav li')).first().click();
        browser.waitForAngular();
    }

    function clickOnAllocateLink() {
        navigationBlock.all(by.css('.nav li')).last().click();
        browser.waitForAngular();
    }

    return {
        clickOnDeAllocateLink : clickOnDeAllocateLink,
        clickOnAllocateLink : clickOnAllocateLink
    }
}
