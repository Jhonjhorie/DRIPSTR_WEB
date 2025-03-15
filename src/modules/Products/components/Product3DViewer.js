import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Environment, Html } from '@react-three/drei';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import * as THREE from 'three';
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { supabase } from '../../../constants/supabase';
import { bodyTypeURLs, hairURLs } from '../../../constants/avatarConfig';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from "react-router-dom";

// First, import all necessary URL configurations
import { 
  tshirURLs, 
  jerseyURLs, 
  longsleevesURLs,
  shortsURLs,
  pantsURLs,
  footwearsURLs,
  skirtURLs
} from '../../../constants/avatarConfig';

// Add these imports at the top
import AuthModal from '../../../shared/login/Auth';

const Model = ({ avatarData, productData, color }) => {
  const [error, setError] = useState(null);

  // Get correct model paths based on category
  const getModelURL = (category, gender, bodyType) => {
    const urlMaps = {
      'Tshirt': tshirURLs,
      'Jersey': jerseyURLs,
      'Longsleeves': longsleevesURLs,
      'Shorts': shortsURLs,
      'Pants': pantsURLs,
      'Skirt': skirtURLs,
      'Shoes': footwearsURLs?.[gender]?.Shoes,
      'Boots': footwearsURLs?.[gender]?.Boots1,
    };

    const urlMap = urlMaps[category];
    return urlMap?.[gender]?.[bodyType];
  };

  // Get avatar paths
  const avatarPath = avatarData?.gender && avatarData?.bodytype ? 
    bodyTypeURLs[avatarData.gender][avatarData.bodytype] : 
    bodyTypeURLs.Boy.Average;

  const productPath = avatarData?.gender && avatarData?.bodytype ? 
    getModelURL(productData?.item_Category, avatarData.gender, avatarData.bodytype) : 
    tshirURLs.Boy.Average;

  const shortsPath = avatarData?.gender && avatarData?.bodytype ? 
    shortsURLs[avatarData.gender][avatarData.bodytype] : 
    shortsURLs.Boy.Average;

  const hairPath = avatarData?.hair ? 
    hairURLs[avatarData.hair] : 
    hairURLs.Barbers;

  // Load models
  const { scene: avatarGLTF } = useGLTF(avatarPath);
  const { scene: productGLTF } = useGLTF(productPath);
  const { scene: shortsGLTF } = useGLTF(shortsPath);
  const { scene: hairGLTF } = useGLTF(hairPath);

  // Clone scenes
  const avatarScene = useMemo(() => SkeletonUtils.clone(avatarGLTF), [avatarGLTF]);
  const productScene = useMemo(() => SkeletonUtils.clone(productGLTF), [productGLTF]);
  const shortsScene = useMemo(() => SkeletonUtils.clone(shortsGLTF), [shortsGLTF]);
  const hairScene = useMemo(() => SkeletonUtils.clone(hairGLTF), [hairGLTF]);

  // Helper function to determine clothing category
  const getClothingCategory = (category) => {
    const categories = {
      tops: ['Tshirt', 'Jersey', 'Longsleeves'],
      bottoms: ['Pants', 'Shorts', 'Skirt'],
      footwear: ['Shoes', 'Boots']
    };

    return Object.entries(categories).find(([_, items]) => 
      items.includes(category))?.[0] || 'other';
  };

  // Get default top path for when trying on bottoms
  const defaultTopPath = avatarData?.gender && avatarData?.bodytype ? 
    tshirURLs[avatarData.gender][avatarData.bodytype] : 
    tshirURLs.Boy.Average;

  // Load default top for bottom wear
  const { scene: defaultTopGLTF } = useGLTF(defaultTopPath);
  const defaultTopScene = useMemo(() => 
    SkeletonUtils.clone(defaultTopGLTF), [defaultTopGLTF]
  );

  useEffect(() => {
    // Handle product texture and material
    if (productScene && productData?.texture_3D) {
      productScene.traverse((node) => {
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

    // Handle avatar material
    avatarScene.traverse((node) => {
      if (node.isMesh) {
        node.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(avatarData?.skincolor || '#f5c9a6'),
          roughness: 0.5,
          metalness: 0.2,
        });
      }
    });

    // Handle hair material
    hairScene.traverse((node) => {
      if (node.isMesh) {
        node.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(avatarData?.haircolor || '#000000'),
          roughness: 0.3,
          metalness: 0.1,
        });
      }
    });

    // Handle shorts material
    shortsScene.traverse((node) => {
      if (node.isMesh) {
        node.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#000000'),
          roughness: 0.7,
          metalness: 0.0,
        });
      }
    });

    // Handle default top material when showing bottoms
    if (getClothingCategory(productData?.item_Category) === 'bottoms') {
      defaultTopScene.traverse((node) => {
        if (node.isMesh) {
          node.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#FFFFFF'),
            roughness: 0.7,
            metalness: 0.0,
          });
        }
      });
    }
  }, [avatarScene, productScene, hairScene, shortsScene, defaultTopScene, color, productData, avatarData]);

  // Get position based on category
  const getPosition = (category) => {
    switch (category) {
      case 'Shoes':
      case 'Boots':
        return [0, -0.5, 0];
      default:
        return [0, 0, 0];
    }
  };

  if (error) {
    return <Html center><div className="text-red-500">Error loading model</div></Html>;
  }

  return (
    <group>
      <primitive object={avatarScene} scale={1} />
      <primitive object={hairScene} scale={1} />

      {/* Handle tops and bottoms rendering */}
      {getClothingCategory(productData?.item_Category) === 'tops' ? (
        <>
          <primitive 
            object={productScene} 
            scale={1} 
            position={getPosition(productData?.item_Category)} 
          />
          <primitive object={shortsScene} scale={1} />
        </>
      ) : getClothingCategory(productData?.item_Category) === 'bottoms' ? (
        <>
          <primitive 
            object={defaultTopScene} 
            scale={1} 
          />
          <primitive 
            object={productScene} 
            scale={1} 
            position={getPosition(productData?.item_Category)} 
          />
        </>
      ) : (
        <>
          <primitive 
            object={productScene} 
            scale={1} 
            position={getPosition(productData?.item_Category)} 
          />
          <primitive object={shortsScene} scale={1} />
        </>
      )}
    </group>
  );
};

