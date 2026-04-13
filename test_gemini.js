import * as dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
        console.log("Available models:", data.models.map(m => m.name).join(', '));
    } else {
        console.log("Error listing models:", data);
    }
}

listModels();
