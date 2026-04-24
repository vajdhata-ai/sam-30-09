import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2, Download, Trophy, RotateCcw, Brain, SplitSquareHorizontal, Sparkles, FilePlus, CheckCircle2 as CheckCircleIcon, AlertCircle as AlertIcon } from './Icons';
import * as pdfjsLib from 'pdfjs-dist';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useTheme } from '../contexts/ThemeContext';
import { callAI } from '../utils/apiRouter';
import RagService from '../utils/ragService';
import html2pdf from 'html2pdf.js';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Use the worker from the local package to ensure version parity
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// LaTeX → Unicode sanitizer for math rendering
const sanitizeLatex = (text) => {
    if (!text || typeof text !== 'string') return text;
    let s = text;
    s = s.replace(/\\\(\s?/g, '').replace(/\s?\\\)/g, '');
    s = s.replace(/\\\[\s?/g, '').replace(/\s?\\\]/g, '');
    s = s.replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ');
    s = s.replace(/\\epsilon/g, 'ε').replace(/\\theta/g, 'θ').replace(/\\lambda/g, 'λ').replace(/\\mu/g, 'μ');
    s = s.replace(/\\phi/g, 'φ').replace(/\\omega/g, 'ω');
    // Math operators
    s = s.replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\pm/g, '±').replace(/\\mp/g, '∓');
    s = s.replace(/\\cdot/g, '·').replace(/\\leq/g, '≤').replace(/\\geq/g, '≥').replace(/\\neq/g, '≠');
    s = s.replace(/\\approx/g, '≈').replace(/\\equiv/g, '≡').replace(/\\propto/g, '∝');
    s = s.replace(/\\infty/g, '∞').replace(/\\partial/g, '∂').replace(/\\nabla/g, '∇');
    
    // Fix AI escaped asterisks and space-separated asterisks in math expressions
    s = s.replace(/\\\*/g, '×').replace(/ \* /g, ' × ').replace(/\\sqrt/g, '√');
    s = s.replace(/\\sum/g, '∑').replace(/\\int/g, '∫').replace(/\\rightarrow/g, '→').replace(/\\Rightarrow/g, '⇒');
    return s;
};