// Helper function to determine clothing category
const getClothingCategory = (category) => {
  const categories = {
    tops: ['Tshirt', 'Jersey', 'Longsleeves'],
    bottoms: ['Pants', 'Shorts', 'Skirt'],
    footwear: ['Shoes', 'Boots']
  };

  return Object.entries(categories).find(([_, items]) => 
    items.includes(category))?.[0] || 'other';
};

// Add Platform component after the Model component
function Platform() {
  const geometry = useMemo(() => new THREE.CircleGeometry(15, 64), []);
  
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

// Add this new component after the Platform component
function RotatingGroup({ children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005; // Adjust speed by changing this value
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {children}
    </group>
  );
}

// Rename TshirtOnly to ProductMesh for better clarity
const ProductMesh = ({ productData, color }) => {
  const getModelURL = (category, gender = 'Boy', bodyType = 'Average') => {
    const urlMaps = {
      'Tshirt': tshirURLs,
      'Jersey': jerseyURLs,
      'Longsleeves': longsleevesURLs,
      'Shorts': shortsURLs,
      'Pants': pantsURLs,
      'Shoes': footwearsURLs?.[gender]?.Shoes,
      'Boots': footwearsURLs?.[gender]?.Boots1,
    };

    const urlMap = urlMaps[category];
    return urlMap?.[gender]?.[bodyType] || urlMaps['Tshirt'][gender][bodyType];
  };

  const modelURL = getModelURL(productData?.item_Category);
  const { scene: modelGLTF } = useGLTF(modelURL);
  const modelScene = useMemo(() => SkeletonUtils.clone(modelGLTF), [modelGLTF]);

  useEffect(() => {
    if (modelScene && productData?.texture_3D) {
      modelScene.traverse((node) => {
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
  }, [modelScene, color, productData]);

  // Adjust position based on category
  const getPosition = (category) => {
    switch (category) {
      case 'Shoes':
      case 'Boots':
        return [0, -0.5, 0];
      default:
        return [0, 0, 0];
    }
  };

  return (
    <primitive 
      object={modelScene} 
      scale={1} 
      position={getPosition(productData?.item_Category)} 
    />
  );
};

// Add this new component for camera controls
function CameraController({ viewMode, productData }) {
  const { camera } = useThree();
  const lastPosition = useRef({ x: 0, y: 25, z: 15 });

  useEffect(() => {
    const getClothingCategory = (category) => {
      const categories = {
        tops: ['Tshirt', 'Jersey', 'Longsleeves'],
        bottoms: ['Pants', 'Shorts', 'Skirt'],
        footwear: ['Shoes', 'Boots']
      };
      return Object.entries(categories).find(([_, items]) => 
        items.includes(category))?.[0] || 'other';
    };

    const cameraPositions = {
      tshirt: {
        tops: {
          position: { x: 0, y: 25, z: 15 },
          target: { x: 0, y: 16, z: 0 }
        },
        bottoms: {
          position: { x: 0, y: 25, z: 20 },
          target: { x: 0, y: 8, z: 0 }
        },
        footwear: {
          position: { x: 0, y: 5, z: 15 },
          target: { x: 0, y: 0, z: 0 }
        }
      },
      wear: {
        tops: {
          position: { x: 0, y: 100, z: 200 },
          target: { x: 0, y: 50, z: 0 }
        },
        bottoms: {
          position: { x: 0, y: 80, z: 200 },
          target: { x: 0, y: 30, z: 0 }
        },
        footwear: {
          position: { x: 0, y: 40, z: 200 },
          target: { x: 0, y: 10, z: 0 }
        }
      }
    };

    const category = getClothingCategory(productData?.item_Category);
    const targetPosition = cameraPositions[viewMode][category || 'tops'].position;
    const targetLookAt = cameraPositions[viewMode][category || 'tops'].target;

    // Animate camera position
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);
      },
      onComplete: () => {
        lastPosition.current = targetPosition;
      }
    });

  }, [viewMode, camera, productData]);

  return null;
}

