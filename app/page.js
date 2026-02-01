import Link from 'next/link';
import { Suspense } from 'react';
import { INITIAL_ALBUMS } from '@/lib/data';
import Background from '@/components/Background';
import AlbumCard from '@/components/AlbumCard';
import HomeHero from '@/components/HomeHero';

export default function HomePage() {
    const publishedAlbums = INITIAL_ALBUMS.filter(album => album.published);
    const featuredAlbum = INITIAL_ALBUMS[0];

    return (
        <>
            <Background isAtlas={false} />
            <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto animate-fade-in relative z-10">
                <HomeHero featuredAlbum={featuredAlbum} />
                
                {/* Recent Articles */}
                <div className="grid gap-20">
                    <div className="flex items-center gap-6 mb-8 mt-12">
                        <div className="h-[1px] flex-1 bg-warm-gray"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-display tracking-[0.5em] text-terracotta uppercase font-bold">Recent Articles</span>
                            <div className="w-1 h-1 bg-terracotta rotate-45 mt-2"></div>
                        </div>
                        <div className="h-[1px] flex-1 bg-warm-gray"></div>
                    </div>
                    {publishedAlbums.slice(1).map(album => (
                        <AlbumCard key={album.id} album={album} />
                    ))}
                </div>
            </div>
        </>
    );
}
