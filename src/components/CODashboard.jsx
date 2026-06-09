import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { ShieldAlert, CheckCircle, Clock, AlertTriangle, Users, TrendingUp, ChevronRight, Activity } from './Icons';

// Demo data for zones
const MOCK_ZONES = [
    { id: 1, name: 'Barracks Area', score: 4.4, status: 'Stable', type: 'stable' },
    { id: 2, name: 'Camp Mess Hall', score: 3.2, status: 'Low Score', type: 'warning' },
    { id: 3, name: 'Training Grounds', score: 4.2, status: 'Stable', type: 'stable' },
    { id: 4, name: 'Barrack B-3', score: 2.1, status: 'Critical', type: 'critical' },
];

const CODashboard = ({ onNavigate }) => {
    const [grievances, setGrievances] = useState([]);
    const [stats, setStats] = useState({
        totalCadets: 428, // Mocked for now
        unresolved: 0,
        escalations: 0,
        wellbeing: '4.1/5.0' // Mocked for now
    });
    const [categoryCounts, setCategoryCounts] = useState({});

    useEffect(() => {
        // Fetch all grievances
        const q = query(collection(db, 'grievances'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            data.sort((a, b) => {
                const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return tB - tA;
            });

            setGrievances(data);

            const unresolved = data.filter(g => g.status !== 'Resolved').length;
            const escalations = data.filter(g => g.severity === 'Critical' && g.status !== 'Resolved').length;
            
            setStats(prev => ({
                ...prev,
                unresolved,
                escalations
            }));

            // Calculate category distribution
            const counts = {};
            data.forEach(g => {
                counts[g.category] = (counts[g.category] || 0) + 1;
            });
            setCategoryCounts(counts);
        }, (error) => {
            console.warn('CODashboard: Firestore listener error:', error.message);
            setGrievances([]);
        });

        return () => unsubscribe();
    }, []);

    const recentGrievances = grievances.slice(0, 5);
    const maxCategoryCount = Math.max(...Object.values(categoryCounts).concat([1]));

    const chartCategories = [
        { key: 'Food Quality', label: 'Food/Water', color: 'bg-cyan-400' },
        { key: 'Medical/Health', label: 'Medical', color: 'bg-red-400' },
        { key: 'Facility/Accommodation', label: 'Facilities', color: 'bg-yellow-500' },
        { key: 'Bullying/Harassment', label: 'Training', color: 'bg-emerald-400' },
        { key: 'Unfair Treatment', label: 'Interpersonal', color: 'bg-purple-400' },
        { key: 'Other', label: 'Other', color: 'bg-gray-400' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'Under Review': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Resolved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Dismissed': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* ═══ STATS ROW ═══ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Cadets */}
                    <div className="bg-[#121a28] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between group hover:border-teal-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-1">Total Active Cadets</p>
                                <span className="text-3xl font-black text-white group-hover:text-teal-400 transition-colors">{stats.totalCadets}</span>
                            </div>
                            <div className="p-2.5 bg-[#1a2538] rounded-xl border border-white/[0.06] group-hover:bg-teal-500/10 group-hover:border-teal-500/20 transition-all">
                                <Users className="w-5 h-5 text-teal-400" />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Synced from Battalion roster</div>
                    </div>

                    {/* Unresolved Grievances */}
                    <div className="bg-[#121a28] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between group hover:border-yellow-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-1">Unresolved Grievances</p>
                                <span className="text-3xl font-black text-yellow-500">{stats.unresolved}</span>
                            </div>
                            <div className="p-2.5 bg-[#1a2538] rounded-xl border border-white/[0.06] group-hover:bg-yellow-500/10 group-hover:border-yellow-500/20 transition-all">
                                <ShieldAlert className="w-5 h-5 text-yellow-500" />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Awaiting action</div>
                    </div>

                    {/* Emergency Escalations */}
                    <div className="bg-[#121a28] border border-red-500/20 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group">
                        {stats.escalations > 0 && <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-2xl animate-pulse" />}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.15em] text-red-400/80 uppercase mb-1">Emergency Escalations</p>
                                <span className="text-3xl font-black text-red-500">{stats.escalations}</span>
                            </div>
                            <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                        </div>
                        <div className="text-xs text-red-400/80 font-medium relative z-10">Requires immediate attention</div>
                    </div>

                    {/* Wellbeing Score */}
                    <div className="bg-[#121a28] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-1">Wellbeing Cohort Score</p>
                                <span className="text-3xl font-black text-emerald-400">{stats.wellbeing}</span>
                            </div>
                            <div className="p-2.5 bg-[#1a2538] rounded-xl border border-white/[0.06] group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                                <Activity className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                        <div className="text-xs text-emerald-400/70 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +0.2 this week
                        </div>
                    </div>
                </div>

                {/* ═══ CHARTS & RECENT ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Col (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Chart Area */}
                        <div className="bg-[#121a28] border border-white/[0.06] rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-8">
                                <BarChart className="w-5 h-5 text-gray-400" />
                                <h2 className="text-lg font-bold text-white">Complaint Volume by Category</h2>
                            </div>
                            
                            <div className="relative h-48 w-full flex items-end justify-around pb-2 border-b border-white/[0.06]">
                                {/* Horizontal grid lines */}
                                {[0.25, 0.5, 0.75, 1].map(pct => (
                                    <div key={pct} className="absolute left-0 w-full border-t border-white/[0.03] border-dashed" style={{ bottom: `${pct * 100}%` }} />
                                ))}
                                
                                {chartCategories.map(cat => {
                                    const count = categoryCounts[cat.key] || 0;
                                    const heightPct = Math.max((count / maxCategoryCount) * 100, 4); // min 4% height
                                    return (
                                        <div key={cat.key} className="flex flex-col items-center group w-12 z-10">
                                            <span className="text-xs font-bold text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                                            <div 
                                                className={`w-full rounded-t-sm transition-all duration-500 ${cat.color} opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                                                style={{ height: `${heightPct}%` }}
                                            />
                                            <span className="absolute -bottom-8 text-[10px] font-bold text-gray-500 tracking-wide text-center uppercase hidden sm:block w-20 transform -translate-x-1/2 left-1/2">
                                                {cat.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="h-8 sm:h-12" /> {/* Spacer for labels */}
                        </div>

                        {/* Recent Grievances List */}
                        <div className="bg-[#121a28] border border-white/[0.06] rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400" /> Recent Reports
                                </h2>
                                <button 
                                    onClick={() => onNavigate('co-grievances')}
                                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                >
                                    View All <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {recentGrievances.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-4">No recent grievances.</p>
                                ) : (
                                    recentGrievances.map(g => (
                                        <div key={g.id} className="p-4 rounded-2xl bg-[#1a2538] border border-white/[0.04] hover:border-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getStatusColor(g.status)}`}>
                                                        {g.status}
                                                    </span>
                                                    {g.severity === 'Critical' && <span className="text-[9px] font-bold text-red-500 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-widest bg-red-500/10">Critical</span>}
                                                </div>
                                                <p className="text-sm font-bold text-white truncate">{g.category}</p>
                                                <p className="text-xs text-gray-400 truncate">{g.description}</p>
                                            </div>
                                            <div className="text-left sm:text-right flex-shrink-0">
                                                <p className="text-xs text-gray-300 font-medium">{g.cadetName}</p>
                                                <p className="text-[10px] text-gray-500">{g.createdAt?.toDate().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Col (1/3) */}
                    <div className="space-y-6">
                        
                        {/* Zone Status */}
                        <div className="bg-[#121a28] border border-white/[0.06] rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-gray-400" /> Camp Zone Status
                                </h2>
                                <span className="text-[9px] font-bold text-teal-500 bg-teal-500/10 px-2 py-1 rounded uppercase tracking-widest">AI Inspected</span>
                            </div>

                            <div className="space-y-3">
                                {MOCK_ZONES.map(zone => (
                                    <div key={zone.id} className={`
                                        p-4 rounded-2xl border flex items-center justify-between
                                        ${zone.type === 'stable' ? 'bg-[#1a2538] border-teal-500/20' : ''}
                                        ${zone.type === 'warning' ? 'bg-[#1a2538] border-yellow-500/20' : ''}
                                        ${zone.type === 'critical' ? 'bg-[#1a2538] border-red-500/30' : ''}
                                    `}>
                                        <div>
                                            <p className="text-sm font-bold text-white mb-0.5">{zone.name}</p>
                                            <p className="text-xs text-gray-500">Wellbeing Score: {zone.score}/5.0</p>
                                        </div>
                                        <div className={`
                                            flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border
                                            ${zone.type === 'stable' ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : ''}
                                            ${zone.type === 'warning' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' : ''}
                                            ${zone.type === 'critical' ? 'text-red-500 bg-red-500/10 border-red-500/20' : ''}
                                        `}>
                                            {zone.type === 'stable' && <CheckCircle className="w-3.5 h-3.5" />}
                                            {zone.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
                                            {zone.type === 'critical' && <ShieldAlert className="w-3.5 h-3.5" />}
                                            {zone.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-[#121a28] border border-white/[0.06] rounded-3xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <button onClick={() => onNavigate('co-tasks')} className="w-full p-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 text-sm font-bold transition-colors flex items-center justify-between group">
                                    Assign Task <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => onNavigate('co-announcements')} className="w-full p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-sm font-bold transition-colors flex items-center justify-between group">
                                    Post Announcement <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => onNavigate('co-grievances')} className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-bold transition-colors flex items-center justify-between group">
                                    View Grievances <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CODashboard;
