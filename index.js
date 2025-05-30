const fse = require('fs-extra');
const path = require('path');


/**
 * Puppeteer extension methods.
 */
class PptrPlus {

  /**
   * @param {Page|Frame} page - puppeteer Page or Frame object
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Autoscroll the web page where content is loaded dynamically as the user scroll down. For example the facebook posts.
   * Scroll vertically to the last element.
   * The scroll will stop when the text content of the last element is equal to the previous element text content. What means there's no new content on the page.
   * @param {string} cssSel - CSS selector of the last repetitive content, for example table > tbody > tr:last-child
   * @param {number} delay - the time interval between every consecutive scroll
   * @returns {void}
   */
  async autoscroll(cssSel, delay = 3400) {
    return await this.page.evaluate((cssSel, delay) => {
      return new Promise((resolve, reject) => {
        let lastElemContent;
        let scrollCounter = 0;
        const ID = setInterval(async () => {
          const elem = document.querySelector(cssSel);

          if (lastElemContent === elem.textContent) {
            clearInterval(ID);
            resolve({ lastElemContent, scrollCounter });
            return;
          }

          // scroll to last element
          elem.scrollIntoView();

          // scroll to up to initiate new content to load
          await new Promise(r => setTimeout(r, 700));
          window.scrollBy(0, -10);

          lastElemContent = elem.textContent;
          scrollCounter++;

        }, delay);
      });
    }, cssSel, delay);
  }


  /**
   * Scrolls the specified Puppeteer `Page` to a particular element defined by the CSS `selector`, making it visible.
   * @param {Page} page - The Puppeteer `Page` object.
   * @param {string} selector - The CSS selector of the element to scroll to.
   * @param {'start'|'end'} position - where scrolled element should be: 'start' means on the top, 'end' means on the bottom
   * @returns {Promise<void>}
   */
  async scrollToElement(page, selector, position = 'end') {
    await page.evaluate((selector, position) => {
      const element = document.querySelector(selector);
      if (element) { element.scrollIntoView({ behavior: 'smooth', block: position, inline: 'nearest' }); }
      else { throw new Error(`Element with selector "${selector}" not found.`); }
    }, selector, position);
  }


