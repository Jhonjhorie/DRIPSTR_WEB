import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Environment, Html } from '@react-three/drei';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import * as THREE from 'three';
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { supabase } from '../../../constants/supabase';
import {  tshirURLs } from '../../../constants/avatarConfig';

const Model = ({ avatarData, productData, color }) => {
  const [error, setError] = useState(null);

  // Get correct model paths from avatar config
 

  const tshirtPath = avatarData?.gender && avatarData?.bodytype ? 
    tshirURLs[avatarData.gender][avatarData.bodytype] : 
    tshirURLs.Boy.Average;
 
  
  // Load models using GLTF
   const { scene: tshirtGLTF } = useGLTF(tshirtPath); 

  // Clone scenes for independent material manipulation
   const tshirtScene = useMemo(() => SkeletonUtils.clone(tshirtGLTF), [tshirtGLTF]);

  useEffect(() => {
    // Handle T-shirt texture and material
    if (tshirtScene && productData?.texture_3D) {
      tshirtScene.traverse((node) => {
        if (node.isMesh) {
          node.material = node.material.clone();
          const texture = new TextureLoader().load(productData.texture_3D, (tex) => {
            tex.wrapS = tex.wrapT = RepeatWrapping;
            tex.minFilter = NearestFilter;
            node.material.map = tex;
            node.material.color = new THREE.Color(color);
            node.material.roughness = 0.7;
            node.material.metalness = 0.0;
            node.material.needsUpdate = true;
            node.material.map.flipY = false;
            node.material.map.needsUpdate = true;
          });
        }
      });
    }

 
 
  }, [  tshirtScene, color, productData, avatarData]);

  if (error) {
    return <Html center><div className="text-red-500">Error loading model</div></Html>;
  }

  return (
        <primitive object={tshirtScene} scale={1} />
   );
};

// Add Platform component after the Model component
function Platform() {
  const geometry = useMemo(() => new THREE.CircleGeometry(100, 64), []);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color="#202020"
        metalness={0.2}
        roughness={0.5}
        opacity={0.7}
        transparent
      />
    </mesh>
  );
}

const Product3DViewer = ({ category, onClose, className, selectedColor, productData }) => {
  const [avatarData, setAvatarData] = useState(null);

  useEffect(() => {
    const fetchAvatarData = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return;

      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('account_id', session.session.user.id)
        .single();

      if (error) {
        console.error('Error fetching avatar:', error);
        return;
      }

      setAvatarData(data);
    };

    fetchAvatarData();
  }, []);

  const getColorValue = (colorName) => {
    const colorMap = {
      'white': '#FFFFFF',
      'black': '#000000',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'gray': '#808080',
      'cyan': '#00FFFF',
      'magenta': '#FF00FF',
      'lime': '#00FF00',
      'maroon': '#800000',
      'navy': '#000080',
      'olive': '#808000',
      'teal': '#008080',
      'violet': '#EE82EE',
      'gold': '#FFD700',
      'silver': '#C0C0C0',
      'beige': '#F5F5DC',
      'coral': '#FF7F50',
      'indigo': '#4B0082',
      'turquoise': '#40E0D0',
    };
    return colorMap[colorName?.toLowerCase()] || colorName || '#FFFFFF';
  };

  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80"
        style={{ 
          backgroundImage: "url('/3d/canvasBG/Closet.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(30%) blur(4px)",
         }} 
      />
      
      {/* 3D Canvas */}
      <div className={className}>
        <Canvas 
          camera={{ position: [0, 200, 200],  }}
          style={{ width: '100%', height: '100%' }}
          shadows
        > 
          <Suspense fallback={<LoadingSpinner />}>
            {/* Lights */}
            <ambientLight intensity={0.4} />
            <hemisphereLight intensity={0.7} />
            <directionalLight
              castShadow
              position={[2, 4, 1]}
              intensity={1.5}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <spotLight
              position={[-2, 4, -1]}
              intensity={0.5}
              angle={0.5}
              penumbra={1}
            />
            
            <group position={[0, 0, 0]}>
               <Model 
                avatarData={avatarData}
                productData={productData}
                color={getColorValue(selectedColor?.variant_Name)}
              />
            </group>

            <Environment preset="city" />
          </Suspense>
          
          <OrbitControls 
            target={[0,120,0]}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={2}
            minDistance={25}
            maxDistance={100}
          />
        </Canvas>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <Html center>
    <div className="text-slate-400">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
    </div>
  </Html>
);

export default Product3DViewer;