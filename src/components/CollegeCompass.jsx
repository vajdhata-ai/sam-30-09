import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ClipboardList, MessageSquare, Loader2, Lightbulb, Link, Globe, Send, Sparkles, Brain, Trophy, MapPin, GraduationCap, Map, Crown, BookOpen, Target, Calendar, ChevronRight, ChevronLeft, Check, Activity, FileText, Download, AlertTriangle, Award, ShieldAlert } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { callOpenRouter } from '../utils/openRouterClient';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// ───────────────────────────────────────────────
// Markdown Renderer — shared across all tabs
// ───────────────────────────────────────────────
const MarkdownBlock = ({ text }) => {
    if (!text || typeof text !== 'string') return null;
    return (
    <div className="space-y-1">
        {text.split('\n').map((line, idx) => {
            if (line.startsWith('## ')) return <h2 key={idx} className={`text-lg font-bold mt-4 mb-2 text-theme-primary`}>{line.replace('## ', '')}</h2>;
            if (line.startsWith('### ')) return <h3 key={idx} className={`text-md font-bold mt-3 mb-1 text-theme-text`}>{line.replace('### ', '')}</h3>;
            if (line.includes('**')) {
                const parts = line.split(/\*\*(.+?)\*\*/g);
                return <p key={idx} className="my-1.5 text-[15px]">{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="font-bold text-theme-primary">{p}</strong> : p)}</p>;
            }
            if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                return <div key={idx} className="flex gap-2 my-1 ml-2 text-[15px]"><span className="text-theme-primary">•</span><span>{line.trim().replace(/^[-•]\s*/, '')}</span></div>;
            }
            if (line.trim()) return <p key={idx} className="my-1.5 text-[15px] text-theme-text">{line}</p>;
            return <div key={idx} className="h-1.5" />;
        })}
    </div>
    );
};

// Input field helper
const FormField = ({ label, children }) => (
    <div className="space-y-2">
        <label className={`text-[10px] font-black uppercase tracking-widest text-theme-muted ml-1`}>{label}</label>
        {children}
    </div>
);

const InputField = (props) => (
    <input
        {...props}
        className={`w-full p-4 rounded-[18px] text-sm font-medium outline-none transition-all duration-300 bg-theme-surface border-theme-border text-theme-text placeholder-theme-muted focus:border-theme-primary focus:shadow-[0_0_20px_var(--theme-primary)] opacity-80 border focus:opacity-100`}
    />
);

const TextareaField = (props) => (
    <textarea
        {...props}
        className={`w-full p-4 rounded-[18px] text-sm font-medium resize-none transition-all duration-300 bg-theme-surface border-theme-border text-theme-text placeholder-theme-muted focus:border-theme-primary focus:shadow-[0_0_20px_var(--theme-primary)] opacity-80 border focus:opacity-100`}
    />
);

const SelectField = ({ options, ...props }) => (
    <select
        {...props}
        className={`w-full p-4 rounded-xl text-sm bg-theme-surface border-theme-border text-theme-text border focus:border-theme-primary outline-none transition-all`}
    >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
);

