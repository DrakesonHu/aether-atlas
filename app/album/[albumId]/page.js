import { notFound } from 'next/navigation';
import { INITIAL_ALBUMS } from '@/lib/data';
import AlbumPageClient from './AlbumPageClient';

export async function generateStaticParams() {
    return INITIAL_ALBUMS.filter(album => album.published).map(album => ({
        albumId: album.id,
    }));
}

export async function generateMetadata({ params }) {
    const album = INITIAL_ALBUMS.find(a => a.id === params.albumId);
    if (!album) return {};

    const description = album.overview?.[0]?.value
        ? album.overview[0].value.substring(0, 160) + '...'
        : `In-depth review and analysis of ${album.title} by ${album.artist}.`;

    return {
        title: `${album.title} - ${album.artist}`,
        description,
        openGraph: {
            title: `${album.title} - ${album.artist} | Aether Atlas`,
            description,
            images: album.coverImage ? [album.coverImage] : [],
            type: 'music.album',
        },
    };
}

export default function AlbumPage({ params }) {
    const album = INITIAL_ALBUMS.find(a => a.id === params.albumId);
    
    if (!album || !album.published) {
        notFound();
    }

    return <AlbumPageClient album={album} />;
}
