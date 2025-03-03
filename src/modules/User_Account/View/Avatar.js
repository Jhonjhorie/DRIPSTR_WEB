import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Preload } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import { bodyTypeURLs, hairURLs, tshirURLs, shortsURLs } from "../../../constants/avatarConfig";
import { gsap } from "gsap";
import * as THREE from 'three';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Toast from '../../../shared/alerts';

// Add this component at the top of your file
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Rendering Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600">Failed to load 3D viewer</h2>
            <p className="text-gray-600">Please refresh the page or try again later.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Add this component near the top of your file
const BodyTypeInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Body Type Guide</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-purple-600">XS (Petite)</h4>
            <p className="text-gray-600">Small frame, shorter height, narrow shoulders, slim waist and hips.</p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600">S (Slim/Athletic)</h4>
            <p className="text-gray-600">Lean build with slightly more muscle definition, narrow to medium shoulders, and a balanced waist-to-hip ratio.</p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600">M (Average/Regular)</h4>
            <p className="text-gray-600">Well-proportioned frame, moderate muscle definition, and slightly broader shoulders compared to waist and hips.</p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600">L (Curvy/Broad)</h4>
            <p className="text-gray-600">Fuller figure with broader shoulders, a more defined waist, and wider hips or chest.</p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600">XL (Fuller/Plus)</h4>
            <p className="text-gray-600">Larger frame with a more generous proportion across the chest, waist, and hips, offering more room for comfort and movement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update your Part component
