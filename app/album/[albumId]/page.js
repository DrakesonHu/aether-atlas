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
        title: `${album.title} by ${album.artist} - Album Review`,
        description: `Album review: ${description}`,
        keywords: `${album.artist}, ${album.title}, album review, music review, ${album.artist} review, ${album.genre}`,
        openGraph: {
            title: `${album.title} - ${album.artist} Review | Aether Atlas`,
            description: `Album review: ${description}`,
            images: album.coverImage ? [album.coverImage] : [],
            type: 'article',
            url: `https://aetheratlas.net/album/${params.albumId}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${album.title} - ${album.artist} Review`,
            description: `Album review: ${description}`,
            images: album.coverImage ? [album.coverImage] : [],
        },
    };
}

export default function AlbumPage({ params }) {
    const album = INITIAL_ALBUMS.find(a => a.id === params.albumId);

    if (!album || !album.published) {
        notFound();
    }

    const reviewSchema = {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
            "@type": "MusicAlbum",
            "name": album.title,
            "byArtist": {
                "@type": "MusicGroup",
                "name": album.artist
            },
            "image": album.coverImage,
            "genre": album.genre,
            "datePublished": album.date
        },
        "author": {
            "@type": "Person",
            "name": "Aether Atlas"
        },
        "reviewBody": album.overview?.map(block => block.value).join(' ').substring(0, 500) || '',
        "publisher": {
            "@type": "Organization",
            "name": "Aether Atlas",
            "url": "https://aetheratlas.net"
        },
        "datePublished": album.date
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
            />
            <AlbumPageClient album={album} />
        </>
    );
}
