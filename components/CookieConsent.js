'use client';

import { useState, useEffect } from 'react';
import { initializeAnalytics, hasAnalyticsConsent } from '@/lib/analytics';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('analytics_consent');
        if (!consent) {
            setShowBanner(true);
        } else if (consent === 'accepted') {
            initializeAnalytics();
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('analytics_consent', 'accepted');
        setShowBanner(false);
        initializeAnalytics();
    };

    const handleDecline = () => {
        localStorage.setItem('analytics_consent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-charcoal/95 backdrop-blur-sm border-t border-warm-gray/20">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-300 font-display">
                    We use cookies to analyze site usage and improve your experience.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 text-xs font-display uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 text-xs font-display uppercase tracking-widest bg-terracotta text-white hover:bg-rust transition-colors"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
