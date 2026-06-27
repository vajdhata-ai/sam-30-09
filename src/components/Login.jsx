import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import { Shield, Star, Anchor, X, Map, Crosshair, ChevronRight } from './Icons';

const Login = ({ onSwitchToSignup }) => {
    const [error, setError] = useState('');
    const { loginWithCredentials } = useAuth();
    const { isDark, setTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [regNumber, setRegNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('cadet'); // 'cadet' or 'co'
    const [selectedWing, setSelectedWing] = useState('army'); // 'army', 'navy', 'airforce'
    
    const cardRef = useRef(null);

    // Update theme when wing changes
    useEffect(() => {
        if (selectedWing === 'army') setTheme(THEMES.OLIVE);
        if (selectedWing === 'navy') setTheme(THEMES.NAVY);
        if (selectedWing === 'airforce') setTheme(THEMES.NIGHT_OPS); // Or a specific Air Force theme if added
    }, [selectedWing, setTheme]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
        }
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await loginWithCredentials(regNumber, password, role);
            // We pass wing/cert/battalion to userProfile via AuthContext defaults if new user
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to sign in. Please check your credentials.');
            setLoading(false);
        }
    };

    // Wing data for selector
    const wings = [
        { id: 'army', name: 'Army Wing', icon: Crosshair, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
        { id: 'navy', name: 'Naval Wing', icon: Anchor, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
        { id: 'airforce', name: 'Air Wing', icon: Map, color: 'text-sky-300', bg: 'bg-sky-300/10', border: 'border-sky-300/30' }
    ];

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-theme-bg font-sans">
            {/* Military Camo/Topographic Background Element */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(var(--theme-primary), 1) 1px, transparent 0)',
                backgroundSize: '32px 32px'
            }}></div>

            {/* Ambient Lighting */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-secondary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            {/* 3D Tilt Card */}
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full max-w-[480px] relative z-10 transition-transform duration-500 ease-out"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Glow behind card */}
                <div className="absolute -inset-1 rounded-[32px] blur-xl opacity-30 animate-pulse bg-gradient-to-r from-theme-primary to-theme-secondary" />

                {/* Card Main */}
                <div className="relative p-8 md:p-10 rounded-[32px] border shadow-2xl bg-theme-surface/90 backdrop-blur-2xl border-theme-border flex flex-col items-center">
                    
                    {/* NCC Tricolor Accent Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 flex rounded-t-[32px] overflow-hidden">
                        <div className="flex-1 bg-[#800000]"></div> {/* Maroon - Army */}
                        <div className="flex-1 bg-[#000080]"></div> {/* Navy Blue - Navy */}
                        <div className="flex-1 bg-[#87CEEB]"></div> {/* Sky Blue - Air Force */}
                    </div>

                    {/* Logo Area */}
                    <div className="w-20 h-20 rounded-2xl bg-theme-bg border border-theme-border flex items-center justify-center mb-6 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-theme-primary/10 group-hover:bg-theme-primary/20 transition-colors"></div>
                        <Shield className="w-10 h-10 text-theme-primary" />
                    </div>

                    <h1 className="text-3xl font-black uppercase tracking-widest text-theme-text mb-1 text-center">
                        National Cadet Corps
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-theme-primary mb-2">
                        Training Command Portal
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-theme-muted mb-8 italic">
                        "Unity and Discipline" (एकता और अनुशासन)
                    </p>

                    {error && (
                        <div className="mb-6 w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
                            <X className="w-4 h-4 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="w-full space-y-5">
                        
                        {/* Wing Selector */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-theme-muted block ml-1">Select Wing</label>
                            <div className="grid grid-cols-3 gap-2">
                                {wings.map(wing => {
                                    const Icon = wing.icon;
                                    const isSelected = selectedWing === wing.id;
                                    return (
                                        <button
                                            key={wing.id}
                                            type="button"
                                            onClick={() => setSelectedWing(wing.id)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                                isSelected 
                                                ? `${wing.bg} ${wing.border} scale-105 shadow-lg` 
                                                : 'bg-theme-bg border-theme-border opacity-70 hover:opacity-100 hover:border-theme-primary/50'
                                            }`}
                                        >
                                            <Icon className={`w-6 h-6 mb-1.5 ${isSelected ? wing.color : 'text-theme-muted'}`} />
                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? wing.color : 'text-theme-text'}`}>
                                                {wing.name.replace(' Wing', '')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Role Toggle */}
                        <div className="flex p-1 bg-theme-bg rounded-xl border border-theme-border mt-4">
                            <button
                                type="button"
                                onClick={() => setRole('cadet')}
                                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                                    role === 'cadet' ? 'bg-theme-primary text-theme-bg shadow-md' : 'text-theme-muted hover:text-theme-text'
                                }`}
                            >
                                Cadet
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('co')}
                                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                                    role === 'co' ? 'bg-theme-primary text-theme-bg shadow-md' : 'text-theme-muted hover:text-theme-text'
                                }`}
                            >
                                Officer (CO)
                            </button>
                        </div>

                        {/* Credentials */}
                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-theme-muted block ml-1 mb-1.5">
                                    {role === 'cadet' ? 'Regimental Number' : 'Officer ID'}
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={regNumber}
                                        onChange={(e) => setRegNumber(e.target.value)}
                                        placeholder={role === 'cadet' ? "e.g. DL/22/SDA/100452" : "e.g. NCC-OFF-001"}
                                        className="w-full bg-theme-bg border border-theme-border rounded-xl pl-4 pr-10 py-3.5 text-theme-text text-sm font-medium outline-none focus:border-theme-primary focus:shadow-[0_0_15px_rgba(var(--theme-primary),0.15)] transition-all uppercase"
                                    />
                                    {regNumber && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-theme-muted block ml-1 mb-1.5">Access Code</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your security code"
                                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-3.5 text-theme-text text-sm font-medium outline-none focus:border-theme-primary focus:shadow-[0_0_15px_rgba(var(--theme-primary),0.15)] transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !regNumber || !password}
                            className="w-full flex items-center justify-center gap-3 py-4 mt-6 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-theme-primary text-theme-bg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(var(--theme-primary),0.4)]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-theme-bg/30 border-t-theme-bg rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-8 pt-6 w-full border-t border-theme-border flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-theme-muted">
                        <Shield className="w-3 h-3" />
                        <span>Secure Military Network</span>
                    </div>

                    <div className="mt-4 text-center text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                        First time cadet?{' '}
                        <button type="button" onClick={onSwitchToSignup} className="text-theme-primary hover:underline underline-offset-4 ml-1 ">
                            Enlist Here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
