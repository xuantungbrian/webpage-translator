import { GoogleGenerativeAI } from "@google/generative-ai";

class Translator {
    constructor() {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const systemInstruction = `
        <role>
        You are an expert web novel translator specializing in Chinese-to-Vietnamese localization.
        </role>
        
        <rules>
        1. TONE: Natural, flowing Vietnamese suitable for web novels.
        2. DIALOGUE: Use appropriate pronouns (Ta, Ngươi, Hắn, Nàng, v.v.) based on character status.
        3. NAMES: Do NOT translate character names into Hán-Việt if they have an English/Genshin equivalent.
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
    }

    async translate(text) {
        try {
            const result = await this.model.generateContent(text);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Translation Error:", error);
            return null;
        }
    }
}

export default Translator;