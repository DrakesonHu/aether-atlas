// lib/utils.js - Helper functions

// Helper to display featuring artists when present
export const artistWithFeat = (obj) => {
    if (!obj) return '';
    if (obj.featuring) return `${obj.artist} (feat. ${obj.featuring})`;
    return obj.artist;
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

// Get published albums
export const getPublishedAlbums = (albums) => {
    return albums.filter(album => album.published);
};

// Get published tracks from an album
export const getPublishedTracks = (album) => {
    return album.tracks?.filter(track => track.published) || [];
};
