import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAssistant } from '../contexts/AssistantContext';
import { usePerformance } from '../contexts/PerformanceContext';
import { Bot, FileText, LogOut, Moon, Sun, ChevronRight, ChevronLeft, GraduationCap, FilePlus, ClipboardList, Mic, Sparkles, AuremLogo, Crown, Eye, Settings, RefreshCw, Video, Trophy, Swords, Flame, Info, Youtube, Search, BookOpen, ShieldAlert, Home } from './Icons';

const Sidebar = ({ currentView, setCurrentView, isSidebarOpen, setIsSidebarOpen, isCollapsed, setIsCollapsed, user, onLogin, onLogout }) => {
    const { isDark } = useTheme();
    const { tier, isPro, isDevMode, triggerUpgradeModal } = useSubscription();
    const { speak } = useAssistant();
    const { getLevelInfo } = usePerformance();
    const levelInfo = getLevelInfo();

    const navGroups = [
        {
            title: "Core Training",
            items: [
                { id: 'cadet-dashboard', label: 'Dashboard', icon: Home },
                { id: 'cadet-handbook', label: 'Cadet Handbook', icon: BookOpen },
                { id: 'exam-prep', label: 'B & C Cert Prep', icon: Trophy },
                { id: 'quiz-assessment', label: 'Adaptive Testing', icon: ClipboardList },
            ]
        },
        {
            title: "AI Intelligence",
            items: [
                { id: 'doubt-solver', label: 'Neural Query', icon: Bot },
                { id: 'document-study', label: 'Samvada Lens', icon: Eye },
                { id: 'podcast-generator', label: 'Audio Studio', icon: Mic },
                { id: 'video-generator', label: 'Video Studio', icon: Video },
            ]
        },
        {
            title: "Cadet Welfare",
            items: [
                { id: 'neural-arena', label: 'Cognitive Colosseum', icon: Swords },
                { id: 'quartermaster', label: 'Quartermaster', icon: FilePlus },
                { id: 'grievance-portal', label: 'Samvada Shield', icon: ShieldAlert },
            ]
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed md:relative z-50 h-full md:h-[96vh] md:my-[2vh] ml-0 md:ml-[2vh]
                transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform
                ${isCollapsed ? 'w-[68px]' : 'w-[240px]'}
                ${isSidebarOpen ? 'translate-x-0 translate-z-0 left-0' : '-translate-x-full md:translate-x-0 translate-z-0'}
            `}>
                <div className="h-full flex flex-col rounded-[32px] transition-all duration-300 border border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.2)] relative overflow-hidden">

                    {/* ═══ Header / Logo ═══ */}
                    <div className="p-5 pb-4 flex items-center justify-between">
                        {!isCollapsed && (
                            <div className="flex items-center gap-3 animate-fade-in">
                                <div className="relative">
                                    <div className="p-2.5 bg-theme-primary/10 border border-theme-primary/20 rounded-2xl border-glow-rotate">
                                        <AuremLogo className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <span className="font-serif italic font-light text-2xl tracking-wide text-theme-text select-none">
                                        <span className="text-[#c9a55a]">Samvada</span>
                                    </span>
                                    <p className="text-[9px] font-medium text-theme-muted mt-1 tracking-[0.2em] uppercase select-none">NCC Portal</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`p-2 rounded-xl transition-colors duration-200 text-theme-muted hover:text-theme-primary hover:bg-theme-surface/50 cursor-none
                                ${isCollapsed ? 'mx-auto' : ''}
                            `}
                        >
                            {isCollapsed
                                ? <ChevronRight className="w-4 h-4" />
                                : <ChevronLeft className="w-4 h-4" />
                            }
                        </button>
                    </div>

                    {/* ═══ Gamification Widget ═══ */}
                    {!isCollapsed && (
                        <div className="px-5 pb-4">
                            <div className="bg-theme-surface/50 border border-theme-primary/10 rounded-2xl p-3 flex flex-col gap-2 relative group shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] holo-shimmer">
                                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                                    <div className="absolute -top-2 -right-2 p-2 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                        <Crown className="w-16 h-16 text-theme-primary transform rotate-12" />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-theme-primary to-theme-secondary flex items-center justify-center text-theme-bg font-black text-xs shadow-[0_0_15px_rgba(201,165,90,0.4)]">
                                            {levelInfo.level}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 group/tooltip cursor-help relative">
                                                <p className="text-[10px] uppercase tracking-widest text-theme-primary font-bold">{levelInfo.rankTitle}</p>
                                                <Info className="w-[10px] h-[10px] text-theme-muted hover:text-theme-primary transition-colors" />
                                                
                                                {/* Tooltip */}
                                                <div className="absolute left-0 top-full mt-2 w-48 p-3 rounded-xl bg-theme-surface border border-theme-primary/20 shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50 backdrop-blur-xl translate-y-1 group-hover/tooltip:translate-y-0">
                                                    <p className="text-[10px] font-bold text-theme-primary uppercase tracking-widest mb-1">Rank Guide</p>
                                                    <p className="text-[10px] text-theme-text font-medium mb-1.5">Improve your rank by:</p>
                                                    <ul className="text-[9px] text-theme-muted space-y-1 ml-2 list-disc">
                                                        <li>Winning Cognitive Colosseum matches</li>
                                                        <li>Completing Adaptive Tests</li>
                                                        <li>Maintaining a daily study streak</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <p className="text-xs font-medium text-theme-text">{levelInfo.xp} XP</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md border border-orange-400/20">
                                        <Flame className="w-3 h-3" />
                                        <span className="text-[10px] font-black">1</span>
                                    </div>
                                </div>

                                <div className="relative h-1.5 w-full bg-theme-bg rounded-full overflow-hidden mt-1 z-10">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full shadow-[0_0_10px_rgba(201,165,90,0.8)]"
                                        style={{ width: `${levelInfo.progressPercentage}%` }}
                                    />
                                </div>
                                <p className="text-[9px] text-theme-muted uppercase tracking-widest text-right z-10">
                                    {Math.round(levelInfo.progressPercentage)}% to Lvl {levelInfo.level + 1}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ═══ Navigation ═══ */}
                    <nav className="flex-1 px-3 space-y-4 overflow-y-auto custom-scrollbar">

                        {/* Universal Search Button */}
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-universal-search'))}
                            className={`
                                w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-300 group relative cursor-none mt-2
                                text-theme-primary bg-theme-primary/5 hover:bg-theme-primary/10 border border-theme-primary/20
                                ${isCollapsed ? 'justify-center px-0' : ''}
                            `}
                        >
                            <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                <Search className="w-[18px] h-[18px]" />
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 flex justify-between items-center">
                                    <span className="font-bold text-[13px] truncate">Universal Search</span>
                                    <div className="hidden md:flex items-center gap-1 text-[9px] font-bold text-theme-primary/60 bg-theme-primary/10 px-1.5 py-0.5 rounded uppercase">
                                        CTRL K
                                    </div>
                                </div>
                            )}
                        </button>

                        {navGroups.map((group, groupIdx) => (
                            <div key={groupIdx} className="space-y-1">
                                {!isCollapsed && (
                                    <p className="px-3 py-1.5 text-[9px] font-bold tracking-[0.15em] uppercase text-theme-primary opacity-80 mt-2">
                                        {group.title}
                                    </p>
                                )}
                                {group.items.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = currentView === item.id;

                                    return (
                                        <button
                                            key={item.id}
                                            title={item.label}
                                            onClick={() => {
                                                setCurrentView(item.id);
                                                if (item.id === 'doubt-solver') speak(null, 'nav_doubt');
                                                else if (item.id === 'neural-arena') speak(null, 'nav_arena');
                                                else speak(null, 'default_click');

                                                setIsSidebarOpen(false);
                                                if (window.innerWidth >= 768) {
                                                    setIsCollapsed(true);
                                                }
                                            }}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                            className={`
                                                w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-300 group relative cursor-none
                                                ${isActive
                                                    ? 'bg-theme-primary/10 text-theme-primary border border-theme-primary/20 nav-active-glow'
                                                    : 'text-theme-muted hover:text-theme-text hover:bg-theme-surface/50 border border-transparent hover:shadow-[0_0_20px_rgba(var(--theme-primary),0.05)]'
                                                }
                                                ${isCollapsed ? 'justify-center px-0' : ''}
                                            `}
                                        >
                                            <div className={`
                                                flex-shrink-0 transition-transform duration-300
                                                ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                                            `}>
                                                <Icon className="w-[18px] h-[18px]" />
                                            </div>

                                            {!isCollapsed && (
                                                <>
                                                    <span className="font-medium text-[13px] truncate">{item.label}</span>
                                                    {!isActive && (
                                                        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-200" />
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>

                    {/* ═══ Footer Actions ═══ */}
                    <div className="p-3 space-y-1.5 border-t border-theme-border">
                        {/* Settings */}
                        <button
                            title="Settings"
                            onClick={() => setCurrentView('settings')}
                            className={`w-full p-2.5 rounded-xl flex items-center gap-3 transition-colors duration-200 cursor-none
                                ${currentView === 'settings'
                                    ? 'bg-theme-surface text-theme-primary'
                                    : 'text-theme-muted hover:text-theme-secondary hover:bg-theme-surface/50'
                                }
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                        >
                            <Settings className="w-[18px] h-[18px]" />
                            {!isCollapsed && <span className="text-[13px] font-medium">Settings</span>}
                        </button>

                        {/* Theme Toggle Removed */}



                        {/* User Profile */}
                        <div className={`flex items-center gap-3 p-2.5 rounded-xl border border-theme-border mt-1
                            bg-theme-surface
                            ${isCollapsed ? 'justify-center' : ''}
                        `}>
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary font-serif italic text-sm shadow-md">
                                    {user?.displayName ? user.displayName[0].toUpperCase() : '?'}
                                </div>
                                {/* Online indicator */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#4ade80] rounded-full border border-[var(--surface)]" />
                            </div>

                            {!isCollapsed && (
                                <>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-medium tracking-wide truncate text-theme-text">
                                            {user?.displayName || 'User'}
                                        </p>
                                        <p className="text-[9px] text-theme-muted truncate uppercase tracking-widest mt-0.5">
                                            {user?.email || 'STUDENT'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="p-1.5 rounded-lg transition-colors duration-200 text-theme-muted hover:text-theme-primary hover:bg-theme-primary/10 cursor-none"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
