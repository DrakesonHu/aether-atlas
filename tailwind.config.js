/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'void': {
                    950: '#010a08',
                    900: '#0f1613',
                    800: '#1a2420',
                },
                'neon-teal': '#2dd4bf',
                'oxidized-teal': '#0d9488',
            },
            backgroundColor: {
                'void-deep': '#010a08',
                'void-dark': '#0f1613',
            },
            textColor: {
                'emerald-muted': '#a7f3d0',
                'emerald-dim': 'rgb(167, 243, 208, 0.5)',
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
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