  /**
   * Scrolls the specified Puppeteer `Page` to the very bottom of the document.
   * @param {Page} page - The Puppeteer `Page` object.
   * @returns {Promise<void>}
   */
  async scrollToBottom(page) {
    await page.evaluate(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    });
  }


  /**
     * Scroll the web page to bottom.
     * The page will scroll for innerHeight for every delay miliseconds until it reach the end.
     * @param {number} delay - the time interval between every consecutive scroll
     * @returns {void}
     */
  async scrollToBottomEasy(delay = 100) {
    return await this.page.evaluate((delay) => {
      return new Promise((resolve, reject) => {
        let scrollTop = -1;
        let scrollCounter = 0;

        const ID = setInterval(async () => {
          // console.log('scrollCounter::', scrollCounter, document.documentElement.scrollTop, scrollTop);
          window.scrollBy(0, window.innerHeight);

          if (document.documentElement.scrollTop !== scrollTop) {
            scrollTop = document.documentElement.scrollTop;
            scrollCounter++;
          } else {
            clearInterval(ID);
            resolve({ scrollTop, scrollCounter });
            return;
          }

        }, delay);

      });
    }, delay);
  }



  /**
   * Click the SELECT tag and then click OPTION with the text
   * @param {string} sel - css selector for SELECT tag
   * @param {string} txt - text contained in the OPTION tag
   * @returns {void}
   */
  async selectOptionByText(sel, txt) {
    // click on SELECT
    await this.page.waitForSelector(sel, 5000);
    // console.log(`Click SELECT "${sel}"`);
    this.page.click(sel);

    // wait to open option
    await new Promise(resolve => setTimeout(resolve, 1300));

    // click OPTION with the "txt"
    // console.log(`Choose the OPTION with the text "${txt}"`);
    await this.page.evaluate(obj => {
      const select_tag = document.querySelector(obj.sel);
      const elems_obj = select_tag.querySelectorAll('option');
      const selected_option = [...elems_obj].find(option => option.text === obj.txt);
      selected_option.selected = true;

      // activate onChange() on SELECT
      const event = new Event('change');
      select_tag.dispatchEvent(event);
    }, { sel, txt });

    await new Promise(resolve => setTimeout(resolve, 1300));

    await this.page.click('body');

    await new Promise(resolve => setTimeout(resolve, 1300));
  }


  /**
   * Select the option by the value
   * @param {string} sel - css selector for SELECT tag
   * @param {string} val - the OPTION tag value attribute
   * @returns {void}
   */
  async selectOptionByValue(sel, val) {
    await this.page.select(sel, val);
  }



  /**
   * Click the element defined by the xPath which contains text
   * @param {string} xPath - part of the xPath - //ul[@id="allBsnsList"]/li/a
   * @param {string} txt - text contained in the HTML element
   * @param {boolean} exactMatch - if true find exact word match
   * @returns {void}
   */
  async clickElemWithText(xPath, txt, exactMatch) {
    let xPath2;
    if (!!exactMatch) { xPath2 = xPath + `[text()="${txt}"]`; }
    else { xPath2 = xPath + `[contains(text(), "${txt}")]`; }

    // console.log(`--click ${xPath2}`);
    await this.page.waitForXPath(xPath2, { timeout: 13000 });

    const [elem_EH] = await this.page.$x(xPath2);
    if (!!elem_EH) {
      await elem_EH.click(); // Error: Node is either not visible or not an HTMLElement
      // await elem_EH.evaluate(elem => {
      //   console.log('elem::', elem);
      //   elem.focus();
      //   elem.style.visibility = 'visible';
      //   elem.style.selected = 'selected';
      //   elem.click();
      // });
    }
    else { throw new Error(`No element with xPath ${xPath2}`); }
  }



  /**
   * Click the element defined by the xPath which contains text
   * @param {String} xPath - part of the xPath - //ul[@id="allBsnsList"]/li/a
   * @param {Object} txt - text contained in the HTML element
   * @param {Boolean} exactMatch - if true find exact word match
   */
  async clickElemWithText_bubles(xPath, txt, exactMatch) {
    let xPath2;
    if (!!exactMatch) { xPath2 = xPath + `[text()="${txt}"]`; }
    else { xPath2 = xPath + `[contains(text(), "${txt}")]`; }

    // console.log(`--click ${xPath2}`);
    await this.page.waitForXPath(xPath2, 5000);

    const [elem_EH] = await this.page.$x(xPath2);

    if (elem_EH) {
      await elem_EH.evaluate(elem_DOM => {
        const clickEvent = new Event('click', { bubbles: true, cancelable: true });
        elem_DOM.dispatchEvent(clickEvent);
      });
    } else { throw new Error(`No element with xPath ${xPath2}`); }
  }



  /**
   * Check if the text is contained on the page.
   * @param {string} txt - text contained in the whole page's HTML
   * @returns {boolean}
   */
  checkTextOnPage(txt) {
    return this.page.waitForFunction(async txt => {
      const url = document.URL;
      const tf = document.querySelector('body').innerText.includes(txt);
      if (tf) { return true; }
      else { throw new Error(`Page ${url} does not contain "${txt}" text!`); }
    }, { timeout: 60000 }, txt);
  }



  /**
   * Wait for the URL which contains "txt"
   * @param {string} txt - text contained in the URL
   * @returns {boolean}
   */
  async waitURLContains(txt) {
    await this.page.waitForResponse(response => {
      // console.log('response.url()::', response.url());
      return response.url().includes(txt);
    });

    // await page.waitForRequest(request => {
    //   console.log('request.url()::', request.url());
    //   // return request.url().includes(txt);
    //   return true;
    // });
  }



  /**
   * Clear the input field. Useful before typing new value into the INPUT text field.
   * @param {string} sel - css selector of the INPUT filed
   * @returns {void}
   */
  async inputClear(sel) {
    await this.page.evaluate(sel => {
      document.querySelector(sel).value = '';
    }, sel);
  }



  /**
   * Fill the input field by typing into it
   * @param {string} sel - css selector
   * @param {string} val - input value
   * @returns {void}
   */
  async inputType(sel, val) {
    await this.page.waitForSelector(sel);
    await this.page.click(sel);
    await this.page.keyboard.type(val);
  }


  /**
   * Set the value of the input field
   * @param {string} sel - css selector
   * @param {string} val - input value
   * @returns {void}
   */
  async inputSetValue(sel, val) {
    await new Promise(r => setTimeout(r, 400));
    await this.page.$$eval(sel, (elems, val2) => {
      const elem = elems[0];
      if (elem.type === 'radio') {
        elems.forEach(el => {
          if (el.value === val2) { el.checked = true; }
        });
      } else if (elem.type === 'checkbox') {
        if (elem.value === val2) { elem.checked = true; }
      } else {
        elem.value = val2;
      }
    }, val);
  }



  /**
   * Create the screenshot image and save it into the folder. The file will be saved as .jpg.
   * @param {string} dirPath - path to the directory where screenshot will be saved, for example '../../tmp/screenshots/progressive_commercialAuto/'
   * @param {string} fileName - the screenshot file name, for example 'myScreenshot.jpg' or just 'myScreenshot'
   * @returns {void}
   */
  async saveScreenshot(dirPath, fileName) {
    await fse.ensureDir(dirPath);

    const fileWithExtension = /\.jpg/.test(fileName) ? fileName : fileName + '.jpg';
    const filePath = path.join(dirPath, fileWithExtension);

    await this.page.screenshot({
      path: filePath,
      type: 'jpeg',
      quality: 70,
      fullPage: true
    });
    // console.log(`Screenshot "${file}" created.`);
  }




  /**
   * Get HTML string from the puppeteer's ElementHandle.
   * Example:
   * const modal_EH = await page.waitForSelector('div#ModalUsersLists___BV_modal_body_', { timeout: 8000 });
   * const modal_HTML = await pptrPlus.elementHandle2HTML();
   * @param {ElementHandle} eh
   * @return {string}
   */
  async elementHandle2HTML(eh) {
    const outerHTML = await (await eh.getProperty('outerHTML')).jsonValue();
    return outerHTML;
  }



  /*********** COOKIES ************/
  /**
   * Save cookie data from browser to file.
   * @param {string} cookie_file_path - dir/fileName.json
   * @returns {void}
   */
  async cookieSave(cookie_file_path) {
    const cookies_arr = await this.page.cookies() || [];
    await fse.ensureFile(cookie_file_path);
    await fse.writeJson(cookie_file_path, cookies_arr, { spaces: 2 });
  }


  /**
   * Get cookie data from the file and set browser's cookie.
   * @param {string} cookie_file_path - dir/fileName.json
   * @returns {void}
   */
  async cookieTake(cookie_file_path) {
    if (!fse.existsSync(cookie_file_path)) { return false; }

    const cookies_arr = await fse.readJson(cookie_file_path) || [];
    if (cookies_arr.length !== 0) {
      for (const cookie of cookies_arr) {
        await this.page.setCookie(cookie);
      }
    }

    return true;
  }


  /*********** LOCAL & SESSION STORAGE************/
  /**
   * Save local or session storage data from browser to file.
   * @param {string} storage_file_path - dir/fileName.json
   * @param {string} storage_type - 'localStorage' | 'sessionStorage'
   * @returns {void}
   */
  async storageSave(storage_file_path, storage_type = 'localStorage') {
    await fse.ensureFile(storage_file_path);
    const storageObj = await this.page.evaluate(() => Object.assign({}, window[storage_type]));
    if (!!storageObj) {
      await fse.writeJson(storage_file_path, storageObj, { spaces: 2 });
    }
  }


  /**
   * Get storage data from file and set browser's local or session storage.
   * @param {string} storage_file_path - dir/fileName.json
   * @param {string} storage_type - 'localStorage' | 'sessionStorage'
   * @returns {void}
   */
  async storageTake(storage_file_path, storage_type = 'localStorage') {
    const storageObj = await fse.readJson(storage_file_path) || {};
    if (Object.keys(storageObj).length) {
      await this.page.evaluate((storageObj) => {
        for (const [keyName, keyValue] of Object.entries(storageObj)) {
          window[storage_type].setItem(keyName, keyValue);
        }
      }, storageObj);
    }
  }



}



module.exports = PptrPlus;
