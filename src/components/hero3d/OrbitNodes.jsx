import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Code, Network, BrainCircuit, Layers, Rocket } from 'lucide-react';
import * as THREE from 'three';

const NODES = [
  { id: 'web', icon: Code, label: 'Web Dev', radius: 3.5, speed: 0.6, angleOffset: 0, color: '#b8ccd8' }, // Platinum
  { id: 'ai', icon: Network, label: 'AI', radius: 4.5, speed: -0.4, angleOffset: Math.PI / 2.5, color: '#d4967a' }, // Rose Gold
  { id: 'ml', icon: BrainCircuit, label: 'Machine Learning', radius: 5.5, speed: 0.3, angleOffset: Math.PI, color: '#c8845e' }, // Warm Tone
  { id: 'projects', icon: Layers, label: 'Projects', radius: 4.0, speed: -0.5, angleOffset: Math.PI * 1.5, color: '#f0ece8' }, // Pearl
  { id: 'startup', icon: Rocket, label: 'Startup Vision', radius: 6.0, speed: 0.2, angleOffset: Math.PI * 1.8, color: '#d4967a' },
];

const OrbitNode = ({ data }) => {
  const groupRef = useRef();
  const sphereRef = useRef();
  
  // Randomize initial vertical offset for a more 3D orbit feel
  const yOffset = useMemo(() => (Math.random() - 0.5) * 2, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Calculate orbital position
    const angle = time * data.speed + data.angleOffset;
    const x = Math.cos(angle) * data.radius;
    const z = Math.sin(angle) * data.radius;
    
    // Smooth vertical bobbing
    const y = Math.sin(time * 0.5 + data.angleOffset) * yOffset;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
      // Make the node always face the camera (optional, but good for 3D elements)
      groupRef.current.quaternion.copy(state.camera.quaternion);
    }

    if (sphereRef.current) {
      // Pulse the small sphere
      sphereRef.current.scale.setScalar(1 + Math.sin(time * 2 + data.angleOffset) * 0.1);
    }
  });

  const Icon = data.icon;

  return (
    <group ref={groupRef}>
      {/* 3D Sphere Body */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1.0}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Orbit Trail Ring (Visual aid for orbit paths, optional but looks premium) */}
      
      {/* HTML Overlay for the crisp Icon and Label */}
      <Html
        center
        distanceFactor={15} // Scales down nicely as it goes further
        zIndexRange={[100, 0]} // Ensures proper occlusion handling
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex flex-col items-center justify-center translate-y-[-20px]">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border"
            style={{ borderColor: `${data.color}40`, boxShadow: `0 0 15px ${data.color}30` }}
          >
            <Icon size={20} color={data.color} strokeWidth={1.5} />
          </div>
          <span 
            className="mt-2 text-xs font-semibold tracking-widest uppercase whitespace-nowrap drop-shadow-md"
            style={{ color: data.color }}
          >
            {data.label}
          </span>
        </div>
      </Html>
    </group>
  );
};

// Add subtle ring trails for each orbit
const OrbitTrails = () => {
  return (
    <group>
      {NODES.map((node, i) => (
        <mesh key={`trail-${i}`} rotation-x={Math.PI / 2}>
          <ringGeometry args={[node.radius - 0.02, node.radius + 0.02, 64]} />
          <meshBasicMaterial 
            color={node.color} 
            transparent 
            opacity={0.1} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      ))}
    </group>
  );
};

const OrbitNodes = () => {
  return (
    <group>
      <OrbitTrails />
      {NODES.map((node) => (
        <OrbitNode key={node.id} data={node} />
      ))}
    </group>
  );
};

export default OrbitNodes;
