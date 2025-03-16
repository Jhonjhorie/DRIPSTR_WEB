import React, { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { TextureLoader, RepeatWrapping, NearestFilter } from 'three';
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import { bodyTypeURLs, hairURLs, tshirURLs, shortsURLs,  jerseyURLs, 
  longsleevesURLs,
  pantsURLs,
  footwearsURLs,
  skirtURLs } from "../../../constants/avatarConfig";
import { gsap } from "gsap";
import * as THREE from 'three';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Toast from '../../../shared/alerts';
import { Link } from 'react-router-dom';
import useCarts from '../../../modules/Products/hooks/useCart';
import useUserProfile from '../../../shared/mulletCheck';

// Add to top of Avatar.js
useGLTF.preload(Object.values(bodyTypeURLs.Boy).flat());
useGLTF.preload(Object.values(bodyTypeURLs.Girl).flat());

// Add this helper function near the top
const getClothingCategory = (category) => {
  const categories = {
    tops: ['Tshirt', 'Jersey', 'Longsleeves'],
    bottoms: ['Pants', 'Shorts', 'Skirt'],
    footwear: ['Shoes', 'Boots']
  };
  return Object.entries(categories).find(([_, items]) => 
    items.includes(category))?.[0] || 'other';
};

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

        {/* Measurements Table */}
        <div className="mt-6">
          <h4 className="font-semibold  mb-3">Size Measurements</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-4 py-2 border-b text-left text-purple-600">Size</th>
                  <th className="px-4 py-2 border-b text-left text-purple-600">Bust</th>
                  <th className="px-4 py-2 border-b text-left text-purple-600">Waist</th>
                  <th className="px-4 py-2 border-b text-left text-purple-600">Hips</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">XS (Petite)</td>
                  <td className="px-4 py-2 border-b">30-32"</td>
                  <td className="px-4 py-2 border-b">22-24"</td>
                  <td className="px-4 py-2 border-b">32-34"</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">S (Slim/Athletic)</td>
                  <td className="px-4 py-2 border-b">32-34"</td>
                  <td className="px-4 py-2 border-b">24-26"</td>
                  <td className="px-4 py-2 border-b">34-36"</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">M (Average/Regular)</td>
                  <td className="px-4 py-2 border-b">34-36"</td>
                  <td className="px-4 py-2 border-b">27-29"</td>
                  <td className="px-4 py-2 border-b">37-39"</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">L (Curvy/Broad)</td>
                  <td className="px-4 py-2 border-b">37-40"</td>
                  <td className="px-4 py-2 border-b">30-33"</td>
                  <td className="px-4 py-2 border-b">40-43"</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">XL (Fuller/Plus)</td>
                  <td className="px-4 py-2 border-b">41-44"</td>
                  <td className="px-4 py-2 border-b">34-38"</td>
                  <td className="px-4 py-2 border-b">44-48"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function Part({ url, position, color, texture }) {
  const [loadError, setLoadError] = useState(false);
  const [modelUrl, setModelUrl] = useState(url?.url || url);

  const { scene } = useGLTF(modelUrl, undefined, (error) => {
    console.error('Error loading model:', error);
    setLoadError(true);
  });

  const clonedScene = useMemo(() => {
    if (!scene) return null;
    try {
      return SkeletonUtils.clone(scene);
    } catch (error) {
      console.error('Error cloning scene:', error);
      return null;
    }
  }, [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    try {
      clonedScene.traverse((node) => {
        if (node.isMesh) {
          node.material = node.material.clone();
          
          if (texture) {
            const textureLoader = new TextureLoader();
            textureLoader.load(texture, 
              (tex) => {
                tex.wrapS = tex.wrapT = RepeatWrapping;
                tex.minFilter = NearestFilter;
                node.material.map = tex;
                node.material.color.set(color || "#ffffff");
                node.material.roughness = 0.7;
                node.material.metalness = 0.0;
                node.material.needsUpdate = true;
                node.material.map.flipY = false;
                node.material.map.needsUpdate = true;
              },
              undefined,
              (error) => console.error('Error loading texture:', error)
            );
          } else {
            node.material.color.set(color || "#ffffff");
            node.material.roughness = node.material.name.includes('Hair') ? 0.3 : 0.5;
            node.material.metalness = node.material.name.includes('Hair') ? 0.1 : 0.2;
          }
        }
      });
    } catch (error) {
      console.error('Error updating materials:', error);
    }
  }, [clonedScene, color, texture]);

  useEffect(() => {
    return () => {
      // Cleanup
      if (scene) {
        scene.traverse((node) => {
          if (node.isMesh) {
            node.geometry.dispose();
            node.material.dispose();
          }
        });
      }
    };
  }, [scene]);

  if (loadError) {
    console.error(`Failed to load model: ${url}`);
    return null;
  }

  if (!clonedScene) return null;

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
  const geometry = useMemo(() => new THREE.CircleGeometry(15, 64), []);
  
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

// Add this new component after the Platform component
function RotatingGroup({ children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005; // Adjust speed by changing this value
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {children}
    </group>
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
          y: 160, // Look up at head/chest area
          z: 0,
          duration: 0.8,
          ease: "power2.inOut"
        });
        break;
      case 'lower':
        // Pan camera downward to focus on lower body
        gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: 100,
          duration: 0.8,
          ease: "power2.inOut"
        });
        gsap.to(camera.lookAt, {
          x: 0,
          y: 0,  
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
          y: 50,
          z: 100,
          duration: 0.8,
          ease: "power2.inOut"
        });
        gsap.to(camera.lookAt, {
          x: 0,
          y: 50,
          z: 0,
          duration: 0.8,
          ease: "power2.inOut"
        });
        break;
    }
  }, [view, camera]);

  return null;
}

const ThreeDErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center p-8">
          <img src="/emote/error.png" alt="Error" className="w-24 h-24 mx-auto mb-4" />
          <p className="text-red-600">Failed to load 3D model</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return children;
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
  const navigate = useNavigate();
  const [gender, setGender] = useState("Boy");
  const [selectedBodyType, setSelectedBodyType] = useState("Average");
  const [selectedHair, setSelectedHair] = useState(null);
  const [skincolor, setSkinColor] = useState("");
  const [haircolor, setHairColor] = useState("#000000");
  const [name, setName] = useState("");
  const [originalAvatar, setOriginalAvatar] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [cameraView, setCameraView] = useState('full');
  const [closetItems, setClosetItems] = useState([]);
  const [loadingCloset, setLoadingCloset] = useState(true);
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
  const [selectedItems, setSelectedItems] = useState({
    tops: null,
    bottoms: null,
    footwear: null
  });
  const [expandedCategories, setExpandedCategories] = useState({
    tops: true,
    bottoms: true,
    footwear: true
  });
  const [addingToCart, setAddingToCart] = useState(false);

  // Add cart integration hooks
  const { addToCart } = useCarts();
  const { profile } = useUserProfile();

  const handleAddSelectedToCart = async () => {
    if (!profile) {
      setToast({
        show: true,
        message: "Please log in to add items to cart",
        type: 'warning'
      });
      return;
    }

    setAddingToCart(true);
    try {
      // Filter out null values and create array of selected items
      const itemsToAdd = Object.values(selectedItems).filter(item => item);
      
      // Add each item to cart
      for (const item of itemsToAdd) {
        const variantInfo = item.variant;
        const sizeInfo = variantInfo?.sizes?.[0]; // Get first size or implement size selection

        if (!sizeInfo) {
          console.error('No size information available for item:', item);
          continue;
        }

        await addToCart(
          item.product.id,
          1, // Default quantity
          variantInfo,
          sizeInfo
        );
      }

      setToast({
        show: true,
        message: `${itemsToAdd.length} item(s) added to cart successfully!`,
        type: 'success'
      });

    } catch (error) {
      console.error('Error adding items to cart:', error);
      setToast({
        show: true,
        message: 'Failed to add items to cart',
        type: 'error'
      });
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        console.log('Fetching avatar data...');
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
        console.log('Avatar data loaded:', avatarData);
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
            id,
            created_at,
            user_id,
            product_id,
            variant,
            product:shop_Product (
              id,
              created_at,
              item_Name,
              item_Description,
              item_Category,
              item_Tags,
              item_Variant,
              item_Rating,
              item_Orders,
              shop_Id,
              shop_Name,
              is_Post,
              reviews,
              is3D,
              discount,
              apply_Vouch,
              texture_3D,
              type3D
            )
          `)
          .eq('user_id', session.session.user.id)
          .order('created_at', { ascending: false });

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
    console.log('Getting TShirt URL for:', { gender, selectedBodyType });
    return tshirURLs[gender][selectedBodyType];
  };

  const getShortsURL = () => {
    console.log('Getting Shorts URL for:', { gender, selectedBodyType });
    return shortsURLs[gender][selectedBodyType];
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
  
      if ( !selectedHair) {
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

      // Close edit mode and wait for toast before redirecting
      setIsEditing(false);
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
    setShowLeftPanel(false); // Hide the panel when canceling
  };

  const handleTextureSelect = (item) => {
    const category = getClothingCategory(item.product?.item_Category);
    setSelectedItems(prev => ({
      ...prev,
      [category]: item
    }));
  };

  const handleRemoveFromCloset = async (itemId) => {
    try {
      const { error } = await supabase
        .from('closet')
        .delete()
        .eq('id', itemId);
  
      if (error) throw error;
  
      // Update local state to remove item
      setClosetItems(closetItems.filter(item => item.id !== itemId));
      setToast({
        show: true,
        message: "Item removed from closet",
        type: 'success'
      });
    } catch (error) {
      console.error('Error removing item:', error);
      setToast({
        show: true,
        message: "Failed to remove item",
        type: 'error'
      });
    }
  };

  const handleViewProduct = (item) => {
    if (!item?.product) return;
  
    try {
      // Parse variant data if needed
      const variants = typeof item.product.item_Variant === 'string' 
        ? JSON.parse(item.product.item_Variant)
        : item.product.item_Variant || [];
  
      // Find current variant
      const currentVariant = variants.find(v => v.imagePath === item.variant?.imagePath) || variants[0];
  
      // Construct product data matching the format used in other pages
      const productData = {
        id: item.product.id,
        item_Name: item.product.item_Name,
        item_Description: item.product.item_Description,
        item_Category: item.product.item_Category,
        item_Tags: item.product.item_Tags || [],
        item_Variant: variants,
        item_Rating: item.product.item_Rating || 0,
        item_Orders: item.product.item_Orders || 0,
        texture_3D: item.product.texture_3D,
        type3D: item.product.type3D,
        shop_Name: item.product.shop_Name,
        shop_Id: item.product.shop_Id,
        is_Post: item.product.is_Post || false,
        reviews: item.product.reviews || [],
        is3D: item.product.is3D || false,
        discount: item.product.discount || 0,
        apply_Vouch: item.product.apply_Vouch,
        selectedVariant: currentVariant,
        shop: {
          shop_name: item.product.shop_Name,
          shop_Id: item.product.shop_Id
        }
      };
  
      navigate(`/product/${productData.item_Name}`, {
        state: { item: productData }
      });
    } catch (error) {
      console.error('Error processing product data:', error);
      setToast({
        show: true,
        message: 'Error viewing product details',
        type: 'error'
      });
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Update the useEffect for gender/bodyType changes
  useEffect(() => {
    // Only run if gender or bodyType changes
    if (!gender || !selectedBodyType) return;
  
    // Get URLs for default clothing
    const defaultTop = getTShirtURL();
    const defaultBottom = getShortsURL();
    console.log('Default clothing URLs:', { defaultTop, defaultBottom });
  
    // Update selected items while preserving existing selections
    setSelectedItems(prev => ({
      // Handle tops
      tops: prev.tops ? {
        ...prev.tops,
        product: {
          ...prev.tops.product,
          // Update the URL based on new gender/bodyType
          type3D: getModelURLForCategory(
            prev.tops.product.item_Category,
            gender,
            selectedBodyType
          )
        },
        key: `${gender}-${selectedBodyType}-${Date.now()}`
      } : null,
  
      // Handle bottoms
      bottoms: prev.bottoms ? {
        ...prev.bottoms,
        product: {
          ...prev.bottoms.product,
          // Update the URL based on new gender/bodyType
          type3D: getModelURLForCategory(
            prev.bottoms.product.item_Category,
            gender,
            selectedBodyType
          )
        },
        key: `${gender}-${selectedBodyType}-${Date.now()}`
      } : null,
  
      // Handle footwear
      footwear: prev.footwear ? {
        ...prev.footwear,
        key: `${gender}-${selectedBodyType}-${Date.now()}`
      } : null
    }));
  
  }, [gender, selectedBodyType]);

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
              onChange={(e) => {
                setSelectedBodyType(e.target.value);
                console.log('Current Body Type:', selectedBodyType);
                console.log('Current Gender:', gender);
                console.log('Body URL:', bodyTypeURLs[gender][selectedBodyType]);
              }}
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
                { label: "Bright", color: "" },
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

      {/* Add after the camera control buttons */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        <button
          onClick={handleAddSelectedToCart}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all
            ${Object.values(selectedItems).some(item => item) 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!Object.values(selectedItems).some(item => item) || addingToCart}
          title={!Object.values(selectedItems).some(item => item) ? "Select items to add to cart" : ""}
        >
          {addingToCart ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Adding to Cart...
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart"></i>
              {Object.values(selectedItems).some(item => item) 
                ? `Add ${Object.values(selectedItems).filter(item => item).length} Item${Object.values(selectedItems).filter(item => item).length > 1 ? 's' : ''} to Cart`
                : 'No Items Selected'}
            </>
          )}
        </button>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <img src="/emote/hmmm.png" alt="Loading" className="w-24 h-24 mx-auto animate-bounce" />
            <p className="mt-4 text-gray-600">Loading 3D Model...</p>
          </div>
        </div>
      }>
        <ThreeDErrorBoundary>
          <Canvas 
            camera={{ position: [0, 0, 100] }}
            shadows
            onError={(error) => {
              console.error('Canvas error:', error);
            }}
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
            
            {/* Wrap the models in the RotatingGroup */}
            <RotatingGroup>
              <Platform />
              {/* Avatar and Hair are always visible */}
              <Part 
                key={`body-${gender}-${selectedBodyType}`} 
                url={bodyTypeURLs[gender][selectedBodyType]} 
                position={[0, 0, 0]} 
                color={skincolor} 
              />
              {selectedHair && hairURLs[selectedHair] && (
                <Part 
                  key={`hair-${selectedHair}-${haircolor}`} 
                  url={hairURLs[selectedHair]} 
                  position={[0, 0, 0]} 
                  color={haircolor} 
                />
              )}

              {/* Top Wear with combined key */}
              <Part 
                key={`top-${gender}-${selectedBodyType}-${selectedItems.tops?.key || 'default'}-${Date.now()}`}
                url={selectedItems.tops 
                  ? getModelURLForCategory(selectedItems.tops.product.item_Category, gender, selectedBodyType)
                  : getTShirtURL()
                }
                position={[0, 0, 0]}
                texture={selectedItems.tops?.product.texture_3D}
                color={!selectedItems.tops ? "#FFFFFF" : undefined}
              />

              {/* Bottom Wear with combined key */}
              <Part 
                key={`bottom-${gender}-${selectedBodyType}-${selectedItems.bottoms?.key || 'default'}-${Date.now()}`}
                url={selectedItems.bottoms
                  ? getModelURLForCategory(selectedItems.bottoms.product.item_Category, gender, selectedBodyType)
                  : getShortsURL()
                }
                position={[0, 0, 0]}
                texture={selectedItems.bottoms?.product.texture_3D}
                color={!selectedItems.bottoms ? "#000000" : undefined}
              />

              {/* Footwear if selected */}
              {selectedItems.footwear && (
                <Part 
                  key={`footwear-${gender}-${selectedBodyType}-${selectedItems.footwear?.key || 'default'}-${Date.now()}`}
                  url={getModelURLForCategory(selectedItems.footwear.product.item_Category, gender, selectedBodyType)}
                  position={[0, 0, 0]}
                  texture={selectedItems.footwear.product.texture_3D}
                />
              )}
            </RotatingGroup>

            <OrbitControls 
              target={[0, 15, 0]}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              minDistance={10}
              maxDistance={35}
              enablePan={true}
              panSpeed={0.5}
              rotateSpeed={0.5}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Canvas>
        </ThreeDErrorBoundary>
      </Suspense>
    </div>
  </div>

          {/* Closet items */}


          {/* Action Buttons */}
          <div className="flex justify-center space-x-2 p-4 z-50">
            {isEditing ? (
              <>
                <button
                  className="p-2 w-40 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all z-50"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="p-2 w-40 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all z-50"
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
                    setShowLeftPanel(true); // Show the panel when Edit is clicked
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
      <div className="flex-1 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
  <h2 className="text-lg font-semibold mb-3">My Closet</h2>
  {loadingCloset ? (
    <div className="flex items-center justify-center h-full">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-gray-400" />
    </div>
  ) : closetItems.length === 0 ? (
    <div className="text-center text-gray-500">No items in closet</div>
  ) : (
    <div className="space-y-4">
      {['tops', 'bottoms', 'footwear'].map((category) => {
        const categoryItems = closetItems.filter(
          item => getClothingCategory(item.product?.item_Category) === category
        );

        if (categoryItems.length === 0) return null;

        return (
          <div key={category} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold capitalize">{category}</span>
                <span className="text-xs text-gray-500">({categoryItems.length})</span>
              </div>
              <i className={`fas fa-chevron-${expandedCategories[category] ? 'down' : 'right'} 
                text-gray-400 transition-transform duration-200`}
              />
            </button>

            <div className={`transition-all duration-300 ${
              expandedCategories[category] 
                ? 'max-h-[1000px] opacity-100' 
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              <div className="grid grid-cols-2 gap-3 p-3">
                {categoryItems.map((item) => {
                  const isSelected = selectedItems[category]?.product?.texture_3D === item.product.texture_3D;
                  
                  return (
                    <div
                      key={`${item.product_id}-${item.variant?.variant?.variant_Name}`}
                      className={`relative group p-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <button
                        onClick={() => handleTextureSelect(item)}
                        className="w-full text-left"
                      >
                        <img 
                          src={item.variant?.imagePath || '/placeholder.png'} 
                          alt={item.product?.item_Name}
                          className="w-full h-24 object-contain mb-2"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-medium truncate">
                            {item.product?.item_Name}
                          </p>
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {item.product?.item_Category}
                          </span>
                        </div>
                      </button>
                      
                      <div className="mt-2 flex flex-col gap-1">
                        <button
                          onClick={() => handleViewProduct(item)}
                          className="w-full px-2 py-1 text-xs text-center bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
                        >
                          View Product
                        </button>
                        <button
                          onClick={() => handleRemoveFromCloset(item.id)}
                          className="w-full px-2 py-1 text-xs text-center bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
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

const getModelURLForCategory = (category, gender, bodyType) => {
  console.log('Getting model for:', { category, gender, bodyType });
  
  const urlMaps = {
    'Tshirt': tshirURLs,
    'Jersey': jerseyURLs,
    'Longsleeves': longsleevesURLs,
    'Shorts': shortsURLs,
    'Pants': pantsURLs,
    'Skirt': skirtURLs,
    'Shoes': footwearsURLs?.[gender]?.Shoes,
    'Boots': footwearsURLs?.[gender]?.Boots1,
  };

  // Get the appropriate model URL based on category, gender and body type
  const modelURL = urlMaps[category]?.[gender]?.[bodyType];
  console.log('Selected model URL:', modelURL);
  return modelURL;
};