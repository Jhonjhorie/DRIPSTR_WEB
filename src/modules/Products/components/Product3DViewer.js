import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Environment, Html } from '@react-three/drei';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import * as THREE from 'three';
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { supabase } from '../../../constants/supabase';
import { bodyTypeURLs, tshirURLs, shortsURLs, hairURLs } from '../../../constants/avatarConfig';

const Model = ({ avatarData, productData, color }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get correct model paths from avatar config
  const avatarPath = avatarData?.gender && avatarData?.bodytype ? 
    bodyTypeURLs[avatarData.gender][avatarData.bodytype] : 
    bodyTypeURLs.Boy.Average;

  const tshirtPath = avatarData?.gender && avatarData?.bodytype ? 
    tshirURLs[avatarData.gender][avatarData.bodytype] : 
    tshirURLs.Boy.Average;

  const shortsPath = avatarData?.gender && avatarData?.bodytype ? 
    shortsURLs[avatarData.gender][avatarData.bodytype] : 
    shortsURLs.Boy.Average;

  const hairPath = avatarData?.hair ? 
    hairURLs[avatarData.hair] : 
    hairURLs.Barbers;

  // Load models with error handling
  const avatarGLTF = useGLTF(avatarPath, undefined, (error) => {
    console.error('Error loading avatar model:', error);
    setError(error);
  });

  const tshirtGLTF = useGLTF(tshirtPath, undefined, (error) => {
    console.error('Error loading tshirt model:', error);
    setError(error);
  });

  const shortsGLTF = useGLTF(shortsPath, undefined, (error) => {
    console.error('Error loading shorts model:', error);
    setError(error);
  });

  const hairGLTF = useGLTF(hairPath, undefined, (error) => {
    console.error('Error loading hair model:', error);
    setError(error);
  });

  // Clone scenes with error handling
  const scenes = useMemo(() => {
    try {
      return {
        avatarScene: SkeletonUtils.clone(avatarGLTF.scene),
        tshirtScene: SkeletonUtils.clone(tshirtGLTF.scene),
        shortsScene: SkeletonUtils.clone(shortsGLTF.scene),
        hairScene: SkeletonUtils.clone(hairGLTF.scene)
      };
    } catch (error) {
      console.error('Error cloning scenes:', error);
      setError(error);
      return null;
    }
  }, [avatarGLTF, tshirtGLTF, shortsGLTF, hairGLTF]);

  useEffect(() => {
    if (!scenes) return;

    try {
      // Handle T-shirt texture and material
      if (scenes.tshirtScene && productData?.texture_3D) {
        scenes.tshirtScene.traverse((node) => {
          if (node.isMesh) {
            node.material = node.material.clone();
            const textureLoader = new TextureLoader();
            textureLoader.load(
              productData.texture_3D,
              (tex) => {
                tex.wrapS = tex.wrapT = RepeatWrapping;
                tex.minFilter = NearestFilter;
                node.material.map = tex;
                node.material.color = new THREE.Color(color);
                node.material.roughness = 0.7;
                node.material.metalness = 0.0;
                node.material.needsUpdate = true;
                node.material.map.flipY = false;
                node.material.map.needsUpdate = true;
                setLoading(false);
              },
              undefined,
              (error) => {
                console.error('Error loading texture:', error);
                setError(error);
              }
            );
          }
        });
      }

      // Handle avatar material
      scenes.avatarScene.traverse((node) => {
        if (node.isMesh) {
          node.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(avatarData?.skincolor || '#f5c9a6'),
            roughness: 0.5,
            metalness: 0.2,
          });
        }
      });

      // Handle hair material
      scenes.hairScene.traverse((node) => {
        if (node.isMesh) {
          node.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(avatarData?.haircolor || '#000000'),
            roughness: 0.3,
            metalness: 0.1,
          });
        }
      });

      // Handle shorts material
      scenes.shortsScene.traverse((node) => {
        if (node.isMesh) {
          node.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#000000'),
            roughness: 0.7,
            metalness: 0.0,
          });
        }
      });
    } catch (error) {
      console.error('Error updating materials:', error);
      setError(error);
    }
  }, [scenes, color, productData, avatarData]);

  if (error) {
    return (
      <Html center>
        <div className="text-red-500 bg-white p-2 rounded">
          Error loading model. Please try refreshing the page.
        </div>
      </Html>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <group>
      <primitive object={scenes?.avatarScene} scale={1} />
      <primitive object={scenes?.tshirtScene} scale={1} />
      <primitive object={scenes?.shortsScene} scale={1} />
      <primitive object={scenes?.hairScene} scale={1} />
    </group>
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
        camera={{ position: [0, 100, 200], fov: 75 }}
        shadows
        onError={(error) => {
          console.error('Canvas error:', error);
        }}
        fallback={<LoadingSpinner />}
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
              <Platform />
              <Model 
                avatarData={avatarData}
                productData={productData}
                color={getColorValue(selectedColor?.variant_Name)}
              />
            </group>

            <Environment preset="city" />
          </Suspense>
          
          <OrbitControls 
            target={[0, 80, 0]}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            minDistance={80}
            maxDistance={300}
            enablePan={true}
            panSpeed={0.5}
            rotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <Html center>
    <div className="bg-black bg-opacity-50 p-4 rounded-lg text-white flex items-center space-x-2">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
      <span>Loading 3D Model...</span>
    </div>
  </Html>
);

export default Product3DViewer;