import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Crown, Sparkles, Lock } from './Icons';

/**
 * PremiumGuard
 * Wraps any component and strictly enforces Firestore-synced premium access.
 * If the user's subscription tier is free, they will see a glassmorphic
 * "Upgrade Required" overlay blocking access to the feature, ensuring
 * subscription data persists flawlessly across Vercel redeploys.
 */
const PremiumGuard = ({ children, featureName = "Premium Feature" }) => {
    const { isPro, isGo, isLoadingSubscription, triggerUpgradeModal } = useSubscription();

    // If still fetching from Firestore, show a skeleton or loading state
    if (isLoadingSubscription) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-theme-bg/50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-4 border-theme-primary/30 border-t-theme-primary animate-spin mb-4"></div>
                    <p className="text-theme-muted font-bold tracking-widest uppercase text-xs">Verifying Access...</p>
                </div>
            </div>
        );
    }

    // If user is Pro or Go, they have access.
    // (We treat Go and Pro as premium for this guard, adjust if needed)
    const hasAccess = isPro || isGo;

    if (hasAccess) {
        return <>{children}</>;
    }

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* The actual content (blurred and unclickable) */}
            <div className="absolute inset-0 opacity-30 pointer-events-none blur-md select-none">
                {children}
            </div>

            {/* Premium Block Overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-theme-bg/60 backdrop-blur-md p-6">
                <div className="text-center p-10 rounded-[40px] border border-theme-primary/30 bg-theme-surface/80 shadow-2xl glass-3d max-w-md w-full mx-4 transform transition-all hover:scale-105 hover:border-theme-primary/50">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-theme-primary via-theme-secondary to-theme-primary flex items-center justify-center shadow-[0_0_40px_rgba(201,165,90,0.4)] relative">
                        <div className="absolute inset-0 rounded-full border-2 border-theme-primary/50 animate-pulse"></div>
                        <Lock className="w-12 h-12 text-theme-bg" />
                    </div>
                    
                    <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-primary bg-clip-text text-transparent">
                        Auremous {featureName}
                    </h2>
                    
                    <p className="text-theme-muted mb-8 text-base leading-relaxed">
                        This is an elite feature reserved for Auremous Pro and Go members. Upgrade your cognitive arsenal to unlock full access.
                    </p>
                    
                    <button 
                        onClick={() => triggerUpgradeModal(featureName.toLowerCase().replace(/\s+/g, '-'))}
                        className="w-full relative px-6 py-4 rounded-2xl bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-bg font-black text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgba(201,165,90,0.3)] hover:shadow-[0_12px_40px_rgba(201,165,90,0.5)] flex items-center justify-center gap-3 group"
                    >
                        <Crown className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        <span>Upgrade Plan</span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center gap-2 text-theme-muted text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3 text-theme-primary" />
                        Synced via Firestore
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumGuard;
