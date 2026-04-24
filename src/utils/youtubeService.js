import { API_BASE_URL } from './api';

/**
 * Extracts video ID from various YouTube URL formats
 * @param {string} url 
 * @returns {string|null} videoId
 */
export const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Fetches transcript from our backend server (which uses youtube-transcript)
 * @param {string} videoId 
 * @returns {Promise<{transcript: string}>}
 */
export const fetchTranscript = async (videoId) => {
    try {
        const url = `https://youtube.com/watch?v=${videoId}`;
        const SUPADATA_API_KEY = "sd_88d05e37fc02eeeeb74f00977b663a8c";
        
        const response = await fetch(`https://api.supadata.ai/v1/youtube/transcript?url=${encodeURIComponent(url)}&text=true`, {
            method: 'GET',
            headers: {
                'x-api-key': SUPADATA_API_KEY
            }
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || 'Failed to fetch transcript. Ensure the video has captions available.');
        }

        const data = await response.json();
        const transcriptText = data.content || data.text || data.transcript || JSON.stringify(data);

        if (!transcriptText || transcriptText.trim() === '') {
            throw new Error('No captions found for this video.');
        }

        return { transcript: transcriptText };
    } catch (error) {
        console.error("YouTube Service Error:", error);
        throw error;
    }
};

/**
 * Start the AUREM Lens analysis pipeline
 * Returns a prompt optimized for Gemini to generate all study materials
 */
export const generateLensPrompt = (transcript) => {
    return `
You are AUREM LENS — an elite cognitive augmentation system.
Your goal is to transform this raw video transcript into a mastered study resource.

TRANSCRIPT:
${transcript.slice(0, 50000)} [TRUNCATED IF TOO LONG]

GENERATE A JSON OBJECT with these exact keys:
1. "summary": A crisp 150-200 word executive summary.
2. "notes": Comprehensive study notes in Markdown format. Use headers (#, ##), bullet points, and bold text for key concepts. Box definitions.
3. "flashcards": An array of 10 objects { "front": "question", "back": "answer" }.
4. "mindmap": A hierarchical JSON tree structure { "name": "Central Topic", "children": [{ "name": "Subtopic", "children": [...] }] }.
5. "quiz": An array of 10 objects { "question": "...", "options": ["A", "B", "C", "D"], "answer": "The full correct answer text", "explanation": "Why this is correct" }.

RULES:
- JSON ONLY. No markdown fencing around the JSON.
- Tone: Elite, intelligent, structured.
- No fluff.
`;
};
