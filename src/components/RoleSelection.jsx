import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Star, Key, Loader2, Crown } from './Icons';

const RoleSelection = ({ onComplete }) => {
    const { assignRole } = useAuth();
    const [selectedRole, setSelectedRole] = useState(null);
    const [accessCode, setAccessCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRoleSelect = async (role) => {
        if (role === 'co' && selectedRole !== 'co') {
            setSelectedRole('co');
            setError('');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await assignRole(role, role === 'co' ? accessCode : null);
            onComplete();
        } catch (err) {
            setError(err.message || "Failed to assign role. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-primary/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-secondary/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="max-w-4xl w-full z-10 animate-fade-in flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-theme-text mb-4 tracking-tight">
                        Identify Your Role
                    </h1>
                    <p className="text-lg text-theme-muted max-w-2xl mx-auto">
                        Welcome to Samvada. Please select your designation to access the appropriate dashboard and tools.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
                    {/* Cadet Card */}
                    <div 
                        onClick={() => handleRoleSelect('cadet')}
                        className={`
                            group relative p-8 rounded-[32px] cursor-pointer transition-all duration-500 overflow-hidden
                            border-2 bg-theme-surface/80 backdrop-blur-xl
                            ${selectedRole === 'cadet' ? 'border-theme-primary shadow-[0_0_40px_rgba(var(--theme-primary),0.2)]' : 'border-theme-border hover:border-theme-primary/50'}
                        `}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <Shield className="w-32 h-32 text-theme-primary" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-theme-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Shield className="w-8 h-8 text-theme-primary" />
                            </div>
                            <h2 className="text-2xl font-black text-theme-text mb-2">NCC Cadet</h2>
                            <p className="text-theme-muted leading-relaxed">
                                Access study materials, cognitive arenas, rank progressions, and your personal exam preparation dashboard.
                            </p>
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
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <Star className="w-32 h-32 text-blue-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Crown className="w-8 h-8 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-black text-theme-text mb-2">Commanding Officer</h2>
                            <p className="text-theme-muted leading-relaxed mb-6">
                                Access the command portal to review cadet grievances, monitor analytics, and manage battalion operations.
                            </p>

                            {selectedRole === 'co' && (
                                <div className="space-y-4 animate-slide-up" onClick={e => e.stopPropagation()}>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-theme-muted" />
                                        </div>
                                        <input
                                            type="password"
                                            value={accessCode}
                                            onChange={(e) => {
                                                setAccessCode(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="Enter CO Access Code"
                                            className="w-full pl-11 pr-4 py-3 bg-theme-bg border border-theme-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-theme-text"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleRoleSelect('co')}
                                        disabled={!accessCode || isLoading}
                                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate as CO'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-8 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-medium animate-shake">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoleSelection;
