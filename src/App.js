import React, { useState, useEffect, useMemo, useRef } from 'react';
import ATLAS_NODES from './data/atlas_data.json';
import { Play, Pause, Disc, Map as MapIcon, Info, ArrowLeft, ExternalLink, Music, Film, Share2, ChevronDown, List, X, Star, SkipForward, Volume2, Clock } from 'lucide-react';

/**
 * AETHER ATLAS
 * * * DATA DEFINITIONS
 */

// COLORS: "Fallen Angels" / "Lily Chou-Chou" (Muted, Oxidized, Cinematic)
const COLORS = {
    bg: 'bg-[#010a08]', // Deepest organic black/green
    text: 'text-emerald-200/80', // More muted text
    accent: 'text-teal-600', // Washed out teal
    muted: 'text-emerald-900',
    border: 'border-emerald-900/60',
    card: 'bg-[#021a15]/90',
    highlight: 'bg-emerald-500/10',
    flare: 'bg-amber-700/20' // Dimmer warm light
};

// 1. THE BLOG CONTENT 
const INITIAL_ALBUMS = [
    {
        id: 'ivy-knight-feet-of-mud',
        title: 'Feet of Mud',
        artist: 'Ivy Knight',
        releaseType: 'EP',
        date: '2023-10-14',
        genre: 'Indie Bedroom Pop',
        links: { 
            spotify: 'https://open.spotify.com/album/1t1ly0P478lm9FPxeYUIzc?si=e0fT1gmmT06SsVzZnomBnA', 
            apple: 'https://music.apple.com/us/album/feet-of-mud-ep/1633317771', 
            youtube: 'https://www.youtube.com/watch?v=E2LBuCzSGBA&list=OLAK5uy_nWQordJULKVvjZudt9ZDQHmLzIgBXa5nY&pp=0gcJCbYEOCosWNin' },
        overview: [
            { type: 'text', value: "The album feels like the essence of a blurry memory. Each song isn't just music; it's a scene laid out in non-physical space with the noises of the world acting as a window." },
            { type: 'text', value: "This makes my list because of how raw it is. The lyrics read very poetically. Literal description and plain prose is mixed in with lyrics which I feel are much more evocative than syntactically meaningful." },
            { type: 'text', value: "The album consists of guitar and vocals as the sole instruments. But woven into every track is ambience, worldly noise, an almost overdone reverb which borders on muddiness. Ivy Knight is trying to tell you that the instruments and the notes are not the point; it's ultimately what they make when they come together as a whole." }
        ],
        tracks: [
            {
                id: 'ik-1',
                title: 'Something Good',
                content: [
                    { type: 'text', value: "Something good is formant shifted spoken word. It’s like the actual words are intentionally obscured. It sounds and reads almost voyeuristically; it's a moment captured in time, a sort of rant. A monologue. Like a voicemail." },
                    { type: 'lyric', value: "In this song, you are from the outside looking in. There's a clear separation between listener and voice. I picture a scene. A woman is venting, but the camera only shows her." },
                    { type: 'text', value: "The backing synth (and guitar?) have a psychedelic, unstable undertone. There is a noticeable dissonance in the chord progression. It’s actually rather unsettling, but almost dreamy." }
                ]
            },
            {
                id: 'ik-2',
                title: 'Cut the String',
                content: [
                    { type: 'text', value: "A cut. From noise to strums. Like you’re taken from a great beyond—some intermediate space—a limbo—and thrown into something beautiful, but deeply somber underneath." },
                    {
                        type: 'lyric',
                        label: 'Lyrics (Click highlighted lines for analysis)',
                        lines: [
                            {
                                text: "You've got her pressed between the table and your thumb",
                                timestamp: "00:45",
                                annotation: "She is under the thumb of the addressed: trapped, compressed. This line is about power dynamics in the relationship."
                            },
                            {
                                text: "When she's quiet in bed you can't play dumb",
                                timestamp: "01:12",
                                annotation: "This line actually took me a while to understand. But I've landed on a very dark interpretation now after sitting on it. Being \"quiet in bed\" has sequel implications. But why is she quiet? Either she's numb or distressed, or both. So sex has become something entirely separate from love or even something pleasurable. It's become an act of ownership. An entirely asymmetrical exchange. But notice the tone. Ivy takes an almost accusatory or sarcastic tone throughout the song. To me, she sounds almost like a self-loathing internal monologue."
                            },
                            {
                                text: "buried under dirt, she looks pretty with her dress undone",
                                annotation: null
                            }
                        ]
                    },
                    { type: 'text', value: "The imagery is really visceral here. Disgustingly so. It blends erotic imagery with an abusive dynamic. We dip into depravity a lot in this song. And a theme in the album is this contradictory submission." }
                ]
            },
            {
                id: 'ik-3',
                title: 'Salvation',
                content: [
                    { type: 'text', value: "Lyrically, this is my favorite track of the EP. It is truly difficult to articulate its implicit beauty. Salvation is about self-destructive naivety. A song of contradictions." },
                    { type: 'lyric', label: 'Lyrics', value: "I had never seen the snow\nSo I put my hands in until they froze\nAnd I drew an angel with my nose" },
                    { type: 'text', value: "I don’t really know why this hits so hard. Maybe it's the physicality of it. I relate a scary amount. In high school, I would walk my streets at night, barefoot and ungloved. I would return home with my fingers numb and my feet raw. The cold is invigorating." }
                ]
            },
            { id: 'ik-4', title: 'Dog', content: [{ type: 'text', value: "Analysis coming soon." }] }
        ]
    },
    {
        id: 'sweet-trip-ywnkw',
        title: 'You Will Never Know Why',
        artist: 'Sweet Trip',
        releaseType: 'Album',
        date: '2023-11-02',
        genre: 'Dream Pop',
        links: { 
            spotify: 'https://open.spotify.com/album/0kmPn6M3cue7rec6Unw6BD?si=WYBq0MlTTh6STn2XfpMXKg', 
            apple: 'https://music.apple.com/us/album/you-will-never-know-why-2021-remaster/1546560761', 
            youtube: 'https://www.youtube.com/watch?v=57MOxcW7iqo&list=OLAK5uy_luQpEG_NkTi7-z57k9qVGX95vghXAqrCI' },
        overview: [
            { type: 'text', value: "A radical departure from Sweet Trip’s electronic heart in Velocity: Design: Comfort, this album is, at its core, acoustic. It leans into Sweet Trip’s lining of innocent-sounding whimsy, abandoning the complex glitch-pop sound for a lullaby-esque quality." }
        ],
        tracks: [
            {
                id: 'st-1',
                title: 'Milk',
                content: [
                    { type: 'text', value: "Milk is distinctly gentle. Cooper’s lyrics corroborate this dreamy lullaby atmosphere. The song is predominantly second person, which isn’t necessarily a strange choice in and of itself, but stands out from ballads and romantic declarations." },
                    { type: 'lyric', label: 'Lyrics', value: "Sleep on this bed\nTossing and turning you'll never figure out a way" },
                    { type: 'text', value: "These lines form a rather personal choice of imagery. It feels unquestionably raw. It bridges artistic intent with artistic experience. Cooper’s voice, the lyricism, the chord progression, all coalesce into a resounding subtext of 'you are heard'." }
                ]
            },
            { id: 'st-2', title: 'Pretending', content: [{ type: 'text', value: "Analysis coming soon." }] },
            { id: 'st-3', title: 'Air Supply', content: [{ type: 'text', value: "Analysis coming soon." }] }
        ]
    },
    {
        id: 'dean-blunt-crying-nudes',
        title: 'The Crying Nudes',
        artist: 'The Crying Nudes',
        releaseType: 'Album',
        date: '2023-09-10',
        genre: 'Experimental / Art Pop',
        links: { 
            spotify: 'https://open.spotify.com/album/2z41sP07YkiqqdZEY9gU56?si=JKaRBVURTYWxrfX09KA_Lg', 
            apple: 'https://music.apple.com/us/album/the-crying-nudes/1766386907', 
            youtube: 'https://www.youtube.com/watch?v=FZ5L7oLMiE0&list=OLAK5uy_m1ToGxVRtoRL-Kt9mL823BUD3UQtusQfk' },
        overview: [
            { type: 'text', value: "Divergent from most of Dean Blunt's work, The Crying Nudes embodies a gentler, more pop-y persona. While produced by Dean Blunt, this project features Fine, whose voice brings a persistent contrast to Blunt's production." },
            { type: 'text', value: "Blunt’s production fittingly takes on a slightly more optimistic (not always), rhythmic style, but he opts to keep a low-fidelity sound reminiscent of his earlier projects Hype Williams and “Black is Beautiful”." }
        ],
        tracks: [
            { id: 'db-1', title: 'The Crying Nudes', content: [{ type: 'text', value: "Analysis coming soon." }] },
            {
                id: 'db-2',
                title: 'Greaser',
                content: [
                    { type: 'text', value: "“It’s not much of a story”. The LQ sample chop in the background contains the signature hypnotic repetition of Dean Blunt's production. Although the sound is pleasant, its dreaminess hides a subtle sense of longing." }
                ]
            },
            { id: 'db-3', title: 'Smile', content: [{ type: 'text', value: "Analysis coming soon." }] }
        ]
    },
    {
        id: 'cities-aviv-man-plays-horn',
        title: 'Man Plays the Horn',
        artist: 'Cities Aviv',
        releaseType: 'Album',
        date: '2023-08-15',
        genre: 'Experimental Hip Hop',
        links: { 
            spotify: 'https://open.spotify.com/album/1OmF3bAtGjsC8TH7ebyE0f?si=87qZcdPcQHiy_qD9EzszeA', 
            apple: 'https://music.apple.com/us/album/man-plays-the-horn/1607838012', 
            youtube: 'https://www.youtube.com/watch?v=XgiA2tj8S74&list=OLAK5uy_keZb_ofPbEZembcwi6uBLJPbly_5p0FpI' },
        overview: [
            { type: 'text', value: "Cities Aviv has albums ranging from more lyrically-oriented Earl-esque projects such as Working Title for the Album Secret Waters, and albums almost entirely composed of experimental glitchy ambient instrumentals. Man Plays the Horn lies somewhere in between." },
            { type: 'text', value: "Somewhere within this behemoth of a project, there exists pieces of music which feel truly special to me." }
        ],
        tracks: [
            {
                id: 'ca-1',
                title: 'Marina',
                content: [
                    { type: 'text', value: "Marina exudes the same sense of melancholic longing that Standing on the Corner excels at in songs like Vomets and Girl. In fact, they are thematically similar to this song." }
                ]
            },
            { id: 'ca-2', title: 'Head', content: [{ type: 'text', value: "Analysis coming soon." }] }
        ]
    },
    {
        id: 'radiohead-in-rainbows',
        title: 'In Rainbows',
        artist: 'Radiohead',
        releaseType: 'Album',
        date: '2007-10-10',
        genre: 'Art Rock',
        links: { spotify: '#' },
        overview: [{ type: 'text', value: "Art Rock, electronic elements. A masterful blend of warmth and alienation. Review coming soon." }],
        tracks: [
            { id: 'rh-1', title: 'Nude', content: [] },
            { id: 'rh-2', title: 'Weird Fishes', content: [] },
            { id: 'rh-3', title: 'Creep', content: [] }
        ]
    },
    {
        id: 'frank-ocean-blonde',
        title: 'Blonde',
        artist: 'Frank Ocean',
        releaseType: 'Album',
        date: '2016-08-20',
        genre: 'R&B / Soul',
        links: { spotify: 'https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf?si=4Qx4HDvnTROflNfGTpLZBA' },
        overview: [{ type: 'text', value: "Male adolescence, love, identity. A minimalist masterpiece. Review coming soon." }],
        tracks: [
            { id: 'fo-1', title: 'White Ferrari', content: [] },
            { id: 'fo-2', title: 'Seigfried', content: [] }
        ]
    }
];

