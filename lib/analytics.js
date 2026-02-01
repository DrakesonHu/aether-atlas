// lib/analytics.js - Enhanced GA4 Analytics with User ID & dataLayer support
'use client';

import ReactGA from 'react-ga4';
import { v4 as uuidv4 } from 'uuid';

/**
 * UTILS & CONSTANTS
 */

// Generate/Retrieve persistent anonymous User ID
const getOrCreateUserId = () => {
    if (typeof window === 'undefined') return null;
    let userId = localStorage.getItem('atlas_user_id');
    if (!userId) {
        userId = uuidv4();
        localStorage.setItem('atlas_user_id', userId);
    }
    return userId;
};

// Check if user has consented to analytics
export const hasAnalyticsConsent = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('analytics_consent') === 'accepted';
};

// Check if analytics should run (Prod or enabled in Dev)
const shouldRunAnalytics = () => {
    const isProd = process.env.NODE_ENV === 'production';
    const enableInDev = process.env.NEXT_PUBLIC_ENABLE_GA_IN_DEV === 'true';
    return isProd || enableInDev;
};

/**
 * INITIALIZATION
 */

let initialized = false;

export const initializeAnalytics = () => {
    if (initialized) return true;
    if (typeof window === 'undefined') return false;
    if (!hasAnalyticsConsent() || !shouldRunAnalytics()) return false;

    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
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

    // Push to dataLayer for GTM compatibility
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'analytics_initialized',
        user_id: userId
    });

    initialized = true;
    console.log('Analytics initialized with user:', userId);
    return true;
};

/**
 * TRACKING WRAPPER
 */
const track = (eventName, params = {}) => {
    if (!initialized && !initializeAnalytics()) return;

    // GA4 event
    ReactGA.event(eventName, params);

    // dataLayer push for GTM
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: eventName,
            ...params
        });
    }
};

/**
 * PAGE TRACKING
 */
export const trackPageView = (pageName, path) => {
    if (!initialized && !initializeAnalytics()) return;

    ReactGA.send({
        hitType: 'pageview',
        page: path,
        title: pageName
    });

    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'page_view',
            page_title: pageName,
            page_path: path
        });
    }
};

/**
 * CONTENT EVENTS
 */
export const trackAlbumView = (albumId, albumTitle, artist) => {
    track('view_album', {
        album_id: albumId,
        album_title: albumTitle,
        artist: artist,
        content_type: 'album'
    });
};

export const trackTrackView = (trackId, trackTitle, albumId, artist) => {
    track('view_track', {
        track_id: trackId,
        track_title: trackTitle,
        album_id: albumId,
        artist: artist,
        content_type: 'track'
    });
};

/**
 * ATLAS INTERACTION EVENTS
 */
export const trackAtlasInteraction = (action) => {
    track('atlas_interaction', {
        action: action,
        content_type: 'atlas'
    });
};

export const trackViewModeChange = (mode) => {
    track('view_mode_change', {
        mode: mode,
        content_type: 'atlas'
    });
};

export const trackGradientAxisChange = (axis) => {
    track('gradient_axis_change', {
        axis: axis,
        content_type: 'atlas'
    });
};

export const trackFilterSelect = (filterType, value) => {
    track('filter_select', {
        filter_type: filterType,
        filter_value: value
    });
};

export const trackNodeInteraction = (interactionType, song) => {
    track('node_interaction', {
        node_id: song?.id || 'unknown',
        node_name: song?.title || 'unknown',
        artist: song?.artist || 'unknown',
        interaction_type: interactionType,
        content_type: 'atlas'
    });
};
