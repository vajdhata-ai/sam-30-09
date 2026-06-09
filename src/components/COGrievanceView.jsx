import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ShieldAlert, AlertTriangle, MessageCircle, Clock } from './Icons';

const COGrievanceView = () => {
    const [grievances, setGrievances] = useState([]);
    const [filter, setFilter] = useState('All'); // All, Pending, Critical, Resolved
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [response, setResponse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'grievances'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            data.sort((a, b) => {
                const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return tB - tA;
            });
            
            setGrievances(data);
            
            // Update selected grievance if it was modified
            if (selectedGrievance) {
                const updated = data.find(g => g.id === selectedGrievance.id);
                if (updated) setSelectedGrievance(updated);
            }
        }, (error) => {
            console.warn('COGrievanceView: Firestore listener error:', error.message);
            setGrievances([]);
        });

        return () => unsubscribe();
    }, [selectedGrievance]);

    const filteredGrievances = grievances.filter(g => {
        // Status filter
        if (filter === 'Pending') {
            if (g.status !== 'Pending' && g.status !== 'Under Review') return false;
        } else if (filter === 'Critical') {
            if (g.severity !== 'Critical') return false;
        } else if (filter === 'Resolved') {
            if (g.status !== 'Resolved' && g.status !== 'Dismissed') return false;
        }
        
        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                g.category?.toLowerCase().includes(term) ||
                g.cadetName?.toLowerCase().includes(term) ||
                g.description?.toLowerCase().includes(term)
            );
        }
        
        return true;
    });

    const handleUpdateStatus = async (status) => {
        if (!selectedGrievance) return;
        
        try {
            await updateDoc(doc(db, 'grievances', selectedGrievance.id), {
                status,
                coResponse: response.trim() || null,
                updatedAt: serverTimestamp()
            });
            setResponse('');
        } catch (error) {
            console.error("Error updating grievance:", error);
            alert("Failed to update status.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-orange-400 border-orange-400/20';
            case 'Under Review': return 'text-blue-400 border-blue-400/20';
            case 'Resolved': return 'text-emerald-400 border-emerald-400/20';
            case 'Dismissed': return 'text-gray-400 border-gray-400/20';
            default: return 'text-gray-400 border-gray-400/20';
        }
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-6 min-h-0">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-black text-white flex items-center gap-2">
                            <ShieldAlert className="w-6 h-6 text-emerald-400" /> Grievance Queue
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and respond to cadet reports</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                        {['All', 'Pending', 'Critical', 'Resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border
                                    ${filter === f 
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                        : 'bg-[#121a28] text-gray-400 border-white/5 hover:bg-white/5 hover:text-gray-200'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                    
                    {/* Left: Queue List */}
                    <div className="flex-1 flex flex-col min-h-0 bg-[#121a28] border border-white/[0.06] rounded-3xl overflow-hidden">
                        
                        <div className="p-4 border-b border-white/[0.06] bg-[#0a0f1a]/50">
                            <input 
                                type="text"
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#1a2538] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                            {filteredGrievances.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <ShieldAlert className="w-12 h-12 text-gray-700 mb-3" />
                                    <p className="text-gray-400 font-medium">No grievances found</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredGrievances.map(g => (
                                        <div 
                                            key={g.id} 
                                            onClick={() => { setSelectedGrievance(g); setResponse(g.coResponse || ''); }}
                                            className={`p-4 rounded-2xl border cursor-pointer transition-all
                                                ${selectedGrievance?.id === g.id 
                                                    ? 'bg-[#1a2538] border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.1)]' 
                                                    : 'bg-[#0a0f1a] border-white/[0.04] hover:border-white/10'
                                                } 
                                                ${g.severity === 'Critical' && g.status === 'Pending' ? 'border-l-4 border-l-red-500' : ''}
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border bg-black/20 ${getStatusColor(g.status)}`}>
                                                        {g.status}
                                                    </span>
                                                    {g.severity === 'Critical' && <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border bg-red-500/10 text-red-500 border-red-500/20">Critical</span>}
                                                </div>
                                                <span className="text-xs text-gray-500">{g.createdAt?.toDate().toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="font-bold text-white text-sm mb-1">{g.category}</h3>
                                            <p className="text-xs text-gray-400 line-clamp-1 mb-2">{g.description}</p>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <span>{g.cadetName}</span>
                                                {g.anonymous && <span className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">Anon</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Action Panel */}
                    <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 flex flex-col min-h-0 bg-[#121a28] border border-white/[0.06] rounded-3xl overflow-hidden">
                        {selectedGrievance ? (
                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="p-6 border-b border-white/[0.06] bg-[#0a0f1a]/50 flex-shrink-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white">Action Center</h3>
                                        <span className="text-[10px] text-gray-500 font-mono">ID: {selectedGrievance.id.slice(0,8)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border bg-black/20 ${getStatusColor(selectedGrievance.status)}`}>
                                            {selectedGrievance.status}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700 uppercase tracking-widest">
                                            {selectedGrievance.severity} Priority
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                                    {/* Info blocks */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Reporter</label>
                                            <div className="bg-[#0a0f1a] rounded-xl p-3 border border-white/5">
                                                <p className="text-sm font-bold text-gray-200">{selectedGrievance.cadetName}</p>
                                                {!selectedGrievance.anonymous && <p className="text-xs text-gray-500 mt-0.5">{selectedGrievance.cadetEmail}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Category</label>
                                            <p className="text-sm text-gray-200">{selectedGrievance.category}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Full Description</label>
                                            <div className="bg-[#0a0f1a] rounded-xl p-4 border border-white/5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                {selectedGrievance.description}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Response Area */}
                                    <div className="pt-4 border-t border-white/[0.06]">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Command Response</label>
                                        <textarea 
                                            value={response}
                                            onChange={(e) => setResponse(e.target.value)}
                                            placeholder="Add an official response or internal note..."
                                            className="w-full p-3 rounded-xl bg-[#0a0f1a] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500/50 min-h-[120px] resize-y"
                                        />
                                        
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <button 
                                                onClick={() => handleUpdateStatus('Under Review')}
                                                className="py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold tracking-wide uppercase transition-colors"
                                            >
                                                Reviewing
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus('Resolved')}
                                                className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold tracking-wide uppercase transition-colors"
                                            >
                                                Resolve
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus('Dismissed')}
                                                className="col-span-2 py-2 bg-[#0a0f1a] hover:bg-white/5 text-gray-400 border border-white/5 rounded-xl text-xs font-bold tracking-wide uppercase transition-colors"
                                            >
                                                Dismiss Report
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#0a0f1a]/50">
                                <div className="w-16 h-16 bg-[#1a2538] rounded-2xl flex items-center justify-center mb-4 border border-white/5">
                                    <MessageCircle className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-300 mb-1">No Report Selected</h3>
                                <p className="text-sm text-gray-500">Select a grievance from the queue to view details and take official action.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default COGrievanceView;
