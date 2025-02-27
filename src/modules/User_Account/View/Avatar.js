import React, { useState, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import { bodyTypeURLs, hairURLs, tshirURLs, shortsURLs } from "../../../constants/avatarConfig";
import { gsap } from "gsap";
import * as THREE from 'three';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Part({ url, position, color, texture }) {
  const gltf = useGLTF(url);
  const clonedScene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);

  useMemo(() => {
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
        
        if (texture) {
          // Apply texture if provided (for t-shirt)
          const textureLoader = new TextureLoader();
          textureLoader.load(texture, (tex) => {
            tex.wrapS = tex.wrapT = RepeatWrapping;
            tex.minFilter = NearestFilter;
            node.material.map = tex;
            node.material.color.set(color || "#ffffff");
            node.material.roughness = 0.7;
            node.material.metalness = 0.0;
            node.material.needsUpdate = true;
            node.material.map.flipY = false;
            node.material.map.needsUpdate = true;
          });
        } else {
          // Apply just color for other parts (avatar, hair, shorts)
          node.material.color.set(color || "#ffffff");
          node.material.roughness = node.material.name.includes('Hair') ? 0.3 : 0.5;
          node.material.metalness = node.material.name.includes('Hair') ? 0.1 : 0.2;
        }
      }
    });
  }, [clonedScene, color, texture]);

  return (
    <primitive 
      object={clonedScene} 
      position={position}
      castShadow
      receiveShadow
    />
  );
}

// Add after the Part component in Avatar.js
function Platform() {
  const geometry = useMemo(() => new THREE.CircleGeometry(100, 64), []);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color="#202020"
        metalness={0.2}
        roughness={0.5}
        opacity={0.7}
        transparent
      />
    </mesh>
  );
}

function CameraController({ view }) {
  const { camera } = useThree();

  useEffect(() => {
    switch (view) {
      case 'upper':
        // Pan camera upward to focus on upper body
        gsap.to(camera.position, {
          x: 0,
          y: 160,
          z: 150,
          duration: 0.8,
          ease: "power2.inOut"
        });
        gsap.to(camera.lookAt, {
          x: 0,
          y: 140, // Look up at head/chest area
          z: 0,
          duration: 0.8,
          ease: "power2.inOut"
        });
        break;
      case 'lower':
        // Pan camera downward to focus on lower body
        gsap.to(camera.position, {
          x: 0,
          y: 40,
          z: 150,
          duration: 0.8,
          ease: "power2.inOut"
        });
        gsap.to(camera.lookAt, {
          x: 0,
          y: 20, // Look down at legs area
          z: 0,
          duration: 0.8,
          ease: "power2.inOut"
        });
        break;
      case 'full':
      default:
        // Reset to full body view
        gsap.to(camera.position, {
          x: 0,
          y: 100,
          z: 200,
          duration: 0.8,
          ease: "power2.inOut"
        });
        gsap.to(camera.lookAt, {
          x: 0,
          y: 80,
          z: 0,
          duration: 0.8,
          ease: "power2.inOut"
        });
        break;
    }
  }, [view, camera]);

  return null;
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
  const [cameraView, setCameraView] = useState('full');
  const [closetItems, setClosetItems] = useState([]);
  const [loadingCloset, setLoadingCloset] = useState(true);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: '',
    image: '',
  });

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

  useEffect(() => {
    const fetchClosetItems = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;

        const { data, error } = await supabase
          .from('closet')
          .select(`
            *,
            product:shop_Product (*)
          `)
          .eq('user_id', session.session.user.id);

        if (error) throw error;
        setClosetItems(data || []);
      } catch (error) {
        console.error('Error fetching closet:', error);
      } finally {
        setLoadingCloset(false);
      }
    };

    fetchClosetItems();
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

  const handleTextureSelect = (item) => {
    setSelectedTexture(item.product.texture_3D);
  };

  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full ">  
      <Sidebar />
      </div>

  <div className="p-4 flex-1">
    <div className="flex flex-row gap-4">

      {/* Left Panel: Edit Form */}
      <div className=" bg-white p-4 rounded-lg shadow-lg ">
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

      {/* Middle Panel: 3D Canvas */}
      <div className=" flex-1 h-[500px] rounded-lg shadow-lg bg-gray-100">
        <div className="relative flex flex-1 w-full h-full">

          {/* Darkened Background Image */}
          <div 
  className="absolute inset-0 bg-black bg-opacity-80"
  style={{ 
    backgroundImage: "url('/3d/canvasBG/Closet.jpg')", 
    backgroundSize: "cover", 
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "brightness(30%) blur(4px)", 
  }} 
