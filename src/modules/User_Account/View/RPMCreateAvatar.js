import React, { useState, useEffect, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TextureLoader } from "three";
import Sidebar from "../components/Sidebar";
import { bodyTypeURLs, hairURLs, tshirURLs, shortsURLs } from "../../../constants/avatarConfig";

function Part({ url, position, color, textureUrl, isObj = false }) {
  console.log("Texture URL:", textureUrl); // Debugging: Check the textureUrl value

  const objScene = useLoader(OBJLoader, isObj ? url : null); // Load OBJ file if isObj is true
  const { scene: gltfScene } = useGLTF(isObj ? null : url); // Load GLTF file if isObj is false
  const scene = useMemo(() => (isObj ? objScene : SkeletonUtils.clone(gltfScene)), [isObj, objScene, gltfScene]);

  // Load texture only if textureUrl is provided
  const texture = useLoader(TextureLoader, textureUrl || "");

  useEffect(() => {
    if (!scene || !texture) return;

    scene.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
        node.material.map = texture;
        node.material.needsUpdate = true;
      }
    });
  }, [scene, texture]);

  return <primitive object={scene} position={position} />;
}

const CharacterCustomization = () => {
  const [gender, setGender] = useState("Boy");
  const [selectedBodyType, setSelectedBodyType] = useState("Average");
  const [selectedHair, setSelectedHair] = useState(null);
  const [skincolor, setSkinColor] = useState("#f5c9a6");
  const [haircolor, setHairColor] = useState("#000000");

  const getTShirtURL = useMemo(() => tshirURLs[gender][selectedBodyType] || null, [gender, selectedBodyType]);
  const getShortsURL = useMemo(() => shortsURLs[gender][selectedBodyType] || null, [gender, selectedBodyType]);

  return (
    <div className="p-4 flex min-h-screen bg-slate-200">
      <Sidebar
        gender={gender}
        setGender={setGender}
        selectedBodyType={selectedBodyType}
        setSelectedBodyType={setSelectedBodyType}
        selectedHair={selectedHair}
        setSelectedHair={setSelectedHair}
        skincolor={skincolor}
        setSkinColor={setSkinColor}
        haircolor={haircolor}
        setHairColor={setHairColor}
      />
      <div className="p-4 flex-1">
        <div className="grid md:grid-cols-1">
          <div className="flex-1 h-[500px] rounded-lg shadow-lg bg-gray-100">
            <Canvas
              camera={{ position: [0, -20, 120] }}
              style={{ background: "linear-gradient(to top, #1e3a8a, #3b82f6)" }}
            >
              <ambientLight intensity={0.8} />
              <hemisphereLight intensity={1} />
              <directionalLight intensity={1.2} position={[0, 0, 1]} />
              <group>
                {selectedHair && hairURLs[selectedHair] && (
                  <Part url={hairURLs[selectedHair]} position={[0, 0.85, 0]} color={haircolor} />
                )}
                <Part url={bodyTypeURLs[gender][selectedBodyType]} position={[0, 0, 0]} color={skincolor} />
                {getTShirtURL && (
                  <Part url={getTShirtURL} position={[0, 0, 0]} textureUrl="/3d/uvmap/tshirtUV.png" />
                )}
                {getShortsURL && <Part url={getShortsURL} position={[0, 0, 0]} />}
              </group>
              <OrbitControls
                target={[0, 110, 0]}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization;