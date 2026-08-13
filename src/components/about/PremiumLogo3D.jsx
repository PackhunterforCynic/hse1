import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, Environment, OrbitControls, ContactShadows } from '@react-three/drei';

function LogoScene() {
  const group = useRef();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Make it smaller on mobile/tablets
  const scale = windowWidth < 768 ? 0.5 : 0.8;
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 2) * 0.05;
    group.current.rotation.z = Math.sin(t / 3) * 0.02;
  });

  return (
    <group ref={group} scale={scale}>
      <Center position={[0, 0.7, 0]}>
        <Text3D
          font="/fonts/optimer_bold.typeface.json"
          size={0.8}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.015}
          bevelOffset={0}
          bevelSegments={5}
        >
          HAVILAH PRO
          <meshStandardMaterial color="#CFA65B" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
        </Text3D>
      </Center>

      <Center position={[0, -0.5, 0]}>
        <Text3D
          font="/fonts/optimer_bold.typeface.json"
          size={0.35}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.015}
          bevelSize={0.01}
          bevelOffset={0}
          bevelSegments={5}
        >
          MEDIA & GROWTH
          <meshStandardMaterial color="#EFE6D2" metalness={0.3} roughness={0.4} side={THREE.DoubleSide} />
        </Text3D>
      </Center>
    </group>
  );
}

export default function PremiumLogo3D() {
  return (
    <div className="w-full h-full min-h-[500px] bg-transparent">
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <spotLight position={[-10, 10, 10]} intensity={1} angle={0.3} penumbra={1} color="#CFA65B" />
        <pointLight position={[0, -5, 5]} intensity={1} color="#ffffff" />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2 - 0.2} 
          maxPolarAngle={Math.PI / 2 + 0.2}
          minAzimuthAngle={-0.4}
          maxAzimuthAngle={0.4}
          makeDefault
        />

        <Float rotationIntensity={0.2} floatIntensity={1.5} speed={2}>
          <LogoScene />
        </Float>
        
        <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={20} blur={2.5} far={4} color="#CFA65B" />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