// Add this near the top with other state declarations
const defaultAvatarData = {
  gender: 'Boy',
  bodytype: 'Average',
  skincolor: '#f5c9a6',
  haircolor: '#000000',
  hair: 'Barbers'
};

// Modify the main Product3DViewer component
const Product3DViewer = ({ category, onClose, className, selectedColor, productData }) => {
  const navigate = useNavigate();
  const [avatarData, setAvatarData] = useState(null);
  const [viewMode, setViewMode] = useState('tshirt'); // 'tshirt' or 'wear'
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Add this function to handle avatar button click
  const handleAvatarClick = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      setShowAuthModal(true);
    } else {
      navigate('/account/avatar');
    }
  };

  // Modify the useEffect for fetching avatar data
  useEffect(() => {
    const fetchAvatarData = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user?.id) {
        // Use default avatar data if not logged in
        setAvatarData(defaultAvatarData);
        return;
      }

      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('account_id', session.session.user.id)
        .single();

      if (error) {
        console.error('Error fetching avatar:', error);
        // Fallback to default avatar data on error
        setAvatarData(defaultAvatarData);
        return;
      }

      setAvatarData(data || defaultAvatarData);
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
      {/* Improved layered background */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'radial-gradient(circle at 50% 50%, #141e30 0%, #060606 100%)',
          opacity: 1
        }} 
      />
      {/* Accent gradient layer */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, rgba(20, 30, 48, 0.5) 0%, rgba(36, 59, 85, 0.1) 100%)',
          mixBlendMode: 'soft-light'
        }} 
      />
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '-1px -1px'
        }} 
      />
      
      {/* View mode and Avatar buttons */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setViewMode('tshirt')}
          className={`px-3 py-2 text-sm rounded-full shadow-lg transition-all duration-300 ${
            viewMode === 'tshirt' 
              ? 'bg-slate-800 text-white' 
              : 'bg-white/90 text-slate-800 hover:bg-white'
          } border border-slate-400 hover:border-slate-800`}
        >
          View
        </button>
        <button
          onClick={() => setViewMode('wear')}
          className={`px-3 py-2 text-sm rounded-full shadow-lg transition-all duration-300 ${
            viewMode === 'wear' 
              ? 'bg-slate-800 text-white' 
              : 'bg-white/90 text-slate-800 hover:bg-white'
          } border border-slate-400 hover:border-slate-800`}
        >
          Try On
        </button>
           
       </div>
       <button
            onClick={handleAvatarClick}
            className="absolute bottom-2 left-4 px-3 py-2 text-sm rounded-full shadow-lg transition-all duration-300 
              bg-purple-600 text-white hover:bg-purple-700 border border-purple-400 
              flex items-center gap-2 z-50 "
          >
            <i className="fas fa-user-circle"></i>
            Go to Avatar
          </button>
      {/* Add AuthModal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionLog="login"
      />

      {/* 3D Canvas */}
      <div className={className}>
        <Canvas 
            camera={{ 
              position: viewMode === 'tshirt' 
                ? [0, 25, 0]  // Closer and lower for t-shirt
                : [0, 50, 200]  // Higher and further for avatar
            }}
            style={{ 
              background: 'transparent',
              boxShadow: 'inset 0 0 150px rgba(20, 30, 48, 0.95)'
            }} 
        > 
          
          <Suspense fallback={<LoadingSpinner />}>
            <ambientLight intensity={0.4} />
            <hemisphereLight 
              intensity={0.5}
              color="#ffffff"
              groundColor="#141e30"
            />
            <directionalLight
              castShadow
              position={[2, 4, 1]}
              intensity={1.0}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <spotLight
              position={[-2, 4, -1]}
              intensity={0.3}
              angle={0.5}
              penumbra={1}
              color="#4a6fa1"
            />
            
            <CameraController viewMode={viewMode} productData={productData} />
            
            <RotatingGroup>
              <Platform />
              {viewMode === 'tshirt' ? (
                <ProductMesh 
                  productData={productData}
                  color={getColorValue(selectedColor?.variant_Name)}
                />
              ) : (
                <Model 
                  avatarData={avatarData || defaultAvatarData}
                  productData={productData}
                  color={getColorValue(selectedColor?.variant_Name)}
                />
              )}
            </RotatingGroup>

            <Environment preset="city" />
          </Suspense>
          
          <OrbitControls 
            target={[0, 
              getClothingCategory(productData?.item_Category) === 'bottoms' ? 8 : 
              getClothingCategory(productData?.item_Category) === 'footwear' ? 0 : 
              viewMode === 'tshirt' ? 25 : 20, 
              0
            ]}
            minPolarAngle={viewMode === 'tshirt' ? Math.PI / 4 : 0}
            maxPolarAngle={Math.PI}
            minDistance={
              getClothingCategory(productData?.item_Category) === 'footwear' ? 5 :
              viewMode === 'tshirt' ? 10 : 16
            }
            maxDistance={
              getClothingCategory(productData?.item_Category) === 'footwear' ? 20 :
              viewMode === 'tshirt' ? 30 : 30
            }
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
  <Html center position={[0, 0, 0]} style={{ transform: 'translate3d(-50%, -50%, 0)' }}>
    <div className="text-slate-400 flex items-center justify-center pb-52">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl" />
    </div>
  </Html>
);
export default Product3DViewer;