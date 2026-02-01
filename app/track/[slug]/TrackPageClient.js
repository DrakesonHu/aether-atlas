'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Disc } from 'lucide-react';
import Background from '@/components/Background';
import LyricLine from '@/components/LyricLine';
import { trackTrackView } from '@/lib/analytics';

// Dynamic import for 3D component to avoid SSR issues
const AlbumAtlasLink = dynamic(() => import('@/components/AlbumAtlasLink'), {
    ssr: false,
    loading: () => <div className="w-12 h-12 bg-slate-900/20 animate-pulse" />
});

export default function TrackPageClient({ track, album }) {
    useEffect(() => {
        window.scrollTo(0, 0);
        trackTrackView(track.id, track.title, album.id, album.title);
    }, [track, album]);

    return (
        <>
            <Background isAtlas={false} />
            <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto animate-fade-in relative z-10">
                <Link
                    href={`/album/${album.id}`}
                    className="mb-8 flex items-center gap-2 text-xs font-display uppercase tracking-widest text-slate-600 hover:text-terracotta transition-colors"
                >
                    <ArrowLeft size={14} /> Back to {album.title}
                </Link>

                <div className="mb-12 border-b border-warm-gray pb-8">
                    <div className="flex gap-8 items-start mb-6">
                        {/* Album Art with Atlas Link overlay */}
                        <div className="flex-shrink-0 relative">
                            <div className="relative w-28 h-28 overflow-hidden border border-warm-gray bg-white/50">
                                {album.coverImage ? (
                                    <img
                                        src={album.coverImage}
                                        alt={`${album.title} cover`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Disc className="text-slate-400" size={24} />
                                    </div>
                                )}
                            </div>

                            {/* Mini Atlas Preview - positioned as corner badge */}
                            <div className="absolute -bottom-2 -right-2">
                                <AlbumAtlasLink trackTitle={track.title} className="w-12 h-12 border border-warm-gray shadow-md" />
                            </div>
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
                    {track.content && track.content.length > 0 ? track.content.map((block, idx) => {
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
                                <div key={idx} className="space-y-6 text-charcoal font-body leading-relaxed">
                                    {block.value.split('\n').map((paragraph, pIdx) => (
                                        paragraph.trim() !== '' && <p key={`${idx}-${pIdx}`}>{paragraph}</p>
                                    ))}
                                </div>
                            );
                        }
                        return (
                            <div key={idx} className="space-y-6 text-charcoal font-body leading-relaxed">
                                <p>{block.value}</p>
                            </div>
                        );
                    }) : (
                        <div className="text-slate-600 italic font-body text-lg">No data available.</div>
                    )}
                </article>
            </div>
        </>
    );
}
