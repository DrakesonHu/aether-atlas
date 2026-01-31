import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('analytics_consent');
        if (consent === null) {
            setShowBanner(true);
        } else if (consent === 'accepted') {
            initializeGA();
        }
    }, []);

    const initializeGA = () => {
        ReactGA.initialize('G-C0HBWJFK1V');
    };

    const handleAccept = () => {
        localStorage.setItem('analytics_consent', 'accepted');
        initializeGA();
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('analytics_consent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-4 z-[100] shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-slate-200 text-sm">
                    We use cookies to understand how visitors interact with our site.
                    By clicking "Accept", you consent to our use of cookies for analytics.
                </p>
                <div className="flex gap-3 flex-shrink-0">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
