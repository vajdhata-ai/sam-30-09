import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ShieldAlert, Send, AlertTriangle, MessageCircle, RefreshCw, Eye } from './Icons';
import { useAuth } from '../contexts/AuthContext';

const GrievancePortal = () => {
    const { currentUser } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Bullying/Harassment',
        severity: 'Medium',
        description: '',
        anonymous: false
    });

    const categories = ['Bullying/Harassment', 'Food Quality', 'Facility/Accommodation', 'Unfair Treatment', 'Medical/Health', 'Other'];
    const severities = ['Low', 'Medium', 'High', 'Critical'];

    // Fetch user's complaints
    useEffect(() => {
        if (!currentUser) return;

        let unsubscribe = () => {};
        try {
            const q = query(
                collection(db, 'grievances'),
                where('cadetUid', '==', currentUser.uid)
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                data.sort((a, b) => {
                    const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                    const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                    return tB - tA;
                });
                setComplaints(data);
            }, (error) => {
                console.warn('GrievancePortal: Firestore listener error:', error.message);
                setComplaints([]);
            });
        } catch (error) {
            console.warn('GrievancePortal: Failed to set up listener:', error.message);
            setComplaints([]);
        }

        return () => unsubscribe();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.description.trim()) return;
        
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'grievances'), {
                cadetUid: currentUser.uid,
                cadetName: formData.anonymous ? 'Anonymous Cadet' : currentUser.displayName || 'Cadet',
                cadetEmail: formData.anonymous ? 'Hidden' : currentUser.email,
                category: formData.category,
                severity: formData.severity,
                description: formData.description,
                anonymous: formData.anonymous,
                status: 'Pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                coResponse: null
            });
            
            // Reset form
            setFormData({ ...formData, description: '' });
        } catch (error) {
            console.error("Error submitting grievance:", error);
            alert("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'Under Review': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Resolved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Dismissed': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
            default: return 'text-theme-muted bg-theme-bg border-theme-border';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-theme-bg overflow-y-auto custom-scrollbar p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left: Filing Form */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-black text-theme-text flex items-center gap-3">
                            <ShieldAlert className="w-8 h-8 text-red-500" /> Samvada Shield
                        </h1>
                        <p className="text-theme-muted mt-2 text-sm leading-relaxed">
                            Report issues directly to the Commanding Officer. Your concerns regarding bullying, food quality, or unfair treatment will be handled strictly and confidentially.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-theme-surface p-6 rounded-3xl border border-theme-border shadow-sm space-y-5">
                        
                        <div>
                            <label className="block text-xs font-bold text-theme-muted uppercase tracking-widest mb-2">Category</label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full p-3.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors appearance-none"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-theme-muted uppercase tracking-widest mb-2">Severity Level</label>
                            <div className="grid grid-cols-4 gap-2">
                                {severities.map(s => (
                                    <button 
                                        key={s} type="button"
                                        onClick={() => setFormData({...formData, severity: s})}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all border
                                            ${formData.severity === s 
                                                ? (s === 'Critical' ? 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-theme-primary text-theme-bg border-theme-primary') 
                                                : 'bg-theme-bg border-theme-border text-theme-muted hover:border-theme-primary/50'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-theme-muted uppercase tracking-widest mb-2 flex items-center justify-between">
                                Description
                            </label>
                            <textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Describe the incident or issue in detail..."
                                className="w-full p-4 rounded-xl bg-theme-bg border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors min-h-[120px] resize-y"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-theme-bg rounded-xl border border-theme-border">
                            <input 
                                type="checkbox" 
                                id="anonymous"
                                checked={formData.anonymous}
                                onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
                                className="w-4 h-4 accent-theme-primary"
                            />
                            <label htmlFor="anonymous" className="text-sm text-theme-text cursor-pointer select-none">
                                Submit Anonymously
                                <span className="block text-xs text-theme-muted">The CO will not see your name or email.</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting || !formData.description.trim()}
                            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Grievance</>}
                        </button>
                    </form>
                </div>

                {/* Right: History */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-theme-text flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-theme-primary" /> My Reports
                    </h2>

                    <div className="space-y-4">
                        {complaints.length === 0 ? (
                            <div className="bg-theme-surface/50 border border-theme-border border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                                <ShieldAlert className="w-12 h-12 text-theme-muted opacity-50 mb-3" />
                                <p className="text-theme-muted">You have no active reports.</p>
                            </div>
                        ) : (
                            complaints.map(complaint => (
                                <div key={complaint.id} className="bg-theme-surface p-5 rounded-2xl border border-theme-border shadow-sm group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border ${getStatusColor(complaint.status)}`}>
                                                {complaint.status}
                                            </span>
                                            {complaint.severity === 'Critical' && (
                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                        <span className="text-xs text-theme-muted">
                                            {complaint.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-bold text-theme-text text-sm mb-1">{complaint.category}</h3>
                                    <p className="text-sm text-theme-muted line-clamp-2 mb-3">{complaint.description}</p>

                                    {complaint.coResponse && (
                                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl mt-3 relative">
                                            <div className="absolute -top-2 left-4 px-2 bg-theme-surface text-[9px] font-bold text-blue-400 uppercase tracking-widest">CO Response</div>
                                            <p className="text-sm text-blue-100">{complaint.coResponse}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GrievancePortal;
