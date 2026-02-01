'use client';

import React, { useMemo, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ATLAS3D_CONFIG } from './atlas3dConfig';
import {
    trackNodeInteraction,
    trackFilterSelect,
    trackTrackView
} from '@/lib/analytics';

// Track camera rotation for parallax
function RotationTracker({ onRotation }) {
    const { camera } = useThree();

    useFrame(() => {
        if (onRotation) {
            onRotation(camera.rotation);
        }
    });

    return null;
}

// Position label at star with fixed screen-space offset (no camera-relative flipping)
function CameraRelativeHtml({ starPosition, children, isSelected, ...props }) {
    const offset = ATLAS3D_CONFIG.tooltipOffset;

    return (
        <Html
            position={starPosition}
            style={{
                pointerEvents: 'auto',
                transform: `translate(${offset[0] * 10}px, ${-offset[1] * 10}px)`,
                transformOrigin: 'top left'
            }}
            {...props}
        >
            {children}
        </Html>
    );
}

// 4-pointed star shape matching the 2D SVG path: M12 4L14 10L20 12L14 14L12 20L10 14L4 12L10 10Z
function createStarShape() {
    const shape = new THREE.Shape();
    // Normalized to center at origin, scaled to unit size
    const scale = 1 / 8; // Original is 16 units wide (4 to 20), normalize to 2 units
    shape.moveTo(0 * scale, 8 * scale);   // top point (12,4) -> (0, 8)
    shape.lineTo(2 * scale, 2 * scale);   // (14,10) -> (2, 2)
    shape.lineTo(8 * scale, 0 * scale);   // right point (20,12) -> (8, 0)
    shape.lineTo(2 * scale, -2 * scale);  // (14,14) -> (2, -2)
    shape.lineTo(0 * scale, -8 * scale);  // bottom point (12,20) -> (0, -8)
    shape.lineTo(-2 * scale, -2 * scale); // (10,14) -> (-2, -2)
    shape.lineTo(-8 * scale, 0 * scale);  // left point (4,12) -> (-8, 0)
    shape.lineTo(-2 * scale, 2 * scale);  // (10,10) -> (-2, 2)
    shape.closePath();
    return shape;
}

const MapController = forwardRef(({ onZoom }, ref) => {
    const controlsRef = useRef();
    const { camera } = useThree();
    const lastZoomRef = useRef(1);

    // Report zoom changes back to parent
    useFrame(() => {
        if (controlsRef.current && onZoom) {
            const target = controlsRef.current.target;
            const distance = camera.position.distanceTo(target);
            // Default distance is 100 in config. We invert it so closer = larger zoom.
            // 100 distance = 1.0 zoom (100%)
            const zoomLevel = 100 / distance;

            // Only update if it changed by more than 0.5% to avoid excessive re-renders
            if (Math.abs(zoomLevel - lastZoomRef.current) > 0.005) {
                onZoom(zoomLevel);
                lastZoomRef.current = zoomLevel;
            }
        }
    });

    useImperativeHandle(ref, () => ({
        zoomIn: () => {
            if (!controlsRef.current) return;
            const target = controlsRef.current.target;
            const distance = camera.position.distanceTo(target);
            // Zoom in by 20%
            const newDistance = Math.max(distance * 0.8, 5);

            const direction = new THREE.Vector3().subVectors(camera.position, target).normalize();
            const newPos = target.clone().add(direction.multiplyScalar(newDistance));

            camera.position.copy(newPos);
            controlsRef.current.update();
        },
        zoomOut: () => {
            if (!controlsRef.current) return;
            const target = controlsRef.current.target;
            const distance = camera.position.distanceTo(target);
            // Zoom out by 20%
            const newDistance = Math.min(distance * 1.2, 300);

            const direction = new THREE.Vector3().subVectors(camera.position, target).normalize();
            const newPos = target.clone().add(direction.multiplyScalar(newDistance));

            camera.position.copy(newPos);
            controlsRef.current.update();
        },
        reset: () => {
            if (!controlsRef.current) return;
            controlsRef.current.reset();
            camera.position.set(...ATLAS3D_CONFIG.cameraPosition);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    }));

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={ATLAS3D_CONFIG.enablePan}
            enableZoom={ATLAS3D_CONFIG.enableZoom}
            enableRotate={ATLAS3D_CONFIG.enableRotate}
            dampingFactor={ATLAS3D_CONFIG.dampingFactor}
        />
    );
});

