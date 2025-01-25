import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import { bodyTypeURLs, hairURLs, tshirURLs  } from "../../../constants/avatarConfig";

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
  const [selectedBodyType, setSelectedBodyType] = useState("Average");
  const [selectedHair, setSelectedHair] = useState(null);
  const [skincolor, setSkinColor] = useState("#f5c9a6");
  const [haircolor, setHairColor] = useState("#000000");
  const [name, setName] = useState("");
  const [originalAvatar, setOriginalAvatar] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Session Error:", sessionError);
          return;
        }

        const account_ID = session?.session?.user?.id;
        if (!account_ID) {
          console.error("User not authenticated.");
          return;
        }

        const { data: avatarData, error: avatarError } = await supabase
          .from("avatars")
          .select("*")
          .eq("account_id", account_ID)
          .single();

        if (avatarError) {
          console.error("Fetch Avatar Error:", avatarError);
          return;
        }

        setGender(avatarData.gender);
        setSelectedBodyType(avatarData.bodytype);
        setSelectedHair(avatarData.hair);
        setSkinColor(avatarData.skincolor);
        setHairColor(avatarData.haircolor);
        setName(avatarData.name);

        setOriginalAvatar({
          gender: avatarData.gender,
          bodyType: avatarData.bodytype,
          hair: avatarData.hair,
          skinColor: avatarData.skincolor,
          hairColor: avatarData.haircolor,
          name: avatarData.name,
        });
      } catch (error) {
        console.error("Unexpected Error:", error);
      }
    };

    fetchAvatar();
  }, []);


  const getTShirtURL = () => {
    return tshirURLs[gender][selectedBodyType] || null;
  };
  
/* Fix Later: Problem with handleUpdate, null lumalabas sa data tama naman yong object, walang indication kung anong error nakakainis nakakapagod parang legday
  const handleUpdate = async () => {
    try {
      const { data: session, error: sessionError } = await supabase.auth.getSession();
  
      if (sessionError) {
        console.error("Session Error:", sessionError);
        alert("Unable to update character. Please try again.");
        return;
      }
  
      const account_ID = session?.session?.user?.id;
  
      if (!account_ID) {
        alert("User not authenticated.");
        return;
      }
  
      // Validate required fields
      if (!name || !selectedHair) {
        alert("Please complete all required fields before saving.");
        return;
      }
  
      // Prepare character data
      const updatedCharacterData = {
        gender,
        bodytype: selectedBodyType,
        hair: selectedHair,
        skincolor,
        haircolor,
        name,
      };
  
  
      // Update Supabase database
      const { data, error } = await supabase
        .from("avatars")
        .update(updatedCharacterData)
        .eq("account_id", account_ID)
        .select("*");
  
      if (error) {
        console.error("Database Error:", error);
        alert("Failed to update character. Please try again.");
        return;
      }
  
      if (!data || data.length === 0) {
        console.warn("No rows updated. Check your query conditions." ,data ,updatedCharacterData,account_ID);
        alert("No changes were made. Please verify your data.");
        return;
      }
  
      console.log("Character Updated:", data);
      alert("Character customization updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Unexpected Error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };
  */

  const handleCancel = () => {
    setGender(originalAvatar.gender);
    setSelectedBodyType(originalAvatar.bodyType);
    setSelectedHair(originalAvatar.hair);
    setSkinColor(originalAvatar.skinColor);
    setHairColor(originalAvatar.hairColor);
    setName(originalAvatar.name);
    setIsEditing(false);
  };

  return (
    <div className="p-4 flex min-h-screen bg-slate-200">
      <Sidebar />

      <div className="p-4 flex-1">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Avatar Controls */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-800">Edit Character</h1>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <label className="block text-gray-700 font-semibold mb-2">Gender</label>
            <select
              className="w-full p-2 border rounded bg-white"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={!isEditing}
            >
              <option value="Boy">Men</option>
              <option value="Girl">Woman</option>
            </select>
            <label className="block text-gray-700 font-semibold mb-2 mt-2">Body Type</label>
            <select
              className="w-full p-2 border rounded bg-white"
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
              disabled={!isEditing}
            >
              {Object.keys(bodyTypeURLs[gender]).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label className="block text-gray-700 font-semibold mb-2 mt-2">Skin Color</label>
            <div className="flex space-x-2">
              {[
                { label: "Light", color: "#f5c9a6" },
                { label: "Medium", color: "#d2a77d" },
                { label: "Tan", color: "#a67c5b" },
                { label: "Dark", color: "#67442e" },
              ].map((option) => (
                <button
                  key={option.color}
                  className={`w-10 h-10 border-2 ${
                    skincolor === option.color ? "border-blue-500" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: option.color }}
                  onClick={() => setSkinColor(option.color)}
                  disabled={!isEditing}
                />
              ))}
            </div>
            <label className="block text-gray-700 font-semibold mb-2 mt-2">Hair</label>
            <select
              className="w-full p-2 border rounded bg-white"
              value={selectedHair}
              onChange={(e) => setSelectedHair(e.target.value)}
              disabled={!isEditing}
            >
              {Object.entries(hairURLs).map(([key, url]) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <label className="block text-gray-700 font-semibold mb-2 mt-4">Hair Color</label>
            <input
              type="color"
              className="w-20 h-10 p-1 border rounded"
              value={haircolor}
              onChange={(e) => setHairColor(e.target.value)}
              disabled={!isEditing}
            />


          </div>

          {/* 3D Model Container */}
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
                {getTShirtURL() && <Part url={getTShirtURL()} position={[0, 0, 0]} />}
              </group>
              <OrbitControls target={[0, 110, 0]} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
            </Canvas>


            <div className="flex justify-end mt-4 space-x-2">
              {isEditing ? (
                <>
                  <button
                    className="p-2 w-40 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="p-2 w-40 bg-blue-500 text-white rounded hover:bg-blue-600"
                    //onClick={handleUpdate}
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  className="p-2 w-40 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization;
