import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Environment, Html } from '@react-three/drei';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faSpinner } from "@fortawesome/free-solid-svg-icons";
import * as THREE from 'three';

const Model = ({ category, color }) => {
  const [error, setError] = useState(null);

  const modelPaths = {
    tshirt: '/3d/wears/guyz/tshirts/Average_Tshirt.glb',
    longsleeve: '/3d/wears/guyz/longsleeve/medium.glb',
    sando: '/3d/wears/guyz/sando/medium.glb'
  };

  const modelPath = modelPaths[category?.toLowerCase()] || modelPaths.tshirt;
  const { scene } = useGLTF(modelPath);

  // Update material color when color prop changes
  useEffect(() => {
    if (scene && color) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // Create a new material with the selected color
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.7,
            metalness: 0.0
          });
        }
      });
    }
  }, [scene, color]);

  if (error) {
    return (
      <Html center>
        <div className="text-red-500">Error loading model</div>
      </Html>
    );
  }

  return <primitive object={scene} scale={1} />;
};

const LoadingSpinner = () => (
  <Html center>
    <div className="text-slate-400">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
    </div>
  </Html>
);

const Product3DViewer = ({ category, onClose, className, selectedColor }) => {
  // Convert the color name or hex to a valid THREE.js color
  const getColorValue = (colorName) => {
    // Add your color mapping here
    const colorMap = {
      'white': '#FFFFFF',
      'black': '#000000',
      'red': '#FF0000',
      'blue': '#0000FF',
      // Add more color mappings as needed
    };
    
    return colorMap[colorName?.toLowerCase()] || colorName || '#FFFFFF';
  };

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Stage environment="city" intensity={0.5}>
            <Model 
              category={category} 
              color={getColorValue(selectedColor?.variant_Name)}
            />
          </Stage>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}  
        />
      </Canvas>
    </div>
  );
};

export default Product3DViewer;