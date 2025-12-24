import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import Utils from '../utils/utils.js';

class translatorService {
    constructor() {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const systemInstruction = `
        <role>
        You are an expert web novel translator specializing in Chinese-to-Vietnamese localization.
        </role>
        
        <rules>
        1. TONE: Natural, flowing Vietnamese suitable for web novels.
        2. DIALOGUE & PRONOUNS:
            - Use "Ta - Ngươi" for general xianxia/fantasy settings or when characters are of different status.
            - Use "Hắn" for 'him', "Nàng" for 'her', "Y" for neutral/third person.
            - NEVER use modern pronouns like "Tôi, Bạn, Anh, Em" unless specifically requested.
            - Stay consistent: If a character starts as "Ta", they must remain "Ta" throughout the scene.
        3. NAMES: Do NOT translate character names into Hán-Việt if they have an English/Genshin equivalent. Convert main character name to English.
        4. FORMAT: Keep all original paragraph breaks and punctuation.
        </rules>
        
        <glossary>
        - 璃月 -> Liyue (English name)
        - 钟离 -> Zhongli (English name)
        - 神之眼 -> Vision (Genshin term)
        - 冒险家协会 -> Hoạt động Hiệp hội Nhà mạo hiểm
        </glossary>
        `;

        this.model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction
        });
        
        this.utils = new Utils(); //Might want to change this later
    }

    async geminiTranslate(text) {
        try {
            const result = await this.model.generateContent(text);
            const response = result.response;
            return response.text();
        } catch (error) {
            console.error("Translation Error:", error);
            return null;
        }
    }

    async translate(rawText) {
        const chunks = this.utils.chunkText(rawText, 5000);
        let finalTranslation = "";
        for (let i = 0; i < chunks.length; i++) {
            const translatedChunk = await this.geminiTranslate(chunks[i]);
            if (translatedChunk) {
                finalTranslation += translatedChunk + "\n\n";
            }
        }
        return finalTranslation;
    }

    async getText(url) {
        puppeteer.use(StealthPlugin());
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
            await page.goto(url, { waitUntil: 'networkidle2' });

            const contentSelector = 'body > div.container > div.mybox > div.txtnav';
            await page.waitForSelector(contentSelector, { timeout: 10000 });

            const novelData = await page.evaluate((selector) => {
                const container = document.querySelector(selector);
                if (!container) return "Content not found";

                const tempContainer = container.cloneNode(true);
                const unwanted = tempContainer.querySelectorAll('div, h1');
                unwanted.forEach(el => el.remove());

                return tempContainer.innerText
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .join('\n\n');
            }, contentSelector);

            return novelData;
        } catch (error) {
            throw error;
        } finally {
            await browser.close();
        }
    }

    async writeFile(text) {
        const fileName = 'output/translated_novel.txt';
        await writeFile(fileName, text, 'utf8');
    }
}

const translatorServiceInstance = new translatorService();
export default translatorServiceInstance;