// Centralized configuration for the 3D atlas visual/easing parameters
export const ATLAS3D_CONFIG = {
    // Easing speeds (higher -> faster). These are multipliers used in 'delta * speed'.
    attackSpeed: 14,        // how quickly highlights ramp up (general)
    releaseSpeed: 10,       // how quickly highlights fade out (general)
    lineSpeed: 10,          // line highlight lerp speed
    glowSpeed: 10,          // glow ring lerp speed

    // Star-specific easing (separate from general)
    starAttackSpeed: 8,     // how quickly star scale/emissive ramps up
    starReleaseSpeed: 6,    // how quickly star scale/emissive fades out

    // Glow ring sizing + opacity multiplier
    glowInnerRadius: 0.9,
    glowOuterRadius: 1.6,
    glowOpacityMultiplier: 0.15,

    // Star sizing multiplier (applied to computed nodeScale)
    starScaleMultiplier: 0.5,
    starHoverScaleMultiplier: 1.2,      // Additional scale boost on hover

    // Hit area sensitivity (multiplier for invisible hit sphere)
    hitSensitivityMultiplier: 2,        // Hit area = nodeScale * this value
    hitSensitivityMinimum: 2.5,         // Minimum hit area size
    // Backface culling for hover (prevents hovering nodes on the far side)
    enableBackfaceCulling: true,
    backfaceDotThreshold: -0.2,         // dot(cameraDir, camera->node) must be > this to allow hover
    centerNodeRadius: 20,               // nodes within this radius from origin are always hoverable

    // Label/Tooltip sizing / distance / offset
    labelDistanceFactor: 20,
    labelScale: 3,
    tooltipOffset: [3, 2, 0],               // [x, y, z] offset from star position

    // Line colors (RGB 0-1)
    lineBaseColor: [8 / 255, 51 / 255, 68 / 255],       // dark blue-green when not highlighted
    lineBrightColor: [1.0, 1.0, 1.0],                   // white at highlighted end
    lineTealColor: [20 / 255, 180 / 255, 180 / 255],     // bright green at far end
    lineDarkTealColor: [5 / 255, 60 / 255, 40 / 255],   // dark green for fading to nothing

    // Line opacity
    lineBaseOpacity: 0.5,       // opacity when not highlighted
    lineHighlightOpacity: 0.9,  // opacity when highlighted

    // Line thickness (uses TubeGeometry for actual thickness)
    lineBaseRadius: 0.05,       // base line thickness
    lineHighlightRadius: 0.1,  // line thickness when highlighted

    // Line gradient falloff (higher = sharper falloff from bright end)
    lineGradientFalloff: 6,     // Strong gradient
    lineDimmingFactor: 0.25,     // How much to dim non-filtered lines (0 = no dim, 1 = fully dim)

    // Line bloom sprite settings
    lineBloomEnabled: true,
    lineBloomIntensity: 0.5,    // Bloom sprite opacity when highlighted
    lineBloomWidth: 1.2,        // Width of bloom sprite

    // Canvas/WebGL rendering options
    antialias: true,
    powerPreference: 'high-performance',    // Request high-performance GPU
    alphaBuffer: true,                       // Enable alpha buffer for transparent background
    stencilBuffer: false,                    // Disable stencil buffer (not needed, saves memory)
    depthBuffer: true,                       // Keep depth buffer for proper 3D rendering
    devicePixelRatio: [1, 2],               // Clamp DPR between 1x-2x for performance/quality balance
    performanceMin: 0.5,                     // Adaptive performance scaling if FPS drops below 50%

    // Camera settings
    cameraPosition: [0, 0, 100],
    cameraFov: 50,

    // Orbit controls
    enablePan: true,
    enableZoom: true,
    enableRotate: true,
    dampingFactor: 0.1,

    // Lighting
    // Increased baseline brightness by 150% per request
    ambientIntensity: 1.5,          // was 0.8
    directionalIntensity: 1,     // was 0.5
    directionalPosition: [10, 10, 10],

    // Fog (Distance Fading) - aids depth perception
    fogEnabled: true,
    fogColor: '#000000',    // Black fog fades distant objects to darkness
    fogNear: 80,            // Start fading just past the front of the cluster
    fogFar: 170,            // Fully faded at this distance

    // Category cluster glow (regional coloration around filtered stars)
    clusterGlowBaseHue: 120,            // Base hue for cluster color (shifts based on position)
    clusterGlowSaturation: 30,          // Saturation percentage (lower = more muted/foggy)
    clusterGlowLightness: 10,           // Lightness percentage (lower = darker, more subtle)
    clusterGlowOpacity: 0.02,           // Opacity of individual puff (very low for fog effect)
    clusterPuffRadius: 10,               // Radius of individual puffs (larger = softer spread)
    clusterGlowEdgeFade: 1,           // Softness of the puff (lower = more even fog distribution)
    clusterInterpolationSteps: 13,       // Number of intermediate particles between nodes (higher = smoother blob)
    clusterInterpolationThreshold: 120,  // Max distance to interpolate between nodes (don't connect far nodes)

    // Filtered star boost (when selection is active and star matches category)
    filteredStarEmissiveBoost: 1.5,     // Multiplier for emissive intensity when in filtered category

    // Bloom post-processing (requires @react-three/postprocessing)
    enableBloom: true,                       // Enable/disable bloom effect
    bloomIntensity: 0.6,                     // Strength of bloom effect (slightly increased to match brighter base)
    bloomLuminanceThreshold: 0.2,            // Only pixels brighter than this will bloom
    bloomLuminanceSmoothing: 0.9,            // Smoothness of bloom transition
    bloomMipmapBlur: true                    // Better performance and quality for blur
};

// Small lerp helper (useful for JS-driven easing)
export const lerp = (a, b, t) => a + (b - a) * t;

export default ATLAS3D_CONFIG;
