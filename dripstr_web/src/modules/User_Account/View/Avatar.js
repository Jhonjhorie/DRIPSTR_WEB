import React, { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Plane } from "@react-three/drei";
import Sidebar from "../components/Sidebar";
import { SkeletonUtils } from "three-stdlib";

function Model({ scale }) {
  const gltf = useGLTF("/3d/scene.gltf");

  // Clone the entire scene and extract nodes and materials
  const clonedScene = useMemo(
    () => SkeletonUtils.clone(gltf.scene),
    [gltf.scene]
  );

  return (
    <group scale={[scale.width, scale.height, scale.width]} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

const Avatar = () => {
  const [scale, setScale] = useState({ width: 1, height: 1 }); // Applied scale state
  const [scaleInput, setScaleInput] = useState({ width: 1, height: 1 }); // Input state

  const handleInputChange = (axis, value) => {
    setScaleInput((prevInput) => ({ ...prevInput, [axis]: parseFloat(value) }));
  };

  const applyChanges = () => {
    setScale(scaleInput); // Apply the input values to the avatar's scale
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Statistics
            </h2>
            <p className="text-gray-600 mb-4">
              Input weight and height to adjust your avatar's appearance.
            </p>

            {/* Width Control */}
            <div className="mb-4">
              <label className="block mb-2">Weight: (kg)</label>
              <input
                type="number"
                min="0.5"
                max="2"
                step="0.1"
                value={scaleInput.width}
                onChange={(e) => handleInputChange("width", e.target.value)}
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
                value={scaleInput.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="w-full p-2 border rounded bg-white text-gray-800"
              />
            </div>

            <button
              onClick={applyChanges}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Apply Changes
            </button>
          </div>

          {/* 3D Model Container */}
          <div className="w-full h-[500px] rounded-lg shadow-lg bg-gray-100">
            <Canvas
              camera={{ position: [0, 1, 3], fov: 50 }}
              style={{
                background: "linear-gradient(to top, #1e3a8a, #3b82f6)", // Background gradient
              }}
            >
              <ambientLight intensity={0.5} />
              <hemisphereLight intensity={0.5} skyColor={0xffffff} groundColor={0x444444} />
              <directionalLight intensity={2} position={[2, 2, 2]} />
              {/* Add a platform */}
              <Suspense fallback={<div>Loading...</div>}>
                <Plane args={[5, 5]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <meshStandardMaterial color="lightgray" />
                </Plane>
                <Model scale={scale} />
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  target={[0, 1, 0]}
                  minPolarAngle={Math.PI / 2} // Prevents rotation up
                  maxPolarAngle={Math.PI / 2} // Prevents rotation down
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
