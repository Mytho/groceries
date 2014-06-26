'use strict';

describe('Groceries', function () {
    var ptor;

    beforeEach(function () {
        ptor = protractor.getInstance();
        ptor.ignoreSynchronization = true;
        browser.get('/');
    });

    it('should display a list of groceries that is hidden when the suggestions are displayed', function () {
        expect(element.all(by.css('#groceries li')).count()).toBe(10);
        expect(element(by.css('#groceries')).isDisplayed()).toBe(true);
        element(by.css('#new-item')).click();
        expect(element(by.css('#groceries')).isDisplayed()).toBe(false);
    });

    it('should contain a list of suggestions that is shown when the input is clicked', function () {
        expect(element.all(by.css('#suggestions li')).count()).toBe(10);
        expect(element(by.css('#suggestions')).isDisplayed()).toBe(false);
        element(by.css('#new-item')).click();
        expect(element(by.css('#suggestions')).isDisplayed()).toBe(true);
    });

    it('should toggle the delete button when a groceries is clicked', function () {
        expect(element.all(by.css('#groceries li button.warning')).get(1).isDisplayed()).toBe(false);
        element.all(by.css('#groceries li')).get(1).click();
        expect(element.all(by.css('#groceries li button.warning')).get(1).isDisplayed()).toBe(true);
        element.all(by.css('#groceries li')).get(1).click();
        expect(element.all(by.css('#groceries li button.warning')).get(1).isDisplayed()).toBe(false);
    });

    it('should mark a grocery bought/not bought, when it\'s label or checkbox is clicked', function () {
        expect(element.all(by.css('#groceries li')).get(1).getAttribute('class')).not.toMatch('bought');
        element.all(by.css('#groceries li label')).get(1).click();
        expect(element.all(by.css('#groceries li')).get(1).getAttribute('class')).toMatch('bought');
        element.all(by.css('#groceries li input[type="checkbox"]')).get(1).click();
        expect(element.all(by.css('#groceries li')).get(1).getAttribute('class')).not.toMatch('bought');
    });

    it('should add an item when the input is focused, the input has a value and the enter key is pressed', function () {
        element(by.css('#new-item')).click();
        element(by.css('#new-item')).sendKeys(protractor.Key.ENTER);
        element(by.css('#new-item')).sendKeys('Apples');
        element(by.css('#new-item')).sendKeys(protractor.Key.ENTER);
        browser.driver.sleep(300);
        expect(element.all(by.css('#groceries li label')).get(10).getText()).toMatch('Apples');
    });

    it('should add an item with the same name, when a suggestions is clicked', function () {
        var firstSuggestion = element.all(by.css('#suggestions li')).get(1);
        element(by.css('#new-item')).click();
        firstSuggestion.click();
        browser.driver.sleep(300);
        expect(element.all(by.css('#groceries li label')).get(11).getText()).toMatch(firstSuggestion.getText());
    });
});
