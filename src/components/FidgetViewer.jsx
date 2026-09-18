import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

function FidgetModel({ color = "#00f0ff" }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Miolo Central */}
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 0.3, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} wireframe={false} />
      </mesh>
      {/* Haste 1 */}
      <mesh position={[1.5, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.25, 32]} />
        <meshStandardMaterial color="#ff007f" metalness={0.5} roughness={0.1} />
      </mesh>
      {/* Haste 2 */}
      <mesh position={[-0.75, 0, 1.3]}>
        <cylinderGeometry args={[0.5, 0.5, 0.25, 32]} />
        <meshStandardMaterial color="#ff007f" metalness={0.5} roughness={0.1} />
      </mesh>
      {/* Haste 3 */}
      <mesh position={[-0.75, 0, -1.3]}>
        <cylinderGeometry args={[0.5, 0.5, 0.25, 32]} />
        <meshStandardMaterial color="#ff007f" metalness={0.5} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function FidgetViewer({ activeColor = "#00f0ff" }) {
  return (
    <div className="w-full h-80 bg-cyber-card rounded-xl border border-cyber-neonCyan/30 overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.2)]">
      <Canvas camera={{ position: [0, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#ff007f" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <FidgetModel color={activeColor} />
        </Float>
        <OrbitControls enableZoom={true} autoRotate={false} />
      </Canvas>
    </div>
  );
}