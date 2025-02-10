import React from 'react';
import { useGLTF } from '@react-three/drei';

const HairPreview = ({ url }) => {
  const { scene } = useGLTF(url);

  return <primitive object={scene} scale={0.5} />; // Adjust scale as needed
};

export default HairPreview;