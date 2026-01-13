'use client';

import { useMemo, useRef } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * WavingDots — slow, expanding contour waves
 * - Origin bottom-right
 * - Waves expand outward
 * - Dots grow as they move toward top-left
 * - Very smooth, minimal motion
 */

const GrowingContourMaterial = shaderMaterial(
  {
    uTime: 0,

    // Composition
    uOrigin: new THREE.Vector2(0.48, -0.48), // bottom-right
    uDirection: new THREE.Vector2(-1.0, 1.0), // toward top-left

    // Motion
    uSpeed: 0.018,     // VERY slow outward motion
    uLines: 28.0,      // number of contour bands
    uThickness: 0.24,  // thickness of each band
    uSoftness: 0.18,

    // Warp (kept subtle)
    uWarpAmp: 0.06,
    uWarpFreq: 1.6,

    // Dot sizing
    uBaseSize: 2.2,    // BIGGER base dots
    uGrowSize: 4.2,    // how much dots grow as they travel

    // Fade & vignette
    uFadeNear: 0.04,
    uFadeFar: 1.15,
    uVignette: 1.6,

    // Color
    uColor: new THREE.Color('#f2f2f2'),
  },

  /* ===================== VERTEX ===================== */
  /* glsl */ `
    uniform float uTime;

    uniform vec2 uOrigin;
    uniform vec2 uDirection;

    uniform float uSpeed;
    uniform float uLines;
    uniform float uThickness;
    uniform float uSoftness;

    uniform float uWarpAmp;
    uniform float uWarpFreq;

    uniform float uBaseSize;
    uniform float uGrowSize;

    uniform float uFadeNear;
    uniform float uFadeFar;
    uniform float uVignette;

    varying float vAlpha;
    varying float vSize;

    void main() {
      vec2 p = position.xy;

      // Distance & direction
      vec2 d = p - uOrigin;
      float r = length(d);

      // Directional progress (0 → bottom-right, 1 → top-left)
      vec2 dir = normalize(uDirection);
      float directionalProgress = dot(normalize(d), dir) * 0.5 + 0.5;
      directionalProgress = clamp(directionalProgress, 0.0, 1.0);

      // Gentle warp (fingerprint-like)
      float angle = atan(d.y, d.x);
      float warp =
        sin(angle * uWarpFreq + uTime * 0.12) * uWarpAmp +
        sin(angle * uWarpFreq * 2.1 - uTime * 0.08) * (uWarpAmp * 0.4);

      // Slow outward flow
      float flow = uTime * uSpeed;
      float coord = (r + warp) - flow;

      // Contour bands
      float bandCoord = fract(coord * uLines);
      float bandDist = abs(bandCoord - 0.5) * 2.0;
      float band = 1.0 - smoothstep(uThickness, uThickness + uSoftness, bandDist);

      // Radial fade
      float radial = 1.0 - smoothstep(uFadeNear, uFadeFar, r);

      // Screen vignette
      float vignette = 1.0 - smoothstep(0.25, 0.8, length(p));
      vignette = pow(vignette, uVignette);

      vAlpha = band * radial * vignette;

      // DOT GROWTH:
      // dots get bigger as they move toward top-left
      float grow = smoothstep(0.0, 1.0, directionalProgress);
      float size = uBaseSize + grow * uGrowSize;

      // Emphasize contour lines
      size *= (0.9 + band * 0.6);

      vSize = size;

      // Subtle depth wobble
      vec3 pos = vec3(p.x, p.y, band * 0.01);

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      float depth = max(1.0, -mv.z);
      float perspective = 1.0 / depth;

      gl_PointSize = clamp(vSize * (120.0 * perspective), 1.5, 9.0);
      gl_Position = projectionMatrix * mv;
    }
  `,

  /* ===================== FRAGMENT ===================== */
  /* glsl */ `
    uniform vec3 uColor;

    varying float vAlpha;
    varying float vSize;

    void main() {
      if (vAlpha < 0.01) discard;

      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);

      // Soft round dot
      float softness = 2.2;
      float core = exp(-pow(d * softness, 2.0));

      // Slight sharpening on larger dots
      core = pow(core, 0.9 + vSize * 0.03);

      float a = core * vAlpha;
      if (a < 0.015) discard;

      gl_FragColor = vec4(uColor, a);
    }
  `
);

extend({ GrowingContourMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      growingContourMaterial: any;
    }
  }
}

type Props = {
  density?: number;
  overscan?: number;
  speed?: number;
  noiseAmount?: number;
  focusDistance?: number;
  aperture?: number;
};

export default function WavingDots({
  density = 3,
  overscan = 1.2,
}: Props) {
  const matRef = useRef<any>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const n = Math.max(240, density);
    const total = n * n;
    const positions = new Float32Array(total * 3);

    let i = 0;
    for (let y = 0; y < n; y++) {
      const py = y / (n - 1) - 0.5;
      for (let x = 0; x < n; x++) {
        const px = x / (n - 1) - 0.5;
        positions[i++] = px;
        positions[i++] = py;
        positions[i++] = 0;
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [density]);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points
      geometry={geometry}
      scale={[viewport.width * overscan, viewport.height * overscan, 1]}
    >
      <growingContourMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
