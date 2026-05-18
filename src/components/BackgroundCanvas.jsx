import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const LERP_FACTOR = 0.05;
const GRAVITY_RADIUS = 2.0;
const IDLE_TIME_THRESHOLD = 500; // ms

// Global mouse tracker to bypass pointer-events-none on canvas wrapper
const globalMouse = {
  x: 0, y: 0,
  clickTime: 0, clickX: 0, clickY: 0,
  lastMove: Date.now()
};

function initGlobalMouse() {
  if (typeof window === 'undefined') return;
  
  const handleMouseMove = (e) => {
    globalMouse.lastMove = Date.now();
    globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    globalMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  const handleMouseUp = (e) => {
    globalMouse.clickTime = performance.now();
    globalMouse.clickX = (e.clientX / window.innerWidth) * 2 - 1;
    globalMouse.clickY = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
}

let initialized = false;

function CursorGlow() {
  const glowRef = useRef();
  
  useFrame((state) => {
    if (!glowRef.current) return;
    const { camera } = state;
    
    const vector = new THREE.Vector3(globalMouse.x, globalMouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));
    
    // Smooth trailing effect
    glowRef.current.position.lerp(mouseWorldPos, 0.08);

    // Fade out a bit & pulse if rippling
    const timeSinceClick = performance.now() - globalMouse.clickTime;
    if (timeSinceClick < 1000) {
      const rTime = timeSinceClick / 1000;
      const pulse = Math.sin(rTime * Math.PI) * 0.5;
      const mat = glowRef.current.material;
      mat.opacity = 0.15 + pulse;
      glowRef.current.scale.setScalar(1 + pulse * 2);
    } else {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(glowRef.current.material.opacity, 0.15, 0.1);
      glowRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <mesh ref={glowRef}>
      <circleGeometry args={[0.2, 32]} />
      <meshBasicMaterial 
        color="#3b82f6" 
        transparent 
        opacity={0.3} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </mesh>
  );
}

function StarLayer({ count, color, size, depth, speedMultiplier }) {
  const pointsRef = useRef();

  const { originalPositions, randomOffsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // spread over a wide area to cover the screen
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = depth;
      rnd[i] = Math.random() * Math.PI * 2;
    }
    return { originalPositions: pos, randomOffsets: rnd };
  }, [count, depth]);

  const posArray = useMemo(() => new Float32Array(originalPositions), [originalPositions]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;
    const { clock, camera } = state;
    const time = clock.elapsedTime;
    
    // Mouse world pos
    const vector = new THREE.Vector3(globalMouse.x, globalMouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distanceToPlane = (depth - camera.position.z) / dir.z; 
    const mousePos = camera.position.clone().add(dir.multiplyScalar(distanceToPlane));
    const cx = mousePos.x;
    const cy = mousePos.y;
    
    // Click world pos
    const clickVec = new THREE.Vector3(globalMouse.clickX, globalMouse.clickY, 0.5);
    clickVec.unproject(camera);
    const clickDir = clickVec.sub(camera.position).normalize();
    const clickDist = (depth - camera.position.z) / clickDir.z;
    const clickPos = camera.position.clone().add(clickDir.multiplyScalar(clickDist));

    const isIdle = (Date.now() - globalMouse.lastMove) > IDLE_TIME_THRESHOLD;
    const now = performance.now();
    const timeSinceClick = now - globalMouse.clickTime;
    const isRippling = timeSinceClick < 1000;
    
    let waveForce = 0;
    if (isRippling) {
       const rTime = timeSinceClick / 1000; 
       waveForce = Math.sin(rTime * Math.PI) * 2.0;
    }

    // Disable intense physics on mobile
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ox = originalPositions[idx];
      const oy = originalPositions[idx + 1];

      let targetX = ox;
      let targetY = oy;
      
      const distToMouse = Math.sqrt((ox - cx)**2 + (oy - cy)**2);
      
      // 1. Click Ripple Effect
      if (!isMobile && isRippling) {
         const dx = ox - clickPos.x;
         const dy = oy - clickPos.y;
         const rad = Math.sqrt(dx*dx + dy*dy);
         if (rad > 0 && rad < 5) { 
            const force = (5 - rad) * waveForce * speedMultiplier * 0.5;
            targetX += (dx / rad) * force;
            targetY += (dy / rad) * force;
         }
      } 
      // 2. Cursor Gravity Interaction
      else if (!isMobile && !isIdle && distToMouse < GRAVITY_RADIUS) {
         const pull = 1 - (distToMouse / GRAVITY_RADIUS);
         targetX = ox - ((ox - cx) * pull * 0.15); 
         targetY = oy - ((oy - cy) * pull * 0.15);
      } 
      // 3. Idle Wave Pattern Drift
      else {
         targetX = ox + Math.sin(time * 0.5 + randomOffsets[i]) * 0.3 * speedMultiplier;
         targetY = oy + Math.cos(time * 0.4 + randomOffsets[i]) * 0.3 * speedMultiplier;
      }

      // Smooth interpolation back to target
      positions[idx] = THREE.MathUtils.lerp(positions[idx], targetX, LERP_FACTOR);
      positions[idx+1] = THREE.MathUtils.lerp(positions[idx+1], targetY, LERP_FACTOR);
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={posArray} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function BackgroundCanvas() {
  useEffect(() => {
    if (!initialized) {
      initGlobalMouse();
      initialized = true;
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
         {/* Background Layer: smaller, darker, slower, far away */}
         <StarLayer count={100} color="#1e3a8a" size={0.03} depth={-5} speedMultiplier={0.3} />
         
         {/* Midground Layer: crisp, purple accents */}
         <StarLayer count={100} color="#a855f7" size={0.05} depth={-2} speedMultiplier={0.6} />
         
         {/* Foreground Layer: larger, bright neon blue, faster */}
         <StarLayer count={60} color="#3b82f6" size={0.08} depth={0.5} speedMultiplier={1.2} />
         
         {/* Custom trailing glow on mouse */}
         <CursorGlow />
      </Canvas>
    </div>
  );
}
