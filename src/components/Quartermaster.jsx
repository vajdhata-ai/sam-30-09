import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { FilePlus, Package, CheckCircle, Clock } from './Icons';

const Quartermaster = () => {
    const { currentUser } = useAuth();
    const [requests, setRequests] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);
    const [formData, setFormData] = useState({
        item: 'Beret',
        size: '',
        reason: 'New Issue' // New Issue, Replacement, Damage
    });

    const KIT_ITEMS = ['Beret', 'Hackle', 'Boots', 'Web Belt', 'Lanyard', 'Uniform Fabric (Khaki)', 'Line Yard', 'Shoulder Title'];

    useEffect(() => {
        if (!currentUser?.uid) return;

        let unsubscribe = () => {};
        try {
            const q = query(
                collection(db, 'kitRequests'),
                where('cadetId', '==', currentUser.uid)
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                data.sort((a, b) => {
                    const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                    const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                    return tB - tA;
                });
                
                setRequests(data);
            }, (error) => {
                console.warn('Quartermaster: Firestore listener error:', error.message);
                setRequests([]);
            });
        } catch (error) {
            console.warn('Quartermaster: Failed to set up Firestore listener:', error.message);
            setRequests([]);
        }

        return () => unsubscribe();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'kitRequests'), {
                ...formData,
                cadetId: currentUser.uid,
                cadetName: currentUser.displayName || 'Cadet',
                status: 'Pending',
                createdAt: serverTimestamp()
            });
            setIsRequesting(false);
            setFormData({ item: 'Beret', size: '', reason: 'New Issue' });
            alert("Kit request submitted to Quartermaster.");
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit request.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'Approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'Issued': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'Rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-theme-bg overflow-y-auto custom-scrollbar p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto w-full space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-theme-text flex items-center gap-3">
                            <Package className="w-8 h-8 text-orange-400" /> Quartermaster Store
                        </h1>
                        <p className="text-theme-muted mt-2">Request uniform articles, accoutrements, and report damages.</p>
                    </div>
                    <button 
                        onClick={() => setIsRequesting(true)}
                        className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    >
                        <FilePlus className="w-4 h-4" /> New Request
                    </button>
                </div>

                {/* Request Form Modal */}
                {isRequesting && (
                    <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-2xl relative animate-fade-in-down">
                        <button onClick={() => setIsRequesting(false)} className="absolute top-4 right-4 text-theme-muted hover:text-theme-text">✕</button>
                        <h2 className="text-lg font-bold text-theme-text mb-6">Indent New Kit</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Article of Clothing / Kit</label>
                                    <select 
                                        value={formData.item}
                                        onChange={(e) => setFormData({...formData, item: e.target.value})}
                                        className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:border-orange-500/50 outline-none"
                                    >
                                        {KIT_ITEMS.map(item => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Size / Measurement</label>
                                    <input 
                                        type="text" required
                                        placeholder="e.g., Size 8, Large, etc."
                                        value={formData.size}
                                        onChange={(e) => setFormData({...formData, size: e.target.value})}
                                        className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:border-orange-500/50 outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] text-theme-muted uppercase tracking-widest font-bold mb-1.5 block">Reason for Indent</label>
                                <select 
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:border-orange-500/50 outline-none"
                                >
                                    <option value="New Issue">New Issue</option>
                                    <option value="Replacement">Replacement</option>
                                    <option value="Damage/Loss">Damage/Loss</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
                                <button type="button" onClick={() => setIsRequesting(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-theme-muted hover:bg-theme-bg transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors">
                                    Submit Indent
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* History */}
                <div className="bg-theme-surface border border-theme-border rounded-3xl overflow-hidden">
                    <div className="p-4 border-b border-theme-border bg-theme-bg/50 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-theme-muted" />
                        <span className="text-xs font-bold text-theme-muted uppercase tracking-widest">Indent History</span>
                    </div>

                    <div className="p-4 space-y-3">
                        {requests.length === 0 ? (
                            <div className="text-center p-8">
                                <Package className="w-12 h-12 text-theme-muted/30 mx-auto mb-3" />
                                <p className="text-theme-muted font-medium">No kit indents submitted.</p>
                            </div>
                        ) : (
                            requests.map(req => (
                                <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border border-theme-border bg-theme-bg/30 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-theme-text">{req.item}</h3>
                                            <span className="text-[10px] text-theme-muted font-mono bg-theme-surface px-1.5 py-0.5 rounded border border-theme-border">Size: {req.size}</span>
                                        </div>
                                        <p className="text-xs text-theme-muted">Reason: {req.reason} • {req.createdAt?.toDate().toLocaleDateString()}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-widest ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Quartermaster;
