import { INITIAL_ALBUMS } from '@/lib/data';
import { slugify, getTrackBySlug } from '@/lib/utils';
import TrackPageClient from './TrackPageClient';

// Generate all static paths for tracks using slugified titles
export function generateStaticParams() {
    const params = [];
    INITIAL_ALBUMS.filter(album => album.published).forEach(album => {
        album.tracks.filter(track => track.published).forEach(track => {
            params.push({ slug: slugify(track.title) });
        });
    });
    return params;
}

// Generate metadata for SEO
export function generateMetadata({ params }) {
    const result = getTrackBySlug(INITIAL_ALBUMS, params.slug);
    const { track, album } = result || { track: null, album: null };

    if (!track || !album) {
        return {
            title: 'Track Not Found - Aether Atlas',
            description: 'The requested track could not be found.',
        };
    }

    const description = track.content?.[0]?.value
        ? track.content[0].value.substring(0, 160) + '...'
        : `Deep dive analysis of "${track.title}" from ${album.title} by ${album.artist}.`;

    return {
        title: `${track.title} by ${album.artist} - Song Review & Analysis`,
        description: `Song review: ${description}`,
        keywords: `${track.title}, ${album.artist}, ${album.title}, song review, track review, music analysis, ${album.artist} ${track.title}`,
        openGraph: {
            title: `${track.title} - ${album.artist} Review`,
            description: `Song review: ${description}`,
            url: `https://aetheratlas.net/track/${slugify(track.title)}`,
            siteName: 'Aether Atlas',
            images: album.coverImage ? [
                {
                    url: album.coverImage,
                    width: 1200,
                    height: 630,
                    alt: `${album.title} album cover`,
                },
            ] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${track.title} - ${album.artist} Review`,
            description: `Song review: ${description}`,
            images: album.coverImage ? [album.coverImage] : [],
        },
    };
}

export default function TrackPage({ params }) {
    const result = getTrackBySlug(INITIAL_ALBUMS, params.slug);
    const { track, album } = result || { track: null, album: null };

    if (!track || !album) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-600 font-display">Track not found.</p>
            </div>
        );
    }

    return <TrackPageClient track={track} album={album} />;
}
