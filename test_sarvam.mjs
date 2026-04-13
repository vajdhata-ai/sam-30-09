// Quick test for Sarvam TTS API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const SARVAM_API_KEY = 'sk_q0u1vkfb_M9IdEnnI6iusXcibxDfYvL56';

async function testSarvam() {
    console.log('[Test] Calling Sarvam TTS API...');
    const start = Date.now();
    
    try {
        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
            method: 'POST',
            headers: {
                'api-subscription-key': SARVAM_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: ["Hello, welcome to our podcast. Today we will discuss physics."],
                target_language_code: 'en-IN',
                speaker: 'anand',
                pace: 1.0,
                model: 'bulbul:v3',
                speech_sample_rate: 22050,
                enable_preprocessing: true,
                temperature: 0.5
            })
        });

        const elapsed = Date.now() - start;
        console.log(`[Test] Response status: ${response.status} (${elapsed}ms)`);
        
        if (!response.ok) {
            const errText = await response.text();
            console.log('[Test] ERROR:', errText);
            return;
        }

        const data = await response.json();
        console.log('[Test] SUCCESS!');
        console.log('[Test] Has audios:', !!data.audios);
        console.log('[Test] Audio count:', data.audios?.length);
        console.log('[Test] Audio base64 length:', data.audios?.[0]?.length);
        console.log('[Test] Request ID:', data.request_id);
    } catch (err) {
        console.error('[Test] NETWORK ERROR:', err.message);
    }
}

testSarvam();