// 2. THE ATLAS DATA
const SONG_DATABASE = [
    // Ivy Knight
    { id: 'ik-1', title: 'Something Good', artist: 'Ivy Knight', releaseType: 'Album', album: 'Feet of Mud', genre: 'Indie Bedroom Pop', x: 22, y: 78, linkedAlbumId: 'ivy-knight-feet-of-mud', trackId: 'ik-1' },
    { id: 'ik-2', title: 'Cut the String', artist: 'Ivy Knight', releaseType: 'Album', album: 'Feet of Mud', genre: 'Indie Bedroom Pop', x: 28, y: 76, linkedAlbumId: 'ivy-knight-feet-of-mud', trackId: 'ik-2' },
    { id: 'ik-3', title: 'Salvation', artist: 'Ivy Knight', releaseType: 'Album', album: 'Feet of Mud', genre: 'Indie Bedroom Pop', x: 25, y: 72, linkedAlbumId: 'ivy-knight-feet-of-mud', trackId: 'ik-3' },
    { id: 'ik-4', title: 'Dog', artist: 'Ivy Knight', releaseType: 'Album', album: 'Feet of Mud', genre: 'Indie Bedroom Pop', x: 20, y: 80, linkedAlbumId: 'ivy-knight-feet-of-mud', trackId: 'ik-4' },

    // The Crying Nudes
    { id: 'db-1', title: 'The Crying Nudes', artist: 'The Crying Nudes', producer: 'Dean Blunt', releaseType: 'Album', album: 'The Crying Nudes', genre: 'Experimental', x: 42, y: 32, linkedAlbumId: 'dean-blunt-crying-nudes', trackId: 'db-1' },
    { id: 'db-2', title: 'Greaser', artist: 'The Crying Nudes', producer: 'Dean Blunt', releaseType: 'Album', album: 'The Crying Nudes', genre: 'Experimental', x: 38, y: 35, linkedAlbumId: 'dean-blunt-crying-nudes', trackId: 'db-2' },
    { id: 'db-3', title: 'Smile', artist: 'The Crying Nudes', producer: 'Dean Blunt', releaseType: 'Album', album: 'The Crying Nudes', genre: 'Experimental', x: 45, y: 28, linkedAlbumId: 'dean-blunt-crying-nudes', trackId: 'db-3' },

    // Sweet Trip
    { id: 'st-1', title: 'Milk', artist: 'Sweet Trip', releaseType: 'Album', album: 'You Will Never Know Why', genre: 'Dream Pop', x: 62, y: 82, linkedAlbumId: 'sweet-trip-ywnkw', trackId: 'st-1' },
    { id: 'st-2', title: 'Pretending', artist: 'Sweet Trip', releaseType: 'Album', album: 'You Will Never Know Why', genre: 'Dream Pop', x: 65, y: 78, linkedAlbumId: 'sweet-trip-ywnkw', trackId: 'st-2' },
    { id: 'st-3', title: 'Air Supply', artist: 'Sweet Trip', releaseType: 'Album', album: 'You Will Never Know Why', genre: 'Dream Pop', x: 60, y: 85, linkedAlbumId: 'sweet-trip-ywnkw', trackId: 'st-3' },

    // Cities Aviv
    { id: 'ca-1', title: 'Marina', artist: 'Cities Aviv', releaseType: 'Album', album: 'Man Plays the Horn', genre: 'Experimental Hip Hop', x: 35, y: 48, linkedAlbumId: 'cities-aviv-man-plays-horn', trackId: 'ca-1' },
    { id: 'ca-2', title: 'Head', artist: 'Cities Aviv', releaseType: 'Album', album: 'Man Plays the Horn', genre: 'Experimental Hip Hop', x: 32, y: 52, linkedAlbumId: 'cities-aviv-man-plays-horn', trackId: 'ca-2' },

    // Radiohead
    { id: 'rh-1', title: 'Nude', artist: 'Radiohead', releaseType: 'Album', album: 'In Rainbows', genre: 'Art Rock', x: 68, y: 62, linkedAlbumId: 'radiohead-in-rainbows', trackId: 'rh-1' },
    { id: 'rh-2', title: 'Weird Fishes', artist: 'Radiohead', releaseType: 'Album', album: 'In Rainbows', genre: 'Art Rock', x: 72, y: 58, linkedAlbumId: 'radiohead-in-rainbows', trackId: 'rh-2' },
    { id: 'rh-3', title: 'Creep', artist: 'Radiohead', releaseType: 'Single', album: 'Pablo Honey', genre: 'Grunge', x: 15, y: 50, linkedAlbumId: 'radiohead-in-rainbows', trackId: 'rh-3' },

    // Frank Ocean
    { id: 'fo-1', title: 'White Ferrari', artist: 'Frank Ocean', releaseType: 'Album', album: 'Blonde', genre: 'R&B', x: 78, y: 52, linkedAlbumId: 'frank-ocean-blonde', trackId: 'fo-1' },
    { id: 'fo-2', title: 'Seigfried', artist: 'Frank Ocean', releaseType: 'Album', album: 'Blonde', genre: 'R&B', x: 82, y: 48, linkedAlbumId: 'frank-ocean-blonde', trackId: 'fo-2' },
];

