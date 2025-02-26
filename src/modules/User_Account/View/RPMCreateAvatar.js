import React, { useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { TextureLoader, RepeatWrapping, NearestFilter } from "three";
import { SkeletonUtils } from "three-stdlib";

const TShirtPreview = ({ textureUrl }) => {
  const gltf = useGLTF("/3d/uvmap/untitled.glb"); // Update with the correct model path
  const clonedScene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);

  useEffect(() => {
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
        if (textureUrl) {
          const texture = new TextureLoader().load(textureUrl, (tex) => {
            tex.wrapS = tex.wrapT = RepeatWrapping;
            tex.minFilter = NearestFilter;
            node.material.map = tex;
            node.material.needsUpdate = true;
            node.material.map.flipY = false; // Sometimes textures get flipped
            node.material.map.needsUpdate = true;
          });
        }
      }
    });
  }, [clonedScene, textureUrl]);

  return <primitive object={clonedScene} position={[0, -1, 0]} />;
};

const TShirtTexturePreview = () => {
  return (
    <div className="p-4 flex min-h-screen bg-gray-200 justify-center items-center">
      <div className="w-full max-w-2xl h-[500px] rounded-lg shadow-lg bg-white">
    <Canvas camera={{ position: [0, 100, 200] }}>
          <ambientLight intensity={0.8} />
          <directionalLight intensity={1} position={[1, 1, 1]} />
          <TShirtPreview textureUrl="/3d/uvmap/Tshirt_for_Genesis.png" />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default TShirtTexturePreview;
