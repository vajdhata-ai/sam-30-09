const fs = require('fs');

const file = 'src/components/CollegeCompass.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add `onExit` to props
content = content.replace(
    /const CollegeCompass = \({ retryableFetch }\) => {/g,
    `const CollegeCompass = ({ retryableFetch, onExit }) => {
    const [isEntering, setIsEntering] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsEntering(false), 2600);
        return () => clearTimeout(timer);
    }, []);`
);

// 2. Add isEntering fullscreen block right before the main return
const returnIndex = content.lastIndexOf('return (');
if (returnIndex !== -1) {
    const enteringBlock = `
    if (isEntering) {
        return (
            <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-theme-bg text-theme-text overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-theme-primary/10 blur-[150px] mix-blend-screen rounded-full animate-pulse"></div>
                <div className="relative mb-12 transform hover:scale-110 transition-transform duration-1000">
                    <Globe className="w-56 h-56 text-theme-primary animate-[spin_10s_linear_infinite] drop-shadow-[0_0_60px_rgba(201,165,90,0.6)]" />
                    <Sparkles className="absolute -top-4 -right-4 w-16 h-16 text-theme-secondary animate-ping delay-150" />
                    <Sparkles className="absolute -bottom-4 -left-4 w-12 h-12 text-theme-primary animate-pulse delay-500" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-[0.2em] bg-gradient-to-r from-theme-secondary via-theme-primary to-theme-secondary bg-clip-text text-transparent transform scale-105 duration-1000 ease-out" style={{ animation: 'pulse 3s infinite' }}>Auremous Compass</h1>
                <p className="mt-6 text-theme-muted tracking-[0.4em] uppercase text-xs md:text-sm animate-pulse font-bold">Synchronizing Global Intelligence...</p>
            </div>
        );
    }

    `;
    
    // Find the last return of the component (not within a function).
    // The easiest way is to search forward from the TOOLS definition
    const toolsRegex = /const TOOLS = \[([\s\S]*?)\];/;
    const match = content.match(toolsRegex);
    if (match) {
        const afterTools = match.index + match[0].length;
        const returnPos = content.indexOf('return (', afterTools);
        if (returnPos !== -1) {
            content = content.substring(0, returnPos) + enteringBlock + content.substring(returnPos);
        }
    }
}

// 3. Make main container extremely full screen 
content = content.replace(
    /className=\{\`flex flex-col bg-theme-bg text-theme-text transition-all duration-500 ease-out \$\{viewMode === 'active_tool' \? 'fixed inset-0 z-\[100\] rounded-none m-0' : 'h-full relative overflow-hidden'\}\`\}/g,
    `className="flex flex-col bg-theme-bg text-theme-text h-[100dvh] w-full fixed inset-0 z-[100] relative overflow-y-auto overflow-x-hidden custom-scrollbar"`
);

// 4. Add Universal Profile Builder to TOOLS
content = content.replace(
    /id: 'career',\s*title: 'Profile Builder'/g,
    `id: 'profile', title: 'Universal Profile Builder'`
);

// 5. Add Back to Hub Button
const topBarHTML = `
            {/* Header & Back Button */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <button
                    onClick={onExit}
                    className="px-5 py-2.5 rounded-2xl bg-theme-surface/80 backdrop-blur-xl border border-theme-primary/30 text-xs font-black uppercase tracking-widest text-theme-primary hover:bg-theme-primary hover:text-theme-bg transition-all flex items-center justify-center shadow-[0_0_20px_rgba(201,165,90,0.2)] hover:scale-105"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Nexus
                </button>
            </div>
`;
content = content.replace(
    /\{viewMode === 'menu' \? \(/,
    `{viewMode === 'menu' ? (
${topBarHTML}
    `
);
content = content.replace(
    /<div className="w-full flex justify-between items-center bg-theme-surface\/80 p-4/,
    `${topBarHTML}\n                            <div className="w-full flex justify-between items-center bg-theme-surface/80 p-4`
);

// 6. Refine Career AI prompt to enforce Profile Builder Usage
const newPromptInjection = `
CRITICAL RULE: If the student profile is mostly EMPTY (e.g., they only filled in 1 or 2 fields in this form and completely ignored the Global Profile), you MUST add this exact section right at the top of your response:
"## ⚠️ SYSTEM WARNING
You are receiving generic, baseline advice. To unlock world-class, ultra-personalized mapping that completely aligns with your DNA, return to the **Universal Profile Builder** tab immediately and complete your profile."
If their profile IS full, provide deep FOMO-inducing, highly personalized logic.`;

content = content.replace(
    /- Provide up to 20-30 colleges total./g,
    `- Provide up to 20-30 colleges total.\n${newPromptInjection}`
);

content = content.replace(
    /- Output 5 to 8 unique career ideas./g,
    `- Output 5 to 8 unique career ideas.\n${newPromptInjection}`
);

// 7. Inject Profile Builder Form 
const profileBuilderForm = `
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
`;

content = content.replace(
    /\{activeTab === 'chat' && \(/,
    `${profileBuilderForm}\n                        {activeTab === 'chat' && (`
);

fs.writeFileSync(file, content);
console.log('Compass Refactor Complete.');