// Billboard star that always faces camera with smooth transitions
function BillboardStar({ position, color, emissive, emissiveIntensity, scale, opacity, rotation, ignoreFog }) {
    const meshRef = useRef();
    const materialRef = useRef();
    const targetEmissiveRef = useRef(new THREE.Color(emissive));
    const targetIntensityRef = useRef(emissiveIntensity);
    const currentScaleRef = useRef(scale);
    const currentOpacityRef = useRef(opacity);

    // Update targets when props change
    targetEmissiveRef.current.set(emissive);
    targetIntensityRef.current = emissiveIntensity;

    useFrame(({ camera }, delta) => {
        if (meshRef.current) {
            meshRef.current.quaternion.copy(camera.quaternion);
            meshRef.current.rotation.z = rotation;

            // Smooth ease-in for scale and opacity (using star-specific speeds)
            const scaleSpeed = scale > currentScaleRef.current ? ATLAS3D_CONFIG.starAttackSpeed : ATLAS3D_CONFIG.starReleaseSpeed;
            const opacitySpeed = opacity > currentOpacityRef.current ? ATLAS3D_CONFIG.starAttackSpeed : ATLAS3D_CONFIG.starReleaseSpeed;

            currentScaleRef.current += (scale - currentScaleRef.current) * Math.min(delta * scaleSpeed, 1);
            currentOpacityRef.current += (opacity - currentOpacityRef.current) * Math.min(delta * opacitySpeed, 1);

            meshRef.current.scale.setScalar(currentScaleRef.current);
        }

        // Smooth lerp for emissive color and intensity (using star-specific speeds)
        if (materialRef.current) {
            const currentIntensity = materialRef.current.emissiveIntensity || 0;
            const targetIntensity = targetIntensityRef.current;
            const speed = targetIntensity > currentIntensity ? ATLAS3D_CONFIG.starAttackSpeed : ATLAS3D_CONFIG.starReleaseSpeed;
            materialRef.current.emissive.lerp(targetEmissiveRef.current, Math.min(delta * speed, 1));
            materialRef.current.emissiveIntensity = currentIntensity + (targetIntensity - currentIntensity) * Math.min(delta * speed, 1);
            materialRef.current.opacity = currentOpacityRef.current;
        }
    });

    const starGeometry = useMemo(() => {
        const shape = createStarShape();
        const geometry = new THREE.ShapeGeometry(shape);
        geometry.center();
        return geometry;
    }, []);

    return (
        <mesh
            ref={meshRef}
            position={position}
            geometry={starGeometry}
        >
            <meshStandardMaterial
                ref={materialRef}
                color={color}
                metalness={0}
                roughness={0.5}
                transparent
                side={THREE.DoubleSide}
                fog={!ignoreFog}
            />
        </mesh>
    );
}

