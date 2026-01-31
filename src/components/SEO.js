import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://aetheratlas.com';

/**
 * SEO Component for dynamic meta tags
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.path - URL path (e.g., '/album/ivy-knight-feet-of-mud')
 * @param {string} props.image - OG image URL
 * @param {string} props.type - OG type (website, article, music.album)
 * @param {Object} props.structuredData - JSON-LD structured data object
 */
const SEO = ({
    title = 'Aether Atlas',
    description = 'A digital journal exploring music through deep analysis and an interactive sonic map.',
    path = '/',
    image = '/graphics/og-image.jpg',
    type = 'website',
    structuredData = null
}) => {
    const fullTitle = title === 'Aether Atlas'
        ? 'Aether Atlas | Music Reviews & Sonic Cartography'
        : `${title} | Aether Atlas`;

    const url = `${BASE_URL}${path}`;
    const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

/**
 * Generate structured data for an album review
 */
export const generateAlbumStructuredData = (album) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
        "@type": "MusicAlbum",
        "name": album.title,
        "byArtist": {
            "@type": "MusicGroup",
            "name": album.artist
        },
        "datePublished": album.date,
        "genre": album.genre,
        "image": album.coverImage ? `${BASE_URL}${album.coverImage}` : undefined
    },
    "author": {
        "@type": "Organization",
        "name": "Aether Atlas"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Aether Atlas",
        "url": BASE_URL
    }
});

/**
 * Generate structured data for a track analysis
 */
export const generateTrackStructuredData = (track, album) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
        "@type": "MusicRecording",
        "name": track.title,
        "byArtist": {
            "@type": "MusicGroup",
            "name": album.artist
        },
        "inAlbum": {
            "@type": "MusicAlbum",
            "name": album.title
        }
    },
    "author": {
        "@type": "Organization",
        "name": "Aether Atlas"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Aether Atlas",
        "url": BASE_URL
    }
});

export default SEO;
