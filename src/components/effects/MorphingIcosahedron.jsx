import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --------------------------------------------------------
// Simple 3D Simplex Noise implementation
// --------------------------------------------------------
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;

const grad3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];

const p = new Uint8Array(256);
for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);

const perm = new Uint8Array(512);
const permMod12 = new Uint8Array(512);
for (let i = 0; i < 512; i++) {
  perm[i] = p[i & 255];
  permMod12[i] = (perm[i] % 12);
}

const dot = (g, x, y, z) => g[0] * x + g[1] * y + g[2] * z;

const simplex3 = (xin, yin, zin) => {
  let n0, n1, n2, n3;
  const s = (xin + yin + zin) * F3;
  const i = Math.floor(xin + s);
  const j = Math.floor(yin + s);
  const k = Math.floor(zin + s);
  const t = (i + j + k) * G3;
  const X0 = i - t, Y0 = j - t, Z0 = k - t;
  const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;

  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) {
    if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
    else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
  } else {
    if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
    else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
  }

  const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2.0 * G3, y2 = y0 - j2 + 2.0 * G3, z2 = z0 - k2 + 2.0 * G3;
  const x3 = x0 - 1.0 + 3.0 * G3, y3 = y0 - 1.0 + 3.0 * G3, z3 = z0 - 1.0 + 3.0 * G3;

  const ii = i & 255, jj = j & 255, kk = k & 255;
  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 < 0) n0 = 0.0;
  else { t0 *= t0; n0 = t0 * t0 * dot(grad3[permMod12[ii + perm[jj + perm[kk]]]], x0, y0, z0); }

  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 < 0) n1 = 0.0;
  else { t1 *= t1; n1 = t1 * t1 * dot(grad3[permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]], x1, y1, z1); }

  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 < 0) n2 = 0.0;
  else { t2 *= t2; n2 = t2 * t2 * dot(grad3[permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]], x2, y2, z2); }

  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 < 0) n3 = 0.0;
  else { t3 *= t3; n3 = t3 * t3 * dot(grad3[permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]], x3, y3, z3); }

  return 32.0 * (n0 + n1 + n2 + n3);
};


// --------------------------------------------------------
// The Core Icosahedron Component
// --------------------------------------------------------
const IcosahedronShape = ({ colorPrimary, colorSecondary, isMobile }) => {
  const meshRef = useRef();
  const { size } = useThree();
  
  // Base geometry (only created once)
  const detail = isMobile ? 1 : 2;
  const radius = isMobile ? 8 : 12;
  
  const geomInstanceRef = useRef();

  const baseGeometry = useMemo(() => {
    if (geomInstanceRef.current) geomInstanceRef.current.dispose();
    const geo = new THREE.IcosahedronGeometry(radius, detail);
    // Store original positions for stable noise calculation
    geo.userData.originalPositions = new Float32Array(geo.attributes.position.array);
    geomInstanceRef.current = geo;
    return geo;
  }, [radius, detail]);

  useEffect(() => {
    return () => {
      if (geomInstanceRef.current) geomInstanceRef.current.dispose();
    };
  }, []);

  // Mouse Tracking
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, z: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse to -1 to +1 relative to screen center
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Calculate target tilt (gentle parallax)
      targetRotation.current.z = -mouse.current.x * 0.15;
      targetRotation.current.x = mouse.current.y * 0.15;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation Loop
  useFrame((state, delta) => {
    if (!baseGeometry || !meshRef.current) return;
    
    const time = state.clock.elapsedTime * 0.3; // speed of morphing
    
    // 1. Morph Geometry using Noise
    const positionAttribute = baseGeometry.attributes.position;
    const originals = baseGeometry.userData.originalPositions;
    const vertex = new THREE.Vector3();
    const normal = new THREE.Vector3();
    
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromArray(originals, i * 3);
      normal.copy(vertex).normalize();
      
      // Calculate noise based on original position + time
      const noiseScale = 0.2; // frequency
      const displacementAmt = 2.0; // amplitude
      const n = simplex3(
        vertex.x * noiseScale + time,
        vertex.y * noiseScale + time,
        vertex.z * noiseScale + time
      );
      
      // Displace vertex along normal
      vertex.add(normal.multiplyScalar(n * displacementAmt));
      
      // Guard against NaN values crashing WebGL
      if (isNaN(vertex.x) || isNaN(vertex.y) || isNaN(vertex.z)) {
        console.error("NaN vertex detected in MorphingIcosahedron:", vertex);
        continue;
      }
      
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positionAttribute.needsUpdate = true;
    baseGeometry.computeVertexNormals();
    baseGeometry.computeBoundingSphere(); // Prevent frustum culling crashes

    // 2. Rotate Mesh (Idle + Parallax)
    meshRef.current.rotation.y += 0.003; // idle rotation
    
    // Smoothly interpolate mouse tilt
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.z += (targetRotation.current.z - meshRef.current.rotation.z) * 0.05;
  });

  return (
    <group ref={meshRef}>
      {/* Solid Inner Core */}
      <mesh geometry={baseGeometry}>
        <meshPhysicalMaterial 
          color={colorSecondary}
          transparent={true}
          opacity={0.12}
          roughness={0.2}
          metalness={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe Shell (Skip on mobile for performance) */}
      {!isMobile && (
        <mesh geometry={baseGeometry}>
          <meshBasicMaterial 
            color={colorPrimary}
            wireframe={true}
            transparent={true}
            opacity={0.5}
            depthWrite={false}
          />
        </mesh>
      )}
      
      {/* Local lighting specifically to highlight the morphing geometry */}
      <pointLight position={[20, 20, 20]} color={colorSecondary} intensity={4} distance={100} />
      <pointLight position={[-20, -20, -20]} color={colorPrimary} intensity={2} distance={100} />
    </group>
  );
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

// --------------------------------------------------------
// The Canvas Wrapper
// --------------------------------------------------------
const MorphingIcosahedron = () => {
  const [colors, setColors] = useState({ primary: '#d4967a', secondary: '#b8ccd8' });
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  // 1. Resolve safe CSS colors
  useEffect(() => {
    const updateColors = () => {
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);
      
      // Get primary (--acc)
      tempDiv.style.color = 'var(--acc)';
      const primary = getComputedStyle(tempDiv).color;
      
      // Get secondary (--acc2)
      tempDiv.style.color = 'var(--acc2)';
      let secondary = getComputedStyle(tempDiv).color;
      
      // Fallback to primary if secondary isn't defined
      if (secondary === 'rgba(0, 0, 0, 0)' || !secondary) secondary = primary;

      document.body.removeChild(tempDiv);
      
      if (primary) {
        setColors({ primary, secondary });
      }
    };
    
    updateColors();
    
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') updateColors();
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // 2. Track screen size and scroll position
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleScroll = () => {
      // Fade out as user scrolls down 1 window height
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / window.innerHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate container scale and opacity based on scroll
  const scale = 1 - (scrollProgress * 0.3); // Scale down to 70% max
  const opacity = 1 - (scrollProgress * 1.5); // Fade out completely before hitting next section

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none transition-transform duration-75"
      style={{ 
        zIndex: -5, // Behind text (0+) but in front of particle canvas (-10)
        opacity: Math.max(0, opacity),
        transform: `scale(${scale})`
      }}
      aria-hidden="true"
    >
      <Canvas 
        camera={{ position: [0, 0, 30], fov: 45 }} 
        gl={{ alpha: true, antialias: true }}
      >
        <WebGLRecovery />
        <IcosahedronShape 
          colorPrimary={colors.primary} 
          colorSecondary={colors.secondary} 
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
};

export default MorphingIcosahedron;
