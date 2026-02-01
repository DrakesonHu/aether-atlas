import './globals.css';
import Navigation from '@/components/Navigation';
import CookieConsent from '@/components/CookieConsent';

export const metadata = {
    title: {
        default: 'Aether Atlas',
        template: '%s | Aether Atlas'
    },
    description: 'Explore the Aether Atlas - an interactive 3D visualization mapping the relationships between albums and tracks across sonic dimensions.',
    keywords: ['music', 'atlas', 'visualization', 'album reviews', 'music criticism', 'data visualization'],
    authors: [{ name: 'Aether Atlas' }],
    icons: {
        icon: '/icon.jpg',
        apple: '/icon.jpg',
    },
    openGraph: {
        title: 'Aether Atlas',
        description: 'Mapping the phenomenology of sound and the textures of memory.',
        url: 'https://aetheratlas.net',
        siteName: 'Aether Atlas',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Aether Atlas',
        description: 'Mapping the phenomenology of sound and the textures of memory.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="min-h-screen bg-cream text-charcoal font-sans selection:bg-slate-700 selection:text-white">
                <Navigation />
                {children}
                <CookieConsent />
            </body>
        </html>
    );
}
