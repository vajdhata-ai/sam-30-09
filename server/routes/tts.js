import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const router = express.Router();

const SARVAM_API_KEY = (process.env.SARVAM_API_KEY || '').trim();
const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';

// Voice mapping for two distinct podcast speakers using Sarvam Bulbul v3
// Questioner: a clear, curious-sounding voice
// Explainer: a warm, authoritative explaining voice
const SPEAKER_VOICES = {
    questioner: {
        speaker: 'amit',       // Male inquisitive voice
        pace: 1.05,            // Slightly brisk — curious energy
        temperature: 0.7       // Moderate expressiveness
    },
    explainer: {
        speaker: 'anand',      // Male warm, deep explaining voice
        pace: 0.92,            // Slightly slower — calm, teaching pace
        temperature: 0.5       // More stable, authoritative delivery
    }
};

/**
 * POST /api/ai/tts
 * Converts text to speech using Sarvam AI's Bulbul v3 model.
 * Body: { text: string, speaker: "Questioner" | "Explainer" }
 * Returns: { audioBase64: string, speaker: string }
 */
router.post('/tts', async (req, res) => {
    try {
        const { text, speaker } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (!SARVAM_API_KEY) {
            return res.status(500).json({ error: 'Sarvam API key not configured' });
        }

        // Map speaker role to voice config
        const role = (speaker || 'Explainer').toLowerCase();
        const voiceConfig = SPEAKER_VOICES[role] || SPEAKER_VOICES.explainer;

        // Sarvam TTS has a 2500 char limit per request for bulbul:v3
        // Split long text into chunks if needed
        const MAX_CHARS = 2400;
        const textChunks = [];
        
        if (text.length <= MAX_CHARS) {
            textChunks.push(text);
        } else {
            // Split at sentence boundaries
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
            let currentChunk = '';
            
            for (const sentence of sentences) {
                if ((currentChunk + sentence).length > MAX_CHARS) {
                    if (currentChunk) textChunks.push(currentChunk.trim());
                    currentChunk = sentence;
                } else {
                    currentChunk += sentence;
                }
            }
            if (currentChunk.trim()) textChunks.push(currentChunk.trim());
        }

        console.log(`[Sarvam TTS] Generating ${textChunks.length} chunk(s) for ${speaker} using voice: ${voiceConfig.speaker}`);

        // Generate audio for all chunks
        const audioChunks = [];

        for (let i = 0; i < textChunks.length; i++) {
            const chunk = textChunks[i];
            
            const payload = {
                inputs: [chunk],
                target_language_code: 'en-IN',
                speaker: voiceConfig.speaker,
                pace: voiceConfig.pace,
                model: 'bulbul:v3',
                speech_sample_rate: 22050,
                enable_preprocessing: true,
                temperature: voiceConfig.temperature
            };

            const response = await fetch(SARVAM_TTS_URL, {
                method: 'POST',
                headers: {
                    'api-subscription-key': SARVAM_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[Sarvam TTS] API Error (${response.status}):`, errorText);
                throw new Error(`Sarvam TTS Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            
            if (data.audios && data.audios.length > 0) {
                audioChunks.push(data.audios[0]);
            } else {
                console.warn(`[Sarvam TTS] No audio in response for chunk ${i}`);
            }
        }

        if (audioChunks.length === 0) {
            throw new Error('No audio generated');
        }

        // If single chunk, return directly. If multiple, concatenate (client-side handles this)
        res.json({
            audioBase64: audioChunks.length === 1 ? audioChunks[0] : audioChunks,
            isMultiChunk: audioChunks.length > 1,
            speaker: speaker,
            voiceUsed: voiceConfig.speaker
        });

    } catch (error) {
        console.error('[Sarvam TTS] Error:', error);
        res.status(500).json({ error: 'TTS Generation Failed: ' + error.message });
    }
});

/**
 * POST /api/ai/tts-proxy
 * Proxies arbitrary requests to Sarvam to bypass CORS, allowing frontend to manage keys.
 */
router.post('/tts-proxy', async (req, res) => {
    try {
        const apiKey = req.headers['api-subscription-key'];
        if (!apiKey) return res.status(401).json({ error: "Missing API Key" });

        const response = await fetch(SARVAM_TTS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': apiKey
            },
            body: JSON.stringify(req.body)
        });

        const status = response.status;
        const contentType = response.headers.get('content-type') || 'application/json';
        const responseText = await response.text();

        if (!response.ok) {
            console.error(`[TTS Proxy] Sarvam returned ${status}:`, responseText);
        }

        res.status(status).set('Content-Type', contentType).send(responseText);
    } catch (err) {
        console.error('[TTS Proxy Network Error]', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
