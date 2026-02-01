'use client';

import Link from 'next/link';
import { Disc, ArrowLeft } from 'lucide-react';
import { artistWithFeat } from '@/lib/utils';

export default function AlbumCard({ album }) {
    return (
        <Link href={`/album/${album.id}`}>
            <div className="group relative border-l border-warm-gray pl-6 py-8 cursor-pointer hover:border-terracotta hover:bg-rust/5 transition-all duration-500">
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
        </Link>
    );
}
