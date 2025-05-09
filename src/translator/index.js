const axios = require('axios');

class Translator {
  constructor() {}
  
  async translateToEnglish(text) {
    try {
      const response = await axios.post(process.env.TRANSLATOR_URL, {
        q: text,
        source: 'zh',
        target: 'en',
        format: 'text'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data.translatedText;
    } catch(err) {
      console.log(err.response.data.error)
      return
    }  
  }
}

module.exports = Translator