import { $, $$, By, browser, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });
});

describe('When: I use the undo feature in the reading list feature', () => {
  it('Then: The reading list should be returned to the previous state', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('python');
    await form.submit();

    // Add Book to List
    const items = await $$('[data-testing="book-item"]').first();
    await items.$$('[data-testing="add-book"]').first().click();

    // Open list
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
    const readingListCountBefore = await $$('[data-testing="reading-list-content"]').first().all(By.css('.reading-list-item')).length;

    // Remove Book
    const removeBookButton = await $$('[data-testing="reading-list-content"]').first().$$('[data-testing="remove-book"]').first();
    await removeBookButton.click();

    // Undo Removal of Book
    const undoButton = await $('.mat-simple-snackbar-action').getWebElement();
    await undoButton.click();
    const readingListCountAfter = await $$('[data-testing="reading-list-content"]').first().all(By.css('.reading-list-item')).length;

    expect(readingListCountBefore).toEqual(readingListCountAfter);

    // Clear state
    await removeBookButton.click();
  });

});
