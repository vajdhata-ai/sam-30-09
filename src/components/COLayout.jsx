import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CODashboard from './CODashboard';
import COGrievanceView from './COGrievanceView';
import COTaskManager from './COTaskManager';
import COAnnouncementsView from './COAnnouncementsView';
import ErrorBoundary from './ErrorBoundary';
import {
    BarChart, ShieldAlert, ClipboardList, Users, Megaphone, Settings,
    ChevronRight, ChevronLeft, LogOut, Menu, X, AuremLogo
} from './Icons';

const CO_NAV = [
    { id: 'co-dashboard', label: 'Command Center', icon: BarChart },
    { id: 'co-grievances', label: 'Grievance Queue', icon: ShieldAlert },
    { id: 'co-tasks', label: 'Task Manager', icon: ClipboardList },
    { id: 'co-announcements', label: 'Announcements', icon: Megaphone },
];

const COLayout = () => {
    const { currentUser, logout } = useAuth();
    const [currentView, setCurrentView] = useState('co-dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false); // collapsed by default
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);

    const renderContent = () => {
        switch (currentView) {
            case 'co-dashboard':
                return <CODashboard onNavigate={setCurrentView} />;
            case 'co-grievances':
                return <COGrievanceView />;
            case 'co-tasks':
                return <COTaskManager />;
            case 'co-announcements':
                return <COAnnouncementsView />;
            default:
                return <CODashboard onNavigate={setCurrentView} />;
        }
    };

    const getViewTitle = () => {
        const item = CO_NAV.find(n => n.id === currentView);
        return item?.label || 'Command Center';
    };

    const coInitial = currentUser?.displayName?.[0]?.toUpperCase() || 'CO';
    const coName = currentUser?.displayName || 'Commanding Officer';

    return (
        <div className="w-full h-[100dvh] overflow-hidden bg-[#080c14] text-gray-100 flex font-sans">

            {/* ═══ Mobile Overlay ═══ */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* ═══ Sidebar ═══ */}
            <aside className={`
                fixed md:relative z-50 h-full
                transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${sidebarOpen ? 'w-[220px]' : 'w-[68px]'}
                ${mobileSidebarOpen ? 'translate-x-0 left-0' : '-translate-x-full md:translate-x-0'}
                flex-shrink-0
            `}>
                <div className="h-full flex flex-col bg-[#0a0f1a] border-r border-white/[0.06]">

                    {/* Sidebar Header */}
                    <div className="p-4 flex items-center justify-between border-b border-white/[0.06] min-h-[64px]">
                        {sidebarOpen && (
                            <div className="flex items-center gap-2.5 animate-fade-in">
                                <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                    <AuremLogo className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="font-black text-sm tracking-wide text-white block leading-tight">SAMVADA</span>
                                    <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-emerald-400/80">COMMAND</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors ${!sidebarOpen ? 'mx-auto' : ''}`}
                        >
                            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-4 px-2 space-y-1">
                        {CO_NAV.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    title={item.label}
                                    onClick={() => {
                                        setCurrentView(item.id);
                                        setMobileSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 group relative
                                        ${isActive
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] border border-transparent'
                                        }
                                        ${!sidebarOpen ? 'justify-center px-0' : ''}
                                    `}
                                >
                                    {/* Active indicator bar */}
                                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-400 rounded-r-full" />}
                                    <div className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                        <Icon className="w-[18px] h-[18px]" />
                                    </div>
                                    {sidebarOpen && (
                                        <span className="font-medium text-[13px] truncate">{item.label}</span>
                                    )}

                                    {/* Collapsed tooltip */}
                                    {!sidebarOpen && (
                                        <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a2030] border border-white/10 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
                                            {item.label}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-3 border-t border-white/[0.06] space-y-2">
                        <button
                            onClick={logout}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
                            title="Sign Out"
                        >
                            <LogOut className="w-[18px] h-[18px]" />
                            {sidebarOpen && <span className="text-[13px] font-medium">Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* ═══ Main Content Area ═══ */}
            <div className="flex-1 flex flex-col h-full min-w-0">

                {/* Top Header */}
                <header className="h-[64px] flex items-center justify-between px-4 md:px-6 border-b border-white/[0.06] bg-[#0a0f1a]/80 backdrop-blur-xl flex-shrink-0 z-30">
                    {/* Left: Mobile menu + Title */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden md:flex items-center gap-3">
                            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <AuremLogo className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="font-black text-sm tracking-wide text-white leading-tight">SAMVADA COMMAND</h1>
                                <p className="text-[9px] text-gray-500 tracking-[0.1em] uppercase">1st Delhi Battalion | NCC Camp New Delhi</p>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <h1 className="font-black text-sm text-white">{getViewTitle()}</h1>
                        </div>
                    </div>

                    {/* Center: Live Syncing */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        <span className="text-xs font-medium">Live Syncing</span>
                    </div>

                    {/* Right: Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileDropdown(!profileDropdown)}
                            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xs shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                                {coInitial}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-white leading-tight">{coName}</p>
                                <p className="text-[9px] text-emerald-400/80 uppercase tracking-widest font-bold">Commanding Officer</p>
                            </div>
                            <ChevronRight className={`hidden md:block w-4 h-4 text-gray-500 transition-transform duration-200 ${profileDropdown ? 'rotate-90' : ''}`} />
                        </button>

                        {/* Profile Dropdown */}
                        {profileDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setProfileDropdown(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#121a28] border border-white/10 rounded-xl shadow-2xl z-50 py-1.5 animate-fade-in-down">
                                    <div className="px-4 py-3 border-b border-white/[0.06]">
                                        <p className="text-sm font-bold text-white truncate">{coName}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{currentUser?.email}</p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-hidden">
                    <ErrorBoundary>
                        <div key={currentView} className="h-full animate-fade-in">
                            {renderContent()}
                        </div>
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    );
};

export default COLayout;
