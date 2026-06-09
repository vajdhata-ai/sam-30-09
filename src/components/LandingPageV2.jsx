import React, { useEffect, useRef } from 'react';
import './LandingPageV2.css';
import StarryBackground from './StarryBackground';
import { AuremLogo } from './Icons';

const features = [
    {
        icon: '📖',
        name: 'Cadet Handbook',
        tag: 'Knowledge Base',
        desc: 'Everything an NCC cadet needs — code of conduct, rank structure, daily routines, certificate guidelines, and parade commands at your fingertips.',
        color: 'feature-gold',
    },
    {
        icon: '🎯',
        name: 'Command Center',
        tag: 'Exam Prep & Analytics',
        desc: 'Track your battalion rank, study streak, accuracy, and growth. Focused preparation for NCC A, B, and C certificate examinations.',
        color: 'feature-teal',
    },
    {
        icon: '🧠',
        name: 'Neural Query',
        tag: 'AI Doubt Solver',
        desc: 'Ask any NCC-related question — drill procedures, map reading, weapon training theory, first aid — and get deep, step-by-step reasoning.',
        color: 'feature-rose',
    },
    {
        icon: '🔭',
        name: 'Samvada Lens',
        tag: 'Visual AI',
        desc: 'Point your camera at insignias, rank badges, or field maps. Samvada Lens instantly identifies and teaches — turning the parade ground into your classroom.',
        color: 'feature-indigo',
    },
    {
        icon: '🎙️',
        name: 'Audio Studio',
        tag: 'Voice AI',
        desc: 'Convert NCC syllabus topics into professional audio lessons. Study drill theory, national integration, and adventure training hands-free.',
        color: 'feature-amber',
    },
    {
        icon: '⚔️',
        name: 'Cognitive Colosseum',
        tag: 'Competitive Arena',
        desc: 'Timed, high-intensity knowledge battles on NCC syllabus. Compete with fellow cadets in live scoring to sharpen speed and recall.',
        color: 'feature-purple',
    },
    {
        icon: '🛡️',
        name: 'Samvada Shield',
        tag: 'Grievance Portal',
        desc: 'Confidential reporting system for bullying, food quality, or unfair treatment. Reports go directly to your Commanding Officer for immediate action.',
        color: 'feature-green',
    },
    {
        icon: '📋',
        name: 'Adaptive Testing',
        tag: 'Smart Assessment',
        desc: 'Auto-generated quizzes on NCC subjects with adjustable difficulty. Instant feedback, detailed performance reports, and topic-wise analysis.',
        color: 'feature-sky',
    },
];

const stats = [
    { num: '10+', label: 'AI Tools' },
    { num: 'A/B/C', label: 'Certificate Prep' },
    { num: '100%', label: 'NCC Focused' },
    { num: '24/7', label: 'Always Ready' },
];

const testimonials = [
    {
        quote: "The Cadet Handbook saved me before my B Certificate exam. Every drill command, every rank — all in one place. It's like a pocket JD for cadets.",
        name: "Cadet Arjun M.",
        role: "Senior Division, 2 Raj Bn NCC",
        init: "A",
    },
    {
        quote: "Samvada Shield let me report a bullying incident anonymously. My CO took action the same day. Every unit needs this.",
        name: "Cadet Sneha R.",
        role: "Senior Wing, 7 Girls Bn NCC",
        init: "S",
    },
    {
        quote: "The Command Center analytics showed me exactly where I was weak — map reading and weapon training. I focused there and cracked my C Certificate.",
        name: "Cadet Vikram P.",
        role: "Senior Division, 1 UP Bn NCC",
        init: "V",
    },
];