// Line bloom sprite - soft glow along line path (properly aligned to 3D line)
function LineBloomSprite({ points, isHighlighted, highlightedEnd }) {
    const meshRef = useRef();
    const materialRef = useRef();
    const currentIntensityRef = useRef(0);
    const targetIntensity = isHighlighted ? ATLAS3D_CONFIG.lineBloomIntensity : 0;

    // Calculate line properties
    const { midpoint, length } = useMemo(() => {
        const start = new THREE.Vector3(...points[0]);
        const end = new THREE.Vector3(...points[1]);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const len = start.distanceTo(end);

        return { midpoint: mid, length: len };
    }, [points]);

    useFrame(({ camera }, delta) => {
        if (meshRef.current) {
            // Get direction from line midpoint to camera
            const toCamera = new THREE.Vector3().subVectors(camera.position, midpoint);

            // Get line direction
            const start = new THREE.Vector3(...points[0]);
            const end = new THREE.Vector3(...points[1]);
            const lineDir = end.clone().sub(start).normalize();

            // Cross product gives us the "up" direction for the billboard
            const right = new THREE.Vector3().crossVectors(lineDir, toCamera).normalize();
            const up = new THREE.Vector3().crossVectors(right, lineDir).normalize();

            // Build rotation matrix
            const matrix = new THREE.Matrix4();
            matrix.makeBasis(lineDir, up, right);
            meshRef.current.quaternion.setFromRotationMatrix(matrix);
        }
        if (materialRef.current) {
            const speed = targetIntensity > currentIntensityRef.current ? ATLAS3D_CONFIG.attackSpeed : ATLAS3D_CONFIG.releaseSpeed;
            currentIntensityRef.current += (targetIntensity - currentIntensityRef.current) * Math.min(delta * speed, 1);
            materialRef.current.opacity = currentIntensityRef.current;
        }
    });

    // Create gradient texture for line glow (greener teal)
    const glowTexture = useMemo(() => {
        const width = 256;
        const height = 64;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Horizontal gradient matching highlight direction
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        if (highlightedEnd === 0) {
            // Bright at start (left)
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(94, 234, 180, 0.6)');
            gradient.addColorStop(0.5, 'rgba(15, 140, 90, 0.2)');
            gradient.addColorStop(1, 'rgba(5, 40, 50, 0)');
        } else if (highlightedEnd === 1) {
            // Bright at end (right)
            gradient.addColorStop(0, 'rgba(5, 40, 50, 0)');
            gradient.addColorStop(0.5, 'rgba(15, 140, 90, 0.2)');
            gradient.addColorStop(0.8, 'rgba(94, 234, 180, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        } else {
            // Both ends bright
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.3, 'rgba(94, 234, 180, 0.4)');
            gradient.addColorStop(0.5, 'rgba(15, 140, 90, 0.2)');
            gradient.addColorStop(0.7, 'rgba(94, 234, 180, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Vertical fade for soft edges
        const vertGradient = ctx.createLinearGradient(0, 0, 0, height);
        vertGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vertGradient.addColorStop(0.35, 'rgba(0, 0, 0, 1)');
        vertGradient.addColorStop(0.65, 'rgba(0, 0, 0, 1)');
        vertGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillStyle = vertGradient;
        ctx.fillRect(0, 0, width, height);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }, [highlightedEnd]);

    if (!ATLAS3D_CONFIG.lineBloomEnabled) return null;

    return (
        <mesh ref={meshRef} position={midpoint} scale={[length, ATLAS3D_CONFIG.lineBloomWidth, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                ref={materialRef}
                map={glowTexture}
                transparent
                opacity={0}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// Line with tube geometry for variable thickness
function ConnectionLine({ points, isHighlighted, highlightedEnd, isDimmed, isFilterHighlight, filterHue }) {
    const meshRef = useRef();
    const highlightRef = useRef(isHighlighted ? 1 : 0);
    const targetHighlightRef = useRef(isHighlighted ? 1 : 0);
    const highlightEndRef = useRef(highlightedEnd);
    const currentRadiusRef = useRef(ATLAS3D_CONFIG.lineBaseRadius);
    const filterHighlightRef = useRef(isFilterHighlight ? 1 : 0);
    const dimmedRef = useRef(isDimmed ? 1 : 0);

    targetHighlightRef.current = isHighlighted ? 1 : 0;
    highlightEndRef.current = highlightedEnd;

    // Colors from config
    const [baseR, baseG, baseB] = useMemo(() => ATLAS3D_CONFIG.lineBaseColor, []);
    const [brightR, brightG, brightB] = useMemo(() => ATLAS3D_CONFIG.lineBrightColor, []);
    const [tealR, tealG, tealB] = useMemo(() => ATLAS3D_CONFIG.lineTealColor, []);
    const [darkR, darkG, darkB] = useMemo(() => ATLAS3D_CONFIG.lineDarkTealColor || ATLAS3D_CONFIG.lineBaseColor, []);

    // Create custom shader material for opacity gradients
    const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            fogColor: { value: new THREE.Color(ATLAS3D_CONFIG.fogColor) },
            fogNear: { value: ATLAS3D_CONFIG.fogNear },
            fogFar: { value: ATLAS3D_CONFIG.fogFar }
        },
        vertexShader: `
            attribute vec4 color;
            varying vec4 vColor;
            varying float vFogDepth;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                vFogDepth = -mvPosition.z;
            }
        `,
        fragmentShader: `
            varying vec4 vColor;
            varying float vFogDepth;
            uniform vec3 fogColor;
            uniform float fogNear;
            uniform float fogFar;
            void main() {
                float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
                gl_FragColor = vColor;
                // Additive blending fog: fade to black/transparent
                gl_FragColor.rgb *= (1.0 - fogFactor);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        // Ensure vertex colors are expected
    }), []);

    // Create curve for TubeGeometry
    const startPoint = points[0];
    const endPoint = points[1];

    const curve = useMemo(() => {
        return new THREE.LineCurve3(
            new THREE.Vector3(...startPoint),
            new THREE.Vector3(...endPoint)
        );
    }, [startPoint, endPoint]);

    // Target radius based on highlight state
    const targetRadius = isHighlighted ? ATLAS3D_CONFIG.lineHighlightRadius :
        isFilterHighlight ? ATLAS3D_CONFIG.lineBaseRadius * 1.5 :
            ATLAS3D_CONFIG.lineBaseRadius;

    // Filter highlight color (based on hue)
    const filterColor = useMemo(() => {
        const h = (filterHue || 180) / 360;
        const s = 0.5;
        const l = 0.5;
        // HSL to RGB conversion
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
    }, [filterHue]);

    useFrame((_, delta) => {
        // Smoothly interpolate highlight factor
        const current = highlightRef.current;
        const target = targetHighlightRef.current;
        highlightRef.current = current + (target - current) * Math.min(delta * ATLAS3D_CONFIG.lineSpeed, 1);

        // Smoothly interpolate filter highlight and dimmed states
        filterHighlightRef.current += ((isFilterHighlight ? 1 : 0) - filterHighlightRef.current) * Math.min(delta * ATLAS3D_CONFIG.lineSpeed, 1);
        dimmedRef.current += ((isDimmed ? 1 : 0) - dimmedRef.current) * Math.min(delta * ATLAS3D_CONFIG.lineSpeed, 1);

        // Smoothly interpolate radius
        const radiusSpeed = targetRadius > currentRadiusRef.current ? ATLAS3D_CONFIG.attackSpeed : ATLAS3D_CONFIG.releaseSpeed;
        currentRadiusRef.current += (targetRadius - currentRadiusRef.current) * Math.min(delta * radiusSpeed, 1);

        // Update tube geometry with new radius
        if (meshRef.current) {
            const newGeom = new THREE.TubeGeometry(curve, 16, currentRadiusRef.current, 8, false);

            // Apply vertex colors to the new geometry
            const posAttr = newGeom.getAttribute('position');
            const colors = [];
            const h = highlightRef.current;
            const end = highlightEndRef.current;
            const falloff = ATLAS3D_CONFIG.lineGradientFalloff;

            const baseOp = ATLAS3D_CONFIG.lineBaseOpacity;
            const highOp = ATLAS3D_CONFIG.lineHighlightOpacity;

            for (let i = 0; i < posAttr.count; i++) {
                // Get position along the tube (0-1)
                const pos = new THREE.Vector3().fromBufferAttribute(posAttr, i);
                const start = new THREE.Vector3(...points[0]);
                const lineEnd = new THREE.Vector3(...points[1]);
                const lineDir = lineEnd.clone().sub(start);
                const lineLen = lineDir.length();
                lineDir.normalize();

                // Project point onto line to get t value
                const toPoint = pos.clone().sub(start);
                const t = Math.max(0, Math.min(1, toPoint.dot(lineDir) / lineLen));

                // Distance from the bright (highlighted) end
                let distFromBright;
                if (end === 0.5) {
                    distFromBright = Math.abs(t - 0.5) * 2; // Middle is bright, ends are dark
                } else if (end === 0) {
                    distFromBright = t; // Start is bright
                } else {
                    distFromBright = 1 - t; // End is bright (distFromBright 0 at end)
                }

                // Strong power falloff
                const whiteFade = Math.pow(1 - distFromBright, falloff);
                const tealFade = Math.pow(1 - distFromBright, falloff * 0.4);

                const highlightR = brightR * whiteFade + tealR * (1 - whiteFade) * tealFade + darkR * (1 - tealFade);
                const highlightG = brightG * whiteFade + tealG * (1 - whiteFade) * tealFade + darkG * (1 - tealFade);
                const highlightB = brightB * whiteFade + tealB * (1 - whiteFade) * tealFade + darkB * (1 - tealFade);

                // Filter highlight color (uniform glow along entire line)
                const fh = filterHighlightRef.current;
                const [fR, fG, fB] = filterColor;

                // Dimming factor
                const dim = dimmedRef.current;
                const dimFactor = 1 - dim * ATLAS3D_CONFIG.lineDimmingFactor;

                // Alpha gradient logic:
                // When highlighted (h=1), alpha fades from highOp at bright end to baseOp at dark end
                // We use tealFade as the gradient shape for alpha as well
                const gradientAlpha = baseOp + (highOp - baseOp) * tealFade;
                let finalAlpha = baseOp + (gradientAlpha - baseOp) * h;

                // Filter highlight boosts alpha uniformly
                finalAlpha = finalAlpha + (0.6 - finalAlpha) * fh;
                // Dimming reduces alpha
                finalAlpha *= dimFactor;

                // Blend between base/highlight color and filter color
                let finalR = baseR + (highlightR - baseR) * h;
                let finalG = baseG + (highlightG - baseG) * h;
                let finalB = baseB + (highlightB - baseB) * h;

                // Apply filter highlight color
                finalR = finalR + (fR - finalR) * fh * 0.7;
                finalG = finalG + (fG - finalG) * fh * 0.7;
                finalB = finalB + (fB - finalB) * fh * 0.7;

                colors.push(finalR, finalG, finalB, finalAlpha);
            }

            newGeom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));

            // Dispose old geometry and apply new
            if (meshRef.current.geometry) {
                meshRef.current.geometry.dispose();
            }
            meshRef.current.geometry = newGeom;
        }

        // No need to update material opacity uniform anymore, as it's baked into vertex alpha
    });

    // Initial geometry
    const geometry = useMemo(() => {
        const geom = new THREE.TubeGeometry(curve, 16, ATLAS3D_CONFIG.lineBaseRadius, 8, false);
        const posAttr = geom.getAttribute('position');
        const colors = [];
        const baseOp = ATLAS3D_CONFIG.lineBaseOpacity;
        for (let i = 0; i < posAttr.count; i++) {
            colors.push(baseR, baseG, baseB, baseOp);
        }
        geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
        return geom;
    }, [curve, baseR, baseG, baseB]);

    return (
        <>
            {/* Bloom sprite for soft glow */}
            <LineBloomSprite points={points} isHighlighted={isHighlighted} highlightedEnd={highlightedEnd} />
            {/* Actual tube mesh */}
            <mesh ref={meshRef} geometry={geometry} material={shaderMaterial} />
        </>
    );
}

// Hit area sphere for pointer events
function HitArea({ position, scale, onPointerOver, onPointerOut, onClick }) {
    const { camera } = useThree();
    const meshRef = useRef();

    const handlePointerOver = (e) => {
        e.stopPropagation();
        if (!ATLAS3D_CONFIG.enableBackfaceCulling) {
            onPointerOver && onPointerOver(e);
            return;
        }

        // Ensure position is a Vector3
        const nodePos = new THREE.Vector3(
            Array.isArray(position) ? position[0] : position.x,
            Array.isArray(position) ? position[1] : position.y,
            Array.isArray(position) ? (position[2] || 0) : (position.z || 0)
        );

        // Nodes near the center should always be hoverable (embedded nodes)
        const distFromCenter = nodePos.length();
        if (distFromCenter <= ATLAS3D_CONFIG.centerNodeRadius) {
            onPointerOver && onPointerOver(e);
            return;
        }

        // Vector from camera to node
        const cameraToNode = nodePos.clone().sub(camera.position).normalize();
        // Camera forward direction in world space
        const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

        const dot = cameraForward.dot(cameraToNode);
        if (dot > ATLAS3D_CONFIG.backfaceDotThreshold) {
            onPointerOver && onPointerOver(e);
        }
    };

    const handlePointerOutLocal = (e) => {
        e.stopPropagation();
        onPointerOut && onPointerOut(e);
    };

    return (
        <mesh ref={meshRef} position={position} scale={[scale, scale, scale]} onPointerOver={handlePointerOver} onPointerOut={handlePointerOutLocal} onClick={onClick} renderOrder={999}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
        </mesh>
    );
}

// Soft glow sprite to simulate bloom effect (additive blending, transparency-safe)
function BloomSprite({ position, color, intensity, scale, ignoreFog }) {
    const meshRef = useRef();
    const materialRef = useRef();
    const currentIntensityRef = useRef(0);
    const targetIntensityRef = useRef(intensity);

    targetIntensityRef.current = intensity;

    useFrame(({ camera }, delta) => {
        if (meshRef.current) {
            meshRef.current.quaternion.copy(camera.quaternion);
        }
        if (materialRef.current) {
            const speed = intensity > currentIntensityRef.current ? ATLAS3D_CONFIG.attackSpeed : ATLAS3D_CONFIG.releaseSpeed;
            currentIntensityRef.current += (targetIntensityRef.current - currentIntensityRef.current) * Math.min(delta * speed, 1);
            materialRef.current.opacity = currentIntensityRef.current;
        }
    });

    // Create a radial gradient texture for soft glow
    const glowTexture = useMemo(() => {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }, []);

    const glowColor = useMemo(() => new THREE.Color(color), [color]);

    return (
        <mesh ref={meshRef} position={position} scale={[scale * 3, scale * 3, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                ref={materialRef}
                map={glowTexture}
                color={glowColor}
                transparent
                opacity={0}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                fog={!ignoreFog}
            />
        </mesh>
    );
}

// Gradient glow ring that fades from bright near star to transparent further out
function GlowRing({ position, color, intensity, scale, rotation, ignoreFog }) {
    const meshRef = useRef();
    const materialRef = useRef();
    const targetIntensityRef = useRef(intensity);
    const currentIntensityRef = useRef(0);

    targetIntensityRef.current = intensity;

    useFrame(({ camera }, delta) => {
        if (meshRef.current) {
            meshRef.current.quaternion.copy(camera.quaternion);
            meshRef.current.rotation.z = rotation;
        }
        // Smooth temporal ease for intensity using centralized glowSpeed
        if (materialRef.current) {
            const target = targetIntensityRef.current;
            const current = currentIntensityRef.current;
            const speed = ATLAS3D_CONFIG.glowSpeed;
            currentIntensityRef.current = current + (target - current) * Math.min(delta * speed, 1);
            materialRef.current.opacity = currentIntensityRef.current * ATLAS3D_CONFIG.glowOpacityMultiplier;
        }
    });

    // Create ring geometry with radial gradient via vertex colors
    const geometry = useMemo(() => {
        const innerRadius = ATLAS3D_CONFIG.glowInnerRadius;
        const outerRadius = ATLAS3D_CONFIG.glowOuterRadius;
        const segments = 32;
        const rings = 8;
        const positions = [];
        const colors = [];
        const indices = [];

        const glowColor = new THREE.Color(color);

        for (let r = 0; r <= rings; r++) {
            const t = r / rings;
            const radius = innerRadius + (outerRadius - innerRadius) * t;
            // Gradient: bright at inner (t=0), fading to transparent at outer (t=1)
            const alpha = Math.pow(1 - t, 2); // Quadratic falloff

            for (let s = 0; s <= segments; s++) {
                const theta = (s / segments) * Math.PI * 2;
                positions.push(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
                colors.push(glowColor.r * alpha, glowColor.g * alpha, glowColor.b * alpha);
            }
        }

        for (let r = 0; r < rings; r++) {
            for (let s = 0; s < segments; s++) {
                const a = r * (segments + 1) + s;
                const b = a + 1;
                const c = a + segments + 1;
                const d = c + 1;
                indices.push(a, c, b, b, c, d);
            }
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geom.setIndex(indices);
        return geom;
    }, [color]);

    return (
        <mesh ref={meshRef} position={position} geometry={geometry} scale={[scale, scale, scale]}>
            <meshBasicMaterial
                ref={materialRef}
                vertexColors
                transparent
                opacity={0}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                fog={!ignoreFog}
            />
        </mesh>
    );
}

// Cluster cloud of soft glow particles for category clusters
function ClusterCloud({ positions, hue }) {
    const pointsRef = useRef();
    const materialRef = useRef();
    const currentOpacityRef = useRef(0);
    const targetOpacity = ATLAS3D_CONFIG.clusterGlowOpacity;

    const sat = ATLAS3D_CONFIG.clusterGlowSaturation / 100;
    const light = ATLAS3D_CONFIG.clusterGlowLightness / 100;
    const glowColor = useMemo(() => new THREE.Color().setHSL(hue / 360, sat, light), [hue, sat, light]);

    // Create a fuzzy particle texture with dithering to reduce banding
    const texture = useMemo(() => {
        const size = 256; // Higher resolution for smoother gradients
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const center = size / 2;
        const radius = size / 2;

        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;
        const fade = ATLAS3D_CONFIG.clusterGlowEdgeFade;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const dx = x - center;
                const dy = y - center;
                const dist = Math.sqrt(dx * dx + dy * dy) / radius;

                // Smooth alpha with gaussian-like falloff
                let alpha = 0;
                if (dist < 1.0) {
                    // Gaussian falloff for smoother edges
                    alpha = Math.exp(-dist * dist * fade * 2);
                }

                // Add dithering to reduce banding (blue noise approximation)
                const dither = (Math.random() - 0.5) * (2 / 255);
                alpha = Math.max(0, Math.min(1, alpha + dither));

                const index = (y * size + x) * 4;
                data[index] = 255;
                data[index + 1] = 255;
                data[index + 2] = 255;
                data[index + 3] = Math.floor(alpha * 255);
            }
        }
        ctx.putImageData(imageData, 0, 0);

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }, []);

    // Create geometry from positions with interpolation for blob effect
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const allPoints = [];

        // Add original positions
        positions.forEach(p => allPoints.push(p));

        // Add interpolated points between nearby nodes to form continuous blob
        const steps = ATLAS3D_CONFIG.clusterInterpolationSteps;
        const threshold = ATLAS3D_CONFIG.clusterInterpolationThreshold;

        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const p1 = positions[i];
                const p2 = positions[j];
                const dx = p2[0] - p1[0];
                const dy = p2[1] - p1[1];
                const dz = p2[2] - p1[2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // Only interpolate between nodes that are close enough
                if (dist < threshold) {
                    for (let s = 1; s <= steps; s++) {
                        const t = s / (steps + 1);
                        allPoints.push([
                            p1[0] + dx * t,
                            p1[1] + dy * t,
                            p1[2] + dz * t
                        ]);
                    }
                }
            }
        }

        const float32Array = new Float32Array(allPoints.length * 3);
        allPoints.forEach((p, i) => {
            float32Array[i * 3] = p[0];
            float32Array[i * 3 + 1] = p[1];
            float32Array[i * 3 + 2] = p[2];
        });
        geo.setAttribute('position', new THREE.BufferAttribute(float32Array, 3));
        return geo;
    }, [positions]);

    useFrame((_, delta) => {
        // Smooth fade in
        const speed = ATLAS3D_CONFIG.glowSpeed;
        currentOpacityRef.current += (targetOpacity - currentOpacityRef.current) * Math.min(delta * speed, 1);
        if (materialRef.current) {
            materialRef.current.opacity = currentOpacityRef.current;
        }
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial
                ref={materialRef}
                map={texture}
                color={glowColor}
                transparent
                size={ATLAS3D_CONFIG.clusterPuffRadius * 2} // Size is diameter
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.NormalBlending}
                opacity={0}
                fog={false} // Cluster cloud always visible (filtered category)
            />
        </points>
    );
}

// Main 3D Atlas Map component
const AtlasMap3D = forwardRef(({ songs = [], onSelectSong, selection, category, onFilter, onZoom, onRotation }, ref) => {
    const [hovered, setHovered] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const mapControllerRef = useRef();

    useImperativeHandle(ref, () => ({
        zoomIn: () => mapControllerRef.current?.zoomIn(),
        zoomOut: () => mapControllerRef.current?.zoomOut(),
        reset: () => mapControllerRef.current?.reset()
    }));

    // Normalize coordinates to centered [-30,30] cube
    const { positions, ids } = useMemo(() => {
        if (!songs.length) return { positions: [], ids: [] };
        const xs = songs.map(s => Number(s.x || 0));
        const ys = songs.map(s => Number(s.y || 0));
        const zs = songs.map(s => Number(s.z || 50));
        const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
        const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
        const [minZ, maxZ] = [Math.min(...zs), Math.max(...zs)];
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;
        const scale = 60 / Math.max(maxX - minX || 1, maxY - minY || 1, maxZ - minZ || 1);
        return {
            positions: songs.map(s => [
                (Number(s.x || 0) - centerX) * scale,
                (Number(s.y || 0) - centerY) * scale,
                (Number(s.z || 50) - centerZ) * scale
            ]),
            ids: songs.map(s => s.id)
        };
    }, [songs]);

    // Compute 3 nearest-neighbor connections per node
    const connections = useMemo(() => {
        const edges = [];
        if (!positions.length) return edges;
        for (let i = 0; i < positions.length; i++) {
            const dists = [];
            for (let j = 0; j < positions.length; j++) {
                if (i === j) continue;
                const dx = positions[i][0] - positions[j][0];
                const dy = positions[i][1] - positions[j][1];
                const dz = positions[i][2] - positions[j][2];
                dists.push({ j, dist: Math.sqrt(dx * dx + dy * dy + dz * dz) });
            }
            dists.sort((a, b) => a.dist - b.dist);
            dists.slice(0, 3).forEach(d => edges.push({ from: i, to: d.j }));
        }
        return edges;
    }, [positions]);

    // Filter-specific connections: connect all nodes in the selected category
    const filterConnections = useMemo(() => {
        if (!selection || !category || !songs.length || !positions.length) return [];

        const matchingIndices = [];
        songs.forEach((song, i) => {
            if (song[category] === selection) {
                matchingIndices.push(i);
            }
        });

        if (matchingIndices.length < 2) return [];

        const edges = [];
        // Create connections between all matching songs (fully connected subgraph)
        for (let i = 0; i < matchingIndices.length; i++) {
            for (let j = i + 1; j < matchingIndices.length; j++) {
                edges.push({ from: matchingIndices[i], to: matchingIndices[j] });
            }
        }
        return edges;
    }, [selection, category, songs, positions]);

    // Compute cluster data for category glow (positions, hue)
    const clusterData = useMemo(() => {
        if (!selection || !category || !songs.length || !positions.length) return null;

        // Find all songs matching the selection
        const matchingIndices = [];
        songs.forEach((song, i) => {
            if (song[category] === selection) {
                matchingIndices.push(i);
            }
        });

        if (matchingIndices.length === 0) return null;

        const matchingPositions = matchingIndices.map(i => positions[i]);

        // Compute centroid for hue calculation
        let sumX = 0, sumY = 0, sumZ = 0;
        matchingPositions.forEach(p => {
            sumX += p[0];
            sumY += p[1];
            sumZ += p[2];
        });
        const count = matchingPositions.length;
        const center = [sumX / count, sumY / count, sumZ / count];

        // Hue based on position (same logic as 2D: shifts based on center position)
        const hue = ATLAS3D_CONFIG.clusterGlowBaseHue + Math.floor((center[0] * 2 + center[1]) % 100);

        return { positions: matchingPositions, hue };
    }, [selection, category, songs, positions]);

    return (
        <div className="h-full w-full">
            <Canvas
                camera={{ position: ATLAS3D_CONFIG.cameraPosition, fov: ATLAS3D_CONFIG.cameraFov }}
                gl={{
                    antialias: ATLAS3D_CONFIG.antialias,
                    powerPreference: ATLAS3D_CONFIG.powerPreference,
                    alpha: true,
                    stencil: ATLAS3D_CONFIG.stencilBuffer,
                    depth: ATLAS3D_CONFIG.depthBuffer
                }}
                dpr={ATLAS3D_CONFIG.devicePixelRatio}
                performance={{ min: ATLAS3D_CONFIG.performanceMin }}
                onPointerMissed={() => setSelectedId(null)}
                onCreated={({ gl, scene }) => {
                    gl.setClearColor(0x000000, 0);
                    scene.background = null;
                }}
                style={{ background: 'transparent' }}
            >
                {/* Distance fog for depth perception */}
                {ATLAS3D_CONFIG.fogEnabled && (
                    <fog attach="fog" args={[ATLAS3D_CONFIG.fogColor, ATLAS3D_CONFIG.fogNear, ATLAS3D_CONFIG.fogFar]} />
                )}

                {/* Category cluster glow - regional coloration around filtered stars */}
                {clusterData && (
                    <ClusterCloud
                        positions={clusterData.positions}
                        hue={clusterData.hue}
                    />
                )}

                <ambientLight intensity={ATLAS3D_CONFIG.ambientIntensity} />
                <directionalLight position={ATLAS3D_CONFIG.directionalPosition} intensity={ATLAS3D_CONFIG.directionalIntensity} />
                <RotationTracker onRotation={onRotation} />
                <MapController ref={mapControllerRef} onZoom={onZoom} />

                {/* Connection lines */}
                {connections.map((edge, idx) => {
                    const idA = ids[edge.from];
                    const idB = ids[edge.to];
                    const songA = songs[edge.from] || {};
                    const songB = songs[edge.to] || {};
                    const aHighlighted = hovered === idA || selectedId === idA;
                    const bHighlighted = hovered === idB || selectedId === idB;
                    const isHighlighted = aHighlighted || bHighlighted;
                    // 0 = bright at start (A), 1 = bright at end (B), 0.5 = both or neither
                    const highlightedEnd = (aHighlighted && bHighlighted) ? 0.5 : (aHighlighted ? 0 : 1);

                    // Filter-related states
                    const aInFilter = selection && songA[category] === selection;
                    const bInFilter = selection && songB[category] === selection;
                    const isFilterHighlight = aInFilter && bInFilter;
                    const isDimmed = selection && !aInFilter && !bInFilter;

                    return (
                        <ConnectionLine
                            key={`edge-${idx}`}
                            points={[positions[edge.from], positions[edge.to]]}
                            isHighlighted={isHighlighted}
                            highlightedEnd={highlightedEnd}
                            isDimmed={isDimmed}
                            isFilterHighlight={isFilterHighlight}
                            filterHue={clusterData?.hue}
                        />
                    );
                })}

                {/* Filter-specific connections (fully connected subgraph of filtered nodes) */}
                {filterConnections.map((edge, idx) => (
                    <ConnectionLine
                        key={`filter-edge-${idx}`}
                        points={[positions[edge.from], positions[edge.to]]}
                        isHighlighted={false}
                        highlightedEnd={0.5}
                        isDimmed={false}
                        isFilterHighlight={true}
                        filterHue={clusterData?.hue}
                    />
                ))}

                {/* Star nodes */}
                {positions.map((pos, i) => {
                    const song = songs[i] || {};
                    const id = ids[i];
                    const isDimmed = selection && song[category] !== selection;
                    const isInFilteredCategory = selection && song[category] === selection;
                    const isHovered = hovered === id;
                    const isSelected = selectedId === id;

                    // Rotation based on song id (matches 2D)
                    const rotation = ((id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 13 * Math.PI / 180) % (2 * Math.PI);

                    // Scale: matches 2D nodeScale logic
                    let nodeScale = 1.0;
                    if (isDimmed) nodeScale = 0.7;
                    if (isInFilteredCategory) nodeScale = 1.1; // Slightly larger when in filtered category
                    if (isSelected) nodeScale = 1.3;
                    if (isHovered) nodeScale = 1.8 * ATLAS3D_CONFIG.starHoverScaleMultiplier;
                    const starScale = nodeScale * ATLAS3D_CONFIG.starScaleMultiplier;

                    // Emissive boost for filtered category stars
                    const emissiveBoost = isInFilteredCategory ? ATLAS3D_CONFIG.filteredStarEmissiveBoost : 1.0;

                    // Colors matching 2D exactly:
                    // - Published default: amber-500 (#f59e0b)
                    // - Published selected: amber-300 (#fcd34d)
                    // - Published hovered: amber-100 (#fef3c7)
                    // - Unpublished default: slate-cool-400 (#94a3b8)
                    // - Unpublished selected: slate-cool-300 (#cbd5e1)
                    // - Unpublished hovered: slate-200 (#e2e8f0)
                    let color, emissive, emissiveIntensity;

                    if (song.published) {
                        if (isHovered) {
                            color = 0xfef3c7; // amber-100
                            emissive = 0xffffff;
                            emissiveIntensity = 5.0 * emissiveBoost;
                        } else if (isSelected) {
                            color = 0xfcd34d; // amber-300
                            emissive = 0x5eead4; // teal-300
                            emissiveIntensity = 2.5 * emissiveBoost;
                        } else {
                            color = 0xf59e0b; // amber-500
                            emissive = 0xf59e0b; // amber-500 self-glow
                            emissiveIntensity = 0.5 * emissiveBoost;
                        }
                    } else {
                        if (isHovered) {
                            color = 0xe2e8f0; // slate-200
                            emissive = 0xffffff;
                            emissiveIntensity = 4.0 * emissiveBoost;
                        } else if (isSelected) {
                            color = 0xcbd5e1; // slate-300
                            emissive = 0x5eead4; // teal-300
                            emissiveIntensity = 2.0 * emissiveBoost;
                        } else {
                            color = 0x94a3b8; // slate-400
                            emissive = 0x94a3b8; // slate-400 self-glow
                            emissiveIntensity = 0.3 * emissiveBoost;
                        }
                    }

                    const opacity = isDimmed ? 0.25 : 1;
                    const hitScale = Math.max(nodeScale * ATLAS3D_CONFIG.hitSensitivityMultiplier, ATLAS3D_CONFIG.hitSensitivityMinimum);

                    const handlePointerOver = (e) => {
                        e.stopPropagation();
                        setHovered(id);
                        trackNodeInteraction('hover', song);
                    };
                    const handlePointerOut = (e) => { e.stopPropagation(); setHovered(null); };
                    const handleClick = (e) => {
                        e.stopPropagation();
                        if (selectedId === id) {
                            if (song.published && onSelectSong) {
                                trackTrackView(song.album, song.title, song.trackId);
                                onSelectSong(song.linkedAlbumId, song.trackId);
                            }
                        } else {
                            setSelectedId(id);
                            trackNodeInteraction('select', song);
                        }
                    };

                    return (
                        <group key={id}>
                            <HitArea
                                position={pos}
                                scale={hitScale}
                                onPointerOver={handlePointerOver}
                                onPointerOut={handlePointerOut}
                                onClick={handleClick}
                            />
                            {/* Soft bloom sprite (additive glow behind star) */}
                            <BloomSprite
                                position={pos}
                                color={song.published ? 0xf59e0b : 0x94a3b8}
                                intensity={isHovered ? 0.6 : isSelected ? 0.4 : (isDimmed ? 0.05 : 0.15)}
                                scale={starScale}
                                ignoreFog={isInFilteredCategory}
                            />
                            {/* Gradient glow ring (appears on hover/select) */}
                            <GlowRing
                                position={pos}
                                color={isHovered ? 0xffffff : 0x5eead4}
                                intensity={isHovered ? 0.5 : isSelected ? 0.3 : 0}
                                scale={starScale}
                                rotation={rotation}
                                ignoreFog={isInFilteredCategory}
                            />
                            <BillboardStar
                                position={pos}
                                color={color}
                                emissive={emissive}
                                emissiveIntensity={emissiveIntensity}
                                scale={starScale}
                                opacity={opacity}
                                rotation={rotation}
                                ignoreFog={isInFilteredCategory}
                            />

                            {/* Tooltip - matches 2D styling with offset, tripled size */}
                            {(isHovered || isSelected) && (
                                <CameraRelativeHtml starPosition={pos} isSelected={isSelected}>
                                    <div
                                        className="bg-emerald-950/80 backdrop-blur-sm border border-emerald-800/60 px-4 py-3 shadow-2xl"
                                        style={{ minWidth: '280px', maxWidth: '320px' }}
                                        onClick={() => setSelectedId(null)}
                                    >
                                        <div className="text-[10px] text-emerald-400 font-display uppercase tracking-widest mb-1 flex flex-col">
                                            <span className="font-medium normal-case">
                                                {song.featuring ? `${song.artist} (feat. ${song.featuring})` : (song.artist || 'Unknown Artist')}
                                            </span>
                                            {song.producer && (
                                                <span className="text-emerald-600 text-[9px] normal-case tracking-wide">Prod. {song.producer}</span>
                                            )}
                                        </div>
                                        <div className="text-sm font-body text-white mb-2 leading-tight font-semibold">
                                            {song.title || song.trackId || 'Unknown Track'}
                                        </div>
                                        <div className="pt-2 border-t border-emerald-800/50 flex flex-col gap-0.5 mb-2">
                                            <div className="text-[9px] text-emerald-500 uppercase tracking-wider font-display">
                                                {song.releaseType === 'Single' ? 'Single' : (song.album || 'Album')}
                                            </div>
                                            {song.genre && (
                                                <div className="text-[9px] text-slate-400 uppercase tracking-wider font-display">
                                                    {song.genre}
                                                </div>
                                            )}
                                        </div>

                                        {/* Filter buttons - only shows when selected and published */}
                                        {isSelected && song.published && (
                                            <div className="border-t border-slate-700 pt-3 space-y-2">
                                                <div className="text-[8px] text-slate-400 uppercase tracking-widest font-display mb-2">Filter by:</div>

                                                {/* Filter by Artist */}
                                                {song.artist && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onFilter && onFilter('artist', song.artist);
                                                            trackFilterSelect('artist', song.artist);
                                                            setSelectedId(null);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-700 text-[9px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all flex items-center justify-between"
                                                    >
                                                        <span>Artist: {song.featuring ? `${song.artist} (feat. ${song.featuring})` : song.artist}</span>
                                                    </button>
                                                )}

                                                {/* Filter by Album */}
                                                {song.album && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onFilter && onFilter('album', song.album);
                                                            trackFilterSelect('album', song.album);
                                                            setSelectedId(null);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-700 text-[9px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all flex items-center justify-between"
                                                    >
                                                        <span className="truncate">Album: {song.album}</span>
                                                    </button>
                                                )}

                                                {/* Filter by Genre */}
                                                {song.genre && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onFilter && onFilter('genre', song.genre);
                                                            trackFilterSelect('genre', song.genre);
                                                            setSelectedId(null);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-700 text-[9px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all flex items-center justify-between"
                                                    >
                                                        <span>Genre: {song.genre}</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Navigate button - only shows when selected and published */}
                                        {isSelected && song.published && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onSelectSong) {
                                                        trackTrackView(song.album, song.title, song.trackId);
                                                        onSelectSong(song.linkedAlbumId, song.trackId);
                                                    }
                                                }}
                                                className="mt-3 w-full px-4 py-2 bg-slate-900/80 border border-slate-700 text-[10px] font-display uppercase tracking-widest text-slate-200 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                View Track →
                                            </button>
                                        )}

                                        {/* Unpublished message */}
                                        {isSelected && !song.published && (
                                            <div className="border-t border-slate-700 pt-3">
                                                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-display text-center">
                                                    Article doesn't exist
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CameraRelativeHtml>
                            )}
                        </group>
                    );
                })}

                {/* Note: Bloom disabled for transparency. Glow simulated via high emissive + additive sprites */}
            </Canvas>
        </div>
    );
});

export default AtlasMap3D;