/* --- SUBCOMPONENTS --- */

const Navigation = ({ currentView, setView }) => (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-sm border-b border-emerald-900/30 transition-all duration-500">
        <div
            className="text-2xl font-light tracking-[0.2em] cursor-pointer text-teal-700/80 font-display uppercase hover:text-emerald-400 transition-colors"
            onClick={() => setView('home')}
        >
            Aether_Atlas
        </div>
        <div className="flex space-x-8 text-xs font-display font-bold tracking-widest">
            <button
                onClick={() => setView('home')}
                className={`${currentView === 'home' ? 'text-emerald-300' : 'text-emerald-800'} hover:text-emerald-400 transition-colors uppercase`}
            >
                Home
            </button>
            <button
                onClick={() => setView('atlas')}
                className={`${currentView === 'atlas' ? 'text-emerald-300' : 'text-emerald-800'} hover:text-emerald-400 transition-colors uppercase`}
            >
                Atlas
            </button>
            <button
                onClick={() => setView('about')}
                className={`${currentView === 'about' ? 'text-emerald-300' : 'text-emerald-800'} hover:text-emerald-400 transition-colors uppercase`}
            >
                About
            </button>
        </div>
    </nav>
);

const Background = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-visible pointer-events-none bg-[#010a08]">

            {/* Light Leaks / Light Flares - WKW Style (Dimmer) */}
            <div
                className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-teal-800/10 rounded-full blur-[120px] mix-blend-screen opacity-40 animate-pulse-slow"
            />
            <div
                className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-emerald-800/10 rounded-full blur-[150px] mix-blend-screen opacity-30 animate-pulse-slower"
            />

            {/* WKW Horizontal Light Streaks (Dimmer Amber) */}
            <div className="absolute top-[20%] -left-[20%] w-[140%] h-24 bg-amber-800/10 blur-[60px] rotate-[-5deg] animate-streak opacity-30 mix-blend-screen" />
            <div className="absolute bottom-[30%] -right-[20%] w-[140%] h-32 bg-red-900/10 blur-[80px] rotate-[5deg] animate-streak-reverse opacity-20 mix-blend-screen" />

            {/* Dynamic Gradients - Deep Atmospheric */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-950/40 rounded-full blur-[100px] transition-transform duration-1000 ease-out"
                style={{ transform: `translateY(${offset * 0.2}px)` }}
            />
            <div
                className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-[#062c26]/60 rounded-full blur-[100px]"
            />

            {/* VISIBLE GRAIN: full-bleed SVG so noise always reaches edges */}
            {/*
              Use the inline SVG below instead of a CSS background-image when you need
              the noise to reliably cover the entire viewport (no tiling gaps).

              Tweakable parameters (inside the <feTurbulence> element):
              - baseFrequency: finer grain -> larger number (0.6-0.9). coarser -> smaller (0.02-0.2).
              - numOctaves: 1 = simple, 2-4 = more detail.
              - opacity on the SVG: overall strength (0.02 subtle -> 0.3 strong).
              - preserveAspectRatio='none' ensures the SVG stretches to every edge.

              Performance: high baseFrequency + many octaves can be GPU/CPU heavy on some devices.
              For best performance, lower baseFrequency or pre-render a rasterized grain image.
            */}
            {/* Pre-rendered grain overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    top: '-10%',
                    left: 0,
                    width: '100%',
                    height: '120%',
                    opacity: 0.2,
                    backgroundImage: 'url(/grain_turbulence_f0.4_o4.png)',
                    backgroundRepeat: 'repeat',
                    transform: `translateY(${offset * -0.01}px)`
                }}
                aria-hidden="true"
            />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(1,10,8,0.9)_100%)] pointer-events-none" />

            {/* Styles for Google Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;600&display=swap');
        
        .font-display { font-family: 'Inter', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes streak {
          0% { transform: translateX(-10%) rotate(-5deg); opacity: 0.2; }
          50% { transform: translateX(10%) rotate(-5deg); opacity: 0.4; }
          100% { transform: translateX(-10%) rotate(-5deg); opacity: 0.2; }
        }
        @keyframes streak-reverse {
          0% { transform: translateX(10%) rotate(5deg); opacity: 0.1; }
          50% { transform: translateX(-10%) rotate(5deg); opacity: 0.3; }
          100% { transform: translateX(10%) rotate(5deg); opacity: 0.1; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
        .animate-pulse-slower { animation: pulse-slower 12s infinite ease-in-out; }
        .animate-streak { animation: streak 20s infinite ease-in-out; }
        .animate-streak-reverse { animation: streak-reverse 25s infinite ease-in-out; }
      `}</style>
        </div>
    );
};

const PostPreview = ({ album, onClick }) => (
    <div
        className="group relative border-l border-emerald-900/60 pl-6 py-8 cursor-pointer hover:border-teal-700/50 hover:bg-[#021a15]/50 transition-all duration-500"
        onClick={onClick}
    >
        <div className="flex justify-between items-start mb-6">
            <div className="text-xs font-display tracking-widest text-emerald-800 mb-2 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-900 group-hover:bg-teal-700 transition-colors rotate-45"></span>
                {album.date} • {album.genre}
            </div>
            <ArrowLeft className="rotate-180 text-emerald-900 group-hover:text-teal-600 transition-colors opacity-50 group-hover:opacity-100" size={14} />
        </div>

        <h2 className="text-3xl font-body font-light text-emerald-200/90 group-hover:text-white transition-colors mb-2 uppercase tracking-wide">
            {album.title}
        </h2>
        <div className="text-sm font-display text-teal-800 mb-6 tracking-wider">{album.artist}</div>

        <p className="text-emerald-600/70 font-body text-xl leading-relaxed line-clamp-3">
            {album.overview[0]?.value}
        </p>
    </div>
);

// VIEW 1: ALBUM PAGE
const AlbumView = ({ album, onOpenTrack, onBack }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto animate-fade-in">
            <button onClick={onBack} className="mb-12 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-emerald-800 hover:text-teal-600 transition-colors">
                <ArrowLeft size={14} /> Index
            </button>

            <header className="mb-16 border-b border-emerald-900/50 pb-12 relative">
                <div className="flex items-center gap-3 text-teal-700 text-xs font-display uppercase tracking-[0.2em] mb-4">
                    <Disc size={14} /> {album.genre} // {album.releaseType}
                </div>
                <h1 className="text-6xl md:text-8xl font-body font-light text-emerald-200/80 mb-4 leading-tight uppercase tracking-tight">{album.title}</h1>
                <h2 className="text-2xl md:text-3xl font-display font-light text-emerald-700 mb-8 tracking-wider">{album.artist}</h2>
                <div className="flex gap-4">
                    {Object.entries(album.links).map(([platform, url]) => (
                        <a key={platform} href={url} className="px-5 py-2 border border-emerald-900 bg-[#021a15]/30 text-xs font-display uppercase tracking-widest text-emerald-600 hover:bg-emerald-900/50 hover:text-white hover:border-teal-700 transition-all flex items-center gap-2">
                            {platform} <ExternalLink size={10} />
                        </a>
                    ))}
                </div>
            </header>

            {/* 1. ALBUM OVERVIEW */}
            <section className="mb-20">
                <h3 className="text-xs font-display font-bold uppercase tracking-widest text-teal-800 mb-6 flex items-center gap-2">
                    <span className="w-1 h-4 bg-teal-900"></span> Analysis
                </h3>
                <div className="border-l border-emerald-900/40 pl-8 space-y-6">
                    {album.overview.map((block, idx) => (
                        <p key={idx} className="font-body text-xl text-emerald-400/80 leading-relaxed">
                            {block.value}
                        </p>
                    ))}
                </div>
            </section>

            {/* 2. LINKS TO TRACKS */}
            <section>
                <h3 className="text-xs font-display font-bold uppercase tracking-widest text-teal-800 mb-6 flex items-center gap-2">
                    <span className="w-1 h-4 bg-teal-900"></span> Fragments
                </h3>
                <div className="grid gap-1">
                    {album.tracks.map((track, i) => (
                        <div
                            key={track.id}
                            onClick={() => onOpenTrack(track.id)}
                            className="flex items-center justify-between p-5 border-b border-emerald-900/30 hover:bg-emerald-900/10 hover:pl-8 transition-all duration-300 cursor-pointer group"
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-emerald-900 font-display text-xs w-6">{(i + 1).toString().padStart(2, '0')}</span>
                                <span className="text-2xl font-body text-emerald-600/90 group-hover:text-emerald-100 transition-colors uppercase tracking-wide">{track.title}</span>
                            </div>
                            <div className="text-emerald-800 text-xs font-display tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">READ &gt;</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// NEW: Lyric Line with CLICK-TO-OPEN Analysis (Sharp/Elegant Style)
const LyricLine = ({ line }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    if (!line.annotation) {
        return <div>{line.text}</div>;
    }

    return (
        <div className="relative inline-block w-full mb-1">
            {/* Clickable Line */}
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`cursor-pointer transition-all duration-300 border-b ${isOpen ? 'text-emerald-100 border-teal-600 bg-teal-900/20' : 'text-emerald-500/80 border-emerald-900/60 hover:text-emerald-200 hover:border-teal-700'}`}
            >
                {line.text}
            </span>

            {/* Sharp Popup with Timestamps */}
            {isOpen && (
                <div ref={popupRef} className="absolute left-0 top-full mt-4 w-full md:w-[120%] z-30 animate-fade-in">
                    <div className="bg-[#021a15] border border-teal-800/40 p-0 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">

                        {/* Decorative Sharp Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-teal-800/60"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-teal-800/60"></div>

                        {/* Connector Line */}
                        <div className="absolute top-0 left-8 -mt-2 w-[1px] h-2 bg-teal-800/60"></div>

                        {/* Header Bar */}
                        <div className="bg-teal-900/10 border-b border-teal-800/20 px-6 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="text-[10px] font-display font-bold uppercase tracking-widest text-teal-600">Annotation</div>
                                {line.timestamp && (
                                    <div className="flex items-center gap-1 text-[10px] font-display text-emerald-700">
                                        <Clock size={10} />
                                        {line.timestamp}
                                    </div>
                                )}
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-emerald-800 hover:text-white"><X size={12} /></button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="prose prose-invert prose-sm font-body text-lg text-emerald-300/90 leading-relaxed">
                                {line.annotation}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// VIEW 2: TRACK PAGE
const TrackView = ({ track, album, onBack }) => {
    useEffect(() => { window.scrollTo(0, 0); }, [track]);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto animate-fade-in">
            <button onClick={onBack} className="mb-8 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-emerald-800 hover:text-teal-600 transition-colors">
                <ArrowLeft size={14} /> // {album.title}
            </button>

            <div className="mb-12 border-b border-emerald-900/50 pb-6">
                <h1 className="text-5xl md:text-7xl font-body font-light text-emerald-200/90 mb-2 uppercase tracking-wide">{track.title}</h1>
                <div className="text-teal-700 font-display text-xs tracking-widest uppercase flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-700 rotate-45"></span>
                    Track Analysis
                </div>
            </div>

            <article className="prose prose-invert prose-lg max-w-none pl-4 border-l border-emerald-900/20">
                {track.content.length > 0 ? track.content.map((block, idx) => {
                    if (block.type === 'lyric') {
                        const lines = block.lines || block.value.split('\n').map(l => ({ text: l, annotation: null }));

                        return (
                            <div key={idx} className="my-12 pl-8 border-l border-teal-900/30 italic text-emerald-500/80 font-body leading-loose text-2xl relative">
                                {block.label && <div className="text-[10px] not-italic uppercase tracking-widest text-emerald-800 mb-4 font-display">{block.label}</div>}
                                {lines.map((line, i) => (
                                    <LyricLine key={i} line={line} />
                                ))}
                            </div>
                        );
                    }
                    return (
                        <p key={idx} className="font-body text-xl text-emerald-300/70 leading-relaxed mb-8">
                            {block.value}
                        </p>
                    );
                }) : (
                    <div className="text-emerald-800 italic font-body text-lg">No data available.</div>
                )}
            </article>
        </div>
    );
};

/* --- THE ATLAS (MDS VISUALIZATION) --- */

const AtlasMap = ({ songs, onSelectSong }) => {
    
    const [category, setCategory] = useState(null);
    const [selection, setSelection] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSelectionOpen, setIsSelectionOpen] = useState(false);
    const dropdownRef = useRef(null);

    // NEW: Zoom and pan state
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const mapRef = useRef(null);
    const zoomRef = useRef(1);
    const panRef = useRef({ x: 0, y: 0 });

    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 4;

    // Keep refs synced
    useEffect(() => {
        zoomRef.current = zoom;
    }, [zoom]);

    useEffect(() => {
        panRef.current = pan;
    }, [pan]);

    // Wheel zoom handler
    useEffect(() => {
        const mapEl = mapRef.current;
        if (!mapEl) return;
        
        const wheelHandler = (e) => {
            e.preventDefault();
            
            const currentZoom = zoomRef.current;
            const currentPan = panRef.current;
            
            const rect = mapEl.getBoundingClientRect();
            
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const contentX = (mouseX - currentPan.x) / currentZoom;
            const contentY = (mouseY - currentPan.y) / currentZoom;
            
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom * delta));
            
            const newPanX = mouseX - contentX * newZoom;
            const newPanY = mouseY - contentY * newZoom;
            
            setZoom(newZoom);
            setPan({ x: newPanX, y: newPanY });
        };
        
        mapEl.addEventListener('wheel', wheelHandler, { passive: false });
        return () => mapEl.removeEventListener('wheel', wheelHandler);
    }, []);
    // Handle pan start
    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // left click only
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    // Handle pan move
    const handleMouseMove = (e) => {
        if (!isPanning) return;
        setPan({
            x: e.clientX - panStart.x,
            y: e.clientY - panStart.y
        });
    };

    // Handle pan end
    const handleMouseUp = () => {
        setIsPanning(false);
    };

    // Reset view
    const resetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    // Attach wheel listener (need passive: false to preventDefault)
        useEffect(() => {
            const mapEl = mapRef.current;
            if (!mapEl) return;
            
            const wheelHandler = (e) => {
                e.preventDefault();
                
                const rect = mapEl.getBoundingClientRect();
                
                // Mouse position relative to container
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                // Point in content space before zoom
                const contentX = (mouseX - pan.x) / zoom;
                const contentY = (mouseY - pan.y) / zoom;
                
                // New zoom level
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * delta));
                
                // Adjust pan so the point under mouse stays in place
                const newPanX = mouseX - contentX * newZoom;
                const newPanY = mouseY - contentY * newZoom;
                
                setZoom(newZoom);
                setPan({ x: newPanX, y: newPanY });
            };
            
            mapEl.addEventListener('wheel', wheelHandler, { passive: false });
            return () => mapEl.removeEventListener('wheel', wheelHandler);
        }, [zoom, pan]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
                setIsSelectionOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prepare display coordinates: auto-center and uniform scale to fit map nicely
    const prepared = useMemo(() => {
        if (!songs || !songs.length) return [];
        const xs = songs.map(s => Number(s.x || 0));
        const ys = songs.map(s => Number(s.y || 0));
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const dataWidth = maxX - minX || 1;
        const dataHeight = maxY - minY || 1;
        const maxExtent = Math.max(dataWidth, dataHeight) / 2 || 1;
        const pad = 6; // percent padding from edges
        const scale = (50 - pad) / maxExtent; // uniform scale for both axes

        return songs.map(s => {
            const sx = Number(s.x || 0);
            const sy = Number(s.y || 0);
            let dx = 50 + (sx - centerX) * scale;
            let dy = 50 + (sy - centerY) * scale;
            dx = Math.max(pad, Math.min(100 - pad, dx));
            dy = Math.max(pad, Math.min(100 - pad, dy));
            // merge metadata from SONG_DATABASE (authoritative)
            const meta = SONG_DATABASE.find(d => d.id === s.id) || {};
            return {
                ...s,
                displayX: dx,
                displayY: dy,
                title: meta.title || s.title || '',
                artist: meta.artist || s.artist || '',
                album: meta.album || s.album || '',
                genre: meta.genre || s.genre || '',
                producer: meta.producer || s.producer || null,
                releaseType: meta.releaseType || s.releaseType || 'Single'
            };
        });
    }, [songs]);

    const options = useMemo(() => {
    if (!category || !prepared) return [];
    return [...new Set(prepared.map(s => s[category]))].filter(Boolean).sort();
}, [category, prepared]);

    // Use nearest neighbors to create a constellation mesh based on prepared coords
    const connections = useMemo(() => {
        const edges = [];
        prepared.forEach((songA, i) => {
            const distances = prepared.map((songB, j) => {
                if (i === j) return { idx: j, dist: Infinity };
                const dx = songA.displayX - songB.displayX;
                const dy = songA.displayY - songB.displayY;
                return { idx: j, dist: Math.sqrt(dx * dx + dy * dy) };
            });
            distances.sort((a, b) => a.dist - b.dist);
            distances.slice(0, 4).forEach(d => {
                const songB = prepared[d.idx];
                edges.push({ start: songA, end: songB });
            });
        });
        return edges;
    }, [prepared]);

    const clusterData = useMemo(() => {
        if (!selection || !category || !prepared) return null;
        const matchingSongs = prepared.filter(s => s[category] === selection);
        if (matchingSongs.length === 0) return null;

        const count = matchingSongs.length;
        const avgX = matchingSongs.reduce((sum, s) => sum + s.displayX, 0) / count;
        const avgY = matchingSongs.reduce((sum, s) => sum + s.displayY, 0) / count;

        let maxDist = 0;
        matchingSongs.forEach(s => {
            const dist = Math.sqrt(Math.pow(s.displayX - avgX, 2) + Math.pow(s.displayY - avgY, 2));
            if (dist > maxDist) maxDist = dist;
        });

        const radius = Math.max(maxDist, 2);
        const hue = 120 + Math.floor((avgX * 2 + avgY) % 100);
        return { x: avgX, y: avgY, radius, hue };
    }, [selection, category, prepared]);

    useEffect(() => { setSelection(null); }, [category]);

    if (!songs) return <div>Loading Atlas Data...</div>;

    return (
        // REMOVED overflow-hidden here to fix cutoff
        <div className="h-screen w-full pt-20 px-4 md:px-12 flex flex-col animate-fade-in overflow-visible relative">
            {/* UI CONTROLS */}
            <div className="absolute top-24 left-8 z-20 flex gap-4" ref={dropdownRef}>
                <div className="relative">
                    <button
                        onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsSelectionOpen(false); }}
                        className="flex items-center gap-2 px-6 py-3 bg-[#021a15] border border-emerald-900 text-xs font-display uppercase tracking-widest text-emerald-600 hover:text-white hover;border-teal-700 transition-all shadow-lg"
                    >
                        {category ? category : "Filter Map"} <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCategoryOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-[#021a15] border border-emerald-900 shadow-2xl overflow-hidden z-30">
                            {['artist', 'album', 'genre'].map(cat => (
                                <div
                                    key={cat}
                                    onClick={() => { setCategory(cat); setIsCategoryOpen(false); setIsSelectionOpen(true); }}
                                    className="px-6 py-4 text-xs font-display uppercase tracking-widest text-emerald-500 hover:bg-emerald-900/30 hover:text-white cursor-pointer transition-colors"
                                >
                                    {cat}
                                </div>
                            ))}
                            <div
                                onClick={() => { setCategory(null); setSelection(null); setIsCategoryOpen(false); }}
                                className="px-6 py-4 text-xs font-display uppercase tracking-widest text-red-400 hover:bg-emerald-900/30 cursor-pointer border-t border-emerald-900"
                            >
                                Reset
                            </div>
                        </div>
                    )}
                </div>

                {category && (
                    <div className="relative">
                        <button
                            onClick={() => setIsSelectionOpen(!isSelectionOpen)}
                            className="flex items-center gap-2 px-6 py-3 bg-[#021a15] border border-emerald-900 text-xs font-display uppercase tracking-widest text-teal-600 hover:text-white hover;border-teal-700 transition-all shadow-lg"
                        >
                            {selection ? selection : `Select ${category}`} <ChevronDown size={14} className={`transition-transform duration-300 ${isSelectionOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSelectionOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 max-h-60 overflow-y-auto bg-[#021a15] border border-emerald-900 shadow-2xl z-30">
                                {options.map(opt => (
                                    <div
                                        key={opt}
                                        onClick={() => { setSelection(opt); setIsSelectionOpen(false); }}
                                        className="px-6 py-4 text-xs font-display uppercase tracking-widest text-emerald-500 hover:bg-emerald-900/30 hover:text-white cursor-pointer border-b border-emerald-900/30 last:border-0 transition-colors"
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

    {/* Map container with zoom/pan */}
    <div
        ref={mapRef}
        className={`flex-grow relative overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
    <div
        className="absolute inset-0 origin-top-left transition-transform duration-75"
        style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
    >
    {/* Map Grid - scales with zoom, fades at edges */}
    <div 
        className="absolute inset-0 opacity-[0.08]" 
        style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 2px)`,
            backgroundSize: `${60 / zoom}px ${60 / zoom}px`,
            maskImage: `radial-gradient(ellipse 80% 80% at center, black 40%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(ellipse 80% 80% at center, black 40%, transparent 100%)`
        }}
    />

        {/* CLUSTER HIGHLIGHT */}
        {clusterData && (
            <div
                className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out"
                style={{
                    left: `${clusterData.x}%`,
                    top: `${clusterData.y}%`,
                    width: `${clusterData.radius + 5}%`,
                    height: `${clusterData.radius + 5}%`,
                    backgroundColor: `hsla(${clusterData.hue}, 25%, 30%, 0.3)`,
                    filter: `blur(${clusterData.radius * 7}px)`,
                    borderRadius: '50%',
                }}
            />
        )}

        {/* CONSTELLATION MESH */}
<svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
    <defs>
        {connections.map((edge, i) => {
            const isHoveredConnection = hoveredNode && (edge.start.id === hoveredNode || edge.end.id === hoveredNode);
            const startSelected = selection && edge.start[category] === selection;
            const endSelected = selection && edge.end[category] === selection;
            const isFilteredConnection = startSelected && endSelected;
            const isPartialConnection = (startSelected || endSelected) && !(startSelected && endSelected);
            
            // Only create gradients for special states
            if (!isHoveredConnection && !isFilteredConnection && !isPartialConnection) return null;
            
            let startColor, midColor, endColor;
            
            if (isHoveredConnection) {
                // Hover: bright at hovered node
                startColor = edge.start.id === hoveredNode ? "rgba(255,255,255,0.9)" : "rgba(45,212,191,0.2)";
                endColor = edge.end.id === hoveredNode ? "rgba(255,255,255,0.9)" : "rgba(45,212,191,0.2)";
                midColor = "rgba(45,212,191,0.7)";
            } else if (isFilteredConnection) {
                // Both ends in filter: full gradient
                startColor = "rgba(45,212,191,0.7)";
                midColor = "rgba(94,234,212,0.4)";
                endColor = "rgba(45,212,191,0.7)";
            } else if (isPartialConnection) {
                // One end in filter: fade out to non-selected
                startColor = startSelected ? "rgba(45,212,191,0.5)" : "rgba(16,185,129,0.05)";
                endColor = endSelected ? "rgba(45,212,191,0.5)" : "rgba(16,185,129,0.05)";
                midColor = "rgba(20,184,166,0.2)";
            }
            
            return (
                <linearGradient
                    key={`grad-${i}`}
                    id={`lineGrad-${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={`${edge.start.displayX}%`}
                    y1={`${edge.start.displayY}%`}
                    x2={`${edge.end.displayX}%`}
                    y2={`${edge.end.displayY}%`}
                >
                    <stop offset="0%" stopColor={startColor} />
                    <stop offset="50%" stopColor={midColor} />
                    <stop offset="100%" stopColor={endColor} />
                </linearGradient>
            );
        })}
    </defs>
    
    {connections.map((edge, i) => {
        const startSelected = selection && edge.start[category] === selection;
        const endSelected = selection && edge.end[category] === selection;
        const isHoveredConnection = hoveredNode && (edge.start.id === hoveredNode || edge.end.id === hoveredNode);
        const isFilteredConnection = startSelected && endSelected;
        const isPartialConnection = (startSelected || endSelected) && !(startSelected && endSelected);

        let strokeColor = "rgba(16, 185, 129, 0.4)";
        let strokeWidth = 0.5;
        let useGradient = false;
        let glowFilter = 'none';

        if (selection) {
            if (isFilteredConnection) {
                strokeWidth = 1.5;
                useGradient = true;
                glowFilter = 'drop-shadow(0 0 4px rgba(45,212,191,0.4))';
            } else if (isPartialConnection) {
                strokeWidth = 0.8;
                useGradient = true;
            } else {
                strokeColor = "rgba(6, 78, 59, 0.1)";
            }
        }

        if (isHoveredConnection) {
            strokeWidth = 2;
            useGradient = true;
            glowFilter = 'drop-shadow(0 0 8px rgba(45,212,191,0.8))';
        }

        const scaledStrokeWidth = strokeWidth / zoom;

        return (
            <line
                key={i}
                x1={`${edge.start.displayX}%`}
                y1={`${edge.start.displayY}%`}
                x2={`${edge.end.displayX}%`}
                y2={`${edge.end.displayY}%`}
                stroke={useGradient ? `url(#lineGrad-${i})` : strokeColor}
                strokeWidth={scaledStrokeWidth}
                className="transition-all duration-150"
                style={{ filter: glowFilter }}
            />
        );
    })}
</svg>


            {/* NODES */}
            {prepared.map((song) => {
            const isDimmed = selection && song[category] !== selection;
            const isSelected = selection && song[category] === selection;
            const isHovered = hoveredNode === song.id;
            const rotation = (song.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 13) % 360;

            // Determine scale based on state
            let nodeScale = 1;
            if (isDimmed) nodeScale = 0.7;
            if (isSelected) nodeScale = 1.3;
            if (isHovered) nodeScale = 1.8;

            // Determine glow based on state
            let starClass = 'text-emerald-500 drop-shadow-[0_0_5px_rgba(20,184,166,0.3)]';
            if (isSelected) starClass = 'text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]';
            if (isHovered) starClass = 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]';

            return (
                <div
                    key={song.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 cursor-pointer group z-10"
                    style={{ 
                        left: `${song.displayX}%`, 
                        top: `${song.displayY}%`, 
                        opacity: isDimmed ? 0.25 : 1,
                        width: `${40 / zoom}px`,
                        height: `${40 / zoom}px`,
                    }}
                    onMouseEnter={() => setHoveredNode(song.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectSong(song.linkedAlbumId, song.trackId);
                    }}
                >
                    <div 
                        style={{ 
                            transform: `rotate(${rotation}deg) scale(${nodeScale / zoom})`,
                        }} 
                        className="transition-all duration-300 ease-out"
                    >
                        <svg 
                            viewBox="0 0 24 24" 
                            className={`relative w-3 h-3 transition-all duration-300 ease-out ${starClass}`} 
                            fill="currentColor"
                        >
                            <path d="M12 4L14 10L20 12L14 14L12 20L10 14L4 12L10 10Z" />
                        </svg>
                    </div>

                    {/* Tooltip */}
                    <div 
                        className={`absolute top-8 left-1/2 w-max max-w-[240px] bg-[#021a15]/95 border border-emerald-900 px-4 py-3 shadow-2xl pointer-events-none transition-all duration-300 z-50 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                        style={{ transform: `translateX(-50%) scale(${1 / zoom})`, transformOrigin: 'top center' }}
                    >
                        <div className="text-[10px] text-teal-500 font-display uppercase tracking-widest mb-1 flex flex-col">
                            <span className="font-medium normal-case">{song.artist || 'Unknown Artist'}</span>
                            {song.producer && <span className="text-emerald-700 text-[9px] normal-case tracking-wide">Prod. {song.producer}</span>}
                        </div>
                        <div className="text-sm font-body text-white mb-2 leading-tight font-semibold">{song.title || song.trackId || 'Unknown Track'}</div>
                        <div className="pt-2 border-t border-emerald-900/50 flex flex-col gap-0.5">
                            <div className="text-[9px] text-emerald-600 uppercase tracking-wider font-display">
                                {song.releaseType === 'Single' ? 'Single' : (song.album || 'Album')}
                            </div>
                            <div className="text-[9px] text-emerald-800 uppercase tracking-wider font-display">
                                {song.genre || ''}
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-30">
            <button
                onClick={() => setZoom(z => Math.min(MAX_ZOOM, z * 1.2))}
                className="w-10 h-10 bg-[#021a15] border border-emerald-900 text-emerald-500 hover:text-white hover:border-teal-700 transition-colors flex items-center justify-center text-lg font-bold"
            >
                +
            </button>
            <button
                onClick={() => setZoom(z => Math.max(MIN_ZOOM, z / 1.2))}
                className="w-10 h-10 bg-[#021a15] border border-emerald-900 text-emerald-500 hover:text-white hover:border-teal-700 transition-colors flex items-center justify-center text-lg font-bold"
            >
                −
            </button>
            <button
                onClick={resetView}
                className="w-10 h-10 bg-[#021a15] border border-emerald-900 text-emerald-500 hover:text-white hover:border-teal-700 transition-colors flex items-center justify-center text-xs font-display"
            >
                1:1
            </button>
        </div>

            {/* Zoom indicator */}
            <div className="absolute top-24 right-8 text-xs text-emerald-700 font-display">
                {Math.round(zoom * 100)}%
            </div>
        </div>

            <div className="absolute bottom-8 left-8 text-[10px] text-emerald-800 font-display uppercase tracking-widest max-w-xs leading-relaxed">
                Visualization generated via Similarity Ranking (NMDS). <br />
                Distance represents aesthetic dissimilarity. <br />
                Proximity correlates to shared phenomenological traits.
            </div>
        </div>
    );
};

/* --- MAIN APP --- */

export default function AetherAtlas() {
    const [currentView, setCurrentView] = useState('home');
    const [activeAlbumId, setActiveAlbumId] = useState(null);
    const [activeTrackId, setActiveTrackId] = useState(null);

    const handleOpenAlbum = (albumId) => {
        setActiveAlbumId(albumId);
        setActiveTrackId(null);
        setCurrentView('album');
    };

    const handleOpenTrack = (albumId, trackId) => {
        setActiveAlbumId(albumId);
        setActiveTrackId(trackId);
        setCurrentView('track');
    };

    const renderContent = () => {
        if (currentView === 'track' && activeAlbumId && activeTrackId) {
            const album = INITIAL_ALBUMS.find(p => p.id === activeAlbumId);
            const track = album?.tracks.find(t => t.id === activeTrackId);
            if (!album || !track) return <div>Data Corrupted</div>;
            return <TrackView track={track} album={album} onBack={() => setCurrentView('album')} />;
        }

        if (currentView === 'album' && activeAlbumId) {
            const album = INITIAL_ALBUMS.find(p => p.id === activeAlbumId);
            if (!album) return <div>Data Missing</div>;
            return <AlbumView album={album} onOpenTrack={(trackId) => handleOpenTrack(activeAlbumId, trackId)} onBack={() => setCurrentView('home')} />;
        }

        if (currentView === 'atlas') {
            return <AtlasMap songs={ATLAS_NODES} onSelectSong={(albumId, trackId) => handleOpenTrack(albumId, trackId)} />;
        }

        if (currentView === 'about') {
            return (
                <div className="min-h-screen pt-32 px-6 max-w-2xl mx-auto animate-fade-in">
                    <h1 className="text-4xl font-display font-light text-white mb-8 uppercase tracking-widest">About the Aether</h1>
                    <div className="prose prose-invert prose-p:font-body prose-p:text-xl prose-p:text-emerald-200/80 prose-p:leading-relaxed">
                        <p>Aether Atlas is a digital garden focused on experimental music, film, and the phenomenology of aesthetic experience.</p>
                        <p>Operating within algorithmic curation parameters, this space slows down data consumption. It serves as a static repository for deep listening.</p>
                    </div>
                    <div className="mt-12 pt-12 border-t border-emerald-900 text-xs text-emerald-800 font-display uppercase tracking-widest">© {new Date().getFullYear()} Aether Atlas. All rights reserved.</div>
                </div>
            );
        }

        return (
            <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto animate-fade-in">
                <header className="mb-24 text-center">
                    <h1 className="text-6xl md:text-9xl font-body font-light text-white mb-6 tracking-tight uppercase drop-shadow-[0_0_15px_rgba(20,184,166,0.1)]">Aether_Atlas</h1>
                    <p className="text-xs md:text-sm font-display tracking-[0.3em] text-emerald-600 uppercase">Mapping the phenomenology of sound</p>
                </header>

                <section className="mb-24 relative group cursor-pointer" onClick={() => handleOpenAlbum(INITIAL_ALBUMS[0].id)}>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative border border-emerald-900 p-8 md:p-12 bg-[#021a15]/30 hover:bg-[#021a15]/60 transition-colors duration-300">
                        <div className="absolute top-0 right-0 bg-emerald-900 text-emerald-100 text-[10px] font-display uppercase px-3 py-1 tracking-widest">New Entry</div>
                        <div className="text-xs font-display tracking-widest text-teal-700 mb-4 uppercase">Latest Feature</div>
                        <h2 className="text-4xl font-body font-light text-white mb-6 uppercase tracking-wide">Ivy Knight: The Sound of a Blurry Memory</h2>
                        <p className="text-lg text-emerald-200/70 font-body leading-relaxed max-w-3xl">"This album feels like the essence of a blurry memory. Each song isn't just music; it's a scene laid out in non-physical space..."</p>
                        <div className="mt-8 flex items-center gap-2 text-xs text-emerald-500 uppercase tracking-widest font-display group-hover:text-white transition-colors">Access Data <ArrowLeft className="rotate-180" size={12} /></div>
                    </div>
                </section>

                <div className="grid gap-12">
                    {INITIAL_ALBUMS.slice(1).map(album => (
                        <PostPreview key={album.id} album={album} onClick={() => handleOpenAlbum(album.id)} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen ${COLORS.bg} ${COLORS.text} font-sans selection:bg-teal-900 selection:text-white relative z-10`}>
            <Background />
            <Navigation currentView={currentView} setView={setCurrentView} />
            {renderContent()}
        </div>
    );
}
