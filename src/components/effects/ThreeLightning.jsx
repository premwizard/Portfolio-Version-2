import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Recursively generate branching lightning paths
const generateBranchingSegments = (start, end, maxGenerations, maxOffset) => {
  const buildBranch = (pStart, pEnd, depth, offsetScale) => {
    if (depth > maxGenerations) return [];
    
    // 1. Midpoint displacement
    let points = [pStart, pEnd];
    let currentOffset = offsetScale;
    const displacementGens = 5; 
    
    for (let i = 0; i < displacementGens; i++) {
      const nextPoints = [];
      for (let j = 0; j < points.length - 1; j++) {
        const p1 = points[j];
        const p2 = points[j + 1];
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * currentOffset,
          (Math.random() - 0.5) * currentOffset,
          (Math.random() - 0.5) * currentOffset * 0.5
        );
        mid.add(offset);
        nextPoints.push(p1, mid);
      }
      nextPoints.push(points[points.length - 1]);
      points = nextPoints;
      currentOffset *= 0.5;
    }
    
    let branchSegments = [];
    for (let i = 0; i < points.length - 1; i++) {
      branchSegments.push({
        p1: points[i],
        p2: points[i+1],
        depth: depth
      });
    }
    
    // 2. Child branches
    if (depth < maxGenerations) {
      // 2-4 child branches, mostly in lower half
      const numChildren = Math.floor(Math.random() * 3) + 2; 
      for (let k = 0; k < numChildren; k++) {
        // Weighted towards end of branch (e.g. 0.4 to 0.9)
        const t = 0.4 + Math.random() * 0.5;
        const randIndex = Math.floor(points.length * t);
        if (randIndex >= points.length - 1) continue;
        
        const spawnPoint = points[randIndex];
        const dir = new THREE.Vector3().subVectors(points[randIndex+1], points[randIndex]).normalize();
        
        // Random angle offset (15-45 degrees)
        const angle = (15 + Math.random() * 30) * (Math.PI / 180);
        // Random axis
        const axis = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
        if (axis.lengthSq() === 0) axis.set(0, 1, 0); // Guard against NaN
        axis.normalize();
        
        if (dir.lengthSq() > 0) {
          dir.normalize();
          dir.applyAxisAngle(axis, angle);
        } else {
          dir.copy(axis); // Fallback if points were identical
        }
        
        // Child length 60-80% of remaining parent length
        const remainingLength = pEnd.distanceTo(spawnPoint);
        const childLength = remainingLength * (0.6 + Math.random() * 0.2);
        const childEnd = spawnPoint.clone().add(dir.multiplyScalar(childLength));
        
        // 30% chance for sub-branch if depth allows, otherwise force cap
        const nextDepth = (Math.random() < 0.3 || depth === 0) ? depth + 1 : maxGenerations + 1;
        
        const childSegments = buildBranch(spawnPoint, childEnd, nextDepth, offsetScale * 0.7);
        branchSegments = branchSegments.concat(childSegments);
      }
    }
    
    return branchSegments;
  };
  
  const allSegments = buildBranch(start, end, 0, maxOffset);
  
  // Sort by Y descending so drawing from top to bottom works progressively
  allSegments.sort((a, b) => b.p1.y - a.p1.y);
  return allSegments;
};

// Global ref for syncing bloom intensity
const activePeakStrikes = { current: 0 };
// Global ref for ambient flash
const ambientFlashState = { current: 0 };

