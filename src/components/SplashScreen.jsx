import React, { useEffect, useState, useRef } from 'react';
import StarryBackground from './StarryBackground';

import { AuremLogo } from './Icons';

const SplashScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState(0); // 0=enter, 1=logo, 2=text, 3=exit

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 150);
        const t2 = setTimeout(() => setPhase(2), 500);
        const t3 = setTimeout(() => setPhase(3), 2000);
        const t4 = setTimeout(() => onComplete?.(), 2600);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.8,0,0.2,1)] bg-theme-bg
                ${phase >= 3 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
            `}
        >
            <StarryBackground density={60} speed={0.5} connectDistance={100} />
            {/* Ambient background orbs using theme colors */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-[20%] left-[15%] w-[50vw] h-[50vw] rounded-full will-change-transform"
                    style={{ background: 'radial-gradient(circle, rgba(var(--theme-primary), 0.08) 0%, transparent 70%)', transform: 'translateZ(0)', animation: 'splash-float 8s ease-in-out infinite' }}
                />
                <div
                    className="absolute bottom-[15%] right-[10%] w-[40vw] h-[40vw] rounded-full will-change-transform"
                    style={{ background: 'radial-gradient(circle, rgba(var(--theme-primary), 0.05) 0%, transparent 70%)', transform: 'translateZ(0)', animation: 'splash-float 10s ease-in-out infinite', animationDelay: '-3s' }}
                />
                <div
                    className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full will-change-transform"
                    style={{ background: 'radial-gradient(circle, rgba(var(--theme-secondary), 0.05) 0%, transparent 70%)', transform: 'translateZ(0)' }}
                />
            </div>

            {/* Subtle grid overlay using theme primary */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(var(--theme-primary), 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--theme-primary), 0.5) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative flex flex-col items-center">
                {/* Logo */}
                <div className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                `}>
                    <div className="relative">
                        <AuremLogo className="w-24 h-24" />
                        {/* Glow behind logo */}
                        <div className="absolute -inset-6 rounded-full blur-2xl -z-10"
                            style={{ background: 'rgba(var(--theme-primary), 0.15)', animation: 'pulse 3s ease-in-out infinite' }} />
                    </div>
                </div>

                {/* Text */}
                <div className={`mt-8 text-center transition-all duration-800 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}>
                    <h1 className="text-5xl font-serif italic tracking-wide text-theme-text">
                        Samvada
                    </h1>
                    <p className="text-[10px] mt-3 tracking-[0.35em] uppercase font-bold text-theme-primary" style={{ opacity: 0.8 }}>
                        NCC Cadet Portal
                    </p>
                </div>

                {/* Loading bar */}
                <div className={`mt-10 w-32 h-[2px] rounded-full overflow-hidden transition-all duration-500 delay-500
                    ${phase >= 2 ? 'opacity-100' : 'opacity-0'}
                `}
                    style={{ background: 'rgba(var(--theme-primary), 0.1)' }}
                >
                    <div className="h-full rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, rgba(var(--theme-muted),1), rgba(var(--theme-primary),1), rgba(var(--theme-secondary),1))',
                            animation: 'splashLoadingBar 2s ease-in-out forwards',
                            width: '0%',
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes splashLoadingBar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                @keyframes splash-float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(20px, -30px); }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