// ───────────────────────────────────────────────
// MAIN COMPONENT
// ───────────────────────────────────────────────
const CollegeCompass = ({ retryableFetch, onExit }) => {
    const [isEntering, setIsEntering] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsEntering(false), 2600);
        return () => clearTimeout(timer);
    }, []);
    const { isDark } = useTheme();
    const { canUseFeature, incrementUsage, triggerUpgradeModal, isPro, getRemainingUses } = useSubscription();

    // View State
    const [viewMode, setViewMode] = useState('menu'); // 'menu' | 'active_tool'
    const [activeTab, setActiveTab] = useState('');

    const { activeChatId, chats, startNewChat, addMessageToChat, getGlobalContextStr } = useChatHistory();
    const { globalInstructions } = useUserPreferences();

    // ─── SHARED STUDENT PROFILE (persists across all tabs) ───
    const [studentProfile, setStudentProfile] = useState({
        hobbies: '', passions: '', field: '', aspirations: '',
        gpa: '', testScores: '', major: '', extracurriculars: '',
        achievements: '', targetSchools: '', careerGoals: '',
        uploadedDocs: '', // Extracted text from uploaded PDFs/TXTs
        uploadedFileName: '',
    });
    const fileInputRef = useRef(null);

    // Update profile helper — merges new data without overwriting existing
    const updateProfile = useCallback((newData) => {
        setStudentProfile(prev => {
            const merged = { ...prev };
            for (const [key, value] of Object.entries(newData)) {
                if (value && value.trim()) merged[key] = value; // Only overwrite if non-empty
            }
            return merged;
        });
    }, []);

    // PDF/TXT upload handler
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            let extractedText = '';
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const pages = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    pages.push(content.items.map(item => item.str).join(' '));
                }
                extractedText = pages.join('\n\n');
            } else {
                // .txt or other text files
                extractedText = await file.text();
            }
            updateProfile({ uploadedDocs: extractedText.substring(0, 8000), uploadedFileName: file.name });
        } catch (err) {
            console.error('File upload error:', err);
        }
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Build a structured student profile block for AI prompts
    const buildProfileBlock = () => {
        const p = studentProfile;
        const parts = [];
        if (p.hobbies) parts.push(`Hobbies & Interests: ${p.hobbies}`);
        if (p.passions) parts.push(`Deep Passions: ${p.passions}`);
        if (p.field) parts.push(`Field of Study: ${p.field}`);
        if (p.aspirations) parts.push(`Future Aspirations: ${p.aspirations}`);
        if (p.gpa) parts.push(`GPA/Marks: ${p.gpa}`);
        if (p.testScores) parts.push(`Test Scores: ${p.testScores}`);
        if (p.major) parts.push(`Target Major: ${p.major}`);
        if (p.extracurriculars) parts.push(`Extracurriculars & Achievements:\n${p.extracurriculars}`);
        if (p.achievements) parts.push(`Key Achievements: ${p.achievements}`);
        if (p.targetSchools) parts.push(`Target Schools: ${p.targetSchools}`);
        if (p.careerGoals) parts.push(`Career Goals: ${p.careerGoals}`);
        if (p.uploadedDocs) parts.push(`--- UPLOADED DOCUMENT CONTENT ---\n${p.uploadedDocs}\n--- END UPLOADED DOCUMENT ---`);
        if (parts.length === 0) return '';
        return `\n\n=== COMPLETE STUDENT PROFILE (USE ALL OF THIS) ===\n${parts.join('\n')}\n=== END STUDENT PROFILE ===\n\n`;
    };
    // Career AI
    const [careerForm, setCareerForm] = useState({ hobbies: '', passion: '', field: '', aspirations: '', budget: '', country: '' });
    const [careerResult, setCareerResult] = useState(null);

    // College Finder (enhanced)
    const [collegeForm, setCollegeForm] = useState({
        gpa: '', major: '', extracurriculars: '', location: '',
        budget: '', testScores: '', studyLevel: 'Undergraduate', country: 'Any'
    });
    const [collegeResult, setCollegeResult] = useState('');
    const [citations, setCitations] = useState([]);

    // Scholarship Finder (NEW)
    const [scholarshipForm, setScholarshipForm] = useState({
        nationality: '', gpa: '', fieldOfStudy: '', financialNeed: 'Medium', targetCountry: '', achievements: ''
    });
    const [scholarshipResult, setScholarshipResult] = useState('');

    // Compare Colleges (NEW)
    const [compareForm, setCompareForm] = useState({ college1: '', college2: '', college3: '', criteria: 'Overall' });
    const [compareResult, setCompareResult] = useState('');

    // Rank Predictor (WORLD-CLASS)
    const [jeeMode, setJeeMode] = useState('marks'); // 'marks' or 'percentile'
    const [jeeForm, setJeeForm] = useState({ marks: '', percentile: '', category: 'OPEN', homeState: '', targetBranch: '', gender: 'Male', pwd: 'No' });
    const [jeeRankData, setJeeRankData] = useState(null);
    const [jeeCollegeResult, setJeeCollegeResult] = useState(null);
    const jeePdfRef = useRef(null);

    // Multi-Exam State
    const [selectedExam, setSelectedExam] = useState(null); // 'jee', 'neet', 'cat', 'nda'

    // NEET State
    const [neetForm, setNeetForm] = useState({ marks: '', category: 'UR', state: '', preference: 'AIQ' });
    const [neetRankData, setNeetRankData] = useState(null);
    const [neetCollegeResult, setNeetCollegeResult] = useState('');
    const neetPdfRef = useRef(null);

    // CAT State
    const [catForm, setCatForm] = useState({ percentile: '', category: 'General', stream: 'Engineering', workEx: '0', spec: 'Finance' });
    const [catResultData, setCatResultData] = useState(null);
    const [catCollegeResult, setCatCollegeResult] = useState('');
    const catPdfRef = useRef(null);

    // NDA State
    const [ndaForm, setNdaForm] = useState({ marks: '', wing: 'Army' });
    const [ndaResultData, setNdaResultData] = useState(null);
    const [ndaCollegeResult, setNdaCollegeResult] = useState('');
    const ndaPdfRef = useRef(null);


    // SOP/Essay Expert
    const [essayPrompt, setEssayPrompt] = useState('');
    const [essayType, setEssayType] = useState('Personal Statement');
    const [essaySchool, setEssaySchool] = useState('');
    const [essayWordLimit, setEssayWordLimit] = useState('');
    const [essayStory, setEssayStory] = useState('');
    const [essayTrait, setEssayTrait] = useState('');
    const [essayTone, setEssayTone] = useState('Reflective');
    const [essayData, setEssayData] = useState(null);

    // ─── Follow-up inputs for existing tabs ───
    const [careerFollowup, setCareerFollowup] = useState('');
    const [collegeFollowup, setCollegeFollowup] = useState('');

    // Chat
    const [chatInput, setChatInput] = useState('');
    const defaultChatMsg = { role: 'model', text: "Hello! I'm your elite AI College Counselor. Ask me anything — admissions strategy, country comparisons, visa guidance, ranking analysis, financial planning, or career alignment. I use comprehensive data to give you world-class recommendations." };
    const [chatHistory, setChatHistory] = useState([defaultChatMsg]);

    // Sync local counselor chat with global history
    // Sync local counselor chat with global history
    useEffect(() => {
        const activeChat = chats.find(c => c.id === activeChatId);
        if (activeChat && activeChat.feature === 'college-compass') {
            setChatHistory(activeChat.messages.length > 0 ? activeChat.messages : [defaultChatMsg]);
        } else if (!activeChatId || (activeChat && activeChat.feature !== 'college-compass')) {
            setChatHistory([defaultChatMsg]);
        }
    }, [activeChatId, chats]);

    // Shared
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

    // ─── AI CALL HELPER ───
    const callAI = async (userQuery, systemPrompt, temperature = 0.4, isJson = false) => {
        const enhancedSystemPrompt = `${systemPrompt}${globalInstructions ? `\n\nGLOBAL CUSTOM INSTRUCTIONS (PRIORITIZE THESE):\n${globalInstructions}` : ''}`;
        const messages = [
            { role: 'system', content: enhancedSystemPrompt },
            { role: 'user', content: userQuery }
        ];
        
        try {
            const result = await callOpenRouter(messages, { 
                temperature, 
                max_tokens: 16384,
                ...(isJson ? { response_format: { type: "json_object" } } : {})
            });
            return result.choices?.[0]?.message?.content || "No response generated. Please try again.";
        } catch (err) {
            console.error("AI Error:", err);
            throw err;
        }
    };

    // ─── CAREER AI ───
    const handleCareerSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setCareerResult(null);
        // Save to shared profile
        updateProfile({
            hobbies: careerForm.hobbies,
            passions: careerForm.passion,
            field: careerForm.field,
            aspirations: careerForm.aspirations,
        });
        try {
            const profileBlock = buildProfileBlock();
            const systemPrompt = `You are the world's most elite Career Architect and Psychometric Analyst.
Analyze the student profile and synthesize a highly dynamic, future-proof, and exhaustive career roadmap.

IMPORTANT: Your explanations must be EXTREMELY DETAILED and long. Every "why" field should be at least 3-5 sentences of deep psychological and market analysis. Every "steps" field should be a granular checklist.

OUTPUT FORMAT:
Return strictly a valid JSON object with the following structure:
{
  "personality_type": "A profound, 100-word analysis of their cognitive archetype",
  "alignment_score": 95,
  "core_values": ["deep value 1", "deep value 2"],
  "career_matches": [
    { 
      "title": "Career Title", 
      "match_score": 95, 
      "why": "Provide an exhaustive, multi-sentence explanation of exactly why this fits their personality, market trends, and long-term ROI.", 
      "salary": "Detailed salary progression (Entry -> Senior)", 
      "growth": "Detailed market demand analysis" 
    }
  ],
  "action_plan": [
    { "timeframe": "Months 1-6", "steps": ["Exhaustive Step 1 with details", "Exhaustive Step 2 with details"] }
  ],
  "hidden_gems": ["Unique Emerging Field 1 with description", "Unconventional Role 2 with description"]
}`;

            const userQuery = `--- STUDENT PROFILE (ACTIVE FORM) ---
Hobbies & Interests: ${careerForm.hobbies}
Deep Passions: ${careerForm.passion}
Current Field of Study: ${careerForm.field}
Future Aspirations: ${careerForm.aspirations}
Budget Constraints: ${careerForm.budget || 'Not specified'}
Preferred Country: ${careerForm.country || 'Open to any'}
--- END ACTIVE FORM ---
${profileBlock}`;

            const rawJsonStr = await callAI(userQuery, systemPrompt, 0.7, true);
            const parsedData = JSON.parse(rawJsonStr);
            setCareerResult(parsedData);
            updateProfile({ careerGoals: JSON.stringify(parsedData.career_matches) });
            incrementUsage('college-compass');
        } catch (err) { 
            setCareerResult({ error: "Failed to generate career roadmap. " + err.message }); 
        } finally { 
            setIsLoading(false); 
        }
    };

    // ─── SCHOLARSHIP & COLLEGE FINDER ───
    const handleCollegeSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setCollegeResult(null);
        // Save to shared profile
        updateProfile({
            gpa: collegeForm.gpa,
            testScores: collegeForm.testScores,
            major: collegeForm.major,
            extracurriculars: collegeForm.extracurriculars,
        });
        try {
            const profileBlock = buildProfileBlock();
            const systemPrompt = `You are the world's most elite University Admissions Counselor and Financial Aid Expert.
Analyze the student's profile to recommend colleges and scholarships with extreme granular detail.

IMPORTANT: Every explanation must be deep, data-driven, and expansive. No one-liners.

OUTPUT FORMAT:
Return strictly a valid JSON object with the following structure:
{
  "profile_strength": 85,
  "dream_colleges": [{ "name": "University A", "chance": "20%", "why": "An exhaustive, multi-paragraph-style explanation of academic fit, research opportunities, and cultural alignment." }],
  "target_colleges": [{ "name": "University B", "chance": "50%", "why": "Detailed analysis of why this is a realistic but high-value target." }],
  "safe_colleges": [{ "name": "University C", "chance": "90%", "why": "Detailed breakdown of the safety net and specific benefits of this institution." }],
  "scholarships": [
    { "name": "Full Scholarship Name", "amount": "Precise Amount", "deadline": "Specific Date/Range", "eligibility": "Deep Eligibility Breakdown" }
  ],
  "roi_analysis": "An exhaustive financial analysis covering tuition, living costs, post-grad salary expectations, and break-even timeline.",
  "strategy": ["Profound, high-fidelity advice 1", "Detailed application hook 2", "Strategic timeline tip 3"]
}`;

            const userQuery = `--- STUDENT PROFILE (ACTIVE FORM) ---
GPA / Marks: ${collegeForm.gpa}
Test Scores: ${collegeForm.testScores}
Target Major: ${collegeForm.major}
Study Level: ${collegeForm.studyLevel}
Extracurriculars: ${collegeForm.extracurriculars}
Country Preference: ${collegeForm.country}
Location Preference: ${collegeForm.location}
Budget: ${collegeForm.budget}
--- END ACTIVE FORM ---
${profileBlock}`;

            const rawJsonStr = await callAI(userQuery, systemPrompt, 0.4, true);
            const parsedData = JSON.parse(rawJsonStr);
            setCollegeResult(parsedData);
            incrementUsage('college-compass');
        } catch (err) { 
            setCollegeResult({ error: "Failed to generate college list. " + err.message }); 
        } finally { 
            setIsLoading(false); 
        }
    };

    // ─── SCHOLARSHIP FINDER (NEW) ───
    const handleScholarshipSubmit = async (e) => {
        e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setScholarshipResult('');
        try {
            const text = await callAI(
                `Find the best scholarships for this student profile:

--- PROFILE ---
Nationality: ${scholarshipForm.nationality}
GPA: ${scholarshipForm.gpa}
Field of Study: ${scholarshipForm.fieldOfStudy}
Financial Need Level: ${scholarshipForm.financialNeed}
Target Country: ${scholarshipForm.targetCountry || 'Any'}
Key Achievements: ${scholarshipForm.achievements}
--- END ---

Provide an EXHAUSTIVE, high-fidelity guide (aim for maximum depth, ~2000 words):

## 🏆 Top 15 Matching Scholarships
For each: Full Name, Organization, Amount ($), Deadline (precise range), Detailed Eligibility, Step-by-Step Application Guide, "Inside Track" Success Tips.

## 🌍 Government & International Programs
In-depth coverage of Chevening, Fulbright, DAAD, Erasmus+, etc., as they apply to this profile.

## 🏛️ University-Specific Aid
How to target 'Need-Blind' or 'Full-Ride' schools based on this profile's strengths.

## 📝 The "Winning" Essay Strategy
Specific themes this student should highlight in their SOP/Personal Statement to maximize conversion.

## 🎯 High-Acceptance 'Hidden' Funds
Lesser-known private foundation scholarships with high success rates.

## 📅 Precision Application Timeline
A monthly breakdown of what to do over the next 12 months.

Include real names, specific amounts, and granular details. Be the most helpful resource the student has ever seen.`,
                `You are the world's most successful Scholarship Consultant. You have helped students win millions in aid. You know every hidden requirement and "hook" that scholarship committees look for. Every recommendation must be specific and high-fidelity. Use Markdown and emojis.`
            );
            setScholarshipResult(text);
            incrementUsage('college-compass');
        } catch (err) { setScholarshipResult("Error: " + err.message); }
        finally { setIsLoading(false); }
    };

    // ─── COMPARE COLLEGES (NEW) ───
    const handleCompareSubmit = async (e) => {
        e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setCompareResult('');
        try {
            const colleges = [compareForm.college1, compareForm.college2, compareForm.college3].filter(Boolean);
            const text = await callAI(
                `Compare these colleges head-to-head with EXHAUSTIVE granular detail: ${colleges.join(' vs ')}.
Focus criteria: ${compareForm.criteria}

Provide a massive, data-heavy comparison (aim for extreme depth, ~2000-3000 words):

## 📊 Comprehensive Comparison Matrix
Rankings (QS, US News, THE - Global & Subject-specific), Acceptance Rates (Regular vs Early), Total Cost of Attendance (Tuition, Housing, Fees), Average ROI (5 & 10 years).

## 🎓 Academic Deep-Dive
Professor-to-student ratio, research budget, most famous departments, industry partnerships, and class sizes.

## 🏠 Student Life & Ecosystem
Campus vibe, housing quality, city vs campus life, extracurricular power, and peer quality.

## 💰 The Financial Reality
Real-world budgeting, work-study opportunities, specific scholarship cross-eligibility.

## 💼 Career Dominance
Top 10 hiring companies for each, average starting salary by major, and alumni network density in key hubs (Silicon Valley, NYC, London, etc.).

## ⚖️ Final Strategic Verdict
The "Ideal Student" profile for each school. Who wins based on financial constraints vs career ambition?

Be brutally objective, data-driven, and specific. Leave no stone unturned.`,
                `You are the world's most feared and respected College Admissions Analyst. You have access to every data point — from Common Data Sets to employment audits. Your comparisons are the industry gold standard. Use Markdown and high-fidelity comparison structures.`
            );
            setCompareResult(text);
            incrementUsage('college-compass');
        } catch (err) { setCompareResult("Error: " + err.message); }
        finally { setIsLoading(false); }
    };

    // ─── MARKS → PERCENTILE PREDICTOR (NTA Historical Mapping) ───
    const marksToPercentile = (marks) => {
        const m = parseFloat(marks);
        if (isNaN(m) || m < 0) return 0;
        if (m > 300) return 99.99;
        // Piecewise interpolation based on NTA 2024 JEE Main Session 2 data
        const data = [
            [0, 0], [10, 15.5], [20, 32.0], [30, 45.2], [40, 55.8],
            [50, 64.0], [60, 71.5], [70, 77.2], [80, 82.0], [90, 86.0],
            [100, 89.2], [110, 91.5], [120, 93.2], [130, 94.6], [140, 95.7],
            [150, 96.5], [160, 97.2], [170, 97.7], [180, 98.15], [190, 98.5],
            [200, 98.8], [210, 99.05], [220, 99.25], [230, 99.42], [240, 99.56],
            [250, 99.68], [260, 99.78], [270, 99.86], [280, 99.92], [290, 99.96], [300, 99.997]
        ];
        for (let i = 0; i < data.length - 1; i++) {
            if (m >= data[i][0] && m <= data[i + 1][0]) {
                const ratio = (m - data[i][0]) / (data[i + 1][0] - data[i][0]);
                return parseFloat((data[i][1] + ratio * (data[i + 1][1] - data[i][1])).toFixed(7));
            }
        }
        return 99.99;
    };

    const getRankTier = (rank) => {
        if (rank <= 250) return { label: 'IIT Material', color: 'text-yellow-400', emoji: '🏆' };
        if (rank <= 1000) return { label: 'Top NIT CSE', color: 'text-green-400', emoji: '🔥' };
        if (rank <= 5000) return { label: 'NIT Core Branches', color: 'text-blue-400', emoji: '🎯' };
        if (rank <= 15000) return { label: 'NIT / Top IIIT', color: 'text-indigo-400', emoji: '🏛️' };
        if (rank <= 35000) return { label: 'IIIT / GFTI', color: 'text-purple-400', emoji: '🎓' };
        if (rank <= 75000) return { label: 'State Colleges / Private', color: 'text-orange-400', emoji: '📚' };
        return { label: 'Explore All Options', color: 'text-red-400', emoji: '🛡️' };
    };

    const handleJeeSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setJeeCollegeResult(null);
        try {
            let percent;
            let estimatedMarks = '';
            if (jeeMode === 'marks') {
                const m = parseFloat(jeeForm.marks);
                if (isNaN(m) || m < 0 || m > 300) throw new Error('Enter valid marks between 0 and 300');
                percent = marksToPercentile(m);
                estimatedMarks = m;
            } else {
                percent = parseFloat(jeeForm.percentile);
                if (isNaN(percent) || percent < 0 || percent > 100) throw new Error('Enter a valid percentile between 0 and 100');
            }

            const totalCandidates = 1450000; // 2026 projection
            const crlRank = Math.max(1, Math.floor(((100 - percent) * totalCandidates) / 100));
            const tier = getRankTier(crlRank);
            setJeeRankData({ crl: crlRank, percentile: percent, category: jeeForm.category, marks: estimatedMarks, tier, homeState: jeeForm.homeState, targetBranch: jeeForm.targetBranch, gender: jeeForm.gender, pwd: jeeForm.pwd });

            const systemPrompt = `You are India's #1 JEE Main Counseling Expert.
Based on JoSAA data, predict college admission probabilities.

OUTPUT FORMAT:
Return strictly a valid JSON object with the following structure:
{
  "rank_analysis": {
    "predicted_rank": 15000,
    "percentile": 99.0,
    "competitive_standing": "Top 1% - Excellent chances for top NITs"
  },
  "safe_colleges": [{ "name": "NIT X", "branch": "ECE", "closing_rank": "20000" }],
  "target_colleges": [{ "name": "NIT Y", "branch": "CSE", "closing_rank": "16000" }],
  "dream_colleges": [{ "name": "IIT Z (if applicable)", "branch": "Mech", "closing_rank": "10000" }],
  "strategy": ["Counseling strategy 1", "Counseling strategy 2"]
}`;
            const userQuery = `Aspirant Profile:
Percentile: ${percent}%
Calculated Rank: ~${crlRank}
Category: ${jeeForm.category}
Home State: ${jeeForm.homeState}
Target Branch: ${jeeForm.targetBranch}`;

            const rawJsonStr = await callAI(userQuery, systemPrompt, 0.4, true);
            const parsedData = JSON.parse(rawJsonStr);
            setJeeCollegeResult(parsedData);
            incrementUsage('college-compass');
        } catch (err) { setJeeCollegeResult({ error: "Failed to predict rank. " + err.message }); }
        finally { setIsLoading(false); }
    };

    const handleJeePdfDownload = async () => {
        const element = jeePdfRef.current;
        if (!element) return;
        try {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = pdfHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
            while (heightLeft > 0) {
                position -= pdf.internal.pageSize.getHeight();
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            pdf.save(`Aurem_JEE_Report_Rank_${jeeRankData?.crl || 'NA'}.pdf`);
        } catch (err) { console.error('PDF generation failed:', err); }
    };


    // ─── NEET PREDICTOR (NEW) ───
    const neetMarksToRank = (marks) => {
        // Approximate 2025 mappings
        if (marks >= 715) return Math.floor(Math.random() * 50) + 1;
        if (marks >= 700) return 500;
        if (marks >= 680) return 2500;
        if (marks >= 650) return 8000;
        if (marks >= 600) return 30000;
        if (marks >= 550) return 65000;
        return 100000 + (600 - marks) * 1000;
    };

    const handleNeetSubmit = async (e) => {
        e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true); setNeetRankData(null); setNeetCollegeResult('');
        try {
            const m = parseFloat(neetForm.marks);
            if (isNaN(m) || m < 0 || m > 720) throw new Error('Enter valid NEET marks (0-720)');
            const rank = neetMarksToRank(m);
            const tier = m >= 680 ? 'Top AIIMS / GMC' : m >= 620 ? 'Govt Medical College' : m >= 550 ? 'State GMC / Semi-Govt' : 'Private / Deemed';
            setNeetRankData({ rank, marks: m, category: neetForm.category, tier, state: neetForm.state });

            const reqText = `A NEET UG 2026 Aspirant profile:
Marks: ${m}/720
Estimated Rank: ~${rank}
Category: ${neetForm.category}
State: ${neetForm.state || 'Not specified'}
Preference: ${neetForm.preference}

Analyze based on NEET 2024 cutoff logic:
## 🩺 Overall MBBS/BDS Prospects
## 🏥 Top 5 Colleges Available
## 📊 AIQ vs State Quota Strategy
## 🛡️ Safe Private/Deemed Options (if applicable)
Use emojis and bold formatting.`;
            const result = await callAI(reqText, "You are India's #1 Medical Counseling Expert specializing in NEET UG MCC counseling. Be brutally realistic about govt seat chances.");
            setNeetCollegeResult(result);
            incrementUsage('college-compass');
        } catch (err) { setNeetCollegeResult('Error: ' + err.message); }
        finally { setIsLoading(false); }
    };

    const handleNeetPdfDownload = async () => {
        const element = neetPdfRef.current;
        if (!element) return;
        try {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Aurem_NEET_Report_${neetRankData?.marks}.pdf`);
        } catch (err) { console.error(err); }
    };

    // ─── CAT PREDICTOR (NEW) ───
    const handleCatSubmit = async (e) => {
        e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true); setCatResultData(null); setCatCollegeResult('');
        try {
            const p = parseFloat(catForm.percentile);
            if (isNaN(p) || p < 0 || p > 100) throw new Error('Enter valid percentile');
            const tier = p >= 99 ? 'BLACKI Capable' : p >= 95 ? 'New IIMs / IITs' : p >= 90 ? 'Baby IIMs / Tier 2' : 'Tier 3 B-Schools';
            setCatResultData({ percentile: p, category: catForm.category, tier, stream: catForm.stream });

            const reqText = `A CAT 2025 Aspirant profile:
Percentile: ${p}%
Category: ${catForm.category}
Academic Stream: ${catForm.stream}
Work Ex: ${catForm.workEx} months
Target Spec: ${catForm.spec}

Analyze based on IIM admission criteria:
## 🎓 IIM Shortlist Probability (BLACKI vs New vs Baby)
## 🏢 Top 5 Non-IIM Options (FMS, SPJIMR, IITs, etc.)
## 💼 Profile Analysis (Work Ex & Stream Impact)
## 🎙️ WAT-PI Prep Strategy
Use emojis and bold formatting.`;
            const result = await callAI(reqText, "You are India's top B-School Admissions Consultant. Provide realistic evaluation of IIM call chances based on composite score logic.");
            setCatCollegeResult(result);
            incrementUsage('college-compass');
        } catch (err) { setCatCollegeResult('Error: ' + err.message); }
        finally { setIsLoading(false); }
    };

    const handleCatPdfDownload = async () => {
        const element = catPdfRef.current;
        if (!element) return;
        try {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Aurem_CAT_Report_${catResultData?.percentile}.pdf`);
        } catch (err) { console.error(err); }
    };

    // ─── NDA PREDICTOR (NEW) ───
    const handleNdaSubmit = async (e) => {
        e.preventDefault();
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true); setNdaResultData(null); setNdaCollegeResult('');
        try {
            const m = parseFloat(ndaForm.marks);
            if (isNaN(m) || m < 0 || m > 900) throw new Error('Enter valid written marks (out of 900)');
            const cutoffExpected = ndaForm.wing === 'Air Force' ? 360 : ndaForm.wing === 'Navy' ? 350 : 340;
            const diff = m - cutoffExpected;
            const tier = diff >= 40 ? 'High Chance' : diff >= 0 ? 'Borderline' : 'Tough Chances';
            setNdaResultData({ marks: m, wing: ndaForm.wing, tier, expectedCutoff: cutoffExpected });

            const reqText = `An NDA Aspirant profile:
Written Marks: ${m}/900
Preferred Wing: ${ndaForm.wing}

Analyze prospects:
## 🪖 Written Cleared? (Cutoff Analysis)
## 🎖️ SSB Interview Strategy for ${ndaForm.wing}
## 📈 Merit List Probability
## 💪 Physical & Medical Standards Required
Use emojis and bold formatting.`;
            const result = await callAI(reqText, "You are an ex-SSB Assessor and NDA prep expert. Provide accurate, no-nonsense defense career guidance.");
            setNdaCollegeResult(result);
            incrementUsage('college-compass');
        } catch (err) { setNdaCollegeResult('Error: ' + err.message); }
        finally { setIsLoading(false); }
    };

    const handleNdaPdfDownload = async () => {
        const element = ndaPdfRef.current;
        if (!element) return;
        try {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Aurem_NDA_Report_${ndaResultData?.marks}.pdf`);
        } catch (err) { console.error(err); }
    };

    //     // ─── ESSAY EXPERT (Auto-Generate Draft) ───
    const handleGenerateEssay = async () => {
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setEssayPhase('generate');
        setEssayResult("Generating initial draft based on your profile context...");
        try {
            // Primary: shared student profile (accumulated from all tabs + uploads)
            const profileBlock = buildProfileBlock();
            // Supplementary: AI results from other tabs
            const aiContextStr = [
                careerResult ? `--- CAREER ROADMAP (AI-GENERATED) ---\n${careerResult.substring(0, 2000)}` : '',
                collegeResult ? `--- TARGET COLLEGES (AI-GENERATED) ---\n${collegeResult.substring(0, 2000)}` : '',
                compareResult ? `--- COLLEGE COMPARISON (AI-GENERATED) ---\n${compareResult.substring(0, 1500)}` : '',
            ].filter(Boolean).join('\n\n');
            const contextStr = profileBlock + (aiContextStr ? `\n${aiContextStr}` : '');

            const timestamp = Date.now();
            const randomSeed = Math.floor(Math.random() * 10000);

            let resultContext = await callAI(
                `Target School(s): ${essaySchool || 'Not specified'}
Essay Type: ${essayType}
Word Limit: ${essayWordLimit || 'Not specified'}
Desired Tone: ${essayTone}
Core Trait to Highlight: ${essayTrait || 'Not specified'}

--- KEY STORY / ANECDOTE ---
${essayStory || 'Not provided — use the profile context to find a compelling angle.'}
--- END STORY ---

${contextStr}

--- STUDENT ADDITIONAL INSTRUCTIONS ---
${essayPrompt || 'None'}
--- END INSTRUCTIONS ---

Write the essay based on ALL the context above. The Key Story is the MOST IMPORTANT input — build the entire essay around it.
CRITICAL UNIQUE SEED: [${timestamp}-${randomSeed}] 
Ensure this essay is COMPLETELY DIFFERENT from any previous iteration. Use a unique opening hook, different narrative framing, and distinct vocabulary.`,
                `You are an elite college admissions essay writer using the PASS, COFFEE, and NARRATIVE frameworks. 

You MUST WRITE the actual essay draft based on the student's profile context provided.
- Do NOT provide coaching feedback. Write the ESSAY.
- Adopt an authentic 16-17 year old extremely capable but emotionally honest voice (avoid generic "application voice").
- Incorporate specific details directly from their provided profile context.
- Ensure strong hook, narrative flow, and memorable conclusion.
- Follow the specific prompt and word limit if provided.
- BE CREATIVE AND UNIQUE. Do not use the exact same formula every time.
- ONLY output the essay text itself, no meta-commentary.`,
                0.85 // High temperature for creative uniqueness
            );
            setEssayText(resultContext);
            setEssayResult("Draft generated successfully! You can now review it below, make manual edits, and then click 'Coach Review' or 'Harsh Grade'.");
            incrementUsage('college-compass');
        } catch (err) { setEssayResult("Error generating draft: " + err.message); }
        finally { setIsLoading(false); }
    };


    // ─── ESSAY EXPERT
    const handleAutoFixEssay = async () => {
        if (!essayText.trim() || !essayResult.trim()) return;
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setEssayPhase('coach');
        setEssayResult("Deeply rewriting your draft based on the latest strict feedback...");

        try {
            // Focus heavily on the LATEST feedback to ensure forward progress
            const latestFeedback = essayFeedbackHistory.length > 0
                ? essayFeedbackHistory[essayFeedbackHistory.length - 1]
                : essayResult;

            const text = await callAI(
                `Target School(s): ${essaySchool || 'Not specified'}
Essay Type: ${essayType}
Word Limit: ${essayWordLimit || 'Not specified'}

--- YOUR CURRENT DRAFT ---
${essayText}
--- END DRAFT ---

--- THE RUDE STRICT REVIEWER'S LATEST VERDICT & DEMANDS ---
${latestFeedback}
--- END VERDICT ---

You MUST rewrite the ENTIRE essay from scratch to fix EVERY SINGLE issue raised by the reviewer above.
1. DO NOT DOWNGRADE the essay. Keep the good parts, elevate the weak parts.
2. If the reviewer called out clichés or "AI polish", REMOVE THEM. Write with raw, authentic teenage voice.
3. If the reviewer demanded specific sensory details or a better hook, INVENT plausible, highly specific details that fit the narrative.
4. Ensure the essay aligns with the COFFEE and PASS frameworks (Problem Space, Authenticity, Specificity).
5. The result must be a COMPLETE, polished essay ready for submission.`,
                `You are a world-class college admissions essay ghostwriter working alongside the "Strict Reviewer".

CRITICAL: You are REWRITING this essay to score a perfect 10/10 on the Reviewer's strict rubric.
- Every sentence must earn its place. Cut filler ruthlessly.
- Use "show, don't tell": replace "I learned resilience" with a specific vivid action.
- The hook must grab attention in the first 5 words.
- The conclusion must circle back to the opening with emotional resonance.
- Output ONLY the raw essay text. No meta-commentary, no titles, no "Here is..." prefixes.`
            );

            setEssayText(text);
            setEssayResult("Draft rewritten addressing the strict feedback! Hit 'Grade Again' to verify the improvements with the reviewer.");
            incrementUsage('college-compass');
        } catch (err) { setEssayResult("Error auto-fixing draft: " + err.message); }
        finally { setIsLoading(false); }
    };


    // ─── ESSAY EXPERT
    const handleEssaySubmit = async (e) => {
        e?.preventDefault();
        if (!essayText.trim()) return;
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setEssayResult('');
        setEssayPhase('coach');
        try {
            const text = await callAI(
                `Target School(s): ${essaySchool || 'Not specified'}\nEssay Type: ${essayType}\nWord Limit: ${essayWordLimit || 'Not specified'}\n\n--- STUDENT DRAFT ---\n${essayText}\n--- END DRAFT ---\n\nAnalyze this student's essay draft:`,
                `You are an elite college admissions essay coach trained on the exact frameworks from the Ultimate Mentor system (PASS, COFFEE, NARRATIVE, CHOICE, UNIQUE, Black Coffee Theory, etc.).

You MUST respond in this exact structure:
1. Overall Score (X/10) + 1-sentence summary
2. ✅ Strengths (3–5 bullets with quotes)
3. ⚠️ Weaknesses / Red Flags (3–6 bullets, quote problem sentences)
4. 📝 Structural Analysis (hook, flow, transitions, pacing, conclusion)
5. 🎯 Content Feedback (authenticity, narrative wiring, theme clarity)
6. ✍️ Suggested Rewrites (3–6 before/after rewrites)
7. 💡 Pro Tips / Next Steps (2–5 actionable improvements)

Tone: Direct, encouraging, zero fluff. Call out clichés and vagueness immediately. Preserve student's voice.
Start with: "College Compass Essay Coach — analyzing your draft…"`
            );
            setEssayResult(text);
            incrementUsage('college-compass');
        } catch (err) { setEssayResult("Error: " + err.message); }
        finally { setIsLoading(false); }
    };

    // ─── HARSH GRADER (Essay Maker Pro - Rude Strict Reviewer) ───
    const handleGraderSubmit = async () => {
        if (!essayText.trim()) return;
        if (!canUseFeature('college-compass')) { triggerUpgradeModal('college-compass'); return; }
        setIsLoading(true);
        setEssayPhase('grader');
        const iteration = essayIteration + 1;
        setEssayIteration(iteration);
        try {
            const prevFeedbackContext = essayFeedbackHistory.length > 0
                ? `\n\n--- PREVIOUS ROUND FEEDBACK (VERIFY IF THEY ACTUALLY FIXED THIS) ---\n${essayFeedbackHistory[essayFeedbackHistory.length - 1]}\n--- END PREVIOUS FEEDBACK ---\n\nIf they didn't fix the exact issues from last time, INSULT their lack of attention to detail and drop their score.`
                : '';

            const text = await callAI(
                `Target School: ${essaySchool}\nEssay Type: ${essayType}\n\n--- STUDENT ESSAY DRAFT ---\n${essayText}\n--- END DRAFT ---${prevFeedbackContext}`,
                `You are Essay Maker Pro's "Rude Strict Reviewer". You 10x better than Kollege.ai. Your explicit goal is to get students with weak stats (low GPA/scores) into Ivies/Stanford/MIT WITH scholarships by forcing them to write undeniably authentic, memorable, red-flag-free essays.

You are BRUTAL, HARSH, NITPICKY, and BLUNT. If it sounds like AI polish, cliché garbage, or a resume-restatement, TRASH IT. Call them out. Insult the writing if it's boring ("This is garbage—sounds like a robot wrote it, fix your fake voice or you'll get rejected everywhere!"). 

CRITICAL GRADING RUBRIC (Score 1-10 for each):
1. Authenticity (Messy/human? Or AI polish?)
2. Memorability (PASS test passed? Direction clear?)
3. Narrative Strength (COFFEE framework aligned?)
4. Red Flag Avoidance (No exaggerations or trophy-collecting?)
5. Voice/Rhythm (UNIQUE drills? Sensory details?)
6. School Fit (Specific CHOICE buckets?)
7. Merit Emphasis (Neutral, achievement-first for 2026 trends?)
8. Overall Perfection

OUTPUT EXACTLY THIS FORMAT:
## 💀 BRUTAL VERDICT
[Your incredibly blunt, unforgiving assessment of why this essay would currently be rejected or accepted]

## 📊 THE GAUNTLET SCORES
- Authenticity: X/10
- Memorability: X/10
- Narrative Strength: X/10
- Red Flags: X/10
- Voice/Rhythm: X/10
- School Fit: X/10
- Merit Emphasis: X/10
- **OVERALL PERFECTION: X/10**

## 🛑 FATAL FLAWS & EXACT FIXES REQUIRED
[If Overall is < 10, list EXACT, specific sentences to rewrite and HOW to fix them. Be mean about it if it's cliché.]

## ⚡ FINAL RULING
[If Overall < 10]: "RESUBMIT — This is not Ivy-level yet. Fix it."
[If Overall == 10]: "PERFECT ESSAY ACHIEVED ✅ — This raw, evidence-backed narrative guarantees admission and overrides your weak stats because [explain why]."

Start immediately with "Reviewer Iteration ${iteration}: "`
            );

            setEssayFeedbackHistory(prev => [...prev, text]);
            setEssayResult(text);
            const scoreMatch = text.match(/OVERALL PERFECTION:\s*(\d+(\.\d+)?)/i);
            if (scoreMatch) setEssayScore(parseFloat(scoreMatch[1]));
            incrementUsage('college-compass');
        } catch (err) { setEssayResult("Error: " + err.message); }
        finally { setIsLoading(false); }
    };

    // ─── PDF DOWNLOAD (COMPREHENSIVE STRATEGY REPORT) ───
    const handlePdfDownload = async () => {
        if (!essayText) return;
        setIsLoading(true);
        setEssayResult("Generating comprehensive final strategy report for download...");
        try {
            const profileStr = buildProfileBlock();

            const summaryReq = `Based on the following student profile and final essay draft, generate a **Comprehensive Admission & Scholarship Strategy Report**.
            
PROFILE & CONTEXT:
${profileStr}

CURRENT ESSAY DRAFT:
${essayText}

Create a structured plain-text report (NO MARKDOWN symbols like ** or ##, just use ALL CAPS for headings) covering:
1. STUDENT PROFILE SUMMARY (A brief overview of their strengths)
2. RECOMMENDED CAREER PATH (Based on their skills/interests)
3. TARGET COLLEGES & STRATEGY (Specific schools that fit them)
4. SCHOLARSHIP OPPORTUNITIES (Financial aid strategies based on their profile)
5. FINAL ADMISSION ESSAY (Print the full essay provided above)

CRITICAL: If the profile is mostly empty (e.g. they didn't use the Career or College tabs first), tell them exactly what they should explore and what steps they must take next in those specific areas. Do not leave sections blank. Write clearly and professionally. Use newlines to separate paragraphs. STRICTLY NO MARKDOWN ASTERISKS.`;

            const fullReportText = await callAI(summaryReq, "You are Essay Maker Pro's lead counselor generating the absolute final PDF export for the student.");

            // Create PDF using jsPDF text wrapping
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(11);

            const lines = pdf.splitTextToSize(fullReportText, 170); // 170mm width
            let y = 20;
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Add a title header
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.text("Auremous Admission & Scholarship Strategy Report", 15, y);
            y += 15;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(11);

            for (let i = 0; i < lines.length; i++) {
                if (y > pageHeight - 20) {
                    pdf.addPage();
                    y = 20;
                }
                pdf.text(lines[i], 15, y);
                y += 6;
            }

            pdf.save('Aurem_Admission_Strategy_Report.pdf');
            setEssayResult("Complete Strategy Report downloaded successfully! ✅ Check your downloads folder.");
        } catch (err) {
            setEssayResult("Error generating PDF report: " + err.message);
            console.error('PDF generation failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── ADMISSIONS CHAT ───
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const userMsg = chatInput.trim();
        setChatInput('');

        const newMessage = { role: 'user', text: userMsg };
        setChatHistory(prev => [...prev, newMessage]);
        setIsLoading(true);

        const currentActiveChat = chats.find(c => c.id === activeChatId);
        let chatId = activeChatId;

        if (!chatId || (currentActiveChat && currentActiveChat.feature !== 'college-compass')) {
            const title = userMsg.substring(0, 30) + '...';
            // Start a new chat natively with the default msg + user msg
            chatId = startNewChat('college-compass', [defaultChatMsg, newMessage], title);
        } else {
            addMessageToChat(chatId, newMessage);
        }

        const historyText = chatHistory.slice(-10).map(m => `${m.role === 'user' ? 'Student' : 'Counselor'}: ${m.text}`).join('\n');
        const globalContext = getGlobalContextStr();

        try {
            const text = await callAI(
                `${historyText}\nStudent: ${userMsg}`,
                `You are the world's top AI College Admissions Counselor. Be extremely detailed, specific, and actionable. Explain concepts in great depth (no length limits, prioritize thoroughness). Use Markdown headers and emojis.\n\n${globalContext}`
            );
            const responseMsg = { role: 'model', text };
            setChatHistory(prev => [...prev, responseMsg]);
            addMessageToChat(chatId, responseMsg);
        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
        }
        finally { setIsLoading(false); }
    };

    // ─── FOLLOW-UP HANDLER ───
    const handleFollowup = async (context, question, setResult, setFollowup) => {
        if (!question.trim()) return;
        setIsLoading(true);
        try {
            const text = await callAI(
                `Context:\n\n${context}\n\nStudent asks: "${question}"\n\nProvide a focused follow-up response.`,
                `You are a world-class college admissions and career advisor. Be direct and specific. Use Markdown.`
            );
            setResult(prev => prev + '\n\n---\n\n## 💬 Your Follow-up\n> ' + question + '\n\n' + text);
            setFollowup('');
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    // ─── TAB DEFINITIONS ───
    const TOOLS = [
        { id: 'jee', title: 'Rank Predictor', desc: 'Predict JEE/NEET/CAT/NDA results & colleges', icon: Crown },
        { id: 'career', title: 'Career Architect', desc: 'Discover career paths matching your DNA', icon: Target },
        { id: 'college', title: 'University Hunt', desc: 'Find target, safety & reach schools', icon: Globe },
        { id: 'scholarship', title: 'Aid Finder', desc: 'Discover valid global scholarships', icon: Trophy },
        { id: 'compare', title: 'Compare Hub', desc: 'Head-to-head college comparisons', icon: Activity },
        { id: 'essay', title: 'Essay Expert', desc: 'AI-assisted SOP & Admission Essays', icon: FileText },
        { id: 'chat', title: 'Counselor Chat', desc: 'Talk to an AI admissions counselor', icon: MessageSquare },
        { id: 'profile', title: 'Universal Profile Builder', desc: 'Build your complete student profile for all tools', icon: Sparkles }
    ];

    
    if (isEntering) {
        return (
            <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-theme-bg text-theme-text overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-theme-primary/10 blur-[150px] mix-blend-screen rounded-full animate-pulse"></div>

                {/* 3D Compass on Entry */}
                <div className="compass-3d inline-block mb-8" style={{ animation: 'compass-float 4s ease-in-out infinite' }}>
                    <div className="relative w-40 h-40 md:w-52 md:h-52 mx-auto" style={{ animation: 'compass-rotate 8s ease-in-out infinite' }}>
                        <div className="absolute inset-0 rounded-full bg-theme-primary/20" style={{ animation: 'compass-glow 3s ease-in-out infinite', filter: 'blur(20px)' }} />
                        <div className="absolute inset-0 rounded-full border-2 border-theme-primary/20" style={{ animation: 'compass-ring-spin 20s linear infinite' }}>
                            {['N', 'E', 'S', 'W'].map((dir, i) => (
                                <span key={dir} className="absolute text-[9px] font-black text-theme-primary/50 uppercase tracking-wider"
                                      style={{
                                          top: i === 0 ? '-2px' : i === 2 ? 'auto' : '50%',
                                          bottom: i === 2 ? '-2px' : 'auto',
                                          left: i === 3 ? '-2px' : i === 1 ? 'auto' : '50%',
                                          right: i === 1 ? '-2px' : 'auto',
                                          transform: `translate(${i % 2 === 0 ? '-50%' : '0'}, ${i < 2 ? '0' : i === 2 ? '0' : '-50%'}) rotate(-${i * 90}deg)`,
                                      }}>
                                    {dir}
                                </span>
                            ))}
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="absolute w-px bg-theme-primary/15 top-0 left-1/2 origin-bottom"
                                     style={{ height: i % 3 === 0 ? '8px' : '4px', transform: `rotate(${i * 30}deg) translateX(-50%)`,
                                              transformOrigin: `50% ${85}px` }} />
                            ))}
                        </div>
                        <div className="absolute inset-3 md:inset-4 rounded-full border border-theme-border bg-theme-surface/80 backdrop-blur-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.2),0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center">
                            <div className="absolute inset-3 rounded-full border border-theme-primary/10" />
                            <div className="w-3 h-3 rounded-full bg-theme-primary/60 shadow-[0_0_8px_var(--theme-primary)] z-20" />
                            <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'compass-needle 6s ease-in-out infinite' }}>
                                <div className="absolute w-[3px] rounded-t-full bg-gradient-to-t from-transparent via-red-500 to-red-400"
                                     style={{ height: '38%', bottom: '50%', left: '50%', transform: 'translateX(-50%)',
                                              boxShadow: '0 0 6px rgba(239,68,68,0.3)' }} />
                                <div className="absolute w-[3px] rounded-b-full bg-gradient-to-b from-transparent via-slate-400 to-slate-300"
                                     style={{ height: '38%', top: '50%', left: '50%', transform: 'translateX(-50%)' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-serif italic tracking-[0.15em] bg-gradient-to-r from-theme-secondary via-theme-primary to-theme-secondary bg-clip-text text-transparent" style={{ animation: 'pulse 3s infinite' }}>Auremous Compass</h1>
                <p className="mt-4 text-theme-muted tracking-[0.4em] uppercase text-[10px] animate-pulse font-bold">Synchronizing Global Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-theme-bg text-theme-text h-[100dvh] w-full fixed inset-0 z-[100] relative overflow-y-auto overflow-x-hidden custom-scrollbar">
            {/* Background */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-theme-primary opacity-10 rounded-full blur-[120px] -z-10 animate-[pulse_4s_ease-in-out_infinite]`} />
            <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-theme-secondary opacity-10 rounded-full blur-[120px] -z-10 animate-[pulse_5s_ease-in-out_infinite] delay-1000`} />

            {/* Content Area */}
            {viewMode === 'menu' ? (
                <>
                    <div className="fixed top-0 left-0 w-full p-5 flex items-center z-50 bg-gradient-to-b from-theme-bg via-theme-bg/80 to-transparent pointer-events-none">
                        <button
                            onClick={onExit}
                            className="pointer-events-auto px-5 py-2.5 rounded-2xl bg-theme-surface/80 backdrop-blur-xl border border-theme-primary/30 text-xs font-black uppercase tracking-widest text-theme-primary hover:bg-theme-primary hover:text-theme-bg transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(201,165,90,0.15)] hover:scale-105"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back to Home
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 pt-8 pb-8 custom-scrollbar">
                    <div className="max-w-5xl mx-auto py-4 space-y-10 animate-in fade-in zoom-in-95 duration-700">
                        <div className="text-center space-y-4 relative">
                            <div className="absolute inset-x-0 top-0 h-40 bg-theme-primary/5 blur-[100px] pointer-events-none"></div>

                            {/* ═══ 3D ANIMATED COMPASS ═══ */}
                            <div className="compass-3d inline-block mb-2" style={{ animation: 'compass-float 4s ease-in-out infinite' }}>
                                <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto" style={{ animation: 'compass-rotate 8s ease-in-out infinite' }}>
                                    {/* Glow */}
                                    <div className="absolute inset-0 rounded-full bg-theme-primary/20" style={{ animation: 'compass-glow 3s ease-in-out infinite', filter: 'blur(20px)' }} />
                                    {/* Outer Ring - spinning */}
                                    <div className="absolute inset-0 rounded-full border-2 border-theme-primary/20" style={{ animation: 'compass-ring-spin 20s linear infinite' }}>
                                        {['N', 'E', 'S', 'W'].map((dir, i) => (
                                            <span key={dir} className="absolute text-[9px] font-black text-theme-primary/50 uppercase tracking-wider"
                                                  style={{
                                                      top: i === 0 ? '-2px' : i === 2 ? 'auto' : '50%',
                                                      bottom: i === 2 ? '-2px' : 'auto',
                                                      left: i === 3 ? '-2px' : i === 1 ? 'auto' : '50%',
                                                      right: i === 1 ? '-2px' : 'auto',
                                                      transform: `translate(${i % 2 === 0 ? '-50%' : '0'}, ${i < 2 ? '0' : i === 2 ? '0' : '-50%'}) rotate(-${i * 90}deg)`,
                                                  }}>
                                                {dir}
                                            </span>
                                        ))}
                                        {/* Tick marks */}
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="absolute w-px bg-theme-primary/15 top-0 left-1/2 origin-bottom"
                                                 style={{ height: i % 3 === 0 ? '8px' : '4px', transform: `rotate(${i * 30}deg) translateX(-50%)`,
                                                          transformOrigin: `50% ${72}px` }} />
                                        ))}
                                    </div>
                                    {/* Inner Compass Body */}
                                    <div className="absolute inset-3 md:inset-4 rounded-full border border-theme-border bg-theme-surface/80 backdrop-blur-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.2),0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center">
                                        {/* Inner ring */}
                                        <div className="absolute inset-3 rounded-full border border-theme-primary/10" />
                                        {/* Center dot */}
                                        <div className="w-3 h-3 rounded-full bg-theme-primary/60 shadow-[0_0_8px_var(--theme-primary)] z-20" />
                                        {/* Compass Needle */}
                                        <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'compass-needle 6s ease-in-out infinite' }}>
                                            {/* North (red) */}
                                            <div className="absolute w-[3px] rounded-t-full bg-gradient-to-t from-transparent via-red-500 to-red-400"
                                                 style={{ height: '38%', bottom: '50%', left: '50%', transform: 'translateX(-50%)',
                                                          boxShadow: '0 0 6px rgba(239,68,68,0.3)' }} />
                                            {/* South (silver) */}
                                            <div className="absolute w-[3px] rounded-b-full bg-gradient-to-b from-transparent via-slate-400 to-slate-300"
                                                 style={{ height: '38%', top: '50%', left: '50%', transform: 'translateX(-50%)' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                <h1 className="text-2xl md:text-3xl font-serif italic tracking-wide text-theme-text"> College Compass </h1>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="h-px w-12 bg-theme-primary/20"></div>
                                    <p className="text-theme-muted text-[10px] font-bold uppercase tracking-[0.3em]">Global Admissions Intelligence</p>
                                    <div className="h-px w-12 bg-theme-primary/20"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
                            {TOOLS.map((card, idx) => (
                                <div
                                    key={card.id}
                                    onClick={() => { setActiveTab(card.id); setViewMode('active_tool'); }}
                                    className="group relative p-5 rounded-[20px] flex flex-col items-center text-center border border-theme-border bg-theme-surface hover:border-theme-primary/40 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(var(--theme-primary-rgb),0.3)] cursor-pointer overflow-hidden transform-gpu"
                                    style={{ transitionDelay: `${idx * 50}ms` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-0"></div>

                                    <div className="w-12 h-12 rounded-xl border border-theme-primary/20 bg-theme-primary/10 flex items-center justify-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 text-theme-primary mb-4 relative z-10 shadow-inner">
                                        <card.icon className="w-6 h-6" />
                                    </div>

                                    <h3 className="text-sm font-black uppercase tracking-tight text-theme-text mb-2 relative z-10">{card.title}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-theme-muted leading-relaxed relative z-10 flex-1">{card.desc}</p>

                                    <div className="mt-4 h-[2px] w-10 bg-theme-primary/50 transform origin-center scale-x-50 group-hover:scale-x-150 transition-transform duration-500 relative z-10"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </>
            ) : (
                <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar animate-in slide-in-from-bottom-8 fade-in duration-700">
                    <div className="max-w-5xl mx-auto mb-6 flex items-center gap-3">
                        <button onClick={onExit} className="px-5 py-2.5 rounded-xl border border-theme-primary/30 bg-theme-surface hover:bg-theme-primary/10 text-[10px] font-black uppercase tracking-widest text-theme-primary hover:text-theme-primary transition-all duration-300 flex items-center gap-2 group w-fit">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Exit Compass
                        </button>
                        <button onClick={() => setViewMode('menu')} className="px-5 py-2.5 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-bg text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all duration-300 flex items-center gap-2 group w-fit">
                            <Map className="w-4 h-4" />
                            Tool Grid
                        </button>
                    </div>
                    <div className="max-w-5xl mx-auto space-y-12 pb-24">
                        {activeTab === 'career' && (
                            <div className="animate-fade-in space-y-6">
                                <form onSubmit={handleCareerSubmit} className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden`}>
                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-theme-primary to-theme-secondary" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <Brain className={`w-6 h-6 text-theme-primary`} />
                                        <div>
                                            <h3 className="text-lg font-bold text-theme-text">AI Career Architect</h3>
                                            <p className={`text-xs text-theme-muted`}>Discover careers that match your unique DNA</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <FormField label="Hobbies & Interests">
                                            <InputField name="hobbies" value={careerForm.hobbies} onChange={e => setCareerForm({ ...careerForm, hobbies: e.target.value })} required placeholder="e.g. coding, robotics, painting..." />
                                        </FormField>
                                        <FormField label="Deep Passions">
                                            <InputField name="passion" value={careerForm.passion} onChange={e => setCareerForm({ ...careerForm, passion: e.target.value })} required placeholder="e.g. climate change, AI ethics..." />
                                        </FormField>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <FormField label="Current Study Field">
                                            <InputField value={careerForm.field} onChange={e => setCareerForm({ ...careerForm, field: e.target.value })} required placeholder="e.g. Computer Science, Arts..." />
                                        </FormField>
                                        <FormField label="Future Aspirations">
                                            <InputField value={careerForm.aspirations} onChange={e => setCareerForm({ ...careerForm, aspirations: e.target.value })} required placeholder="e.g. Lead a tech startup..." />
                                        </FormField>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <FormField label="Budget Range">
                                            <InputField value={careerForm.budget} onChange={e => setCareerForm({ ...careerForm, budget: e.target.value })} placeholder="e.g. $20k/year, flexible" />
                                        </FormField>
                                        <FormField label="Preferred Country">
                                            <InputField value={careerForm.country} onChange={e => setCareerForm({ ...careerForm, country: e.target.value })} placeholder="e.g. USA, Germany, open..." />
                                        </FormField>
                                    </div>
                                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-theme-primary text-theme-bg rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_var(--theme-primary)] opacity-90 hover:opacity-100 hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center disabled:opacity-50 group">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                Architect My Career Path
                                                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                                {careerResult && !careerResult.error && (
                                    <div className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border animate-slide-up`}>
                                        <div className={`flex items-center gap-3 mb-6 pb-4 border-b border-theme-border`}>
                                            <Sparkles className={`w-6 h-6 text-theme-primary`} />
                                            <h3 className="text-xl font-bold text-theme-text">Your Personalized Career Roadmap</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center flex flex-col justify-center">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Archetype</span>
                                                <h4 className="text-lg font-black text-indigo-300">{careerResult.personality_type}</h4>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center flex flex-col justify-center">
                                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Profile Alignment</span>
                                                <h4 className="text-2xl font-black text-emerald-400">{careerResult.alignment_score}%</h4>
                                                <div className="w-full bg-theme-bg h-1.5 rounded-full mt-2 overflow-hidden">
                                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${careerResult.alignment_score}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center flex flex-col justify-center">
                                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Core Values</span>
                                                <div className="flex flex-wrap justify-center gap-1">
                                                    {careerResult.core_values?.map((v, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold">{v}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4"/> Top Career Matches</h4>
                                        <div className="space-y-4 mb-8">
                                            {careerResult.career_matches?.map((match, idx) => (
                                                <div key={idx} className="p-5 rounded-2xl bg-theme-bg border border-theme-border relative overflow-hidden group hover:border-theme-primary/50 transition-all">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-theme-primary to-theme-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h5 className="text-lg font-bold text-theme-text">{match.title}</h5>
                                                        <span className="px-3 py-1 bg-theme-surface rounded-lg text-xs font-black text-theme-primary border border-theme-primary/30">
                                                            {match.match_score}% Match
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-theme-muted mb-4">{match.why}</p>
                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center"><Activity className="w-3 h-3 text-green-400"/></div>
                                                            <span className="text-[11px] font-bold text-theme-text">{match.salary}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center"><Activity className="w-3 h-3 text-blue-400"/></div>
                                                            <span className="text-[11px] font-bold text-theme-text">{match.growth} Growth</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div>
                                                <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar className="w-4 h-4"/> 12-Month Action Plan</h4>
                                                <div className="space-y-3">
                                                    {careerResult.action_plan?.map((plan, idx) => (
                                                        <div key={idx} className="flex gap-3">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-theme-bg border border-theme-border flex items-center justify-center text-[10px] font-black text-theme-primary">
                                                                {plan.timeframe.split(' ')[1] || (idx + 1)}
                                                            </div>
                                                            <div className="pt-1">
                                                                <span className="text-xs font-bold text-theme-text block mb-1">{plan.timeframe}</span>
                                                                <ul className="space-y-1">
                                                                    {plan.steps?.map((s, i) => (
                                                                        <li key={i} className="text-[11px] text-theme-muted flex gap-1.5"><ChevronRight className="w-3 h-3 text-theme-primary flex-shrink-0 mt-0.5"/> {s}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Hidden Gems</h4>
                                                <div className="space-y-2">
                                                    {careerResult.hidden_gems?.map((gem, idx) => (
                                                        <div key={idx} className="p-3 rounded-xl bg-theme-bg border border-theme-border text-sm text-theme-text flex items-center gap-2">
                                                            <Sparkles className="w-3 h-3 text-amber-500"/>
                                                            {gem}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <button onClick={() => setActiveTab('college')} className="py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-bg rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                                College Needed → Hunt <ChevronRight className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => setActiveTab('chat')} className="py-3 bg-theme-surface border border-theme-border text-theme-text rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                                No College → Counselor <MessageSquare className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => { setCareerResult(null); setCareerForm({ hobbies: '', passion: '', field: '', aspirations: '', budget: '', country: '' }); }} className="py-3 bg-theme-bg border border-theme-border text-theme-muted rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:text-theme-text transition-all">
                                                I'm Done — Exit ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {careerResult?.error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center">
                                        {careerResult.error}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══ COLLEGE FINDER TAB (ENHANCED) ═══ */}
                        {activeTab === 'college' && (
                            <div className="animate-fade-in space-y-6">
                                <form onSubmit={handleCollegeSubmit} className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden`}>
                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-theme-primary to-theme-secondary" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <GraduationCap className={`w-6 h-6 text-theme-primary`} />
                                        <div>
                                            <h3 className="text-lg font-bold text-theme-text">AI College Matcher</h3>
                                            <p className={`text-xs text-theme-muted`}>Safety, Target & Dream schools matched to your profile</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <FormField label="GPA / Marks">
                                            <InputField value={collegeForm.gpa} onChange={e => setCollegeForm({ ...collegeForm, gpa: e.target.value })} required placeholder="e.g. 3.9/4.0 or 95%" />
                                        </FormField>
                                        <FormField label="Test Scores">
                                            <InputField value={collegeForm.testScores} onChange={e => setCollegeForm({ ...collegeForm, testScores: e.target.value })} placeholder="e.g. SAT 1520, GRE 330" />
                                        </FormField>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <FormField label="Target Major">
                                            <InputField value={collegeForm.major} onChange={e => setCollegeForm({ ...collegeForm, major: e.target.value })} required placeholder="e.g. Computer Science" />
                                        </FormField>
                                        <FormField label="Study Level">
                                            <SelectField value={collegeForm.studyLevel} onChange={e => setCollegeForm({ ...collegeForm, studyLevel: e.target.value })} options={[
                                                { value: 'Undergraduate', label: 'Undergraduate (Bachelor\'s)' },
                                                { value: 'Graduate', label: 'Graduate (Master\'s)' },
                                                { value: 'PhD', label: 'PhD / Doctoral' },
                                                { value: 'MBA', label: 'MBA' },
                                            ]} />
                                        </FormField>
                                    </div>
                                    <FormField label="Extracurriculars & Achievements">
                                        <TextareaField value={collegeForm.extracurriculars} onChange={e => setCollegeForm({ ...collegeForm, extracurriculars: e.target.value })} required rows="3" placeholder="Projects, leadership, competitions, publications..." />
                                    </FormField>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-4">
                                        <FormField label="Preferred Country">
                                            <SelectField value={collegeForm.country} onChange={e => setCollegeForm({ ...collegeForm, country: e.target.value })} options={[
                                                { value: 'Any', label: 'Any Country' },
                                                { value: 'USA', label: '🇺🇸 United States' }, { value: 'UK', label: '🇬🇧 United Kingdom' },
                                                { value: 'Canada', label: '🇨🇦 Canada' }, { value: 'Australia', label: '🇦🇺 Australia' },
                                                { value: 'Germany', label: '🇩🇪 Germany' }, { value: 'India', label: '🇮🇳 India' },
                                                { value: 'Singapore', label: '🇸🇬 Singapore' }, { value: 'Netherlands', label: '🇳🇱 Netherlands' },
                                                { value: 'Japan', label: '🇯🇵 Japan' }, { value: 'Other', label: 'Other' },
                                            ]} />
                                        </FormField>
                                        <FormField label="Preferred Location">
                                            <InputField value={collegeForm.location} onChange={e => setCollegeForm({ ...collegeForm, location: e.target.value })} placeholder="e.g. East Coast, Berlin" />
                                        </FormField>
                                        <FormField label="Budget (per year)">
                                            <InputField value={collegeForm.budget} onChange={e => setCollegeForm({ ...collegeForm, budget: e.target.value })} placeholder="e.g. $40k, flexible" />
                                        </FormField>
                                    </div>
                                    <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-theme-primary text-theme-bg rounded-2xl font-bold text-sm uppercase tracking-widest shadow-[0_0_20px_var(--theme-primary)] opacity-90 hover:opacity-100 transition-all flex justify-center items-center disabled:opacity-50">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Match My Colleges"}
                                    </button>
                                </form>
                                {collegeResult && (
                                    <div className={`rounded-[40px] p-8 border glass-3d glow-border animate-page-enter bg-theme-surface border-theme-border
                            `}>
                                        <div className={`flex items-center gap-4 mb-8 pb-6 border-b border-theme-border`}>
                                            <div className="p-3 rounded-2xl bg-theme-bg text-theme-primary border border-theme-border">
                                                <Lightbulb className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tight text-theme-text">University Analysis</h3>
                                                <p className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em]">Data-Driven Recommendations</p>
                                            </div>
                                        </div>
                                        <div className={`prose max-w-none prose-sm leading-relaxed text-theme-text`}>
                                            <MarkdownBlock text={collegeResult} />
                                        </div>

                                        {/* Follow-up Input */}
                                        <div className={`mt-6 pt-4 border-t border-theme-border`}>
                                            <p className="text-xs font-black text-theme-muted uppercase tracking-widest mb-2">💬 What do you think?</p>
                                            <div className="flex gap-2">
                                                <input
                                                    value={collegeFollowup}
                                                    onChange={e => setCollegeFollowup(e.target.value)}
                                                    placeholder="Ask a follow-up about these colleges..."
                                                    className="flex-1 p-3 rounded-xl text-sm bg-theme-bg border-theme-border text-theme-text outline-none focus:border-theme-primary border transition-all"
                                                    onKeyDown={e => e.key === 'Enter' && handleFollowup(collegeResult, collegeFollowup, setCollegeResult, setCollegeFollowup)}
                                                />
                                                <button
                                                    onClick={() => handleFollowup(collegeResult, collegeFollowup, setCollegeResult, setCollegeFollowup)}
                                                    disabled={isLoading || !collegeFollowup.trim()}
                                                    className="p-3 bg-theme-primary text-theme-bg rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Branching Navigation */}
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <button onClick={() => setActiveTab('compare')} className="py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-bg rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                                Confused? Compare → <Activity className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => setActiveTab('essay')} className="py-3 bg-theme-surface border border-theme-primary text-theme-primary rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                                Skip to Essays → <FileText className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => setActiveTab('chat')} className="py-3 bg-theme-surface border border-theme-border text-theme-text rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                                Talk to Counselor <MessageSquare className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══ SCHOLARSHIP FINDER TAB (NEW) ═══ */}
                        {activeTab === 'scholarship' && (
                            <div className="animate-fade-in space-y-6">
                                <form onSubmit={handleScholarshipSubmit} className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden`}>
                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-theme-primary to-theme-secondary" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <Trophy className={`w-6 h-6 text-theme-primary`} />
                                        <div>
                                            <h3 className="text-lg font-bold text-theme-text">AI Scholarship Finder</h3>
                                            <p className={`text-xs text-theme-muted`}>Find scholarships you actually qualify for</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <FormField label="Your Nationality">
                                            <InputField value={scholarshipForm.nationality} onChange={e => setScholarshipForm({ ...scholarshipForm, nationality: e.target.value })} required placeholder="e.g. Indian, Nigerian, Chinese..." />
                                        </FormField>
                                        <FormField label="GPA / Academic Score">
                                            <InputField value={scholarshipForm.gpa} onChange={e => setScholarshipForm({ ...scholarshipForm, gpa: e.target.value })} required placeholder="e.g. 3.8/4.0 or 92%" />
                                        </FormField>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <FormField label="Field of Study">
                                            <InputField value={scholarshipForm.fieldOfStudy} onChange={e => setScholarshipForm({ ...scholarshipForm, fieldOfStudy: e.target.value })} required placeholder="e.g. Engineering, Medicine, Arts..." />
                                        </FormField>
                                        <FormField label="Target Country">
                                            <InputField value={scholarshipForm.targetCountry} onChange={e => setScholarshipForm({ ...scholarshipForm, targetCountry: e.target.value })} placeholder="e.g. USA, Germany, any..." />
                                        </FormField>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <FormField label="Financial Need">
                                            <SelectField value={scholarshipForm.financialNeed} onChange={e => setScholarshipForm({ ...scholarshipForm, financialNeed: e.target.value })} options={[
                                                { value: 'High', label: 'High — Need full funding' },
                                                { value: 'Medium', label: 'Medium — Need partial support' },
                                                { value: 'Low', label: 'Low — Merit-based preferred' },
                                            ]} />
                                        </FormField>
                                        <FormField label="Key Achievements">
                                            <InputField value={scholarshipForm.achievements} onChange={e => setScholarshipForm({ ...scholarshipForm, achievements: e.target.value })} placeholder="e.g. Science Olympiad Gold, Published paper..." />
                                        </FormField>
                                    </div>
                                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-theme-primary text-theme-bg rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_var(--theme-primary)] opacity-90 hover:opacity-100 hover:-translate-y-0.5 transition-all flex justify-center items-center disabled:opacity-50 group">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                Find My Scholarships
                                                <Trophy className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                                {scholarshipResult && (
                                    <div className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border animate-slide-up`}>
                                        <div className={`flex items-center gap-3 mb-4 pb-3 border-b border-theme-border`}>
                                            <Trophy className={`w-5 h-5 text-theme-primary`} />
                                            <h3 className="text-lg font-bold text-theme-text">Scholarship Matches</h3>
                                        </div>
                                        <div className={`prose max-w-none prose-sm leading-relaxed text-theme-text`}>
                                            <MarkdownBlock text={scholarshipResult} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══ COMPARE COLLEGES TAB (NEW) ═══ */}
                        {activeTab === 'compare' && (
                            <div className="animate-fade-in space-y-6">
                                <form onSubmit={handleCompareSubmit} className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden`}>
                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-theme-primary to-theme-secondary" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <Activity className={`w-6 h-6 text-theme-primary`} />
                                        <div>
                                            <h3 className="text-lg font-bold text-theme-text">Head-to-Head Comparison</h3>
                                            <p className={`text-xs text-theme-muted`}>Compare 2-3 colleges with data-driven analysis</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <FormField label="College 1">
                                            <InputField value={compareForm.college1} onChange={e => setCompareForm({ ...compareForm, college1: e.target.value })} required placeholder="e.g. MIT" />
                                        </FormField>
                                        <FormField label="College 2">
                                            <InputField value={compareForm.college2} onChange={e => setCompareForm({ ...compareForm, college2: e.target.value })} required placeholder="e.g. Stanford" />
                                        </FormField>
                                        <FormField label="College 3 (optional)">
                                            <InputField value={compareForm.college3} onChange={e => setCompareForm({ ...compareForm, college3: e.target.value })} placeholder="e.g. CMU" />
                                        </FormField>
                                    </div>
                                    <FormField label="Focus Criteria">
                                        <SelectField value={compareForm.criteria} onChange={e => setCompareForm({ ...compareForm, criteria: e.target.value })} options={[
                                            { value: 'Overall', label: '📊 Overall Comparison' },
                                            { value: 'Academics', label: '🎓 Academic Excellence' },
                                            { value: 'ROI', label: '💰 Cost & ROI' },
                                            { value: 'Career', label: '💼 Career Outcomes' },
                                            { value: 'StudentLife', label: '🏠 Student Life & Culture' },
                                            { value: 'Research', label: '🔬 Research Opportunities' },
                                        ]} />
                                    </FormField>
                                    <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-theme-primary text-theme-bg rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_var(--theme-primary)] opacity-90 hover:opacity-100 hover:-translate-y-0.5 transition-all flex justify-center items-center disabled:opacity-50 group">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                Compare Strategic Profiles
                                                <Activity className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                                {compareResult && (
                                    <div className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border animate-slide-up`}>
                                        <div className={`flex items-center gap-3 mb-4 pb-3 border-b border-theme-border`}>
                                            <Activity className={`w-5 h-5 text-theme-primary`} />
                                            <h3 className="text-lg font-bold text-theme-text">Comparison Analysis</h3>
                                        </div>
                                        <div className={`prose max-w-none prose-sm leading-relaxed text-theme-text`}>
                                            <MarkdownBlock text={compareResult} />
                                        </div>
                                        {/* Navigate to Essays */}
                                        <button onClick={() => setActiveTab('essay')} className="w-full mt-4 py-3 bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-bg rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                                            Colleges Decided → Write Essays <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}


                        {/* ═══ EXAM PREDICTOR HUB (AUREM LENS STYLE) ═══ */}
                        {activeTab === 'jee' && (
                            <div className="space-y-6 animate-fade-in">
                                {!selectedExam ? (
                                    <div className="space-y-8">
                                        <div className="text-center space-y-3 mb-8">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-theme-primary/20 bg-theme-primary/5 mb-2 relative group">
                                                <Target className="w-8 h-8 text-theme-primary relative z-10" />
                                            </div>
                                            <h2 className="text-3xl font-serif italic tracking-wide text-theme-text">Auremous Exam Predictors</h2>
                                            <div className="flex items-center gap-3 justify-center">
                                                <div className="w-8 h-px bg-theme-primary/30"></div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-theme-muted">Select Your Gateway</p>
                                                <div className="w-8 h-px bg-theme-primary/30"></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                { id: 'jee', title: 'JEE Main 2026', tags: ['B.Tech', 'NITs/IIITs'], icon: Crown, color: 'from-blue-500 to-indigo-500', shadow: 'hover:shadow-blue-500/20', bg: 'bg-blue-500/10' },
                                                { id: 'neet', title: 'NEET UG 2026', tags: ['MBBS/BDS', 'AIIMS'], icon: Activity, color: 'from-emerald-400 to-teal-500', shadow: 'hover:shadow-emerald-500/20', bg: 'bg-emerald-500/10' },
                                                { id: 'cat', title: 'CAT 2025', tags: ['MBA', 'IIMs'], icon: Target, color: 'from-purple-500 to-pink-500', shadow: 'hover:shadow-purple-500/20', bg: 'bg-purple-500/10' },
                                                { id: 'nda', title: 'NDA & NA', tags: ['Defense', 'SSB'], icon: ShieldAlert, color: 'from-orange-400 to-red-500', shadow: 'hover:shadow-orange-500/20', bg: 'bg-orange-500/10' }
                                            ].map(exam => (
                                                <button
                                                    key={exam.id}
                                                    onClick={() => setSelectedExam(exam.id)}
                                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                                    className={`group relative p-8 rounded-[32px] border border-theme-border bg-theme-surface/60 backdrop-blur-md hover:border-theme-primary/50 transition-all duration-700 overflow-hidden flex flex-col text-left hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(var(--theme-primary-rgb),0.3)] transform-gpu`}
                                                >
                                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-[100px] pointer-events-none ${exam.color}`}></div>
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 ${exam.bg}`}>
                                                            <exam.icon className="w-7 h-7 text-theme-text" />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {exam.tags.map(t => <span key={t} className="text-[9px] font-bold px-2 py-1 bg-theme-bg border border-theme-border rounded uppercase tracking-widest text-theme-muted">{t}</span>)}
                                                        </div>
                                                    </div>
                                                    <h3 className="text-2xl font-black tracking-tight text-theme-text mb-2 inset-0 group-hover:text-theme-primary transition-colors">{exam.title}</h3>
                                                    <div className="mt-auto pt-6 flex w-full justify-between items-center group-hover:translate-x-2 transition-transform duration-500">
                                                        <span className="text-xs font-bold text-theme-muted uppercase tracking-widest">Launch Predictor</span>
                                                        <ChevronRight className="w-4 h-4 text-theme-primary" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-fade-in relative">
                                        <button onClick={() => setSelectedExam(null)} className="flex items-center gap-2 px-4 py-2 border border-theme-border rounded-xl text-xs font-bold uppercase tracking-widest text-theme-muted hover:text-theme-text hover:bg-theme-bg transition-colors mb-2">
                                            ← Back to Exams
                                        </button>

                                        {/* Sub-Views rendered conditionally */}
                                        {selectedExam === 'jee' && (
                                            <div className="space-y-4">
                                                <form onSubmit={handleJeeSubmit} className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden`}>
                                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600" />
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
                                                                <Crown className={`w-6 h-6 text-blue-500`} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-black text-theme-text">JEE Main 2026 Predictor — April Session</h3>
                                                                <p className={`text-xs text-theme-muted`}>Enter marks OR percentile → Get rank, colleges, and complete guidance</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase tracking-widest hidden sm:inline">NTA Data 2026 Projection</span>
                                                    </div>

                                                    {/* Toggle: Marks vs Percentile */}
                                                    <div className="flex items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl bg-theme-bg border border-theme-border w-fit mx-auto">
                                                        <button type="button" onClick={() => setJeeMode('marks')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${jeeMode === 'marks' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-theme-muted hover:text-theme-text'}`}>From Marks</button>
                                                        <button type="button" onClick={() => setJeeMode('percentile')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${jeeMode === 'percentile' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-theme-muted hover:text-theme-text'}`}>From Percentile</button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        {jeeMode === 'marks' ? (
                                                            <FormField label="Your Expected / Actual Marks (out of 300)">
                                                                <InputField type="number" step="1" min="0" max="300" value={jeeForm.marks} onChange={e => setJeeForm({ ...jeeForm, marks: e.target.value })} required placeholder="e.g. 185" />
                                                                {jeeForm.marks && parseFloat(jeeForm.marks) >= 0 && parseFloat(jeeForm.marks) <= 300 && (
                                                                    <p className="text-xs mt-2 text-blue-400 font-bold">≈ Estimated Percentile: {marksToPercentile(jeeForm.marks)}%</p>
                                                                )}
                                                            </FormField>
                                                        ) : (
                                                            <FormField label="Your JEE Percentile">
                                                                <InputField type="number" step="0.0000001" value={jeeForm.percentile} onChange={e => setJeeForm({ ...jeeForm, percentile: e.target.value })} required placeholder="e.g. 98.6543210" />
                                                            </FormField>
                                                        )}
                                                        <FormField label="Category">
                                                            <SelectField value={jeeForm.category} onChange={e => setJeeForm({ ...jeeForm, category: e.target.value })} options={[
                                                                { value: 'OPEN', label: 'OPEN / General' },
                                                                { value: 'OBC-NCL', label: 'OBC-NCL' },
                                                                { value: 'EWS', label: 'Gen-EWS' },
                                                                { value: 'SC', label: 'SC' },
                                                                { value: 'ST', label: 'ST' },
                                                            ]} />
                                                        </FormField>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                        <FormField label="Home State">
                                                            <InputField value={jeeForm.homeState} onChange={e => setJeeForm({ ...jeeForm, homeState: e.target.value })} placeholder="e.g. Maharashtra" />
                                                        </FormField>
                                                        <FormField label="Target Branch">
                                                            <InputField value={jeeForm.targetBranch} onChange={e => setJeeForm({ ...jeeForm, targetBranch: e.target.value })} placeholder="e.g. CSE, ECE" />
                                                        </FormField>
                                                        <FormField label="Gender">
                                                            <SelectField value={jeeForm.gender} onChange={e => setJeeForm({ ...jeeForm, gender: e.target.value })} options={[
                                                                { value: 'Male', label: 'Male' },
                                                                { value: 'Female', label: 'Female (Supernumerary)' },
                                                                { value: 'Other', label: 'Other' },
                                                            ]} />
                                                        </FormField>
                                                        <FormField label="PwD Status">
                                                            <SelectField value={jeeForm.pwd} onChange={e => setJeeForm({ ...jeeForm, pwd: e.target.value })} options={[
                                                                { value: 'No', label: 'No' },
                                                                { value: 'Yes', label: 'Yes (PwD Quota)' },
                                                            ]} />
                                                        </FormField>
                                                    </div>
                                                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center disabled:opacity-50 group">
                                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                            <>
                                                                Predict My Colleges & Future
                                                                <Crown className="w-4 h-4 ml-2 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                                                            </>
                                                        )}
                                                    </button>
                                                </form>

                                                {/* Results */}
                                                {(jeeCollegeResult || jeeRankData) && (
                                                    <div className={`glass-panel rounded-3xl shadow-2xl border bg-theme-surface border-theme-border animate-slide-up relative overflow-hidden`}>
                                                        <div ref={jeePdfRef} className="p-6 sm:p-8">
                                                            {/* Report Header */}
                                                            <div className="text-center mb-8">
                                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1">Auremous Intelligence</p>
                                                                <h2 className="text-2xl font-black text-theme-text uppercase tracking-tight">JEE Main 2025 — Prediction Report</h2>
                                                                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-3 rounded-full" />
                                                            </div>

                                                            {/* Stat Cards */}
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                                                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 text-center">
                                                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">CRL Rank</p>
                                                                    <h3 className="text-2xl font-black text-blue-400">{jeeRankData?.crl?.toLocaleString('en-IN') || '—'}</h3>
                                                                </div>
                                                                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 text-center">
                                                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Percentile</p>
                                                                    <h3 className="text-2xl font-black text-indigo-400">{jeeRankData?.percentile}%</h3>
                                                                </div>
                                                                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 text-center">
                                                                    <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">Category</p>
                                                                    <h3 className="text-lg font-black text-purple-400">{jeeRankData?.category}</h3>
                                                                </div>
                                                                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 text-center">
                                                                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Tier</p>
                                                                    <h3 className={`text-sm font-black ${jeeRankData?.tier?.color || 'text-theme-text'}`}>{jeeRankData?.tier?.emoji} {jeeRankData?.tier?.label}</h3>
                                                                </div>
                                                            </div>

                                                            {jeeRankData?.marks && (
                                                                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 mb-8 text-center">
                                                                    <p className="text-xs text-theme-muted">Estimated from <span className="font-black text-blue-400">{jeeRankData.marks}/300 marks</span> using NTA 2024 normalization data</p>
                                                                </div>
                                                            )}

                                                            {/* AI College Analysis */}
                                                            {jeeCollegeResult ? (
                                                                <div className={`prose max-w-none prose-sm leading-relaxed text-theme-text`}>
                                                                    <MarkdownBlock text={jeeCollegeResult} />
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col justify-center items-center py-16 gap-3">
                                                                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                                                    <p className="text-xs font-bold text-theme-muted animate-pulse">Analyzing 14+ lakh candidates' data...</p>
                                                                </div>
                                                            )}

                                                            {/* Footer */}
                                                            {jeeCollegeResult && (
                                                                <div className="mt-8 pt-6 border-t border-theme-border text-center">
                                                                    <p className="text-[9px] text-theme-muted uppercase tracking-widest">Generated by Auremous College Compass • Data Source: JoSAA 2024 • For educational purposes</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Download Bar */}
                                                        {jeeCollegeResult && (
                                                            <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex flex-col sm:flex-row gap-3">
                                                                <button onClick={handleJeePdfDownload} className="flex-1 py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40">
                                                                    Download Full Report PDF <Download className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => setActiveTab('college')} className="py-4 px-6 bg-theme-bg border border-theme-border text-theme-text rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:border-theme-primary transition-all">
                                                                    Global Hunt <ChevronRight className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                        )}

                                        {selectedExam === 'neet' && (
                                            <div className="space-y-4">
                                                <form onSubmit={handleNeetSubmit} className="glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                                                            <Activity className="w-6 h-6 text-emerald-500" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-black text-theme-text">NEET UG 2026 Predictor</h3>
                                                            <p className="text-xs text-theme-muted">Marks → Rank classification → Medical Counseling</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <FormField label="Expected Marks (out of 720)">
                                                            <InputField type="number" step="1" min="0" max="720" value={neetForm.marks} onChange={e => setNeetForm({ ...neetForm, marks: e.target.value })} required />
                                                        </FormField>
                                                        <FormField label="Category">
                                                            <SelectField value={neetForm.category} onChange={e => setNeetForm({ ...neetForm, category: e.target.value })} options={[{ value: 'UR', label: 'Unreserved (UR)' }, { value: 'OBC', label: 'OBC' }, { value: 'SC', label: 'SC' }, { value: 'ST', label: 'ST' }]} />
                                                        </FormField>
                                                        <FormField label="Home State">
                                                            <InputField value={neetForm.state} onChange={e => setNeetForm({ ...neetForm, state: e.target.value })} placeholder="State string (e.g. MH, UP, Delhi)" />
                                                        </FormField>
                                                        <FormField label="Counseling Preference">
                                                            <SelectField value={neetForm.preference} onChange={e => setNeetForm({ ...neetForm, preference: e.target.value })} options={[{ value: 'AIQ', label: 'All India Quota (15%)' }, { value: 'State', label: 'State Quota (85%)' }, { value: 'Both', label: 'Both' }]} />
                                                        </FormField>
                                                    </div>
                                                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:opacity-90 flex justify-center items-center h-12">
                                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Predict Medical Career'}
                                                    </button>
                                                </form>

                                                {(neetCollegeResult || neetRankData) && (
                                                    <div className="glass-panel rounded-3xl p-6 border bg-theme-surface border-theme-border animate-fade-in">
                                                        <div ref={neetPdfRef} className="p-4 rounded-xl bg-theme-surface mb-4">
                                                            <div className="text-center mb-6">
                                                                <h2 className="text-2xl font-black text-theme-text uppercase">NEET UG Report</h2>
                                                            </div>
                                                            <div className="grid grid-cols-4 gap-3 mb-6">
                                                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-emerald-500 pb-1">Marks</p><p className="font-black text-lg text-theme-text">{neetRankData?.marks}/720</p></div>
                                                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-blue-500 pb-1">Est Rank</p><p className="font-black text-lg text-theme-text">{neetRankData?.rank}</p></div>
                                                                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-purple-500 pb-1">Category</p><p className="font-black text-lg text-theme-text">{neetRankData?.category}</p></div>
                                                                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-orange-500 pb-1">Tier</p><p className="font-bold text-xs text-theme-text">{neetRankData?.tier}</p></div>
                                                            </div>
                                                            <div className="prose max-w-none text-theme-text text-sm"><MarkdownBlock text={neetCollegeResult || 'Analyzing cutoffs...'} /></div>
                                                        </div>
                                                        {neetCollegeResult && <button onClick={handleNeetPdfDownload} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold uppercase text-xs transition-colors hover:bg-emerald-600">Download Report <Download className="w-3 h-3 inline-block ml-2" /></button>}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {selectedExam === 'cat' && (
                                            <div className="space-y-4">
                                                <form onSubmit={handleCatSubmit} className="glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-pink-500" />
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                                            <Target className="w-6 h-6 text-purple-500" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-black text-theme-text">CAT 2025 Predictor</h3>
                                                            <p className="text-xs text-theme-muted">IIM Shortlists → Composite Score Analytics</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                        <FormField label="Percentile">
                                                            <InputField type="number" step="0.01" max="100" value={catForm.percentile} onChange={e => setCatForm({ ...catForm, percentile: e.target.value })} required />
                                                        </FormField>
                                                        <FormField label="Category">
                                                            <SelectField value={catForm.category} onChange={e => setCatForm({ ...catForm, category: e.target.value })} options={[{ value: 'General', label: 'General' }, { value: 'NC-OBC', label: 'NC-OBC' }, { value: 'EWS', label: 'EWS' }]} />
                                                        </FormField>
                                                        <FormField label="Academic Stream">
                                                            <SelectField value={catForm.stream} onChange={e => setCatForm({ ...catForm, stream: e.target.value })} options={[{ value: 'Engineering', label: 'Engineer' }, { value: 'Non-Engineering', label: 'Non-Engineer' }]} />
                                                        </FormField>
                                                        <FormField label="Work Exp (Months)">
                                                            <InputField type="number" value={catForm.workEx} onChange={e => setCatForm({ ...catForm, workEx: e.target.value })} />
                                                        </FormField>
                                                    </div>
                                                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:opacity-90 flex justify-center items-center h-12">
                                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Predict IIM Shortlists'}
                                                    </button>
                                                </form>

                                                {(catCollegeResult || catResultData) && (
                                                    <div className="glass-panel rounded-3xl p-6 border bg-theme-surface border-theme-border animate-fade-in">
                                                        <div ref={catPdfRef} className="p-4 rounded-xl bg-theme-surface mb-4">
                                                            <div className="text-center mb-6"><h2 className="text-2xl font-black text-theme-text uppercase">CAT Admissions Report</h2></div>
                                                            <div className="grid grid-cols-4 gap-3 mb-6">
                                                                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-purple-500 pb-1">%ile</p><p className="font-black text-lg text-theme-text">{catResultData?.percentile}</p></div>
                                                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-blue-500 pb-1">Segment</p><p className="font-black text-lg text-theme-text">{catResultData?.tier}</p></div>
                                                                <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-pink-500 pb-1">Stream</p><p className="font-bold text-xs text-theme-text">{catResultData?.stream}</p></div>
                                                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-amber-500 pb-1">Category</p><p className="font-bold text-xs text-theme-text">{catResultData?.category}</p></div>
                                                            </div>
                                                            <div className="prose max-w-none text-theme-text text-sm"><MarkdownBlock text={catCollegeResult || 'Calculating composite scores...'} /></div>
                                                        </div>
                                                        {catCollegeResult && <button onClick={handleCatPdfDownload} className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold uppercase text-xs transition-colors hover:bg-purple-600">Download Report <Download className="w-3 h-3 inline-block ml-2" /></button>}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {selectedExam === 'nda' && (
                                            <div className="space-y-4">
                                                <form onSubmit={handleNdaSubmit} className="glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-400 to-red-500" />
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
                                                            <ShieldAlert className="w-6 h-6 text-orange-500" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-black text-theme-text">NDA Exam Predictor</h3>
                                                            <p className="text-xs text-theme-muted">Written Marks → SSB Clearance → Merit List</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <FormField label="Written Marks (Out of 900)">
                                                            <InputField type="number" step="1" max="900" value={ndaForm.marks} onChange={e => setNdaForm({ ...ndaForm, marks: e.target.value })} required />
                                                        </FormField>
                                                        <FormField label="Preferred Wing">
                                                            <SelectField value={ndaForm.wing} onChange={e => setNdaForm({ ...ndaForm, wing: e.target.value })} options={[{ value: 'Army', label: 'Indian Army' }, { value: 'Navy', label: 'Indian Navy' }, { value: 'Air Force', label: 'Indian Air Force' }]} />
                                                        </FormField>
                                                    </div>
                                                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:opacity-90 flex justify-center items-center h-12">
                                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Predict Defense Career'}
                                                    </button>
                                                </form>

                                                {(ndaCollegeResult || ndaResultData) && (
                                                    <div className="glass-panel rounded-3xl p-6 border bg-theme-surface border-theme-border animate-fade-in">
                                                        <div ref={ndaPdfRef} className="p-4 rounded-xl bg-theme-surface mb-4">
                                                            <div className="text-center mb-6"><h2 className="text-2xl font-black text-theme-text uppercase">NDA Analytics Report</h2></div>
                                                            <div className="grid grid-cols-4 gap-3 mb-6">
                                                                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-orange-500 pb-1">Marks</p><p className="font-black text-lg text-theme-text">{ndaResultData?.marks}</p></div>
                                                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-red-500 pb-1">Wing Target</p><p className="font-black text-sm text-theme-text">{ndaResultData?.wing}</p></div>
                                                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-blue-500 pb-1">Expected Cutoff</p><p className="font-black text-lg text-theme-text">{ndaResultData?.expectedCutoff}</p></div>
                                                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"><p className="text-[9px] uppercase font-bold text-emerald-500 pb-1">Chances</p><p className="font-bold text-xs text-theme-text">{ndaResultData?.tier}</p></div>
                                                            </div>
                                                            <div className="prose max-w-none text-theme-text text-sm"><MarkdownBlock text={ndaCollegeResult || 'Extracting SSB guidelines...'} /></div>
                                                        </div>
                                                        {ndaCollegeResult && <button onClick={handleNdaPdfDownload} className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold uppercase text-xs transition-colors hover:bg-orange-600">Download Report <Download className="w-3 h-3 inline-block ml-2" /></button>}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                        )}


                        {/* ═══ ESSAY EXPERT TAB (MERGED: Coach + Grader) ═══ */}
                        {activeTab === 'essay' && (
                            <div className="animate-fade-in space-y-6 relative">
                                {/* ── UNDER DEVELOPMENT BANNER ── */}
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 animate-slide-up">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xl">🚧</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-1">Under Development</h4>
                                        <p className="text-xs text-theme-muted leading-relaxed">
                                            Essay generation quality is currently limited due to the low-quality AI model powering this feature. Essays may lack depth, repeat patterns, or degrade across iterations.
                                            We are actively upgrading to a premium model that will deliver <strong className="text-amber-400">Ivy-level essay writing</strong>. Stay tuned — a major upgrade is coming soon.
                                        </p>
                                    </div>
                                </div>
                                <form onSubmit={handleGenerateEssay} className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border relative overflow-hidden`}>
                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-rose-500" />
                                    <div className="flex items-center gap-3 mb-6">
                                        <Award className={`w-6 h-6 text-amber-500`} />
                                        <div>
                                            <h3 className="text-lg font-bold text-theme-text">College Essay Writer</h3>
                                            <p className={`text-xs text-theme-muted`}>Elite Ivy League Essay Coach & Ghostwriter</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <FormField label="Target School">
                                            <InputField value={essaySchool} onChange={e => setEssaySchool(e.target.value)} placeholder="e.g. Stanford, MIT, Oxford" required />
                                        </FormField>
                                        <FormField label="Essay Type">
                                            <SelectField value={essayType} onChange={e => setEssayType(e.target.value)} options={[
                                                { value: 'Personal Statement', label: 'Personal Statement' },
                                                { value: 'Common App', label: 'Common App Essay' },
                                                { value: 'Why Us', label: 'Why Us / Supplemental' },
                                                { value: 'SOP', label: 'Statement of Purpose' },
                                                { value: 'Scholarship', label: 'Scholarship Essay' },
                                            ]} />
                                        </FormField>
                                        <FormField label="Word Limit">
                                            <InputField value={essayWordLimit} onChange={e => setEssayWordLimit(e.target.value)} placeholder="e.g. 650, 250" required />
                                        </FormField>
                                    </div>

                                    <div className="p-5 mb-6 rounded-2xl bg-gradient-to-r from-amber-500/5 to-rose-500/5 border border-amber-500/20">
                                        <h4 className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" /> Story & Authentic Voice
                                        </h4>
                                        
                                        <FormField label="⭐ Key Story / Anecdote">
                                            <TextareaField value={essayStory} onChange={e => setEssayStory(e.target.value)} rows="3" placeholder="Describe a specific moment, challenge, or realization. Be authentic!" required />
                                        </FormField>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <FormField label="💎 Core Trait to Highlight">
                                                <InputField value={essayTrait} onChange={e => setEssayTrait(e.target.value)} placeholder="e.g. Resilience, Curiosity..." required />
                                            </FormField>
                                            <FormField label="🎨 Tone">
                                                <SelectField value={essayTone} onChange={e => setEssayTone(e.target.value)} options={[
                                                    { value: 'Reflective', label: '🪞 Reflective & Poetic' },
                                                    { value: 'Analytical', label: '🔬 Analytical & Direct' },
                                                    { value: 'Humorous', label: '😄 Humorous & Witty' },
                                                    { value: 'Bold', label: '⚡ Bold & Unconventional' },
                                                    { value: 'Narrative', label: '📖 Storytelling' },
                                                ]} />
                                            </FormField>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <FormField label="📝 Extra Instructions (Optional)">
                                                <TextareaField value={essayPrompt} onChange={e => setEssayPrompt(e.target.value)} rows="2" placeholder="Specific themes, what to avoid..." />
                                            </FormField>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-amber-500/30 hover:scale-[1.02] transition-all flex justify-center items-center disabled:opacity-50">
                                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Ghostwriting Draft...</> : (<>Generate Ivy Draft <Award className="w-4 h-4 ml-2" /></>)}
                                    </button>
                                </form>

                                {essayData && !essayData.error && (
                                    <div className={`glass-panel p-6 rounded-3xl shadow-2xl border bg-theme-surface border-theme-border animate-slide-up mt-6`}>
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-theme-border">
                                            <div className="flex items-center gap-3">
                                                <Award className="w-6 h-6 text-amber-500" />
                                                <h3 className="text-xl font-bold text-theme-text">Your Essay Draft</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest">Voice Score</span>
                                                    <span className={`text-xl font-black ${essayData.voice_score >= 8 ? 'text-green-500' : 'text-amber-500'}`}>{essayData.voice_score}/10</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="p-5 rounded-2xl bg-theme-bg border border-theme-border prose max-w-none prose-sm text-theme-text">
                                                    <MarkdownBlock text={essayData.essay} />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                                                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Theme Alignment</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {essayData.theme_alignment?.map((theme, i) => (
                                                            <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold">{theme}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                                                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> Coach Analysis</h4>
                                                    <p className="text-xs text-theme-text leading-relaxed">{essayData.analysis}</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                                                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Improvement Tips</h4>
                                                    <ul className="space-y-2">
                                                        {essayData.improvement_tips?.map((tip, i) => (
                                                            <li key={i} className="text-xs text-theme-text flex gap-2"><span className="text-amber-500">•</span> {tip}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {essayData?.error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center mt-6">
                                        {essayData.error}
                                    </div>
                                )}
                            </div>
                        )}                      {/* ═══ CHAT TAB ═══ */}
                        
                        {/* ═══ UNIVERSAL PROFILE BUILDER TAB (NEW) ═══ */}
                        {activeTab === 'profile' && (
                            <div className="animate-fade-in space-y-6">
                                <div className="glass-panel p-8 rounded-[40px] shadow-2xl border bg-theme-surface border-theme-primary/30 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-theme-primary/5 blur-[50px] animate-pulse"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="p-4 rounded-3xl bg-theme-primary/20 text-theme-primary border border-theme-primary/50 shadow-[0_0_30px_rgba(201,165,90,0.3)]">
                                                <Sparkles className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-theme-primary text-glow">The Universal Master Profile</h2>
                                                <p className="text-sm font-bold text-theme-muted mt-1 tracking-widest uppercase">Centralize your entire academic DNA in one vault. All other AI tools will map perfectly to this core.</p>
                                            </div>
                                        </div>

                                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Profile Synchronized Across All Modules!'); }}>
                                            <div className="p-6 rounded-3xl bg-theme-bg/50 border border-theme-border">
                                                <h4 className="text-lg font-bold text-theme-text mb-4 border-b border-theme-border pb-2">Academic Core</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField label="Current Grade / Year">
                                                        <InputField value={studentProfile.gpa} onChange={e => setStudentProfile({ ...studentProfile, gpa: e.target.value })} placeholder="e.g. 11th Grade, High School Senior" />
                                                    </FormField>
                                                    <FormField label="Standardized Test Scores">
                                                        <InputField value={studentProfile.testScores} onChange={e => setStudentProfile({ ...studentProfile, testScores: e.target.value })} placeholder="e.g. SAT 1550, AP Calc 5" />
                                                    </FormField>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-3xl bg-theme-bg/50 border border-theme-border">
                                                <h4 className="text-lg font-bold text-theme-text mb-4 border-b border-theme-border pb-2">Passions & DNA</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField label="Deep Hobbies">
                                                        <InputField value={studentProfile.hobbies} onChange={e => setStudentProfile({ ...studentProfile, hobbies: e.target.value })} placeholder="e.g. Chess, Astronomy, Anime" />
                                                    </FormField>
                                                    <FormField label="Target Future Major">
                                                        <InputField value={studentProfile.major} onChange={e => setStudentProfile({ ...studentProfile, major: e.target.value })} placeholder="e.g. Aerospace Engineering" />
                                                    </FormField>
                                                    <div className="col-span-1 md:col-span-2">
                                                        <FormField label="Extracurricular Arsenal">
                                                            <TextareaField value={studentProfile.extracurriculars} onChange={e => setStudentProfile({ ...studentProfile, extracurriculars: e.target.value })} rows="3" placeholder="List your greatest conquests: clubs, medals, internships, research..." />
                                                        </FormField>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-3xl bg-theme-bg/50 border border-theme-border flex items-center justify-between group">
                                                <div>
                                                    <h4 className="text-lg font-bold text-theme-text">Upload Resume / CV (PDF)</h4>
                                                    <p className="text-xs text-theme-muted mt-1">Let the neural network auto-extract your achievements.</p>
                                                    {studentProfile.uploadedFileName && <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase">Linked: {studentProfile.uploadedFileName}</span>}
                                                </div>
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-4 rounded-full bg-theme-primary/10 text-theme-primary border border-theme-primary/30 hover:bg-theme-primary hover:text-theme-bg transition-colors shadow-lg">
                                                    <FileText className="w-6 h-6" />
                                                </button>
                                                <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
                                            </div>

                                            <button type="submit" className="w-full py-5 bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-bg rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(201,165,90,0.4)] hover:scale-[1.02] transition-transform flex justify-center items-center">
                                                Synchronize Profile <Sparkles className="w-5 h-5 ml-2" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'chat' && (
                            <div className={`animate-fade-in flex flex-col glass-panel rounded-3xl shadow-2xl border bg-theme-surface border-theme-border h-[75vh] md:h-[600px] overflow-hidden`}>
                                <div className={`p-3 border-b border-theme-border bg-theme-surface flex items-center gap-3`}>
                                    <div className="p-2 rounded-xl bg-theme-bg border border-theme-border">
                                        <MessageSquare className={`w-4 h-4 text-theme-primary`} />
                                    </div>
                                    <span className="font-bold text-sm text-theme-text">Admissions AI Assistant</span>
                                    <button
                                        onClick={() => setActiveTab('essay')}
                                        className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-theme-primary/10 border border-theme-primary/20 text-theme-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-theme-primary/20 transition-all"
                                    >
                                        Ready for Essays <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                    {chatHistory.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                                ? 'bg-gradient-to-tr from-theme-primary to-theme-secondary text-theme-bg rounded-br-none'
                                                : `bg-theme-bg border-theme-border text-theme-text border rounded-tl-none`
                                                }`}>
                                                {msg.role === 'user' ? msg.text : (
                                                    <MarkdownBlock text={msg.text} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className={`bg-theme-bg border-theme-border p-3 rounded-2xl rounded-tl-none border flex items-center gap-2`}>
                                                <Loader2 className={`w-4 h-4 animate-spin text-theme-primary`} />
                                                <span className={`text-xs text-theme-muted`}>Thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                                <form onSubmit={handleChatSubmit} className={`p-3 bg-theme-surface border-theme-border border-t flex gap-2`}>
                                    <input
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        placeholder="Ask anything about colleges, admissions, visas..."
                                        className={`flex-1 p-3 rounded-xl text-sm bg-theme-bg border-theme-border text-theme-text outline-none focus:border-theme-primary border transition-all`}
                                    />
                                    <button type="submit" disabled={isLoading || !chatInput.trim()} className="p-3 bg-theme-primary text-theme-bg rounded-xl shadow-[0_0_15px_var(--theme-primary)] opacity-90 hover:opacity-100 transition-all disabled:opacity-50">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollegeCompass;
