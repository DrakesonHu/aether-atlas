// lib/utils.js - Helper functions

// Helper to display featuring artists when present
export const artistWithFeat = (obj) => {
    if (!obj) return '';
    if (obj.featuring) return `${obj.artist} (feat. ${obj.featuring})`;
    return obj.artist;
};

// Slugify a string for URL-friendly paths
export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars except -
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start
        .replace(/-+$/, '');         // Trim - from end
};

// Get slug for a track (artist-title format for uniqueness)
export const getTrackSlug = (track, album) => {
    // Use just the track title - simpler and cleaner URLs
    return slugify(track.title);
};

// Get album by ID
export const getAlbumById = (albums, id) => {
    return albums.find(album => album.id === id);
};

// Get track by ID across all albums
export const getTrackById = (albums, trackId) => {
    for (const album of albums) {
        const track = album.tracks?.find(t => t.id === trackId);
        if (track) {
            return { track, album };
        }
    }
    return null;
};

// Get track by slug across all albums
export const getTrackBySlug = (albums, slug) => {
    for (const album of albums) {
        for (const track of album.tracks || []) {
            if (slugify(track.title) === slug) {
                return { track, album };
            }
        }
    }
    return null;
};

// Get published albums
export const getPublishedAlbums = (albums) => {
    return albums.filter(album => album.published);
};

// Get published tracks from an album
export const getPublishedTracks = (album) => {
    return album.tracks?.filter(track => track.published) || [];
};
