import { Suspense } from 'react';
import AtlasPageClient from './AtlasPageClient';

export const metadata = {
    title: 'Atlas Map | Aether Atlas',
    description: 'Explore the Aether Atlas - an interactive 3D visualization mapping musical similarity. Discover connections between songs based on sonic and emotional characteristics.',
    openGraph: {
        title: 'Atlas Map - Aether Atlas',
        description: 'Explore the Aether Atlas - an interactive 3D visualization mapping musical similarity.',
        url: 'https://aetheratlas.com/atlas',
        siteName: 'Aether Atlas',
        type: 'website',
    },
};

export default function AtlasPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
            <AtlasPageClient />
        </Suspense>
    );
}
