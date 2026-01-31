// src/analytics.js - Enhanced GA4 Analytics with User ID & dataLayer support
import ReactGA from 'react-ga4';
import { v4 as uuidv4 } from 'uuid';

/**
 * UTILS & CONSTANTS
 */

// Generate/Retrieve persistent anonymous User ID
const getOrCreateUserId = () => {
    let userId = localStorage.getItem('atlas_user_id');
    if (!userId) {
        userId = uuidv4();
        localStorage.setItem('atlas_user_id', userId);
    }
    return userId;
};

// Check if user has consented to analytics
export const hasAnalyticsConsent = () => {
    return localStorage.getItem('analytics_consent') === 'accepted';
};

// Check if analytics should run (Prod or enabled in Dev)
const shouldRunAnalytics = () => {
    const isProd = process.env.NODE_ENV === 'production';
    const enableInDev = process.env.REACT_APP_ENABLE_GA_IN_DEV === 'true';
    return isProd || enableInDev;
};

/**
 * INITIALIZATION
 */

export const initializeAnalytics = () => {
    if (!hasAnalyticsConsent() || !shouldRunAnalytics()) return false;

    const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (!measurementId) {
        console.warn('Analytics: No Measurement ID found in environment.');
        return false;
    }

    const userId = getOrCreateUserId();

    ReactGA.initialize(measurementId, {
        gaOptions: {
            userId: userId
        }
    });

    // Set user ID for all subsequent events
    ReactGA.set({ user_id: userId });

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'user_id': userId,
        'consent_status': 'accepted',
        'env': process.env.NODE_ENV
    });

    return true;
};

/**
 * CORE TRACKING WRAPPER
 */

const track = (eventName, params = {}) => {
    if (!hasAnalyticsConsent() || !shouldRunAnalytics()) return;

    // GA4 via react-ga4 (supports legacy category/action/label if passed as params)
    ReactGA.event(eventName, params);

    // dataLayer push for GTM compatibility
    if (window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...params
        });
    }

    // Console logging in dev mode
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${eventName}:`, params);
    }
};

/**
 * SPECIFIC EVENT HELPERS
 */

// Page Views
export const trackPageView = (pageName, pathOverride = null) => {
    if (!hasAnalyticsConsent() || !shouldRunAnalytics()) return;

    const pagePath = pathOverride || `/${pageName}`;
    ReactGA.send({
        hitType: 'pageview',
        page: pagePath,
        title: pageName
    });

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'page_view',
            page_path: pagePath,
            page_title: pageName
        });
    }
};

// Album & Track Views
export const trackAlbumView = (albumId, albumTitle) => {
    track('view_album', {
        album_id: albumId,
        album_title: albumTitle
    });
};

export const trackTrackView = (albumTitle, trackTitle, trackId = null) => {
    track('view_track', {
        album_title: albumTitle,
        track_title: trackTitle,
        track_id: trackId
    });
};

// Filtering & Discovery
export const trackFilterSelect = (type, value) => {
    track('select_filter', {
        filter_type: type,
        filter_value: value
    });
};

// Atlas Interaction
export const trackAtlasInteraction = (action, label = '') => {
    track('atlas_interaction', {
        interaction_type: action,
        interaction_label: label
    });
};

export const trackViewModeChange = (viewMode) => {
    track('toggle_view_mode', {
        view_mode: viewMode === '3d' ? '3D' : '2D'
    });
};

export const trackGradientAxisChange = (axis) => {
    track('change_gradient', {
        gradient_axis: axis
    });
};

// Detailed Atlas Usage (Zoom/Pan)
export const trackAtlasMovement = (type, details = {}) => {
    track(`atlas_${type}`, details);
};

export const trackNodeInteraction = (action, nodeData) => {
    track(`node_${action}`, {
        node_id: nodeData.id,
        track_title: nodeData.title,
        album_id: nodeData.linkedAlbumId,
        genre: nodeData.genrePrimary
    });
};
