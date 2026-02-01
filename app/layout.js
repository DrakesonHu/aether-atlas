import './globals.css';
import Navigation from '@/components/Navigation';
import CookieConsent from '@/components/CookieConsent';

export const metadata = {
    metadataBase: new URL('https://aetheratlas.net'),
    title: {
        default: 'Aether Atlas',
        template: '%s | Aether Atlas'
    },
    description: 'Explore the Aether Atlas - an interactive 3D visualization mapping the relationships between albums and tracks across sonic dimensions.',
    keywords: [
        'Aether Atlas',
        'aether atlas',
        'aetheratlas',
        'aether-atlas',
        'ether atlas',
        'ether',
        'music atlas',
        'music map',
        'song map',
        'album map',
        'music visualization',
        '3D music visualization',
        'album reviews',
        'music reviews',
        'music criticism',
        'data visualization',
        'sonic map',
        'niche music map',
        'underground songs map',
        'song similarity',
        'alt music map'
    ],
    authors: [{ name: 'Aether Atlas' }],
    icons: {
        icon: '/icon.jpg',
        apple: '/icon.jpg',
    },
    alternates: {
        canonical: 'https://aetheratlas.net',
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
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Aether Atlas",
        "alternateName": ["aether atlas", "aetheratlas", "aether-atlas", "ether atlas", "music atlas", "music map", "song map"],
        "url": "https://aetheratlas.net",
        "description": "Music criticism meets data visualization. Explore albums mapped in psychological space.",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://aetheratlas.net/atlas?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
                />
            </head>
            <body className="min-h-screen bg-cream text-charcoal font-sans selection:bg-slate-700 selection:text-white">
                <Navigation />
                {children}
                <CookieConsent />
            </body>
        </html>
    );
}
