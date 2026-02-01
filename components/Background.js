'use client';

import { useState, useEffect } from 'react';
import { PARALLAX_CONFIG } from '@/lib/constants';

export default function Background({ isAtlas = false, pan = { x: 0, y: 0 }, mousePos = { x: 0, y: 0 }, viewMode = '2d', rotation = { x: 0, y: 0 } }) {
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
    const normX = typeof window !== 'undefined' ? (mouseX / window.innerWidth) * 2 - 1 : 0;
    const normY = typeof window !== 'undefined' ? (mouseY / window.innerHeight) * 2 - 1 : 0;

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
            {/* Light Leaks / Light Flares - WKW Style */}
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

            {/* WKW Horizontal Light Streaks */}
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

            {/* Grain overlay */}
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

            {/* Second grain layer */}
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

            {/* Second Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(1,10,8,0.9)_100%)] pointer-events-none" />
        </div>
    );
}
