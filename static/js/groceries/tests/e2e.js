'use strict';

describe('Groceries', function () {
    var groceries, groceriesCount, groceryLabels, input, ptor, sleep, suggestions, suggestionsCount, suggestionsList;

    beforeEach(function () {
        ptor = protractor.getInstance();
        ptor.ignoreSynchronization = true;
        browser.get('/');
        groceries = element.all(by.css('#groceries li'));
        groceryLabels = element.all(by.css('#groceries li label'));
        input = element(by.css('#new-item'));
        sleep = 300;
        suggestions = element.all(by.css('#suggestions li'));
        suggestionsList = element(by.css('#suggestions'));
        groceries.count().then(function (count) {
            groceriesCount = count;
        });
        suggestions.count().then(function (count) {
            suggestionsCount = count;
        });
    });

    it('should display lists of groceries and suggestions that are toggled when the input is focused', function () {
        expect(groceriesCount).toBe(10);
        expect(suggestionsCount).toBe(10);
        expect(input.isPresent()).toBe(true);
        expect(groceries.first().isDisplayed()).toBe(true);
        expect(suggestionsList.isDisplayed()).toBe(false);
        input.sendKeys('');
        browser.driver.sleep(sleep);
        expect(input.getAttribute('id')).toEqual(browser.driver.switchTo().activeElement().getAttribute('id'));
        expect(groceries.first().isDisplayed()).toBe(false);
        expect(suggestionsList.isDisplayed()).toBe(true);
    });

    it('should delete a grocery item when it is swiped to the right', function () {
        // TODO: It's impossible to easily trigger a swipe event, therefore
        //       testing this functionality is difficult.
    });

    it('should cancel a delete when the cancel button is clicked', function () {
        // TODO: It's impossible to easily trigger a swipe event, therefore
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
        input.sendKeys('Apples');
        input.sendKeys(protractor.Key.ENTER);
        browser.driver.sleep(sleep);
        input.sendKeys(protractor.Key.ENTER);
        browser.driver.sleep(sleep);
        expect(groceryLabels.last().getInnerHtml()).toMatch('Apples');
    });

    it('should add an item with the same name, when a suggestions is clicked', function () {
        input.sendKeys('');
        browser.driver.sleep(sleep);
        suggestions.first().click();
        browser.driver.sleep(sleep);
        expect(groceryLabels.last().getInnerHtml()).toBe(suggestions.first().getInnerHtml());
    });
});
