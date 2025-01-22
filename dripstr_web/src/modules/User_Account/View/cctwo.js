import React, { useState, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Part({ url, position, color }) {
  const gltf = useGLTF(url);
  const clonedScene = useMemo(
    () => SkeletonUtils.clone(gltf.scene),
    [gltf.scene]
  );

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

const CharacterCustomization = () => {
  const [gender, setGender] = useState("Boy");
  const [selectedBodyType, setSelectedBodyType] = useState("Average");
  const [selectedHair, setSelectedHair] = useState("Barbers");

  const [skinColor, setSkinColor] = useState("#f5c9a6");
  const [hairColor, setHairColor] = useState("#000000");

  const navigate = useNavigate();

  const bodyTypeOptions = useMemo(() => {
    return {
      Boy: {
        Average: "/3d/avatars/guyz/Average.glb",
        Heavy: "/3d/avatars/guyz/Heavy.glb",
        Muscular: "/3d/avatars/guyz/Muscular.glb",
        PlusSize: "/3d/avatars/guyz/PlusSize.glb",
        Thin: "/3d/avatars/guyz/Thin.glb",
      },
      Girl: {
        Average: "/3d/avatars/gurlz/Average.glb",
        Muscular: "/3d/avatars/gurlz/Muscular.glb",
        PlusSize: "/3d/avatars/gurlz/PlusSize.glb",
        Thin: "/3d/avatars/gurlz/Thin.glb",
      },
    };
  }, []);

  const hairOptions = useMemo(() => {
    return {
      Boy: {
        Barbers: "/3d/hair/man/ManHair1.glb",
        PogiCut: "/3d/hair/man/ManHair2.glb",

      },
      Girl: {
        DoublePonytail: "/3d/hair/woman/GirlHair1.glb",
        Short: "/3d/hair/woman/GirlHair2.glb",
        Kulot: "/3d/hair/woman/GirlHair3.glb", 
      },
    };
  }, []);

  useEffect(() => {
    const defaultHair = Object.values(hairOptions[gender])[0];
    setSelectedHair(defaultHair);
    if (gender === "Girl") {
      setSelectedBodyType("Average");
    }
  }, [gender, hairOptions]);
  
  const handleSave = () => {
    const characterData = {
      gender,
      bodyType: selectedBodyType,
      hair: selectedHair,
      skinColor,
      hairColor,
    };
    console.log("Character Saved:", characterData);
    alert("Character customization saved!");
    navigate("/Account/Avatar");
  };

  const currentBody = selectedBodyType
    ? bodyTypeOptions[gender][selectedBodyType]
    : {};

  return (
    <div className="p-4 bg-slate-200 min-h-screen flex flex-row">
      <Sidebar />
      <div className="p-4 flex flex-1 flex-row min-h-screen bg-slate-200">
        <div className="flex-1 h-[500px] rounded-lg shadow-lg bg-gray-100">
          <Canvas
            camera={{ position: [0, -20, 120] }}
            style={{ background: "linear-gradient(to top, #1e3a8a, #3b82f6)" }}
          >
            <ambientLight intensity={0.8} />
            <hemisphereLight
              intensity={0.6}
              skyColor={0xffffff}
              groundColor={0x888888}
            />
            <directionalLight intensity={1.2} position={[5, 5, 5]} />
            <directionalLight intensity={1.2} position={[-5, 5, 5]} />
            <group>
              {selectedHair && (
                <Part
                  url={selectedHair}
                  position={[0, 0.85, 0]}
                  color={hairColor}
                 />
              )}
              <Part
                url={currentBody}
                position={[0, 0, 0]}
                color={skinColor}
                scale={[0.008, 0.008, 0.008]}
              />
            </group>
            <OrbitControls target={[0, 110, 0]} 
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}/>
            </Canvas>
        </div>
        <div className="flex flex-col flex-1 ml-2 ">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Create Character
          </h1>
          <label className="block text-gray-700 font-semibold mb-2">Gender</label>
          <select
            className="w-full p-2 border rounded bg-white"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="Boy">Men</option>
            <option value="Girl">Woman</option>
          </select>
          <label className="block text-gray-700 font-semibold mb-2 mt-2">
            Body Type
          </label>
          <select
            className="w-full p-2 border rounded bg-white"
            value={selectedBodyType}
            onChange={(e) => setSelectedBodyType(e.target.value)}
          >
            {Object.keys(bodyTypeOptions[gender]).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label className="block text-gray-700 font-semibold mb-2 mt-2">
            Hair
          </label>
          <select
            className="w-full p-2 border rounded bg-white"
            value={selectedHair}
            onChange={(e) => setSelectedHair(e.target.value)}
          >
            {Object.keys(hairOptions[gender]).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="flex flex-col mt-4">
            <div className="flex flex-col mt-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Skin Color
              </label>
              <div className="flex space-x-2">
                {[
                  { label: "Light", color: "#f5c9a6" },
                  { label: "Medium", color: "#d2a77d" },
                  { label: "Tan", color: "#a67c5b" },
                  { label: "Dark", color: "#67442e" },
                ].map((option) => (
                  <button
                    key={option.color}
                    className={`w-10 h-10  border-2 ${
                      skinColor === option.color
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: option.color }}
                    onClick={() => setSkinColor(option.color)}
                  />
                ))}
              </div>
            </div>
            <label className="block text-gray-700 font-semibold mb-2 mt-4">
              Hair Color
            </label>
            <input
              type="color"
              className="w-20 h-10 p-1 border rounded"
              value={hairColor}
              onChange={(e) => setHairColor(e.target.value)}
            />
          </div>
          <div className="p-2 w-full gap-3 flex flex-row justify-end mt-4">
          <button
              className="p-2 w-40 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="p-2 w-40 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => navigate("/")}
            >
              Skip
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization;
