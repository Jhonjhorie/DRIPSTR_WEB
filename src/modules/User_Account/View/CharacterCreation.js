import React, { useState, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import { bodyTypeURLs, hairURLs, tshirURLs, shortsURLs } from "../../../constants/avatarConfig";
import Toast from '../../../shared/alerts';
import * as THREE from 'three';

function Part({ url, position, color }) {
  const gltf = useGLTF(url);
  const clonedScene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);

  useMemo(() => {
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
        node.material.color.set(color || "#ffffff");
      }
    });
  }, [clonedScene, color]);

  return <primitive object={clonedScene} position={position} />;
}

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

function RotatingGroup({ children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {children}
    </group>
  );
}

const CharacterCustomization = () => {
  const [gender, setGender] = useState("Boy");
  const [selectedBodyType, setSelectedBodyType] = useState("Average");
  const [selectedHair, setSelectedHair] = useState(null);
  const [skincolor, setSkinColor] = useState("#f5c9a6");
  const [haircolor, setHairColor] = useState("#000000");
  const [name, setName] = useState("");
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const navigate = useNavigate();

  useEffect(() => {
    const defaultHairKey = Object.keys(hairURLs)[0];
    setSelectedHair(defaultHairKey);
  }, []);

  const currentBody = useMemo(() => {
    return bodyTypeURLs[gender][selectedBodyType];
  }, [gender, selectedBodyType]);

  const handleSave = async () => {
    try {
      const { data: session, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setToast({
          show: true,
          message: "Unable to save character. Please try again.",
          type: 'error'
        });
        return;
      }

      const account_ID = session?.session?.user?.id;

      if (!account_ID) {
        setToast({
          show: true,
          message: "User not authenticated.",
          type: 'error'
        });
        return;
      }

      if (!selectedHair) {
        setToast({
          show: true,
          message: "Please complete all required fields before saving.",
          type: 'warning'
        });
        return;
      }

      const characterData = {
        gender,
        bodytype: selectedBodyType,
        hair: selectedHair,
        skincolor,
        haircolor,
        account_id: account_ID,
      };

      const { data, error } = await supabase.from("avatars").insert([characterData]);

      if (error) {
        setToast({
          show: true,
          message: "Failed to save character. Please try again.",
          type: 'error'
        });
        return;
      }

      setToast({
        show: true,
        message: "Character created successfully!",
        type: 'success'
      });

      // Redirect after successful creation
      setTimeout(() => {
        navigate("/account/avatar");
      }, 2000);

    } catch (error) {
      setToast({
        show: true,
        message: "An unexpected error occurred. Please try again.",
        type: 'error'
      });
    }
  };

  return (
    // Remove min-h-screen since header is already taking up space
    <div className="bg-base-200">
      {/* Main Content - subtract header height */}
      <div className="hero h-[calc(100vh-5rem)] py-5"> {/* Adjusted height and padding */}
        <div className="card w-full max-w-6xl bg-base-100 shadow-xl">
          <div className="card-body p-4"> {/* Reduced padding */}
            {/* Toast Notification */}
            {toast.show && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ show: false, message: '', type: 'info' })}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> {/* Reduced gap */}
              {/* Left Side - 3D Preview - Adjusted height */}
              <div className="h-[calc(100vh-12rem)] rounded-lg overflow-hidden shadow-lg">
                <div className="relative w-full h-full">
                  <Canvas 
                    camera={{ 
                      position: [0, 50, 150],
                      fov: 45,
                      near: 0.1,
                      far: 1000
                    }}
                    shadows
                    style={{ background: "linear-gradient(to top, #1e3a8a, #3b82f6)" }}
                  >
                    <ambientLight intensity={0.8} />
                    <hemisphereLight intensity={1} />
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
                    
                    <RotatingGroup>
                      <Platform />
                      {selectedHair && hairURLs[selectedHair] && (
                        <Part 
                          url={hairURLs[selectedHair]} 
                          position={[0, 0, 0]} 
                          color={haircolor} 
                        />
                      )}
                      <Part 
                        url={currentBody} 
                        position={[0, 0, 0]} 
                        color={skincolor} 
                      />
                      {/* Add default clothes */}
                      <Part 
                        url={tshirURLs[gender][selectedBodyType]} 
                        position={[0, 0, 0]}
                        color="#ffffff"
                      />
                      <Part 
                        url={shortsURLs[gender][selectedBodyType]} 
                        position={[0, 0, 0]}
                        color="#000000"
                      />
                    </RotatingGroup>

                    <Environment preset="city" />
                    <OrbitControls 
                        target={[0, 15, 0]}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI}
                        minDistance={10}
                        maxDistance={70}
                        enablePan={true}
                        panSpeed={0.5}
                        rotateSpeed={0.5}
                        enableDamping={true}
                        dampingFactor={0.05}
                    />
                  </Canvas>
                </div>
              </div>

              {/* Right Side - Controls - Added overflow-y-auto */}
              <div className="space-y-4 h-[calc(100vh-12rem)] overflow-y-auto">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-4">Create Your Avatar</h2>

                    {/* Gender Selection */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">Gender</span>
                      </label>
                      <select
                        className="select select-primary w-full"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="Boy">Men</option>
                        <option value="Girl">Woman</option>
                      </select>
                    </div>

                    {/* Body Type Selection */}
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">Body Type</span>
                      </label>
                      <select
                        className="select select-primary w-full"
                        value={selectedBodyType}
                        onChange={(e) => setSelectedBodyType(e.target.value)}
                      >
                        {Object.keys(bodyTypeURLs[gender]).map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Skin Color Selection */}
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">Skin Tone</span>
                      </label>
                      <div className="flex gap-4">
                        {[
                          { label: "Bright", color: "" },
                          { label: "Light", color: "#f5c9a6" },
                          { label: "Medium", color: "#d2a77d" },
                          { label: "Tan", color: "#a67c5b" },
                          { label: "Dark", color: "#67442e" },
                        ].map((option) => (
                          <button
                            key={option.color}
                            className={`w-12 h-12 rounded-full transition-all ${
                              skincolor === option.color 
                                ? 'ring-4 ring-primary ring-offset-2' 
                                : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: option.color }}
                            onClick={() => setSkinColor(option.color)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Hair Style Selection */}
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">Hair Style</span>
                      </label>
                      <select
                        className="select select-primary w-full"
                        value={selectedHair}
                        onChange={(e) => setSelectedHair(e.target.value)}
                      >
                        {Object.entries(hairURLs).map(([key]) => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                    </div>

                    {/* Hair Color Selection */}
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text text-gray-700 font-medium">Hair Color</span>
                      </label>
                      <input
                        type="color"
                        className="w-24 h-12 cursor-pointer rounded"
                        value={haircolor}
                        onChange={(e) => setHairColor(e.target.value)}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="card-actions justify-end mt-8 gap-4">
                      <button
                        className="btn btn-ghost"
                        onClick={() => navigate("/account/Avatar")}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleSave}
                      >
                        Create Avatar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization;
