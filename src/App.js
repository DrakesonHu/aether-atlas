import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import ATLAS_NODES from './data/atlas_data.json';
import { Disc, ArrowLeft, ExternalLink, X, Clock, ChevronDown } from 'lucide-react';
import CookieConsent from './components/CookieConsent';
import SEO, { generateAlbumStructuredData, generateTrackStructuredData } from './components/SEO';
import {
    trackPageView,
    trackAlbumView,
    trackTrackView,
    trackAtlasInteraction,
    trackViewModeChange,
    trackGradientAxisChange,
    trackFilterSelect,
    trackNodeInteraction
} from './analytics';

// Lazy load 3D components at module level to prevent re-import
const AtlasMap3D = lazy(() => import('./components/AtlasMap3D'));
const MiniAtlasPreview = lazy(() => import('./components/MiniAtlasPreview'));

/**
 * AETHER ATLAS
 * * * DATA DEFINITIONS
 */

// COLORS: Dark Atlas + Light Cream Reading theme
const COLORS = {
    // Atlas theme (dark)
    atlas: {
        bg: 'bg-transparent', // Background component handles the actual bg
        text: 'text-slate-200',
        accent: 'text-slate-cool-400',
        muted: 'text-slate-cool-600',
        border: 'border-slate-cool-700',
        card: 'bg-slate-900/80',
        highlight: 'bg-amber-500/20',
        flare: 'bg-amber-500/30'
    },
    // Reading theme (light)
    reading: {
        bg: 'bg-cream/80',
        text: 'text-charcoal',
        accent: 'text-terracotta',
        muted: 'text-slate-500',
        border: 'border-warm-gray',
        card: 'bg-white/90',
        highlight: 'bg-rust/10',
        flare: 'bg-rust/20'
    }
};

// PARALLAX CONFIGURATION
const PARALLAX_CONFIG = {
    // How much the items move based on mouse/pan
    // Higher = more movement
    layers: {
        // pan positive for 2D to move with pan (sticky effect)
        // increase pan sensitivity for 2D visibility
        deep: { mouse: -200, pan: 0.8, scroll: 0.1, rotation: 10 },
        mid: { mouse: -350, pan: 1.2, scroll: 0.2, rotation: 20 },
        streak: { mouse: -500, pan: 1.5, scroll: 0.3, rotation: 30 }
    },
    // Animation speeds (ms)
    transitions: {
        deep: 1400, // slower for "heavier" feel
        mid: 1100,
        streak: 800
    },
    // Rotation dampening factor for 3D (limit the "tilt")
    rotationDampener: 35 // Increased from 25 for more obvious tilt
};

// Helper to display featuring artists when present
const artistWithFeat = (obj) => {
    if (!obj) return '';
    if (obj.featuring) return `${obj.artist} (feat. ${obj.featuring})`;
    return obj.artist;
};

