// lib/constants.js - Theme colors and configuration

// COLORS: Dark Atlas + Light Cream Reading theme
export const COLORS = {
    // Atlas theme (dark)
    atlas: {
        bg: 'bg-transparent',
        text: 'text-slate-200',
        accent: 'text-slate-cool-400',
        muted: 'text-slate-cool-600',
        border: 'border-slate-cool-700',
        card: 'bg-slate-900/80',
        highlight: 'bg-amber-500/20',
        flare: 'bg-amber-500/30'
    },
    // Reading theme (light)
    reading: {
        bg: 'bg-cream/80',
        text: 'text-charcoal',
        accent: 'text-terracotta',
        muted: 'text-slate-500',
        border: 'border-warm-gray',
        card: 'bg-white/90',
        highlight: 'bg-rust/10',
        flare: 'bg-rust/20'
    }
};

// PARALLAX CONFIGURATION
export const PARALLAX_CONFIG = {
    layers: {
        deep: { mouse: -200, pan: 0.8, scroll: 0.1, rotation: 10 },
        mid: { mouse: -350, pan: 1.2, scroll: 0.2, rotation: 20 },
        streak: { mouse: -500, pan: 1.5, scroll: 0.3, rotation: 30 }
    },
    transitions: {
        deep: 1400,
        mid: 1100,
        streak: 800
    },
    rotationDampener: 35
};
