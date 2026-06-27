import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { usePerformance } from '../contexts/PerformanceContext';
import { Bot, Eye, ClipboardList, Trophy, ShieldAlert, Swords, CheckCircle, Clock, AlertCircle, Megaphone, Calendar, ChevronRight, FilePlus } from './Icons';

const CadetDashboard = ({ onNavigate }) => {
    const { currentUser, userProfile } = useAuth();
    const { getLevelInfo, getRecords } = usePerformance();
    const levelInfo = getLevelInfo();
    
    // Performance Assessment Data
    const quizRecords = getRecords('quiz-assessment') || [];
    const avgScore = quizRecords.length > 0 
        ? Math.round(quizRecords.reduce((acc, r) => acc + Number(r.score), 0) / quizRecords.length) 
        : 0;
    
    const [tasks, setTasks] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    
    const [greeting, setGreeting] = useState('Good day');
    const headerRef = useRef(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Fetch active tasks
    useEffect(() => {
        if (!userProfile) return;
        const fetchTasks = async () => {
            try {
                const q = query(
                    collection(db, 'tasks'),
                    where('wing', '==', userProfile.wing || 'army')
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Filter and sort in JS
                const active = data.filter(t => {
                    const isOverdue = t.dueDate && new Date(t.dueDate) < new Date();
                    return t.status !== 'Completed' && !isOverdue;
                });
                
                active.sort((a, b) => {
                    const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                    const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                    return tB - tA;
                });
                
                setTasks(active);
            } catch (error) {
                console.error("Tasks fetch error:", error);
            }
        };
        fetchTasks();
    }, [userProfile]);

    // Fetch announcements
    useEffect(() => {
        if (!userProfile) return;
        const fetchAnnouncements = async () => {
            try {
                const q = query(
                    collection(db, 'announcements'),
                    where('wing', '==', userProfile.wing || 'army')
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                data.sort((a, b) => {
                    const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                    const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                    return tB - tA;
                });
                
                setAnnouncements(data.slice(0, 3)); // Only show latest 3
            } catch (error) {
                console.error("Announcements fetch error:", error);
            }
        };
        fetchAnnouncements();
    }, [userProfile]);

    const handleCompleteTask = async (task) => {
        try {
            await updateDoc(doc(db, 'tasks', task.id), {
                completedCount: (task.completedCount || 0) + 1
            });
            // We could also store individual cadet completion records here in a subcollection
            // For now, we'll just optimistically hide it from the UI or show a checkmark
            // To keep it simple, we'll just show an alert
            alert("Task marked as completed!");
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const QUICK_ACTIONS = [
        { id: 'doubt-solver', label: 'Neural Query', icon: Bot, desc: 'AI assistant for instant answers', color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { id: 'document-study', label: 'Samvada Lens', icon: Eye, desc: 'Analyze study materials', color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { id: 'quiz-assessment', label: 'Adaptive Testing', icon: ClipboardList, desc: 'Take practice tests', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { id: 'exam-prep', label: 'B & C Cert Prep', icon: Trophy, desc: 'View your progress', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { id: 'grievance-portal', label: 'Samvada Shield', icon: ShieldAlert, desc: 'Report an issue', color: 'text-red-400', bg: 'bg-red-500/10' },
        { id: 'quartermaster', label: 'Quartermaster', icon: FilePlus, desc: 'Request kit & uniform', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ];

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'Urgent': return 'text-red-500 border-red-500/20 bg-red-500/10';
            case 'High': return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
            case 'Medium': return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
            case 'Low': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
            default: return 'text-gray-400 border-gray-500/20 bg-gray-500/10';
        }
    };

    const getAnnouncementStyles = (priority) => {
        switch (priority) {
            case 'Critical': return 'border-red-500/30 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
            case 'High': return 'border-orange-500/30 bg-orange-500/5';
            default: return 'border-theme-border bg-theme-surface/50';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-theme-bg overflow-y-auto custom-scrollbar p-3 md:p-6 font-sans">
            <div className="w-full space-y-5">
                
                {/* ═══ HEADER / GREETING ═══ */}
                <div 
                    ref={headerRef}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                    }}
                    className="group relative overflow-hidden rounded-3xl animate-fade-in-up bg-gradient-to-br from-theme-surface/80 to-theme-bg border border-theme-border/50 shadow-2xl transition-all duration-700 hover:shadow-theme-primary/10"
                >
                    {/* Dynamic Interactive Glow */}
                    <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--theme-primary), 0.08), transparent 80%)`
                        }}
                    />

                    <div className="relative z-10 p-6 md:p-8 lg:p-12">
                        {/* Top Row: Badge + Division */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-primary/10 border border-theme-primary/20 w-fit">
                                <span className="w-2 h-2 rounded-full bg-theme-primary animate-pulse" />
                                <p className="text-xs font-semibold text-theme-primary tracking-[0.2em] uppercase">
                                    Unity and Discipline
                                </p>
                            </div>
                            <p className="text-theme-muted text-sm font-medium flex items-center gap-2 tracking-wide">
                                <ShieldAlert className="w-4 h-4 text-theme-primary/60 shrink-0" />
                                <span className="truncate">National Cadet Corps • {currentUser?.wing || 'Senior'} Division</span>
                            </p>
                        </div>

                        {/* Greeting */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-theme-text leading-[1.1] tracking-wide mb-8">
                            {greeting},<br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-primary italic md:ml-3">
                                {currentUser?.displayName?.split(' ')[0] || 'Cadet'}
                            </span>
                        </h1>

                        {/* Stat Cards — responsive grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                            <div className="rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 flex flex-col items-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                                <span className="text-[10px] md:text-xs font-semibold text-theme-muted uppercase tracking-[0.15em] mb-1 md:mb-1.5 text-center">Rank</span>
                                <span className="text-2xl md:text-3xl font-light text-theme-text">{levelInfo.rankAbbr}</span>
                            </div>
                            <div className="rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 flex flex-col items-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                                <span className="text-[10px] md:text-xs font-semibold text-theme-muted uppercase tracking-[0.15em] mb-1 md:mb-1.5 text-center">Avg Score</span>
                                <span className="text-2xl md:text-3xl font-light text-theme-primary">{avgScore > 0 ? `${avgScore}%` : 'N/A'}</span>
                            </div>
                            <div className="rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 flex flex-col items-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                                <span className="text-[10px] md:text-xs font-semibold text-theme-muted uppercase tracking-[0.15em] mb-1 md:mb-1.5 text-center">Tests</span>
                                <span className="text-2xl md:text-3xl font-light text-theme-primary">{quizRecords.length}</span>
                            </div>
                            <div className="rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 flex flex-col items-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                                <span className="text-[10px] md:text-xs font-semibold text-theme-muted uppercase tracking-[0.15em] mb-1 md:mb-1.5 text-center">Attendance</span>
                                <span className="text-2xl md:text-3xl font-light text-theme-text">85%</span>
                            </div>
                            <div className="col-span-2 sm:col-span-1 md:col-span-1 rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 flex flex-col items-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                                <span className="text-[10px] md:text-xs font-semibold text-theme-muted uppercase tracking-[0.15em] mb-1 md:mb-1.5 text-center">Next Parade</span>
                                <span className="text-2xl md:text-3xl font-light text-theme-text">14 Nov</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Col (2/3): Tasks & Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Daily Tasks */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-light text-theme-text flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-theme-primary" /> Today's Objectives
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {tasks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-theme-border rounded-[24px] bg-theme-surface/30">
                                        <CheckCircle className="w-16 h-16 text-theme-muted mb-4 opacity-50" />
                                        <p className="text-lg text-theme-text font-bold">All caught up!</p>
                                        <p className="text-sm text-theme-muted mt-1 text-center max-w-sm">No active tasks for today. Continue with your syllabus study or take a mock test.</p>
                                    </div>
                                ) : (
                                    tasks.map(task => (
                                        <div key={task.id} className="glass-input rounded-2xl p-4 flex items-start gap-4 transition-all hover:border-theme-primary/40 group">
                                            <button 
                                                onClick={() => handleCompleteTask(task)}
                                                className="mt-1 w-6 h-6 rounded-full border-2 border-theme-muted hover:border-theme-primary hover:bg-theme-primary/20 hover:scale-110 flex items-center justify-center transition-all duration-300 flex-shrink-0"
                                            >
                                                <CheckCircle className="w-4 h-4 text-transparent hover:text-theme-primary transition-colors" />
                                            </button>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getPriorityStyles(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                    {task.dueDate && <span className="text-[10px] text-theme-muted font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(task.dueDate).toLocaleDateString()}</span>}
                                                </div>
                                                <h3 className="text-base font-bold text-theme-text leading-tight mb-1">{task.title}</h3>
                                                {task.description && <p className="text-sm text-theme-muted line-clamp-2">{task.description}</p>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                    </div>

                    {/* Right Col (1/3): Announcements */}
                    <div className="space-y-6">
                        <section className="glass-3d rounded-[32px] p-6 h-full animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-light text-theme-text flex items-center gap-2">
                                    <Megaphone className="w-5 h-5 text-blue-400" /> Command Comms
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {announcements.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-theme-border rounded-[24px] bg-theme-surface/30 text-center">
                                        <Megaphone className="w-12 h-12 text-theme-muted mb-4 opacity-50" />
                                        <p className="text-theme-text font-bold text-lg">No Comms</p>
                                        <p className="text-sm text-theme-muted mt-1">No new announcements from Command.</p>
                                    </div>
                                ) : (
                                    announcements.map(announcement => (
                                        <div key={announcement.id} className={`p-4 rounded-2xl border ${getAnnouncementStyles(announcement.priority)} transition-colors relative overflow-hidden hover:bg-theme-surface/80`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                {announcement.priority === 'Critical' && <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
                                                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">
                                                    {announcement.createdAt?.toDate().toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-theme-text text-sm mb-1.5">{announcement.title}</h3>
                                            <p className="text-xs text-theme-muted line-clamp-3 mb-3 leading-relaxed">{announcement.body}</p>
                                            <div className="text-[9px] font-bold text-theme-primary/60 uppercase tracking-widest">
                                                From: {announcement.authorName}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                </div>

                {/* ═══ FULL-WIDTH QUICK ACCESS ═══ */}
                <section className="animate-fade-in-up w-full mt-8" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-light text-theme-text flex items-center gap-4 tracking-wide">
                            <div className="p-3 bg-theme-primary/10 rounded-2xl border border-theme-primary/20 shadow-[0_0_15px_rgba(var(--theme-primary),0.2)]">
                                <Bot className="w-6 h-6 text-theme-primary" />
                            </div>
                            Operations Palette
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { id: 'doubt-solver', label: 'Neural Query', icon: Bot, desc: 'AI assistant for instant answers and deep reasoning.', glow: 'hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)]', border: 'hover:border-blue-500/50', iconBg: 'bg-blue-500/10 border-blue-500/20', iconColor: 'text-blue-500' },
                            { id: 'document-study', label: 'Samvada Lens', icon: Eye, desc: 'Analyze study materials and extract insights.', glow: 'hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)]', border: 'hover:border-purple-500/50', iconBg: 'bg-purple-500/10 border-purple-500/20', iconColor: 'text-purple-500' },
                            { id: 'quiz-assessment', label: 'Precision Testing', icon: ClipboardList, desc: 'Take dynamic practice tests for your exams.', glow: 'hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)]', border: 'hover:border-emerald-500/50', iconBg: 'bg-emerald-500/10 border-emerald-500/20', iconColor: 'text-emerald-500' },
                            { id: 'exam-prep', label: 'B & C Cert Prep', icon: Trophy, desc: 'Track your progress and battalion ranking.', glow: 'hover:shadow-[0_20px_40px_rgba(201,165,90,0.15)]', border: 'hover:border-theme-primary/50', iconBg: 'bg-theme-primary/10 border-theme-primary/20', iconColor: 'text-theme-primary' },
                            { id: 'neural-arena', label: 'Colosseum', icon: Swords, desc: 'Compete in live quiz arenas with other cadets.', glow: 'hover:shadow-[0_20px_40px_rgba(239,68,68,0.15)]', border: 'hover:border-red-500/50', iconBg: 'bg-red-500/10 border-red-500/20', iconColor: 'text-red-500' },
                            { id: 'quartermaster', label: 'Quartermaster', icon: FilePlus, desc: 'Request kit, uniform items, and manage inventory.', glow: 'hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)]', border: 'hover:border-orange-500/50', iconBg: 'bg-orange-500/10 border-orange-500/20', iconColor: 'text-orange-500' },
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`relative group overflow-hidden flex flex-col items-start px-6 py-8 rounded-[32px] bg-theme-surface/40 backdrop-blur-xl border border-theme-border/40 transition-all duration-500 hover:-translate-y-3 hover:bg-theme-surface/60 ${item.glow} ${item.border}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 mb-6 ${item.iconBg}`}>
                                        <Icon className={`w-7 h-7 ${item.iconColor}`} />
                                    </div>
                                    
                                    <h3 className="text-lg font-light text-theme-text mb-3 leading-tight group-hover:text-theme-primary transition-colors text-left">
                                        {item.label}
                                    </h3>
                                    
                                    <p className="text-xs font-medium text-theme-muted text-left leading-relaxed line-clamp-3">
                                        {item.desc}
                                    </p>
                                    
                                    <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-theme-muted group-hover:text-theme-primary transition-colors">
                                        Launch Module <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CadetDashboard;
