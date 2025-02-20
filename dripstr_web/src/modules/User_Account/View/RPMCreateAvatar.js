
import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import { bodyTypeURLs, hairURLs, tshirURLs, shortsURLs } from "../../../constants/avatarConfig";
import { TextureLoader } from "three";

function Part({ url, position, color, textureUrl }) {
  const gltf = useGLTF(url);
  const clonedScene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);

  useMemo(() => {
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
        if (color) {
          node.material.color.set(color);
        }
        if (textureUrl) {
          const texture = new TextureLoader().load(textureUrl);
          texture.flipY = false; // Ensure the texture is not flipped (if needed)
          node.material.map = texture;
          node.material.needsUpdate = true;
        }
      }
    });
  }, [clonedScene, color, textureUrl]);

  return <primitive object={clonedScene} position={position} />;
}

const CharacterCustomization = () => {
  const [gender, setGender] = useState("Boy");
  const [selectedBodyType, setSelectedBodyType] = useState("Average");
  const [selectedHair, setSelectedHair] = useState(null);
  const [skincolor, setSkinColor] = useState("#f5c9a6");
  const [haircolor, setHairColor] = useState("#000000");    

  const getTShirtURL = () => {
    return tshirURLs[gender][selectedBodyType] || null;
  };

  const getShortsURL = () => {
    return shortsURLs[gender][selectedBodyType] || null;
  };

  return (
    <div className="p-4 flex min-h-screen bg-slate-200">

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
                {getTShirtURL() && (
                  <Part url={getTShirtURL()} position={[0, 0, 0]} textureUrl="/3d/uvmap/TexturedMESH.png" />
                )}
                {getShortsURL() && <Part url={getShortsURL()} position={[0, 0, 0]} />}
              </group>
              <OrbitControls target={[0, 110, 0]} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization;
