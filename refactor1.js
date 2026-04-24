const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src/components/CollegeCompass.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. UPDATE IMPORTS AND AI HELPER
content = content.replace(
    /import { formatGroqPayload } from '\.\.\/utils\/api';\nimport { callAI as callGroq } from '\.\.\/utils\/apiRouter';/g,
    `import callOpenRouter from '../utils/openRouterClient';`
);

const oldCallAI = `    const callAI = async (userQuery, systemPrompt, temperature = 0.4) => {
        const enhancedSystemPrompt = \`\${systemPrompt}\${globalInstructions ? \`\\n\\nGLOBAL CUSTOM INSTRUCTIONS (PRIORITIZE THESE):\\n\${globalInstructions}\` : ''}\`;
        const messages = [
            { role: 'system', content: enhancedSystemPrompt },
            { role: 'user', content: userQuery }
        ];
        const result = await callGroq(messages, null, false, { temperature, max_tokens: 8192 });

        return result.choices?.[0]?.message?.content || "No response generated. Please try again.";
    };`;

const newCallAI = `    const callAI = async (userQuery, systemPrompt, temperature = 0.4, isJson = false) => {
        const enhancedSystemPrompt = \`\${systemPrompt}\${globalInstructions ? \`\\n\\nGLOBAL CUSTOM INSTRUCTIONS (PRIORITIZE THESE):\\n\${globalInstructions}\` : ''}\`;
        const messages = [
            { role: 'system', content: enhancedSystemPrompt },
            { role: 'user', content: userQuery }
        ];
        try {
            const result = await callOpenRouter(messages, { 
                temperature, 
                max_tokens: 8192,
                ...(isJson ? { response_format: { type: "json_object" } } : {})
            });
            return result.choices?.[0]?.message?.content || "No response generated. Please try again.";
        } catch (err) {
            console.error("AI Error:", err);
            throw err;
        }
    };`;
content = content.replace(oldCallAI, newCallAI);

// 2. UPDATE STATE INITIALIZATIONS
content = content.replace(
    /const \[careerResult, setCareerResult\] = useState\(''\);/g,
    `const [careerResult, setCareerResult] = useState(null);`
);

const oldEssayState = `    // SOP/Essay Expert (merged: review + coach + grader)
    const [essayPrompt, setEssayPrompt] = useState(''); // NEW for auto-generation
    const [essayText, setEssayText] = useState('');
    const [essayType, setEssayType] = useState('Personal Statement');
    const [essaySchool, setEssaySchool] = useState('');
    const [essayWordLimit, setEssayWordLimit] = useState('');
    const [essayStory, setEssayStory] = useState(''); // Key story / anecdote
    const [essayTrait, setEssayTrait] = useState(''); // Core trait to highlight
    const [essayTone, setEssayTone] = useState('Reflective'); // Essay tone
    const [essayResult, setEssayResult] = useState('');
    const [essayScore, setEssayScore] = useState(0);
    const [essayIteration, setEssayIteration] = useState(0);
    const [essayPhase, setEssayPhase] = useState('coach'); // 'coach' | 'grader' | 'generate'
    const [essayFeedbackHistory, setEssayFeedbackHistory] = useState([]); // Accumulated feedback from all iterations
    const essayPdfRef = useRef(null);`;

const newEssayState = `    // SOP/Essay Expert
    const [essayPrompt, setEssayPrompt] = useState('');
    const [essayType, setEssayType] = useState('Personal Statement');
    const [essaySchool, setEssaySchool] = useState('');
    const [essayWordLimit, setEssayWordLimit] = useState('');
    const [essayStory, setEssayStory] = useState('');
    const [essayTrait, setEssayTrait] = useState('');
    const [essayTone, setEssayTone] = useState('Reflective');
    const [essayData, setEssayData] = useState(null);`;

content = content.replace(oldEssayState, newEssayState);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully applied step 1.');
