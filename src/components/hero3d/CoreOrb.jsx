import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

const CoreOrb = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state, delta) => {
    // Floating motion
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    
    // Slow rotation
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    // Breathing pulse effect on emissive intensity
    if (materialRef.current) {
      const pulse = MathUtils.lerp(
        0.8,
        1.5,
        (Math.sin(state.clock.elapsedTime * 1.5) + 1) / 2
      );
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* 
        A slightly complex geometry for a tech/futuristic vibe, 
        or a simple sphere if we want it completely elegant. 
        Icosahedron gives a nice low-poly but high-tech gem look. 
      */}
      <icosahedronGeometry args={[1.5, 4]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#d4967a" // Rose Gold base
        emissive="#c8845e" // Warm Tone glow
        emissiveIntensity={1}
        roughness={0.15}
        metalness={0.8}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        wireframe={true} // Adding wireframe layer makes it look very "builder/tech"
        transparent
        opacity={0.8}
      />
      
      {/* Solid inner core to give depth to the wireframe */}
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshPhysicalMaterial
          color="#080507"
          emissive="#d4967a"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={1.0}
          clearcoat={1.0}
        />
      </mesh>
    </mesh>
  );
};

export default CoreOrb;
