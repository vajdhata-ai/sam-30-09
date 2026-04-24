import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_KEY = process.env.VITE_OPENROUTER_KEY_1;
const GROQ_KEY = process.env.VITE_GROQ_KEY_1;

// Create a tiny 1x1 transparent JPEG base64
const dummyBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

async function testOpenRouter() {
    console.log("Testing OpenRouter...");
    const payload = {
        model: "google/gemini-2.5-flash",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: "What is this?" },
                { type: "image_url", image_url: { url: dummyBase64 } }
            ]
        }]
    };
    
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_KEY}`,
                "HTTP-Referer": "http://localhost:8080"
            },
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        console.log("OpenRouter Response:", res.status, text);
    } catch (e) {
        console.error("OpenRouter Fetch Error:", e);
    }
}

async function testGroq() {
    console.log("Testing Groq...");
    const payload = {
        model: "llama-3.2-11b-vision-preview",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: "What is this?" },
                { type: "image_url", image_url: { url: dummyBase64 } }
            ]
        }]
    };
    
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_KEY}`
            },
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        console.log("Groq Response:", res.status, text);
    } catch (e) {
        console.error("Groq Fetch Error:", e);
    }
}

async function run() {
    await testOpenRouter();
    await testGroq();
}

run();
