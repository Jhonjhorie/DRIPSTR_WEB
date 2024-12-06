import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
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
  const [gender, setGender] = useState("Boy"); // Gender state: Boy or Girl
  const [selectedParts, setSelectedParts] = useState({
    Hair: "/3d/char_parts/Man/Hair/Hair1.glb",
    Head: "/3d/char_parts/Man/Heavy_man/Heavy_Head.glb",
    Torso: "/3d/char_parts/Man/Heavy_man/Heavy_Torso.glb",
    Arms: "/3d/char_parts/Man/Heavy_man/Heavy_Arms.glb",
    Legs: "/3d/char_parts/Man/Heavy_man/Heavy_Legs.glb",
    feet: null,
  });

  const [sharedColor, setSharedColor] = useState("#ffffff");
  const [hairColor, setHairColor] = useState("#000");

  const navigate = useNavigate();

  const bodyPartOptions = useMemo(() => {
    return gender === "Boy"
      ? {
          Hair: [
            { label: "Hair 1", url: "/3d/char_parts/Man/Hair/Hair1.glb" },
            { label: "Hair 2", url: "/3d/char_parts/Man/Hair/Hair2.glb" },
            { label: "Hair 3", url: "/3d/char_parts/Man/Hair/Hair3.glb" },
          ],
          Head: [
            { label: "Heavy Head", url: "/3d/char_parts/Man/Heavy_man/Heavy_Head.glb" },
            { label: "Obese Head", url: "/3d/char_parts/Man/Obese_man/Obese_Head.glb" },
            { label: "Fit Head", url: "/3d/char_parts/Man/Fit_man/Fit_Head.glb" },
            { label: "Muscular Head", url: "/3d/char_parts/Man/Muscular_man/Muscular_Head.glb" },
            
          ],
          Torso: [
            { label: "Heavy Torso", url: "/3d/char_parts/Man/Heavy_man/Heavy_Torso.glb" },
            { label: "Obese Torso", url: "/3d/char_parts/Man/Obese_man/Obese_Torso.glb" },
            { label: "Fit Torso", url: "/3d/char_parts/Man/Fit_man/Fit_Torso.glb" },
            { label: "Muscular Torso", url: "/3d/char_parts/Man/Muscular_man/Muscular_Torso.glb" },

          ],
          Arms: [
            { label: "Heavy Arms", url: "/3d/char_parts/Man/Heavy_man/Heavy_Arms.glb" },
            { label: "Obese Arms", url: "/3d/char_parts/Man/Obese_man/Obese_Arms.glb" },
            { label: "Fit Arms", url: "/3d/char_parts/Man/Fit_man/Fit_Arms.glb" },
            { label: "Muscular Arms", url: "/3d/char_parts/Man/Muscular_man/Muscular_Arms.glb" },

          ],
          Legs: [
            { label: "Heavy Legs", url: "/3d/char_parts/Man/Heavy_man/Heavy_Legs.glb" },
            { label: "Obese Legs", url: "/3d/char_parts/Man/Obese_man/Obese_Legs.glb" },
            { label: "Fit Legs", url: "/3d/char_parts/Man/Fit_man/Fit_Legs.glb" },
            { label: "Muscular Legs", url: "/3d/char_parts/Man/Muscular_man/Muscular_Legs.glb" },

          ],
        }
      : {
          Hair: [
            { label: "Hair 1", url: "/3d/char_parts/Woman/Hair/Hair1.glb" },
            { label: "Hair 2", url: "/3d/char_parts/Woman/Hair/Hair2.glb" },
            { label: "Hair 3", url: "/3d/char_parts/Woman/Hair/Hair3.glb" },
          ],
          Head: [
            { label: "Heavy Head", url: "/3d/char_parts/Woman/Heavy_woman/Heavy_Head.glb" },
            { label: "Slim Head", url: "/3d/char_parts/Woman/Slim_woman/Slim_Head.glb" },
            { label: "Fit Head", url: "/3d/char_parts/Woman/Fit_woman/Fit_Head.glb" },
            { label: "Obese Head", url: "/3d/char_parts/Woman/Obese_woman/Obese_Head_W.glb" },
            
          ],
          Torso: [
            { label: "Heavy Torso", url: "/3d/char_parts/Woman/Heavy_woman/Heavy_Torso.glb" },
            { label: "Slim Torso", url: "/3d/char_parts/Woman/Slim_woman/Slim_Torso.glb" },
            { label: "Fit Torso", url: "/3d/char_parts/Woman/Fit_woman/Fit_Torso.glb" },
            { label: "Obese Torso", url: "/3d/char_parts/Woman/Obese_woman/Obese_Torso_W.glb" },
          ],
          Arms: [
            { label: "Heavy Arms", url: "/3d/char_parts/Woman/Heavy_woman/Heavy_Arms.glb" },
            { label: "Slim Arms", url: "/3d/char_parts/Woman/Slim_woman/Slim_Arms.glb" },
            { label: "Fit Arms", url: "/3d/char_parts/Woman/Fit_woman/Fit_Arms.glb" },
            { label: "Obese Arms", url: "/3d/char_parts/Woman/Obese_woman/Obese_Arms_W.glb" },
          ],
          Legs: [
            { label: "Heavy Legs", url: "/3d/char_parts/Woman/Heavy_woman/Heavy_Legs.glb" },
            { label: "Slim Legs", url: "/3d/char_parts/Woman/Slim_woman/Slim_Legs.glb" },
            { label: "Fit Legs", url: "/3d/char_parts/Woman/Fit_woman/Fit_Legs.glb" },
            { label: "Obese Legs", url: "/3d/char_parts/Woman/Obese_woman/Obese_Legs_W.glb" },
          ],
        };
  }, [gender]);

  const handleSelectionChange = (part, url) => {
    setSelectedParts((prev) => ({ ...prev, [part]: url }));
  };

  const handleSave = () => {
    const characterData = {
      gender,
      selectedParts,
      sharedColor,
      hairColor,
    };
    console.log("Character Saved:", characterData);
    alert("Character customization saved!");
    navigate("/Account/Avatar");
  };

  return (
    <div className="p-4 flex flex-row min-h-screen bg-slate-200">
      <div className="flex-1 h-[500px] rounded-lg shadow-lg bg-gray-100">
        <Canvas camera={{ position: [0, 3, 3] }} style={{ background: "linear-gradient(to top, #1e3a8a, #3b82f6)" }}>
          <ambientLight intensity={0.8} />
          <hemisphereLight intensity={0.6} skyColor={0xffffff} groundColor={0x888888} />
          <directionalLight intensity={1.2} position={[5, 5, 5]} />
          <directionalLight intensity={1.2} position={[-5, 5, 5]} />
          <group>
            {selectedParts.Head && (
              <group position={[0, 0, 0]}>
                {selectedParts.Hair && <Part url={selectedParts.Hair} position={[0, 0.85, 0.05]} color={hairColor} />}
                <Part url={selectedParts.Head} position={[0, 0, 0]} color={sharedColor} />
              </group>
            )}
            {selectedParts.Torso && <Part url={selectedParts.Torso} position={[0, 0, 0]} color={sharedColor} />}
            {selectedParts.Arms && <Part url={selectedParts.Arms} position={[0, 0, 0]} color={sharedColor} />}
            {selectedParts.Legs && <Part url={selectedParts.Legs} position={[0, 0, 0]} color={sharedColor} />}
          </group>
          <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>
      <div className="flex flex-col flex-1 ml-2">
        <div className="p-2">
          <label className="block text-gray-700 font-semibold mb-2">Gender</label>
          <select
            className="w-full p-2 border rounded bg-white"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="Boy">Boy</option>
            <option value="Girl">Girl</option>
          </select>
        </div>
        {Object.keys(bodyPartOptions).map((part) => (
          <div key={part} className="p-2">
            <label className="block text-gray-700 font-semibold mb-2">{part}</label>
            <select
              className="w-full p-2 border rounded bg-white"
              value={selectedParts[part]}
              onChange={(e) => handleSelectionChange(part, e.target.value)}
            >
              {bodyPartOptions[part].map((option) => (
                <option key={option.url} value={option.url}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

<div className="flex flex-row">

<div className="p-2 mr-4">
  <label className="block text-gray-700 font-semibold mb-2">
    Skin Color
  </label>

  <div className="flex space-x-2 mb-4">
    {[
      "#FFF",
      "#FFDFC4",
      "#F0D5BE",
      "#D9B38C",
      "#A67C52",
      "#825201",
      "#5C2C06",
    ].map((color) => (
      <div
        key={color}
        className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
        style={{ backgroundColor: color }}
        onClick={() => setSharedColor(color)}
      ></div>
    ))}
  </div>
</div>
<div className="p-2">
  <label className="block text-gray-700 font-semibold mb-2">
    Hair Color
  </label>
  <input
    type="color"
    value={hairColor}
    onChange={(e) => setHairColor(e.target.value)}
    className="w-10"
  />
</div>
</div>
<div className="p-2 w-full flex flex-row justify-end">
        <button
          className="p-2 w-40  mr-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={handleSave}
        >
          Skip
        </button>


        <button
          className="p-2 w-40  bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSave}
        >
          Save Customization
        </button>

</div>
      </div>
    </div>
  );
};

export default CharacterCustomization;
