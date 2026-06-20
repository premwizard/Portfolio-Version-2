import React from 'react';
import { Environment } from '@react-three/drei';

const Lighting = () => {
  return (
    <>
      {/* Soft ambient lighting for base visibility - kept low for high contrast cinematic look */}
      <ambientLight intensity={0.1} color="#f0ece8" />
      
      {/* Environment map for premium glassmorphism reflections */}
      <Environment preset="city" />
      
      {/* Main spotlight highlighting the core from top left */}
      <spotLight
        position={[-10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2.5}
        color="#d4967a" // Rose gold
        castShadow
      />

      {/* Rim light from behind to give a luxurious edge to the objects */}
      <spotLight
        position={[10, -5, -10]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        color="#b8ccd8" // Platinum
      />

      {/* Point light right inside the core to create inner glow reflection on surrounding nodes */}
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#c8845e" distance={15} />
    </>
  );
};

export default Lighting;
