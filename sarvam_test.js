const https = require('https');
const data = JSON.stringify({
    "inputs": ["Hello, how are you today?"],
    "target_language_code": "hi-IN",
    "speaker": "meera",
    "pitch": 0,
    "pace": 1.1,
    "loudness": 1.5,
    "speech_sample_rate": 8000,
    "enable_preprocessing": true,
    "model": "bulbul:v1"
});

const req = https.request('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
        'api-subscription-key': 'sk_q0u1vkfb_M9IdEnnI6iusXcibxDfYvL56',
        'Content-Type': 'application/json'
    }
}, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log('RESPONSE:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
