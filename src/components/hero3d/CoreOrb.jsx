import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';

const EngineerScene = () => {
  const mainGroupRef = useRef();
  const characterRef = useRef();
  const panelsRef = useRef();
  const particlesRef = useRef();
  const linesRef = useRef();

  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  // Load the generated AI Engineer Character
  const characterTexture = useTexture('/hero_character.png');
  
  // To avoid image stretching, calculate aspect ratio if needed,
  // but let's assume it's a square generation (e.g. 1024x1024)
  const planeSize = isMobile ? 8 : 10;

  // --- PARTICLES ---
  const particleCount = isMobile ? 80 : 150;
  const { positions, scales, randomFactors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sc = new Float32Array(particleCount);
    const factors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Widespread distribution across the entire screen behind the character
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 4; // Keep behind the character (Z < 0)
      
      sc[i] = Math.random() * 0.5 + 0.5;
      
      factors[i * 3] = Math.random() * 2 - 1;
      factors[i * 3 + 1] = Math.random() * 2 - 1;
      factors[i * 3 + 2] = Math.random() * 2 - 1;
    }
    return { positions: pos, scales: sc, randomFactors: factors };
  }, [particleCount]);

  // --- NEURAL NETWORK / DATA STREAMS ---
  const lineGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      // Create connecting jagged lines
      const startX = (Math.random() - 0.5) * 15;
      const startY = (Math.random() - 0.5) * 10;
      points.push(new THREE.Vector3(startX, startY, -2));
      points.push(new THREE.Vector3(startX + (Math.random() - 0.5) * 4, startY + (Math.random() - 0.5) * 4, -1));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // --- HOLOGRAPHIC PANELS DATA ---
  const panelsData = [
    { text: "AI ARCHITECTURE", x: -4, y: 3, z: 1, scale: 1 },
    { text: "NEURAL NETWORKS", x: 4, y: 2, z: 2, scale: 0.9 },
    { text: "DATA PIPELINE", x: -5, y: -2, z: 1.5, scale: 0.8 },
    { text: "REACT / NEXT.JS", x: 5, y: -3, z: 0.5, scale: 1.1 }
  ];

  // --- ANIMATION LOOP ---
  useFrame((state, delta) => {
    if (!Number.isFinite(delta)) return;
    const t = state.clock.elapsedTime;
    const pointer = state.pointer; // Normalized mouse coordinates [-1, 1]

    // 1. Dynamic Positioning (Right on desktop, Center on mobile)
    if (mainGroupRef.current) {
      const targetX = isMobile ? 0 : viewport.width * 0.22;
      mainGroupRef.current.position.x += (targetX - mainGroupRef.current.position.x) * 0.05;
      mainGroupRef.current.position.y = Math.sin(t * 0.5) * 0.2; // Base float
    }

    // 2. Deep Parallax Effect (2.5D)
    if (characterRef.current) {
      // Character moves slightly opposite to the mouse
      characterRef.current.position.x = THREE.MathUtils.lerp(characterRef.current.position.x, -pointer.x * 0.5, 0.05);
      characterRef.current.position.y = THREE.MathUtils.lerp(characterRef.current.position.y, -pointer.y * 0.5, 0.05);
    }

    if (panelsRef.current) {
      // Foreground panels move MORE opposite to the mouse (exaggerated depth)
      panelsRef.current.position.x = THREE.MathUtils.lerp(panelsRef.current.position.x, pointer.x * 1.5, 0.05);
      panelsRef.current.position.y = THREE.MathUtils.lerp(panelsRef.current.position.y, pointer.y * 1.5, 0.05);
    }

    // 3. Particles Drift
    if (particlesRef.current) {
      const positionsArray = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positionsArray[i3] += Math.sin(t * 0.5 + randomFactors[i3]) * 0.005;
        positionsArray[i3 + 1] += Math.cos(t * 0.6 + randomFactors[i3 + 1]) * 0.005;
        // Background particles move slightly with the mouse to create massive parallax
        positionsArray[i3] -= (pointer.x * 0.05) * randomFactors[i]; 
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Data Streams Pulse
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.2 + Math.abs(Math.sin(t * 2.0)) * 0.4;
    }
  });

  return (
    <>
      {/* Background Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-scale"
            count={scales.length}
            array={scales}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={isMobile ? 0.08 : 0.06}
          color="#b8ccd8" // Platinum glow
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* Main Group */}
      <group ref={mainGroupRef}>

        {/* Neural Network Background Streams */}
        <lineSegments ref={linesRef} geometry={lineGeometry}>
          <lineBasicMaterial color="#c8845e" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </lineSegments>

        {/* 2.5D Character Plane */}
        <mesh ref={characterRef} position={[0, 0, 0]}>
          {/* Using a square plane. Adjust args based on generated image aspect ratio if necessary */}
          <planeGeometry args={[planeSize, planeSize]} />
          <meshPhysicalMaterial 
            map={characterTexture} 
            transparent={true} 
            opacity={0.95} // Slight transparency to blend into dark cinematic background
            roughness={0.8}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Holographic Foreground Panels */}
        <group ref={panelsRef}>
          {panelsData.map((panel, i) => (
            <Float 
              key={i} 
              speed={2} 
              rotationIntensity={0.2} 
              floatIntensity={0.5} 
              position={[panel.x, panel.y, panel.z]}
            >
              <group scale={panel.scale}>
                {/* Holographic Text */}
                <Text
                  position={[0, 0, 0.02]}
                  fontSize={0.4}
                  color="#d4967a" // Rose gold text
                  anchorX="center"
                  anchorY="middle"
                  font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" // Sleek modern font
                  material-toneMapped={false}
                >
                  {panel.text}
                </Text>

                {/* Cyber-tech Border */}
                <lineSegments>
                  <edgesGeometry args={[new THREE.PlaneGeometry(3.5, 0.8)]} />
                  <lineBasicMaterial color="#b8ccd8" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
                </lineSegments>

                {/* Soft Panel Background */}
                <mesh position={[0, 0, -0.01]}>
                  <planeGeometry args={[3.5, 0.8]} />
                  <meshBasicMaterial color="#080507" transparent opacity={0.4} />
                </mesh>
              </group>
            </Float>
          ))}
        </group>

      </group>
    </>
  );
};

export default EngineerScene;
