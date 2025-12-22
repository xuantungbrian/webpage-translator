import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { writeFile } from 'node:fs/promises';
import Utils from './services/utils.js';
import Translator from './services/translator.js';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

puppeteer.use(StealthPlugin());

async function extractNovelText(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const utils = new Utils();
    const translator = new Translator();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the reader content to actually appear
        await page.waitForSelector('.muye-reader-content', { timeout: 10000 });

        const novelData = await page.evaluate(() => {
            // 1. Target the main content area using the class that is likely stable
            const container = document.querySelector('.muye-reader-content');
            
            if (!container) return "Content not found";

            // 2. Get all <p> tags inside
            const paragraphs = Array.from(container.querySelectorAll('p'));

            // 3. Map to text, trimming whitespace and filtering out empty lines
            // This also helps if they inject empty <p> tags as "noise"
            return paragraphs
                .map(p => p.innerText.trim())
                .filter(text => text.length > 0)
                .join('\n\n'); 
        });
        
        
        // 2. Split into chunks (approx 5000 chars each)
        const chunks = utils.chunkText(novelData, 5000);
        console.log(`Split into ${chunks.length} chunks. Starting translation...`);

        let finalTranslation = "";

        // 3. Translate each chunk sequentially
        for (let i = 0; i < chunks.length; i++) {
            console.log(`Translate Progress: ${i + 1}/${chunks.length}...`);
            
            const translatedChunk = await translator.translate(chunks[i]);
            
            if (translatedChunk) {
                finalTranslation += translatedChunk + "\n\n";
            }
            
            // Brief pause to avoid rate limits on the free tier
            await utils.sleep(10000); 
        }

        console.log("All chunks translated!");
        
        const fileName = 'output/translated_novel.txt';
        
        // Write the final translation to the file
        // The 'utf8' encoding ensures characters are saved correctly
        await writeFile(fileName, finalTranslation, 'utf8');
        
        console.log(`Translation saved to ${fileName}`);
    } catch (error) {
        console.error("Translation failed:", error);
    }
}


extractNovelText(process.env.TARGET_URL);