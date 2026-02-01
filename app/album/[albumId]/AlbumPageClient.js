'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Disc, ExternalLink } from 'lucide-react';
import Background from '@/components/Background';
import { artistWithFeat, slugify } from '@/lib/utils';
import { trackAlbumView } from '@/lib/analytics';

export default function AlbumPageClient({ album }) {
    useEffect(() => {
        window.scrollTo(0, 0);
        trackAlbumView(album.id, album.title, album.artist);
    }, [album]);

    return (
        <>
            <Background isAtlas={false} />
            <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto animate-fade-in relative z-10">
                <Link
                    href="/"
                    className="mb-12 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-slate-600 hover:text-terracotta transition-colors"
                >
                    <ArrowLeft size={14} /> Index
                </Link>

                <header className="mb-16 border-b border-warm-gray pb-12 relative">
                    <div className="flex gap-12 items-start mb-8">
                        {/* Large Album Cover */}
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
                                <Disc size={14} /> {album.genre}
                            </div>
                            <h1 className="text-6xl md:text-8xl font-body font-light text-charcoal mb-4 leading-tight uppercase tracking-tight">{album.title}</h1>
                            <h2 className="text-2xl md:text-3xl font-display font-light text-slate-dark mb-8 tracking-wider">{artistWithFeat(album)}</h2>
                            <div className="flex gap-4">
                                {Object.entries(album.links || {}).map(([platform, url]) => (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2 border border-warm-gray bg-cream-warm/30 text-xs font-display uppercase tracking-widest text-terracotta hover:bg-rust/20 hover:text-charcoal hover:border-terracotta transition-all flex items-center gap-2"
                                    >
                                        {platform} <ExternalLink size={10} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Album Overview */}
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

                {/* Track Links */}
                <section>
                    <h3 className="text-xs font-display font-bold uppercase tracking-widest text-slate-600 mb-6 flex items-center gap-2">
                        <span className="w-1 h-4 bg-terracotta"></span> Fragments
                    </h3>
                    <div className="grid gap-1">
                        {album.tracks.filter(track => track.published).map((track, i) => (
                            <Link
                                key={track.id}
                                href={`/track/${slugify(track.title)}`}
                                className="flex items-center justify-between p-5 border-b border-warm-gray hover:bg-rust/5 hover:pl-8 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-center gap-6">
                                    <span className="text-slate-500 font-display text-xs w-6">{(i + 1).toString().padStart(2, '0')}</span>
                                    <span className="text-2xl font-body text-charcoal group-hover:text-slate-dark transition-colors uppercase tracking-wide">{track.title}</span>
                                </div>
                                <div className="text-terracotta text-xs font-display tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">READ &gt;</div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
