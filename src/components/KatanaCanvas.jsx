import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import { Environment, Float, Preload } from '@react-three/drei';
import * as THREE from 'three';

function UnsheatheFog() {
  const { scrollYProgress } = useScroll();
  const groupRef = useRef();

  const smokeTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 1.2,
      y: (Math.random() - 0.5) * 1.5,
      z: (Math.random() - 0.5) * 1.2,
      scale: 0.5 + Math.random() * 1.5,
      speed: 0.1 + Math.random() * 0.3,
      hue: i % 2 === 0 ? '#2563eb' : '#9333ea' // Deeper, more saturated but darker colors
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const scroll = scrollYProgress.get();

    const fogIntensity = Math.min(scroll * 3 + 0.3, 1); 
    const targetScale = 0.5 + (fogIntensity * 0.6); // Reduced expansion size
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Fog remains consistently visible but extremely subtle
    const finalOpacity = Math.max(0.05, fogIntensity * 0.12);

    groupRef.current.children.forEach((mesh, index) => {
      const p = particles[index];
      mesh.rotation.z += p.speed * 0.02;
      mesh.quaternion.copy(state.camera.quaternion);
      mesh.material.opacity = finalOpacity;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {particles.map((p) => (
        <mesh key={p.id} position={[p.x, p.y, p.z]} scale={p.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={smokeTexture}
            color={p.hue}
            transparent
            depthWrite={false}
            blending={THREE.NormalBlending} // Prevent blowout
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function KatanaModel() {
  const { scrollYProgress } = useScroll();
  const swordRef = useRef();
  const groupRef = useRef();

  // Handle mobile screens scaling so it fits well
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = isMobile ? 0.7 : 1;

  useFrame(() => {
    if (!swordRef.current || !groupRef.current) return;
    
    // scrollYProgress is 0 at top, 1 at bottom
    const scroll = scrollYProgress.get();

    // The sword un-sheathes by moving along its local Y axis.
    // At scroll=1, it should be fully drawn (distance ~3.8 units).
    // We add a power curve so it starts slow and unsheathes faster, 
    // or just linear. Linear is smooth.
    const targetUnsheathe = scroll * -5.8;
    swordRef.current.position.y = THREE.MathUtils.lerp(swordRef.current.position.y, targetUnsheathe, 0.08);

    // Dynamic rotation based on scroll.
    // Spin around Y axis and tilt on Z axis.
    const targetRotZ = -(Math.PI / 4) + (scroll * Math.PI * 0.8);
    const targetRotY = scroll * -Math.PI * 1.5; 
    const targetRotX = scroll * Math.PI * 0.2;
    
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
  });

  return (
    <group ref={groupRef} rotation={[0, 0, -Math.PI / 4]} position={[0, -0.5, 0]} scale={[scale, scale, scale]}>
      <UnsheatheFog />
      
      {/* --- SAYA (Scabbard) --- */}
      <group position={[0, 2.35, 0]}>
        {/* Main sheath body */}
        <mesh>
          <boxGeometry args={[0.13, 4.7, 0.28]} />
          <meshStandardMaterial color="#050505" roughness={0.15} metalness={0.7} />
        </mesh>
        {/* Saya Accent Top (Kurigata/Koiguchi area approximation) */}
        <mesh position={[0, -2.25, 0]}>
          <boxGeometry args={[0.15, 0.2, 0.3]} />
          <meshStandardMaterial color="#eab308" roughness={0.2} metalness={1} /> {/* Gold */}
        </mesh>
        {/* Saya Accent Bottom (Kojiri) */}
        <mesh position={[0, 2.3, 0]}>
          <boxGeometry args={[0.14, 0.1, 0.29]} />
          <meshStandardMaterial color="#eab308" roughness={0.2} metalness={1} />
        </mesh>
        {/* Decorative wrapping / Sageo loop approximation */}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[0.15, 0.05, 0.3]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.8} /> {/* Blue accent */}
        </mesh>
      </group>

      {/* --- SWORD --- */}
      {/* Position 0 is where the blade meets the handle. */}
      <group ref={swordRef} position={[0, 0, 0]}>
        {/* Blade (Straight Ninja-To style or Tech-Katana) */}
        <mesh position={[0, 2.25, 0.02]}>
          {/* Blade is slightly shifted on Z to look like it has an edge */}
          <boxGeometry args={[0.04, 4.5, 0.2]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.05} metalness={1} />
        </mesh>
        
        {/* Habaki (Blade Collar) */}
        <mesh position={[0, 0.05, 0]}>
           <boxGeometry args={[0.07, 0.1, 0.24]} />
           <meshStandardMaterial color="#eab308" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Tsuba (Guard) */}
        <mesh position={[0, 0, 0]}>
          {/* Flattened wide box or cylinder. Box fits the tech theme well */}
          <boxGeometry args={[0.45, 0.05, 0.35]} />
          <meshStandardMaterial color="#171717" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          {/* Gold rim on guard */}
          <boxGeometry args={[0.47, 0.02, 0.37]} />
          <meshStandardMaterial color="#eab308" roughness={0.2} metalness={1} />
        </mesh>
        
        {/* Tsuka (Handle) */}
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.08, 0.8, 0.18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} /> {/* Slate dark blue */}
        </mesh>

        {/* Handle wrap details (Tsuka-ito) - Simple tech horizontal grooves */}
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[0, -0.15 - (i * 0.12), 0]}>
             <boxGeometry args={[0.09, 0.02, 0.19]} />
             <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
          </mesh>
        ))}
        
        {/* Kashira (Pommel) */}
        <mesh position={[0, -0.84, 0]}>
          <boxGeometry args={[0.09, 0.06, 0.19]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} metalness={1} />
        </mesh>
      </group>
    </group>
  );
}

import { Suspense } from 'react';

export default function KatanaCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          
          {/* Main rim light for metallic pop */}
          <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" castShadow />
          
          {/* Cool blue fill light to match theme */}
          <directionalLight position={[-5, -5, -2]} intensity={1.5} color="#3b82f6" />
          
          {/* Warm accent light */}
          <directionalLight position={[0, -5, 5]} intensity={1} color="#eab308" />
          
          <Environment preset="city" /> 
          
          {/* The Float component adds a subtle natural hover effect that persists regardless of scroll */}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <KatanaModel />
          </Float>
          
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
