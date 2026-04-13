import React from 'react';

const UpgradeModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-pink-500/20 animate-in zoom-in-95 duration-500">
                {/* Premium Background Effects */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                
                {/* Header */}
                <div className="relative z-10 p-8 text-center border-b border-slate-200/50 dark:border-slate-800/50">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-theme-muted hover:text-theme-text transition-colors"
                    >
                        ✕
                    </button>
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-pink-500/30 mb-6 rotate-3">
                        🚀
                    </div>
                    <h2 className="text-3xl font-black text-theme-text tracking-tight mb-2">
                        Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Competitive Hub Pro</span>
                    </h2>
                    <p className="text-theme-muted font-bold text-sm uppercase tracking-widest">
                        Supercharge your preparation instantly.
                    </p>
                </div>

                {/* Features List */}
                <div className="relative z-10 p-8 bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center text-xl">
                                🤖
                            </div>
                            <div>
                                <h4 className="font-bold text-theme-text mb-1">Unlimited Ask AI</h4>
                                <p className="text-sm text-theme-muted flex-1">Chat endlessly with the Neural Tutor across all your topics.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl">
                                🎧
                            </div>
                            <div>
                                <h4 className="font-bold text-theme-text mb-1">Audio Podcasts</h4>
                                <p className="text-sm text-theme-muted flex-1">Generate immersive audio lessons for revision on the go.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
                                ⚡
                            </div>
                            <div>
                                <h4 className="font-bold text-theme-text mb-1">Deep Focus Zone</h4>
                                <p className="text-sm text-theme-muted flex-1">Unlock advanced diagnostic flows and quick recovery sessions.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl">
                                📈
                            </div>
                            <div>
                                <h4 className="font-bold text-theme-text mb-1">Detailed Analytics</h4>
                                <p className="text-sm text-theme-muted flex-1">Get precise heatmaps of your strong and weak subject areas.</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Checkout Options */}
                    <div className="beach-card rounded-[2rem] p-6 text-center border-orange-500/20 bg-white/50 dark:bg-slate-900/50 shadow-xl">
                        <div className="mb-6">
                            <span className="text-4xl font-black text-theme-text tracking-tighter">₹599</span>
                            <span className="text-theme-muted font-bold text-sm"> / year</span>
                        </div>
                        
                        <div className="space-y-3">
                            {/* Razorpay Placeholder */}
                            <button className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all hover:-translate-y-0.5 shadow-sm bg-[#0B2144] hover:bg-[#071732] text-white">
                                <span className="bg-white text-[#0B2144] p-1 rounded-sm shadow-sm font-bold text-[10px] tracking-normal leading-none">Rz</span>
                                Pay with Razorpay
                            </button>
                            
                            {/* Stripe Placeholder */}
                            <button className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all hover:-translate-y-0.5 shadow-sm bg-[#635BFF] hover:bg-[#534AD9] text-white">
                                <span className="text-lg">💳</span>
                                Pay with Stripe
                            </button>
                        </div>
                        <p className="text-[10px] text-theme-muted font-bold tracking-widest uppercase mt-4 opacity-60">
                            Secure 256-bit encrypted checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
