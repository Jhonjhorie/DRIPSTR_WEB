import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import { bodyTypeURLs, hairURLs, tshirURLs, shortsURLs } from "../../../constants/avatarConfig";

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

        if (avatarError || !avatarData) {
          console.warn("Redirecting to create page as no avatar exists.");
          window.location.href = "/account/cc";
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

  const getShortsURL = () => {
    return shortsURLs[gender][selectedBodyType] || null;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Get the current session
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
  
      // Prepare the updated data
      const updatedCharacterData = {
        gender,
        bodytype: selectedBodyType,
        hair: selectedHair,
        skincolor,
        haircolor,
        name,
      };
  
      // Update the avatar in the database
      const { data, error } = await supabase
        .from("avatars")
        .update(updatedCharacterData)
        .eq("account_id", account_ID); // Match the row by account_id
  
      if (error) {
        console.error("Database Error:", error);
        alert("Failed to update character. Please try again.");
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
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full ">  
      <Sidebar />
      </div>

  <div className="p-4 flex-1">
    <div className="flex flex-row gap-4">
      {/* Left Panel: Edit Form */}
      <div className="bg-white p-4 rounded-lg shadow-lg ">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">Edit Character</h1>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              isEditing ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {isEditing ? "Editing" : "Viewing"}
          </span>
        </div>

        {/* Name Field 
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            className={`w-full p-2 border rounded transition-all ${
              isEditing
                ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-100 border-gray-300 cursor-not-allowed"
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
          />
        </div>  */}

        {/* Gender Field */}
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">Gender</label>
          <select
            className={`w-full p-2 border rounded transition-all ${
              isEditing
                ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-100 border-gray-300 cursor-not-allowed"
            }`}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={!isEditing}
          >
            <option value="Boy">Men</option>
            <option value="Girl">Woman</option>
          </select>
        </div>

        {/* Body Type Field */}
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">Body Type</label>
          <select
            className={`w-full p-2 border rounded transition-all ${
              isEditing
                ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-100 border-gray-300 cursor-not-allowed"
            }`}
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
        </div>

        {/* Skin Color Field */}
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">Skin Color</label>
          <div className="flex space-x-2">
            {[
              { label: "Light", color: "#f5c9a6" },
              { label: "Medium", color: "#d2a77d" },
              { label: "Tan", color: "#a67c5b" },
              { label: "Dark", color: "#67442e" },
            ].map((option) => (
              <button
                key={option.color}
                className={`w-10 h-10 border-2 rounded-full transition-all ${
                  isEditing
                    ? skincolor === option.color
                      ? "border-blue-500 hover:scale-110"
                      : "border-gray-300 hover:scale-110"
                    : "border-gray-300 cursor-not-allowed"
                }`}
                style={{ backgroundColor: option.color }}
                onClick={() => setSkinColor(option.color)}
                disabled={!isEditing}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row space-x-4">
        {/* Hair Field */}
        <div className="mt-4 flex-col flex-1">
          <label className="block text-gray-700 font-semibold mb-2">Hair</label>
          <select
            className={`w-full  p-2 border rounded transition-all ${
              isEditing
                ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-100 border-gray-300 cursor-not-allowed"
            }`}
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
        </div>

        {/* Hair Color Field */}
        <div className="mt-4 ">
          <label className="block text-gray-700 font-semibold mb-2">Hair Color</label>
          <input
            type="color"
            className={`w-20 h-10 p-1 border rounded transition-all ${
              isEditing
                ? "cursor-pointer border-blue-500"
                : "cursor-not-allowed border-gray-300"
            }`}
            value={haircolor}
            onChange={(e) => setHairColor(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        </div>

      </div>

      {/* Right Panel: 3D Canvas */}
      <div className="flex-1 h-[500px] rounded-lg shadow-lg bg-gray-100">
        <div className="relative flex flex-1 w-full h-full">

          {/* Darkened Background Image */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-100" // Dark overlay
            style={{ 
              backgroundImage: "url('/3d/canvasBG/ClosetBG.jpg')", 
              backgroundSize: "cover", 
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "brightness(50%)"
            }} 
          />

  {/* 3D Canvas (Ensuring it Renders Properly) */}
  <div className="relative w-full h-full">
    <Canvas camera={{ position: [0, 100, 200] }}>
      <ambientLight intensity={0.8} />
      <hemisphereLight intensity={1} />
      <directionalLight intensity={1.2} position={[0, 0, 1]} />
      <group>
        {selectedHair && hairURLs[selectedHair] && (
          <Part url={hairURLs[selectedHair]} position={[0, 0.85, 0]} color={haircolor} />
        )}
        <Part url={bodyTypeURLs[gender][selectedBodyType]} position={[0, 0, 0]} color={skincolor} />
        {getTShirtURL() && (
          <Part key={`tshirt-${gender}-${selectedBodyType}`} url={getTShirtURL()} position={[0, 0, 0]} />
        )}
        {getShortsURL() && (
          <Part key={`shorts-${gender}-${selectedBodyType}`} url={getShortsURL()} position={[0, 0, 0]} />
        )}
      </group>
      <OrbitControls target={[0, 110, 0]} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  </div>
</div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 p-4">
          {isEditing ? (
            <>
              <button
                className="p-2 w-40 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="p-2 w-40 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              className="p-2 w-40 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
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