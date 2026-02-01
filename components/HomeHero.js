'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ATLAS_NODES from '@/lib/data.json';

const MiniAtlasPreview = dynamic(() => import('./MiniAtlasPreview'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-emerald-400/50 text-xs font-display uppercase tracking-widest animate-pulse">Loading Atlas...</div>
        </div>
    )
});

export default function HomeHero({ featuredAlbum }) {
    return (
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
                <Link
                    href="/atlas"
                    className="relative aspect-square lg:aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-sm border border-warm-gray overflow-hidden cursor-pointer group"
                >
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-emerald-400/50 text-xs font-display uppercase tracking-widest animate-pulse">Loading Atlas...</div>
                        </div>
                    }>
                        <MiniAtlasPreview songs={ATLAS_NODES} className="w-full h-full" />
                    </Suspense>

                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/20" />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-95 group-hover:scale-100">
                        <div className="text-[10px] font-display text-emerald-100 tracking-[0.4em] uppercase font-light border-b border-emerald-500/30 pb-2">
                            Enter The Atlas
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 text-[9px] font-display text-emerald-100 tracking-widest uppercase group-hover:text-emerald-200 transition-colors duration-500">
                        <div>Atlas Preview</div>
                        <div className="text-[9px] text-amber-400/90 tracking-widest mt-1">{ATLAS_NODES.length} nodes</div>
                    </div>
                </Link>

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
                        <Link
                            href="/atlas"
                            className="text-[10px] font-display tracking-[0.2em] uppercase text-white bg-charcoal px-6 py-3 hover:bg-terracotta transition-colors"
                        >
                            Explore Atlas
                        </Link>
                        <Link
                            href="/about"
                            className="text-[10px] font-display tracking-[0.2em] uppercase text-charcoal px-6 py-3 border border-warm-gray hover:border-terracotta hover:text-terracotta transition-colors"
                        >
                            Learn More
                        </Link>
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

            {/* Featured Album */}
            <Link
                href={`/album/${featuredAlbum.id}`}
                className="relative group cursor-pointer aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm border border-warm-gray bg-warm-gray block"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                    style={{
                        backgroundImage: `url(${featuredAlbum.coverImage})`,
                        filter: 'grayscale(0.2) brightness(0.7) contrast(1.1)'
                    }}
                />

                <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-16 max-w-2xl mix-blend-difference">
                    <div className="flex items-center gap-4 text-[10px] font-display tracking-[0.4em] mb-8 uppercase">
                        <span className="w-12 h-[1px] bg-terracotta mix-blend-normal"></span>
                        <span className="mix-blend-normal text-terracotta/60">Featured Article</span>
                    </div>

                    <h2 className="text-4xl md:text-7xl font-display font-light text-white opacity-95 mb-6 leading-tight uppercase tracking-wide group-hover:text-terracotta transition-colors duration-500">
                        {featuredAlbum.title}
                    </h2>

                    <div className="flex flex-col gap-1 mb-10">
                        <div className="text-xl font-body text-white opacity-90 italic">{featuredAlbum.artist}</div>
                        <div className="text-[10px] font-display uppercase tracking-[0.3em] text-white/80">{featuredAlbum.genre}</div>
                    </div>

                    <div className="flex items-center gap-8">
                        <span className="group/btn relative overflow-hidden text-[10px] font-display tracking-[0.2em] uppercase text-white px-8 py-3 border border-warm-gray hover:border-terracotta transition-all duration-500">
                            <span className="relative z-10">Enter the Aether</span>
                            <span className="absolute inset-0 bg-rust/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></span>
                        </span>
                        <div className="hidden sm:block h-[1px] w-12 bg-warm-gray"></div>
                        <span className="text-[10px] font-display tracking-[0.2em] uppercase font-bold group-hover:text-terracotta transition-colors mix-blend-normal text-terracotta/80">
                            REF_{featuredAlbum.id.split('-').map(s => s[0]).join('').toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="absolute top-4 right-4 text-[8px] font-display text-slate-600 tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                    EST. 2023 // PHASE_01
                </div>
            </Link>
        </div>
    );
}
