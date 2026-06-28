import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Package, Clock, CheckCircle, XCircle } from './Icons';

const COQuartermasterView = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'kitRequests'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            data.sort((a, b) => {
                const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return tB - tA;
            });
            
            setRequests(data);
        }, (error) => {
            console.error('Error fetching kit requests:', error);
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, 'kitRequests', id), { status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
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
                <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-orange-400" />
                    <div>
                        <h1 className="text-3xl font-black text-theme-text">Quartermaster Indents</h1>
                        <p className="text-theme-muted mt-1">Manage cadet kit requests and uniform issuances.</p>
                    </div>
                </div>

                <div className="bg-theme-surface border border-theme-border rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-theme-border bg-theme-bg/50 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-theme-muted" />
                        <span className="text-xs font-bold text-theme-muted uppercase tracking-widest">Active Indents</span>
                    </div>

                    <div className="p-4 space-y-3">
                        {requests.length === 0 ? (
                            <div className="text-center p-8">
                                <Package className="w-12 h-12 text-theme-muted/30 mx-auto mb-3" />
                                <p className="text-theme-muted font-medium">No pending kit indents.</p>
                            </div>
                        ) : (
                            requests.map(req => (
                                <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border border-theme-border bg-theme-bg/30 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-theme-text">{req.cadetName || 'Cadet'}</h3>
                                            <span className="text-[10px] text-theme-muted font-mono bg-theme-surface px-1.5 py-0.5 rounded border border-theme-border">{req.item} (Size: {req.size})</span>
                                        </div>
                                        <p className="text-xs text-theme-muted">Reason: {req.reason} • {req.createdAt?.toDate().toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-widest ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </div>
                                        {req.status === 'Pending' && (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleUpdateStatus(req.id, 'Approved')} className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors" title="Approve">
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleUpdateStatus(req.id, 'Rejected')} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors" title="Reject">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                        {req.status === 'Approved' && (
                                            <button onClick={() => handleUpdateStatus(req.id, 'Issued')} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-500/20 transition-colors">
                                                Mark Issued
                                            </button>
                                        )}
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

export default COQuartermasterView;
