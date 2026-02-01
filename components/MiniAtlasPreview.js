'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Simplified star shape for efficient rendering
function createStarShape() {
    const shape = new THREE.Shape();
    const scale = 1 / 8;
    // ... shape definition ...
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

// Billboard star - brighter and sharper
function PreviewStar({ position, size = 1 }) {
    const meshRef = useRef();
    const starShape = useMemo(() => createStarShape(), []);
    const geometry = useMemo(() => new THREE.ShapeGeometry(starShape), [starShape]);
    const worldPos = useRef(new THREE.Vector3());

    useFrame(({ camera }) => {
        if (meshRef.current) {
            meshRef.current.getWorldPosition(worldPos.current);
            meshRef.current.lookAt(camera.position);
        }
    });

    // deterministic small RNG based on position to pick occasional orange accents
    const determinist = Math.abs(Math.floor(position[0] * 73856093 ^ position[1] * 19349663)) % 10;
    const isOrange = determinist < 2; // ~20% orange accents
    const color = isOrange ? '#f59e0b' : '#ccfbf1';
    const op = isOrange ? 1.0 : 0.95;

    return (
        <mesh ref={meshRef} position={position} scale={size * (isOrange ? 1.1 : 0.8)}>
            <primitive object={geometry} attach="geometry" />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={op}
                side={THREE.DoubleSide}
                toneMapped={false}
            />
        </mesh>
    );
}

// Efficient batch rendering of connections - single color, no rainbows
function ConnectionLines({ nodes }) {
    // k-nearest neighbors per node to ensure more balanced connectivity (~4 per node)
    const { tealArray, orangeArray } = useMemo(() => {
        const k = 4;
        const teal = [];
        const orange = [];

        const edgeSet = new Set();

        // helper deterministic orange check (same as PreviewStar logic)
        const isOrangeAt = (pos) => {
            const determinist = Math.abs(Math.floor(pos[0] * 73856093 ^ pos[1] * 19349663)) % 10;
            return determinist < 2;
        };

        for (let i = 0; i < nodes.length; i++) {
            const p1 = nodes[i].position;
            // compute distances to others
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
                const a = Math.min(i, n.j);
                const b = Math.max(i, n.j);
                const key = `${a}-${b}`;
                if (edgeSet.has(key)) continue;
                edgeSet.add(key);
                const p2 = n.p2;
                const eitherOrange = isOrangeAt(p1) || isOrangeAt(p2);
                if (eitherOrange) {
                    orange.push(...p1, ...p2);
                } else {
                    teal.push(...p1, ...p2);
                }
            }
        }

        return {
            tealArray: new Float32Array(teal),
            orangeArray: new Float32Array(orange)
        };
    }, [nodes]);

    const hasTeal = tealArray && tealArray.length > 0;
    const hasOrange = orangeArray && orangeArray.length > 0;

    return (
        <group>
            {hasTeal && (
                <lineSegments>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" count={tealArray.length / 3} array={tealArray} itemSize={3} />
                    </bufferGeometry>
                    <lineBasicMaterial color="#38bdf8" transparent opacity={0.10} depthWrite={false} toneMapped={false} />
                </lineSegments>
            )}

            {hasOrange && (
                <lineSegments>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" count={orangeArray.length / 3} array={orangeArray} itemSize={3} />
                    </bufferGeometry>
                    <lineBasicMaterial color="#38bdf8" transparent opacity={0.28} depthWrite={false} toneMapped={false} />
                </lineSegments>
            )}
        </group>
    );
}

// AspectCorrector: slightly correct for canvas aspect so the cloud doesn't collapse when viewed tall/narrow
function AspectCorrector({ children }) {
    const ref = useRef();
    const { size } = useThree();
    useFrame(() => {
        if (!ref.current) return;
        const aspect = size.width / Math.max(1, size.height);
        // modest correction: scale x by inverse aspect but clamp to avoid extreme stretching
        const s = Math.min(1.8, Math.max(0.6, 1 / aspect));
        ref.current.scale.x = s;
    });
    return <group ref={ref}>{children}</group>;
}

// Auto-rotating group
function RotatingGroup({ children, speed = 0.1 }) {
    const groupRef = useRef();

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * speed;
            // Gentle wobble
            groupRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.1;
        }
    });

    return <group ref={groupRef}>{children}</group>;
}

// Scene content
function PreviewScene({ nodes }) {
    return (
        <>
            <ambientLight intensity={1.5} />
            <pointLight position={[50, 50, 50]} intensity={2.0} color="#f0fdfa" />

            {/* Background stars from Drei for depth */}
            <Stars radius={80} depth={20} count={400} factor={4} saturation={0} fade speed={1} />

            <AspectCorrector>
                <RotatingGroup>
                    <ConnectionLines nodes={nodes} />

                    {/* Render stars */}
                    {nodes.map((node, i) => (
                        <PreviewStar
                            key={node.id || i}
                            position={node.position}
                            size={node.size || 1.5}
                        />
                    ))}
                </RotatingGroup>
            </AspectCorrector>
        </>
    );
}

// Main preview component
export default function MiniAtlasPreview({ songs = [], className = '' }) {
    // Transform song data to 3D positions
    const nodes = useMemo(() => {
        if (!songs.length) return [];

        // Find bounds
        const xs = songs.map(s => s.x || 50);
        const ys = songs.map(s => s.y || 50);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        // Center points
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Independent scaling to fill the square space [-40, 40]
        // This fixes "smooshing" if the data aspect ratio doesn't match the desired visual
        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;

        // Use uniform scale based on the largest dimension to prevent aspect ratio distortion
        const maxRange = Math.max(rangeX, rangeY);
        const scale = 80 / maxRange;

        return songs.map(song => {
            const x = ((song.x || 50) - centerX) * scale;
            const y = ((song.y || 50) - centerY) * scale;
            // Z depth logic
            const z = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 12;

            return {
                id: song.id,
                position: [x, y, z],
                size: 0.6 + Math.random() * 0.3
            };
        });
    }, [songs]);

    return (
        <div className={`relative ${className}`}>
            {/* Dark atlas-like background with gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #010a08 0%, #021a15 50%, #010a08 100%)'
                }}
            />

            {/* Grain texture overlay - matches actual atlas */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.15,
                    backgroundImage: 'url(/grain_turbulence_f0.4_o4.png)',
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Subtle star dust layer */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 25% 45%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 75% 15%, rgba(255,255,255,0.3), transparent), radial-gradient(1.5px 1.5px at 35% 85%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 85% 85%, rgba(255,255,255,0.3), transparent)',
                    backgroundSize: '200px 200px',
                }}
            />

            <Canvas
                camera={{
                    position: [0, 0, 120],
                    fov: 50,
                    near: 1,
                    far: 500
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
                style={{ background: 'transparent' }}
            >
                <PreviewScene nodes={nodes} />
            </Canvas>

            {/* Vignette - matches atlas style */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(1,10,8,0.7)_100%)]" />
        </div>
    );
}
