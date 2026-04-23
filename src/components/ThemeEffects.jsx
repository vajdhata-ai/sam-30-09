import React, { useMemo } from 'react';

/**
 * ThemeEffects — Ambient floating particles + radial spotlights.
 * Creates an insanity-level environmental layer across the entire app.
 */
const ThemeEffects = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 35 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: 1.5 + Math.random() * 2,
            duration: 8 + Math.random() * 16,
            delay: Math.random() * -20,
            dx: (Math.random() - 0.5) * 200,
            dy: -(80 + Math.random() * 250),
            opacity: 0.15 + Math.random() * 0.35,
        }));
    }, []);

    return (
        <div className="particle-field" aria-hidden="true">
            {/* Ambient radial glow spots */}
            <div
                className="hero-orb"
                style={{
                    width: '40vw',
                    height: '40vw',
                    background: 'radial-gradient(circle, rgba(var(--theme-primary), 0.04) 0%, transparent 70%)',
                    top: '10%',
                    left: '-10%',
                    animationDuration: '18s',
                }}
            />
            <div
                className="hero-orb"
                style={{
                    width: '35vw',
                    height: '35vw',
                    background: 'radial-gradient(circle, rgba(var(--theme-secondary), 0.03) 0%, transparent 70%)',
                    bottom: '5%',
                    right: '-5%',
                    animationDuration: '22s',
                    animationDelay: '-8s',
                }}
            />
            <div
                className="hero-orb"
                style={{
                    width: '25vw',
                    height: '25vw',
                    background: 'radial-gradient(circle, rgba(var(--theme-primary), 0.025) 0%, transparent 65%)',
                    top: '50%',
                    left: '60%',
                    animationDuration: '15s',
                    animationDelay: '-4s',
                }}
            />

            {/* Floating micro-particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        '--dx': `${p.dx}px`,
                        '--dy': `${p.dy}px`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                        opacity: p.opacity,
                    }}
                />
            ))}
        </div>
    );
};

export default ThemeEffects;
