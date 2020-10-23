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

  it('Then: I can mark a book as finished', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('c++');
    await form.submit();

    // Add Book to List
    const items = await $$('[data-testing="book-item"]').first();
    await items.getWebElement().findElement(By.tagName('button')).click();

    // Open list
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    // Mark Book as Finished
    const markFinishedButton = await $$('[data-testing="reading-list-content"]').first().getWebElement().findElement(By.css('.reading-list-item--details--complete-button'));
    await markFinishedButton.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-content"]'),
        'Finished on'
      )
    );
  });
});
