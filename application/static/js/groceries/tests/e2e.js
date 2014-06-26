'use strict';

describe('Groceries', function () {
    var deleteButtons, groceries, groceryCheckboxes, groceryLabels, input, ptor,
        sleep, groceriesCount, suggestions, suggestionsCount;

    beforeEach(function () {
        ptor = protractor.getInstance();
        ptor.ignoreSynchronization = true;
        browser.get('/');
        deleteButtons = element.all(by.css('#groceries li button.warning'));
        groceries = element.all(by.repeater('item in groceries'));
        groceryLabels = element.all(by.css('#groceries li label'));
        groceryCheckboxes = element.all(by.css('#groceries li input[type="checkbox"]'));
        input = element(by.css('#new-item'));
        sleep = 300;
        suggestions = element.all(by.repeater('item in suggestions'));
        element.all(by.repeater('item in groceries')).count().then(function (count) {
            groceriesCount = count;
        });
        element.all(by.repeater('item in suggestions')).count().then(function (count) {
            suggestionsCount = count;
        });
    });

    it('should display a list of groceries that is hidden when the input is clicked', function () {
        expect(groceriesCount).toBe(10);
        expect(groceries.first().isDisplayed()).toBe(true);
        input.click();
        expect(groceries.first().isDisplayed()).toBe(false);
    });

    it('should contain a list of suggestions that is shown when the input is clicked', function () {
        expect(suggestionsCount).toBe(10);
        expect(suggestions.first().isDisplayed()).toBe(false);
        input.click();
        expect(suggestions.first().isDisplayed()).toBe(true);
    });

    it('should toggle the delete button when a grocery item is clicked', function () {
        expect(deleteButtons.first().isDisplayed()).toBe(false);
        groceries.first().click();
        expect(deleteButtons.first().isDisplayed()).toBe(true);
        groceries.first().click();
        expect(deleteButtons.first().isDisplayed()).toBe(false);
    });

    it('should mark a grocery item as bought/not bought, when it\'s label or checkbox is clicked', function () {
        expect(groceries.first().getAttribute('class')).not.toMatch(/bought/);
        groceryLabels.first().click();
        browser.driver.sleep(sleep);
        expect(groceries.first().getAttribute('class')).toMatch(/bought/);
        groceryCheckboxes.first().click();
        browser.driver.sleep(sleep);
        expect(groceries.first().getAttribute('class')).not.toMatch(/bought/);
    });

    it('should add an item when the input is focused, the input has a value and the enter key is pressed', function () {
        input.click();
        input.sendKeys(protractor.Key.ENTER);
        input.sendKeys('Apples');
        input.sendKeys(protractor.Key.ENTER);
        browser.driver.sleep(sleep);
        expect(groceryLabels.last().getInnerHtml()).toMatch('Apples');
    });

    it('should add an item with the same name, when a suggestions is clicked', function () {
        input.click();
        suggestions.first().click();
        browser.driver.sleep(sleep);
        expect(groceryLabels.last().getInnerHtml()).toBe(suggestions.first().getInnerHtml());
    });

    it('should delete an item when the delete button is clicked', function () {
        var firstItemName = groceryLabels.first().getInnerHtml();
        groceries.first().click();
        deleteButtons.first().click();
        browser.driver.sleep(sleep);
        expect(groceryLabels.first().getInnerHtml()).not.toBe(firstItemName);
        expect(groceryLabels.count()).toBe(groceriesCount - 1);
    });
});