const SamplePaperGenerator = () => {
    const { isDark } = useTheme();
    const { canUseFeature, incrementUsage, triggerUpgradeModal } = useSubscription();
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    const [error, setError] = useState(null);
    const [paperData, setPaperData] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [mode, setMode] = useState('upload'); // 'upload', 'attempt', 'result'
    const [answers, setAnswers] = useState({}); // { qId: "user answer" }
    const [evaluation, setEvaluation] = useState(null); // AI grading result
    const printRef = useRef();

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf') {
                setError("Please upload a valid PDF, JPG, PNG, or WEBP file.");
                return;
            }
            if (selectedFile.size > 15 * 1024 * 1024) {
                setError("Max file size is 15MB.");
                return;
            }
            setFile(selectedFile);
            setError(null);
            setPaperData(null);
            setAnalysisData(null);
            setMode('upload');
        }
    };

    const convertPdfToImages = async (pdfData) => {
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const numPages = Math.min(pdf.numPages, 3); // Limit to first 3 pages
        const images = [];
        
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            images.push(canvas.toDataURL('image/jpeg', 0.6));
        }

        return images;
    };

    const convertToBase64 = (fileObj) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileObj);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleUploadAndGenerate = async () => {
        if (!file) return;

        if (!canUseFeature('paperGen')) {
            triggerUpgradeModal('paperGen');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let images = [];

            // 1. Process File
            setLoadingStep('Reading file contents...');

            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                images = await convertPdfToImages(arrayBuffer);
            } else if (file.type.startsWith('image/')) {
                const base64Img = await convertToBase64(file);
                images = [base64Img];
            } else {
                throw new Error("Unsupported file type. Please upload PDF or Image.");
            }

            // 2. Call AI
            setLoadingStep('AI analyzing structure and designing new paper...');

            const prompt = `You are an expert exam paper designer for Indian competitive exams.
A student has uploaded their question paper.

Step 1 — Analyze the paper:
- Detect subject and exam board/type
- Count EXACT number of questions per section
- Identify difficulty distribution (easy/medium/hard %)
- Identify topics covered
- Note marks per question
- Identify question types (MCQ/short answer/diagram based)

Step 2 — Generate a fresh paper with:
- EXACTLY the SAME TOTAL NUMBER of questions as the uploaded paper. This is CRITICAL.
- EXACTLY the same number of sections, with the SAME number of questions in each section.
- Same difficulty distribution
- Same topics but DIFFERENT questions
- Same marks pattern (total marks must match exactly)
- At least 30% questions should be different question types than original

Return ONLY valid JSON.
CRITICAL JSON SIZE LIMITATIONS:
- Keep all text extremely concise.
- DO NOT provide "options" for subjective questions (leave empty []).
- Only provide "svg" if a diagram is absolutely required. Otherwise, use null.
- Omit any whitespace formatting in the JSON if possible.

{
  "analysis": {
    "subject": "",
    "exam_type": "",
    "total_questions": 0,
    "total_marks": 0,
    "sections": [],
    "difficulty_split": { "easy": 0, "medium": 0, "hard": 0 },
    "topics_covered": []
  },
  "generated_paper": {
    "title": "",
    "instructions": "",
    "sections": [
      {
        "name": "",
        "marks_per_question": 0,
        "questions": [
          {
            "id": 1,
            "text": "",
            "type": "mcq",
            "options": [],
            "correct_answer": "",
            "marks": 0,
            "difficulty": "easy/medium/hard",
            "svg": null
          }
        ]
      }
    ]
  }
}`;

            const messages = [
                { role: 'system', content: 'You are an expert vision AI capable of deep document analysis.' },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        ...images.map(img => ({ type: 'image_url', image_url: { url: img } }))
                    ]
                }
            ];

            const result = await callAI(messages, null, true, { temperature: 0.2, max_tokens: 8192 });
            const text = result.choices?.[0]?.message?.content || "";
            const data = RagService.extractJson(text);

            if (!data || !data.generated_paper || !data.analysis) {
                throw new Error('Invalid or unreadable paper format received from AI.');
            }

            setAnalysisData(data.analysis);
            setPaperData(data.generated_paper);
            setMode('attempt');
            incrementUsage('paperGen');

            const initialAnswers = {};
            data.generated_paper.sections.forEach(section => {
                section.questions.forEach(q => {
                    initialAnswers[q.id] = "";
                });
            });
            setAnswers(initialAnswers);

        } catch (err) {
            console.error("Generator Error:", err);
            setError(err.message || "Something went wrong during generation.");
        } finally {
            setIsLoading(false);
            setLoadingStep('');
        }
    };

    const handleAnswerChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleSubmitPaper = async () => {
        if (!paperData) return;
        setIsLoading(true);
        setLoadingStep('Auremous AI is grading your paper...');
        
        try {
            const messages = [
                { role: 'system', content: 'You are an AI teacher. Grade the following student answers based on the original question paper and correct answers provided. Be fair but strict. Provide constructive feedback for each answer.' },
                {
                    role: 'user',
                    content: `Original Paper Data: ${JSON.stringify(paperData)}
Student Answers: ${JSON.stringify(answers)}

Return ONLY a JSON object:
{
  "totalMarks": number,
  "studentScore": number,
  "results": [
    { "id": number, "marksObtained": number, "feedback": "string" }
  ]
}`
                }
            ];

            const result = await callAI(messages, null, false, { temperature: 0.1 });
            const text = result.choices?.[0]?.message?.content || "";
            const evalData = RagService.extractJson(text);

            if (!evalData || !evalData.results) {
                throw new Error("Failed to parse evaluation results.");
            }

            setEvaluation(evalData);
            setMode('result');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Evaluation Error:", err);
            setError(err.message || "Failed to grade paper.");
        } finally {
            setIsLoading(false);
            setLoadingStep('');
        }
    };

    const downloadPDF = () => {
        if (!paperData) return;
        const element = printRef.current;
        const opt = {
            margin: 0.5,
            filename: `Aurem_Paper_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const renderQuestion = (q, index) => {
        return (
            <div key={q.id} className={`p-8 rounded-[32px] border transition-all duration-500 mb-8 relative group overflow-hidden
                \${isDark 
                    ? 'bg-theme-surface/40 border-theme-border/20 hover:border-theme-primary/40 shadow-[0_10px_40px_rgba(0,0,0,0.2)]' 
                    : 'bg-white border-warm-200 shadow-sm hover:shadow-md'}
            `}>
                <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-500
                    \${isDark ? 'bg-theme-primary/30 group-hover:bg-theme-primary' : 'bg-slate-200 group-hover:bg-indigo-500'}
                `} />

                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-colors
                            \${isDark ? 'bg-theme-bg text-theme-muted' : 'bg-slate-100 text-slate-500'}
                        `}>
                            {index + 1}
                        </span>
                        <div className="flex gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border
                                \${isDark 
                                    ? 'bg-theme-surface/50 text-theme-muted border-theme-border/20' 
                                    : 'bg-slate-50 text-slate-500 border-slate-200'}
                            `}>
                                {q.difficulty}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                                {q.marks} Marks
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`text-xl md:text-2xl font-serif leading-relaxed mb-8
                    \${isDark ? 'text-theme-text' : 'text-slate-800'}
                `}>
                    {sanitizeLatex(q.text)}
                </div>

                {q.type === 'mcq' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((option, oIdx) => (
                            <label key={oIdx} className={`flex items-center p-5 rounded-2xl border transition-all cursor-pointer group/opt
                                \${answers[q.id] === option 
                                    ? (isDark ? 'bg-theme-primary/15 border-theme-primary ring-1 ring-theme-primary' : 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500') 
                                    : (isDark ? 'bg-theme-bg/40 border-theme-border/20 hover:border-theme-primary/40' : 'bg-slate-50 border-slate-200 hover:border-indigo-300')}
                            `}>
                                <input
                                    type="radio"
                                    name={`q-\${q.id}`}
                                    value={option}
                                    checked={answers[q.id] === option}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-all
                                    \${answers[q.id] === option 
                                        ? (isDark ? 'border-theme-primary bg-theme-primary' : 'border-indigo-500 bg-indigo-500') 
                                        : (isDark ? 'border-theme-muted/30' : 'border-slate-300')} `}>
                                    {answers[q.id] === option && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                </div>
                                <span className={`font-medium transition-colors \${answers[q.id] === option ? 'text-theme-primary' : (isDark ? 'text-theme-secondary' : 'text-slate-700')}`}>
                                    {sanitizeLatex(option)}
                                </span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <textarea
                        className={`w-full p-5 rounded-2xl border focus:ring-4 transition-all min-h-[140px] text-lg font-medium leading-relaxed bg-theme-bg/80 border-theme-border/50 text-theme-text focus:ring-theme-primary/20 focus:border-theme-primary/50 placeholder-theme-muted/50`}
                        placeholder="Write your detailed answer here..."
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                )}
            </div>
        );
    };

    const renderResultParams = (qId) => {
        if (!evaluation) return null;
        const result = evaluation.results.find(r => r.id === qId);
        if (!result) return null;

        const isPositive = result.marksObtained > 0;

        return (
            <div className={`mt-6 mb-10 p-6 rounded-3xl border-l-[6px] transition-all duration-500 shadow-xl
                \${isPositive 
                    ? (isDark ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-emerald-50 border-emerald-500 text-emerald-800') 
                    : (isDark ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 'bg-rose-50 border-rose-500 text-rose-800')}
            `}>
                <div className="flex justify-between items-center font-black mb-4">
                    <span className="flex items-center gap-2 uppercase tracking-widest text-xs">
                        {isPositive ? <CheckCircleIcon className="w-4 h-4" /> : <AlertIcon className="w-4 h-4" />}
                        {isPositive ? 'Evaluation Successful' : 'Needs Improvement'}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-xs shadow-lg border backdrop-blur-md
                        \${isDark 
                            ? 'bg-theme-bg/80 text-theme-primary border-theme-primary/30' 
                            : 'bg-white text-indigo-600 border-indigo-100'}
                    `}>
                        {result.marksObtained} Marks Awarded
                    </span>
                </div>
                <div className={`p-4 rounded-2xl leading-relaxed italic font-medium
                    \${isDark ? 'bg-black/20 text-theme-text/90' : 'bg-white/50 text-slate-700'}
                `}>
                    {sanitizeLatex(result.feedback)}
                </div>
            </div>
        );
    };

    return (
        <div className={`w-full h-full overflow-y-auto custom-scrollbar bg-theme-bg text-theme-primary relative transition-colors duration-300 pb-20`}>
            {/* Header */}
            <div className={`px-6 py-5 flex items-center justify-between z-30 glass-3d border-b rounded-3xl mb-8 shrink-0
                \${isDark ? 'bg-midnight-900/40 border-white/[0.08]' : 'bg-white/40 border-warm-200/50'}
            `}>
                <div className="flex items-center gap-4 group">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500`}>
                        <SplitSquareHorizontal className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent uppercase tracking-tight">
                                Custom Paper Generator
                            </h1>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">Vision AI Powered</span>
                        </div>
                        <p className="text-[10px] font-bold text-theme-muted uppercase tracking-[0.2em] mt-1">Crafted by Auremous Intelligence</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 hidden md:flex">
                     <button onClick={() => window.location.reload()} className={`p-2.5 rounded-xl border transition-all \${isDark ? 'bg-theme-surface border-theme-border text-theme-muted hover:text-theme-primary' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600'}`}>
                         <RotateCcw className="w-5 h-5" />
                     </button>
                </div>
            </div>

            <div className="w-full relative">
                {error && (
                    <div className="max-w-2xl mx-auto mb-10 p-6 rounded-[32px] bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <div className="flex-1">
                            <p className="font-black text-sm uppercase tracking-widest mb-1">Processing Failed</p>
                            <p className="text-sm font-medium opacity-90">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="px-4 py-2 bg-white text-rose-500 rounded-xl font-bold text-xs">Try Again</button>
                    </div>
                )}

                {mode === 'upload' ? (
                    <div className="max-w-3xl mx-auto py-10">
                        <div 
                            onClick={() => !isLoading && fileInputRef.current?.click()}
                            className={`relative p-12 rounded-[48px] border-2 border-dashed transition-all duration-500 group overflow-hidden cursor-pointer
                                \${isDark 
                                    ? 'bg-theme-surface/30 border-theme-primary/20 hover:border-theme-primary/50 hover:bg-theme-surface/50' 
                                    : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}
                                \${file ? 'border-solid border-theme-primary/40 bg-theme-primary/5' : ''}
                            `}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept="application/pdf,image/*"
                            />
                            
                            <div className="relative z-20 flex flex-col items-center justify-center text-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 shadow-inner border border-theme-border/30
                                    \${file ? 'bg-theme-primary scale-110 shadow-xl shadow-theme-primary/30 border-theme-primary/50' : 'bg-theme-bg/50 group-hover:bg-theme-primary/10'}
                                `}>
                                    {file ? <CheckCircle2 className="w-10 h-10 text-theme-bg" /> : <Upload className="w-10 h-10 text-theme-muted group-hover:text-theme-primary transition-colors" />}
                                </div>
                                <h3 className="text-xl font-black text-theme-text uppercase tracking-tight mb-2">
                                    {file ? file.name : "Drop your paper here"}
                                </h3>
                                <p className="text-sm text-theme-muted font-medium tracking-widest uppercase">PDF / IMAGE • UP TO 5 PAGES ANALYZED</p>
                                
                                {file && (
                                    <div className="flex gap-4 mt-8 w-full max-w-md mx-auto">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            disabled={isLoading}
                                            className="px-6 py-4 rounded-2xl border border-theme-border text-theme-muted text-sm font-bold hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all z-30 relative"
                                        >
                                            CLEAR
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleUploadAndGenerate(); }}
                                            disabled={isLoading}
                                            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-theme-primary to-theme-secondary text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-theme-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 z-30 relative flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> ANALYZING...</> : "ANALYZE & GENERATE"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Background decoration */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-theme-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-theme-primary/10 transition-colors duration-1000" />
                        </div>

                        {isLoading && (
                            <div className="mt-12 text-center animate-pulse">
                                <div className="flex items-center justify-center gap-3 text-theme-primary font-black uppercase tracking-[0.3em] text-xs">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {loadingStep}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* LEFT PANEL: Summary & Stats */}
                        <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8 h-fit">
                            <div className={`p-8 rounded-[40px] border glass-3d relative overflow-hidden transition-all duration-500
                                \${isDark ? 'bg-theme-surface/60 border-theme-border/30' : 'bg-slate-50 border-slate-200'}
                            `}>
                                <h2 className="text-[20px] font-serif font-bold italic text-theme-text mb-8 flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 text-theme-primary animate-pulse" />
                                    Analysis Report
                                </h2>
                                
                                <div className="space-y-5">
                                    <div className="flex flex-col gap-1 p-4 rounded-2xl bg-theme-surface/40 border border-theme-border/20 group/item hover:bg-theme-surface/60 transition-colors">
                                        <span className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em]">Subject</span>
                                        <span className="text-xl font-serif font-bold italic text-theme-primary">{analysisData.subject || 'Unknown'}</span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1 p-4 rounded-2xl bg-theme-surface/40 border border-theme-border/20 group/item hover:bg-theme-surface/60 transition-colors">
                                        <span className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em]">Exam Type</span>
                                        <span className="text-xl font-serif font-bold italic text-theme-text">{analysisData.exam_type || 'General Evaluation'}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1 p-4 rounded-2xl bg-theme-surface/40 border border-theme-border/20">
                                            <span className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em]">Questions</span>
                                            <span className="text-2xl font-black text-theme-primary">{analysisData.total_questions || paperData.sections.reduce((acc, s) => acc + s.questions.length, 0)}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 p-4 rounded-2xl bg-theme-surface/40 border border-theme-border/20">
                                            <span className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em]">Marks</span>
                                            <span className="text-2xl font-black text-theme-secondary">{analysisData.total_marks || '80'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-8 border-t border-theme-border/10">
                                        <span className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] mb-4 block">Topics Covered</span>
                                        <div className="flex flex-wrap gap-2">
                                            {(analysisData.topics_covered || []).map((topic, i) => (
                                                <span key={i} className="px-4 py-2 bg-theme-primary/10 text-theme-primary text-xs font-bold rounded-full border border-theme-primary/20 hover:bg-theme-primary/20 transition-all cursor-default">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-theme-border/50">
                                        <span className="text-theme-muted font-medium text-xs uppercase tracking-widest mb-3 block">Difficulty Split</span>
                                        <div className="flex h-3 rounded-full w-full bg-slate-200 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-700 overflow-hidden">
                                            <div style={{width: `\${parseFloat(analysisData.difficulty_split?.easy) || 33}%`}} className="bg-emerald-500 h-full" title="Easy"></div>
                                            <div style={{width: `\${parseFloat(analysisData.difficulty_split?.medium) || 33}%`}} className="bg-amber-500 h-full" title="Medium"></div>
                                            <div style={{width: `\${parseFloat(analysisData.difficulty_split?.hard) || 34}%`}} className="bg-rose-500 h-full" title="Hard"></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-theme-muted mt-2 uppercase tracking-wider">
                                            <span>Easy: {parseFloat(analysisData.difficulty_split?.easy) || 0}%</span>
                                            <span>Med: {parseFloat(analysisData.difficulty_split?.medium) || 0}%</span>
                                            <span>Hard: {parseFloat(analysisData.difficulty_split?.hard) || 0}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {mode === 'result' && evaluation && (
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl animate-in zoom-in">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <Trophy className="w-16 h-16 text-yellow-300 mb-4 drop-shadow-md" />
                                        <p className="text-indigo-100 font-medium text-sm uppercase tracking-widest mb-2">Final Score</p>
                                        <h3 className="text-5xl font-black">{evaluation.studentScore} <span className="text-2xl opacity-60">/ {evaluation.totalMarks}</span></h3>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <button onClick={downloadPDF} className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-indigo-500 text-indigo-500 font-bold rounded-xl hover:bg-indigo-500/10 transition-all">
                                    <Download className="w-5 h-5" /> Download Paper PDF
                                </button>
                                {mode === 'result' && (
                                    <button onClick={() => { setMode('upload'); setFile(null); setPaperData(null); }} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-theme-surface border border-theme-border text-theme-secondary font-bold rounded-xl hover:bg-theme-bg/80 transition-all">
                                        <RotateCcw className="w-5 h-5" /> Generate Another
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* RIGHT PANEL: Generated Paper */}
                        <div className="lg:col-span-2 relative">
                             {/* Paper Container for PDF Export */}
                             <div ref={printRef} className={`p-8 md:p-12 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border transition-all duration-700 print-container relative overflow-hidden
                                \${isDark 
                                    ? 'bg-gradient-to-br from-theme-surface/90 to-theme-bg/90 border-theme-border/20' 
                                    : 'bg-white border-warm-200 shadow-2xl'}
                             `}>
                                {/* Decorative elements */}
                                {isDark && (
                                    <>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-theme-primary/5 rounded-full blur-[100px] pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-theme-secondary/5 rounded-full blur-[100px] pointer-events-none" />
                                    </>
                                )}

                                {/* Main Title Block (Aurem Lens Style) */}
                                <div className={`relative mb-16 p-10 md:p-14 rounded-[40px] border text-center overflow-hidden
                                    \${isDark ? 'bg-theme-bg/40 border-theme-border/30' : 'bg-slate-50 border-slate-200'}
                                `}>
                                    {isDark && <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-theme-primary shadow-[0_0_30px_var(--theme-primary)] rounded-l-full" />}
                                    <div className="relative z-10">
                                        <h2 className={`text-3xl md:text-5xl font-serif font-black italic tracking-tight mb-4
                                            \${isDark ? 'text-theme-text drop-shadow-lg' : 'text-slate-900'}
                                        `}>
                                            {isDark && <span className="text-theme-primary mr-4 not-italic drop-shadow-[0_0_15px_var(--theme-primary)]">✦</span>}
                                            {paperData.title || "Synthetic Evaluation"}
                                        </h2>
                                        <p className={`font-medium max-w-2xl mx-auto italic leading-relaxed
                                            \${isDark ? 'text-theme-muted' : 'text-slate-500'}
                                        `}>
                                            {paperData.instructions}
                                        </p>
                                        <div className="flex justify-center flex-wrap gap-4 mt-8">
                                            <div className={`px-5 py-2 rounded-full border font-black text-xs uppercase tracking-widest
                                                \${isDark ? 'bg-theme-primary/10 border-theme-primary/20 text-theme-primary' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}
                                            `}>
                                                Max Marks: {analysisData.total_marks || '80'}
                                            </div>
                                            <div className={`px-5 py-2 rounded-full border font-black text-xs uppercase tracking-widest
                                                \${isDark ? 'bg-theme-secondary/10 border-theme-secondary/20 text-theme-secondary' : 'bg-purple-50 border-purple-100 text-purple-600'}
                                            `}>
                                                Subject: {analysisData.subject || 'Mixed'}
                                            </div>
                                            <div className={`px-5 py-2 rounded-full border font-black text-xs uppercase tracking-widest
                                                \${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}
                                            `}>
                                                Standard: {analysisData.exam_type || 'Class X'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {paperData.sections.map((section, sIdx) => (
                                    <div key={sIdx} className="mb-16 last:mb-0">
                                        {section.name && (
                                            <div className="flex items-center gap-6 mb-10">
                                                <div className={`h-px flex-1 \${isDark ? 'bg-gradient-to-r from-transparent to-theme-primary/30' : 'bg-slate-200'}`}></div>
                                                <h3 className={`text-xl font-serif font-bold italic tracking-[0.2em] uppercase
                                                    \${isDark ? 'text-theme-primary drop-shadow-[0_0_10px_rgba(201,165,90,0.3)]' : 'text-indigo-600'}
                                                `}>
                                                    {section.name}
                                                </h3>
                                                <div className={`h-px flex-1 \${isDark ? 'bg-gradient-to-l from-transparent to-theme-primary/30' : 'bg-slate-200'}`}></div>
                                            </div>
                                        )}
                                        {section.questions.map((q, qIdx) => (
                                            <div key={q.id}>
                                                {renderQuestion(q, qIdx)}
                                                {mode === 'result' && renderResultParams(q.id)}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                             </div>

                             {mode === 'attempt' && (
                                <div className="sticky bottom-6 flex justify-center pt-8 mt-4 pointer-events-none">
                                    <button
                                        onClick={handleSubmitPaper}
                                        className="pointer-events-auto flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-black shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] transition-all text-lg border-2 border-white/20"
                                    >
                                        <CheckCircle2 className="w-6 h-6" /> Submit for Grading
                                    </button>
                                </div>
                             )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SamplePaperGenerator;
