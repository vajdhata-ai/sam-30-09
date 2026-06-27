import { callAI } from './apiRouter';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const convertToBase64 = (fileObj) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileObj);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

export const convertPdfToImages = async (arrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = Math.min(pdf.numPages, 10); // Limit to 10 pages
    const images = [];

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        images.push(canvas.toDataURL('image/jpeg', 0.6));
    }

    return images;
};

const SYSTEM_PROMPT = `You are SAMVADA LENS — an elite cognitive augmentation system.
Your goal is to transform the user's raw inputs (text, transcripts, or images of notes) into a master-level study resource.

GENERATE A JSON OBJECT with these exact keys:
1. "topic": A 2-5 word highly specific title for this module.
2. "summary": A crisp 150-200 word executive summary.
3. "notes_basic": Foundational notes focusing on what and why. (Markdown)
4. "notes_intermediate": Detailed notes focusing on application, analysis, and nuanced differences. (Markdown)
5. "notes_advanced": Highly complex notes focusing on synthesis, edge cases, numerical proofs, or real-world case studies. (Markdown)
6. "flashcards": An array of 20 objects { "question": "...", "answer": "..." }. Keep answers extremely concise.
7. "mindmap": A hierarchical JSON tree object with the format { "name": "Central Topic", "children": [{ "name": "Subtopic", "children": [...] }] }. Max 3 levels deep.

RULES:
- JSON ONLY. Do not wrap the JSON in markdown fencing.
- Tone: Elite, intelligent, highly structured.
- Optimize notes for academic density. Box definitions, bold key terms.
- CRITICAL: Standard JSON syntax only. DO NOT use triple quotes (\`\"\"\"\`) or unescaped newlines in strings. Use standard "\\n" for line breaks inside strings.`;

export const generateContextFromText = async (textContent) => {
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Process this content:\n\n${textContent.slice(0, 50000)}` }
    ];

    const result = await callAI(messages, null, false, { temperature: 0.3, response_format: { type: "json_object" } });
    let text = result.choices?.[0]?.message?.content || "{}";
    
    // Clean JSON
    const match = text.match(/\{[\s\S]*\}/);
    if (match) text = match[0];
    
    return JSON.parse(text);
};

export const generateContextFromImages = async (images) => {
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
            role: 'user',
            content: [
                { type: "text", text: "Process these documents/notes into the required JSON mastery format." },
                ...images.map(img => ({ type: 'image_url', image_url: { url: img } }))
            ]
        }
    ];

    const result = await callAI(messages, null, true, { max_tokens: 8192, temperature: 0.3, response_format: { type: "json_object" } });
    let text = result.choices?.[0]?.message?.content || "{}";
    
    // Clean JSON
    const match = text.match(/\{[\s\S]*\}/);
    if (match) text = match[0];
    
    return JSON.parse(text);
};
