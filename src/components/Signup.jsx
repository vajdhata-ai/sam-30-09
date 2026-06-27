import React, { useState, useEffect } from 'react';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Loader2, X, Crosshair, Anchor, Map, Award } from './Icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Signup = ({ onSwitchToLogin }) => {
    const { setTheme } = useTheme();
    const { loginWithCredentials } = useAuth(); // We can use this, or handle signup manually here
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // NCC Specific Fields
    const [formData, setFormData] = useState({
        regNumber: '',
        password: '',
        confirmPassword: '',
        battalion: '',
        certificateLevel: 'B',
        wing: 'army'
    });

    // Update theme based on selected wing
    useEffect(() => {
        if (formData.wing === 'army') setTheme(THEMES.OLIVE);
        if (formData.wing === 'navy') setTheme(THEMES.NAVY);
        if (formData.wing === 'airforce') setTheme(THEMES.NIGHT_OPS);
    }, [formData.wing, setTheme]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.regNumber || !formData.password || !formData.battalion) {
            setError("Please fill all mandatory fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const sanitizedReg = formData.regNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const email = `${sanitizedReg}@ncc.com`;
            
            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
            const user = userCredential.user;

            // Setup profile
            const userProfile = {
                regimentalNumber: formData.regNumber,
                wing: formData.wing,
                certificateLevel: formData.certificateLevel,
                battalion: formData.battalion,
                rank: 'Cadet',
                createdAt: new Date().toISOString()
            };

            await setDoc(doc(db, 'userRoles', user.uid), { role: 'cadet', regimentalNumber: formData.regNumber }, { merge: true });
            await setDoc(doc(db, 'userProfiles', user.uid), userProfile, { merge: true });

            // Automatically triggers auth context state change
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("This Regimental Number is already registered.");
            } else {
                setError(err.message || 'Failed to create account.');
            }
        } finally {
            setLoading(false);
        }
    };

    const wings = [
        { id: 'army', name: 'Army', icon: Crosshair, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
        { id: 'navy', name: 'Navy', icon: Anchor, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
        { id: 'airforce', name: 'Air', icon: Map, color: 'text-sky-300', bg: 'bg-sky-300/10', border: 'border-sky-300/30' }
    ];

    const inputClass = `w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-200 uppercase tracking-wide
        bg-theme-bg text-theme-text placeholder:text-theme-muted/50 border border-theme-border focus:border-theme-primary focus:shadow-[0_0_15px_rgba(var(--theme-primary),0.15)]
    `;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-theme-bg relative overflow-hidden font-sans">
            
            {/* Ambient Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(var(--theme-primary), 1) 1px, transparent 0)',
                backgroundSize: '32px 32px'
            }}></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-primary/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

            <div className="w-full max-w-[500px] p-8 md:p-10 rounded-[32px] relative z-10 border shadow-2xl bg-theme-surface/90 backdrop-blur-2xl border-theme-border flex flex-col">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-theme-border">
                    <div className="w-14 h-14 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-center shrink-0">
                        <Shield className="w-7 h-7 text-theme-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-widest text-theme-text">Enlistment</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-theme-primary mt-0.5">NCC Cadet Registration</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-xs font-medium">
                        <X className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Wing Selection */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2 ml-1">Select Wing</label>
                        <div className="grid grid-cols-3 gap-3">
                            {wings.map(wing => {
                                const Icon = wing.icon;
                                const isSelected = formData.wing === wing.id;
                                return (
                                    <button
                                        key={wing.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, wing: wing.id })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                            isSelected 
                                            ? `${wing.bg} ${wing.border} scale-105 shadow-lg` 
                                            : 'bg-theme-bg border-theme-border opacity-70 hover:opacity-100 hover:border-theme-primary/50'
                                        }`}
                                    >
                                        <Icon className={`w-6 h-6 mb-1 ${isSelected ? wing.color : 'text-theme-muted'}`} />
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? wing.color : 'text-theme-text'}`}>
                                            {wing.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Certificate Level */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2 ml-1">Certificate</label>
                            <div className="flex bg-theme-bg rounded-xl border border-theme-border p-1">
                                {['A', 'B', 'C'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, certificateLevel: level })}
                                        className={`flex-1 py-2 text-xs font-black transition-all rounded-lg ${
                                            formData.certificateLevel === level ? 'bg-theme-primary text-theme-bg shadow-sm' : 'text-theme-muted hover:text-theme-text'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Battalion */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2 ml-1">Battalion / Unit</label>
                            <input 
                                type="text" 
                                required 
                                className={inputClass} 
                                placeholder="e.g. 1st Delhi Bn"
                                value={formData.battalion}
                                onChange={(e) => setFormData({ ...formData, battalion: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2 ml-1">Regimental Number</label>
                        <input 
                            type="text" 
                            required 
                            className={inputClass} 
                            placeholder="DL/22/SDA/100452"
                            value={formData.regNumber}
                            onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2 ml-1">Password</label>
                            <input 
                                type="password" 
                                required 
                                className={inputClass.replace('uppercase tracking-wide', '')} 
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2 ml-1">Confirm Password</label>
                            <input 
                                type="password" 
                                required 
                                className={inputClass.replace('uppercase tracking-wide', '')} 
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300
                            bg-theme-primary text-theme-bg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(var(--theme-primary),0.4)]
                            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs font-bold uppercase tracking-wider text-theme-muted">
                    Already Enlisted?{' '}
                    <button onClick={onSwitchToLogin} className="text-theme-primary hover:underline underline-offset-4 ml-1">
                        Authenticate Here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
