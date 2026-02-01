import { INITIAL_ALBUMS } from '@/lib/data';
import TrackPageClient from './TrackPageClient';

// Generate all static paths for tracks
export function generateStaticParams() {
    const params = [];
    INITIAL_ALBUMS.filter(album => album.published).forEach(album => {
        album.tracks.filter(track => track.published).forEach(track => {
            params.push({ trackId: track.id });
        });
    });
    return params;
}

// Find the track and its parent album
function findTrackWithAlbum(trackId) {
    for (const album of INITIAL_ALBUMS) {
        const track = album.tracks.find(t => t.id === trackId);
        if (track) {
            return { track, album };
        }
    }
    return { track: null, album: null };
}

// Generate metadata for SEO
export function generateMetadata({ params }) {
    const { track, album } = findTrackWithAlbum(params.trackId);

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
        title: `${track.title} - ${album.artist} | Aether Atlas`,
        description,
        openGraph: {
            title: `${track.title} - ${album.artist}`,
            description,
            url: `https://aetheratlas.com/track/${track.id}`,
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
            title: `${track.title} - ${album.artist}`,
            description,
            images: album.coverImage ? [album.coverImage] : [],
        },
    };
}

export default function TrackPage({ params }) {
    const { track, album } = findTrackWithAlbum(params.trackId);

    if (!track || !album) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-600 font-display">Track not found.</p>
            </div>
        );
    }

    return <TrackPageClient track={track} album={album} />;
}
