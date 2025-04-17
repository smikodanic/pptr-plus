# pptr-plus
> Enhancing Puppeteer with useful extra functionalities.

[![npm version](https://badge.fury.io/js/pptr-plus.svg)](https://www.npmjs.com/package/pptr-plus)

`pptr-plus` is a Node.js library that extends the capabilities of the popular [Puppeteer](https://pptr.dev/) library by providing a collection of convenient and commonly needed functions for web automation and scraping.

## Installation

```bash
$ npm install pptr-plus
````

## Usage

```javascript
/*** NodeJS script ***/
const puppeteer = require('puppeteer');
const PptrPlus = require('pptr-plus');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('[https://example.com](https://example.com)');

  const pp = new PptrPlus(page);

  // Example using checkTextOnPage
  try {
    await pp.checkTextOnPage('Example Domain');
    console.log('Text found on the page.');
  } catch (error) {
    console.error('Text not found:', error.message);
  }

  await browser.close();
})();
```

## API

### `constructor(page)`

Initializes a new `PptrPlus` instance.

  - `page`: The [Puppeteer Page](https://pptr.dev/api/puppeteer.page) or [Frame](https://pptr.dev/api/puppeteer.frame) object to extend.

<!-- end list -->

```javascript
const browser = await puppeteer.launch();
const page = await browser.newPage();
const pp = new PptrPlus(page);
```

### `async autoscroll(cssSel, delay = 3400)`

Autoscrolls a web page that loads content dynamically as the user scrolls down (e.g., Facebook feeds). It scrolls vertically to the last element defined by the `cssSel`. The scrolling stops when the text content of the last element remains the same after a scroll, indicating no new content has loaded.

  - `cssSel` (`string`): CSS selector of the last repetitive content element (e.g., `'table > tbody > tr:last-child'`).
  - `delay` (`number`, optional): The time interval in milliseconds between consecutive scrolls. Defaults to `3400`.

**Returns:** `Promise<void>`

```javascript
await pp.autoscroll('#post-container > div.post:last-child');
await pp.autoscroll('.comment', 2000);
```

### `async scrollToElement(page, selector)`

Scrolls the specified Puppeteer `Page` to a particular element defined by the CSS `selector`, making it visible.

  - `page` (`Page`): The Puppeteer `Page` object.
  - `selector` (`string`): The CSS selector of the element to scroll to.

**Returns:** `Promise<void>`

```javascript
await pp.scrollToElement(page, '#footer');
```

### `async scrollToBottom(page)`

Scrolls the specified Puppeteer `Page` to the very bottom of the document.

  - `page` (`Page`): The Puppeteer `Page` object.

**Returns:** `Promise<void>`

```javascript
await pp.scrollToBottom(page);
```

### `async scrollToBottomEasy(delay = 100)`

Scrolls the current page to the bottom incrementally. It scrolls by the window's `innerHeight` at each interval defined by `delay` until the bottom of the page is reached.

  - `delay` (`number`, optional): The time interval in milliseconds between consecutive scrolls. Defaults to `100`.

**Returns:** `Promise<void>`

```javascript
await pp.scrollToBottomEasy();
await pp.scrollToBottomEasy(500);
```

### `async selectOptionByText(sel, txt)`

Clicks a `<select>` element and then clicks the `<option>` within it that contains the specified text.

  - `sel` (`string`): CSS selector for the `<select>` tag.
  - `txt` (`string`): The text content of the `<option>` tag to select.

**Returns:** `Promise<void>`

```javascript
await pp.selectOptionByText('#country-select', 'United States');
```

### `async selectOptionByValue(sel, val)`

Selects an option in a `<select>` element by its `value` attribute.

  - `sel` (`string`): CSS selector for the `<select>` tag.
  - `val` (`string`): The `value` attribute of the `<option>` tag to select.

**Returns:** `Promise<void>`

```javascript
await pp.selectOptionByValue('#product-type', 'premium');
```

### `async clickElemWithText(xPath, txt, exactMatch)`

Clicks an HTML element identified by an XPath that contains specific text.

  - `xPath` (`string`): The base XPath to search within (e.g., `'//ul[@id="menu"]/li/a'`).
  - `txt` (`string`): The text content to look for within the element.
  - `exactMatch` (`boolean`, optional): If `true`, it will only match elements where the text content is exactly equal to `txt`. If `false` (default), it will match elements that contain `txt`.

**Returns:** `Promise<void>`

```javascript
await pp.clickElemWithText('//nav/ul/li/a', 'Products', true);
await pp.clickElemWithText('//div[@class="item"]', 'Add to cart');
```

### `async clickElemWithText_bubles(xPath, txt, exactMatch)`

Similar to `clickElemWithText`, but it dispatches a native 'click' event with `bubbles: true` and `cancelable: true`. This can be useful for triggering event listeners that are not directly attached to the target element.

  - `xPath` (`string`): The base XPath to search within (e.g., `'//ul[@id="menu"]/li/button'`).
  - `txt` (`string`): The text content to look for within the element.
  - `exactMatch` (`boolean`, optional): If `true`, it will only match elements where the text content is exactly equal to `txt`. If `false` (default), it will match elements that contain `txt`.

**Returns:** `Promise<void>`

```javascript
await pp.clickElemWithText_bubles('//div[@class="control"]/button', 'Submit');
```

### `checkTextOnPage(txt)`

Checks if the specified text is present anywhere within the `<body>` of the current page.

  - `txt` (`string`): The text to search for.

**Returns:** `Promise<boolean>` - Resolves if the text is found, rejects with an error if not found within the timeout.

```javascript
await pp.checkTextOnPage('Welcome to our website');
```

### `async waitURLContains(txt)`

Waits for a page response whose URL contains the specified text pattern.

  - `txt` (`string`): The text to check for in the URL.

**Returns:** `Promise<void>` - Resolves when a matching URL is encountered in a response.

```javascript
await pp.waitURLContains('/products/');
await pp.waitURLContains('checkout');
```

### `async inputClear(sel)`

Clears the value of an input field specified by the CSS selector. Useful before typing a new value.

  - `sel` (`string`): CSS selector of the input field.

**Returns:** `Promise<void>`

```javascript
await pp.inputClear('#search-box');
```

### `async inputType(sel, val)`

Types the specified value into an input field identified by the CSS selector. It first focuses on the element and then simulates keyboard input.

  - `sel` (`string`): CSS selector of the input field.
  - `val` (`string`): The value to type into the input field.

**Returns:** `Promise<void>`

```javascript
await pp.inputType('#username', 'john.doe');
await pp.inputType('#password', 'secure123');
```

### `async inputSetValue(sel, val)`

Sets the value of an input element directly. This can be used for various input types, including text, radio buttons, and checkboxes. For radio and checkbox inputs, it sets the `checked` property based on the `val`.

  - `sel` (`string`): CSS selector of the input element(s).
  - `val` (`string`): The value to set. For radio buttons and checkboxes, this is the `value` attribute to check.

**Returns:** `Promise<void>`

```javascript
await pp.inputSetValue('#email', 'test@example.com');
await pp.inputSetValue('input[name="gender"]', 'male'); // For radio buttons
await pp.inputSetValue('input[type="checkbox"]', 'agree'); // For checkboxes
```

### `async saveScreenshot(dirPath, fileName)`

Takes a full-page screenshot and saves it as a `.jpg` file in the specified directory. If the filename doesn't include the `.jpg` extension, it will be added automatically.

  - `dirPath` (`string`): The path to the directory where the screenshot will be saved (e.g., `'./screenshots'`). The directory will be created if it doesn't exist.
  - `fileName` (`string`): The name of the screenshot file (e.g., `'homepage.jpg'` or `'homepage'`).

**Returns:** `Promise<void>`

```javascript
await pp.saveScreenshot('./screenshots', 'home_page');
await pp.saveScreenshot('../../temp/shots', 'product_details.jpg');
```

### `async elementHandle2HTML(eh)`

Retrieves the `outerHTML` string of a given Puppeteer `ElementHandle`.

  - `eh` (`ElementHandle`): The Puppeteer `ElementHandle` to get the HTML from.

**Returns:** `Promise<string>` - The outer HTML of the element.

```javascript
const header = await page.$('h1');
const headerHTML = await pp.elementHandle2HTML(header);
console.log(headerHTML);
```

### `async cookieSave(cookie_file_path)`

Saves the current browser cookies to a JSON file.

  - `cookie_file_path` (`string`): The path to the JSON file where cookies will be saved (e.g., `'./cookies.json'`). The file and any necessary directories will be created.

**Returns:** `Promise<void>`

```javascript
await pp.cookieSave('./session_cookies.json');
```

### `async cookieTake(cookie_file_path)`

Loads cookies from a JSON file and sets them in the current browser session.

  - `cookie_file_path` (`string`): The path to the JSON file containing the saved cookies.

**Returns:** `Promise<boolean>` - Returns `true` if the cookie file was found and cookies were set, `false` otherwise.

```javascript
await pp.cookieTake('./session_cookies.json');
```

### `async storageSave(storage_file_path, storage_type = 'localStorage')`

Saves either the `localStorage` or `sessionStorage` data from the browser to a JSON file.

  - `storage_file_path` (`string`): The path to the JSON file where the storage data will be saved (e.g., `'./local_storage.json'`).
  - `storage_type` (`string`, optional): The type of storage to save. Can be `'localStorage'` (default) or `'sessionStorage'`.

**Returns:** `Promise<void>`

```javascript
await pp.storageSave('./local_data.json', 'localStorage');
await pp.storageSave('./session_data.json', 'sessionStorage');
```

### `async storageTake(storage_file_path, storage_type = 'localStorage')`

Loads `localStorage` or `sessionStorage` data from a JSON file and sets it in the current browser session.

  - `storage_file_path` (`string`): The path to the JSON file containing the saved storage data.
  - `storage_type` (`string`, optional): The type of storage to load. Can be `'localStorage'` (default) or `'sessionStorage'`.

**Returns:** `Promise<void>`

```javascript
await pp.storageTake('./local_data.json', 'localStorage');
await pp.storageTake('./session_data.json', 'sessionStorage');
```

## License
The software is licensed under [AGPL-3](https://www.google.com/search?q=LICENSE).

Creator website: [www.mikosoft.info](https://www.mikosoft.info/)
