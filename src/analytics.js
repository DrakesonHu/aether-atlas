// src/analytics.js - Analytics utility functions
import ReactGA from 'react-ga4';

// Check if user has consented to analytics
export const hasAnalyticsConsent = () => {
    return localStorage.getItem('analytics_consent') === 'accepted';
};

// Track page views
export const trackPageView = (pageName) => {
    if (hasAnalyticsConsent()) {
        ReactGA.send({ hitType: 'pageview', page: `/${pageName}`, title: pageName });
    }
};

// Track album selection
export const trackAlbumView = (albumId, albumTitle) => {
    if (hasAnalyticsConsent()) {
        ReactGA.event({
            category: 'Album',
            action: 'View Album',
            label: albumTitle,
            value: albumId
        });
    }
};

// Track track/song selection
export const trackTrackView = (albumTitle, trackTitle) => {
    if (hasAnalyticsConsent()) {
        ReactGA.event({
            category: 'Track',
            action: 'View Track',
            label: `${albumTitle} - ${trackTitle}`
        });
    }
};

// Track atlas interactions
export const trackAtlasInteraction = (action, label = '') => {
    if (hasAnalyticsConsent()) {
        ReactGA.event({
            category: 'Atlas',
            action: action,
            label: label
        });
    }
};

// Track 3D view toggle
export const trackViewModeChange = (viewMode) => {
    if (hasAnalyticsConsent()) {
        ReactGA.event({
            category: 'Atlas',
            action: 'Toggle View Mode',
            label: viewMode === '3d' ? '3D View' : '2D View'
        });
    }
};

// Track gradient axis changes
export const trackGradientAxisChange = (axis) => {
    if (hasAnalyticsConsent()) {
        ReactGA.event({
            category: 'Atlas',
            action: 'Change Gradient Axis',
            label: axis
        });
    }
};
