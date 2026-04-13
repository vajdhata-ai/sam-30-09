import React, { useState } from 'react';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import { Moon, Sun, Crown, Settings as SettingsIcon, Eye, ChevronRight } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import { useAssistant } from '../contexts/AssistantContext';

// ═══════════════════════════════════
// THEME OPTION BUTTON
// ═══════════════════════════════════
const ThemeOption = ({ themeKey, colorClass, label, isDark, onClick }) => {
    const { theme } = useTheme();
    const isActive = theme === themeKey;

    return (
        <button
            onClick={onClick}
            className={`
                group relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300
                ${isActive
                    ? isDark
                        ? 'ring-2 ring-theme-primary bg-white/[0.06]'
                        : 'ring-2 ring-theme-primary bg-theme-primary/10'
                    : isDark
                        ? 'hover:bg-white/[0.04] border border-white/[0.04]'
                        : 'hover:bg-theme-primary/5 border border-theme-primary/10'
                }
            `}
        >
            <div className={`w-10 h-10 rounded-full mb-2.5 bg-gradient-to-br ${colorClass} shadow-lg group-hover:scale-110 transition-transform duration-300 relative`}>
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                )}
            </div>
            <span className={`text-[11px] font-semibold ${isActive ? 'text-theme-primary' : isDark ? 'text-theme-muted' : 'text-theme-muted'}`}>
                {label}
            </span>
        </button>
    );
};




// ═══════════════════════════════════
// SETTINGS SECTION WRAPPER
// ═══════════════════════════════════
const SettingsSection = ({ title, icon: Icon, children, isDark }) => (
    <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center mb-4 px-1">
            <div className={`p-2 rounded-xl mr-3 ${isDark ? 'bg-theme-primary/15' : 'bg-theme-primary/10'}`}>
                <Icon className="w-4 h-4 text-theme-primary" />
            </div>
            <h3 className={`text-base font-serif font-bold ${isDark ? 'text-theme-text' : 'text-theme-text'}`}>{title}</h3>
        </div>
        <div className={`p-6 rounded-3xl border backdrop-blur-sm bg-theme-surface border-theme-border shadow-depth`}>
            {children}
        </div>
    </div>
);