/>

  {/* 3D Canvas (Ensuring it Renders Properly) */}
  <div className="relative w-full h-full">
    {/* Camera Control Buttons */}
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
      <button
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          cameraView === 'full' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setCameraView('full')}
      >
        Full Body
      </button>
      <button
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          cameraView === 'upper' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setCameraView('upper')}
      >
        Upper Body
      </button>
      <button
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          cameraView === 'lower' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={() => setCameraView('lower')}
      >
        Lower Body
      </button>
    </div>

    <Canvas 
      camera={{ position: [0, 100, 200] }}
      shadows
    >
        
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <hemisphereLight intensity={0.7} />
      <directionalLight
        castShadow
        position={[2, 4, 1]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-2, 4, -1]}
        intensity={0.5}
        angle={0.5}
        penumbra={1}
      />

      <CameraController view={cameraView} />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Platform and Models */}
      <group position={[0, 0, 0]}>
        <Platform />
        {selectedHair && hairURLs[selectedHair] && (
          <Part 
            url={hairURLs[selectedHair]} 
            position={[0, 0.85, 0]} 
            color={haircolor} 
          />
        )}
        <Part 
          url={bodyTypeURLs[gender][selectedBodyType]} 
          position={[0, 0, 0]} 
          color={skincolor} 
        />
        {getTShirtURL() && (
          <Part 
            key={`tshirt-${gender}-${selectedBodyType}`} 
            url={getTShirtURL()} 
            position={[0, 0, 0]}
            texture={selectedTexture} // Pass selected texture
          />
        )}
        {getShortsURL() && (
          <Part 
            key={`shorts-${gender}-${selectedBodyType}`} 
            url={getShortsURL()} 
            position={[0, 0, 0]}
            color="#000000"
          />
        )}
      </group>
 
      <OrbitControls 
        target={[0, 80, 0]}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minDistance={80}
        maxDistance={300}
        enablePan={true}
        panSpeed={0.5}
        rotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Canvas>
  </div>
</div>

        {/* Closet items */}


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
            <>
 
              <button
                className="p-2 w-40 bg-purple-500 text-white rounded hover:bg-purple-600 transition-all"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right Panel: Closet */}
      <div className="flex-1 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">My Closet</h2>
          {loadingCloset ? (
            <div className="flex items-center justify-center h-full">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-gray-400" />
            </div>
          ) : closetItems.length === 0 ? (
            <div className="text-center text-gray-500">No items in closet</div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {closetItems.map((item) => (
                <div key={`${item.product_id}-${item.variant?.variant_Name}`}
                  className={`relative group p-2 rounded-lg border-2 transition-all ${
                    selectedTexture === item.product.texture_3D
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <button
                    onClick={() => handleTextureSelect(item)}
                    className="w-full"
                  >
                    <img 
                      src={item.variant?.imagePath || '/placeholder.png'} 
                      alt={item.product?.item_Name}
                      className="w-full h-24 object-contain"
                    />
                    <p className="text-xs text-center mt-1 truncate">
                      {item.product?.item_Name}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          )}
      </div>

    </div>
  </div>
 
</div>
  );
};

export default CharacterCustomization;