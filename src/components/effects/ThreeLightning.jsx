import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// -------------------------------------------------------------
// CORE GENERATION
// -------------------------------------------------------------
const generateBranchingSegments = (start, end, maxGenerations, maxOffset) => {
  const buildBranch = (pStart, pEnd, depth, offsetScale) => {
    if (depth > maxGenerations) return [];
    
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
    
    if (depth < maxGenerations) {
      const numChildren = Math.floor(Math.random() * 3) + 2; 
      for (let k = 0; k < numChildren; k++) {
        const t = 0.4 + Math.random() * 0.5;
        const randIndex = Math.floor(points.length * t);
        if (randIndex >= points.length - 1) continue;
        
        const spawnPoint = points[randIndex];
        const dir = new THREE.Vector3().subVectors(points[randIndex+1], points[randIndex]).normalize();
        
        const angle = (15 + Math.random() * 30) * (Math.PI / 180);
        const axis = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
        if (axis.lengthSq() === 0) axis.set(0, 1, 0);
        axis.normalize();
        
        if (dir.lengthSq() > 0) {
          dir.normalize();
          dir.applyAxisAngle(axis, angle);
        } else {
          dir.copy(axis);
        }
        
        const remainingLength = pEnd.distanceTo(spawnPoint);
        const childLength = remainingLength * (0.6 + Math.random() * 0.2);
        const childEnd = spawnPoint.clone().add(dir.multiplyScalar(childLength));
        
        const nextDepth = (Math.random() < 0.3 || depth === 0) ? depth + 1 : maxGenerations + 1;
        const childSegments = buildBranch(spawnPoint, childEnd, nextDepth, offsetScale * 0.7);
        branchSegments = branchSegments.concat(childSegments);
      }
    }
    
    return branchSegments;
  };
  
  const allSegments = buildBranch(start, end, 0, maxOffset);
  allSegments.sort((a, b) => b.p1.y - a.p1.y);
  return allSegments;
};

// -------------------------------------------------------------
// GLOBAL STATE
// -------------------------------------------------------------
const activePeakStrikes = { current: 0 };
const ambientFlashState = { current: 0 };

// -------------------------------------------------------------
// COMPONENTS
// -------------------------------------------------------------
const CameraRecovery = () => {
  const { camera } = useThree();
  const targetCameraPos = useRef(new THREE.Vector3(0, 0, 5));

  useFrame(() => {
    try {
      if (!camera) return;
      camera.position.lerp(targetCameraPos.current, 0.1);
    } catch (err) {
      console.error("Crash source CameraRecovery:", { message: err.message, stack: err.stack });
    }
  });

  return null;
};

const WebGLRecovery = () => {
  const { gl } = useThree();
  useEffect(() => {
    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn("WebGL Context Lost");
    };
    const handleContextRestored = () => {
      console.warn("WebGL Context Restored");
    };
    gl.domElement.addEventListener('webglcontextlost', handleContextLost);
    gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);
    return () => {
      gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
      gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      gl.dispose();
    };
  }, [gl]);
  return null;
};

const PostFX = () => {
  const [intensity, setIntensity] = useState(2.0);
  
  useFrame(() => {
    try {
      const targetIntensity = activePeakStrikes.current > 0 ? 4.5 : 2.0;
      // Guarded setState to prevent infinite re-renders
      if (Math.abs(targetIntensity - intensity) > 0.05) {
        setIntensity(prev => prev + (targetIntensity - prev) * 0.2);
      }
    } catch (err) {
      console.error("Crash source PostFX:", { message: err.message, stack: err.stack });
    }
  });

  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.4} 
        luminanceSmoothing={0.9} 
        intensity={intensity} 
        mipmapBlur 
      />
    </EffectComposer>
  );
};