const Bolt = ({ onComplete, colorHex, isLightMode }) => {
  const { viewport, camera } = useThree();
  const materialRef = useRef();
  const geometryRef = useRef();
  
  const phaseRef = useRef('drawing'); // drawing -> hold -> fading
  const timeRef = useRef(0);
  const totalSegmentsRef = useRef(0);
  
  // Audio played flag to prevent multiple triggers per bolt
  const hasPlayedAudio = useRef(false);
  // Intensity modifier for light mode visibility
  const intensityBoost = isLightMode ? 3.0 : 1.0; 
  
  const geometry = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const maxGen = isMobile ? 1 : 2; 
    
    const startX = (Math.random() - 0.5) * viewport.width * 1.2;
    const startY = viewport.height / 2 + 2; 
    const startZ = (Math.random() - 0.5) * 5;

    const endX = startX + (Math.random() - 0.5) * viewport.width * 0.8;
    const endY = -viewport.height / 2 - 2;
    const endZ = (Math.random() - 0.5) * 5;
    
    const start = new THREE.Vector3(startX, startY, startZ);
    const end = new THREE.Vector3(endX, endY, endZ);
    
    const segments = generateBranchingSegments(start, end, maxGen, viewport.width * 0.3);
    totalSegmentsRef.current = segments.length;
    
    const positions = new Float32Array(segments.length * 6);
    const colors = new Float32Array(segments.length * 6);
    
    const baseColor = new THREE.Color(colorHex);
    // Base emissive multiplier
    const emMult = 5.0 * intensityBoost; 

    segments.forEach((seg, i) => {
      positions[i*6]   = seg.p1.x; positions[i*6+1] = seg.p1.y; positions[i*6+2] = seg.p1.z;
      positions[i*6+3] = seg.p2.x; positions[i*6+4] = seg.p2.y; positions[i*6+5] = seg.p2.z;
      
      // Taper brightness based on branch depth
      const dimFactor = Math.pow(0.5, seg.depth); 
      
      colors[i*6]   = baseColor.r * emMult * dimFactor;
      colors[i*6+1] = baseColor.g * emMult * dimFactor;
      colors[i*6+2] = baseColor.b * emMult * dimFactor;
      colors[i*6+3] = baseColor.r * emMult * dimFactor;
      colors[i*6+4] = baseColor.g * emMult * dimFactor;
      colors[i*6+5] = baseColor.b * emMult * dimFactor;
    });
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Start with drawing nothing
    geom.setDrawRange(0, 0);
    return geom;
  }, [viewport, colorHex, intensityBoost]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      // Ensure we clean up active peak counts if unmounted early
      if (phaseRef.current === 'hold') activePeakStrikes.current = Math.max(0, activePeakStrikes.current - 1);
    };
  }, [geometry]);

  // Cinematic timings
  const DRAW_TIME = 150; // ms
  const HOLD_TIME = 100; // ms
  const FADE_TIME = 350; // ms
  const FLICKER_TIME = 150; // ms into fade

  useFrame((state, delta) => {
    if (!materialRef.current || !geometryRef.current) return;
    
    timeRef.current += delta * 1000;
    const t = timeRef.current;
    
    if (phaseRef.current === 'drawing') {
      const progress = Math.min(t / DRAW_TIME, 1);
      const drawCount = Math.floor(progress * totalSegmentsRef.current) * 2;
      geometryRef.current.geometry.setDrawRange(0, drawCount);
      materialRef.current.opacity = 1;
      
      if (progress >= 1) {
        phaseRef.current = 'hold';
        timeRef.current = 0;
        activePeakStrikes.current += 1;
        
        // Screen shake proportional to complexity
        const shakeAmt = Math.min(totalSegmentsRef.current / 500, 1) * 0.3;
        camera.position.x = (Math.random() - 0.5) * shakeAmt;
        camera.position.y = (Math.random() - 0.5) * shakeAmt;
      }
    } 
    else if (phaseRef.current === 'hold') {
      materialRef.current.opacity = 1;
      ambientFlashState.current = 0.05 * intensityBoost; // Trigger flash
      
      if (!hasPlayedAudio.current) {
        hasPlayedAudio.current = true;
        // Debounced dispatch
        window.dispatchEvent(new CustomEvent('lightning-strike-audio'));
      }
      
      if (t >= HOLD_TIME) {
        phaseRef.current = 'fading';
        timeRef.current = 0;
        activePeakStrikes.current = Math.max(0, activePeakStrikes.current - 1);
      }
    } 
    else if (phaseRef.current === 'fading') {
      let progress = t / FADE_TIME;
      let newOpacity = 1 - progress;
      
      // Flicker flash
      if (t > FLICKER_TIME - 16 && t < FLICKER_TIME + 16) {
        newOpacity = 0.4;
      }
      
      if (newOpacity <= 0) {
        materialRef.current.opacity = 0;
        phaseRef.current = 'done';
        onComplete();
      } else {
        materialRef.current.opacity = newOpacity;
      }
    }
  });

  return (
    <lineSegments ref={geometryRef} geometry={geometry}>
      <lineBasicMaterial 
        ref={materialRef}
        vertexColors
        transparent 
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

// Dynamic bloom manager to pulse intensity when strikes hold
const BloomController = () => {
  const bloomRef = useRef();
  
  useFrame(() => {
    if (bloomRef.current) {
      const effect = bloomRef.current;
      const targetIntensity = activePeakStrikes.current > 0 ? 4.5 : 2.0;
      
      // Some versions of postprocessing use intensity, some use blendMode.opacity.value
      if (effect.intensity !== undefined && !isNaN(effect.intensity)) {
        effect.intensity += (targetIntensity - effect.intensity) * 0.2;
      } else if (effect.blendMode && effect.blendMode.opacity) {
        effect.blendMode.opacity.value += (targetIntensity - effect.blendMode.opacity.value) * 0.2;
      }
    }
  });

  return (
    <EffectComposer>
      <Bloom 
        ref={bloomRef}
        luminanceThreshold={0.4} 
        luminanceSmoothing={0.9} 
        intensity={2.0} 
        mipmapBlur 
      />
    </EffectComposer>
  );
};

const BoltManager = () => {
  const [bolts, setBolts] = useState([]);
  const [colorHex, setColorHex] = useState('#d4967a');
  const [isLightMode, setIsLightMode] = useState(false);
  
  const nextSpawnTime = useRef(0);
  const boltIdCounter = useRef(0);

  // Update colors robustly when theme changes
  useEffect(() => {
    const updateColors = () => {
      // Create a temp element to resolve the actual RGB value of the CSS variable
      const tempDiv = document.createElement('div');
      tempDiv.style.color = 'var(--acc)';
      document.body.appendChild(tempDiv);
      const computedColor = getComputedStyle(tempDiv).color; // returns "rgb(r, g, b)"
      document.body.removeChild(tempDiv);
      
      if (computedColor) {
        setColorHex(computedColor);
      }
      
      const theme = document.documentElement.getAttribute('data-theme');
      setIsLightMode(theme === 'light');
    };
    
    updateColors();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateColors();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Bolt spawner effect outside of render loop
  useEffect(() => {
    let spawnTimer;
    let doubleStrikeTimer;

    const scheduleNext = () => {
      const delay = 5000 + Math.random() * 7000;
      spawnTimer = setTimeout(spawnBolt, delay);
    };

    const spawnBolt = () => {
      setBolts(prev => {
        if (prev.length >= 2) return prev;
        
        const newBolts = [...prev, boltIdCounter.current++];
        
        // 15% chance of double strike
        if (Math.random() < 0.15 && prev.length === 0) {
          doubleStrikeTimer = setTimeout(() => {
            setBolts(p => p.length < 2 ? [...p, boltIdCounter.current++] : p);
          }, 100 + Math.random() * 100);
        }
        
        return newBolts;
      });
      
      scheduleNext();
    };

    // Initial spawn
    spawnTimer = setTimeout(spawnBolt, 1000 + Math.random() * 2000);

    return () => {
      clearTimeout(spawnTimer);
      clearTimeout(doubleStrikeTimer);
    };
  }, []);

  useFrame((state) => {
    // Recover camera from shake smoothly
    state.camera.position.lerp(new THREE.Vector3(0, 0, 5), 0.1);
  });

  const handleBoltComplete = useCallback((id) => {
    setBolts(prev => prev.filter(b => b !== id));
  }, []);

  return (
    <>
      {bolts.map(id => (
        <Bolt 
          key={id} 
          colorHex={colorHex} 
          isLightMode={isLightMode}
          onComplete={() => handleBoltComplete(id)} 
        />
      ))}
    </>
  );
};

const AmbientFlash = () => {
  const overlayRef = useRef(null);
  
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (overlayRef.current) {
        const currentOpacity = parseFloat(overlayRef.current.style.opacity || 0);
        const targetOpacity = ambientFlashState.current;
        // Fast decay
        ambientFlashState.current *= 0.85; 
        
        if (currentOpacity > 0.001 || targetOpacity > 0.001) {
           const newOp = currentOpacity + (targetOpacity - currentOpacity) * 0.3;
           overlayRef.current.style.opacity = newOp.toFixed(3);
        } else {
           overlayRef.current.style.opacity = '0';
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  
  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--acc)', 
        opacity: 0, 
        zIndex: 1, 
        mixBlendMode: 'screen' 
      }}
    />
  );
};

const ThreeLightning = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none" 
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <AmbientFlash />
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ alpha: true }}>
        <BoltManager />
        <BloomController />
      </Canvas>
    </div>
  );
};

export default ThreeLightning;