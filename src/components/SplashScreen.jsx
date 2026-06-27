import React, { useEffect, useState } from 'react';
import { AuremLogo } from './Icons';

const SplashScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState(0); // 0=enter, 1=logo, 2=text, 3=exit

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 500);
        const t2 = setTimeout(() => setPhase(2), 1500);
        const t3 = setTimeout(() => setPhase(3), 5000);
        const t4 = setTimeout(() => onComplete?.(), 5800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.8,0,0.2,1)]
                ${phase >= 3 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
            `}
        >
            {/* Subtle grid overlay using theme primary */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(var(--theme-primary), 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--theme-primary), 0.5) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative flex flex-col items-center">
                {/* Logo */}
                <div className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                `}>
                    <div className="relative">
                        <AuremLogo className="w-28 h-28 text-theme-primary" />
                        {/* Glow behind logo */}
                        <div className="absolute -inset-8 rounded-full blur-2xl -z-10"
                            style={{ background: 'rgba(var(--theme-primary), 0.1)', animation: 'pulse 3s ease-in-out infinite' }} />
                    </div>
                </div>

                {/* Text */}
                <div className={`mt-8 text-center transition-all duration-800 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}>
                    <h1 className="font-serif italic font-light text-5xl md:text-6xl tracking-widest text-theme-primary drop-shadow-[0_0_25px_rgba(var(--theme-primary),0.4)] select-none">
                        Samvada
                    </h1>
                    <p className="text-xs mt-3 tracking-[0.4em] uppercase font-bold text-theme-primary" style={{ opacity: 0.9 }}>
                        Unity and Discipline
                    </p>
                    <p className="text-[10px] mt-1 tracking-[0.2em] uppercase font-semibold text-theme-muted" style={{ opacity: 0.6 }}>
                        National Cadet Corps
                    </p>
                </div>

                {/* Loading bar */}
                <div className={`mt-12 w-40 h-[2px] rounded-full overflow-hidden transition-all duration-500 delay-500
                    ${phase >= 2 ? 'opacity-100' : 'opacity-0'}
                `}
                    style={{ background: 'rgba(var(--theme-primary), 0.15)' }}
                >
                    <div className="h-full rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(var(--theme-primary),1), transparent)',
                            animation: 'splashLoadingBar 4.5s ease-in-out forwards',
                            width: '0%',
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes splashLoadingBar {
                    0% { width: 0%; transform: translateX(-100%); }
                    100% { width: 100%; transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