const Bolt = ({ onComplete, colorHex, isLightMode }) => {
  const { viewport, camera } = useThree();
  const materialRef = useRef();
  const geometryRef = useRef();
  
  const phaseRef = useRef('drawing'); 
  const timeRef = useRef(0);
  const totalSegmentsRef = useRef(0);
  const hasPlayedAudio = useRef(false);
  const geomInstanceRef = useRef();
  const isCompleteRef = useRef(false); // Lock for onComplete
  
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
    
    // In light mode, use a deeper, richer color so it stands out against the light background
    const actualColor = isLightMode ? '#5a1f00' : colorHex;
    const baseColor = new THREE.Color(actualColor);
    
    // Dark mode needs high multiplier to glow and trigger bloom.
    // Light mode must stay below 1.0 so it doesn't clamp to pure white!
    const emMult = isLightMode ? 1.0 : (5.0 * intensityBoost);  

    segments.forEach((seg, i) => {
      positions[i*6]   = seg.p1.x; positions[i*6+1] = seg.p1.y; positions[i*6+2] = seg.p1.z;
      positions[i*6+3] = seg.p2.x; positions[i*6+4] = seg.p2.y; positions[i*6+5] = seg.p2.z;
      
      const dimFactor = Math.pow(0.5, seg.depth); 
      
      colors[i*6]   = baseColor.r * emMult * dimFactor;
      colors[i*6+1] = baseColor.g * emMult * dimFactor;
      colors[i*6+2] = baseColor.b * emMult * dimFactor;
      colors[i*6+3] = baseColor.r * emMult * dimFactor;
      colors[i*6+4] = baseColor.g * emMult * dimFactor;
      colors[i*6+5] = baseColor.b * emMult * dimFactor;
    });
    
    if (geomInstanceRef.current) geomInstanceRef.current.dispose();
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setDrawRange(0, 0);
    
    geomInstanceRef.current = geom;
    return geom;
  }, [viewport, colorHex, intensityBoost]);

  useEffect(() => {
    return () => {
      if (geomInstanceRef.current) geomInstanceRef.current.dispose();
      if (phaseRef.current === 'hold') {
        activePeakStrikes.current = Math.max(0, activePeakStrikes.current - 1);
      }
    };
  }, []);

  const DRAW_TIME = 150; 
  const HOLD_TIME = 100; 
  const FADE_TIME = 350; 
  const FLICKER_TIME = 150; 

  useFrame((state, delta) => {
    try {
      if (!materialRef.current || !geometryRef.current) return; // Guard refs
      
      const geom = geometryRef.current.geometry;
      if (!geom || !geom.attributes || !geom.attributes.position) return; // Guard geometry
      
      if (!Number.isFinite(delta)) return; // Guard numeric
      
      timeRef.current += delta * 1000;
      const t = timeRef.current;
      
      if (phaseRef.current === 'drawing') {
        const progress = Math.min(t / DRAW_TIME, 1);
        const drawCount = Math.floor(progress * totalSegmentsRef.current) * 2;
        
        geom.setDrawRange(0, drawCount);
        materialRef.current.opacity = 1;
        
        if (progress >= 1) {
          phaseRef.current = 'hold';
          timeRef.current = 0;
          activePeakStrikes.current += 1;
          
          const shakeAmt = Math.min(totalSegmentsRef.current / 500, 1) * 0.3;
          if (camera && Number.isFinite(shakeAmt)) {
             camera.position.x = (Math.random() - 0.5) * shakeAmt;
             camera.position.y = (Math.random() - 0.5) * shakeAmt;
          }
        }
      } 
      else if (phaseRef.current === 'hold') {
        materialRef.current.opacity = 1;
        ambientFlashState.current = 0.05 * intensityBoost; 
        
        if (!hasPlayedAudio.current) {
          hasPlayedAudio.current = true;
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
        
        if (t > FLICKER_TIME - 16 && t < FLICKER_TIME + 16) {
          newOpacity = 0.4;
        }
        
        if (newOpacity <= 0) {
          materialRef.current.opacity = 0;
          if (!isCompleteRef.current) {
            isCompleteRef.current = true; // Lock onComplete
            phaseRef.current = 'done';
            onComplete(); 
          }
        } else {
          materialRef.current.opacity = newOpacity;
        }
      }
    } catch (err) {
      console.error("Crash source Bolt:", { message: err.message, stack: err.stack });
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
        blending={isLightMode ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

const LightningRenderer = () => {
  const [bolts, setBolts] = useState([]);
  const [colorHex, setColorHex] = useState('#d4967a');
  const [isLightMode, setIsLightMode] = useState(false);
  const boltIdCounter = useRef(0);

  useEffect(() => {
    const updateColors = () => {
      const tempDiv = document.createElement('div');
      tempDiv.style.color = 'var(--acc)';
      document.body.appendChild(tempDiv);
      const computedColor = getComputedStyle(tempDiv).color; 
      document.body.removeChild(tempDiv);
      
      if (computedColor) setColorHex(computedColor);
      
      const theme = document.documentElement.getAttribute('data-theme');
      setIsLightMode(theme === 'light');
    };
    
    updateColors();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') updateColors();
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

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
        
        if (Math.random() < 0.15 && prev.length === 0) {
          doubleStrikeTimer = setTimeout(() => {
            setBolts(p => p.length < 2 ? [...p, boltIdCounter.current++] : p);
          }, 100 + Math.random() * 100);
        }
        
        return newBolts;
      });
      scheduleNext();
    };

    spawnTimer = setTimeout(spawnBolt, 1000 + Math.random() * 2000);
    return () => {
      clearTimeout(spawnTimer);
      clearTimeout(doubleStrikeTimer);
    };
  }, []);

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
      try {
        if (!overlayRef.current) return;
        const currentOpacity = parseFloat(overlayRef.current.style.opacity || 0);
        const targetOpacity = ambientFlashState.current;
        
        ambientFlashState.current *= 0.85; 
        
        if (currentOpacity > 0.001 || targetOpacity > 0.001) {
           const newOp = currentOpacity + (targetOpacity - currentOpacity) * 0.3;
           if (Number.isFinite(newOp)) {
              overlayRef.current.style.opacity = newOp.toFixed(3);
           }
        } else {
           overlayRef.current.style.opacity = '0';
        }
      } catch (err) {
        console.error("Crash source AmbientFlash:", { message: err.message, stack: err.stack });
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

// -------------------------------------------------------------
// MAIN EXPORT
// -------------------------------------------------------------
const ThreeLightning = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none" 
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <AmbientFlash />
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ alpha: true }}>
        <WebGLRecovery />
        <LightningRenderer />
        <PostFX />
        <CameraRecovery />
      </Canvas>
    </div>
  );
};

export default ThreeLightning;