// ═══════════════════════════════════
// MAIN SETTINGS COMPONENT
// ═══════════════════════════════════
const Settings = () => {
    const { isDark, theme, setTheme, customColors, setCustomColors } = useTheme();
    const { currentUser, logout, deleteAccount } = useAuth();
    const { isHistoryEnabled, setHistoryEnabled } = useChatHistory();
    const { speak } = useAssistant();

    const handleThemeChange = (newTheme) => {
        if (newTheme === theme) return;
        
        speak(null, 'goodbye');

        setTimeout(() => {
            setTheme(newTheme);
        }, 1500);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await deleteAccount();
            } catch (err) {
                alert("Failed to delete account. You may need to sign in again to perform this action.");
            }
        }
    };

    return (
        <div className={`h-full overflow-y-auto custom-scrollbar p-6 md:p-10 pb-32 bg-transparent`}>
            <div className="max-w-3xl mx-auto">
                <header className="mb-10">
                    <h1 className={`text-3xl font-serif italic tracking-wide mb-1.5 text-theme-text`}>
                        Settings
                    </h1>
                    <p className="text-theme-muted text-sm uppercase tracking-widest font-bold">Customize your Auremous experience</p>
                </header>

                {/* Appearance */}
                <SettingsSection title="Appearance" icon={Eye} isDark={isDark}>
                    <div>
                        <h4 className={`font-semibold text-sm mb-4 text-theme-text`}>Aesthetic Identity</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-theme-border/50 p-4 rounded-3xl bg-theme-bg">
                            <ThemeOption themeKey={THEMES.PREMIUM} label="Premium (Gold)" colorClass="from-[#c9a55a] to-[#e0c07a]" isDark={isDark} onClick={() => handleThemeChange(THEMES.PREMIUM)} />
                            <ThemeOption themeKey={THEMES.VIBRANT} label="Vibrant (Indigo)" colorClass="from-indigo-500 to-fuchsia-500" isDark={isDark} onClick={() => handleThemeChange(THEMES.VIBRANT)} />
                            <ThemeOption themeKey={THEMES.SIMPLE} label="Simple (Minimal)" colorClass="from-zinc-400 to-zinc-600" isDark={isDark} onClick={() => handleThemeChange(THEMES.SIMPLE)} />
                            <ThemeOption themeKey={THEMES.CUSTOM} label="Custom Palette" colorClass="from-rose-500 to-teal-500" isDark={isDark} onClick={() => handleThemeChange(THEMES.CUSTOM)} />
                        </div>
                        
                        {theme === THEMES.CUSTOM && customColors && (
                            <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-theme-border/30 animate-fade-in-up">
                                <h5 className="text-theme-text text-sm font-semibold mb-4">Edit Custom Colors</h5>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                    {Object.keys(customColors).map(key => (
                                        <div key={key} className="flex flex-col gap-2">
                                            <span className="text-xs text-theme-muted uppercase tracking-wider font-medium">{key}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-md ring-1 ring-white/10 shrink-0">
                                                    <input 
                                                        type="color" 
                                                        value={customColors[key]} 
                                                        onChange={e => setCustomColors({ ...customColors, [key]: e.target.value })}
                                                        className="absolute -top-2 -left-2 w-16 h-16 cursor-crosshair border-0 outline-none"
                                                    />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={customColors[key]} 
                                                    onChange={e => setCustomColors({ ...customColors, [key]: e.target.value })}
                                                    className="bg-theme-surface/50 border border-theme-border/30 rounded-lg px-2 py-1.5 text-xs text-theme-text w-full uppercase focus:outline-none focus:border-theme-primary/50 font-mono tracking-wider"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </SettingsSection>

                {/* Account */}
                <SettingsSection title="Account" icon={Crown} isDark={isDark}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-2xl bg-theme-primary flex items-center justify-center text-theme-bg font-bold text-lg mr-4 shadow-lg shadow-theme-primary/20">
                                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h4 className={`font-semibold text-sm text-theme-text`}>
                                    {currentUser?.displayName || 'User'}
                                </h4>
                                <p className="text-xs text-theme-muted">{currentUser?.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={logout}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-theme-bg bg-theme-primary hover:bg-theme-secondary hover:-translate-y-0.5`}
                            >
                                Sign Out
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-red-500 hover:bg-red-500/10 border border-red-500/20 hover:-translate-y-0.5`}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </SettingsSection>

                {/* Privacy */}
                <SettingsSection title="Privacy & Data" icon={Eye} isDark={isDark}>
                    <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                            <h4 className="font-semibold text-sm text-theme-text mb-1">Save Chat History</h4>
                            <p className="text-xs text-theme-muted leading-relaxed">
                                Keep a record of your study sessions. Turning this off immediately clears past chats to ensure absolute privacy.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={isHistoryEnabled}
                                onChange={(e) => setHistoryEnabled(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-theme-primary/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-primary"></div>
                        </label>
                    </div>
                </SettingsSection>

                {/* Wake Up Aura */}
                <SettingsSection title="Aura Guide" icon={Eye} isDark={isDark}>
                    <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                            <h4 className="font-semibold text-sm text-theme-text mb-1">Wake Up Aura 🤖💤</h4>
                            <p className="text-xs text-theme-muted leading-relaxed">
                                Aura fell asleep after showing you around. Poke her awake for another tour — she won't be mad, probably. She lives for this stuff.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.setItem('showOnboarding', 'true');
                                window.location.reload();
                            }}
                            className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                        >
                            🫵 Wake Her Up
                        </button>
                    </div>
                </SettingsSection>

                {/* About */}
                <SettingsSection title="About" icon={SettingsIcon} isDark={isDark}>
                    <div className="space-y-3 text-sm">
                        <div className={`flex justify-between items-center py-2.5 border-b border-theme-border`}>
                            <span className="text-theme-muted">Version</span>
                            <span className={`font-mono text-xs text-theme-text`}>v2.0.0 (Luminary)</span>
                        </div>
                        <div className={`flex justify-between items-center py-2.5 border-b border-theme-border`}>
                            <span className="text-theme-muted">Build</span>
                            <span className={`font-mono text-xs text-theme-text`}>Production</span>
                        </div>
                        <div className="pt-2">
                            <p className="text-theme-muted text-xs">© 2026 Auremous EdTech. All rights reserved.</p>
                        </div>
                    </div>
                </SettingsSection>
            </div>


        </div>
    );
};

export default Settings;
