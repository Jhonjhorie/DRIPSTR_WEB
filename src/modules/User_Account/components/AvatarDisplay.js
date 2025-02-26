import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

const AvatarDisplay = ({ avatarUrl }) => {
  const { scene } = useGLTF(avatarUrl);

  return (
    <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls />
      <Environment preset="sunset" />
      <primitive object={scene} scale={1} />
    </Canvas>
  );
};

export default AvatarDisplay;
