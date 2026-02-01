// lib/data.js - Album and song data

export const INITIAL_ALBUMS = [
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

export const SONG_DATABASE = [
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