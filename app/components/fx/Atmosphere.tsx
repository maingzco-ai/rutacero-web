'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ----------------------------------------------------------------------------
   Shaders
   ---------------------------------------------------------------------------- */

const AURORA_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AURORA_FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform vec2 uResolution;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p);
      p = rot * p * 2.02 + 11.7;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    float t = uTime * 0.035;

    vec2 mouse = uMouse * 0.12;
    vec2 q = p - mouse;

    float warp = fbm(q * 1.35 + vec2(t * 1.6, -t * 1.1));
    vec2 flow = q + warp * 0.42 + vec2(0.0, uScroll * 0.55);

    float f1 = fbm(flow * 1.9 + vec2(t, t * 0.6));
    float f2 = fbm(flow * 3.4 - vec2(t * 1.4, t * 0.4));
    float ribbon = fbm(flow * 1.1 + vec2(f1 * 1.4, -t));

    vec3 deep = vec3(0.012, 0.018, 0.040);
    vec3 indigo = vec3(0.055, 0.095, 0.270);
    vec3 azure = vec3(0.160, 0.400, 0.780);
    vec3 cyan = vec3(0.190, 0.820, 0.760);
    vec3 violet = vec3(0.440, 0.270, 0.880);

    vec3 col = mix(deep, indigo, smoothstep(0.18, 0.82, ribbon));
    col = mix(col, azure, smoothstep(0.48, 0.92, f1) * 0.40);
    col = mix(col, cyan, smoothstep(0.62, 0.99, f2) * 0.16);
    col += violet * pow(max(f1 - 0.48, 0.0), 2.0) * 0.55;

    // Volumetric beam from the upper-left
    float beam = exp(-pow((uv.x * 0.7 + (1.0 - uv.y) * 0.9 - 0.72) * 2.4, 2.0));
    col += vec3(0.22, 0.34, 0.75) * beam * 0.16;

    // Pointer lens
    float d = length((uv - 0.5) - uMouse * 0.5);
    col += vec3(0.30, 0.48, 0.95) * exp(-d * 3.1) * 0.10;

    // Layer of distant stars
    vec2 grid = uv * vec2(uResolution.x / 3.2, uResolution.y / 3.2);
    float starSeed = hash21(floor(grid));
    float star = smoothstep(0.9975, 1.0, starSeed);
    float twinkle = 0.55 + 0.45 * sin(uTime * 2.2 + starSeed * 40.0);
    col += vec3(0.75, 0.84, 1.0) * star * twinkle * 0.55;

    // Scroll deepens the field
    col *= 0.82 + uScroll * 0.30;

    // Corner darkening
    float vig = smoothstep(1.35, 0.25, length(p * vec2(0.78, 1.0)));
    col *= 0.62 + vig * 0.55;

    // Fine grain to break banding
    col += (hash21(uv * uResolution + uTime) - 0.5) * 0.008;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const PARTICLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  uniform float uScroll;

  attribute float aScale;
  attribute float aSeed;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 p = position;
    float t = uTime * 0.10 + aSeed * 6.28318;

    p.x += sin(t + p.z * 0.42) * 0.55;
    p.y += cos(t * 0.82 + p.x * 0.30) * 0.48 + uScroll * 1.2;
    p.z += sin(t * 0.58) * 0.35;
    p.xy += uMouse * (0.35 + aSeed * 0.65);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    gl_PointSize = (11.0 * aScale) * uPixelRatio * (1.0 / max(-mv.z, 0.4));

    vAlpha = smoothstep(0.0, 1.0, aScale) * (0.35 + 0.4 * sin(t * 1.7));
    vColor = mix(vec3(0.46, 0.60, 1.0), vec3(0.38, 0.96, 0.92), aSeed);
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  precision highp float;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 2.4);
    gl_FragColor = vec4(vColor, glow * vAlpha * 0.8);
  }
`;

const GLOW_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uTime;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float halo = pow(smoothstep(1.0, 0.0, d), 2.6);
    float core = pow(smoothstep(0.42, 0.0, d), 3.0);
    float breathe = 0.82 + 0.18 * sin(uTime * 0.5);
    gl_FragColor = vec4(uColor, (halo * 0.22 + core * 0.30) * uIntensity * breathe);
  }
`;

