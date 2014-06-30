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

    it('should delete a grocery item when it is swiped to the right', function () {
        // TODO: It's impossible to properly trigger a swipe event, therefore
        //       testing this functionality is difficult.
    });

    it('should cancel a delete when the cancel button is clicked', function () {
        // TODO: It's impossible to properly trigger a swipe event, therefore
        //       testing this functionality is difficult.
    });

    it('should mark a grocery item as bought/not bought, when it is clicked', function () {
        expect(groceries.first().getAttribute('class')).not.toMatch(/bought/);
        groceries.first().click();
        browser.driver.sleep(sleep);
        expect(groceries.first().getAttribute('class')).toMatch(/bought/);
        groceries.first().click();
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
});
