'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, X, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import Background from '@/components/Background';
import { SONG_DATABASE, INITIAL_ALBUMS } from '@/lib/data';
import { slugify } from '@/lib/utils';
import {
    trackAtlasInteraction,
    trackFilterSelect,
    trackGradientAxisChange,
    trackViewModeChange,
    trackNodeInteraction,
    trackTrackView
} from '@/lib/analytics';

// Dynamic import for 3D component
const AtlasMap3D = dynamic(() => import('@/components/AtlasMap3D'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center text-emerald-300 bg-transparent">Loading 3D...</div>
});

export default function AtlasPageClient() {
    const router = useRouter();

    // Load atlas nodes
    const [atlasNodes, setAtlasNodes] = useState([]);

    useEffect(() => {
        // Load atlas nodes from JSON file
        fetch('/data/atlas_nodes_3d.json')
            .then(res => res.json())
            .then(data => setAtlasNodes(data))
            .catch(err => {
                console.error('Failed to load atlas nodes:', err);
                // Fallback to SONG_DATABASE if 3D nodes not available
                setAtlasNodes(SONG_DATABASE);
            });
    }, []);

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
    const [viewMode, setViewMode] = useState('2d');
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
    const [atlas3dNodes, setAtlas3dNodes] = useState(null);
    const [gradientData3d, setGradientData3d] = useState(null);
    const [is3DAvailable, setIs3DAvailable] = useState(false);

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
                console.warn('Gradient axes not found.');
            });

        fetch('/data/atlas_nodes_3d.json')
            .then(res => {
                if (!res.ok) throw new Error('3D nodes not found');
                return res.json();
            })
            .then(data => {
                setAtlas3dNodes(data);
                setIs3DAvailable(true);
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
            })
            .catch(() => { });
    }, []);

    // Zoom and pan state
    const [zoom2d, setZoom2d] = useState(1);
    const [pan2d, setPan2d] = useState({ x: 0, y: 0 });
    const [zoom3d, setZoom3d] = useState(1);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [isTransitioning, setIsTransitioning] = useState(false);

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

        setIsGradientOpen(false);
        setIsCategoryOpen(false);
        setIsSelectionOpen(false);

        setIsTransitioning(true);
        setTimeout(() => {
            const newMode = viewMode === '2d' ? '3d' : '2d';
            trackViewModeChange(newMode);
            setViewMode(newMode);
        }, 350);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 700);
    };

    useEffect(() => { zoomRef.current = zoom2d; }, [zoom2d]);
    useEffect(() => { panRef.current = pan2d; }, [pan2d]);

    // Wheel zoom handler (2D only)
    useEffect(() => {
        const mapEl = mapRef.current;
        if (!mapEl) return;

        const wheelHandler = (e) => {
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

    const handleMouseDown = (e) => {
        if (viewMode !== '2d') return;
        if (e.button !== 0) return;
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan2d.x, y: e.clientY - pan2d.y });
    };

    const handleMouseMove = (e) => {
        if (!isPanning) return;
        setPan2d({
            x: e.clientX - panStart.x,
            y: e.clientY - panStart.y
        });
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const resetView = () => {
        if (viewMode === '3d') {
            atlas3DRef.current?.reset();
        } else {
            setZoom2d(1);
            setPan2d({ x: 0, y: 0 });
        }
    };

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

    const activeSongs = useMemo(() => {
        if (viewMode === '3d' && atlas3dNodes && atlas3dNodes.length) {
            return atlasNodes.map(s => {
                const n = atlas3dNodes.find(a => a.id === s.id);
                if (!n) return s;
                return { ...s, x: n.x, y: n.y, z: n.z };
            });
        }
        return atlasNodes;
    }, [atlasNodes, viewMode, atlas3dNodes]);

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

    const filterConnections = useMemo(() => {
        if (!selection || !category || !prepared) return [];

        const matchingSongs = prepared.filter(s => s[category] === selection);
        if (matchingSongs.length < 2) return [];

        const edges = [];
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

    const onSelectSong = (albumId, trackTitle) => {
        router.push(`/track/${slugify(trackTitle)}`);
    };

    if (!atlasNodes.length) return <div className="h-screen flex items-center justify-center text-emerald-400">Loading Atlas Data...</div>;

    return (
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

            {/* Map container */}
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
                        {/* Map Grid */}
                        <div
                            className="absolute inset-0 opacity-[0.12]"
                            style={{
                                backgroundImage: `radial-gradient(circle, #fff 1px, transparent 2px)`,
                                backgroundSize: `${60 / zoom2d}px ${60 / zoom2d}px`,
                                maskImage: `radial-gradient(ellipse 80% 80% at center, black 40%, transparent 100%)`,
                                WebkitMaskImage: `radial-gradient(ellipse 80% 80% at center, black 40%, transparent 100%)`
                            }}
                        />

                        {/* Cluster Highlight */}
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

                        {/* Gradient Overlay */}
                        {selectedGradient !== 'none' && gradientData && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: (() => {
                                        const colors = {
                                            low: 'rgba(6, 78, 59, 0.25)',
                                            high: 'rgba(245, 158, 11, 0.25)'
                                        };

                                        const pca = gradientData.pca;
                                        let gradientDirection = '';

                                        if (selectedGradient === 'pc1') {
                                            const pc1 = pca.pc1;
                                            const angle = Math.atan2(pc1.y, pc1.x) * 180 / Math.PI;
                                            gradientDirection = `${angle}deg`;
                                        } else if (selectedGradient === 'pc2') {
                                            const pc2 = pca.pc2;
                                            const angle = Math.atan2(pc2.y, pc2.x) * 180 / Math.PI;
                                            gradientDirection = `${angle}deg`;
                                        }

                                        return `linear-gradient(${gradientDirection}, ${colors.low}, ${colors.high})`;
                                    })()
                                }}
                            />
                        )}

                        {/* Constellation Mesh */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            <defs>
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
                                    } else {
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

                                {clusterData && filterConnections.length > 0 && (
                                    <linearGradient id="filterConnectionGrad">
                                        <stop offset="0%" stopColor={`hsla(${clusterData.hue}, 50%, 45%, 0.6)`} />
                                        <stop offset="50%" stopColor={`hsla(${clusterData.hue}, 50%, 50%, 0.3)`} />
                                        <stop offset="100%" stopColor={`hsla(${clusterData.hue}, 50%, 45%, 0.6)`} />
                                    </linearGradient>
                                )}
                            </defs>

                            {connections.map((edge, i) => {
                                const startSelected = selection && edge.start[category] === selection;
                                const endSelected = selection && edge.end[category] === selection;
                                const isHoveredConnection = hoveredNode && (edge.start.id === hoveredNode || edge.end.id === hoveredNode);
                                const isFilteredConnection = startSelected && endSelected;
                                const isPartialConnection = (startSelected || endSelected) && !(startSelected && endSelected);

                                let strokeColor = "rgba(8, 51, 68, 0.4)";
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

                        {/* Nodes */}
                        {prepared.map((song) => {
                            const isDimmed = selection && song[category] !== selection;
                            const isSelected = selection && song[category] === selection;
                            const isHovered = hoveredNode === song.id;
                            const rotation = (song.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 13) % 360;

                            let nodeScale = 1;
                            if (isDimmed) nodeScale = 0.7;
                            if (isSelected) nodeScale = 1.3;
                            if (isHovered) nodeScale = 1.8;

                            const zVal = Number(song.z || 50);
                            const depthFactor = Math.max(0.6, Math.min(1.6, 1 + (zVal - 50) / 120));

                            let starClass = song.published ? 'text-amber-500' : 'text-slate-400';
                            if (isSelected) starClass = song.published ? 'text-amber-300' : 'text-slate-300';
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
                                            if (song.published) {
                                                trackTrackView(song.trackId, song.title, song.linkedAlbumId, song.album);
                                                onSelectSong(song.linkedAlbumId, song.title);
                                            }
                                        } else {
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
                                            <div className="text-[9px] text-slate-400 uppercase tracking-wider font-display">
                                                {song.genre || ''}
                                            </div>
                                        </div>

                                        {/* Filter buttons */}
                                        {selectedNode === song.id && song.published && (
                                            <div className="border-t border-slate-700 pt-3 space-y-2">
                                                <div className="text-[8px] text-slate-400 uppercase tracking-widest font-display mb-2">Filter by:</div>
                                                {song.artist && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCategory('artist');
                                                            setSelection(song.artist);
                                                            setSelectedNode(null);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-700 text-[9px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white transition-all pointer-events-auto flex items-center justify-between"
                                                    >
                                                        <span>Artist: {song.artist}</span>
                                                    </button>
                                                )}
                                                {song.album && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCategory('album');
                                                            setSelection(song.album);
                                                            setSelectedNode(null);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-700 text-[9px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white transition-all pointer-events-auto flex items-center justify-between"
                                                    >
                                                        <span className="truncate">Album: {song.album}</span>
                                                    </button>
                                                )}
                                                {song.genre && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCategory('genre');
                                                            setSelection(song.genre);
                                                            setSelectedNode(null);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-700 text-[9px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white transition-all pointer-events-auto flex items-center justify-between"
                                                    >
                                                        <span>Genre: {song.genre}</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {selectedNode === song.id && song.published && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectSong(song.linkedAlbumId, song.title);
                                                }}
                                                className="mt-3 w-full px-4 py-2 bg-slate-900/80 border border-slate-700 text-[10px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white transition-all pointer-events-auto flex items-center justify-center gap-2"
                                            >
                                                View Track <ArrowLeft className="rotate-180" size={10} />
                                            </button>
                                        )}

                                        {selectedNode === song.id && !song.published && (
                                            <div className="border-t border-slate-700 pt-3">
                                                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-display text-center">
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
                        className="w-10 h-10 bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-600 transition-colors flex items-center justify-center text-lg font-bold"
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
                        className="w-10 h-10 bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-600 transition-colors flex items-center justify-center text-lg font-bold"
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
}
