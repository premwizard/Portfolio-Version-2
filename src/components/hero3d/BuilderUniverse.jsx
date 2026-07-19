import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

import Lighting from './Lighting';
import Effects from './Effects';

// A helper component to add smooth parallax based on mouse movement
const ParallaxGroup = ({ children }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle mouse parallax
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;

      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const BuilderUniverse = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Initial check
    const theme = document.documentElement.getAttribute('data-theme');
    setTimeout(() => setIsLightMode(theme === 'light'), 0);

    // Observe future changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const currentTheme = document.documentElement.getAttribute('data-theme');
          setIsLightMode(currentTheme === 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const bgColor = isLightMode ? '#f0ece8' : '#080507';

  return (
    <div className="w-full h-full min-h-screen relative">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45 }}
        gl={{ antialias: false, alpha: true }} // Antialias false is good for bloom performance
        dpr={[1, 2]} // Cap pixel ratio for performance
      >
        {/* Layer 1: Cinematic Background & Fog */}
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 10, 30]} />

        <Suspense fallback={null}>
          <Lighting />
          
          <ParallaxGroup>
            <Float 
              speed={2} 
              rotationIntensity={0.2} 
              floatIntensity={0.5} 
              floatingRange={[-0.2, 0.2]}
            >
             
            </Float>
          </ParallaxGroup>
          
          <Effects />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BuilderUniverse;
