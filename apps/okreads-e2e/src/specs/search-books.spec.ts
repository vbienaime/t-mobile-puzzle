import { $, $$, browser, By, ExpectedConditions } from 'protractor';

describe('When: Use the search feature', () => {
  it('Then: I should be able to search books by title', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).toBeGreaterThan(1);
  });

  it('Then: I should see search results as I am typing', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const input = await $('input[type="search"]');

    await input.sendKeys('ang');
    const angBookItems = await $$('[data-testing="book-item"]');
    const angFirstResult = angBookItems[0]?.getWebElement();
    const angFirstResultTitle = await angFirstResult?.findElement(By.className('book--title')).getText();
    
    await input.sendKeys('ular');
    const angularBookItems = await $$('[data-testing="book-item"]');
    const angularFirstResult = angularBookItems[0]?.getWebElement();
    const angularFirstResultTitle = await angularFirstResult?.findElement(By.className('book--title')).getText();

    expect(angFirstResultTitle.length).toBeGreaterThan(1);
    expect(angularFirstResultTitle.length).toBeGreaterThan(1);
    expect(angFirstResultTitle).not.toBe(angularFirstResultTitle);
    
  });
});
