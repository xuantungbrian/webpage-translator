class Utils {
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Splits text into manageable chunks without breaking sentences.
     * @param {string} text The long novel text
     * @param {number} maxLength Max characters per chunk (default 5000)
     */
    chunkText(text, maxLength = 5000) {
        const chunks = [];
        let currentChunk = "";

        // Split by paragraphs first to maintain story flow
        const paragraphs = text.split('\n');

        for (const paragraph of paragraphs) {
            // If adding this paragraph exceeds the limit
            if ((currentChunk.length + paragraph.length) > maxLength) {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = paragraph + "\n";
            } else {
                currentChunk += paragraph + "\n";
            }
        }

        if (currentChunk) chunks.push(currentChunk.trim());
        return chunks;
    }
}

export default Utils;