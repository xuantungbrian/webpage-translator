const puppeteer = require('puppeteer');
const Tesseract = require('tesseract.js');
const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config()

// Screenshot page
async function captureScreenshot(url, imagePath, options = {}) {
  let browser;
  try {
    // Set default options or use provided ones
    const {
      waitUntil = 'networkidle2',
      delay = 60000,
      fullPage = true,
      viewport = { width: 1280, height: 800 },
      puppeteerLaunchOptions = { headless: 'new' },
      screenshotOptions = {}
    } = options;

    // Launch browser with provided options or defaults
    browser = await puppeteer.launch(puppeteerLaunchOptions);
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport(viewport);
    
    // Navigate to URL
    await page.goto(url, { 
      waitUntil: waitUntil,
      timeout: delay // 60 seconds timeout for page load
    });

    // Take screenshot
    await page.screenshot({ 
      path: imagePath,
      fullPage: fullPage,
      ...screenshotOptions // allow overriding any screenshot options
    });

  } catch (error) {
    console.error(`Error capturing screenshot for ${url}:`, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close().catch(e => console.error('Error closing browser:', e));
    }
  }
}

// OCR with Tesseract
async function extractChineseText(imagePath) {
  const result = await Tesseract.recognize(imagePath, 'chi_sim', {
    logger: (m) => console.log(m.status)
  });
  return result.data.text;
}

// Translate using LibreTranslate
async function translateToEnglish(text) {
  const response = await axios.post(process.env.TRANSLATOR_URL, {
    q: text,
    source: 'zh',
    target: 'en',
    format: 'text'
  }, {
    headers: { 'Content-Type': 'application/json' }
  });

  return response.data.translatedText;
}

// Main code
(async () => {
  const targetUrl = process.env.TARGET_URL;
  const screenshotPath = 'chapter.png';

  console.log('Capturing screenshot...');
  await captureScreenshot(targetUrl, screenshotPath);

  console.log('Extracting text...');
  const chineseText = await extractChineseText(screenshotPath);

  console.log('Translating text...');
  const englishText = await translateToEnglish(chineseText);

  fs.writeFileSync('translated_chapter.txt', englishText);
  console.log('✅ Translation saved to translated_chapter.txt');
})();