const GLOW_VERTEX = AURORA_VERTEX;

/* ----------------------------------------------------------------------------
   Scene pieces
   ---------------------------------------------------------------------------- */

function usePointerTarget() {
  const target = useRef(new THREE.Vector2(0, 0));
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      target.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return target;
}

function AuroraField() {
  const viewport = useThree((state) => state.viewport);
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = usePointerTarget();
  const scroll = useRef(0);
  const eased = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1440, 900) },
    }),
    [],
  );

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onResize = () => {
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    onScroll();
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [uniforms]);

  useEffect(() => {
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }, [uniforms]);

  useFrame((state) => {
    if (!material.current) return;
    const time = state.clock.elapsedTime;
    eased.current += (scroll.current - eased.current) * 0.045;
    uniforms.uTime.value = time;
    uniforms.uMouse.value.x += (pointer.current.x * 0.5 - uniforms.uMouse.value.x) * 0.03;
    uniforms.uMouse.value.y += (pointer.current.y * 0.5 - uniforms.uMouse.value.y) * 0.03;
    uniforms.uScroll.value = eased.current;
  });

  return (
    <mesh position={[0, 0, -5]} scale={[viewport.width * 2.1, viewport.height * 2.1, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={AURORA_VERTEX}
        fragmentShader={AURORA_FRAGMENT}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

function ParticleField({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const pointer = usePointerTarget();
  const material = useRef<THREE.ShaderMaterial>(null);

  const { positions, scales, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
      scales[i] = 0.25 + Math.random() * 0.9;
      seeds[i] = Math.random();
    }
    return { positions, scales, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: 1 },
      uScroll: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 1.6);
  }, [uniforms]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.x += (pointer.current.x * 0.35 - uniforms.uMouse.value.x) * 0.024;
    uniforms.uMouse.value.y += (pointer.current.y * 0.35 - uniforms.uMouse.value.y) * 0.024;
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.012;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.05;
    }
  });

  return (
    <points ref={points} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function VolumetricGlow({
  color,
  position,
  size,
  intensity,
  speed = 1,
}: {
  color: string;
  position: [number, number, number];
  size: number;
  intensity: number;
  speed?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
      uTime: { value: 0 },
    }),
    [color, intensity],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    uniforms.uTime.value = t;
    if (mesh.current) {
      mesh.current.position.x = position[0] + Math.sin(t * 0.16) * 0.7;
      mesh.current.position.y = position[1] + Math.cos(t * 0.13) * 0.5;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={[size, size, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={GLOW_VERTEX}
        fragmentShader={GLOW_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Scene({ particleCount, enablePost }: { particleCount: number; enablePost: boolean }) {
  return (
    <>
      <AuroraField />
      <ParticleField count={particleCount} />
      <VolumetricGlow color="#3f6bff" position={[-4.2, 2.3, -2]} size={8} intensity={0.9} speed={0.7} />
      <VolumetricGlow color="#2fe3d4" position={[4.6, -2.2, -1.5]} size={7} intensity={0.7} speed={0.55} />
      <VolumetricGlow color="#8b5cf6" position={[3.2, 2.8, -3]} size={6} intensity={0.6} speed={0.4} />
      {enablePost && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.72} luminanceThreshold={0.38} luminanceSmoothing={0.35} mipmapBlur />
          <Vignette eskil={false} offset={0.28} darkness={0.82} />
        </EffectComposer>
      )}
    </>
  );
}

/* ----------------------------------------------------------------------------
   Public component
   ---------------------------------------------------------------------------- */

export function Atmosphere() {
  const [settings, setSettings] = useState<{ count: number; post: boolean; dpr: number } | null>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const mobile = width < 768;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSettings({
      count: reduced ? 180 : mobile ? 380 : 1100,
      post: !mobile && !reduced,
      dpr: Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6),
    });
  }, []);

  if (!settings) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 60 }}
      dpr={[1, settings.dpr]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Scene particleCount={settings.count} enablePost={settings.post} />
      </Suspense>
    </Canvas>
  );
}

export default Atmosphere;
