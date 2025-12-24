import translatorService from '../services/translatorService.js';

const translateChapter = async (req, res) => {
    try {
        const { bookId, chapterId } = req.params;
        const url = `https://www.69shuba.com/txt/${bookId}/${chapterId}`;
        const rawText = await translatorService.getText(url);
        const translatedText = await translatorService.translate(rawText);
        res.status(200).json({
            success: true,
            data: translatedText
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    translateChapter
};