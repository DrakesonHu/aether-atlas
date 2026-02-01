'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COLORS } from '@/lib/constants';

export default function Navigation() {
    const pathname = usePathname();
    const isAtlas = pathname === '/atlas';
    const theme = isAtlas ? COLORS.atlas : COLORS.reading;

    const currentView = pathname === '/' ? 'home' 
        : pathname === '/atlas' ? 'atlas'
        : pathname === '/about' ? 'about'
        : pathname.startsWith('/album') ? 'album'
        : pathname.startsWith('/track') ? 'track'
        : 'home';

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-sm border-b ${theme.border} transition-all duration-500 ${isAtlas ? 'bg-slate-900/80' : 'bg-white/80 shadow-sm'}`}>
            <Link
                href="/"
                className={`text-2xl font-light tracking-[0.2em] cursor-pointer font-display uppercase hover:${theme.accent} transition-colors ${isAtlas ? 'text-slate-300' : 'text-slate-dark'}`}
            >
                Aether Atlas
            </Link>
            <div className="flex space-x-8 text-xs font-display font-bold tracking-widest">
                <Link
                    href="/"
                    className={`${currentView === 'home' ? theme.accent : theme.muted} hover:${theme.accent} transition-colors uppercase`}
                >
                    Home
                </Link>
                <Link
                    href="/atlas"
                    className={`${currentView === 'atlas' ? theme.accent : theme.muted} hover:${theme.accent} transition-colors uppercase`}
                >
                    Atlas
                </Link>
                <Link
                    href="/about"
                    className={`${currentView === 'about' ? theme.accent : theme.muted} hover:${theme.accent} transition-colors uppercase`}
                >
                    About
                </Link>
            </div>
        </nav>
    );
}
