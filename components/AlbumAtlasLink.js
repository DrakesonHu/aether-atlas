'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import { SONG_DATABASE, INITIAL_ALBUMS } from '@/lib/data';
import { slugify } from '@/lib/utils';

// Simplified star shape
function createStarShape() {
    const shape = new THREE.Shape();
    const scale = 1 / 8;
    shape.moveTo(0 * scale, 8 * scale);
    shape.lineTo(2 * scale, 2 * scale);
    shape.lineTo(8 * scale, 0 * scale);
    shape.lineTo(2 * scale, -2 * scale);
    shape.lineTo(0 * scale, -8 * scale);
    shape.lineTo(-2 * scale, -2 * scale);
    shape.lineTo(-8 * scale, 0 * scale);
    shape.lineTo(-2 * scale, 2 * scale);
    shape.closePath();
    return shape;
}

// Billboard star with highlight capability
function PreviewStar({ position, size = 1, isHighlighted = false }) {
    const meshRef = useRef();
    const starShape = useMemo(() => createStarShape(), []);
    const geometry = useMemo(() => new THREE.ShapeGeometry(starShape), [starShape]);
    const worldPos = useRef(new THREE.Vector3());

    useFrame(({ camera, clock }) => {
        if (meshRef.current) {
            meshRef.current.getWorldPosition(worldPos.current);
            meshRef.current.lookAt(camera.position);

            // Gentle pulse animation for highlighted stars
            if (isHighlighted) {
                const pulse = 1 + Math.sin(clock.elapsedTime * 2.5) * 0.2;
                meshRef.current.scale.setScalar(size * pulse);
            }
        }
    });

    // Highlighted star is bright amber, others are very subtle
    const color = isHighlighted ? '#f59e0b' : '#5eead4';
    const opacity = isHighlighted ? 1.0 : 0.25;
    const baseScale = isHighlighted ? size * 1.8 : size * 0.4;

    return (
        <mesh ref={meshRef} position={position} scale={baseScale}>
            <primitive object={geometry} attach="geometry" />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={opacity}
                side={THREE.DoubleSide}
                toneMapped={false}
            />
        </mesh>
    );
}

// Minimal connection lines
function ConnectionLines({ nodes, highlightedIds }) {
    const linesArray = useMemo(() => {
        const lines = [];
        const k = 3;
        const highlightSet = new Set(highlightedIds);

        for (let i = 0; i < nodes.length; i++) {
            const p1 = nodes[i].position;
            const dists = [];
            for (let j = 0; j < nodes.length; j++) {
                if (i === j) continue;
                const p2 = nodes[j].position;
                const dx = p2[0] - p1[0];
                const dy = p2[1] - p1[1];
                const dz = p2[2] - p1[2];
                const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
                dists.push({ j, d, p2 });
            }
            dists.sort((a, b) => a.d - b.d);
            const neighbors = dists.slice(0, k);
            for (const n of neighbors) {
                const isHighlightConnection = highlightSet.has(nodes[i].id) || highlightSet.has(nodes[n.j].id);
                lines.push({ p1, p2: n.p2, highlighted: isHighlightConnection });
            }
        }

        return lines;
    }, [nodes, highlightedIds]);

    const normalLines = linesArray.filter(l => !l.highlighted);
    const highlightLines = linesArray.filter(l => l.highlighted);

    const normalArray = new Float32Array(normalLines.flatMap(l => [...l.p1, ...l.p2]));
    const highlightArray = new Float32Array(highlightLines.flatMap(l => [...l.p1, ...l.p2]));

    return (
        <group>
            {normalArray.length > 0 && (
                <lineSegments>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" count={normalArray.length / 3} array={normalArray} itemSize={3} />
                    </bufferGeometry>
                    <lineBasicMaterial color="#5eead4" transparent opacity={0.05} depthWrite={false} toneMapped={false} />
                </lineSegments>
            )}
            {highlightArray.length > 0 && (
                <lineSegments>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" count={highlightArray.length / 3} array={highlightArray} itemSize={3} />
                    </bufferGeometry>
                    <lineBasicMaterial color="#f59e0b" transparent opacity={0.3} depthWrite={false} toneMapped={false} />
                </lineSegments>
            )}
        </group>
    );
}

// Auto-rotating group
function RotatingGroup({ children, speed = 0.12 }) {
    const groupRef = useRef();

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * speed;
            groupRef.current.rotation.x = Math.sin(Date.now() * 0.0002) * 0.06;
        }
    });

    return <group ref={groupRef}>{children}</group>;
}