// 1. THE BLOG CONTENT 
const INITIAL_ALBUMS = [
    {
        id: 'ivy-knight-feet-of-mud',
        title: 'Feet of Mud',
        artist: 'Ivy Knight',
        coverImage: '/graphics/covers/feet-of-mud.jpg',
        releaseType: 'EP',
        date: '2023-10-14',
        genre: 'Pop',
        published: true,
        links: {
            spotify: 'https://open.spotify.com/album/1t1ly0P478lm9FPxeYUIzc?si=e0fT1gmmT06SsVzZnomBnA',
            apple: 'https://music.apple.com/us/album/feet-of-mud-ep/1633317771',
            youtube: 'https://www.youtube.com/watch?v=E2LBuCzSGBA&list=OLAK5uy_nWQordJULKVvjZudt9ZDQHmLzIgBXa5nY&pp=0gcJCbYEOCosWNin'
        },
        overview: [
            { type: 'text', value: "This album feels like the essence of a blurry memory. Each song is a scene laid out in non-physical space, with the noises of the world acting as texture. I can picture a different setting for each song, and across the EP, it moves from place to place in dreamlike disjointedness." },
            { type: 'text', value: "The lyrics are poetry. I really admire Ivy's use of imagery, much of which is more evocative than literal. The actual music isn't particularly innovative structurally, but it's distinctly atmospheric. The album consists of guitar and vocals as essentially the sole instruments. But woven into every track is ambience, worldly noise, an almost overdone reverb which borders on muddiness, and some interesting mixing choices which are undoubtedly intentional. The instrumentals are often muffled. It takes a step back from the usual technique—rather than trying to present every tone as distinctly and clearly as possible, it intentionally obscures the instrumentals, as if Ivy Knight is trying to tell you that the instruments and the notes are not the point; it's ultimately what they make when they come together as a whole. And perhaps that muddiness is the point—Feet of Mud is as much about the texture of the sound as it is about the songs themselves. The title becomes literal: you're standing in it, feeling the weight and obscurity, the way clarity dissolves into something heavier and more visceral." },
            { type: 'text', value: "If we trace a thread through the EP, a story begins to emerge. But Ivy doesn’t smash it into our face forcefully. For a long time, I had trouble interpreting a literal meaning behind this EP. But after a closer reading, I find a series of vignettes, each its own bubble in a larger narrative of abuse. I have to applaud Ivy for the way she approaches the topic. It feels unbelievably raw—just short of actual lived experience. She discusses the quiet moments, the psychological cesspool, the grinding stress, and the twisted normalization of such situations. And although I haven’t experienced something like this myself, I find a sort of emotional resonance with the project. I am reminded of Oyasumi Punpun when I listen to this EP—or All About Lily Chou Chou. The messiness of the psyche is on full display here. And I have a bit of an unhealthy obsession with art that lies in this sphere. Maybe that’s why I love this EP so much. This isn’t a particularly popular or well-praised project, but it might contain some of my favorite songs of all time. I hope that anyone reading this will spend some time looking into this deep, amazing project." }
        ],
        tracks: [
            {
                id: 'ik-1',
                title: 'Something Good',
                published: true,
                content: [
                    { type: 'text', value: "Something good is formant shifted spoken word. It’s like the actual words are intentionally obscured. It sounds and reads almost voyeuristically; it's a moment captured in time, a sort of rant. A monologue. Like a voicemail." },
                    { type: 'text', value: "In this song, you are from the outside looking in. There's a clear separation between listener and voice. I picture a scene. A woman is venting, but the camera only shows her. She speaks as if someone's there, but who is it? The receiver of the word is strikingly absent. The backing synth (and guitar?) have a psychedelic, unstable undertone. There isn't much to the chords. The synth is slightly offset and ununified. Mismatched and lazy sounding. Almost eerie, as it makes it sound like something is about to come for the entire song, and then it just ends. There is a noticeable dissonance in the chord progression. It’s actually rather unsettling, but almost dreamy." },
                    { type: 'text', value: "I really admire how layered this track is. It's more of a scene than a song. Most songs capture a particular story or vibe. They come together with a narrative. A theme. But this song seems to avoid that entirely. We’re constantly held in suspense. There is no resolution. The narrative is disjointed. We, as the listener, are left to piece it together. The final monologue, which sounds like a voicemail, reminds me of standing on the corner’s spoken word poetry. There's a calm cadence to it. And it doesn't quite belong. So we have a track that doesn’t finish. It doesn’t even stick together. I think it kind of speaks to the way we actually remember. There are huge gaps in our memory. What we perceive as a narrative in memory is really pieced together. And there's so much uncertainty. The past never ends. And yet it does." }
                ]
            },
            {
                id: 'ik-2',
                title: 'Cut the String',
                published: true,
                content: [
                    { type: 'text', value: "We suddenly cut from the intro, from melting synths to gentle strums. Like you’re taken from a great beyond—some intermediate space—a limbo—and thrown into something beautiful, but deeply somber underneath. \"Cut the string\" sounds like it was recorded on old digi. Reminiscent of early 2000's YouTube. The imperfection of the recording is intimate. It's unclear whether the bass is intentional or accidental strumming of unintended strings." },
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
                                annotation: "This line actually took me a while to understand. But I've landed on a very dark interpretation now after sitting on it. Being \"quiet in bed\" has sequel implications. But why is she quiet? Either she's numb or distressed, or both. So sex has become something entirely separate from love or even something pleasurable. It's become an act of ownership. An entirely asymmetrical exchange. But notice the tone. Ivy takes an almost accusatory or sarcastic tone throughout the song. To me, she sounds almost like a self-loathing internal monologue. We will see more of this later."
                            },
                            {
                                text: "buried under dirt, she looks pretty with her dress undone",
                                annotation: "I think this is one of the most visceral pieces of imagery throughout the entire EP. While this line is deeply violent and unsettling, it's also erotic. She is metaphorically dead. And despite all this pain that he sees, she is still an object of eroticism. She's been reduced to a sexual object here. The description is oddly poetic, refusing to say it straightforward. Instead Ivy uses imagery to craft the entire narrative."
                            },
                            {
                                text: "She took it well when you put the cigarette out on her tongue",
                                annotation: "Once more: we continue the theme of reduction. She's a human. A person. We have so much violent imagery with her at the center, and yet an utterly passive description of her emotional response. The contrast is stark and deeply disturbing."
                            }
                        ]
                    },
                    {
                        type: 'text', value: `Like many songs on this album, the lyrics are not straightforward. Ivy seems to prioritize the scene rather than the story. And yet, I don't think we have any less of a story because of it. The imagery is really visceral here. Disgustingly so. And that's what sticks in memory. It's the visceral moments which make you feel in retrospect. So there's a blend between erotic imagery and an abusive dynamic. Very Punpun-esque. We take something beautiful and subject it to something so clearly twisted. It's not supposed to be like this. We dip into depravity throughout this song. And a theme in the album is this contradictory submission. It is almost painted romantically. But it really isn't that. There's no way to look at it without the dark edge.`
                    },

                    {
                        type: 'lyric',
                        label: 'Lyrics (Click highlighted lines for analysis)',
                        lines: [
                            {
                                text: "Pulsating in the dark"
                            },
                            {
                                text: "Blood on the sheets again"
                            }
                        ]
                    },

                    {
                        type: 'text', value: `I absolutely love these lyrics. It's very powerful imagery. Pulsating in the dark? We don't know what it is. But we have two things: Movement and lighting. There's an eldritch quality to it. And it taps into some very primal sensory descriptions. It's restless. It's dangerous. It's brutal. Blood on the sheets. What could this mean? Rape? Consensual extremity? Who knows. As a listener I'm almost scared to find out. And Ivy doesn't give us the satisfaction of looking this scary thing in the eyes. It remains obscure throughout the track.`
                    },

                    {
                        type: 'lyric',
                        label: 'Lyrics (Click highlighted lines for analysis)',
                        lines: [
                            {
                                text: "Did you not warn her?"
                            },
                            {
                                text: "You did it to all her friends"
                            },
                            {
                                text: "You've got a secret to tell her"
                            },
                            {
                                text: "I can smell it"
                            },
                            {
                                text: "Its making you sick why don't you"
                            },
                            {
                                text: "Go on and tell it"
                            }
                        ]
                    },

                    {
                        type: 'text', value: `So what is this secret? Warn her about what? We continue to be left in the dark. The song is a secret that only Ivy and this mysterious other knows. They know. What is it? Is it too taboo to mention? Too painful? Too personal? And the line, "it's making you sick". Ivy knows this person isn't completely indulgent. There's this appeal to humanity. It's also interesting and kind of unsettling, that all we get in the song is Ivy asking this other. It's almost like she is protecting their privacy. Respecting their agency. How come? Humanizing the abuser? It's all so fascinating and complex.`
                    },

                    {
                        type: 'lyric',
                        label: 'Lyrics (Click highlighted lines for analysis)',
                        lines: [
                            {
                                text: "What did you get for spitting poison in her ear?"
                            },
                            {
                                text: "You lit the candle but you're nauseous when she's near"
                            },
                            {
                                text: "When she cuts the string you cry like a wounded dog"
                            },
                            {
                                text: "So you blew it out and she's gone"
                            },
                            {
                                text: "She's gone"
                            },
                        ]
                    },

                    {
                        type: 'text', value: `This is a really telling chunk. I don't know how to interpret this other than as an abusive relationship. All Ivy says is "why?" "You know what'll happen." "It doesn't end well" so why? It's a good question. How many "bad" people in the world are truly incapable of reflection? Feel no guilt? Are blind of consequences? So why do they do what they do? This is philosophically interesting; an interrogation of agency, control, self, and desert. What drives these things? The logic feels arbitrary.`
                    },

                    {
                        type: 'lyric',
                        label: 'Lyrics (Click highlighted lines for analysis)',
                        lines: [
                            {
                                text: "Wriggling in the mud"
                            },
                            {
                                text: "Blood on her hands again"
                            }]
                    },

                    {
                        type: 'text', value: `So this is a clear parallel to the earlier bridge. We move from pulsating to wriggling. Dark to mud. Sheets to hands. We've given form to this "thing". It's moving down in abstraction, which is an interesting choice.`
                    },

                    {
                        type: 'lyric',
                        label: 'Lyrics (Click highlighted lines for analysis)',
                        lines: [
                            {
                                text: "Did she not warn you?"
                            },
                            {
                                text: "How long could she pretend"
                            },
                            {
                                text: "You've got a secret to tell her"
                            },
                            {
                                text: "I can smell it"
                            },
                            {
                                text: "Its making you sick"
                            },
                            {
                                text: "Why don't you go on and tell it"
                            }
                        ]
                    },
                    {
                        type: 'text', value: `I think this song ends at a very interesting place. Sonically and lyrically. It ends in a suggestion. And the measure isn't finished. I don't have much to say about it but it makes me feel quite a lot. Details like this make me really love Ivy Knight.`
                    }
                ]
            },
            {
                id: 'ik-3',
                title: 'Gun',
                published: true,
                content: [
                    { type: 'text', value: "'Gun' unambiguously takes place in the nighttime. Cricket chirps color the song. As with others, her voice is ethereal – wide and reverberating, while the guitar is muffled and almost absent, like an old vhs recording or an early youtube video. It feels simple, in the same way a childhood memory feels simple. But then her voice washes over the soundscape. It floats over the memory, like commentary over a documentary. It's a description. Of the stories which take place in the auditory “setting” of the track. She hides a gun under her pillow. This gun can most definitely be metaphorical, but the implications of a physical gun is just as evocative." }
                ]
            },
            {
                id: 'ik-4',
                title: 'Salvation',
                published: true,
                content: [
                    { type: 'text', value: "For a while, this was my favorite track of the EP. It is truly difficult to articulate its implicit beauty, but I will try. Salvation is about self-destructive naivety. A song of contradictions, I am truly torn of how to feel. While it's clearly a tune of shattering innocence, it’s permeated with such beauty, I can’t help but feel the same naive enthrallment that the song describes. The first two lines are some of the hardest hitters for me:" },
                    { type: 'lyric', label: 'Lyrics', value: "I had never seen the snow\nSo I put my hands in until they froze" },
                    { type: 'text', value: "I don’t really know why. Maybe it's because of the imagery. Maybe it's the physicality of it (personal tangent upcoming). Well, on deeper thought, I relate a scary amount; I’ve always loved the cold. In high school, I would walk my streets at night, barefoot and ungloved. I would return home with my fingers numb and my feet raw. The walk would be painful from the jagged asphalt digging into my cold-sensetized feet. This is also something I don’t really understand. I don’t enjoy the pain, but I guess it doesn’t affect me as much when it's paired with the cold. Because the cold is invigorating. The sharpness feels like proof of my existence. Here’s my own personal theory of this weird thing: I grew up in Wisconsin, where snow was a daily thing. When I moved at the age of 7 to Alabama, I felt like I was missing a part of myself. Because snow was magical… Anyways, this isn’t about me, at least not primarily so I will move on. (personal tangent ends!) I suppose my case is different from Ivy’s painted metaphor. Because I had seen the snow before. But I still understand the allure. In a way, our experiences are analogous even where they differ. To someone who has never experienced snow, it must be truly bizarre. A snowy landscape is a complete glittery transformation. And when your only exposure is through word of mouth and media, it becomes something mystical. Is a memory so different? A memory is untouchable, and it's a blurry something I don’t quite trust. Especially a distant childhood one. Similarly to “Salvation”, it tends to become romantic. And just as much as I would naively embrace a romanticized inexperience, I would embrace a romantic embodied nostalgia. Until my hands are red and numb." },
                    {
                        type: 'lyric',
                        label: 'Lyrics (Click highlighted lines for analysis)',
                        lines:
                            [
                                {
                                    text: "Salvation has many forms",
                                    annotation: "At the turn of the chorus, there is a beautiful chord progression (D7-Bb-Cm-Gm). The word 'salvation' is sang with two chords. D7 brings us into a state of suspense, or longing, and incompleteness. And it's immediately resolved with a Bb major chord. It feels almost triumphant. Like I can see angels descending down in a beam of light. Beauty and tension. The D7 turns the following Bb into something else entirely. Instead of something calm or happy, it's tinged with a sense of longing, of romanticization and escapism."
                                },
                                {
                                    text: "Talking to angels in the back of your car"
                                },
                                {
                                    text: "I’ll see you on the other side when you've been reborn",
                                    annotation: "The second half of the chorus futher resolves the tension of the 7th, moving instead to the progression Bb-F-Cm-Gm. But notably, Cm-Gm is still a rather moody progression. So it feels more like a resignment, or acceptance, rather than a triumphant resolution. The longing remains."
                                },
                                {
                                    text: "Crucified and wearing your crown of thorns",
                                },
                            ]
                    },
                    {
                        type: 'text', value: `The song contains, as far as I know, the most biblical imagery of any Ivy Knight song. As a non-religious person, I can’t say with certainty, but from my observations, the religious idea of “salvation” is usually eternal—there’s a sense of finality to it. It’s something you don’t have to consider the “after” of, because it, itself, is the final thing. This mirrors the idea of escapist idealism. It’s a fundamentally incomplete idea. It's viewed as a type of “salvation”, in that the ideal is flattened, flaws abstracted away into a sweet oblivion. We seek “salvation” in life, with the uncanny willingness to destroy ourselves in the process. But how often is “salvation” a truth? The things that we seek, at least the things that I’ve sought, tend to become less important after I attain them. And this seems to vary quite independently of how much I idealized the thing I got; much of the justification is often a lie. As with love, the “happily ever after” we envision has a deceptive “ever” which evades the usual fantasy.`
                    }
                ]
            },
            { id: 'ik-5', title: 'Be Your Dog', published: true, content: [{ type: 'text', value: "'Be your Dog' is wrapped in a constant low rumble—similar to what one would hear in a plane. I really imagine myself fully immersed in this noise—but it's not anything in particular—It’s not really a physical space, but rather something made up of the subjective 'essence', the emotional and synesthetic components of a plane ride. I feel not the clouds themselves but rather the freedom, the awe, the subtle sense of yearning that clouds evoke. \n This song really speaks to my desire to reduce, or return to simplicity; a rather abstract, unreachable goal—more desire than goal. The daydream of domesticity is twisted into something which is still sweet, yet utterly subservient. The first few lines feel like your average love song—a desire for touch, a hole, a dream. But the expectation of the “right” type of relationship is subverted. It just feels wrong because us as humans usually feel as if we should be more." }] }
        ]
    },
    {
        id: 'sweet-trip-ywnkw',
        title: 'You Will Never Know Why',
        artist: 'Sweet Trip',
        coverImage: '/graphics/covers/youwillneverknowwhy.jpg',
        releaseType: 'EP',
        date: '2023-11-02',
        genre: 'Pop',
        published: true,
        links: {
            spotify: 'https://open.spotify.com/album/0kmPn6M3cue7rec6Unw6BD?si=WYBq0MlTTh6STn2XfpMXKg',
            apple: 'https://music.apple.com/us/album/you-will-never-know-why-2021-remaster/1546560761',
            youtube: 'https://www.youtube.com/watch?v=57MOxcW7iqo&list=OLAK5uy_luQpEG_NkTi7-z57k9qVGX95vghXAqrCI'
        },
        overview: [
            { type: 'text', value: "A radical departure from Sweet Trip’s electronic heart in Velocity: Design: Comfort, this album is, at its core, acoustic. It leans into Sweet Trip’s lining of innocent-sounding whimsy, abandoning the complex glitch-pop sound for a lullaby-esque quality." }
        ],
        tracks: [
            {
                id: 'st-1',
                title: 'Milk',
                published: true,
                content: [
                    { type: 'text', value: "A radical departure from Sweet Trip's electronic heart in Velocity: Design: Comfort, Milk is, at its core, acoustic. Electric guitar and synth decorate the soundscape while the rhythmic strumming pattern remains an anchor throughout. Valerie Cooper's lyricism is similarly spacious, matching the spaciousness of her vocals, which are wrapped in a springy dry reverb—a Sweet Trip signature. Roberto's voice provides backing to add space to Cooper's voice." },
                    { type: 'text', value: "Milk leans into Sweet Trip's innocent-sounding whimsy, but in a different way than Your World is Eternally Complete or Darkness, abandoning the pop-rock sound for a lullaby-esque quality. It's distinctly gentle for Sweet Trip, even among the rest of You will Never Know Why. Cooper's lyrics reinforce this dreamy lullaby atmosphere. The song is predominantly second person, which isn't a strange choice in itself, but stands out from ballads and romantic declarations of 'you' because it sounds somehow more intimate and direct. As a listener, the 'you' isn't 'someone the artist is addressing' but rather 'me'. Or perhaps this is a perception arising from my own depth of identification with the song." },
                    { type: 'lyric', label: 'Lyrics', value: "Sleep on this bed\nTossing and turning you'll never figure out a way" },
                    { type: 'text', value: "This is part of what attracts me so much to this song in particular. It bridges artistic intent, which can often fall flat, with artistic experience. It tells me that the artist feels something similar to what I've felt while listening to the song, and thus this song is a kind of ontological bridge of experience. A direct rejection of solipsism that is especially pervasive in modern cyberspace. Perhaps the bed isn't such a rare image by itself, but I don't know how often it's painted in the particular mix of comfort and melancholy that the strumming patterns in Milk accomplish. For me, the bed has acted as much a safe haven as it has a cage—a cage of comfort. The most dangerous kind, yet beloved. Cooper's voice, the lyricism, the chord progression, all coalesce into a resounding subtext of 'you are heard'. It's different from a Dean Blunt or Earl Sweatshirt track, which would usually wallow in the void alongside me, the listener. Milk does not merely embody my internal experience; it explicitly exists as its own entity in acknowledgment of my parallel existence." },
                    { type: 'lyric', label: 'Lyrics', value: "You'll never figure out a way\", says Cooper. The words by themselves sound nihilistic or almost mocking, but the gentility of the sonic context unquestionably shapes this statement as one of profound acceptance." },
                    { type: 'text', value: "The rest of the song is hypnotic and repetitive. 'You will drift away / And I won't mind / Here's to you'. The structure is reflective of its content—abstract and spacious. The lines don't need to reference anything particular. There is no story. There is no prelude, no acknowledged history. We are dumped directly into a sea of feeling. This can truly be about anything. This doesn't have to be a love story (although at first sight it reads like one, and I'm pretty sure it is, given what I know about the band). For me, it's a song about loss and acceptance. But I love how there is no clean 'overcoming' of the pain. There is no 'conquering' of emotions. It's acceptance of loss, and also of the inherent pain. And the song is filled with gentle, optimistic respect." }
                ]
            },
            { id: 'st-2', title: 'Pretending', published: false, content: [{ type: 'text', value: "Analysis coming soon." }] },
            { id: 'st-3', title: 'Air Supply', published: false, content: [{ type: 'text', value: "Analysis coming soon." }] }
        ]
    },
    {
        id: 'crying-nudes',
        title: 'The Crying Nudes',
        artist: 'The Crying Nudes',
        coverImage: '/graphics/covers/crying-nudes.jpg',
        releaseType: 'Album',
        date: '2023-09-10',
        genre: 'Pop',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/2z41sP07YkiqqdZEY9gU56?si=JKaRBVURTYWxrfX09KA_Lg',
            apple: 'https://music.apple.com/us/album/the-crying-nudes/1766386907',
            youtube: 'https://www.youtube.com/watch?v=FZ5L7oLMiE0&list=OLAK5uy_m1ToGxVRtoRL-Kt9mL823BUD3UQtusQfk'
        },
        overview: [
            { type: 'text', value: "Divergent from most of Dean Blunt's work, The Crying Nudes embodies a gentler, more pop-y persona. While produced by Dean Blunt, this project features Fine, whose voice brings a persistent contrast to Blunt's production." },
            { type: 'text', value: "Blunt’s production fittingly takes on a slightly more optimistic (not always), rhythmic style, but he opts to keep a low-fidelity sound reminiscent of his earlier projects Hype Williams and “Black is Beautiful”." },
            { type: 'text', value: "The newest single Unabomber leans into hypnotic, claustrophobic textures that still feel surprisingly tender for the EP." }
        ],
        tracks: [
            { id: 'db-1', title: 'The Crying Nudes', published: false, content: [{ type: 'text', value: "Analysis coming soon." }] },
            {
                id: 'db-2',
                title: 'Greaser',
                published: false,
                content: [
                    { type: 'text', value: "“It’s not much of a story”. The LQ sample chop in the background contains the signature hypnotic repetition of Dean Blunt's production. Although the sound is pleasant, its dreaminess hides a subtle sense of longing." }
                ]
            },
            { id: 'tcn-tcn-1', title: 'Unabomber', published: false, content: [{ type: 'text', value: "Analysis coming soon." }] },
            { id: 'db-3', title: 'Smile', published: false, content: [{ type: 'text', value: "Analysis coming soon." }] }
        ]
    },

    {
        id: 'blue-iverson-hotep',
        title: 'Hotep',
        artist: 'Blue Iverson',
        coverImage: '/graphics/covers/blue-iverson-hotep.jpg',
        releaseType: 'EP',
        date: '2018-07-06',
        genre: 'R&B',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/0Qx9LnTRZmEHK0ns6vgB3c',
            apple: 'https://music.apple.com/us/album/hotep/1677279017',
            youtube: 'https://www.youtube.com/results?search_query=Blue+Iverson+Hotep+Full+Album'
        },
        overview: [
            { type: 'text', value: 'Hotep folds brittle synths and breathy vocals into a ghostly R&B collage; Dean Blunt directorially steers Blue Iverson into melancholy intimacy.' },
            { type: 'text', value: 'The EP balances cracked soul samples with near-ambient drones, letting each song exist like a short film with fuzzed edges.' }
        ],
        tracks: [
            { id: 'bi-hot-1', title: 'Coy Boy', published: false, content: [{ type: 'text', value: 'Analysis coming soon.' }] },
            { id: 'bi-hot-2', title: "Jennah's Interlude", published: false, content: [{ type: 'text', value: 'Analysis coming soon.' }] },
            { id: 'bi-hot-3', title: 'Fake Loathe', published: false, content: [{ type: 'text', value: 'Analysis coming soon.' }] }
        ]
    },

    {
        id: 'samba-jean-baptiste-cardinal',
        title: 'Cardinal',
        artist: 'Samba Jean-Baptiste',
        coverImage: '/graphics/covers/samba-jean-baptiste-cardinal.jpg',
        releaseType: 'Album',
        date: '2022-09-29',
        genre: 'Pop',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/5j2btF2YP9WdNBo7ZKPEtH',
            apple: 'https://music.apple.com/us/album/cardinal/1709129399',
            youtube: 'https://www.youtube.com/results?search_query=Samba+Jean-Baptiste+Cardinal+Full+Album'
        },
        overview: [
            { type: 'text', value: 'Cardinal shows Samba Jean-Baptiste reimagining bedroom pop as a cinematic, incense-soaked canvas.' },
            { type: 'text', value: 'The record stretches introspective spoken word into hazy grooves, letting lush synth flourishes echo through each midnight narrative.' }
        ],
        tracks: [
            { id: 'sjb-cdl-1', title: 'Seven Less Functions', published: false, content: [{ type: 'text', value: 'Analysis coming soon.' }] },
            { id: 'sjb-cdl-2', title: 'Perfect Learning', published: false, content: [{ type: 'text', value: 'Analysis coming soon.' }] }
        ]
    },

    {
        id: 'dean-blunt-black-metal-2',
        title: 'Black Metal 2',
        artist: 'Dean Blunt',
        coverImage: '/graphics/covers/dean-blunt-black-metal-2.jpg',
        releaseType: 'Album',
        date: '2021-09-30',
        genre: 'Electronic',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/33xbAWdpX79o2YtXBiBWQv',
            apple: 'https://music.apple.com/us/album/black-metal-2/1569929348',
            youtube: 'https://www.youtube.com/results?search_query=Dean+Blunt+Black+Metal+2+Full+Album'
        },
        overview: [
            { type: 'text', value: 'A revisionist take on classic Metal motifs, this entry blends jumbled beats with mournful horns and analog hiss.' },
            { type: 'text', value: 'The album hyphenates horror and tenderness, keeping the listener close to the edge of noise without ever letting go.' }
        ],
        tracks: [
            { id: 'db-bm2-1', title: 'Dash Snow', published: false, content: [{ type: 'text', value: 'Analysis coming soon.' }] }
        ]
    },

    {
        id: 'dean-blunt-black-metal',
        title: 'Black Metal',
        artist: 'Dean Blunt',
        coverImage: '/graphics/covers/dean-blunt-black-metal.jpg',
        releaseType: 'Album',
        date: '2014-11-10',
        genre: 'Experimental',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/3CfNPpWYBtBIq1Z0N0F9Bj',
            apple: 'https://music.apple.com/us/album/black-metal/1688240976',
            youtube: 'https://www.youtube.com/results?search_query=Dean+Blunt+Black+Metal+Full+Album'
        },
        overview: [
            { type: 'text', value: 'The original Black Metal frames Dean Blunt as a curator of broken guitar loops, narrative stutters, and mournful ambience.' },
            { type: 'text', value: 'Its ragged textures carve out a vocabulary that still informs the Atlas’s strange coordinates today.' }
        ],
        tracks: [
            { id: 'db-bm-1', title: 'Lush', content: [{ type: 'text', value: 'Analysis coming soon.' }] }
        ]
    },

    {
        id: 'dean-blunt-rinsed',
        title: 'Rinsed',
        artist: 'Dean Blunt',
        featuring: 'TYSON',
        coverImage: '/graphics/covers/dean-blunt-rinsed.jpg',
        releaseType: 'Single',
        date: '2021-05-15',
        genre: 'R&B',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/65RExrGwWeVp0Q9q8lv1qW',
            apple: 'https://music.apple.com/us/album/rinsed-feat-tyson-single/1675529586',
            youtube: 'https://www.youtube.com/results?search_query=Dean+Blunt+TYSON+Rinsed'
        },
        overview: [
            { type: 'text', value: 'This collaborative single is a slow-burn love letter with sticky vocals and Beckettian pauses.' },
            { type: 'text', value: 'The beat stays minimal so the emotional drift of TYSON and Dean Blunt’s weary baritone can glow at the center.' }
        ],
        tracks: [
            { id: 'dbt-rinsed-1', title: 'Rinsed', content: [{ type: 'text', value: 'Analysis coming soon.' }] }
        ]
    },

    {
        id: 'dean-blunt-narcissist-ii',
        title: 'The Narcissist II',
        artist: 'Dean Blunt',
        coverImage: '/graphics/covers/dean-blunt-narcissist-ii.jpg',
        releaseType: 'Album',
        date: '2019-11-01',
        genre: 'Ambient',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/2wnEvZsuSCTq95HAX2kj6f',
            apple: 'https://music.apple.com/us/album/the-narcissist-ii/1688241062',
            youtube: 'https://www.youtube.com/results?search_query=Dean+Blunt+The+Narcissist+II+Full+Album'
        },
        overview: [
            { type: 'text', value: 'The Narcissist II surfaces archival field recordings and warped vocal meditations, distilling them into a restless cycle.' },
            { type: 'text', value: 'It feels like a private journal of Dean Blunt’s global wanderings, each track a mnemonic trigger for a forgotten city.' }
        ],
        tracks: [
            { id: 'db-pii-1', title: 'Direct Line 2', content: [{ type: 'text', value: 'Analysis coming soon.' }] }
        ]
    },

    {
        id: 'dean-blunt-roaches-2012-2019',
        title: 'Roaches 2012-2019',
        artist: 'Dean Blunt',
        coverImage: '/graphics/covers/dean-blunt-roaches-2012-2019.jpg',
        releaseType: 'Album',
        date: '2020-06-01',
        genre: 'Experimental',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/4ycaKvYlGxhy1jDJXwnq83?si=bsZYGt4DS0mhXnpMOczRyg',
            apple: 'https://music.apple.com/search?term=Dean+Blunt+Roaches+2012-2019',
            youtube: 'https://www.youtube.com/results?search_query=Dean+Blunt+Roaches+2012-2019'
        },
        overview: [
            { type: 'text', value: 'This compilation collects haunted scraps spanning nearly a decade, sculpted into a liminal, insectile atmosphere.' },
            { type: 'text', value: 'Each minute feels like a vignette rescued from a forgotten mixtape, yet the whole remains cohesive in its grit.' }
        ],
        tracks: [
            { id: 'db-rch-1', title: 'Felony', content: [{ type: 'text', value: 'Analysis coming soon.' }] }
        ]
    },

    {
        id: 'lily-chou-chou-kokyu',
        title: 'Kokyu',
        artist: 'Lily Chou-Chou',
        coverImage: '/graphics/covers/lily-chou-chou-kokyu.jpg',
        releaseType: 'Album',
        date: '2001-05-02',
        genre: 'Pop',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/4IVnHzCk8zgJ1ivesDoTc3',
            apple: 'https://music.apple.com/us/album/kokyuu/1297925080',
            youtube: 'https://www.youtube.com/results?search_query=Lily+Chou-Chou+Kokyu+Full+Album'
        },
        overview: [
            { type: 'text', value: 'The Kokyu soundtrack gently drifts through crystalline pop, filmed through the lens of the fictional Lily Chou-Chou.' },
            { type: 'text', value: 'Producer Takeshi Kobayashi bathes every string in gauzy delay and reverberated vocals, reinforcing the film’s aching nostalgia.' }
        ],
        tracks: [
            { id: 'lcc-kk-1', title: 'Glide', content: [{ type: 'text', value: 'Analysis coming soon.' }] },
            { id: 'lcc-kk-2', title: 'Arabesque', content: [{ type: 'text', value: 'Analysis coming soon.' }] }
        ]
    },

    {
        id: 'korea-girl',
        title: 'Korea Girl',
        artist: 'Korea Girl',
        coverImage: '/graphics/covers/korea-girl.jpg',
        releaseType: 'Album',
        date: '2002-03-12',
        genre: 'Rock',
        published: false,
        links: {
            spotify: 'https://open.spotify.com/album/6bafbtAX8kfImUDUubRE5N?si=pxR8ALaOSrS8oRVqnOhosA',
            apple: '#',
            youtube: 'https://www.youtube.com/results?search_query=Korea+Girl+Self-Titled+Full+Album'
        },
        overview: [
            { type: 'text', value: 'Korea Girl is a cult Bay Area indie rock record, craving hazy guitars, heartfelt vocals, and warbling harmonies.' },
            { type: 'text', value: 'It nods to late 90s college rock but lingers in melodic, melancholic grooves.' }
        ],
        tracks: [
            { id: 'kg-kg-1', title: 'Pariah', content: [{ type: 'text', value: 'Analysis coming soon.' }] },
            { id: 'kg-kg-2', title: 'Peon', content: [{ type: 'text', value: 'Analysis coming soon.' }] },
            { id: 'kg-kg-3', title: 'Reunion', content: [{ type: 'text', value: 'Analysis coming soon.' }] }
        ]
    },

    {
        id: 'radiohead-in-rainbows',
        title: 'In Rainbows',
        artist: 'Radiohead',
        coverImage: '/graphics/covers/in-rainbows.png',
        releaseType: 'Album',
        date: '2007-10-10',
        genre: 'Rock',
        published: false,
        links: { spotify: '#' },
        overview: [{ type: 'text', value: "Art Rock, electronic elements. A masterful blend of warmth and alienation. Review coming soon." }],
        tracks: [
            { id: 'rh-1', title: 'Nude', content: [] },
            { id: 'rh-2', title: 'Weird Fishes', content: [] },
            { id: 'rh-3', title: 'Creep', content: [] }
        ]
    }
    ,
    // --- New Tracks (Imported Metadata) ---
    {
        id: 'crystal-castles-self',
        title: 'Crystal Castles (Selected)',
        artist: 'Crystal Castles',
        coverImage: '/graphics/covers/crystal-castles-self.jpg',
        releaseType: 'Album',
        date: '2008-03-18',
        genre: 'Electronic',
        published: false,
        links: {},
        overview: [{ type: 'text', value: '(not done)' }],
        tracks: [
            { id: 'cc-knights', title: 'Knights', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/2I64onJ88DvW1sVvWn0h47', apple: 'https://music.apple.com/us/song/knights/1688239919', youtube: 'search: Crystal Castles Knights' } },
            { id: 'cc-vanished', title: 'Vanished', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/5Uw1bCr2YVJl0q9z9KKqIr', apple: 'https://music.apple.com/us/song/vanished/1688239931', youtube: 'search: Crystal Castles Vanished' } }
        ]
    },
    {
        id: 'snow-strippers-selected',
        title: 'Snow Strippers (Selected)',
        artist: 'Snow Strippers',
        coverImage: '/graphics/covers/snow-strippers.jpg',
        releaseType: 'Singles',
        date: '2022-06-30',
        genre: 'Electronic',
        published: false,
        links: {},
        overview: [{ type: 'text', value: '(not done)' }],
        tracks: [
            { id: 'ss-fantasy', title: 'Fantasy', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/5vV6MKyUYAcZo9X5f3ztDt', apple: 'limited', youtube: 'search: Snow Strippers Fantasy' } },
            { id: 'ss-genocide', title: 'Genocide', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/5rbZZWQoVql2K35mhsUPtI', apple: 'limited', youtube: 'search: Snow Strippers Genocide' } }
        ]
    },
    {
        id: 'blood-orange-selected',
        title: 'Blood Orange (Selected)',
        artist: 'Blood Orange',
        coverImage: '/graphics/covers/blood-orange.jpg',
        releaseType: 'Selected Tracks',
        date: '2013-2019',
        genre: 'R&B',
        published: false,
        links: {},
        overview: [{ type: 'text', value: '(not done)' }],
        tracks: [
            { id: 'bo-youre-not-good-enough', title: "You're Not Good Enough", content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/3UNPA9XgUNAStNazmC67yF', apple: 'https://music.apple.com/us/song/youre-not-good-enough/720743249', youtube: 'search: Blood Orange Youre Not Good Enough' } },
            { id: 'bo-minetta-creek', title: 'Minetta Creek', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/7Kt7c9Q2B7hSyiTZvGQ37D', apple: 'search: Blood Orange Minetta Creek', youtube: 'search: Blood Orange Minetta Creek' } },
            { id: 'bo-orlando', title: 'Orlando', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/1H8BKN1WYV6AW1kghI3ldP', apple: 'search: Blood Orange Orlando', youtube: 'search: Blood Orange Orlando' } },
            { id: 'bo-always-let-you-down', title: 'Always Let You Down', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/7HvGHd2Iy7N4xs4M5pd2OM', apple: 'https://music.apple.com/us/song/always-let-u-down/720743290', youtube: 'search: Blood Orange Always Let You Down' } },
            { id: 'bo-benzo', title: 'Benzo', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/09byaVBbIvJWJHdZEl4Sin', apple: 'https://music.apple.com/lc/music-video/benzo/1473020403', youtube: 'search: Blood Orange Benzo' } }
        ]
    },
    {
        id: 'devon-hendryx-archive',
        title: 'Devon Hendryx (Archive)',
        artist: 'Devon Hendryx',
        coverImage: '/graphics/covers/devon-hendryx.jpg',
        releaseType: 'Selected Tracks',
        date: '2010-2012',
        genre: 'Hip-hop',
        published: false,
        links: {},
        overview: [{ type: 'text', value: '(not done)' }],
        tracks: [
            { id: 'dh-fucking-your-girl', title: 'Fucking Your Girl', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/1WnVwuWYq9Paa1P6IOlr7S', apple: 'https://music.apple.com/au/song/fucking-your-girl/1730857792', youtube: 'search: Devon Hendryx Fucking Your Girl' } },
            { id: 'dh-neon-kitchen', title: 'Neon Kitchen', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/1XleasuIaliwmvxQ2EUhtq', apple: 'search: Neon Kitchen Devon Hendryx', youtube: 'search: Neon Kitchen Devon Hendryx' } }
        ]
    },
    {
        id: 'ichiko-aoba-collection',
        title: 'Ichiko Aoba (Selected)',
        artist: 'Ichiko Aoba',
        coverImage: '/graphics/covers/ichiko-aoba.jpg',
        releaseType: 'Selected Tracks',
        date: '2013-2021',
        genre: 'Folk',
        published: false,
        links: {},
        overview: [{ type: 'text', value: '(not done)' }],
        tracks: [
            { id: 'ia-asleep-among-endives', title: 'Asleep Among Endives', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/0RD3NWnHlyBCRwgNZy8QAn', apple: 'https://music.apple.com/us/album/asleep-among-endives-single/1714304117', youtube: 'search: Ichiko Aoba Asleep Among Endives' } },
            { id: 'ia-dawn-in-the-adan', title: 'Dawn in the Adan', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/03fJjiNTn1gyzbqHl1Hskt', apple: 'search: Dawn in the Adan Ichiko Aoba', youtube: 'search: Ichiko Aoba Dawn in the Adan' } },
            { id: 'ia-iam-pod-0', title: 'iam POD (0%)', content: [{ type: 'text', value: '(not done)' }], links: { spotify: 'https://open.spotify.com/track/1LSEN5YGJ25y5VNNAPlx6M', apple: 'https://music.apple.com/gb/song/iam-pod-0/720743505', youtube: 'search: Ichiko Aoba iam POD' } }
        ]
    }
];

// 2. THE ATLAS DATA
const SONG_DATABASE = [
    // Ivy Knight
    { id: 'ik-1', title: 'Something Good', artist: 'Ivy Knight', releaseType: 'Album', album: 'Feet of Mud', genre: 'Pop', x: 22, y: 78, linkedAlbumId: 'ivy-knight-feet-of-mud', trackId: 'ik-1' },
    { id: 'ik-2', title: 'Cut the String', artist: 'Ivy Knight', releaseType: 'Album', album: 'Feet of Mud', genre: 'Pop', x: 28, y: 76, linkedAlbumId: 'ivy-knight-feet-of-mud', trackId: 'ik-2' },
    { id: 'ik-3', title: 'Gun', artist: 'Ivy Knight', releaseType: 'Album', album: 'Feet of Mud', genre: 'Pop', x: 20, y: 80, linkedAlbumId: 'ivy-knight-feet-of-mud', trackId: 'ik-3' },
    { id: 'ik-4', title: 'Salvation', artist: 'Ivy Knight', releaseType: 'Album', album: 'Feet of Mud', genre: 'Pop', x: 25, y: 72, linkedAlbumId: 'ivy-knight-feet-of-mud', trackId: 'ik-4' },
    { id: 'ik-5', title: 'Be Your Dog', artist: 'Ivy Knight', releaseType: 'Album', album: 'Feet of Mud', genre: 'Pop', x: 20, y: 80, linkedAlbumId: 'ivy-knight-feet-of-mud', trackId: 'ik-5' },


    // The Crying Nudes
    { id: 'cn-1', title: 'Greaser', artist: 'The Crying Nudes', producer: 'Dean Blunt', releaseType: 'EP', album: 'The Crying Nudes', genre: 'Experimental', x: 38, y: 35, linkedAlbumId: 'crying-nudes', trackId: 'cn-1' },

    // Dean Blunt
    {
        id: 'db-1', title: '100', artist: 'Dean Blunt', releaseType: 'Album',
        album: 'Black Metal', genre: 'Experimental', x: 38, y: 35,
        linkedAlbumId: 'dean-blunt', trackId: 'db-2'
    },

    // Sweet Trip
    { id: 'st-1', title: 'Milk', artist: 'Sweet Trip', releaseType: 'Album', album: 'You Will Never Know Why', genre: 'Pop', x: 62, y: 82, linkedAlbumId: 'sweet-trip-ywnkw', trackId: 'st-1' },
    { id: 'st-3', title: 'Air Supply', artist: 'Sweet Trip', releaseType: 'Album', album: 'You Will Never Know Why', genre: 'Pop', x: 60, y: 85, linkedAlbumId: 'sweet-trip-ywnkw', trackId: 'st-3' },

    // Radiohead
    { id: 'rh-1', title: 'Nude', artist: 'Radiohead', releaseType: 'Album', album: 'In Rainbows', genre: 'Rock', x: 68, y: 62, linkedAlbumId: 'radiohead-in-rainbows', trackId: 'rh-1' },
    { id: 'rh-2', title: 'Weird Fishes', artist: 'Radiohead', releaseType: 'Album', album: 'In Rainbows', genre: 'Rock', x: 72, y: 58, linkedAlbumId: 'radiohead-in-rainbows', trackId: 'rh-2' },
    { id: 'rh-3', title: 'Creep', artist: 'Radiohead', releaseType: 'Single', album: 'Pablo Honey', genre: 'Rock', x: 15, y: 50, linkedAlbumId: 'radiohead-in-rainbows', trackId: 'rh-3' },

    { id: 'tcn-tcn-1', title: 'Unabomber', artist: 'The Crying Nudes', producer: 'Dean Blunt', releaseType: 'EP', album: 'The Crying Nudes', genre: 'Pop', x: 33, y: 38, linkedAlbumId: 'crying-nudes', trackId: 'tcn-tcn-1' },
    { id: 'bi-hot-1', title: 'Coy Boy', artist: 'Blue Iverson', producer: 'Dean Blunt', releaseType: 'EP', album: 'Hotep', genre: 'R&B', x: 22, y: 45, linkedAlbumId: 'blue-iverson-hotep', trackId: 'bi-hot-1' },
    { id: 'bi-hot-2', title: "Jennah's Interlude", artist: 'Blue Iverson', producer: 'Dean Blunt', releaseType: 'EP', album: 'Hotep', genre: 'R&B', x: 24, y: 42, linkedAlbumId: 'blue-iverson-hotep', trackId: 'bi-hot-2' },
    { id: 'bi-hot-3', title: 'Fake Loathe', artist: 'Blue Iverson', producer: 'Dean Blunt', releaseType: 'EP', album: 'Hotep', genre: 'R&B', x: 20, y: 48, linkedAlbumId: 'blue-iverson-hotep', trackId: 'bi-hot-3' },
    { id: 'sjb-cdl-1', title: 'Seven Less Functions', artist: 'Samba Jean-Baptiste', producer: 'Dean Blunt', releaseType: 'Album', album: 'Cardinal', genre: 'Pop', x: 60, y: 30, linkedAlbumId: 'samba-jean-baptiste-cardinal', trackId: 'sjb-cdl-1' },
    { id: 'sjb-cdl-2', title: 'Perfect Learning', artist: 'Samba Jean-Baptiste', producer: 'Dean Blunt', releaseType: 'Album', album: 'Cardinal', genre: 'Pop', x: 62, y: 26, linkedAlbumId: 'samba-jean-baptiste-cardinal', trackId: 'sjb-cdl-2' },
    { id: 'db-bm2-1', title: 'Dash Snow', artist: 'Dean Blunt', producer: 'Dean Blunt', releaseType: 'Album', album: 'Black Metal 2', genre: 'Electronic', x: 40, y: 20, linkedAlbumId: 'dean-blunt-black-metal-2', trackId: 'db-bm2-1' },
    { id: 'db-bm-1', title: 'Lush', artist: 'Dean Blunt', producer: 'Dean Blunt', releaseType: 'Album', album: 'Black Metal', genre: 'Experimental', x: 42, y: 18, linkedAlbumId: 'dean-blunt-black-metal', trackId: 'db-bm-1' },
    { id: 'dbt-rinsed-1', title: 'Rinsed', artist: 'Dean Blunt', featuring: 'TYSON', producer: 'Dean Blunt', releaseType: 'Single', album: 'Rinsed', genre: 'R&B', x: 45, y: 22, linkedAlbumId: 'dean-blunt-rinsed', trackId: 'dbt-rinsed-1' },
    { id: 'db-pii-1', title: 'Direct Line 2', artist: 'Dean Blunt', producer: 'Dean Blunt', releaseType: 'Album', album: 'The Narcissist II', genre: 'Ambient', x: 47, y: 24, linkedAlbumId: 'dean-blunt-narcissist-ii', trackId: 'db-pii-1' },
    { id: 'db-rch-1', title: 'Felony', artist: 'Dean Blunt', producer: 'Dean Blunt', releaseType: 'Album', album: 'Roaches 2012-2019', genre: 'Experimental', x: 50, y: 16, linkedAlbumId: 'dean-blunt-roaches-2012-2019', trackId: 'db-rch-1' },
    { id: 'lcc-kk-1', title: 'Glide', artist: 'Lily Chou-Chou', producer: 'Takeshi Kobayashi', releaseType: 'Album', album: 'Kokyu', genre: 'Pop', x: 70, y: 40, linkedAlbumId: 'lily-chou-chou-kokyu', trackId: 'lcc-kk-1' },
    { id: 'lcc-kk-2', title: 'Arabesque', artist: 'Lily Chou-Chou', producer: 'Takeshi Kobayashi', releaseType: 'Album', album: 'Kokyu', genre: 'Pop', x: 72, y: 36, linkedAlbumId: 'lily-chou-chou-kokyu', trackId: 'lcc-kk-2' },
    { id: 'kg-kg-1', title: 'Pariah', artist: 'Korea Girl', producer: 'Korea Girl', releaseType: 'Album', album: 'Korea Girl', genre: 'Rock', x: 15, y: 20, linkedAlbumId: 'korea-girl', trackId: 'kg-kg-1' },
    { id: 'kg-kg-2', title: 'Peon', artist: 'Korea Girl', producer: 'Korea Girl', releaseType: 'Album', album: 'Korea Girl', genre: 'Rock', x: 18, y: 18, linkedAlbumId: 'korea-girl', trackId: 'kg-kg-2' },
    { id: 'kg-kg-3', title: 'Reunion', artist: 'Korea Girl', producer: 'Korea Girl', releaseType: 'Album', album: 'Korea Girl', genre: 'Rock', x: 12, y: 24, linkedAlbumId: 'korea-girl', trackId: 'kg-kg-3' },

    // Newly added tracks
    { id: 'cc-knights', title: 'Knights', artist: 'Crystal Castles', releaseType: 'Album', album: 'Crystal Castles', genre: 'Electronic', x: 50, y: 50, linkedAlbumId: 'crystal-castles-self', trackId: 'cc-knights', links: { spotify: 'https://open.spotify.com/track/2I64onJ88DvW1sVvWn0h47', apple: 'https://music.apple.com/us/song/knights/1688239919', youtube: 'search: Crystal Castles Knights' } },
    { id: 'cc-vanished', title: 'Vanished', artist: 'Crystal Castles', releaseType: 'Album', album: 'Crystal Castles', genre: 'Electronic', x: 50, y: 50, linkedAlbumId: 'crystal-castles-self', trackId: 'cc-vanished', links: { spotify: 'https://open.spotify.com/track/5Uw1bCr2YVJl0q9z9KKqIr', apple: 'https://music.apple.com/us/song/vanished/1688239931', youtube: 'search: Crystal Castles Vanished' } },
    { id: 'ss-fantasy', title: 'Fantasy', artist: 'Snow Strippers', releaseType: 'Single', album: 'COLLIDING WALLS KILLING AND FANTASY', genre: 'Electronic', x: 50, y: 50, linkedAlbumId: 'snow-strippers-selected', trackId: 'ss-fantasy', links: { spotify: 'https://open.spotify.com/track/5vV6MKyUYAcZo9X5f3ztDt', apple: 'limited', youtube: 'search: Snow Strippers Fantasy' } },
    { id: 'ss-genocide', title: 'Genocide', artist: 'Snow Strippers', releaseType: 'Single', album: 'The Snow Strippers', genre: 'Electronic', x: 50, y: 50, linkedAlbumId: 'snow-strippers-selected', trackId: 'ss-genocide', links: { spotify: 'https://open.spotify.com/track/5rbZZWQoVql2K35mhsUPtI', apple: 'limited', youtube: 'search: Snow Strippers Genocide' } },
    { id: 'bo-youre-not-good-enough', title: "You're Not Good Enough", artist: 'Blood Orange', releaseType: 'Album', album: 'Cupid Deluxe', genre: 'R&B', x: 50, y: 50, linkedAlbumId: 'blood-orange-selected', trackId: 'bo-youre-not-good-enough', links: { spotify: 'https://open.spotify.com/track/3UNPA9XgUNAStNazmC67yF', apple: 'https://music.apple.com/us/song/youre-not-good-enough/720743249', youtube: 'search: Blood Orange Youre Not Good Enough' } },
    { id: 'bo-minetta-creek', title: 'Minetta Creek', artist: 'Blood Orange', releaseType: 'Album', album: 'Negro Swan', genre: 'R&B', x: 50, y: 50, linkedAlbumId: 'blood-orange-selected', trackId: 'bo-minetta-creek', links: { spotify: 'https://open.spotify.com/track/7Kt7c9Q2B7hSyiTZvGQ37D', apple: 'search: Blood Orange Minetta Creek', youtube: 'search: Blood Orange Minetta Creek' } },
    { id: 'bo-orlando', title: 'Orlando', artist: 'Blood Orange', releaseType: 'Album', album: 'Negro Swan', genre: 'R&B', x: 50, y: 50, linkedAlbumId: 'blood-orange-selected', trackId: 'bo-orlando', links: { spotify: 'https://open.spotify.com/track/1H8BKN1WYV6AW1kghI3ldP', apple: 'search: Blood Orange Orlando', youtube: 'search: Blood Orange Orlando' } },
    { id: 'bo-always-let-you-down', title: 'Always Let You Down', artist: 'Blood Orange', releaseType: 'Album', album: 'Cupid Deluxe', genre: 'R&B', x: 50, y: 50, linkedAlbumId: 'blood-orange-selected', trackId: 'bo-always-let-you-down', links: { spotify: 'https://open.spotify.com/track/7HvGHd2Iy7N4xs4M5pd2OM', apple: 'https://music.apple.com/us/song/always-let-u-down/720743290', youtube: 'search: Blood Orange Always Let You Down' } },
    { id: 'bo-benzo', title: 'Benzo', artist: 'Blood Orange', releaseType: 'Album', album: 'Angel\'s Pulse', genre: 'R&B', x: 50, y: 50, linkedAlbumId: 'blood-orange-selected', trackId: 'bo-benzo', links: { spotify: 'https://open.spotify.com/track/09byaVBbIvJWJHdZEl4Sin', apple: 'https://music.apple.com/lc/music-video/benzo/1473020403', youtube: 'search: Blood Orange Benzo' } },
    { id: 'dh-fucking-your-girl', title: 'Fucking Your Girl', artist: 'Devon Hendryx', releaseType: 'Single', album: '\u2764\ufe0f', genre: 'Hip-hop', x: 50, y: 50, linkedAlbumId: 'devon-hendryx-archive', trackId: 'dh-fucking-your-girl', links: { spotify: 'https://open.spotify.com/track/1WnVwuWYq9Paa1P6IOlr7S', apple: 'https://music.apple.com/au/song/fucking-your-girl/1730857792', youtube: 'search: Devon Hendryx Fucking Your Girl' } },
    { id: 'dh-neon-kitchen', title: 'Neon Kitchen', artist: 'Devon Hendryx', releaseType: 'Album', album: 'JOECHILLWORLD', genre: 'Hip-hop', x: 50, y: 50, linkedAlbumId: 'devon-hendryx-archive', trackId: 'dh-neon-kitchen', links: { spotify: 'https://open.spotify.com/track/1XleasuIaliwmvxQ2EUhtq', apple: 'search: Neon Kitchen Devon Hendryx', youtube: 'search: Neon Kitchen Devon Hendryx' } },
    { id: 'ia-asleep-among-endives', title: 'Asleep Among Endives', artist: 'Ichiko Aoba', releaseType: 'Single', album: 'Asleep Among Endives', genre: 'Folk', x: 50, y: 50, linkedAlbumId: 'ichiko-aoba-collection', trackId: 'ia-asleep-among-endives', links: { spotify: 'https://open.spotify.com/track/0RD3NWnHlyBCRwgNZy8QAn', apple: 'https://music.apple.com/us/album/asleep-among-endives-single/1714304117', youtube: 'search: Ichiko Aoba Asleep Among Endives' } },
    { id: 'ia-dawn-in-the-adan', title: 'Dawn in the Adan', artist: 'Ichiko Aoba', releaseType: 'Album', album: 'Windswept Adan', genre: 'Folk', x: 50, y: 50, linkedAlbumId: 'ichiko-aoba-collection', trackId: 'ia-dawn-in-the-adan', links: { spotify: 'https://open.spotify.com/track/03fJjiNTn1gyzbqHl1Hskt', apple: 'search: Dawn in the Adan Ichiko Aoba', youtube: 'search: Ichiko Aoba Dawn in the Adan' } },
    { id: 'ia-iam-pod-0', title: 'iam POD (0%)', artist: 'Ichiko Aoba', releaseType: 'Album', album: '0', genre: 'Folk', x: 50, y: 50, linkedAlbumId: 'ichiko-aoba-collection', trackId: 'ia-iam-pod-0', links: { spotify: 'https://open.spotify.com/track/1LSEN5YGJ25y5VNNAPlx6M', apple: 'https://music.apple.com/gb/song/iam-pod-0/720743505', youtube: 'search: Ichiko Aoba iam POD' } }
];

/* --- SUBCOMPONENTS --- */

const Navigation = ({ currentView, setView, isAtlas }) => {
    const theme = isAtlas ? COLORS.atlas : COLORS.reading;

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-sm border-b ${theme.border} transition-all duration-500 ${isAtlas ? 'bg-slate-900/80' : 'bg-white/80 shadow-sm'}`}>
            <div
                className={`text-2xl font-light tracking-[0.2em] cursor-pointer font-display uppercase hover:${theme.accent} transition-colors ${isAtlas ? 'text-slate-300' : 'text-slate-dark'}`}
                onClick={() => setView('home')}
            >
                Aether Atlas
            </div>
            <div className="flex space-x-8 text-xs font-display font-bold tracking-widest">
                <button
                    onClick={() => setView('home')}
                    className={`${currentView === 'home' ? theme.accent : theme.muted} hover:${theme.accent} transition-colors uppercase`}
                >
                    Home
                </button>
                <button
                    onClick={() => setView('atlas')}
                    className={`${currentView === 'atlas' ? theme.accent : theme.muted} hover:${theme.accent} transition-colors uppercase`}
                >
                    Atlas
                </button>
                <button
                    onClick={() => setView('about')}
                    className={`${currentView === 'about' ? theme.accent : theme.muted} hover:${theme.accent} transition-colors uppercase`}
                >
                    About
                </button>
            </div>
        </nav>
    );
};

const Background = ({ isAtlas, pan, mousePos, viewMode, rotation }) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isAtlas) {
        // Light reading background - subtle and minimal
        return (
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-cream">
                {/* Very subtle texture */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
            </div>
        );
    }

    // Parallax values based on mode
    const mouseX = mousePos?.x || 0;
    const mouseY = mousePos?.y || 0;

    // Normalize mouse coords (-1 to 1)
    const normX = (mouseX / window.innerWidth) * 2 - 1;
    const normY = (mouseY / window.innerHeight) * 2 - 1;

    // Base pan parallax (for 2D)
    const panX = pan?.x || 0;
    const panY = pan?.y || 0;

    // Combined parallax logic
    const is3d = viewMode === '3d';
    const conf = PARALLAX_CONFIG.layers;

    // For 3D, use camera rotation normalized to -1 to 1
    const rotNormX = is3d ? (rotation?.y || 0) / Math.PI : normX;
    const rotNormY = is3d ? (rotation?.x || 0) / Math.PI : normY;

    // Rotation dampener for 3D
    const rotX = is3d ? rotNormY * -PARALLAX_CONFIG.rotationDampener : 0;
    const rotY = is3d ? rotNormX * PARALLAX_CONFIG.rotationDampener : 0;

    // Deeper layer (slowest)
    const dX = is3d ? rotNormX * conf.deep.mouse : panX * conf.deep.pan;
    const dY = (is3d ? rotNormY * conf.deep.mouse : panY * conf.deep.pan) + (offset * conf.deep.scroll);

    // Mid layer
    const midX = is3d ? rotNormX * conf.mid.mouse : panX * conf.mid.pan;
    const midY = (is3d ? rotNormY * conf.mid.mouse : panY * conf.mid.pan) + (offset * conf.mid.scroll);

    // Light streaks layer (fastest/most reactive)
    const sX = is3d ? rotNormX * conf.streak.mouse : panX * conf.streak.pan;
    const sY = (is3d ? rotNormY * conf.streak.mouse : panY * conf.streak.pan) + (offset * conf.streak.scroll);

    // Helper for spherical transform string
    const getSphereTransform = (tx, ty, scale = 1.25) => {
        return `perspective(1200px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
    };

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-void-deeper">

            {/* Light Leaks / Light Flares - WKW Style (Slightly Brighter) */}
            <div
                className="absolute top-[-10%] right-[-10%] w-[45%] h-[65%] bg-slate-700/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow transition-transform ease-out"
                style={{
                    transform: getSphereTransform(midX, midY),
                    transitionDuration: `${PARALLAX_CONFIG.transitions.mid}ms`
                }}
            />
            <div
                className="absolute bottom-[10%] left-[-10%] w-[55%] h-[55%] bg-slate-800/20 rounded-full blur-[150px] mix-blend-screen opacity-40 animate-pulse-slower transition-transform ease-out"
                style={{
                    transform: getSphereTransform(dX, dY),
                    transitionDuration: `${PARALLAX_CONFIG.transitions.deep}ms`
                }}
            />

            {/* WKW Horizontal Light Streaks (Warm Splashes) */}
            <div
                className="absolute top-[20%] -left-[20%] w-[140%] h-24 bg-amber-500/15 blur-[60px] rotate-[-5deg] animate-streak opacity-40 mix-blend-screen transition-transform ease-out"
                style={{
                    transform: getSphereTransform(sX, sY),
                    transitionDuration: `${PARALLAX_CONFIG.transitions.streak}ms`
                }}
            />
            <div
                className="absolute bottom-[30%] -right-[20%] w-[140%] h-32 bg-orange-900/15 blur-[80px] rotate-[5deg] animate-streak-reverse opacity-30 mix-blend-screen transition-transform ease-out"
                style={{
                    transform: getSphereTransform(midX * -1.2, midY * -1.2),
                    transitionDuration: `${PARALLAX_CONFIG.transitions.mid}ms`
                }}
            />

            {/* Dynamic Gradients - Deep Atmospheric */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[55%] h-[55%] bg-slate-800/40 rounded-full blur-[100px] transition-transform ease-out"
                style={{
                    transform: getSphereTransform(dX * 0.5, dY * 1.2),
                    transitionDuration: `${PARALLAX_CONFIG.transitions.deep}ms`
                }}
            />
            <div
                className="absolute bottom-[-10%] right-[10%] w-[45%] h-[45%] bg-void-deeper/70 rounded-full blur-[100px] transition-transform ease-out"
                style={{
                    transform: getSphereTransform(midX * 0.8, midY * 0.8),
                    transitionDuration: `${PARALLAX_CONFIG.transitions.mid}ms`
                }}
            />

            {/* Fine Star Layer for 3D depth reference */}
            <div
                className="absolute inset-[-20%] opacity-20 mix-blend-screen transition-transform ease-out pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(1px 1px at 10% 10%, #fff, transparent), radial-gradient(1px 1px at 25% 45%, #fff, transparent), radial-gradient(1px 1px at 75% 15%, #fff, transparent), radial-gradient(1.5px 1.5px at 35% 85%, #fff, transparent), radial-gradient(1px 1px at 85% 85%, #fff, transparent)',
                    backgroundSize: '350px 350px',
                    transform: getSphereTransform(dX * 0.4, dY * 0.4),
                    transitionDuration: `${PARALLAX_CONFIG.transitions.deep}ms`
                }}
            />

            {/* VISIBLE GRAIN: full-bleed SVG so noise always reaches edges */}
            {/* Pre-rendered grain overlay */}
            <div
                className="absolute inset-0 pointer-events-none transition-transform ease-out"
                style={{
                    top: '-15%',
                    left: '-15%',
                    width: '130%',
                    height: '130%',
                    opacity: 0.15,
                    backgroundImage: 'url(/grain_turbulence_f0.4_o4.png)',
                    backgroundRepeat: 'repeat',
                    transform: getSphereTransform(dX * 0.1, dY * 0.1),
                    transitionDuration: `${PARALLAX_CONFIG.transitions.deep}ms`
                }}
                aria-hidden="true"
            />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(1,10,8,0.9)_100%)] pointer-events-none" />

            {/* VISIBLE GRAIN: full-bleed SVG so noise always reaches edges */}
            {/* Pre-rendered grain overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    top: '-10%',
                    left: '-10%',
                    width: '120%',
                    height: '120%',
                    opacity: 0.2,
                    backgroundImage: 'url(/grain_turbulence_f0.4_o4.png)',
                    backgroundRepeat: 'repeat',
                    transform: `translate(${panX * -0.01}px, ${panY * -0.01 + (offset * -0.01)}px)`,
                    transition: is3d ? 'none' : 'transform 0.1s linear'
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
        className="group relative border-l border-warm-gray pl-6 py-8 cursor-pointer hover:border-terracotta hover:bg-rust/5 transition-all duration-500"
        onClick={onClick}
    >
        <div className="flex gap-8 items-start">
            {/* Album Cover or Placeholder */}
            <div className="relative flex-shrink-0 w-32 h-32 overflow-hidden border border-warm-gray group-hover:border-terracotta/50 transition-colors bg-white/50">
                {album.coverImage ? (
                    <img
                        src={album.coverImage}
                        alt={`${album.title} cover`}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale-[30%]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Disc className="text-slate-400" size={32} />
                    </div>
                )}
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="text-xs font-display tracking-widest text-slate-500 mb-2 uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-slate-600 group-hover:bg-terracotta transition-colors rotate-45"></span>
                        {album.date} • {album.genre}
                    </div>
                    <ArrowLeft className="rotate-180 text-slate-600 group-hover:text-terracotta transition-colors opacity-50 group-hover:opacity-100" size={14} />
                </div>

                <h2 className="text-3xl font-body font-light text-charcoal group-hover:text-slate-dark transition-colors mb-2 uppercase tracking-wide">
                    {album.title}
                </h2>
                <div className="text-sm font-display text-terracotta mb-6 tracking-wider">{artistWithFeat(album)}</div>

                <p className="text-slate-600 font-body text-lg leading-relaxed line-clamp-3">
                    {album.overview[0]?.value}
                </p>
            </div>
        </div>
    </div>
);

// VIEW 1: ALBUM PAGE
const AlbumView = ({ album, onOpenTrack, onBack }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const description = album.overview?.[0]?.value
        ? album.overview[0].value.substring(0, 160) + '...'
        : `In-depth review and analysis of ${album.title} by ${album.artist}.`;

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto animate-fade-in">
            <SEO
                title={`${album.title} - ${album.artist}`}
                description={description}
                path={`/album/${album.id}`}
                image={album.coverImage || '/graphics/og-image.jpg'}
                type="music.album"
                structuredData={generateAlbumStructuredData(album)}
            />
            <button onClick={onBack} className="mb-12 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-slate-600 hover:text-terracotta transition-colors">
                <ArrowLeft size={14} /> Index
            </button>

            <header className="mb-16 border-b border-warm-gray pb-12 relative">
                <div className="flex gap-12 items-start mb-8">
                    {/* Large Album Cover or Placeholder */}
                    <div className="relative flex-shrink-0 w-64 h-64 overflow-hidden border border-warm-gray shadow-[0_0_40px_rgba(0,0,0,0.1)] bg-white/50">
                        {album.coverImage ? (
                            <>
                                <img
                                    src={album.coverImage}
                                    alt={`${album.title} cover`}
                                    className="w-full h-full object-cover opacity-90 grayscale-[20%]"
                                />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(245,243,239,0.4)_100%)] pointer-events-none" />
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Disc className="text-slate-400" size={80} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 text-slate-500 text-xs font-display uppercase tracking-[0.2em] mb-4">
                            <Disc size={14} /> {album.genre} {/* {album.releaseType} */}
                        </div>
                        <h1 className="text-6xl md:text-8xl font-body font-light text-charcoal mb-4 leading-tight uppercase tracking-tight">{album.title}</h1>
                        <h2 className="text-2xl md:text-3xl font-display font-light text-slate-dark mb-8 tracking-wider">{artistWithFeat(album)}</h2>
                        <div className="flex gap-4">
                            {Object.entries(album.links).map(([platform, url]) => (
                                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="px-5 py-2 border border-warm-gray bg-cream-warm/30 text-xs font-display uppercase tracking-widest text-terracotta hover:bg-rust/20 hover:text-charcoal hover:border-terracotta transition-all flex items-center gap-2">
                                    {platform} <ExternalLink size={10} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* 1. ALBUM OVERVIEW */}
            <section className="mb-20">
                <h3 className="text-xs font-display font-bold uppercase tracking-widest text-slate-600 mb-6 flex items-center gap-2">
                    <span className="w-1 h-4 bg-terracotta"></span> Analysis
                </h3>
                <div className="border-l border-warm-gray pl-8 space-y-6">
                    {album.overview.map((block, idx) => (
                        <p key={idx} className="font-body text-lg text-charcoal leading-relaxed">
                            {block.value}
                        </p>
                    ))}
                </div>
            </section>

            {/* 2. LINKS TO TRACKS */}
            <section>
                <h3 className="text-xs font-display font-bold uppercase tracking-widest text-slate-600 mb-6 flex items-center gap-2">
                    <span className="w-1 h-4 bg-terracotta"></span> Fragments
                </h3>
                <div className="grid gap-1">
                    {album.tracks.filter(track => track.published).map((track, i) => (
                        <div
                            key={track.id}
                            onClick={() => onOpenTrack(track.id)}
                            className="flex items-center justify-between p-5 border-b border-warm-gray hover:bg-rust/5 hover:pl-8 transition-all duration-300 cursor-pointer group"
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-slate-500 font-display text-xs w-6">{(i + 1).toString().padStart(2, '0')}</span>
                                <span className="text-2xl font-body text-charcoal group-hover:text-slate-dark transition-colors uppercase tracking-wide">{track.title}</span>
                            </div>
                            <div className="text-terracotta text-xs font-display tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">READ &gt;</div>
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
        return <div className="text-charcoal">{line.text}</div>;
    }

    return (
        <div className="relative inline-block w-full">
            {/* Clickable Line */}
            <span
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className={`cursor-pointer transition-all duration-300 border-b-2 ${isOpen ? 'text-slate-dark border-terracotta bg-rust/10' : 'text-charcoal border-warm-gray hover:text-slate-dark hover:border-terracotta'}`}
            >
                {line.text}
            </span>

            {/* Annotation Popup */}
            {isOpen && (
                <div ref={popupRef} className="absolute left-0 top-full mt-3 w-full md:w-[125%] z-30 animate-fade-in">
                    <div className="bg-white/95 backdrop-blur-md border border-warm-gray p-0 shadow-2xl relative">

                        {/* Decorative corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-warm-gray"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-warm-gray"></div>

                        {/* Header */}
                        <div className="bg-cream-warm border-b border-warm-gray px-5 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="text-[10px] font-display font-bold uppercase tracking-widest text-terracotta">Annotation</div>
                                {line.timestamp && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-display text-slate-600">
                                        <Clock size={10} />
                                        {line.timestamp}
                                    </div>
                                )}
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-slate-600 hover:text-terracotta transition-colors"><X size={14} /></button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="prose prose-base font-body text-charcoal leading-relaxed">
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

    const description = track.content?.[0]?.value
        ? track.content[0].value.substring(0, 160) + '...'
        : `Deep dive analysis of "${track.title}" from ${album.title} by ${album.artist}.`;

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto animate-fade-in">
            <SEO
                title={`${track.title} - ${album.artist}`}
                description={description}
                path={`/track/${album.id}/${track.id}`}
                image={album.coverImage || '/graphics/og-image.jpg'}
                type="article"
                structuredData={generateTrackStructuredData(track, album)}
            />
            <button onClick={onBack} className="mb-8 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-slate-600 hover:text-terracotta transition-colors">
                <ArrowLeft size={14} /> Back to {album.title}
            </button>
            <div className="mb-12 border-b border-warm-gray pb-8">
                <div className="flex gap-8 items-start mb-6">
                    {/* Album Art */}
                    <div className="relative flex-shrink-0 w-28 h-28 overflow-hidden border border-warm-gray bg-white/50">
                        {album.coverImage ? (
                            <img
                                src={album.coverImage}
                                alt={`${album.title} cover`}
                                className="w-full h-full object-cover opacity-80 grayscale-[30%]"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Disc className="text-slate-400" size={24} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 pt-2">
                        <h1 className="text-5xl md:text-7xl font-body font-light text-charcoal mb-3 uppercase tracking-wide">{track.title}</h1>
                        <div className="text-terracotta font-display text-xs tracking-widest uppercase flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-terracotta rotate-45"></span>
                            Journal
                        </div>
                    </div>
                </div>
            </div>

            <article className="prose prose-lg max-w-none pl-6 border-l border-warm-gray">
                {track.content.length > 0 ? track.content.map((block, idx) => {
                    if (block.type === 'lyric') {
                        return (
                            <div key={idx} className="not-prose my-12 space-y-2">
                                {block.lines ? block.lines.map((line, lineIdx) => (
                                    <LyricLine key={lineIdx} line={line} />
                                )) : (
                                    <div className="text-charcoal font-body leading-relaxed whitespace-pre-line">
                                        {block.value}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    if (block.type === 'analysis') {
                        // Preserve newlines in the analysis text
                        return (
                            <div className="space-y-6 text-charcoal font-body leading-relaxed">
                                {block.value.split('\n').map((paragraph, pIdx) => (
                                    paragraph.trim() !== '' && <p key={`${idx}-${pIdx}`}>{paragraph}</p>
                                ))}
                            </div>
                        );
                    }
                    return (
                        <div className="space-y-6 text-charcoal font-body leading-relaxed">
                            <p key={idx}>{block.value}</p>
                        </div>
                    );
                }) : (
                    <div className="text-slate-600 italic font-body text-lg">No data available.</div>
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
    const [selectedNode, setSelectedNode] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSelectionOpen, setIsSelectionOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Gradient overlay state
    const [selectedGradient, setSelectedGradient] = useState('none');
    const [isGradientOpen, setIsGradientOpen] = useState(false);
    const [gradientData, setGradientData] = useState(null);

    // Similarity dropdown state
    const [isSimilarityDropdownOpen, setIsSimilarityDropdownOpen] = useState(false);

    // 3D mode state and data
    const [viewMode, setViewMode] = useState('2d'); // '2d' | '3d'
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 }); // Camera rotation for 3D parallax
    const [atlas3dNodes, setAtlas3dNodes] = useState(null);
    const [gradientData3d, setGradientData3d] = useState(null);
    const [is3DAvailable, setIs3DAvailable] = useState(false);

    // Active gradient dataset (switch to 3D gradients when in 3D mode and available)
    const activeGradientData = (viewMode === '3d' && gradientData3d) ? gradientData3d : gradientData;

    // Load gradient axes data
    useEffect(() => {
        fetch('/data/gradient_axes.json')
            .then(res => res.json())
            .then(data => {
                setGradientData(data);
                console.log('Loaded PCA gradient data:', data.metadata);
            })
            .catch(err => {
                console.warn('Gradient axes not found. Run: node scripts/compute_gradient_axes.js');
            });
        // Attempt to load optional 3D coordinates and 3D gradient axes
        fetch('/data/atlas_nodes_3d.json')
            .then(res => {
                if (!res.ok) throw new Error('3D nodes not found');
                return res.json();
            })
            .then(data => {
                setAtlas3dNodes(data);
                setIs3DAvailable(true);
                console.log('Loaded atlas_nodes_3d.json');
            })
            .catch(() => {
                setIs3DAvailable(false);
            });

        fetch('/data/gradient_axes_3d.json')
            .then(res => {
                if (!res.ok) throw new Error('3D gradient not found');
                return res.json();
            })
            .then(data => {
                setGradientData3d(data);
                console.log('Loaded 3D PCA gradient data');
            })
            .catch(() => {
                // optional
            });
    }, []);

    // NEW: Zoom and pan state
    const [zoom2d, setZoom2d] = useState(1);
    const [pan2d, setPan2d] = useState({ x: 0, y: 0 });
    const [zoom3d, setZoom3d] = useState(1);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Track mouse for parallax
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, []);

    const mapRef = useRef(null);
    const atlas3DRef = useRef(null);
    const zoomRef = useRef(1);
    const panRef = useRef({ x: 0, y: 0 });

    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 4;

    const toggleViewMode = () => {
        if (!is3DAvailable || isTransitioning) return;

        // Force close dropdowns when switching
        setIsGradientOpen(false);
        setIsCategoryOpen(false);
        setIsSelectionOpen(false);

        setIsTransitioning(true);
        // We'll switch the actual mode halfway through or at the end
        // Let's do it at 350ms so it's hidden by the blur/opacity
        setTimeout(() => {
            const newMode = viewMode === '2d' ? '3d' : '2d';
            trackViewModeChange(newMode);
            setViewMode(newMode);
        }, 350);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 700);
    };

    // Keep refs synced
    useEffect(() => {
        zoomRef.current = zoom2d;
    }, [zoom2d]);

    useEffect(() => {
        panRef.current = pan2d;
    }, [pan2d]);

    // Wheel zoom handler (2D only)
    useEffect(() => {
        const mapEl = mapRef.current;
        if (!mapEl) return;

        const wheelHandler = (e) => {
            // Only handle wheel events in 2D mode
            if (viewMode !== '2d') return;

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

            setZoom2d(newZoom);
            setPan2d({ x: newPanX, y: newPanY });
        };

        mapEl.addEventListener('wheel', wheelHandler, { passive: false });
        return () => mapEl.removeEventListener('wheel', wheelHandler);
    }, [viewMode]);
    // Handle pan start (2D only)
    const handleMouseDown = (e) => {
        if (viewMode !== '2d') return; // Only pan in 2D mode
        if (e.button !== 0) return; // left click only
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan2d.x, y: e.clientY - pan2d.y });
    };

    // Handle pan move
    const handleMouseMove = (e) => {
        if (!isPanning) return;
        setPan2d({
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
        if (viewMode === '3d') {
            atlas3DRef.current?.reset();
        } else {
            setZoom2d(1);
            setPan2d({ x: 0, y: 0 });
        }
    };

    // Attach wheel listener (need passive: false to preventDefault) - 2D only
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

    // Choose active song coordinates based on viewMode (2d or 3d)
    const activeSongs = useMemo(() => {
        if (viewMode === '3d' && atlas3dNodes && atlas3dNodes.length) {
            // merge provided songs metadata with 3D coordinates when available
            return songs.map(s => {
                const n = atlas3dNodes.find(a => a.id === s.id);
                if (!n) return s;
                return { ...s, x: n.x, y: n.y, z: n.z };
            });
        }
        return songs;
    }, [songs, viewMode, atlas3dNodes]);

    // Prepare display coordinates: auto-center and uniform scale to fit map nicely
    const prepared = useMemo(() => {
        if (!activeSongs || !activeSongs.length) return [];
        const xs = activeSongs.map(s => Number(s.x || 0));
        const ys = activeSongs.map(s => Number(s.y || 0));
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const dataWidth = maxX - minX || 1;
        const dataHeight = maxY - minY || 1;
        const maxExtent = Math.max(dataWidth, dataHeight) / 2 || 1;
        const pad = 6;
        const scale = (50 - pad) / maxExtent;

        return activeSongs.map(s => {
            const sx = Number(s.x || 0);
            const sy = Number(s.y || 0);
            let dx = 50 + (sx - centerX) * scale;
            let dy = 50 + (sy - centerY) * scale;
            dx = Math.max(pad, Math.min(100 - pad, dx));
            dy = Math.max(pad, Math.min(100 - pad, dy));
            const meta = SONG_DATABASE.find(d => d.id === s.id) || {};
            // Determine published status
            let published = false;
            if (meta.linkedAlbumId && meta.trackId) {
                const album = INITIAL_ALBUMS.find(a => a.id === meta.linkedAlbumId);
                if (album && album.published) {
                    const track = album.tracks.find(t => t.id === meta.trackId);
                    published = track ? track.published : false;
                }
            }
            return {
                ...s,
                displayX: dx,
                displayY: dy,
                title: meta.title || s.title || '',
                artist: meta.artist || s.artist || '',
                album: meta.album || s.album || '',
                genre: meta.genre || s.genre || '',
                producer: meta.producer || s.producer || null,
                releaseType: meta.releaseType || s.releaseType || 'Single',
                linkedAlbumId: meta.linkedAlbumId,
                trackId: meta.trackId,
                published
            };
        });
    }, [activeSongs]);

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
            distances.slice(0, 3).forEach(d => {
                const songB = prepared[d.idx];
                edges.push({ start: songA, end: songB });
            });
        });
        return edges;
    }, [prepared]);

    // Filter-specific connections: connect all nodes in the selected category
    const filterConnections = useMemo(() => {
        if (!selection || !category || !prepared) return [];

        const matchingSongs = prepared.filter(s => s[category] === selection);
        if (matchingSongs.length < 2) return [];

        const edges = [];
        // Create connections between all matching songs (fully connected subgraph)
        for (let i = 0; i < matchingSongs.length; i++) {
            for (let j = i + 1; j < matchingSongs.length; j++) {
                edges.push({ start: matchingSongs[i], end: matchingSongs[j] });
            }
        }
        return edges;
    }, [selection, category, prepared]);

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

    if (!songs) return <div>Loading Atlas Data...</div>;

    return (
        // REMOVED overflow-hidden here to fix cutoff
        <div className="h-screen w-full pt-20 px-4 md:px-12 flex flex-col animate-fade-in overflow-visible relative">
            <Background
                isAtlas={true}
                pan={pan2d}
                mousePos={mousePos}
                viewMode={viewMode}
                rotation={rotation}
            />
            {/* UI CONTROLS */}
            <div className="absolute top-24 left-8 z-20 flex gap-4 items-start" ref={dropdownRef}>
                {/* Category Selector */}
                <div className="relative">
                    <button
                        onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsSelectionOpen(false); }}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-950/50 border border-emerald-800/60 text-xs font-display uppercase tracking-widest text-emerald-400 hover:text-white hover:border-emerald-600 transition-all shadow-lg"
                    >
                        {category ? category : "Filter Map"} <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCategoryOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-emerald-950/90 backdrop-blur-sm border border-emerald-800/60 shadow-2xl overflow-hidden z-30">
                            {/* Categories */}
                            <div>
                                {['artist', 'album', 'genre'].map(cat => (
                                    <div
                                        key={cat}
                                        onClick={() => {
                                            setCategory(cat);
                                            setIsSelectionOpen(true);
                                        }}
                                        className="px-6 py-4 text-xs font-display uppercase tracking-widest text-emerald-400 hover:bg-emerald-900/50 hover:text-white cursor-pointer transition-colors"
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>

                            {/* Close button - outside categories */}
                            <div
                                onClick={() => setIsCategoryOpen(false)}
                                className="px-6 py-4 text-xs font-display uppercase tracking-widest text-emerald-500 hover:bg-emerald-900/70 hover:text-white cursor-pointer border-t-2 border-emerald-800 flex items-center justify-between bg-emerald-950/50"
                            >
                                Close <X size={12} />
                            </div>
                        </div>
                    )}
                </div>


                {/* Value Selector */}
                {category && (
                    <div className="relative">
                        <button
                            onClick={() => setIsSelectionOpen(!isSelectionOpen)}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-950/50 border border-emerald-800/60 text-xs font-display uppercase tracking-widest text-emerald-300 hover:text-white hover:border-emerald-600 transition-all shadow-lg"
                        >
                            {selection ? selection : `Select ${category}`} <ChevronDown size={14} className={`transition-transform duration-300 ${isSelectionOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSelectionOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-emerald-950/90 backdrop-blur-sm border border-emerald-800/60 shadow-2xl z-30">
                                {/* Scrollable options area */}
                                <div className="max-h-60 overflow-y-auto">
                                    {options.map(opt => (
                                        <div
                                            key={opt}
                                            onClick={() => {
                                                setSelection(opt);
                                                trackFilterSelect(category, opt);
                                            }}
                                            className={`px-6 py-4 text-xs font-display uppercase tracking-widest cursor-pointer border-b border-emerald-800/40 transition-colors ${selection === opt
                                                ? 'bg-emerald-900 text-white'
                                                : 'text-emerald-400 hover:bg-emerald-900/50 hover:text-white'
                                                }`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>

                                {/* Close button - outside scroll area */}
                                <div
                                    onClick={() => setIsSelectionOpen(false)}
                                    className="px-6 py-4 text-xs font-display uppercase tracking-widest text-emerald-500 hover:bg-emerald-900/70 hover:text-white cursor-pointer border-t-2 border-emerald-800 flex items-center justify-between bg-emerald-950/50"
                                >
                                    Close <X size={12} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Clear Filter Button */}
                {(category || selection) && (
                    <button
                        onClick={() => {
                            setCategory(null);
                            setSelection(null);
                            setIsCategoryOpen(false);
                            setIsSelectionOpen(false);
                            trackFilterSelect('clear', 'all');
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-950/20 border border-orange-900/40 text-xs font-display uppercase tracking-widest text-orange-400/80 hover:text-white hover:bg-orange-900/30 hover:border-orange-700 transition-all shadow-lg"
                    >
                        <X size={14} /> Clear Filter
                    </button>
                )}

                {/* Gradient Mode Selector */}
                <div className="relative">
                    <button
                        onClick={() => { setIsGradientOpen(!isGradientOpen); setIsCategoryOpen(false); setIsSelectionOpen(false); }}
                        disabled={!activeGradientData || viewMode === '3d'}
                        title={viewMode === '3d' ? 'Gradient view not available in 3D mode yet' : ''}
                        className="flex items-center gap-2 px-6 py-3 bg-[#021a15] border border-emerald-900 text-xs font-display uppercase tracking-widest text-emerald-600 hover:text-white hover:border-teal-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {selectedGradient === 'none'
                            ? 'Show Gradient'
                            : activeGradientData?.interpretations[selectedGradient]?.name || selectedGradient}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isGradientOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isGradientOpen && activeGradientData && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-[#021a15] border border-emerald-900 shadow-2xl overflow-hidden z-30">
                            {/* None option */}
                            <div
                                onClick={() => {
                                    setSelectedGradient('none');
                                    setIsGradientOpen(false);
                                    trackGradientAxisChange('None');
                                }}
                                className={`px-6 py-4 text-xs font-display uppercase tracking-widest cursor-pointer border-b border-emerald-900/30 transition-colors ${selectedGradient === 'none'
                                    ? 'bg-emerald-900/40 text-white'
                                    : 'text-emerald-500 hover:bg-emerald-900/30 hover:text-white'
                                    }`}
                            >
                                None
                            </div>

                            {/* PC1 option */}
                            <div
                                onClick={() => {
                                    setSelectedGradient('pc1');
                                    setIsGradientOpen(false);
                                    trackGradientAxisChange(activeGradientData.interpretations.pc1.name);
                                }}
                                className={`px-6 py-4 cursor-pointer border-b border-emerald-900/30 transition-colors ${selectedGradient === 'pc1'
                                    ? 'bg-emerald-900/40 text-white'
                                    : 'text-emerald-500 hover:bg-emerald-900/30 hover:text-white'
                                    }`}
                            >
                                <div className="text-xs font-display uppercase tracking-widest">
                                    {activeGradientData.interpretations.pc1.name}
                                </div>
                                <div className="text-[9px] text-emerald-700 mt-1">
                                    {activeGradientData.interpretations.pc1.lowLabel} ↔ {activeGradientData.interpretations.pc1.highLabel}
                                </div>
                                <div className="text-[8px] text-emerald-800 mt-1">
                                    {activeGradientData.pca.pc1.variancePercent.toFixed(0)}% variance
                                </div>
                            </div>

                            {/* PC2 option */}
                            <div
                                onClick={() => {
                                    setSelectedGradient('pc2');
                                    setIsGradientOpen(false);
                                    trackGradientAxisChange(activeGradientData.interpretations.pc2.name);
                                }}
                                className={`px-6 py-4 cursor-pointer transition-colors ${selectedGradient === 'pc2'
                                    ? 'bg-emerald-900/40 text-white'
                                    : 'text-emerald-500 hover:bg-emerald-900/30 hover:text-white'
                                    }`}
                            >
                                <div className="text-xs font-display uppercase tracking-widest">
                                    {activeGradientData.interpretations.pc2.name}
                                </div>
                                <div className="text-[9px] text-emerald-700 mt-1">
                                    {activeGradientData.interpretations.pc2.lowLabel} ↔ {activeGradientData.interpretations.pc2.highLabel}
                                </div>
                                <div className="text-[8px] text-emerald-800 mt-1">
                                    {activeGradientData.pca.pc2.variancePercent.toFixed(0)}% variance
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading state */}
                    {!gradientData && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-[#021a15] border border-emerald-900 shadow-2xl p-4 z-30">
                            <div className="text-[9px] text-emerald-700 uppercase tracking-widest">
                                No gradient data
                            </div>
                            <div className="text-[8px] text-emerald-800 mt-2">
                                Run: node scripts/compute_gradient_axes.js
                            </div>
                        </div>
                    )}
                </div>

                {/* 2D / 3D Toggle */}
                <div className="relative">
                    <button
                        onClick={toggleViewMode}
                        disabled={!is3DAvailable || isTransitioning}
                        className={`flex items-center gap-3 px-6 py-3 bg-emerald-950/50 border border-emerald-800/60 text-xs font-display uppercase tracking-widest transition-all duration-200 shadow-lg ${is3DAvailable && !isTransitioning ? 'text-emerald-300 hover:text-white hover:border-emerald-600' : 'text-slate-500 cursor-not-allowed'}`}
                    >
                        <span className={`transition-all duration-200 ${viewMode === '2d' ? 'text-emerald-300 font-bold' : 'text-emerald-800'}`}>2D</span>
                        <div className={`w-8 h-4 rounded-full border border-emerald-800/60 relative transition-colors ${viewMode === '3d' ? 'bg-emerald-600/30' : 'bg-transparent'}`}>
                            <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 transition-all duration-300 ${viewMode === '3d' ? 'translate-x-4' : 'translate-x-0'} left-0.5`} />
                        </div>
                        <span className={`transition-all duration-200 ${viewMode === '3d' ? 'text-emerald-300 font-bold' : 'text-emerald-800'}`}>3D</span>
                        <span className="ml-1 text-[9px] bg-amber-600/80 text-black px-1 rounded font-bold">Experimental</span>
                    </button>
                </div>
            </div>

            {/* Map container with zoom/pan */}
            <div
                ref={mapRef}
                className={`flex-grow relative overflow-hidden transition-all duration-700 ease-in-out ${isPanning ? 'cursor-grabbing' : 'cursor-grab'} ${isTransitioning ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={() => setSelectedNode(null)}
            >
                {viewMode === '2d' ? (
                    <div
                        className="absolute inset-0 origin-top-left transition-transform duration-75"
                        style={{
                            transform: `translate(${pan2d.x}px, ${pan2d.y}px) scale(${zoom2d})`,
                        }}
                    >
                        {/* Map Grid - scales with zoom, fades at edges (Slightly more visible) */}
                        <div
                            className="absolute inset-0 opacity-[0.12]"
                            style={{
                                backgroundImage: `radial-gradient(circle, #fff 1px, transparent 2px)`,
                                backgroundSize: `${60 / zoom2d}px ${60 / zoom2d}px`,
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
                                    backgroundColor: `hsla(${clusterData.hue}, 25%, 60%, 0.2)`,
                                    filter: `blur(${clusterData.radius * 4}px)`,
                                    borderRadius: '50%',
                                }}
                            />
                        )}

                        {/* GRADIENT OVERLAY */}
                        {selectedGradient !== 'none' && activeGradientData && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: (() => {
                                        const colors = {
                                            low: 'rgba(6, 78, 59, 0.25)',    // dark emerald
                                            high: 'rgba(245, 158, 11, 0.25)'  // amber
                                        };

                                        const pca = gradientData.pca;
                                        let gradientDirection = '';

                                        if (selectedGradient === 'pc1') {
                                            const pc1 = pca.pc1;
                                            // Convert PC1 vector to CSS gradient direction
                                            const angle = Math.atan2(pc1.y, pc1.x) * 180 / Math.PI;
                                            gradientDirection = `${angle}deg`;
                                        } else if (selectedGradient === 'pc2') {
                                            const pc2 = pca.pc2;
                                            // Convert PC2 vector to CSS gradient direction
                                            const angle = Math.atan2(pc2.y, pc2.x) * 180 / Math.PI;
                                            gradientDirection = `${angle}deg`;
                                        }

                                        return `linear-gradient(${gradientDirection}, ${colors.low}, ${colors.high})`;
                                    })()
                                }}
                            />
                        )}

                        {/* AXIS LABELS */}
                        {selectedGradient !== 'none' && activeGradientData && (
                            <div className="absolute inset-0 pointer-events-none">
                                {(() => {
                                    const interpretations = gradientData.interpretations;
                                    const pca = gradientData.pca;
                                    let axisInfo, pc;

                                    if (selectedGradient === 'pc1') {
                                        axisInfo = interpretations.pc1;
                                        pc = pca.pc1;
                                    } else if (selectedGradient === 'pc2') {
                                        axisInfo = interpretations.pc2;
                                        pc = pca.pc2;
                                    } else {
                                        return null;
                                    }

                                    // Determine label positions based on PC direction
                                    const isHorizontal = Math.abs(pc.x) > Math.abs(pc.y);

                                    if (isHorizontal) {
                                        // Horizontal-ish axis
                                        return (
                                            <>
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200/80 text-xs font-display uppercase tracking-widest">
                                                    ← {axisInfo.lowLabel}
                                                </div>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-200/80 text-xs font-display uppercase tracking-widest">
                                                    {axisInfo.highLabel} →
                                                </div>
                                                <div className="absolute top-4 left-4 text-emerald-200/60 text-[9px] font-display uppercase tracking-widest">
                                                    {axisInfo.name}
                                                </div>
                                            </>
                                        );
                                    } else {
                                        // Vertical-ish axis
                                        return (
                                            <>
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-emerald-200/80 text-xs font-display uppercase tracking-widest">
                                                    ← {axisInfo.lowLabel}
                                                </div>
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-emerald-200/80 text-xs font-display uppercase tracking-widest">
                                                    {axisInfo.highLabel} →
                                                </div>
                                                <div className="absolute top-4 left-4 text-emerald-200/60 text-[9px] font-display uppercase tracking-widest">
                                                    {axisInfo.name}
                                                </div>
                                            </>
                                        );
                                    }
                                })()}
                            </div>
                        )}

                        {/* CONSTELLATION MESH */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            <defs>
                                {/* Gradients for regular connections */}
                                {connections.map((edge, i) => {
                                    const isHoveredConnection = hoveredNode && (edge.start.id === hoveredNode || edge.end.id === hoveredNode);
                                    const startSelected = selection && edge.start[category] === selection;
                                    const endSelected = selection && edge.end[category] === selection;
                                    const isFilteredConnection = startSelected && endSelected;
                                    const isPartialConnection = (startSelected || endSelected) && !(startSelected && endSelected);

                                    if (!isHoveredConnection && !isFilteredConnection && !isPartialConnection) return null;

                                    let startColor, midColor, endColor;

                                    if (isHoveredConnection) {
                                        startColor = edge.start.id === hoveredNode ? "rgba(255,255,255,0.9)" : "rgba(94, 234, 212, 0.2)";
                                        endColor = edge.end.id === hoveredNode ? "rgba(255,255,255,0.9)" : "rgba(94, 234, 212, 0.2)";
                                        midColor = "rgba(20, 184, 166, 0.7)";
                                    } else if (isFilteredConnection) {
                                        startColor = `hsla(${clusterData?.hue || 180}, 50%, 45%, 0.1)`;
                                        midColor = `hsla(${clusterData?.hue || 180}, 50%, 50%, 0.5)`;
                                        endColor = `hsla(${clusterData?.hue || 180}, 50%, 45%, 0.1)`;
                                    } else { // Partial connection
                                        startColor = "rgba(94, 234, 212, 0.05)";
                                        midColor = "rgba(20, 184, 166, 0.2)";
                                        endColor = "rgba(94, 234, 212, 0.05)";
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

                                {/* Gradient for filter connections - uses cluster hue */}
                                {clusterData && filterConnections.length > 0 && (
                                    <linearGradient id="filterConnectionGrad">
                                        <stop offset="0%" stopColor={`hsla(${clusterData.hue}, 50%, 45%, 0.6)`} />
                                        <stop offset="50%" stopColor={`hsla(${clusterData.hue}, 50%, 50%, 0.3)`} />
                                        <stop offset="100%" stopColor={`hsla(${clusterData.hue}, 50%, 45%, 0.6)`} />
                                    </linearGradient>
                                )}
                            </defs>

                            {/* Regular constellation connections */}
                            {connections.map((edge, i) => {
                                const startSelected = selection && edge.start[category] === selection;
                                const endSelected = selection && edge.end[category] === selection;
                                const isHoveredConnection = hoveredNode && (edge.start.id === hoveredNode || edge.end.id === hoveredNode);
                                const isFilteredConnection = startSelected && endSelected;
                                const isPartialConnection = (startSelected || endSelected) && !(startSelected && endSelected);

                                let strokeColor = "rgba(8, 51, 68, 0.4)"; // Darker, less saturated liminal blue-green
                                let strokeWidth = 0.5;
                                let useGradient = false;
                                let glowFilter = 'none';

                                if (selection) {
                                    if (isFilteredConnection) {
                                        strokeWidth = 1.2;
                                        useGradient = true;
                                        glowFilter = `drop-shadow(0 0 3px hsla(${clusterData?.hue || 180}, 50%, 45%, 0.3))`;
                                    } else if (isPartialConnection) {
                                        strokeWidth = 0.8;
                                        strokeColor = "rgba(8, 51, 68, 0.2)";
                                    } else {
                                        strokeColor = "rgba(8, 51, 68, 0.1)";
                                    }
                                }

                                if (isHoveredConnection) {
                                    strokeWidth = 1.5;
                                    useGradient = true;
                                    glowFilter = 'drop-shadow(0 0 6px rgba(94, 234, 212, 0.5))';
                                }

                                const scaledStrokeWidth = strokeWidth / zoom2d;

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

                            {/* NEW: Filter-specific connections */}
                            {filterConnections.map((edge, i) => {
                                const isHoveredConnection = hoveredNode && (edge.start.id === hoveredNode || edge.end.id === hoveredNode);
                                const scaledStrokeWidth = (isHoveredConnection ? 2.0 : 1.0) / zoom2d;

                                return (
                                    <line
                                        key={`filter-${i}`}
                                        x1={`${edge.start.displayX}%`}
                                        y1={`${edge.start.displayY}%`}
                                        x2={`${edge.end.displayX}%`}
                                        y2={`${edge.end.displayY}%`}
                                        stroke="url(#filterConnectionGrad)"
                                        strokeWidth={scaledStrokeWidth}
                                        className="transition-all duration-700 ease-out"
                                        style={{
                                            opacity: selection ? 1 : 0,
                                            filter: isHoveredConnection
                                                ? `drop-shadow(0 0 6px hsla(${clusterData?.hue || 120}, 60%, 50%, 0.6))`
                                                : `drop-shadow(0 0 3px hsla(${clusterData?.hue || 120}, 50%, 45%, 0.3))`
                                        }}
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

                            // Depth handling (3D z -> visual depth cues)
                            const zVal = Number(song.z || 50);
                            // depthFactor: >1 means closer, <1 means further. Clamp for stability.
                            const depthFactor = Math.max(0.6, Math.min(1.6, 1 + (zVal - 50) / 120));

                            // Subtle star appearance
                            let starClass = song.published ? 'text-amber-500' : 'text-slate-cool-400';
                            if (isSelected) starClass = song.published ? 'text-amber-300' : 'text-slate-cool-300';
                            if (isHovered) starClass = song.published ? 'text-amber-100' : 'text-slate-200';

                            return (
                                <div
                                    key={song.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 cursor-pointer group z-10"
                                    style={{
                                        left: `${song.displayX}%`,
                                        top: `${song.displayY}%`,
                                        opacity: ((isDimmed && selectedNode !== song.id) ? 0.25 : 1) * (0.6 + 0.4 * depthFactor),
                                        width: `${(40 * depthFactor) / zoom2d}px`,
                                        height: `${(40 * depthFactor) / zoom2d}px`,
                                    }}
                                    onMouseEnter={() => {
                                        setHoveredNode(song.id);
                                        trackNodeInteraction('hover', song);
                                    }}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (selectedNode === song.id) {
                                            // Second click - navigate if published
                                            if (song.published) {
                                                trackTrackView(song.album, song.title, song.trackId);
                                                onSelectSong(song.linkedAlbumId, song.trackId);
                                            }
                                        } else {
                                            // First click - select
                                            setSelectedNode(song.id);
                                            trackNodeInteraction('select', song);
                                        }
                                    }}
                                >
                                    <div
                                        style={{
                                            transform: `rotate(${rotation}deg) scale(${nodeScale / zoom2d})`,
                                        }}
                                        className="transition-all duration-300 ease-out"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className={`relative w-3 h-3 transition-all duration-300 ease-out ${starClass}`}
                                            fill="currentColor"
                                            style={{ filter: isHovered ? 'drop-shadow(0 0 12px rgba(255,255,255,0.7))' : (isSelected ? 'drop-shadow(0 0 8px rgba(94, 234, 212, 0.5))' : 'none') }}
                                        >
                                            <path d="M12 4L14 10L20 12L14 14L12 20L10 14L4 12L10 10Z" />
                                        </svg>
                                    </div>


                                    {/* Tooltip */}
                                    <div
                                        className={`absolute top-8 left-1/2 w-max max-w-[280px] bg-emerald-950/80 backdrop-blur-sm border border-emerald-800/60 px-4 py-3 shadow-2xl transition-all duration-300 z-50 ${selectedNode === song.id ? 'pointer-events-auto' : 'pointer-events-none'} ${(isHovered || selectedNode === song.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                                        style={{ transform: `translateX(-50%) scale(${1 / zoom2d})`, transformOrigin: 'top center' }}
                                    >
                                        <div className="text-[10px] text-emerald-400 font-display uppercase tracking-widest mb-1 flex flex-col">
                                            <span className="font-medium normal-case">{song.featuring ? `${song.artist} (feat. ${song.featuring})` : (song.artist || 'Unknown Artist')}</span>
                                            {song.producer && <span className="text-emerald-600 text-[9px] normal-case tracking-wide">Prod. {song.producer}</span>}
                                        </div>
                                        <div className="text-sm font-body text-white mb-2 leading-tight font-semibold">{song.title || song.trackId || 'Unknown Track'}</div>
                                        <div className="pt-2 border-t border-emerald-800/50 flex flex-col gap-0.5 mb-2">
                                            <div className="text-[9px] text-emerald-500 uppercase tracking-wider font-display">
                                                {song.releaseType === 'Single' ? 'Single' : (song.album || 'Album')}
                                            </div>
                                            <div className="text-[9px] text-slate-cool-400 uppercase tracking-wider font-display">
                                                {song.genre || ''}
                                            </div>
                                        </div>

                                        {/* Filter buttons - only shows when selected and published */}
                                        {selectedNode === song.id && song.published && (
                                            <div className="border-t border-slate-cool-700 pt-3 space-y-2">
                                                <div className="text-[8px] text-slate-cool-400 uppercase tracking-widest font-display mb-2">Filter by:</div>

                                                {/* Filter by Artist */}
                                                {song.artist && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCategory('artist');
                                                            setSelection(song.artist);
                                                            setIsCategoryOpen(false);
                                                            setIsSelectionOpen(false);
                                                            setSelectedNode(null);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-cool-700 text-[9px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-cool-600 transition-all pointer-events-auto flex items-center justify-between"
                                                    >
                                                        <span>Artist: {song.featuring ? `${song.artist} (feat. ${song.featuring})` : song.artist}</span>
                                                    </button>
                                                )}

                                                {/* Filter by Album */}
                                                {song.album && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCategory('album');
                                                            setSelection(song.album);
                                                            setIsCategoryOpen(false);
                                                            setIsSelectionOpen(false);
                                                            setSelectedNode(null);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-cool-700 text-[9px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-cool-600 transition-all pointer-events-auto flex items-center justify-between"
                                                    >
                                                        <span className="truncate">Album: {song.album}</span>
                                                    </button>
                                                )}

                                                {/* Filter by Genre */}
                                                {song.genre && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCategory('genre');
                                                            setSelection(song.genre);
                                                            setIsCategoryOpen(false);
                                                            setIsSelectionOpen(false);
                                                            setSelectedNode(null);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-cool-700 text-[9px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-cool-600 transition-all pointer-events-auto flex items-center justify-between"
                                                    >
                                                        <span>Genre: {song.genre}</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Navigate button - only shows when selected and published */}
                                        {selectedNode === song.id && song.published && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectSong(song.linkedAlbumId, song.trackId);
                                                }}
                                                className="mt-3 w-full px-4 py-2 bg-slate-900/80 border border-slate-cool-700 text-[10px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white transition-all pointer-events-auto flex items-center justify-center gap-2"
                                            >
                                                View Track <ArrowLeft className="rotate-180" size={10} />
                                            </button>
                                        )}

                                        {/* Unpublished message */}
                                        {selectedNode === song.id && !song.published && (
                                            <div className="border-t border-slate-cool-700 pt-3">
                                                <div className="text-[10px] text-slate-cool-400 uppercase tracking-widest font-display text-center">
                                                    Article doesn't exist
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-transparent z-0">
                        <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-emerald-300 bg-transparent">Loading 3D...</div>}>
                            <AtlasMap3D
                                ref={atlas3DRef}
                                key="atlas3d-view"
                                songs={prepared}
                                onSelectSong={onSelectSong}
                                selection={selection}
                                category={category}
                                onFilter={(type, value) => {
                                    setCategory(type);
                                    setSelection(value);
                                    setIsCategoryOpen(false);
                                    setIsSelectionOpen(false);
                                    trackFilterSelect(type, value);
                                }}
                                onZoom={setZoom3d}
                                onRotation={setRotation}
                            />
                        </Suspense>
                    </div>
                )}

                {/* Zoom controls */}
                <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-30">
                    <button
                        onClick={() => {
                            if (viewMode === '3d') {
                                atlas3DRef.current?.zoomIn();
                            } else {
                                setZoom2d(z => Math.min(MAX_ZOOM, z * 1.2));
                            }
                        }}
                        className="w-10 h-10 bg-slate-900/80 border border-slate-cool-700 text-slate-200 hover:text-white hover:border-slate-cool-600 transition-colors flex items-center justify-center text-lg font-bold"
                    >
                        +
                    </button>
                    <button
                        onClick={() => {
                            if (viewMode === '3d') {
                                atlas3DRef.current?.zoomOut();
                            } else {
                                setZoom2d(z => Math.max(MIN_ZOOM, z / 1.2));
                            }
                        }}
                        className="w-10 h-10 bg-slate-900/80 border border-slate-cool-700 text-slate-200 hover:text-white hover:border-slate-cool-600 transition-colors flex items-center justify-center text-lg font-bold"
                    >
                        −
                    </button>
                    <button
                        onClick={resetView}
                        className="w-10 h-10 bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 hover:text-white hover:border-emerald-600 transition-colors flex items-center justify-center text-xs font-display"
                    >
                        1:1
                    </button>
                </div>

                {/* Zoom indicator */}
                <div className="absolute top-24 right-8 text-xs text-emerald-600 font-display">
                    {Math.round((viewMode === '3d' ? zoom3d : zoom2d) * 100)}%
                </div>
            </div>

            <div className="absolute bottom-8 left-8 text-[10px] text-emerald-700 font-display uppercase tracking-widest max-w-xs leading-relaxed">
                Orange stars link to published articles. <br />
                Proximity correlates to shared phenomenological traits. <br />
                Visualization generated via <br />
                <span onClick={() => setIsSimilarityDropdownOpen(!isSimilarityDropdownOpen)} className="cursor-pointer text-emerald-500 hover:text-emerald-300 transition-colors underline">triplet similarity comparisons</span>.
            </div>

            {/* Similarity dropdown */}
            {isSimilarityDropdownOpen && (
                <div className="absolute bottom-20 left-8 w-80 bg-emerald-950/90 backdrop-blur-sm border border-emerald-800/60 shadow-2xl p-4 z-30">
                    <div className="text-[10px] text-emerald-400 font-display leading-relaxed">
                        Similarity rankings are translated to coordinates using the Bradley-Terry model and nonmetric multidimensional scaling (NMDS). <br />
                        Gradients are generated via principal component analysis (PCA), with manually assigned heuristic labels.
                    </div>
                </div>
            )}
        </div>
    );
};

/* --- MAIN APP --- */

export default function AetherAtlas() {
    const [currentView, setCurrentView] = useState('home');
    const [activeAlbumId, setActiveAlbumId] = useState(null);
    const [activeTrackId, setActiveTrackId] = useState(null);

    const handleOpenAlbum = (albumId) => {
        const album = INITIAL_ALBUMS.find(a => a.id === albumId);
        if (album) {
            trackAlbumView(albumId, album.title);
        }
        setActiveAlbumId(albumId);
        setActiveTrackId(null);
        setCurrentView('album');
    };

    const handleOpenTrack = (albumId, trackId) => {
        const album = INITIAL_ALBUMS.find(a => a.id === albumId);
        const track = album?.tracks.find(t => t.id === trackId);
        if (album && track) {
            trackTrackView(album.title, track.title);
        }
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
            trackAtlasInteraction('Open Atlas Map');
            return (
                <>
                    <SEO
                        title="Atlas Map"
                        description="Explore the Aether Atlas - an interactive 3D visualization mapping musical similarity. Discover connections between songs based on sonic and emotional characteristics."
                        path="/atlas"
                    />
                    <AtlasMap songs={ATLAS_NODES} onSelectSong={(albumId, trackId) => handleOpenTrack(albumId, trackId)} />
                </>
            );
        }

        if (currentView === 'about') {
            return (
                <div className="min-h-screen pt-32 px-6 max-w-2xl mx-auto animate-fade-in">
                    <SEO
                        title="About"
                        description="Learn about Aether Atlas - a digital journal exploring music through deep analysis and an interactive sonic map using triplet similarity comparisons and cognitive science methodology."
                        path="/about"
                    />
                    <h1 className="text-4xl font-display font-light text-charcoal mb-8 uppercase tracking-widest">About the Aether</h1>
                    <div className="prose prose-lg max-w-none font-body text-charcoal leading-relaxed space-y-6">
                        <p>Aether Atlas is a digital journal of my own thoughts and feelings for songs that I enjoy or hold a special place in my heart. In its current state, many reviews will likely be informal and not terribly well thought out or polished. This project started as a google doc titled "Songs/Albums". And I enjoyed writing it, so I figured that I wanted to turn it into something more.</p>

                        <p>You may have noticed that this website doesn't look like your typical music review website. The Aether Atlas is a map of the intangible. In concept, songs which are more similar should be nearer and songs that are far apart should be further from each other. Using a large enough dataset of triplet similarity rankings (e.g. which song is more similar to A? B or C?), we are able to converge on a geometric space that preserves these orderings, effectively allowing us to map out "psychological space". This is a common practice in the cognitive sciences, and I was recently exposed to it as a part of my lab group. I won't go too deep into methodology, because frankly, I am but a wee undergrad who doesn't know much about it. If you want some more technical detail, visit the <a href="https://github.com/DrakesonHu/aether-atlas" target="_blank" rel="noopener noreferrer" className="text-terracotta hover:text-charcoal transition-colors underline">GitHub repo</a>. Thanks for visiting!</p>
                    </div>
                    <div className="mt-12 pt-12 border-t border-warm-gray text-xs text-slate-600 font-display uppercase tracking-widest">© {new Date().getFullYear()} Aether Atlas. All rights reserved.</div>
                </div>
            );
        }

        return (
            <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto animate-fade-in">
                <SEO
                    title="Home"
                    description="Explore the Aether Atlas - an interactive 3D visualization mapping the relationships between albums and tracks across sonic dimensions."
                    path="/"
                />
                {/* Hero Header Integration */}
                <div className="relative mb-16">
                    {/* Vertical Decoration */}
                    <div className="absolute -left-24 top-0 h-full hidden xl:flex items-center">
                        <div className="rotate-180 [writing-mode:vertical-lr] text-[40px] font-display tracking-[0.5em] text-slate-400 uppercase whitespace-nowrap opacity-50">
                            プロジェクト：イーサーアトラス
                        </div>
                    </div>

                    <header className="relative z-10 mb-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="relative">
                                <div className="absolute -top-10 -left-6 text-[80px] font-body text-slate-300/20 select-none pointer-events-none uppercase tracking-tighter">
                                    Archive
                                </div>
                                <h1 className="text-7xl md:text-9xl font-body font-light text-charcoal tracking-tighter uppercase leading-[0.85]">
                                    Aether<br /><span className="pl-12 md:pl-32 text-terracotta/90">Atlas</span>
                                </h1>
                            </div>
                            <div className="md:text-right pb-4 border-l md:border-l-0 md:border-r border-warm-gray pl-6 md:pl-0 md:pr-6">
                                <p className="text-[10px] md:text-xs font-display tracking-[0.4em] text-terracotta uppercase leading-relaxed max-w-[240px] md:ml-auto">
                                    Mapping the phenomenology of sound and the textures of memory.
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Atlas Preview + Description Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* 3D Atlas Preview */}
                        <div
                            className="relative aspect-square lg:aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-sm border border-warm-gray overflow-hidden cursor-pointer group"
                            onClick={() => setCurrentView('atlas')}
                        >
                            <Suspense fallback={
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-emerald-400/50 text-xs font-display uppercase tracking-widest animate-pulse">Loading Atlas...</div>
                                </div>
                            }>
                                <MiniAtlasPreview songs={ATLAS_NODES} className="w-full h-full" />
                            </Suspense>

                            {/* HUD / Visual Effects Overlay - Minimalist */}
                            {/* Simple Vignette on Hover */}
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/20" />

                            {/* Center Action - Elegant & Clean */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-95 group-hover:scale-100">
                                <div className="text-[10px] font-display text-emerald-100 tracking-[0.4em] uppercase font-light border-b border-emerald-500/30 pb-2">
                                    Enter The Atlas
                                </div>
                            </div>

                            {/* Static corner label + node count - moved to bottom-left */}
                            <div className="absolute bottom-4 left-4 text-[9px] font-display text-emerald-100 tracking-widest uppercase group-hover:text-emerald-200 transition-colors duration-500">
                                <div>Atlas Preview</div>
                                <div className="text-[9px] text-amber-400/90 tracking-widest mt-1">{ATLAS_NODES.length} nodes</div>
                            </div>
                        </div>

                        {/* Description Panel */}
                        <div className="flex flex-col justify-center">
                            <div className="text-[10px] font-display tracking-[0.4em] text-terracotta uppercase mb-4">What is Aether Atlas?</div>
                            <h2 className="text-2xl md:text-3xl font-display font-light text-charcoal mb-4 leading-tight">Music criticism meets data visualization</h2>
                            <div className="space-y-4 text-sm font-body text-slate-600 leading-relaxed">
                                <p>
                                    Aether Atlas is a personal journal of thoughts and feelings about songs that hold a special place in my heart.
                                    Each review explores the emotional and sonic textures that make music meaningful.
                                </p>
                                <p>
                                    The Atlas maps songs in a psychological space—tracks that feel similar appear closer together,
                                    creating a navigable constellation of sound. Built using similarity rankings and dimensionality reduction.
                                </p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => setCurrentView('atlas')}
                                    className="text-[10px] font-display tracking-[0.2em] uppercase text-white bg-charcoal px-6 py-3 hover:bg-terracotta transition-colors"
                                >
                                    Explore Atlas
                                </button>
                                <button
                                    onClick={() => setCurrentView('about')}
                                    className="text-[10px] font-display tracking-[0.2em] uppercase text-charcoal px-6 py-3 border border-warm-gray hover:border-terracotta hover:text-terracotta transition-colors"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="h-[1px] flex-1 bg-warm-gray"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-display tracking-[0.5em] text-terracotta uppercase font-bold">Featured Review</span>
                            <div className="w-1 h-1 bg-terracotta rotate-45 mt-2"></div>
                        </div>
                        <div className="h-[1px] flex-1 bg-warm-gray"></div>
                    </div>

                    <section
                        className="relative group cursor-pointer aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm border border-warm-gray bg-warm-gray"
                        onClick={() => handleOpenAlbum(INITIAL_ALBUMS[0].id)}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                            style={{
                                backgroundImage: `url(${INITIAL_ALBUMS[0].coverImage})`,
                                filter: 'grayscale(0.2) brightness(0.7) contrast(1.1)'
                            }}
                        />
                        {/* Gradient removed — using blend mode on text for contrast */}

                        <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-16 max-w-2xl mix-blend-difference">
                            <div className="flex items-center gap-4 text-[10px] font-display tracking-[0.4em] mb-8 uppercase">
                                <span className="w-12 h-[1px] bg-terracotta mix-blend-normal"></span>
                                <span className="mix-blend-normal text-terracotta/60">Featured Article</span>
                            </div>

                            <h2 className="text-4xl md:text-7xl font-display font-light text-white opacity-95 mb-6 leading-tight uppercase tracking-wide group-hover:text-terracotta transition-colors duration-500">
                                {INITIAL_ALBUMS[0].title}
                            </h2>

                            <div className="flex flex-col gap-1 mb-10">
                                <div className="text-xl font-body text-white opacity-90 italic">{INITIAL_ALBUMS[0].artist}</div>
                                <div className="text-[10px] font-display uppercase tracking-[0.3em] text-white/80">{INITIAL_ALBUMS[0].genre} {/* {INITIAL_ALBUMS[0].releaseType} */}</div>
                            </div>

                            <div className="flex items-center gap-8">
                                <button className="group/btn relative overflow-hidden text-[10px] font-display tracking-[0.2em] uppercase text-white px-8 py-3 border border-warm-gray hover:border-terracotta transition-all duration-500">
                                    <span className="relative z-10">Enter the Aether</span>
                                    <div className="absolute inset-0 bg-rust/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                                </button>
                                <div className="hidden sm:block h-[1px] w-12 bg-warm-gray"></div>
                                <span className="text-[10px] font-display tracking-[0.2em] uppercase font-bold group-hover:text-terracotta transition-colors mix-blend-normal text-terracotta/80">
                                    REF_{INITIAL_ALBUMS[0].id.split('-').map(s => s[0]).join('').toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-4 right-4 text-[8px] font-display text-slate-600 tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                            EST. 2023 // PHASE_01
                        </div>
                    </section>
                </div>

                <div className="grid gap-20">
                    <div className="flex items-center gap-6 mb-8 mt-12">
                        <div className="h-[1px] flex-1 bg-warm-gray"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-display tracking-[0.5em] text-terracotta uppercase font-bold">Recent Articles</span>
                            <div className="w-1 h-1 bg-terracotta rotate-45 mt-2"></div>
                        </div>
                        <div className="h-[1px] flex-1 bg-warm-gray"></div>
                    </div>
                    {INITIAL_ALBUMS.slice(1).filter(album => album.published).map(album => (
                        <PostPreview key={album.id} album={album} onClick={() => handleOpenAlbum(album.id)} />
                    ))}
                </div>
            </div>
        );
    };

    const isAtlasView = currentView === 'atlas';
    const theme = isAtlasView ? COLORS.atlas : COLORS.reading;

    // Track page views when currentView changes
    useEffect(() => {
        let path = `/${currentView}`;
        if (currentView === 'album' && activeAlbumId) {
            path = `/album/${activeAlbumId}`;
        } else if (currentView === 'track' && activeAlbumId && activeTrackId) {
            path = `/track/${activeAlbumId}/${activeTrackId}`;
        }
        trackPageView(currentView, path);
    }, [currentView, activeAlbumId, activeTrackId]);

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-slate-700 selection:text-white relative z-10 transition-colors duration-500`}>
            {currentView !== 'atlas' && <Background isAtlas={false} />}
            <Navigation currentView={currentView} setView={setCurrentView} isAtlas={isAtlasView} />
            {renderContent()}
            <CookieConsent />
        </div>
    );
}
