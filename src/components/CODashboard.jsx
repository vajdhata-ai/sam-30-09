import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, getDocs, where } from 'firebase/firestore';
import { ShieldAlert, CheckCircle, Clock, AlertTriangle, Users, TrendingUp, ChevronRight, Activity, BarChart, Shield, Target } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const CODashboard = ({ onNavigate }) => {
    const { isDark } = useTheme();
    const { userProfile, currentUser } = useAuth();
    const [grievances, setGrievances] = useState([]);
    const [stats, setStats] = useState({
        totalCadets: 0,
        unresolved: 0,
        escalations: 0,
        avgPerformance: 0
    });
    const [categoryCounts, setCategoryCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userProfile) return;

        const fetchInitialData = async () => {
            try {
                // Fetch Total Cadets (only for CO's wing)
                const qUsers = query(collection(db, 'users'), where('role', '==', 'cadet'), where('wing', '==', userProfile.wing || 'army'));
                const usersSnap = await getDocs(qUsers);
                const cadetsCount = usersSnap.size;

                // Fetch Performance Data (only for CO's wing)
                // Note: userPerformance doesn't explicitly store 'wing' currently in the database schema by default in some places, 
                // but assuming we only fetch for the UIDs of the cadets we just fetched:
                const cadetUids = usersSnap.docs.map(doc => doc.id);
                
                let totalAccuracy = 0;
                let validRecords = 0;

                if (cadetUids.length > 0) {
                    // Firebase 'in' queries are limited to 10 items. For a real app with >10 cadets, 
                    // we'd need to batch this or just fetch all and filter in memory if wing isn't on performance docs.
                    // For safety, let's fetch all userPerformance and filter by cadetUids in memory.
                    const perfSnap = await getDocs(collection(db, 'userPerformance'));
                    
                    perfSnap.forEach(doc => {
                        if (cadetUids.includes(doc.id)) {
                            const data = doc.data();
                            if (data.performanceData && data.performanceData.length > 0) {
                                const sum = data.performanceData.reduce((acc, curr) => acc + curr.score, 0);
                                totalAccuracy += (sum / data.performanceData.length);
                                validRecords++;
                            }
                        }
                    });
                }

                const avgPerformance = validRecords > 0 ? Math.round(totalAccuracy / validRecords) : 0;

                setStats(prev => ({
                    ...prev,
                    totalCadets: cadetsCount,
                    avgPerformance
                }));
            } catch (err) {
                console.error("Failed to fetch static CO stats:", err);
            }
        };

        fetchInitialData();

        // Listen to grievances in real-time scoped to wing
        const qGrievances = query(collection(db, 'grievances'), where('wing', '==', userProfile.wing || 'army'));
        const unsubscribe = onSnapshot(qGrievances, (snapshot) => {
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
            setIsLoading(false);
        }, (error) => {
            console.warn('CODashboard: Firestore listener error:', error.message);
            setGrievances([]);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userProfile]);

    const recentGrievances = grievances.slice(0, 6);
    const maxCategoryCount = Math.max(...Object.values(categoryCounts).concat([1]));

    const chartCategories = [
        { key: 'Food Quality', label: 'Food/Water', color: 'bg-cyan-500' },
        { key: 'Medical/Health', label: 'Medical', color: 'bg-rose-500' },
        { key: 'Facility/Accommodation', label: 'Facilities', color: 'bg-amber-500' },
        { key: 'Bullying/Harassment', label: 'Conduct', color: 'bg-emerald-500' },
        { key: 'Unfair Treatment', label: 'Discipline', color: 'bg-purple-500' },
        { key: 'Other', label: 'Other', color: 'bg-slate-500' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'Under Review': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Resolved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Dismissed': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-theme-bg">
                <div className="flex flex-col items-center gap-4">
                    <Shield className="w-12 h-12 text-theme-primary animate-pulse" />
                    <p className="text-sm font-black uppercase tracking-widest text-theme-muted">Decrypting Battalion Data...</p>
                </div>
            </div>
        );
    }

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-theme-bg transition-colors duration-300">
            <div className="max-w-[1600px] mx-auto animate-fade-in">
                
                {/* ═══ MASSIVE HERO (Matches Cadet Dashboard) ═══ */}
                <div className="relative overflow-hidden border-b border-theme-border bg-theme-surface">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-primary/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-theme-secondary/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
                    </div>

                    <div className="relative z-10 p-6 md:p-8 lg:p-12">
                        {/* Top Row: Badge + Division */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-primary/10 border border-theme-primary/20 w-fit">
                                <span className="w-2 h-2 rounded-full bg-theme-primary animate-pulse" />
                                <p className="text-xs font-semibold text-theme-primary tracking-[0.2em] uppercase">
                                    Command Center Active
                                </p>
                            </div>
                            <p className="text-theme-muted text-sm font-medium flex items-center gap-2 tracking-wide">
                                <ShieldAlert className="w-4 h-4 text-theme-primary/60 shrink-0" />
                                <span className="truncate">NCC • {userProfile?.battalion || '1st Battalion'} • {userProfile?.wing ? `${userProfile.wing.charAt(0).toUpperCase() + userProfile.wing.slice(1)} Wing` : 'Army Wing'}</span>
                            </p>
                        </div>

                        {/* Greeting */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-theme-text leading-[1.1] tracking-wide mb-8">
                            {greeting},<br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-primary italic md:ml-3">
                                {currentUser?.displayName?.split(' ')[0] || 'Commanding Officer'}
                            </span>
                        </h1>

                        {/* Stat Cards — responsive grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            <div className="rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 flex flex-col items-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                                <span className="text-[10px] md:text-xs font-semibold text-theme-muted uppercase tracking-[0.15em] mb-1 md:mb-1.5 text-center">Active Cadets</span>
                                <span className="text-2xl md:text-3xl font-light text-theme-text">{stats.totalCadets}</span>
                            </div>
                            <div className="rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 flex flex-col items-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                                <span className="text-[10px] md:text-xs font-semibold text-theme-muted uppercase tracking-[0.15em] mb-1 md:mb-1.5 text-center">Avg Performance</span>
                                <span className="text-2xl md:text-3xl font-light text-theme-primary">{stats.avgPerformance > 0 ? `${stats.avgPerformance}%` : 'N/A'}</span>
                            </div>
                            <div className="rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 flex flex-col items-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                                <span className="text-[10px] md:text-xs font-semibold text-theme-muted uppercase tracking-[0.15em] mb-1 md:mb-1.5 text-center">Unresolved Grievances</span>
                                <span className="text-2xl md:text-3xl font-light text-amber-500">{stats.unresolved}</span>
                            </div>
                            <div className="rounded-2xl md:rounded-3xl px-4 md:px-6 py-4 md:py-5 flex flex-col items-center border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
                                <span className="text-[10px] md:text-xs font-semibold text-theme-muted uppercase tracking-[0.15em] mb-1 md:mb-1.5 text-center">Critical Escalations</span>
                                <span className="text-2xl md:text-3xl font-light text-red-500">{stats.escalations}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-8 space-y-8">



                {/* ═══ CHARTS & RECENT ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Col (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Chart Area */}
                        <div className="bg-theme-surface border border-theme-border rounded-[32px] p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-10 border-b border-theme-border pb-6">
                                <div className="p-2.5 rounded-xl bg-theme-bg border border-theme-border">
                                    <BarChart className="w-5 h-5 text-theme-primary" />
                                </div>
                                <h2 className="text-sm font-black text-theme-text uppercase tracking-widest">Grievance Distribution</h2>
                            </div>
                            
                            <div className="relative h-56 w-full flex items-end justify-around pb-2 border-b border-theme-border">
                                {/* Horizontal grid lines */}
                                {[0.25, 0.5, 0.75, 1].map(pct => (
                                    <div key={pct} className="absolute left-0 w-full border-t border-theme-border/50 border-dashed" style={{ bottom: `${pct * 100}%` }} />
                                ))}
                                
                                {chartCategories.map(cat => {
                                    const count = categoryCounts[cat.key] || 0;
                                    const heightPct = Math.max((count / maxCategoryCount) * 100, 5); // min 5% height
                                    return (
                                        <div key={cat.key} className="flex flex-col items-center group w-14 z-10">
                                            <span className="text-xs font-black text-theme-text mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">{count}</span>
                                            <div 
                                                className={`w-full rounded-t-lg transition-all duration-500 ${cat.color} opacity-80 group-hover:opacity-100 hover:scale-105 shadow-lg`}
                                                style={{ height: `${heightPct}%` }}
                                            />
                                            <span className="absolute -bottom-10 text-[9px] font-black text-theme-muted tracking-widest text-center uppercase hidden sm:block w-24 transform -translate-x-1/2 left-1/2">
                                                {cat.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="h-12" /> {/* Spacer for labels */}
                        </div>

                        {/* Recent Grievances List */}
                        <div className="bg-theme-surface border border-theme-border rounded-[32px] p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8 border-b border-theme-border pb-6">
                                <h2 className="text-sm font-black text-theme-text uppercase tracking-widest flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-theme-bg border border-theme-border">
                                        <Clock className="w-5 h-5 text-theme-primary" />
                                    </div> 
                                    Recent Reports
                                </h2>
                                <button 
                                    onClick={() => onNavigate('co-grievances')}
                                    className="text-[10px] font-black text-theme-primary hover:text-theme-secondary uppercase tracking-widest flex items-center gap-1 bg-theme-primary/10 px-4 py-2 rounded-xl transition-colors"
                                >
                                    View Log <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentGrievances.length === 0 ? (
                                    <div className="text-center py-10 bg-theme-bg rounded-2xl border border-theme-border border-dashed">
                                        <p className="text-[10px] font-black text-theme-muted uppercase tracking-widest">No recent grievances in the battalion.</p>
                                    </div>
                                ) : (
                                    recentGrievances.map(g => (
                                        <div key={g.id} className="p-5 rounded-2xl bg-theme-bg border border-theme-border hover:border-theme-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 group">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-md border ${getStatusColor(g.status)}`}>
                                                        {g.status}
                                                    </span>
                                                    {g.severity === 'Critical' && <span className="text-[9px] font-black text-rose-500 border border-rose-500/20 px-2.5 py-1 rounded-md uppercase tracking-widest bg-rose-500/10 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Critical</span>}
                                                </div>
                                                <p className="text-sm font-bold text-theme-text truncate group-hover:text-theme-primary transition-colors">{g.category}</p>
                                                <p className="text-[11px] font-medium text-theme-muted truncate mt-1">{g.description}</p>
                                            </div>
                                            <div className="text-left sm:text-right flex-shrink-0 flex flex-col sm:items-end justify-center">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-2 h-2 rounded-full bg-theme-border"></span>
                                                    <p className="text-[11px] text-theme-text font-black uppercase tracking-widest">{g.cadetName || 'Anonymous'}</p>
                                                </div>
                                                <p className="text-[9px] font-bold text-theme-muted uppercase tracking-widest">{g.createdAt?.toDate().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Col (1/3) */}
                    <div className="space-y-6">
                        
                        {/* Quick Actions */}
                        <div className="bg-theme-surface border border-theme-border rounded-[32px] p-8 shadow-sm">
                            <h2 className="text-sm font-black text-theme-text uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-theme-border pb-6">
                                <div className="p-2.5 rounded-xl bg-theme-bg border border-theme-border">
                                    <Activity className="w-5 h-5 text-theme-primary" />
                                </div>
                                Operations
                            </h2>
                            <div className="space-y-3">
                                <button onClick={() => onNavigate('co-tasks')} className="w-full p-4 rounded-2xl bg-theme-primary/10 hover:bg-theme-primary hover:text-theme-bg text-theme-primary border border-theme-primary/20 text-xs font-black tracking-widest uppercase transition-all flex items-center justify-between group">
                                    Assign Duty <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => onNavigate('co-announcements')} className="w-full p-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-500 border border-blue-500/20 text-xs font-black tracking-widest uppercase transition-all flex items-center justify-between group">
                                    Broadcast Order <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => onNavigate('co-grievances')} className="w-full p-4 rounded-2xl bg-theme-bg hover:bg-theme-surface text-theme-text border border-theme-border text-xs font-black tracking-widest uppercase transition-all flex items-center justify-between group">
                                    Review Grievances <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                </div>

            </div>
        </div>
    );
};

export default CODashboard;