function Part({ url, position, color, texture }) {
  const [loadError, setLoadError] = useState(false);
  const gltf = useGLTF(url, undefined, 
    (error) => {
      console.error('Model loading error:', error);
      setLoadError(true);
    }
  );

  const clonedScene = useMemo(() => {
    if (!gltf.scene) return null;
    return SkeletonUtils.clone(gltf.scene);
  }, [gltf.scene]);

  const materialEffect = useMemo(() => {
    if (!clonedScene) return;
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        if (texture && node.material.name.includes('Shirt')) {
          const tex = new TextureLoader().load(texture);
          tex.wrapS = RepeatWrapping;
          tex.wrapT = RepeatWrapping;
          tex.minFilter = NearestFilter;
          node.material.map = tex;
          node.material.color.set(color || "#ffffff");
          node.material.roughness = 0.7;
          node.material.metalness = 0.0;
          node.material.needsUpdate = true;
          node.material.map.flipY = false;
          node.material.map.needsUpdate = true;
        } else {
          node.material.color.set(color || "#ffffff");
          node.material.roughness = node.material.name.includes('Hair') ? 0.3 : 0.5;
          node.material.metalness = node.material.name.includes('Hair') ? 0.1 : 0.2;
        }
      }
    });
  }, [clonedScene, color, texture]);

  if (loadError) {
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

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

const PreloadAssets = () => {
  const urls = [
    ...Object.values(bodyTypeURLs.Boy).flat(),
    ...Object.values(bodyTypeURLs.Girl).flat(),
    ...Object.values(hairURLs),
    ...Object.values(tshirURLs.Boy).flat(),
    ...Object.values(tshirURLs.Girl).flat(),
    ...Object.values(shortsURLs.Boy).flat(),
    ...Object.values(shortsURLs.Girl).flat(),
  ];

  return <Preload all urls={urls} />;
};

 

const CreateAvatarModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const handleCreateAvatar = () => {
    setToast({
      show: true,
      message: "Redirecting to avatar creation...",
      type: 'info'
    });

    setTimeout(() => {
      navigate("/account/cc");
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      )}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center animate-fadeIn">
          <img 
            src="/emote/error.png" 
            alt="Create Avatar" 
            className="w-24 h-24 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Create Your Avatar
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Looks like you haven't created your avatar yet. Create one to start customizing your look!
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleCreateAvatar}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Avatar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [isBodyTypeInfoOpen, setIsBodyTypeInfoOpen] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

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
          // Show create avatar modal instead of redirecting
          setShowCreateModal(true);
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
      const { data: session, error: sessionError } = await supabase.auth.getSession();
  
      if (sessionError) {
        setToast({
          show: true,
          message: "Unable to update character. Please try again.",
          type: 'error'
        });
        return;
      }
  
      const account_ID = session?.session?.user?.id;
  
      if (!account_ID) {
        setToast({
          show: true,
          message: "User not authenticated.",
          type: 'warning'
        });
        return;
      }
  
      if (!name || !selectedHair) {
        setToast({
          show: true,
          message: "Please complete all required fields before saving.",
          type: 'warning'
        });
        return;
      }
  
      const updatedCharacterData = {
        gender,
        bodytype: selectedBodyType,
        hair: selectedHair,
        skincolor,
        haircolor,
        name,
      };
  
      const { error } = await supabase
        .from("avatars")
        .update(updatedCharacterData)
        .eq("account_id", account_ID);
  
      if (error) {
        setToast({
          show: true,
          message: "Failed to update character. Please try again.",
          type: 'error'
        });
        return;
      }
  
      setToast({
        show: true,
        message: "Character updated successfully!",
        type: 'success'
      });

      // Close edit mode and hide panel
      setIsEditing(false);
      setShowLeftPanel(false); // Add this line
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setToast({
        show: true,
        message: "An unexpected error occurred. Please try again.",
        type: 'error'
      });
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
    setShowLeftPanel(false); // Add this line to hide the panel when canceling
  };

  const handleTextureSelect = (item) => {
    setSelectedTexture(item.product.texture_3D);
  };

  const handleViewProduct = (item) => {
    navigate(`/product/${item.product.item_Name}`, { state: { item: item.product } });
  };

  // Add these helper functions at the component level
  const filterItemsByCategory = (items, category) => {
    return items.filter(item => item.product?.category === category);
  };

  const handleRemoveFromCloset = async (itemId) => {
    try {
      setIsRemoving(true);
      const { error } = await supabase
        .from('closet')
        .delete()
        .eq('id', itemId);
  
      if (error) throw error;
  
      // Update local state
      setClosetItems(prev => prev.filter(item => item.id !== itemId));
      
      // If the removed item was being worn, clear the texture
      if (selectedTexture === closetItems.find(item => item.id === itemId)?.product?.texture_3D) {
        setSelectedTexture(null);
      }
  
      setToast({
        show: true,
        message: "Item removed from closet",
        type: 'success'
      });
  
    } catch (error) {
      console.error('Error removing item:', error);
      setToast({
        show: true,
        message: "Failed to remove item from closet",
        type: 'error'
      });
    } finally {
      setIsRemoving(false);
    }
  };
  
  const handleBulkRemove = async () => {
    if (selectedItems.length === 0) return;
  
    try {
      setIsRemoving(true);
      const { error } = await supabase
        .from('closet')
        .delete()
        .in('id', selectedItems);
  
      if (error) throw error;
  
      // Update local state
      setClosetItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
  
      // Clear texture if any selected item was being worn
      if (selectedItems.some(id => 
        closetItems.find(item => item.id === id)?.product?.texture_3D === selectedTexture
      )) {
        setSelectedTexture(null);
      }
  
      setToast({
        show: true,
        message: `${selectedItems.length} items removed from closet`,
        type: 'success'
      });
  
    } catch (error) {
      console.error('Error removing items:', error);
      setToast({
        show: true,
        message: "Failed to remove items from closet",
        type: 'error'
      });
    } finally {
      setIsRemoving(false);
    }
  };
  
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      )}
      <CreateAvatarModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      <BodyTypeInfoModal 
        isOpen={isBodyTypeInfoOpen} 
        onClose={() => setIsBodyTypeInfoOpen(false)} 
      />
      <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
        <div className="sticky h-full ">  
        <Sidebar />
        </div>

    <div className="p-4 flex-1">
      <div className="flex flex-row relative h-full">
        {/* Left Panel Toggle Button - Only show when editing */}
        {isEditing && (
          <button
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-r-lg shadow-lg p-2 hover:bg-gray-100 transition-colors"
            title={showLeftPanel ? "Hide Edit Panel" : "Show Edit Panel"}
          >
            <i className={`fas fa-chevron-${showLeftPanel ? 'left' : 'right'} text-gray-600 z-30`}></i>
          </button>
        )}

        {/* Left Panel: Edit Form - Only show when editing */}
        {isEditing && (
          <div
            className={`absolute left-0 top-0 h-full bg-white rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform
              ${showLeftPanel ? 'translate-x-0 z-10' : '-translate-x-full -z-20'}
              w-80 overflow-y-auto
            `}
          >
            <div className="p-4">
              {isEditing && (
                // Your existing edit form JSX here
                // ... (keep all the form fields)
                <div className="p-4 bg-white rounded-lg shadow-lg ">
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-gray-700 font-semibold">Body Type</label>
                      <button
                        onClick={() => setIsBodyTypeInfoOpen(true)}
                        className="text-purple-600 hover:text-purple-700 transition-colors"
                        type="button"
                      >
                        <i className="fas fa-info-circle text-lg"></i>
                      </button>
                    </div>
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
              )}
            </div>
          </div>
        )}

        {/* Middle Panel: 3D Canvas */}
        <div className="flex-1 h-[500px] mx-16 rounded-lg shadow-lg bg-gray-100">
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

      <ErrorBoundary>
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-purple-600 mb-2" />
              <p className="text-gray-600">Loading 3D viewer...</p>
            </div>
          </div>
        }>
          <Canvas 
            camera={{ position: [0, 100, 200] }}
            shadows
            onError={(error) => {
              console.error('Canvas Error:', error);
            }}
          >
            <PreloadAssets />
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
        </Suspense>
      </ErrorBoundary>
    </div>
  </div>

          {/* Closet items */}


          {/* Action Buttons */}
          <div className="flex justify-center space-x-2 p-4">
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
                  onClick={() => {
                    setIsEditing(true);
                    setShowLeftPanel(true); // Add this line to show the panel when Edit is clicked
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Panel Toggle Button */}
        <button
          onClick={() => setShowRightPanel(!showRightPanel)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-l-lg shadow-lg p-2 hover:bg-gray-100 transition-colors"
          title={showRightPanel ? "Hide Closet" : "Show Closet"}
        >
          <i className={`fas fa-chevron-${showRightPanel ? 'right' : 'left'} text-gray-600`}></i>
        </button>

        {/* Right Panel: Closet */}
        <div
          className={`absolute right-0 top-0 h-full bg-white rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform
            ${showRightPanel ? 'translate-x-0' : 'translate-x-full'}
            w-80 z-10 overflow-y-auto
          `}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">My Closet</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                {closetItems.length} items
              </span>
            </div>

            {selectedItems.length > 0 && (
              <div className="flex items-center justify-between mb-4 p-2 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {selectedItems.length} items selected
                </span>
                <button
                  onClick={handleBulkRemove}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1" />
                  ) : (
                    <i className="fas fa-trash-alt mr-1"></i>
                  )}
                  Remove Selected
                </button>
              </div>
            )}

            {loadingCloset ? (
              <div className="flex items-center justify-center h-40">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-gray-400" />
              </div>
            ) : closetItems.length === 0 ? (
              <div className="text-center py-8">
                <img 
                  src="/emote/error.png" 
                  alt="Empty Closet" 
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                />
                <p className="text-gray-500">No items in closet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {closetItems.map((item) => (
                  <div 
                    key={`${item.product_id}-${item.variant?.variant?.variant_Name}`}
                    className={`relative group p-2 rounded-lg border-2 transition-all hover:shadow-md
                      ${selectedTexture === item.product.texture_3D
                        ? 'border-purple-600 bg-purple-50'
                        : selectedItems.includes(item.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-purple-300'
                      }
                    `}
                  >
                    {/* Checkbox for bulk selection */}
                    <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    {/* Existing image and content */}
                    <div className="aspect-square relative mb-2">
                      <img 
                        src={item.variant?.imagePath || '/placeholder.png'} 
                        alt={item.product?.item_Name}
                        className="w-full h-full object-contain"
                      />
                      
                      {/* Updated hover actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {item.product?.is3D && (
                          <button
                            onClick={() => handleTextureSelect(item)}
                            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
                            title="Try On"
                            disabled={isRemoving}
                          >
                            <i className="fas fa-tshirt text-sm"></i>
                          </button>
                        )}
                        <button
                          onClick={() => handleViewProduct(item)}
                          className="p-2 bg-white text-purple-600 rounded-full hover:bg-purple-50 transition-colors disabled:opacity-50"
                          title="View Product"
                          disabled={isRemoving}
                        >
                          <i className="fas fa-eye text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleRemoveFromCloset(item.id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                          title="Remove from Closet"
                          disabled={isRemoving}
                        >
                          <i className="fas fa-trash-alt text-sm"></i>
                        </button>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {item.product?.item_Name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variant?.variant?.variant_Name || 'Default'}
                      </p>
                    </div>

                    {selectedTexture === item.product.texture_3D && (
                      <div className="absolute -top-1 -right-1">
                        <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                          Wearing
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
   
  </div>
    </>
  );
};

export default CharacterCustomization;