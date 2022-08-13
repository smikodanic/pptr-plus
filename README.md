# pptr-plus
> Some extra functions which are missing in the Puppeteer (pptr.dev) library.



## Installation
```bash
$ npm install --save pptr-plus
```


## Example
```js
/*** NodeJS script ***/
const PptrPlus = require('pptr-plus');
const pp = new PptrPlus(page);
await pp.checkTextOnPage('Bitcoin goes up')
```



## API

#### constructor(page)
The *page* is puppeteer Page object.

#### async autoscroll(cssSel, delay = 3400)
Autoscroll the web page where content is loaded dynamically as the user scroll down. For example the facebook posts.
Scroll vertically to the last element.
The scroll will stop when the text content of the last element is equal to the previous element text content. What means there's no new content on the page.
- *@param {string} cssSel* - CSS selector of the last repetitive content, for example table > tbody > tr:last-child
- *@param {number} delay* - the time interval between every consecutive scroll


#### async scrollToBottom(delay = 100)
Scroll the web page to bottom. The page will scroll for innerHeight for every delay miliseconds until it reach the end.
- *@param {number} delay* - the time interval between every consecutive scroll


#### async selectOptionByText(sel, txt)
Click the SELECT tag and then click OPTION with the text
- *@param {string} sel* - css selector for SELECT tag
- *@param {string} txt* - text contained in the OPTION tag


#### async selectOptionByValue(sel, val)
Select the option by the value
- *@param {string} sel* - css selector for SELECT tag
- *@param {string} val* - the OPTION tag value attribute


#### async clickElemWithText(xPath, txt, exactMatch)
Click the element defined by the xPath which contains text
- *@param {string} xPath* - part of the xPath - //ul[@id="allBsnsList"]/li/a
- *@param {string} txt* - text contained in the HTML element
- *@param {boolean} exactMatch* - if true find exact word match


#### async clickElemWithText_bubles(xPath, txt, exactMatch)
Click the element defined by the xPath which contains text
- *@param {String} xPath* - part of the xPath - //ul[@id="allBsnsList"]/li/a
- *@param {Object} txt* - text contained in the HTML element
- *@param {Boolean} exactMatch* - if true find exact word match


#### checkTextOnPage(txt)
Check if the text is contained on the page.
- *@param {string} txt* - text contained in the whole page's HTML


#### async waitURLContains(txt)
Wait for the URL which contains "txt" pattern.
- *@param {string} txt* - text contained in the URL


#### async inputClear(sel)
Clear the input field. Useful before typing new value into the INPUT text field.
- *@param {string} sel* - css selector of the INPUT filed


#### async inputType(sel, val)
Fill the input field by typing into it
- *@param {string} sel* - css selector
- *@param {string} val* - input value

#### async saveScreenshot(dirPath, fileName)
Create the screenshot image and save it into the folder. The file will be saved as .jpg.
- *@param {string} dirPath* - path to the directory where screenshot will be saved, for example '../../tmp/screenshots/progressive_commercialAuto/'
- *@param {string} fileName* - the screenshot file name, for example 'myScreenshot.jpg' or just 'myScreenshot'


#### async cookieSave(cookie_file_path)
Save cookie data from browser to file.
- *@param {string} cookie_file_path* - dir/fileName.json


#### async cookieTake(cookie_file_path)
Get cookie data from the file and set browser's cookie.
- *@param {string} cookie_file_path* - dir/fileName.json




### License
The software licensed under [AGPL-3](LICENSE).
