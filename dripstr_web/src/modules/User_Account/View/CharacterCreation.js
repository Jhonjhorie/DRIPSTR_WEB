import React, { useState, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Plane } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useNavigate } from "react-router-dom";
 
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

const CharacterCustomization = () => {
  const [gender, setGender] = useState("Boy");
  const [selectedBodyType, setSelectedBodyType] = useState("Heavy");
  const [selectedHair, setSelectedHair] = useState("");

  const [skinColor, setSkinColor] = useState("#f5c9a6"); 
  const [hairColor, setHairColor] = useState("#000000");  

  const navigate = useNavigate();

  const bodyTypeOptions = useMemo(() => {
    return {
      Boy: {
        Heavy: {
          Head: "/3d/char_parts/Man/Heavy_man/Heavy_Head.glb",
          Torso: "/3d/char_parts/Man/Heavy_man/Heavy_Torso.glb",
          Arms: "/3d/char_parts/Man/Heavy_man/Heavy_Arms.glb",
          Legs: "/3d/char_parts/Man/Heavy_man/Heavy_Legs.glb",
        },
        Fit: {
          Head: "/3d/char_parts/Man/Fit_man/Fit_Head.glb",
          Torso: "/3d/char_parts/Man/Fit_man/Fit_Torso.glb",
          Arms: "/3d/char_parts/Man/Fit_man/Fit_Arms.glb",
          Legs: "/3d/char_parts/Man/Fit_man/Fit_Legs.glb",
        },
        Muscular: {
          Head: "/3d/char_parts/Man/Muscular_man/Muscular_Head.glb",
          Torso: "/3d/char_parts/Man/Muscular_man/Muscular_Torso.glb",
          Arms: "/3d/char_parts/Man/Muscular_man/Muscular_Arms.glb",
          Legs: "/3d/char_parts/Man/Muscular_man/Muscular_Legs.glb",
        },
      },
      Girl: {
        Heavy: {
          Head: "/3d/char_parts/Woman/Heavy_woman/Heavy_Head.glb",
          Torso: "/3d/char_parts/Woman/Heavy_woman/Heavy_Torso.glb",
          Arms: "/3d/char_parts/Woman/Heavy_woman/Heavy_Arms.glb",
          Legs: "/3d/char_parts/Woman/Heavy_woman/Heavy_Legs.glb",
        },
        Fit: {
          Head: "/3d/char_parts/Woman/Fit_woman/Fit_Head.glb",
          Torso: "/3d/char_parts/Woman/Fit_woman/Fit_Torso.glb",
          Arms: "/3d/char_parts/Woman/Fit_woman/Fit_Arms.glb",
          Legs: "/3d/char_parts/Woman/Fit_woman/Fit_Legs.glb",
        },
        Slim: {
          Head: "/3d/char_parts/Woman/Slim_woman/Slim_Head.glb",
          Torso: "/3d/char_parts/Woman/Slim_woman/Slim_Torso.glb",
          Arms: "/3d/char_parts/Woman/Slim_woman/Slim_Arms.glb",
          Legs: "/3d/char_parts/Woman/Slim_woman/Slim_Legs.glb",
        },
      },
    };
  }, [gender]);

  const hairOptions = useMemo(() => {
    return {
      Boy: [
        "/3d/char_parts/Man/Hair/Hair1.glb",
        "/3d/char_parts/Man/Hair/Hair2.glb",
        "/3d/char_parts/Man/Hair/Hair3.glb",
      ],
      Girl: [
        "/3d/char_parts/Woman/Hair/Hair1.glb",
        "/3d/char_parts/Woman/Hair/Hair2.glb",
        "/3d/char_parts/Woman/Hair/Hair3.glb",
      ],
    };
  }, []);
  useEffect(() => {
    // Set default hair to "Hair 3" whenever the gender changes
    setSelectedHair(hairOptions[gender][2]);
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

  const currentParts = selectedBodyType
    ? bodyTypeOptions[gender][selectedBodyType]
    : {};

  return (
    <div className="p-4 flex flex-row min-h-screen bg-slate-200">
      <div className="flex-1 h-[500px] rounded-lg shadow-lg bg-gray-100">
        <Canvas
          camera={{ position: [0, 3, 3] }}
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
              <Part url={selectedHair} position={[0, 0.85, 0]} color={hairColor} />
            )}
            {currentParts.Head && (
              <Part url={currentParts.Head} position={[0, 0, 0]} color={skinColor} />
            )}
            {currentParts.Torso && (
              <Part url={currentParts.Torso} position={[0, 0, 0]} color={skinColor} />
            )}
            {currentParts.Arms && (
              <Part url={currentParts.Arms} position={[0, 0, 0]} color={skinColor} />
            )}
            {currentParts.Legs && (
              <Part url={currentParts.Legs} position={[0, 0, 0]} color={skinColor} />
            )}
          </group>

          <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>
      <div className="flex flex-col flex-1 ml-2 ">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Create Character</h1>

      <label className="block text-gray-700 font-semibold mb-2">Gender</label>
        <select
          className="w-full p-2 border rounded bg-white"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="Boy">Boy</option>
          <option value="Girl">Girl</option>
        </select>

        <label className="block text-gray-700 font-semibold mb-2 mt-2">Body Type</label>
        <select
          className="w-full p-2 border rounded bg-white"
          value={selectedBodyType}
          onChange={(e) => setSelectedBodyType(e.target.value)}
        >
          <option value="">Select Body Type</option>
          {Object.keys(bodyTypeOptions[gender]).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label className="block text-gray-700 font-semibold mb-2 mt-2">Hair</label>
        <select
          className="w-full p-2 border rounded bg-white"
          value={selectedHair}
          onChange={(e) => setSelectedHair(e.target.value)}
        >
          <option value="">Select Hair</option>
          {hairOptions[gender].map((hair, index) => (
            <option key={index} value={hair}>
              Hair {index + 1}
            </option>
          ))}
        </select>

        <div className="flex flex-col mt-4">
        <div className="flex flex-col mt-4">
  <label className="block text-gray-700 font-semibold mb-2">Skin Color</label>
  <div className="flex space-x-2">
    {[
      { label: "White", color: "#fff" },
      { label: "Light", color: "#f5c9a6" },
      { label: "Medium", color: "#d2a77d" },
      { label: "Tan", color: "#a67c5b" },
      { label: "Dark", color: "#67442e" },
    ].map((option) => (
      <button
        key={option.color}
        className={`w-10 h-10 rounded-full border-2 ${
          skinColor === option.color ? "border-blue-500" : "border-gray-300"
        }`}
        style={{ backgroundColor: option.color }}
        onClick={() => setSkinColor(option.color)}
      />
    ))}
  </div>
</div>


          <label className="block text-gray-700 font-semibold mb-2 mt-4">Hair Color</label>
          <input
            type="color"
            className="w-20 h-10 p-1 border rounded"
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
          />
        </div>

        <div className="p-2 w-full flex flex-row justify-end mt-4">
          <button
            className="p-2 w-40 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => navigate("/")}
          >
            Skip
          </button>
          <button
            className="p-2 w-40 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization;
