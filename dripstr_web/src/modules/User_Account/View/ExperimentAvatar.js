import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const SculptableTorso = () => {
  const meshRef = useRef();

  useEffect(() => {
    const geometry = meshRef.current.geometry;

    // Access vertices of the geometry
    const position = geometry.attributes.position;
    const vertices = position.array;

    // Sculpt the torso shape
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1]; // Y is the height axis
      const z = vertices[i + 2];

      // Broader shoulders (upper section)
      if (y > 0.5) {
        vertices[i] *= 1.2; // Scale outwards
        vertices[i + 2] *= 1.2; // Scale outwards
      }

      // Chest protrusion (upper-mid section)
      if (y > 0.2 && y <= 0.5) {
        vertices[i] *= 1.1; // Slightly broader chest
        vertices[i + 2] += z * 0.1; // Push chest forward
      }

      // Tapered waist (lower-mid section)
      if (y > -0.2 && y <= 0.2) {
        vertices[i] *= 0.8; // Scale inward for waist
        vertices[i + 2] *= 0.8;
      }

      // Hips (lower section)
      if (y <= -0.2 && y > -0.5) {
        vertices[i] *= 1.1; // Slightly broader hips
        vertices[i + 2] *= 1.1;
      }

      // Base stability (bottom section)
      if (y <= -0.5) {
        vertices[i] *= 1.3; // Broader base
        vertices[i + 2] *= 1.3;
      }
    }

    // Update the geometry
    position.needsUpdate = true;
  }, []);

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.5, 0.5, 2, 64]} /> {/* Start with a tall cylinder */}
      <meshStandardMaterial color="peachpuff" />
    </mesh>
  );
};

const App = () => (
  <Canvas>
    <ambientLight intensity={0.5} />
    <directionalLight intensity={1} position={[5, 5, 5]} />
    <pointLight position={[10, 10, 10]} />
    <SculptableTorso />
    <OrbitControls />
  </Canvas>
);

export default App;