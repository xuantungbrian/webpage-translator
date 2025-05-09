const puppeteer = require('puppeteer');
const Utils = require('../utils')

class Screenshot {
  utils = new Utils();

  constructor() {}

  // Screenshot page
  async captureScreenshot(url, imagePath, options = {}) {
    let browser;
    
    try {
      // Set default options or use provided ones
      const {
        waitUntil = 'networkidle2',
        delay = 1000000,
        fullPage = true,
        viewport = { width: 1280, height: 800 },
        puppeteerLaunchOptions = { headless: false, slowMo: 50 },
        screenshotOptions = {}
      } = options;

      // Launch browser with provided options or defaults
      browser = await puppeteer.launch(puppeteerLaunchOptions);
      const page = await browser.newPage();

      // Set custom headers
      const requestHeaders = {
        'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        Referer: 'https://www.google.com/',
      };
      await page.setExtraHTTPHeaders({ ...requestHeaders });

      // Set request interception
      await page.setRequestInterception(true);

      // block non-essential third-party scripts
      page.on('request', (request) => {
          const url = request.url();

          // specify patterns for scripts you want to block
          if (
              url.includes('analytics') ||
              url.includes('ads') ||
              url.includes('social')
          ) {
              // block the request
              request.abort();
          } else {
              // allow the request
              request.continue();
          }
      });
      
      // Set viewport
      await page.setViewport(viewport);
      
      // Navigate to URL
      await page.goto(url, { 
        waitUntil: waitUntil,
        timeout: delay // 60 seconds timeout for page load
      });

      await this.utils.sleep(100000)

      // await setTimeout(async () => {
      //   // Take screenshot
      //   await page.screenshot({ 
      //     path: imagePath,
      //     fullPage: fullPage,
      //     ...screenshotOptions // allow overriding any screenshot options
      //   });
      // }, 10000)
      

    } catch (error) {
      console.error(`Error capturing screenshot for ${url}:`, error);
      throw error;
    } finally {
      if (browser) {
        await browser.close().catch(e => console.error('Error closing browser:', e));
      }
    }
  }
}

module.exports = Screenshot