const Tesseract = require('tesseract.js');
class OCR {
  constructor() {}

  async extractChineseText(imagePath) {
    const result = await Tesseract.recognize(imagePath, 'chi_sim', {
      logger: (m) => console.log(m.status)
    });
    return result.data.text;
  }
}

module.exports = OCR