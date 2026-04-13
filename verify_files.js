const fs = require('fs');
const files = [
    'src/components/PodcastGenerator.jsx',
    'src/components/CompetitiveHub/CompetitivePodcast.jsx',
    'server/routes/tts.js',
    'server/routes/ai.js',
    'src/utils/api.js',
    'server/.env'
];
files.forEach(f => {
    try {
        const content = fs.readFileSync(f, 'utf8');
        console.log(`  OK: ${f} (${content.split('\n').length} lines)`);
    } catch(e) {
        console.log(`FAIL: ${f} - ${e.message}`);
    }
});
console.log('\nAll checks done.');
