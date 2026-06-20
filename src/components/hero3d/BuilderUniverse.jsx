import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

import CoreOrb from './CoreOrb';
import OrbitNodes from './OrbitNodes';
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
  return (
    <div className="w-full h-[60vh] lg:h-full min-h-[400px] relative cursor-crosshair">
      <Canvas
        camera={{ position: [0, 2, 14], fov: 45 }}
        gl={{ antialias: false, alpha: true }} // Antialias false is good for bloom performance
        dpr={[1, 2]} // Cap pixel ratio for performance
      >
        <Suspense fallback={null}>
          <Lighting />
          
          <ParallaxGroup>
            <Float 
              speed={2} 
              rotationIntensity={0.2} 
              floatIntensity={0.5} 
              floatingRange={[-0.2, 0.2]}
            >
              <CoreOrb />
              <OrbitNodes />
            </Float>
          </ParallaxGroup>
          
          <Effects />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BuilderUniverse;
