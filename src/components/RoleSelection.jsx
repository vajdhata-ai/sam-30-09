import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Star, Key, Loader2, Crown, Crosshair, Anchor, Map } from './Icons';

const RoleSelection = ({ onComplete }) => {
    const { assignRole, updateProfile } = useAuth();
    const [selectedRole, setSelectedRole] = useState(null);
    const [accessCode, setAccessCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Cadet specific fields
    const [wing, setWing] = useState('army');
    const [certificateLevel, setCertificateLevel] = useState('B');

    const handleRoleSelect = async (role) => {
        if (role === 'co' && selectedRole !== 'co') {
            setSelectedRole('co');
            setError('');
            return;
        }

        if (role === 'cadet' && selectedRole !== 'cadet') {
            setSelectedRole('cadet');
            setError('');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await assignRole(role, role === 'co' ? accessCode : null);
            
            // Also ensure we have a profile for legacy users
            if (role === 'cadet') {
                await updateProfile({
                    wing,
                    certificateLevel,
                    rank: 'Cadet'
                });
            } else {
                await updateProfile({
                    rank: 'Lieutenant'
                });
            }

            onComplete();
        } catch (err) {
            setError(err.message || "Failed to assign role. Please try again.");
            setIsLoading(false);
        }
    };

    const wings = [
        { id: 'army', name: 'Army', icon: Crosshair, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
        { id: 'navy', name: 'Navy', icon: Anchor, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
        { id: 'airforce', name: 'Air', icon: Map, color: 'text-sky-300', bg: 'bg-sky-300/10', border: 'border-sky-300/30' }
    ];

    return (
        <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(var(--theme-primary), 1) 1px, transparent 0)',
                backgroundSize: '32px 32px'
            }} />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-primary/10 rounded-full blur-[120px] mix-blend-screen" />
            
            <div className="max-w-4xl w-full z-10 animate-fade-in flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-theme-text mb-4">
                        Identify Your Assignment
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-wider text-theme-muted max-w-2xl mx-auto">
                        Please confirm your role and unit details to access the appropriate dashboard.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {/* Cadet Card */}
                    <div 
                        onClick={() => { if (selectedRole !== 'cadet') setSelectedRole('cadet'); }}
                        className={`
                            group relative p-8 rounded-[32px] cursor-pointer transition-all duration-500 overflow-hidden
                            border-2 bg-theme-surface/80 backdrop-blur-xl
                            ${selectedRole === 'cadet' ? 'border-theme-primary shadow-[0_0_40px_rgba(var(--theme-primary),0.2)]' : 'border-theme-border hover:border-theme-primary/50'}
                        `}
                    >
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-theme-primary/10 flex items-center justify-center mb-6">
                                <Shield className="w-8 h-8 text-theme-primary" />
                            </div>
                            <h2 className="text-2xl font-black text-theme-text mb-2 uppercase tracking-widest">NCC Cadet</h2>
                            
                            {selectedRole !== 'cadet' && (
                                <p className="text-theme-muted text-sm font-medium mt-2">
                                    Click to select your Wing and Certificate Level.
                                </p>
                            )}

                            {selectedRole === 'cadet' && (
                                <div className="space-y-6 mt-6 animate-slide-up" onClick={e => e.stopPropagation()}>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2 ml-1">Select Wing</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {wings.map(w => {
                                                const Icon = w.icon;
                                                const isSelected = wing === w.id;
                                                return (
                                                    <button
                                                        key={w.id}
                                                        type="button"
                                                        onClick={() => setWing(w.id)}
                                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                                            isSelected ? `${w.bg} ${w.border} shadow-md` : 'bg-theme-bg border-theme-border opacity-70'
                                                        }`}
                                                    >
                                                        <Icon className={`w-5 h-5 mb-1 ${isSelected ? w.color : 'text-theme-muted'}`} />
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? w.color : 'text-theme-text'}`}>{w.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2 ml-1">Certificate Level</label>
                                        <div className="flex bg-theme-bg rounded-xl border border-theme-border p-1">
                                            {['A', 'B', 'C'].map(level => (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() => setCertificateLevel(level)}
                                                    className={`flex-1 py-2 text-xs font-black transition-all rounded-lg ${
                                                        certificateLevel === level ? 'bg-theme-primary text-theme-bg' : 'text-theme-muted hover:text-theme-text'
                                                    }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRoleSelect('cadet')}
                                        disabled={isLoading}
                                        className="w-full py-4 bg-theme-primary text-theme-bg rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Cadet Profile'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CO Card */}
                    <div 
                        onClick={() => setSelectedRole('co')}
                        className={`
                            group relative p-8 rounded-[32px] cursor-pointer transition-all duration-500 overflow-hidden
                            border-2 bg-theme-surface/80 backdrop-blur-xl
                            ${selectedRole === 'co' ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : 'border-theme-border hover:border-blue-500/50'}
                        `}
                    >
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                                <Crown className="w-8 h-8 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-black text-theme-text mb-2 uppercase tracking-widest">Commanding Officer</h2>
                            
                            {selectedRole !== 'co' && (
                                <p className="text-theme-muted text-sm font-medium mt-2">
                                    Click to authenticate with your CO Security Code.
                                </p>
                            )}

                            {selectedRole === 'co' && (
                                <div className="space-y-4 mt-6 animate-slide-up" onClick={e => e.stopPropagation()}>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2 ml-1">Access Code</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Key className="h-4 w-4 text-theme-muted" />
                                            </div>
                                            <input
                                                type="password"
                                                value={accessCode}
                                                onChange={(e) => { setAccessCode(e.target.value); setError(''); }}
                                                placeholder="Enter security code"
                                                className="w-full pl-11 pr-4 py-3 bg-theme-bg border border-theme-border rounded-xl focus:outline-none focus:border-blue-500 text-theme-text text-sm font-medium"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRoleSelect('co')}
                                        disabled={!accessCode || isLoading}
                                        className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-colors disabled:opacity-50 flex justify-center items-center"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate as CO'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-8 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-wider animate-shake">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoleSelection;
