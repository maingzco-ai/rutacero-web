'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/app/lib/design-system';

const ORB_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-viewPosition.xyz);
    vPosition = position;

    vec3 displaced = position + normal * sin(position.y * 4.0 + uTime * 0.8) * 0.02;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const ORB_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPosition;

  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  void main() {
    float fresnel = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), 2.4);

    float bands = sin(vPosition.y * 9.0 + uTime * 0.55) * 0.5 + 0.5;
    float sweep = sin((vPosition.x + vPosition.y) * 5.0 - uTime * 0.8) * 0.5 + 0.5;

    vec3 tint = mix(uColorA, uColorB, bands);
    tint = mix(tint, uColorC, sweep * 0.55);

    vec3 base = vec3(0.012, 0.020, 0.045);
    vec3 color = base + tint * fresnel * 1.65;
    color += uColorC * fresnel * 0.18;

    float alpha = 0.32 + fresnel * 0.95;
    gl_FragColor = vec4(color, alpha);
  }
`;

function OrbCore() {
  const mesh = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#4f6df5') },
      uColorB: { value: new THREE.Color('#5ce9dc') },
      uColorC: { value: new THREE.Color('#a78bfa') },
    }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.14;
      mesh.current.rotation.x = Math.sin(t * 0.22) * 0.16;
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.1;
      inner.current.rotation.z = t * 0.05;
    }
    if (ringA.current) ringA.current.rotation.z = t * 0.12;
    if (ringB.current) ringB.current.rotation.z = -t * 0.08;
  });

  return (
    <group scale={1.12}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.5, 24]} />
        <shaderMaterial
          vertexShader={ORB_VERTEX}
          fragmentShader={ORB_FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh ref={inner} scale={0.93}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#9fb6ff" wireframe transparent opacity={0.11} />
      </mesh>

      <mesh ref={ringA} rotation={[Math.PI / 2.6, 0.24, 0]}>
        <torusGeometry args={[2.08, 0.005, 8, 220]} />
        <meshBasicMaterial color="#7c9cff" transparent opacity={0.55} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.8, -0.5, 0.4]}>
        <torusGeometry args={[2.42, 0.003, 8, 220]} />
        <meshBasicMaterial color="#5ce9dc" transparent opacity={0.32} blending={THREE.AdditiveBlending} />
      </mesh>

      <OrbitalDust />
    </group>
  );
}

function OrbitalDust() {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const total = 340;
    const array = new Float32Array(total * 3);
    for (let i = 0; i < total; i += 1) {
      const radius = 1.85 + Math.random() * 0.85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.cos(phi) * 0.52;
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return array;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.06;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#b9c8ff"
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += (pointer.current.x * 0.28 - group.current.rotation.y) * 0.03;
    group.current.rotation.x += (pointer.current.y * 0.18 - group.current.rotation.x) * 0.03;
  });

  return (
    <group ref={group}>
      <Float speed={1.15} rotationIntensity={0.22} floatIntensity={0.55}>
        <OrbCore />
      </Float>
      <PointerBridge target={pointer} />
    </group>
  );
}

function PointerBridge({ target }: { target: React.RefObject<{ x: number; y: number }> }) {
  useFrame((state) => {
    const px = (state.pointer.x || 0) * 0.5;
    const py = (state.pointer.y || 0) * 0.5;
    if (target.current) {
      target.current.x = px;
      target.current.y = py;
    }
  });
  return null;
}

export function SpatialOrb({ className, size = 520 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn('pointer-events-none relative select-none', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(79,109,245,0.22),transparent_66%)] blur-2xl" />
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        dpr={[1, 1.55]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Rig />
      </Canvas>
      <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
      <div className="absolute inset-10 rounded-full border border-white/[0.05]" />
      <div
        className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ boxShadow: 'inset 0 0 120px rgba(92,233,220,0.06), 0 0 80px rgba(79,109,245,0.12)' }}
      />
    </div>
  );
}

export default SpatialOrb;
