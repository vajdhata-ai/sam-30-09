import React, { useState, useRef } from 'react';
import { Upload, Loader2, AlertCircle, Image as ImageIcon, ChevronRight } from './Icons';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { callAI } from '../utils/apiRouter';
import RagService from '../utils/ragService';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const NotesUploader = ({ onQuizGenerated, onCancel, config = {} }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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
        }
    };

    const convertToBase64 = (fileObj) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileObj);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const convertPdfToImages = async (arrayBuffer) => {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = Math.min(pdf.numPages, 10); // Limit to 10 pages for notes
        const images = [];

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            images.push(canvas.toDataURL('image/jpeg', 0.6));
        }

        return images;
    };

    const generateFromNotes = async () => {
        if (!file) return;
        setIsLoading(true);
        setError(null);

        try {
            let images = [];
            
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                images = await convertPdfToImages(arrayBuffer);
            } else {
                const base64Img = await convertToBase64(file);
                images = [base64Img];
            }
            
            const questionCount = config.count || 10;
            const questionType = config.type || "Mixed";
            const difficultyLevel = config.difficulty || "Medium";

            const systemMessage = "You are an expert study assistant. A student has uploaded their study material. Carefully read all text, diagrams, formulas, and figures.";
            const prompt = `Generate exactly ${questionCount} questions based on the content visible in the provided documents.
The questions must be of type: ${questionType} (e.g. if Objective, only MCQs; if Subjective, only short answers; if Mixed, a mix of both).
The difficulty level should be: ${difficultyLevel}.

Return ONLY valid JSON:
{
  "topic_detected": "what topic this material covers",
  "questions": [
    {
      "id": 1,
      "question": "question text",
      "options": ["A", "B", "C", "D"], // ONLY if objective/MCQ. Leave empty if subjective.
      "correct_answer": "A", // Or the full answer string if subjective
      "explanation": "detailed explanation of the answer",
      "source": "which part of the document this came from",
      "type": "objective", // "objective" or "subjective"
      "marks": 1 // 1 for MCQ, 2-5 for subjective
    }
  ]
}

Rules:
- Generate EXACTLY ${questionCount} questions.
- Match the requested question type (${questionType}) and difficulty (${difficultyLevel}).
- Only generate questions from content clearly visible in the images.
- Questions must test understanding, not just rote memorization.
- Keep all text extremely concise to avoid JSON truncation.
- If unclear, return empty questions array`;

            const messages = [
                { role: 'system', content: systemMessage },
                {
                    role: 'user',
                    content: [
                        { type: "text", text: prompt },
                        ...images.map(img => ({ type: 'image_url', image_url: { url: img } }))
                    ]
                }
            ];

            const result = await callAI(messages, null, true, { max_tokens: 8192 });
            const text = result.choices?.[0]?.message?.content || "";
            let parsedData = RagService.extractJson(text);
            
            if (!parsedData || !parsedData.questions || parsedData.questions.length === 0) {
                 throw new Error("Document quality too low or no content found. Please upload a clearer file.");
            }

            parsedData.questions.forEach((q, idx) => {
                q.id = idx + 1;
                q.section = `Based on: ${parsedData.topic_detected}`;
                if(!q.type) q.type = "objective";
                if(!q.marks) q.marks = 1;
            });

            onQuizGenerated(parsedData);

        } catch (err) {
            console.error("Vision API Error:", err);
            setError(err.message || "Failed to analyze document. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center animate-slide-up pb-20 pt-10">
             <div className="w-full max-w-2xl px-6">
                <button
                    onClick={onCancel}
                    className="mb-6 flex items-center gap-2 text-sm font-bold text-theme-muted hover:text-theme-primary transition-colors"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Assessment Hub
                </button>

                <div className="text-center mb-8">
                     <h1 className="text-3xl font-black text-emerald-500 flex items-center justify-center gap-3">
                         <ImageIcon className="w-8 h-8" /> Scan Notes to Quiz
                     </h1>
                     <p className="text-theme-muted mt-2">Upload a photo or PDF of your textbook/notes to instantly generate an MCQ test.</p>
                </div>

                <div className="p-8 rounded-[40px] border border-emerald-500/20 shadow-2xl bg-theme-surface/60 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                    
                    <div 
                        onClick={() => !isLoading && fileInputRef.current?.click()}
                        className={`relative z-10 border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer \${file ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-theme-border/50 hover:border-emerald-500/40 hover:bg-emerald-500/5'}`}
                    >
                        {file ? (
                            <div className="text-center space-y-4">
                                <div className="p-4 bg-emerald-500/20 rounded-full inline-block shadow-lg shadow-emerald-500/20">
                                    <ImageIcon className="w-8 h-8 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-theme-primary text-lg">{file.name}</p>
                                    <p className="text-sm text-theme-muted font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-theme-bg/50 flex items-center justify-center mx-auto mb-6 shadow-inner border border-theme-border/30">
                                    <Upload className="w-10 h-10 text-theme-muted" />
                                </div>
                                <p className="font-bold text-theme-text text-xl">Click to upload your document</p>
                                <p className="text-sm text-theme-muted font-medium tracking-widest uppercase">PDF, JPG, PNG or WEBP (Max 15MB)</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden" />
                    </div>

                    {error && (
                        <div className="relative z-10 mt-6 text-rose-500 text-center p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center gap-3 font-medium">
                            <AlertCircle className="w-5 h-5 shrink-0" />{error}
                        </div>
                    )}

                    <div className="relative z-10 flex gap-4 mt-8">
                        {file && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                disabled={isLoading}
                                className="px-6 py-4 rounded-2xl border border-theme-border text-theme-muted font-bold hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                            >
                                Clear
                            </button>
                        )}
                        <button 
                            onClick={generateFromNotes} 
                            disabled={isLoading || !file}
                            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 text-sm"
                        >
                            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : 'Generate Assessment'}
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default NotesUploader;
