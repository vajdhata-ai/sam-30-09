import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { usePerformance } from '../contexts/PerformanceContext';
import { Bot, Eye, ClipboardList, Trophy, ShieldAlert, Swords, CheckCircle, Clock, AlertCircle, Megaphone, Calendar, ChevronRight, FilePlus } from './Icons';

const CadetDashboard = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const { getLevelInfo } = usePerformance();
    const levelInfo = getLevelInfo();
    
    const [tasks, setTasks] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    
    const [greeting, setGreeting] = useState('Good day');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Fetch active tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const q = query(collection(db, 'tasks'));
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
    }, []);

    // Fetch announcements
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const q = query(collection(db, 'announcements'));
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
    }, []);

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
        <div className="flex-1 flex flex-col h-full bg-theme-bg overflow-y-auto custom-scrollbar p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto w-full space-y-8">
                
                {/* ═══ HEADER / GREETING ═══ */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 glass-3d-elevated p-6 md:p-8 rounded-[32px] animate-fade-in-up relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-theme-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <p className="text-sm font-bold text-theme-primary tracking-widest uppercase mb-2">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black text-theme-text leading-tight">
                            {greeting},<br/>
                            <span className="text-theme-primary">{currentUser?.displayName || 'Cadet'}</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4 relative z-10">
                        <div className="glass-card rounded-2xl p-4 flex flex-col justify-center items-center min-w-[100px] hover:-translate-y-1 transition-transform duration-300">
                            <span className="text-xl font-black text-theme-text">{levelInfo.rankAbbr}</span>
                            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Rank</span>
                        </div>
                        <div className="glass-card rounded-2xl p-4 flex flex-col justify-center items-center min-w-[100px] hover:-translate-y-1 transition-transform duration-300">
                            <span className="text-2xl font-black text-emerald-400">85%</span>
                            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Attendance</span>
                        </div>
                        <div className="glass-card rounded-2xl p-4 flex flex-col justify-center items-center min-w-[100px] hover:-translate-y-1 transition-transform duration-300">
                            <span className="text-xl font-black text-blue-400">14 Nov</span>
                            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Next Parade</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Col (2/3): Tasks & Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Daily Tasks */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-black text-theme-text flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-theme-primary" /> Today's Objectives
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {tasks.length === 0 ? (
                                    <div className="bg-theme-surface/50 border border-theme-border border-dashed rounded-2xl p-8 text-center">
                                        <CheckCircle className="w-10 h-10 text-theme-muted mx-auto mb-3 opacity-50" />
                                        <p className="text-theme-muted font-medium">All caught up! No active tasks for today.</p>
                                    </div>
                                ) : (
                                    tasks.map(task => (
                                        <div key={task.id} className="glass-input rounded-2xl p-4 flex items-start gap-4 transition-all hover:border-theme-primary/40 group">
                                            <button 
                                                onClick={() => handleCompleteTask(task)}
                                                className="mt-1 w-6 h-6 rounded-full border-2 border-theme-muted hover:border-teal-500 hover:bg-teal-500/20 hover:scale-110 flex items-center justify-center transition-all duration-300 flex-shrink-0"
                                            >
                                                <CheckCircle className="w-4 h-4 text-transparent hover:text-teal-500 transition-colors" />
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

                        {/* Quick Actions Grid */}
                        <section>
                            <h2 className="text-xl font-black text-theme-text mb-4">Quick Access</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {QUICK_ACTIONS.map(action => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.id}
                                            onClick={() => onNavigate(action.id)}
                                            className="glass-card glow-border rounded-2xl p-4 text-left transition-all duration-300 group relative overflow-hidden h-[120px] flex flex-col justify-between hover:-translate-y-1 hover:shadow-glow"
                                        >
                                            {/* Glow effect on hover */}
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-theme-primary/5 rounded-full blur-xl scale-0 group-hover:scale-100 transition-transform duration-500 -translate-y-1/2 translate-x-1/2" />
                                            
                                            <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center mb-2`}>
                                                <Icon className={`w-5 h-5 ${action.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-theme-text text-sm leading-tight mb-0.5">{action.label}</h3>
                                                <p className="text-[10px] text-theme-muted line-clamp-1">{action.desc}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                    </div>

                    {/* Right Col (1/3): Announcements */}
                    <div className="space-y-6">
                        <section className="glass-3d rounded-[32px] p-6 h-full min-h-[400px] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-theme-text flex items-center gap-2">
                                    <Megaphone className="w-5 h-5 text-blue-400" /> Command Comms
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {announcements.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="w-12 h-12 bg-theme-surface rounded-full flex items-center justify-center mx-auto mb-3 border border-theme-border">
                                            <Megaphone className="w-5 h-5 text-theme-muted" />
                                        </div>
                                        <p className="text-sm text-theme-muted font-medium">No new announcements</p>
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
            </div>
        </div>
    );
};

export default CadetDashboard;