// Scene content
function PreviewScene({ nodes, highlightedIds }) {
    const highlightSet = new Set(highlightedIds);

    return (
        <>
            <ambientLight intensity={1.0} />
            <Stars radius={50} depth={10} count={150} factor={2} saturation={0} fade speed={0.3} />

            <RotatingGroup>
                <ConnectionLines nodes={nodes} highlightedIds={highlightedIds} />
                {nodes.map((node, i) => (
                    <PreviewStar
                        key={node.id || i}
                        position={node.position}
                        size={node.size || 1}
                        isHighlighted={highlightSet.has(node.id)}
                    />
                ))}
            </RotatingGroup>
        </>
    );
}

// Main component
export default function AlbumAtlasLink({ albumId, trackTitle, className = '' }) {
    const [atlasNodes, setAtlasNodes] = useState([]);

    // Load atlas nodes from JSON
    useEffect(() => {
        fetch('/data/atlas_nodes_3d.json')
            .then(res => res.json())
            .then(data => setAtlasNodes(data))
            .catch(err => console.error('Failed to load atlas nodes:', err));
    }, []);

    // Find the track(s) to highlight - returns array of IDs
    const highlightedIds = useMemo(() => {
        if (trackTitle) {
            // Find specific track by title
            const track = SONG_DATABASE.find(s => slugify(s.title) === slugify(trackTitle));
            return track ? [track.id] : [];
        }
        if (albumId) {
            // Find ALL tracks of the album
            const albumTracks = SONG_DATABASE.filter(s => s.linkedAlbumId === albumId);
            return albumTracks.map(t => t.id);
        }
        return [];
    }, [albumId, trackTitle]);

    // Transform atlas nodes to 3D positions, merging with SONG_DATABASE metadata
    const nodes = useMemo(() => {
        if (!atlasNodes.length) return [];

        // Create a lookup for song metadata
        const songLookup = {};
        SONG_DATABASE.forEach(s => { songLookup[s.id] = s; });

        const xs = atlasNodes.map(n => n.x);
        const ys = atlasNodes.map(n => n.y);
        const zs = atlasNodes.map(n => n.z || 0);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const minZ = Math.min(...zs);
        const maxZ = Math.max(...zs);

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;

        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;
        const rangeZ = maxZ - minZ || 1;
        const maxRange = Math.max(rangeX, rangeY, rangeZ);
        const scale = 50 / maxRange;

        const highlightSet = new Set(highlightedIds);

        return atlasNodes.map(node => {
            const x = (node.x - centerX) * scale;
            const y = (node.y - centerY) * scale;
            const z = ((node.z || 0) - centerZ) * scale;
            const isHighlighted = highlightSet.has(node.id);

            return {
                id: node.id,
                position: [x, y, z],
                size: isHighlighted ? 1.2 : 0.6,
                song: songLookup[node.id]
            };
        });
    }, [atlasNodes, highlightedIds]);

    // Build atlas link - albums use filter by album title, tracks use selection
    const albumTitle = albumId ? INITIAL_ALBUMS.find(a => a.id === albumId)?.title : null;
    const atlasHref = albumId && albumTitle
        ? `/atlas?view=3d&filter=album&value=${encodeURIComponent(albumTitle)}`
        : `/atlas?view=3d&select=${highlightedIds[0] || ''}`;

    if (!atlasNodes.length) {
        return (
            <Link href={atlasHref} className={`block ${className}`}>
                <div className="relative w-full aspect-square bg-slate-900/30 animate-pulse border border-warm-gray/20" />
            </Link>
        );
    }

    return (
        <Link href={atlasHref} className={`block group ${className}`}>
            <div className="relative w-full aspect-square overflow-hidden border border-warm-gray/20 bg-slate-900/30 transition-all duration-300 group-hover:border-amber-500/40 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.1)]">
                {/* Dark background */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #010a08 0%, #021a15 50%, #010a08 100%)'
                    }}
                />

                <Canvas
                    camera={{
                        position: [0, 0, 80],
                        fov: 40,
                        near: 1,
                        far: 200
                    }}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance'
                    }}
                    style={{ background: 'transparent' }}
                >
                    <PreviewScene nodes={nodes} highlightedIds={highlightedIds} />
                </Canvas>

                {/* Subtle vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(1,10,8,0.6)_100%)]" />

                {/* Minimal label */}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-slate-900/80 to-transparent">
                    <div className="text-[8px] font-display uppercase tracking-[0.15em] text-amber-400/60 group-hover:text-amber-400/90 transition-colors text-center">
                        Atlas →
                    </div>
                </div>
            </div>
        </Link>
    );
}
