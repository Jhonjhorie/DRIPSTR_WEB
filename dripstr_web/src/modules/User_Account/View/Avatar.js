import React, { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import Sidebar from "../components/Sidebar";
import { SkeletonUtils } from "three-stdlib";

function Model({ scale }) {
  const { scene, nodes, materials } = useGLTF("/3d/scene.gltf");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  return (
    <group dispose={null}>
      <primitive object={clone} />
      {Object.keys(nodes).map((key) => {
        if (nodes[key].isSkinnedMesh) {
          return (
            <skinnedMesh
              key={key}
              geometry={nodes[key].geometry}
              material={materials[nodes[key].material.name]}
              skeleton={nodes[key].skeleton}
              scale={[scale.width, scale.height, 1]} // Adjust width and height dynamically
            />
          );
        }
        return null;
      })}
    </group>
  );
}

const Avatar = () => {
  const [scale, setScale] = useState({ width: 1, height: 1 }); // Initial scale state

  const handleScaleChange = (axis, value) => {
    setScale((prevScale) => ({ ...prevScale, [axis]: value }));
  };

  return (
    <div className="p-4 flex min-h-screen bg-slate-200">
      <Sidebar />
      <div className="flex-1 p-4 px-9">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">Edit Your Avatar</h1>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Avatar Controls */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-row justify-between  mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 ">
                Statistics
              </h2>
              <button className="align-text-top hover:text-gray-900">
                Edit
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Input BMI below to adjust your avatar's appearance.
            </p>

            {/* Width Control */}
            <div className="mb-4">
              <label className="block mb-2">Weight: (kg)</label>
              <input
                type="number"
                min="0.5"
                max="2"
                step="0.1"
                value={scale.width}
                onChange={(e) =>
                  handleScaleChange("width", parseFloat(e.target.value))
                }
                className="w-full p-2 border rounded bg-white text-gray-800"
              />
            </div>

            {/* Height Control */}
            <div className="mb-4">
              <label className="block mb-2">Height: (meters)</label>
              <input
                type="number"
                min="0.5"
                max="2"
                step="0.1"
                value={scale.height}
                onChange={(e) =>
                  handleScaleChange("height", parseFloat(e.target.value))
                }
                className="w-full p-2 border rounded bg-white text-gray-800"
              />
            </div>
          </div>

          {/* 3D Model Container */}
          <div className="w-full h-[500px] rounded-lg shadow-lg  bg-gray-100">
            <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight intensity={2} position={[0, 0, 1]} />
              <directionalLight intensity={2} position={[0, 1, 0]} />
              <directionalLight intensity={2} position={[1, 0, 0]} />

              <Suspense fallback={null}>
                <Model scale={[1, 2, 0.5]} /> {/* Pass scale as a prop */}
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  target={[0, 0.9, 0]}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
