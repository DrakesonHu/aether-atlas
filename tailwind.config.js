/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./lib/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'void': '#02141a',
                'void-deeper': '#010b0f',
                'cream': '#faf8f5',
                'cream-warm': '#f5f3ef',
                'charcoal': '#1f2937',
                'charcoal-dark': '#111827',
                'slate-dark': '#0f172a',
                'terracotta': '#c2410c',
                'rust': '#b45309',
                'warm-gray': '#e7e5e0',
                'slate-cool': {
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                },
                'emerald': {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                },
                'neon-teal': '#22d3ee', // brighter blue-green (cyan-400)
                'neon-gold': '#fb923c', // warm orange accent
            },
            backgroundColor: {
                'void-deep': '#01080a',
                'void-dark': '#06161a',
            },
            textColor: {
                'emerald-muted': '#a7f3d0',
                'emerald-dim': 'rgb(167, 243, 208, 0.5)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                body: ['"Cormorant Garamond"', 'serif'],
                display: ['Inter', 'sans-serif'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            },
            letterSpacing: {
                'widest': '0.2em',
                'ultrawide': '0.3em',
            },
            animation: {
                'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-slower': 'pulse-slower 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'drift': 'drift 20s linear infinite',
                'grain': 'grain 0.8s steps(2) infinite',
                'glow-soft': 'glow-soft 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.6s ease-out',
                'fade-in-slow': 'fade-in 1s ease-out',
                'streak': 'streak 20s infinite ease-in-out',
                'streak-reverse': 'streak-reverse 25s infinite ease-in-out',
            },
            keyframes: {
                'drift': {
                    '0%': { transform: 'translateX(-100%) skewX(-10deg)' },
                    '100%': { transform: 'translateX(100%) skewX(-10deg)' },
                },
                'grain': {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '0 2px' },
                },
                'glow-soft': {
                    '0%, 100%': { opacity: '0.5', boxShadow: '0 0 20px rgba(45, 212, 191, 0.3)' },
                    '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(45, 212, 191, 0.5)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'pulse-slow': {
                    '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
                    '50%': { opacity: '0.4', transform: 'scale(1.05)' },
                },
                'pulse-slower': {
                    '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
                    '50%': { opacity: '0.3', transform: 'scale(1.1)' },
                },
                'streak': {
                    '0%': { transform: 'translateX(-10%) rotate(-5deg)', opacity: '0.2' },
                    '50%': { transform: 'translateX(10%) rotate(-5deg)', opacity: '0.4' },
                    '100%': { transform: 'translateX(-10%) rotate(-5deg)', opacity: '0.2' },
                },
                'streak-reverse': {
                    '0%': { transform: 'translateX(10%) rotate(5deg)', opacity: '0.1' },
                    '50%': { transform: 'translateX(-10%) rotate(5deg)', opacity: '0.3' },
                    '100%': { transform: 'translateX(10%) rotate(5deg)', opacity: '0.1' },
                }
            },
            backgroundImage: {
                'film-grain': 'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" /%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")',
            },
            boxShadow: {
                'glow-teal': '0 0 20px rgba(45, 212, 191, 0.4)',
                'glow-teal-lg': '0 0 40px rgba(45, 212, 191, 0.6)',
            },
        },
    },
    plugins: [],
}