import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Utility to generate a jagged lightning path using midpoint displacement
const generateLightningPoints = (start, end, generations, maxOffset) => {
  let points = [start, end];
  for (let i = 0; i < generations; i++) {
    const nextPoints = [];
    for (let j = 0; j < points.length - 1; j++) {
      const p1 = points[j];
      const p2 = points[j + 1];
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      // Random displacement
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * maxOffset,
        (Math.random() - 0.5) * maxOffset,
        (Math.random() - 0.5) * maxOffset * 0.5
      );
      mid.add(offset);
      nextPoints.push(p1, mid);
    }
    nextPoints.push(points[points.length - 1]);
    points = nextPoints;
    maxOffset *= 0.5; // decrease offset for next generation
  }
  return points;
};

const Bolt = ({ onComplete, colorHex }) => {
  const { viewport } = useThree();
  const materialRef = useRef();
  
  const phaseRef = useRef('in');
  const timeRef = useRef(0);
  
  // Calculate geometry once
  const { geometry, glowColor } = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const gen = isMobile ? 4 : 5; // reduce complexity on mobile
    
    // Pick random start and end points within viewport
    const startX = (Math.random() - 0.5) * viewport.width * 1.2;
    const startY = viewport.height / 2 + 2; 
    const startZ = (Math.random() - 0.5) * 5;

    const endX = startX + (Math.random() - 0.5) * viewport.width * 0.8;
    const endY = -viewport.height / 2 - 2;
    const endZ = (Math.random() - 0.5) * 5;
    
    const start = new THREE.Vector3(startX, startY, startZ);
    const end = new THREE.Vector3(endX, endY, endZ);
    
    const points = generateLightningPoints(start, end, gen, viewport.width * 0.4);
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create an intense color for bloom
    const baseColor = new THREE.Color(colorHex);
    // Multiply color by a factor > 1 to trigger bloom
    const intenseColor = new THREE.Color(
      baseColor.r * 5,
      baseColor.g * 5,
      baseColor.b * 5
    );
    
    return { geometry: geom, glowColor: intenseColor };
  }, [viewport, colorHex]);

  // Clean up geometry
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    
    timeRef.current += delta * 1000;
    
    if (phaseRef.current === 'in') {
      // Fast fade in (50ms)
      const newOpacity = timeRef.current / 50;
      if (newOpacity >= 1) {
        materialRef.current.opacity = 1;
        phaseRef.current = 'out';
        timeRef.current = 0;
      } else {
        materialRef.current.opacity = newOpacity;
      }
    } else if (phaseRef.current === 'out') {
      // Slow fade out (300ms)
      const newOpacity = 1 - (timeRef.current / 300);
      if (newOpacity <= 0) {
        materialRef.current.opacity = 0;
        onComplete();
      } else {
        materialRef.current.opacity = newOpacity;
      }
    }
    
    // Flicker effect during fade out
    const flicker = phaseRef.current === 'out' ? (0.6 + Math.random() * 0.4) : 1;
    materialRef.current.opacity *= flicker;
  });

  return (
    <line geometry={geometry}>
      <lineBasicMaterial 
        ref={materialRef}
        color={glowColor}
        transparent 
        opacity={0}
        linewidth={1}
      />
    </line>
  );
};

const BoltManager = () => {
  const [bolts, setBolts] = useState([]);
  const [colorHex, setColorHex] = useState('#d4967a');
  const [isMobile, setIsMobile] = useState(false);
  const nextSpawnTime = useRef(0);
  const boltIdCounter = useRef(0);

  useEffect(() => {
    // Get accent color from CSS variables
    const rootStyle = getComputedStyle(document.documentElement);
    let accColor = rootStyle.getPropertyValue('--acc').trim();
    if (accColor) {
      setColorHex(accColor);
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useFrame((state) => {
    // Completely disable on low-end/mobile if desired, but we just reduce complexity.
    // Spawn logic
    const time = state.clock.elapsedTime * 1000;
    if (time > nextSpawnTime.current) {
      if (bolts.length < 2) {
        // Spawn a new bolt
        const id = boltIdCounter.current++;
        setBolts(prev => [...prev, id]);
        
        // Dispatch sound event
        window.dispatchEvent(new CustomEvent('lightning-strike'));
        
        // Optional camera shake
        state.camera.position.x = (Math.random() - 0.5) * 0.2;
        state.camera.position.y = (Math.random() - 0.5) * 0.2;
      }
      // Schedule next spawn (3 - 8 seconds)
      const delay = 3000 + Math.random() * 5000;
      nextSpawnTime.current = time + delay;
    }

    // Recover camera from shake
    state.camera.position.lerp(new THREE.Vector3(0, 0, 5), 0.1);
  });

  const handleBoltComplete = useCallback((id) => {
    setBolts(prev => prev.filter(b => b !== id));
  }, []);

  return (
    <>
      {bolts.map(id => (
        <Bolt key={id} colorHex={colorHex} onComplete={() => handleBoltComplete(id)} />
      ))}
    </>
  );
};

const ThreeLightning = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none" 
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <BoltManager />
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.5} 
            luminanceSmoothing={0.9} 
            intensity={2.0} 
            mipmapBlur 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default ThreeLightning;
