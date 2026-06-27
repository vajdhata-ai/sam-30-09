import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, where } from 'firebase/firestore';
import { Megaphone, Plus, Trash2, Clock, AlertCircle } from './Icons';
import { useAuth } from '../contexts/AuthContext';

const COAnnouncementsView = () => {
    const { currentUser, userProfile } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        priority: 'Normal' // Normal, High, Critical
    });

    useEffect(() => {
        if (!userProfile) return;
        const q = query(
            collection(db, 'announcements'),
            where('wing', '==', userProfile.wing || 'army')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            data.sort((a, b) => {
                const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return tB - tA;
            });
            
            setAnnouncements(data);
        }, (error) => {
            console.error("Announcements fetch error:", error);
        });
        return () => unsubscribe();
    }, []);

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.body.trim()) return;

        try {
            await addDoc(collection(db, 'announcements'), {
                ...formData,
                authorName: currentUser?.displayName || 'Commanding Officer',
                wing: userProfile?.wing || 'army',
                battalion: userProfile?.battalion || '1st Battalion',
                createdAt: serverTimestamp()
            });
            setIsCreating(false);
            setFormData({ title: '', body: '', priority: 'Normal' });
        } catch (error) {
            console.error("Error posting announcement:", error);
            alert("Failed to post announcement.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement? It will be removed from all cadet dashboards.')) return;
        try {
            await deleteDoc(doc(db, 'announcements', id));
        } catch (error) {
            console.error("Error deleting announcement:", error);
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'Critical': return { card: 'border-red-500/30 bg-red-500/5', badge: 'text-red-500 bg-red-500/10 border-red-500/20' };
            case 'High': return { card: 'border-orange-500/30 bg-orange-500/5', badge: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
            default: return { card: 'border-transparent hover:border-theme-border bg-theme-bg', badge: 'text-theme-primary bg-theme-primary/10 border-theme-primary/20' };
        }
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
            <div className="max-w-4xl mx-auto w-full h-full flex flex-col space-y-6 min-h-0">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-black text-theme-text flex items-center gap-2">
                            <Megaphone className="w-6 h-6 text-theme-primary" /> Announcements
                        </h1>
                        <p className="text-sm text-theme-muted mt-1">Broadcast official messages to all cadets</p>
                    </div>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2.5 bg-theme-primary text-theme-bg rounded-xl text-sm font-bold shadow-md shadow-theme-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Broadcast
                    </button>
                </div>

                {/* Create Modal */}
                {isCreating && (
                    <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 flex-shrink-0 animate-fade-in-down shadow-2xl relative z-20">
                        <button onClick={() => setIsCreating(false)} className="absolute top-4 right-4 text-theme-muted hover:text-theme-text">✕</button>
                        <h2 className="text-lg font-bold text-theme-text mb-6 flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-theme-primary" /> Compose Broadcast
                        </h2>
                        
                        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                            <div>
                                <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Subject / Title</label>
                                <input 
                                    type="text" required
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g., Change in Morning PT Schedule"
                                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:border-theme-primary/50 outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Priority Level</label>
                                <div className="flex gap-3">
                                    {['Normal', 'High', 'Critical'].map(p => (
                                        <button
                                            key={p} type="button"
                                            onClick={() => setFormData({...formData, priority: p})}
                                            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all
                                                ${formData.priority === p 
                                                    ? (p === 'Critical' ? 'bg-red-500 text-white border-red-500' : p === 'High' ? 'bg-orange-500 text-white border-orange-500' : 'bg-theme-primary text-theme-bg border-theme-primary')
                                                    : 'bg-theme-bg text-theme-muted border-theme-border hover:border-theme-border/50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Message Body</label>
                                <textarea 
                                    required
                                    value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})}
                                    placeholder="Type the official announcement here..."
                                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:border-theme-primary/50 outline-none min-h-[150px] resize-y"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-theme-muted hover:bg-white/5 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-theme-primary text-theme-bg rounded-xl text-sm font-bold hover:opacity-90 transition-colors flex items-center gap-2">
                                    <Megaphone className="w-4 h-4" /> Broadcast Now
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Feed */}
                <div className="flex-1 bg-theme-surface border border-theme-border rounded-3xl overflow-hidden flex flex-col min-h-0">
                    <div className="p-4 border-b border-theme-border bg-theme-bg/50 flex-shrink-0 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-theme-muted" />
                        <span className="text-xs font-bold text-theme-muted uppercase tracking-widest">Broadcast History</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                        {announcements.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <Megaphone className="w-12 h-12 text-theme-muted mb-3 opacity-50" />
                                <p className="text-theme-muted font-medium">No announcements published yet</p>
                            </div>
                        ) : (
                            announcements.map(announcement => {
                                const styles = getPriorityStyles(announcement.priority);
                                return (
                                    <div key={announcement.id} className={`p-5 rounded-2xl border ${styles.card} transition-colors group relative`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${styles.badge} flex items-center gap-1`}>
                                                    {announcement.priority === 'Critical' && <AlertCircle className="w-3 h-3" />}
                                                    {announcement.priority}
                                                </span>
                                                <span className="text-[10px] text-theme-muted font-medium">
                                                    {announcement.createdAt?.toDate().toLocaleString()}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(announcement.id)}
                                                className="p-1.5 text-theme-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-theme-text mb-2">{announcement.title}</h3>
                                        <p className="text-sm text-theme-muted whitespace-pre-wrap leading-relaxed">{announcement.body}</p>
                                        
                                        <div className="mt-4 pt-3 border-t border-theme-border text-[10px] font-bold text-theme-muted uppercase tracking-widest">
                                            Posted by: {announcement.authorName}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default COAnnouncementsView;
