import React, { useState, useEffect, useMemo, useRef } from 'react';

/**
 * RocketLoader — NASA-Grade Cinematic Launch & Landing Sequences
 * mode='launch': preflight → countdown → ignition → liftoff → maxq → done
 * mode='landing': orbit → descending → touchdown → done
 */
const RocketLoader = ({ mode = 'launch', title = "Loading", onExit, onComplete }) => {
    const [phase, setPhase] = useState(mode === 'launch' ? 'preflight' : 'orbit');
    const [count, setCount] = useState(10);
    const sequenceStarted = useRef(false);

    const stars = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
        id: i, x: Math.random() * 100, y: Math.random() * 100,
        size: 0.3 + Math.random() * 2, delay: Math.random() * 3, dur: 2 + Math.random() * 3,
    })), []);

    // Smoke cloud positions (memoized)
    const smokeClouds = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: Math.random() * -30,
        size: 40 + Math.random() * 80,
        delay: Math.random() * 0.5,
        dir: Math.random() > 0.5 ? 1 : -1,
    })), []);

    // ═══ PREFLIGHT → COUNTDOWN ═══
    useEffect(() => {
        if (mode !== 'launch' || phase !== 'preflight') return;
        const t = setTimeout(() => setPhase('countdown'), 2000);
        return () => clearTimeout(t);
    }, [mode, phase]);

    // ═══ COUNTDOWN TICKER (T-10) ═══
    useEffect(() => {
        if (mode !== 'launch' || phase !== 'countdown') return;
        if (count <= 0) { setPhase('ignition'); return; }
        // Dramatic pacing: slower at start, faster at end
        const delay = count > 5 ? 600 : count > 2 ? 800 : 1000;
        const t = setTimeout(() => setCount(c => c - 1), delay);
        return () => clearTimeout(t);
    }, [mode, phase, count]);

    // ═══ IGNITION → LIFTOFF → MAXQ → DONE ═══
    useEffect(() => {
        if (mode !== 'launch' || phase !== 'ignition' || sequenceStarted.current) return;
        sequenceStarted.current = true;
        setTimeout(() => setPhase('liftoff'), 2000);
        setTimeout(() => setPhase('maxq'), 5500);
        setTimeout(() => setPhase('done'), 7500);
        setTimeout(() => { if (onComplete) onComplete(); }, 8200);
    }, [mode, phase]);

    // ═══ LANDING SEQUENCE ═══
    useEffect(() => {
        if (mode !== 'landing' || sequenceStarted.current) return;
        sequenceStarted.current = true;
        setTimeout(() => setPhase('descending'), 2000);
        setTimeout(() => setPhase('touchdown'), 5000);
        setTimeout(() => setPhase('done'), 6500);
        setTimeout(() => { if (onComplete) onComplete(); }, 7000);
    }, [mode]);

    const isFlying = phase === 'liftoff' || phase === 'maxq';
    const isDone = phase === 'done';

    // ═══ STATUS TEXT ═══
    const statusMap = {
        preflight: 'SYSTEMS CHECK',
        countdown: count > 7 ? 'ALL SYSTEMS NOMINAL' : count > 3 ? 'GO FOR LAUNCH' : 'FINAL SEQUENCE',
        ignition: 'MAIN ENGINE START',
        liftoff: 'LIFTOFF — ALL ENGINES RUNNING',
        maxq: 'MAX-Q — GO AT THROTTLE UP',
        orbit: 'ORBITAL INSERTION',
        descending: 'ENTRY INTERFACE',
        touchdown: 'TOUCHDOWN CONFIRMED',
        done: mode === 'launch' ? 'ORBIT ACHIEVED ✓' : 'WELCOME HOME ✓',
    };

    // Camera shake for liftoff
    const shakeStyle = (phase === 'ignition' || phase === 'liftoff')
        ? { animation: `cameraShake ${phase === 'ignition' ? '0.12s' : '0.08s'} infinite` }
        : {};

    return (
        <div className="flex flex-col items-center justify-end h-full w-full relative overflow-hidden select-none"
             style={{
                 ...shakeStyle,
                 background: phase === 'maxq' || isDone
                     ? 'linear-gradient(to top, #000005 0%, #020210 50%, #050520 100%)'
                     : phase === 'descending' || phase === 'touchdown'
                         ? 'linear-gradient(to top, #1a0a2e 0%, #0d1117 50%, #0a0a1a 100%)'
                         : 'linear-gradient(to top, #0a0a1a 0%, #0d1117 40%, #0f172a 100%)',
             }}>

            {/* ═══ WHITE FLASH on transition ═══ */}
            <div className={`absolute inset-0 z-[100] pointer-events-none transition-opacity ${
                isDone ? 'opacity-100 duration-[800ms]' : 'opacity-0 duration-300'
            }`} style={{ background: 'radial-gradient(circle, #fff 0%, rgba(240,240,255,0.95) 100%)' }} />

            {/* ═══ STARFIELD ═══ */}
            <div className="absolute inset-0 z-0">
                {stars.map(s => (
                    <div key={s.id} className="absolute rounded-full bg-white"
                        style={{
                            width: `${s.size}px`,
                            height: (phase === 'liftoff' || phase === 'maxq')
                                ? `${s.size + (phase === 'maxq' ? 60 : 30)}px`
                                : `${s.size}px`,
                            left: `${s.x}%`, top: `${s.y}%`,
                            opacity: isFlying ? 0.5 : isDone ? 0.1 : 0.6,
                            transition: `all ${isFlying ? '1s' : '2s'} ease`,
                            transform: isFlying ? 'translateY(150vh)' : 'translateY(0)',
                            borderRadius: isFlying ? '0' : '50%',
                            animation: !isFlying ? `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate` : 'none',
                        }} />
                ))}
            </div>

            {/* ═══ SONIC BOOM RING (maxq phase) ═══ */}
            {phase === 'maxq' && (
                <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none">
                    <div className="rounded-full border-2 border-white/20"
                         style={{
                             width: '10px', height: '10px',
                             animation: 'sonicBoom 2s ease-out forwards',
                             boxShadow: '0 0 30px rgba(255,255,255,0.1)',
                         }} />
                </div>
            )}

            {/* ═══ ATMOSPHERIC LAYERS ═══ */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                {/* Ground atmosphere */}
                <div className="absolute bottom-0 left-0 right-0 h-[40%] transition-opacity duration-[2000ms]"
                     style={{
                         background: 'linear-gradient(to top, rgba(251,146,60,0.08) 0%, transparent 100%)',
                         opacity: isFlying || isDone ? 0 : 1,
                     }} />
                {/* Space nebula */}
                <div className="absolute w-[600px] h-[600px] rounded-full blur-[100px] -top-40 -right-40 transition-opacity duration-[3000ms]"
                     style={{
                         background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
                         opacity: phase === 'orbit' ? 0.8 : 0,
                     }} />
                {/* Max-Q atmospheric heating glow */}
                {phase === 'maxq' && (
                    <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full"
                         style={{
                             background: 'radial-gradient(circle, rgba(255,100,0,0.15) 0%, transparent 70%)',
                             animation: 'pulseGlow 0.5s ease-in-out infinite alternate',
                         }} />
                )}
            </div>

            {/* ═══ EXIT BUTTON ═══ */}
            {onExit && !isDone && (
                <button onClick={onExit}
                    className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 px-4 py-2.5 rounded-full text-white/40 hover:text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-white/5 active:scale-95 z-50 border border-white/10 backdrop-blur-sm">
                    <span className="text-sm">←</span> Abort Mission
                </button>
            )}

            {/* ═══ MAIN SCENE ═══ */}
            <div className="relative z-10 flex flex-col items-center w-full h-full justify-end">

                {/* STATUS HUD */}
                <div className={`absolute top-8 left-1/2 -translate-x-1/2 text-center z-20 transition-all duration-1000 ${isDone ? 'opacity-0 -translate-y-10' : 'opacity-100'}`}>
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">MISSION CONTROL</p>
                    <h2 className="text-white text-lg md:text-xl font-black tracking-tight">{title}</h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor] ${
                            phase === 'preflight' ? 'bg-blue-400' :
                            phase === 'countdown' ? 'bg-emerald-400' :
                            (phase === 'ignition' || isFlying) ? 'bg-orange-400' : 'bg-violet-400'
                        }`} style={{ animation: 'pulse 1s infinite' }} />
                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.15em]">
                            {phase === 'countdown' ? `T – ${count}` : statusMap[phase]}
                        </span>
                    </div>

                    {/* Preflight systems checklist */}
                    {phase === 'preflight' && (
                        <div className="mt-6 space-y-1.5 text-left inline-block" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                            {['FUEL PRESSURE', 'GUIDANCE', 'TELEMETRY', 'RANGE SAFETY'].map((sys, i) => (
                                <div key={sys} className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider"
                                     style={{ animation: `fadeIn 0.4s ease-out ${i * 0.3}s backwards` }}>
                                    <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
                                    <span className="text-white/25">{sys}</span>
                                    <span className="text-emerald-400/50 ml-1">GO</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══ COUNTDOWN NUMBER ═══ */}
                {mode === 'launch' && phase === 'countdown' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                        <span key={count} className="block text-white/[0.06] font-black tabular-nums leading-none"
                              style={{ fontSize: 'clamp(120px, 25vw, 280px)', fontFamily: 'system-ui', animation: 'countdownPulse 0.8s ease-out forwards' }}>
                            {count}
                        </span>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/15" />
                            <span className="text-white/20 text-xs font-bold uppercase tracking-[0.3em] tabular-nums">T – {count}</span>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/15" />
                        </div>
                    </div>
                )}

                {/* ═══ ROCKET (launch mode) ═══ */}
                {mode === 'launch' && (
                    <div className="relative flex flex-col items-center"
                         style={{ transformOrigin: 'bottom center' }}>
                        <div className="relative flex flex-col items-center"
                             style={{
                                 transformOrigin: 'bottom center',
                                 marginBottom: (phase === 'preflight' || phase === 'countdown' || phase === 'ignition') ? '60px' : '0',
                                 transform:
                                 phase === 'preflight' ? 'translateY(0) scale(1.0)' :
                                 phase === 'countdown' ? 'translateY(0) scale(1.0)' :
                                 phase === 'ignition' ? 'translateY(-8px) scale(1.0)' :
                                 phase === 'liftoff' ? 'translateY(-130vh) scale(1.1)' :
                                 'translateY(-200vh) scale(1.0)',
                             transition:
                                 phase === 'ignition' ? 'all 2s ease-in-out' :
                                 phase === 'liftoff' ? 'all 3.5s cubic-bezier(0.25, 0, 0.2, 1)' :
                                 phase === 'maxq' ? 'all 2s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.5s ease',
                             animation:
                                 phase === 'ignition' ? 'rocketRumble 0.06s infinite' :
                                 phase === 'countdown' && count <= 3 ? 'rocketRumble 0.12s infinite' : 'none',
                         }}>

                        {/* Support arms — retract on ignition */}
                        {(phase === 'preflight' || phase === 'countdown') && (
                            <>
                                <div className="absolute left-[-28px] top-[40%] w-[28px] h-[3px] bg-gradient-to-l from-slate-500 to-slate-700 rounded-l transition-all duration-1000"
                                     style={{ opacity: phase === 'countdown' && count <= 1 ? 0 : 1, transform: phase === 'countdown' && count <= 1 ? 'translateX(-20px)' : 'translateX(0)' }} />
                                <div className="absolute right-[-28px] top-[40%] w-[28px] h-[3px] bg-gradient-to-r from-slate-500 to-slate-700 rounded-r transition-all duration-1000"
                                     style={{ opacity: phase === 'countdown' && count <= 1 ? 0 : 1, transform: phase === 'countdown' && count <= 1 ? 'translateX(20px)' : 'translateX(0)' }} />
                            </>
                        )}

                        <RocketSVG />
                        {(phase === 'ignition' || isFlying) && <ExhaustPlume phase={phase} />}
                        </div>
                    </div>
                )}

                {/* ═══ ROCKET (landing mode) ═══ */}
                {mode === 'landing' && (
                    <div className="relative flex flex-col items-center"
                         style={{ transformOrigin: 'bottom center' }}>
                        <div className="relative flex flex-col items-center"
                             style={{
                                 transformOrigin: 'bottom center',
                                 marginBottom: phase === 'touchdown' || isDone ? '60px' : '0',
                                 transform:
                                 phase === 'orbit' ? 'translateY(-60vh) scale(0.6)' :
                                 phase === 'descending' ? 'translateY(0) scale(1.0)' :
                                 'translateY(0) scale(1.0)',
                             transition:
                                 phase === 'descending' ? 'all 3s cubic-bezier(0.2, 0, 0.4, 1)' :
                                 phase === 'touchdown' ? 'all 1.5s ease-out' : 'all 0.5s ease',
                             animation: phase === 'touchdown' ? 'rocketRumble 0.1s 3' : 'none',
                         }}>
                        <RocketSVG />
                        {(phase === 'orbit' || phase === 'descending') && <ExhaustPlume phase="small" />}
                        </div>
                    </div>
                )}

                {/* ═══ SMOKE CLOUD (launch) ═══ */}
                {mode === 'launch' && (phase === 'ignition' || phase === 'liftoff') && (
                    <div className="absolute bottom-[60px] left-1/2 z-[5] pointer-events-none"
                         style={{ transform: 'translateX(-50%) scale(1.8)', transformOrigin: 'bottom center' }}>
                        {smokeClouds.map(c => (
                            <div key={c.id}
                                 className="absolute rounded-full"
                                 style={{
                                     width: `${c.size}px`,
                                     height: `${c.size * 0.6}px`,
                                     left: `${c.x}px`,
                                     top: `${c.y}px`,
                                     background: `radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, rgba(200,200,200,0.04) 60%, transparent 100%)`,
                                     filter: 'blur(8px)',
                                     animation: `smokeExpand ${2 + c.delay}s ease-out ${c.delay}s forwards`,
                                     opacity: 0,
                                 }} />
                        ))}
                    </div>
                )}

                {/* ═══ LAUNCH PAD ═══ */}
                {mode === 'launch' && (
                    <div className={`w-full transition-all duration-[2000ms] ${
                        isFlying || isDone ? 'opacity-0 translate-y-20' : 'opacity-100'
                    }`} style={{ transform: 'scale(1.0)', transformOrigin: 'bottom center', paddingBottom: '20px' }}>
                        <LaunchPad isActive={phase === 'ignition' || (phase === 'countdown' && count <= 3)} />
                    </div>
                )}

                {/* ═══ PLANET SURFACE (landing mode) ═══ */}
                {mode === 'landing' && (
                    <div className={`w-full transition-all duration-[2000ms] ${
                        phase === 'orbit' ? 'opacity-0 translate-y-20' : 'opacity-100'
                    }`} style={{ transform: 'scale(1.0)', transformOrigin: 'bottom center', paddingBottom: '20px' }}>
                        {phase === 'touchdown' && <GroundSmoke />}
                        <div className="relative">
                            <div className="absolute -top-32 left-0 right-0 h-32"
                                 style={{ background: 'linear-gradient(to top, rgba(124,58,237,0.12) 0%, transparent 100%)' }} />
                            <div style={{ height: '60px', background: 'linear-gradient(to top, #1a0a2e 0%, #2d1052 60%, transparent 100%)', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="absolute rounded-full bg-violet-500/10"
                                         style={{ width: `${10 + Math.random() * 25}px`, height: `${4 + Math.random() * 10}px`,
                                                  bottom: `${Math.random() * 40}px`, left: `${Math.random() * 100}%`, filter: 'blur(2px)' }} />
                                ))}
                            </div>
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <div className="w-16 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" style={{ animation: 'pulse 1s infinite' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1 shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ animation: 'pulse 0.8s infinite' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ═══ LANDING: "Welcome" text ═══ */}
            {mode === 'landing' && phase === 'touchdown' && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                     style={{ animation: 'fadeInUp 1s ease-out' }}>
                    <div className="text-center">
                        <p className="text-violet-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">You Have Arrived</p>
                        <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight">Welcome, Commander</h3>
                    </div>
                </div>
            )}

            {/* ═══ KEYFRAME STYLES ═══ */}
            <style>{`
                @keyframes cameraShake {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(-1px, 1px); }
                    50% { transform: translate(1px, -1px); }
                    75% { transform: translate(-1px, -1px); }
                    100% { transform: translate(1px, 1px); }
                }
                @keyframes sonicBoom {
                    0% { width: 10px; height: 10px; opacity: 0.4; border-width: 3px; }
                    100% { width: 120vw; height: 120vw; opacity: 0; border-width: 0.5px; }
                }
                @keyframes smokeExpand {
                    0% { opacity: 0; transform: scale(0.3) translateY(0); }
                    30% { opacity: 0.8; }
                    100% { opacity: 0; transform: scale(3) translateY(-60px); }
                }
                @keyframes countdownPulse {
                    0% { transform: scale(1.3); opacity: 0.12; }
                    50% { opacity: 0.08; }
                    100% { transform: scale(1); opacity: 0.04; }
                }
                @keyframes rocketRumble {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(-1px, 0.5px); }
                    50% { transform: translate(1px, -0.5px); }
                    75% { transform: translate(-0.5px, -1px); }
                    100% { transform: translate(0.5px, 0.5px); }
                }
                @keyframes flameFlicker {
                    0% { transform: scaleX(0.9) scaleY(0.95); }
                    100% { transform: scaleX(1.1) scaleY(1.05); }
                }
                @keyframes twinkle {
                    0% { opacity: 0.2; }
                    100% { opacity: 0.8; }
                }
                @keyframes smokeRise {
                    0% { transform: translateY(0) scale(1); opacity: 0.4; }
                    100% { transform: translateY(-40px) scale(2.5); opacity: 0; }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(16px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulseGlow {
                    0% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

/* ═══════════════════════════════════
   DETAILED ROCKET SVG
   Taller, sleeker, with AUREM branding
   ═══════════════════════════════════ */
const RocketSVG = () => (
    <svg width="60" height="180" viewBox="0 0 60 200" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={{ filter: 'drop-shadow(0 0 20px rgba(148,163,184,0.25))' }}>
        <defs>
            <linearGradient id="bodyGrad" x1="30" y1="0" x2="30" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e8ecf0"/>
                <stop offset="25%" stopColor="#c8d0d8"/>
                <stop offset="50%" stopColor="#a0a8b4"/>
                <stop offset="75%" stopColor="#8890a0"/>
                <stop offset="100%" stopColor="#68707e"/>
            </linearGradient>
            <linearGradient id="noseGrad" x1="30" y1="0" x2="30" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f8fafc"/>
                <stop offset="100%" stopColor="#d0d8e0"/>
            </linearGradient>
            <linearGradient id="finGrad" x1="0" y1="130" x2="0" y2="165" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ef4444"/>
                <stop offset="100%" stopColor="#b91c1c"/>
            </linearGradient>
            <linearGradient id="boosterGrad" x1="0" y1="100" x2="0" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#94a3b8"/>
                <stop offset="100%" stopColor="#64748b"/>
            </linearGradient>
            <radialGradient id="windowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.3"/>
            </radialGradient>
        </defs>

        {/* Nose cone */}
        <path d="M30 2 C30 2 16 35 16 55 L44 55 C44 35 30 2 30 2Z" fill="url(#noseGrad)"/>
        <path d="M30 2 C30 2 16 35 16 55 L44 55 C44 35 30 2 30 2Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>

        {/* Main body */}
        <rect x="16" y="55" width="28" height="90" rx="1" fill="url(#bodyGrad)"/>

        {/* Panel lines */}
        <line x1="16" y1="70" x2="44" y2="70" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5"/>
        <line x1="16" y1="100" x2="44" y2="100" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5"/>
        <line x1="16" y1="120" x2="44" y2="120" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5"/>

        {/* Red accent stripe */}
        <rect x="16" y="57" width="28" height="3.5" fill="#ef4444" opacity="0.85"/>
        {/* Blue accent stripe */}
        <rect x="16" y="63" width="28" height="1.5" fill="#3b82f6" opacity="0.5"/>

        {/* Window */}
        <circle cx="30" cy="80" r="7" fill="#0f172a" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="30" cy="80" r="5.5" fill="url(#windowGrad)"/>
        <circle cx="28" cy="78" r="2" fill="rgba(255,255,255,0.25)"/>

        {/* AUREM text */}
        <text x="30" y="112" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="4.5" fontWeight="bold" fontFamily="system-ui" letterSpacing="1.5">AUREM</text>

        {/* Side boosters */}
        <rect x="5" y="100" width="8" height="50" rx="4" fill="url(#boosterGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        <rect x="47" y="100" width="8" height="50" rx="4" fill="url(#boosterGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        {/* Booster nose caps */}
        <ellipse cx="9" cy="100" rx="4" ry="3" fill="#a0a8b4"/>
        <ellipse cx="51" cy="100" rx="4" ry="3" fill="#a0a8b4"/>

        {/* Main fins */}
        <path d="M16 130 L2 162 L2 168 L16 145Z" fill="url(#finGrad)"/>
        <path d="M44 130 L58 162 L58 168 L44 145Z" fill="url(#finGrad)"/>
        {/* Center fin */}
        <path d="M27 140 L30 170 L33 140Z" fill="#64748b" opacity="0.5"/>

        {/* Engine bell */}
        <path d="M20 145 L16 158 L44 158 L40 145Z" fill="#4a5568"/>
        <ellipse cx="30" cy="158" rx="14" ry="4" fill="#374151"/>
        {/* Engine nozzle inner */}
        <ellipse cx="30" cy="158" rx="8" ry="2.5" fill="#1f2937"/>
    </svg>
);


/* ═══════════════════════════════════
   MULTI-LAYER EXHAUST PLUME
   White core → Blue → Orange → Smoke
   ═══════════════════════════════════ */
const ExhaustPlume = ({ phase }) => {
    const isBig = phase === 'liftoff' || phase === 'maxq';
    const isSmall = phase === 'small';

    return (
        <div className="relative flex flex-col items-center -mt-2">
            {/* Outer orange plume */}
            <div style={{
                width: isBig ? '40px' : isSmall ? '16px' : '24px',
                height: isBig ? '140px' : isSmall ? '40px' : '70px',
                background: `linear-gradient(to bottom,
                    rgba(255,200,50,0.9) 0%,
                    rgba(255,140,0,0.7) 20%,
                    rgba(255,80,0,0.5) 45%,
                    rgba(200,40,0,0.2) 70%,
                    transparent 100%)`,
                borderRadius: '0 0 50% 50%',
                filter: `blur(${isBig ? 5 : 2}px)`,
                transition: 'all 1s',
                animation: 'flameFlicker 0.08s infinite alternate',
            }} />

            {/* Middle blue plume (Mach diamond simulation) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{
                width: isBig ? '18px' : isSmall ? '6px' : '10px',
                height: isBig ? '80px' : isSmall ? '22px' : '35px',
                background: `linear-gradient(to bottom,
                    rgba(100,180,255,0.8) 0%,
                    rgba(60,140,255,0.4) 40%,
                    transparent 100%)`,
                borderRadius: '0 0 50% 50%',
                filter: 'blur(2px)',
                transition: 'all 1s',
            }} />

            {/* White-hot core */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{
                width: isBig ? '8px' : isSmall ? '3px' : '5px',
                height: isBig ? '45px' : isSmall ? '12px' : '20px',
                background: 'linear-gradient(to bottom, #fff 0%, #fef3c7 30%, rgba(254,243,199,0) 100%)',
                borderRadius: '0 0 50% 50%',
                filter: 'blur(1px)',
                transition: 'all 1s',
            }} />

            {/* Side booster flames */}
            {isBig && (
                <>
                    <div className="absolute -left-[30px] top-[-10px]" style={{
                        width: '12px', height: '50px',
                        background: 'linear-gradient(to bottom, rgba(255,160,50,0.7) 0%, rgba(255,80,0,0.3) 50%, transparent 100%)',
                        borderRadius: '0 0 50% 50%', filter: 'blur(3px)',
                        animation: 'flameFlicker 0.1s infinite alternate',
                    }} />
                    <div className="absolute -right-[30px] top-[-10px]" style={{
                        width: '12px', height: '50px',
                        background: 'linear-gradient(to bottom, rgba(255,160,50,0.7) 0%, rgba(255,80,0,0.3) 50%, transparent 100%)',
                        borderRadius: '0 0 50% 50%', filter: 'blur(3px)',
                        animation: 'flameFlicker 0.1s infinite alternate',
                    }} />
                </>
            )}
        </div>
    );
};


const GroundSmoke = () => (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-full bg-white/10 backdrop-blur-sm"
                 style={{ width: `${30 + Math.random() * 60}px`, height: `${15 + Math.random() * 30}px`,
                          animation: `smokeRise ${1.5 + Math.random()}s ease-out ${i * 0.1}s infinite`,
                          filter: 'blur(6px)', position: 'absolute', bottom: '0', left: `${-80 + i * 22}px` }} />
        ))}
    </div>
);


const LaunchPad = ({ isActive }) => (
    <div>
        <div className="relative mx-auto" style={{ width: '220px' }}>
            {/* Tower structure */}
            <div className="absolute -left-6 bottom-0 w-1.5 bg-gradient-to-t from-slate-600 to-slate-700 rounded-t" style={{ height: '100px' }} />
            <div className="absolute -right-6 bottom-0 w-1.5 bg-gradient-to-t from-slate-600 to-slate-700 rounded-t" style={{ height: '100px' }} />
            {/* Cross beams */}
            <div className="absolute -left-6 bottom-[50px] w-[calc(100%+48px)] h-px bg-slate-700/30" />
            <div className="absolute -left-6 bottom-[75px] w-[calc(100%+48px)] h-px bg-slate-700/20" />

            {/* Platform top */}
            <div className="h-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-t" />
            {/* Platform body */}
            <div className="h-8 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex gap-1.5">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-1 h-5 bg-yellow-500/25 rounded-full"
                             style={{ animation: isActive ? `pulse 0.5s ${i * 0.08}s infinite` : 'none' }} />
                    ))}
                </div>
            </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <div className="h-14 bg-gradient-to-b from-slate-900 to-[#0a0a1a]" />
    </div>
);


export default RocketLoader;
