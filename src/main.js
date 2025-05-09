const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config({ path: './config/.env' })
const Screenshot = require('./screenshot')
const OCR = require('./ocr')
const Translator = require('./translator');

const screenshot = new Screenshot();
const ocr = new OCR();
const translator = new Translator();

(async () => {
  const targetUrl = process.env.TARGET_URL;
  const screenshotPath = 'chapter.png';
  console.log(targetUrl)

  console.log('Capturing screenshot...');
  await screenshot.captureScreenshot(targetUrl, screenshotPath);

  console.log('Extracting text...');
  const chineseText = await ocr.extractChineseText(screenshotPath);
  if (!chineseText) {
    console.log("Cannot extract any text, please check the image for more information")
    return
  }
  
  console.log('Translating text...');
  const englishText = await translator.translateToEnglish(chineseText);
  if (!englishText) {
    console.log("Cannot translate any text, please check the image for more information")
    return
  }
  
  fs.writeFileSync('translated_chapter.txt', englishText);
  console.log('✅ Translation saved to translated_chapter.txt');
})();
