import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Environment, Html } from '@react-three/drei';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import * as THREE from 'three';
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { supabase } from '../../../constants/supabase';
import { bodyTypeURLs, tshirURLs, shortsURLs, hairURLs } from '../../../constants/avatarConfig';
import { useRef } from 'react';
import { gsap } from 'gsap';

const Model = ({ avatarData, productData, color }) => {
  const [error, setError] = useState(null);

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

  // Load models using GLTF
  const { scene: avatarGLTF } = useGLTF(avatarPath);
  const { scene: tshirtGLTF } = useGLTF(tshirtPath);
  const { scene: shortsGLTF } = useGLTF(shortsPath);
  const { scene: hairGLTF } = useGLTF(hairPath);

  // Clone scenes for independent material manipulation
  const avatarScene = useMemo(() => SkeletonUtils.clone(avatarGLTF), [avatarGLTF]);
  const tshirtScene = useMemo(() => SkeletonUtils.clone(tshirtGLTF), [tshirtGLTF]);
  const shortsScene = useMemo(() => SkeletonUtils.clone(shortsGLTF), [shortsGLTF]);
  const hairScene = useMemo(() => SkeletonUtils.clone(hairGLTF), [hairGLTF]);

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
  }, [avatarScene, tshirtScene, hairScene, shortsScene, color, productData, avatarData]);

  if (error) {
    return <Html center><div className="text-red-500">Error loading model</div></Html>;
  }

  return (
    <group>
      <primitive object={avatarScene} scale={1} />
      <primitive object={tshirtScene} scale={1} />
      <primitive object={shortsScene} scale={1} />
      <primitive object={hairScene} scale={1} />
    </group>
  );
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

// Add this new component for showing only the t-shirt
const TshirtOnly = ({ productData, color }) => {
  const { scene: tshirtGLTF } = useGLTF(tshirURLs.Boy.Average);
  const tshirtScene = useMemo(() => SkeletonUtils.clone(tshirtGLTF), [tshirtGLTF]);

  useEffect(() => {
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
  }, [tshirtScene, color, productData]);

  return (
    <primitive object={tshirtScene} scale={1} position={[0, 0, 0]} />
  );
};

// Add this new component for camera controls
function CameraController({ viewMode }) {
  const { camera } = useThree();

  useEffect(() => {
    const cameraPositions = {
      tshirt: {
        position: { x: 0, y: 25, z: 15 },
        target: { x: 0, y: 16, z: 0 }
      },
      wear: {
        position: { x: 0, y: 100, z: 200 },
        target: { x: 0, y: 50, z: 0 }
      }
    };

    const targetPosition = cameraPositions[viewMode].position;
    const targetLookAt = cameraPositions[viewMode].target;

    // Animate camera position
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);
      }
    });

  }, [viewMode, camera]);

  return null;
}

// Modify the main Product3DViewer component
const Product3DViewer = ({ category, onClose, className, selectedColor, productData }) => {
  const [avatarData, setAvatarData] = useState(null);
  const [viewMode, setViewMode] = useState('tshirt'); // 'tshirt' or 'wear'

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
      
      {/* Add view mode toggle buttons */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setViewMode('tshirt')}
          className={`px-3 py-2 text-sm rounded-full shadow-lg transition-all duration-300 ${
            viewMode === 'tshirt' 
              ? 'bg-slate-800 text-white' 
              : 'bg-white/90 text-slate-800 hover:bg-white'
          } border border-slate-400 hover:border-slate-800`}
        >
          View T-shirt
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
            
            <CameraController viewMode={viewMode} />
            
            <RotatingGroup>
              <Platform />
              {viewMode === 'tshirt' ? (
                <TshirtOnly 
                  productData={productData}
                  color={getColorValue(selectedColor?.variant_Name)}
                />
              ) : (
                <Model 
                  avatarData={avatarData}
                  productData={productData}
                  color={getColorValue(selectedColor?.variant_Name)}
                />
              )}
            </RotatingGroup>

            <Environment preset="city" />
          </Suspense>
          
          <OrbitControls 
              target={[0, viewMode === 'tshirt' ? 25 : 20, 0]} // Adjust target height
              minPolarAngle={viewMode === 'tshirt' ? Math.PI / 4 : 0} // Limit minimum angle for t-shirt
              maxPolarAngle={viewMode === 'tshirt' ? Math.PI / 1.5 : Math.PI} // Limit maximum angle for t-shirt
              minDistance={viewMode === 'tshirt' ? 10 : 16} // Closer minimum distance for t-shirt
              maxDistance={viewMode === 'tshirt' ? 30 : 30} // Shorter maximum distance for t-shirt
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