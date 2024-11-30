import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

const Avatar = ({ faceShape, skinColor, hairStyle, hairColor, accessory }) => {
  return (
    <group>
      {/* Face */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={faceShape === "round" ? [1, 32, 32] : [1.2, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Hair */}
      {hairStyle !== "bald" && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}

      {/* Accessory */}
      {accessory === "glasses" && (
        <mesh position={[0, 1, 1]}>
          <torusGeometry args={[1.1, 0.05, 16, 100]} />
          <meshStandardMaterial color="black" />
        </mesh>
      )}
      {accessory === "hat" && (
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />
          <meshStandardMaterial color="brown" />
        </mesh>
      )}
    </group>
  );
};

const CreateAvatar3D = () => {
  const [faceShape, setFaceShape] = useState("round");
  const [skinColor, setSkinColor] = useState("#ffcc99");
  const [hairStyle, setHairStyle] = useState("short");
  const [hairColor, setHairColor] = useState("#000000");
  const [accessory, setAccessory] = useState("none");

  const faceShapes = ["round", "oval", "square"];
  const skinColors = ["#ffcc99", "#f1c27d", "#e0ac69", "#8d5524"];
  const hairStyles = ["short", "long", "curly", "bald"];
  const hairColors = ["#000000", "#brown", "#blonde", "#red", "#gray"];
  const accessories = ["none", "glasses", "hat", "earrings"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create Your 3D Avatar
      </h1>
      <div className="flex flex-wrap justify-center gap-10">
        {/* 3D Avatar Canvas */}
        <div className="w-96 h-96 bg-white shadow-md rounded-lg">
          <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 5, 5]} />
            <Suspense fallback={null}>
              <Avatar
                faceShape={faceShape}
                skinColor={skinColor}
                hairStyle={hairStyle}
                hairColor={hairColor}
                accessory={accessory}
              />
            </Suspense>
            <OrbitControls />
          </Canvas>
        </div>

        {/* Customization Panel */}
        <div className="flex flex-col gap-4">
          {/* Face Shape */}
          <div>
            <h2 className="font-semibold text-gray-800">Face Shape</h2>
            <div className="flex gap-2 mt-2">
              {faceShapes.map((shape) => (
                <button
                  key={shape}
                  className={`px-4 py-2 border rounded ${
                    faceShape === shape
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setFaceShape(shape)}
                >
                  {shape.charAt(0).toUpperCase() + shape.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Color */}
          <div>
            <h2 className="font-semibold text-gray-800">Skin Color</h2>
            <div className="flex gap-2 mt-2">
              {skinColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: color }}
                  onClick={() => setSkinColor(color)}
                ></button>
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div>
            <h2 className="font-semibold text-gray-800">Hair Style</h2>
            <div className="flex gap-2 mt-2">
              {hairStyles.map((style) => (
                <button
                  key={style}
                  className={`px-4 py-2 border rounded ${
                    hairStyle === style
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setHairStyle(style)}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Color */}
          <div>
            <h2 className="font-semibold text-gray-800">Hair Color</h2>
            <div className="flex gap-2 mt-2">
              {hairColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: color }}
                  onClick={() => setHairColor(color)}
                ></button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div>
            <h2 className="font-semibold text-gray-800">Accessories</h2>
            <div className="flex gap-2 mt-2">
              {accessories.map((item) => (
                <button
                  key={item}
                  className={`px-4 py-2 border rounded ${
                    accessory === item
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setAccessory(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAvatar3D;