const LandingPageV2 = ({ onGetStarted }) => {
    const rootRef = useRef(null);

    useEffect(() => {
        // Scroll reveal
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity = 1;
                    e.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        const revealEls = document.querySelectorAll('.lp-reveal');
        revealEls.forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            io.observe(el);
        });

        return () => io.disconnect();
    }, []);

    return (
        <div ref={rootRef} className="lp-root" style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            <StarryBackground density={80} speed={0.4} connectDistance={120} />

            {/* ── NAV ── */}
            <nav className="lp-nav">
                <div className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AuremLogo style={{ width: '28px', height: '28px' }} />
                    Samvada
                </div>
                <ul className="lp-nav-links">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how">How It Works</a></li>
                    <li><a href="#testimonials">Cadets Speak</a></li>
                </ul>
                <button className="lp-nav-pill" onClick={onGetStarted}>Join Your Battalion</button>
            </nav>

            {/* ── HERO ── */}
            <section className="lp-hero">
                <div className="lp-hero-orb orb1" />
                <div className="lp-hero-orb orb2" />
                <div className="lp-hero-orb orb3" />

                <div className="lp-hero-left">
                    <p className="lp-eyebrow">The AI-Powered NCC Cadet Portal</p>
                    <h1>Train smarter.<br />Serve <span className="gradient-text">stronger.</span><br />Lead with honor.</h1>
                    <p className="lp-hero-sub">
                        Samvada is the all-in-one AI platform built exclusively for NCC Cadets — from exam prep and drill theory to confidential grievance reporting and battalion analytics. Unity and Discipline, powered by intelligence.
                    </p>
                    <div className="lp-hero-actions">
                        <button className="lp-btn-dark" onClick={onGetStarted}>Report for Duty</button>
                        <a href="#features" className="lp-btn-text-link">Explore Features</a>
                    </div>
                    <div className="lp-trust-strip">
                        {stats.map((s, i) => (
                            <React.Fragment key={i}>
                                <div className="lp-trust-item">
                                    <div className="lp-trust-num">{s.num}</div>
                                    <div className="lp-trust-label">{s.label}</div>
                                </div>
                                {i < stats.length - 1 && <div className="lp-trust-divider" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="lp-hero-right">
                    <div className="lp-hero-ui-preview">
                        <div className="feature-image-wrapper">
                            <div className="lp-ui-card">
                            <div className="lp-ui-card-header">
                                <div className="lp-ui-status-dot" />
                                <span>Neural Query · Active</span>
                            </div>
                            <div className="lp-ui-chat-bubble lp-bubble-ai">
                                <span className="lp-bubble-icon">✦</span>
                                <p>What are the NCC pledge words and when is it recited?</p>
                            </div>
                            <div className="lp-ui-chat-bubble lp-bubble-user">
                                <p>The NCC pledge is recited at the beginning of every NCC event. It starts with: "We, the cadets of the National Cadet Corps..."</p>
                            </div>
                            <div className="lp-ui-chat-bubble lp-bubble-ai">
                                <span className="lp-bubble-icon">✦</span>
                                <p>Correct! The full pledge emphasizes serving the nation with all our might, upholding the ideals of Unity and Discipline, and always being prepared to render selfless service.</p>
                            </div>
                            <div className="lp-ui-input-row">
                                <div className="lp-ui-input-pill">Ask anything about NCC...</div>
                                <div className="lp-ui-send-btn">→</div>
                            </div>
                        </div>
                    </div>
                    <div className="lp-floating-badge">🛡️ Samvada Shield <strong>Active</strong></div>
                        <div className="lp-floating-badge2">📋 B-Cert Quiz <strong>Ready</strong></div>
                    </div>
                </div>
            </section>

            {/* ── MARQUEE ── */}
            <div className="lp-marquee-strip">
                <div className="lp-marquee-track">
                    {['Cadet Handbook', 'Command Center', 'Neural Query', 'Samvada Lens', 'Cognitive Colosseum', 'Audio Studio', 'Samvada Shield', 'Adaptive Testing',
                        'Cadet Handbook', 'Command Center', 'Neural Query', 'Samvada Lens', 'Cognitive Colosseum', 'Audio Studio', 'Samvada Shield', 'Adaptive Testing'
                    ].map((item, i) => (
                        <React.Fragment key={i}>
                            <span>{item}</span>
                            <span className="lp-marquee-dot">✦</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section id="features" className="lp-features-section">
                <div className="lp-section-header lp-reveal">
                    <p className="lp-kicker-center">Purpose-Built for NCC</p>
                    <h2>Every tool a cadet <span className="gradient-text">needs.</span></h2>
                    <p className="lp-section-sub">From drill theory to grievance reporting — every feature is designed around NCC training, examinations, and cadet welfare.</p>
                </div>
                <div className="lp-features-grid">
                    {features.map((f, i) => (
                        <div key={f.name} className={`lp-feature-card lp-reveal ${f.color}`} style={{ transitionDelay: `${i * 60}ms` }}>
                            <div className="feature-image-wrapper">
                                <div className="lp-feature-icon-wrap">
                                    <span className="lp-feature-icon">{f.icon}</span>
                                </div>
                            </div>
                            <div className="lp-feature-tag">{f.tag}</div>
                            <h3 className="lp-feature-name">{f.name}</h3>
                            <p className="lp-feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Extra features row */}
                <div className="lp-extra-features lp-reveal">
                    <div className="lp-extra-item">
                        <span>🎥</span>
                        <div>
                            <strong>Video Studio</strong>
                            <p>Generate visual explainers on NCC topics — map reading, weapon training, and more.</p>
                        </div>
                    </div>
                    <div className="lp-extra-item">
                        <span>📄</span>
                        <div>
                            <strong>Document Study</strong>
                            <p>Upload NCC training manuals and let AI create summaries, flashcards, and interactive Q&A.</p>
                        </div>
                    </div>
                    <div className="lp-extra-item">
                        <span>🔁</span>
                        <div>
                            <strong>Learn Loop</strong>
                            <p>Spaced repetition engine for NCC syllabus — reviews timed perfectly for maximum retention.</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="section-divider" />

            {/* ── HOW IT WORKS ── */}
            <section id="how" className="lp-how-section">
                <div className="lp-section-header lp-reveal">
                    <p className="lp-kicker-center">How It Works</p>
                    <h2>Three steps to <span className="gradient-text">readiness.</span></h2>
                </div>
                <div className="lp-steps-row">
                    <div className="lp-step lp-reveal">
                        <div className="lp-step-num">01</div>
                        <h4>Sign in & select your role</h4>
                        <p>One-click Google sign-in. Choose "NCC Cadet" or "Commanding Officer" — each gets a tailored dashboard.</p>
                    </div>
                    <div className="lp-step-arrow">→</div>
                    <div className="lp-step lp-reveal" style={{ transitionDelay: '100ms' }}>
                        <div className="lp-step-num">02</div>
                        <h4>Explore your tools</h4>
                        <p>Access the Cadet Handbook, start a quiz, file a grievance, or challenge a fellow cadet in the Cognitive Colosseum.</p>
                    </div>
                    <div className="lp-step-arrow">→</div>
                    <div className="lp-step lp-reveal" style={{ transitionDelay: '200ms' }}>
                        <div className="lp-step-num">03</div>
                        <h4>Rise through the ranks</h4>
                        <p>Track your progress with battalion analytics, earn study streaks, and prepare for your next NCC certificate exam.</p>
                    </div>
                </div>
            </section>

            <hr className="section-divider" />

            {/* ── TESTIMONIALS ── */}
            <section id="testimonials" className="lp-testimonial">
                <div className="lp-testimonial-header lp-reveal">
                    <h2>What cadets say</h2>
                </div>
                <div className="lp-testimonial-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="lp-t-card lp-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                            <span className="lp-t-quote-mark">"</span>
                            <p className="lp-t-quote">{t.quote}</p>
                            <div className="lp-t-author">
                                <div className="lp-t-author-pic">{t.init}</div>
                                <div>
                                    <div className="lp-t-author-name">{t.name}</div>
                                    <div className="lp-t-author-role">{t.role}</div>
                                </div>
                            </div>
                            <div className="lp-t-rating">★★★★★</div>
                        </div>
                    ))}
                </div>
            </section>

            <hr className="section-divider" />

            {/* ── CTA ── */}
            <section className="lp-cta-section">
                <div className="lp-cta-left">
                    <h2>Your next parade<br />starts <span className="gradient-text">right here.</span></h2>
                    <p>Free for all NCC cadets. No credit card. Powered by cutting-edge AI, built with discipline.</p>
                    <div className="lp-cta-btns">
                        <button className="lp-btn-dark" onClick={onGetStarted}>Report for Duty</button>
                    </div>
                </div>
                <div className="lp-cta-right">
                    <div className="lp-cta-feature lp-reveal">
                        <span className="lp-cta-feature-icon">📖</span>
                        <div className="lp-cta-feature-text"><strong>Cadet Handbook</strong>Complete NCC knowledge base — ranks, drills, conduct</div>
                    </div>
                    <div className="lp-cta-feature lp-reveal" style={{ transitionDelay: '60ms' }}>
                        <span className="lp-cta-feature-icon">🎯</span>
                        <div className="lp-cta-feature-text"><strong>Command Center</strong>Battalion rank, study streaks, exam analytics</div>
                    </div>
                    <div className="lp-cta-feature lp-reveal" style={{ transitionDelay: '120ms' }}>
                        <span className="lp-cta-feature-icon">🛡️</span>
                        <div className="lp-cta-feature-text"><strong>Samvada Shield</strong>Anonymous grievance reporting to your CO</div>
                    </div>
                    <div className="lp-cta-feature lp-reveal" style={{ transitionDelay: '180ms' }}>
                        <span className="lp-cta-feature-icon">🔒</span>
                        <div className="lp-cta-feature-text"><strong>Secure & Private</strong>Role-based access — cadet & CO dashboards</div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="lp-footer">
                <div className="lp-footer-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <AuremLogo style={{ width: '20px', height: '20px' }} />
                    Samvada
                </div>
                <p>© 2026 Samvada — Unity and Discipline. The AI-Powered NCC Cadet Portal.</p>
                <p>Privacy · Terms · Support</p>
            </footer>

        </div>
    );
};

export default LandingPageV2;
