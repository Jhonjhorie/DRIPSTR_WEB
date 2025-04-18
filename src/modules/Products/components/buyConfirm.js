import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faHeart,
  faX,
  faCube,
} from "@fortawesome/free-solid-svg-icons";
import RateSymbol from "@/shared/products/rateSymbol";
import { averageRate } from "../hooks/useRate.ts";
import ItemOptions from "./itemOptions.js";
import useUserProfile from "@/shared/mulletCheck.js";
import AuthModal from "@/shared/login/Auth.js";
import useCarts from "../hooks/useCart.js";
import AlertDialog from "./alertDialog2.js";
import ReportDialog from "./reportModal.js";
import WishlistButton from "./subcomponents/WishlistButton.js";
import Product3DViewer from "./Product3DViewer";
import ClosetButton from "./subcomponents/ClosetButton";
import { supabase } from '../../../constants/supabase';

const BuyConfirm = ({ item, onClose }) => {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [loginDialog, setLoginDialog] = useState(false);
  const [actionLog, setActionLog] = useState("");
  const { fetchDataCart, addToCart } = useCarts();
  const navigate = useNavigate();
  const [mascot, setMascot] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imagePreview, setImagePreview] = useState(
    item?.item_Variant[0].imagePath || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    item?.item_Variant[0] || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    item?.item_Variant[0]?.sizes[0] || ""
  );
  const [show3DView, setShow3DView] = useState(false);
  const [avatarData, setAvatarData] = useState(null);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value > selectedSize.qty ? selectedSize.qty : value);
    } else if (e.target.value === "") {
      setQuantity(1);
    }
  };

  useEffect(() => {
    if (quantity > selectedSize.qty) {
      setQuantity(selectedSize.qty);
    }
  }, [selectedSize, quantity]);

  const handleSelectedValues = (color, size) => {
    setSelectedColor(color);
    setSelectedSize(size);
    
    // Update 3D preview if available
    if (show3DView && item.is3D) {
      // Force 3D viewer refresh
      setShow3DView(false);
      setTimeout(() => setShow3DView(true), 100);
    }
    
    // Update image preview
    setImagePreview(color.imagePath);
  };

  const handleProductClick = () => {
    navigate(`/product/${item.item_Name}`, { state: { item } });
    
  };

  const handleShopClick = () => {
    navigate(`/product/merchant-shop/${item.shop.shop_name}`, {
      state: { shop: item.shop },
    });
  };

  const closeModalRep = () => {
    const modal = document.getElementById("my_modal_report");
    if (modal) {
      modal.close();
    }
  };

  const mulletReport = () => {
    const modal = document.getElementById("my_modal_report");
    if (modal) {
      modal.showModal();
    }
  };

  const handleAddToCart = async () => {
    if (isLoggedIn) {
      if (!profile || !item) return;
      const response = await addToCart(
        item.id,
        quantity,
        selectedColor,
        selectedSize
      );

      if (response.success) {
        console.log("Item added to cart successfully:", response.data);
        await fetchDataCart();
      } else {
        console.error("Failed to add item to cart:", response.error);
      }
      setMascot(true);

      setTimeout(() => {
        setMascot(false);
        onClose();
      }, 2000);
    } else {
      setLoginDialog(true);
    }
  };

  const onConfirm = () => {
    if (isLoggedIn) {
      const solo = true;
      const formOrder = {
        acc_id: profile,
        prod: item,
        qty: quantity,
        variant: selectedColor,
        size: selectedSize,
        to_order: true,
      };

      const selectedItems = [formOrder];

      if (selectedItems.length === 0) {
        alert("No items selected for order. Please select at least one item.");
        return;
      }

      navigate(`/product/placeOrder`, { state: { selectedItems, solo } });
    } else {
      setActionLog("placeOrder");
      setLoginDialog(true);
    }
  };

  useEffect(() => {
    const fetchAvatarData = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user?.id) return;

      const { data, error } = await supabase
        .from('avatars')
        .select('bodytype')
        .eq('account_id', session.session.user.id)
        .single();

      if (error) {
        console.error('Error fetching avatar:', error);
        return;
      }

      setAvatarData(data);
    };

    fetchAvatarData();
  }, []);

  const getSuggestedSize = (bodyType) => {
    const sizeMap = {
      'Petite': 'S',
      'Slim': 'S', 
      'Average': 'M',
      'Broad': 'L',
      'PlusSize': 'XL'
    };
    return sizeMap[bodyType] || 'M'; // Default to M if no matching body type
  };

  const ItemOptionsWithSuggestion = ({ item, selectedColor, selectedSize, onSelectedValuesChange }) => {
    const suggestedSize = avatarData ? getSuggestedSize(avatarData.bodytype) : null;
  
    return (
      <div className="flex flex-col gap-2">
        {/* Colors */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-600">Colors:</label>
          <div className="flex flex-wrap gap-2">
            {item?.item_Variant?.map((variant, index) => (
              <button
                key={index}
                onClick={() => onSelectedValuesChange(variant, selectedSize)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedColor.variant_Name === variant.variant_Name
                    ? 'bg-secondary-color text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-all duration-200`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: variant.variant_Name.toLowerCase() }}
                  />
                  {variant.variant_Name}
                </div>
              </button>
            ))}
          </div>
        </div>
  
        {/* Sizes */}
        <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-600 flex items-center">
          Sizes:
          {suggestedSize && (
            <span className="ml-2 text-primary-color text-xs">
              (Recommended: {suggestedSize})
            </span>
          )}
          <SizeGuide />
        </label>
          <div className="flex flex-wrap gap-2">
            {selectedColor?.sizes?.map((size, index) => (
              <button
                key={index}
                onClick={() => onSelectedValuesChange(selectedColor, size)}
                disabled={size.qty === 0}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedSize.size === size.size
                    ? 'bg-secondary-color text-white'
                    : size.size === suggestedSize
                    ? 'bg-primary-color/10 border-2 border-primary-color text-primary-color'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${size.qty === 0 ? 'opacity-50 cursor-not-allowed' : ''} transition-all duration-200`}
              >
                <div className="flex flex-col items-center">
                  <span>{size.size}</span>
                  <span className="text-xs opacity-75">
                    {size.qty > 0 ? `${size.qty} left` : 'Out of stock'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const SizeGuide = () => {
    return (
      <div className="dropdown dropdown-hover">
        <label tabIndex={0} className="text-xs text-primary-color cursor-help ml-2">
          Size Guide
        </label>
        <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-white text-slate-700">
          <div className="card-body">
            <h3 className="font-bold text-sm">Size Recommendations</h3>
            <table className="text-xs">
              <tbody>
                <tr>
                  <td className="pr-4">Petite/Slim</td>
                  <td>Size S</td>
                </tr>
                <tr>
                  <td className="pr-4">Average</td>
                  <td>Size M</td>
                </tr>
                <tr>
                  <td className="pr-4">Broad</td>
                  <td>Size L</td>
                </tr>
                <tr>
                  <td className="pr-4">Plus Size</td>
                  <td>Size XL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loadingP) {
    return (
      <div className="w-full md:w-[60.40rem] rounded-lg relative pb-16 items-center justify-center bg-slate-100 flex flex-col px-2 lg:px-8 h-[27rem] ">
        <img
          src={require("@/assets/emote/hmmm.png")}
          alt="No Images Available"
          className="object-none mb-2 mt-1 w-[180px] h-[200px] drop-shadow-customViolet animate-pulse"
        />
        <h1 className="font-semibold text-2xl md:text-3xl rounded-md drop-shadow-lg">
          Loading
        </h1>
      </div>
    );
  } else {
    return (
      <div className="w-full  md:w-[60.40rem] h-full md:h-[27rem] bg-slate-50 rounded-lg shadow-lg z-50 overflow-hidden">
     
        {mascot ? (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <img
              src={require("@/assets/emote/success.png")}
              alt="No Images Available"
              className="object-contain animate-bounce drop-shadow-customViolet"
            />
            <span className="text-2xl md:text-3xl">
              Item added to cart successfully!
            </span>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row  h-full  md:pr-0 pr-4 justify-center items-center relative">
             {item.isOwner && (
          <span className="absolute left-2 top-2 text-xs bg-white bg-opacity-20 border border-secondary-color px-1 py-0.5 text-secondary-color rounded-md font-medium z-10">
            My Shop
          </span>
        )}{item.isCustomizable && (
          <span className="absolute left-2 bottom-2 text-xs bg-white bg-opacity-20 border border-secondary-color px-1 py-0.5 text-secondary-color rounded-md font-medium z-10">
           Available for Custom Order
          </span>
        )}
            {/* Image Section */}
            <div className="w-full flex-none md:w-80 relative items-center flex justify-center">
              
              
              <div className="relative group">
                
                {show3DView ? (
                  <div className="w-full h-[300px] md:h-[400px] relative">
                    <Product3DViewer
                      category={item.item_Category}
                      onClose={() => setShow3DView(false)}
                      className="w-full h-full"
                      selectedColor={selectedColor}
                      productData={{
                        ...item,
                        selectedSize: selectedSize // Pass the selected size
                      }}
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {item.is3D && (
                        <ClosetButton
                          profile={profile}
                          item={item}
                          isLoggedIn={isLoggedIn}
                          selectedColor={selectedColor}
                          className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 z-10 border border-slate-400 hover:border-slate-800"
                        />
                      )}
                      <button
                        onClick={() => setShow3DView(false)}
                        className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 z-10 border border-slate-400 hover:border-slate-800"
                        title="Close 3D View"
                      >
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-slate-400 hover:text-slate-800 text-base"
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={
                        selectedColor.imagePath != null || ""
                          ? imagePreview
                          : require("@/assets/emote/success.png")
                      }
                      alt={selectedColor.variant_Name}
                      className={`h-[320px] md:h-full w-full ${
                        selectedColor.imagePath != null || ""
                          ? "object-contain"
                          : "object-none"
                      }`}
                    />
                    {item.is3D && (
                      <button
                        onClick={() => setShow3DView(true)}
                        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 border border-slate-400 hover:border-slate-800"
                        title="View 3D Model"
                        
                      >
                        <FontAwesomeIcon
                          icon={faCube}
                          className="text-slate-400 hover:text-slate-800 text-lg"
                        />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-wrap h-full bg-gray-200 w-full">
              <div className="flex flex-col justify-start  h-full w-full p-4">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-0.5">
                      <p className="text-xs text-slate-400 font-medium">
                        Shop:
                      </p>
                      <button
                        onClick={handleShopClick}
                        className="px-0.5 md:px-1 text-xs py-0 min-h-6 h-6 rounded-md btn-ghost btn duration-300 transition-all w-36"
                      >
                        <p className="truncate">
                          {item.shop.shop_name || "No shop available"}
                        </p>
                      </button>
                    </div>

                    <div className="flex justify-end gap-2 items-center">
                      <div className="flex gap-1">
                        <div className="flex gap-1 items-center">
                          <h2 className="text-xs font-medium">
                          <span className="text-slate-400 font-normal">
                            Rating: 
                          </span>
                             {" "}
                            {item.averageRating != 1
                              ? `${item.averageRating}`
                              : `${item.averageRating}`}
                          </h2>
                          <RateSymbol
                            item={item.averageRating}
                            size={"4"}
                          />
                        </div>
                        <h2 className="text-xs font-medium">
                          {item.item_Orders}{" "}
                          <span className="text-slate-400 font-normal">
                            Sold
                          </span>
                        </h2>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1 items-center">
                        <WishlistButton
                        profile={profile}
                        item={item}
                        isLoggedIn={isLoggedIn}
                      />
                        {isLoggedIn && (
                          <button
                            onClick={mulletReport}
                            className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
                          >
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                          </button>
                        )}
                      <button
                        onClick={onClose}
                        class="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
                      >
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>
                  </div>
                  <h1 className="flex-auto text-xl md:text-2xl font-semibold text-slate-900 truncate">
                    {item.item_Name}
                  </h1>

                  <div className="flex flex-row justify-between py-2 border-b border-slate-400">
                    <div className="flex flex-col gap-2">
                      <ItemOptionsWithSuggestion
                        item={item}
                        selectedColor={selectedColor}
                        selectedSize={selectedSize}
                        onSelectedValuesChange={handleSelectedValues}
                      />
                     </div>
                  </div>
                </div>

                <div className="md:justify-between flex flex-col h-full w-full">
                  <div className="justify-start  flex flex-col mb-5">
                    <div className="flex flex-row justify-between gap-5 pl-2">
                      <div className="flex items-end justify-center gap-2">
                        <label className="form-control w-20 max-w-xs">
                          <div className="label">
                            <span className="label-text">Quantity:</span>
                          </div>
                          <input
                            type="number"
                            value={quantity}
                            onChange={handleInputChange}
                            placeholder="How many"
                            className="input input-bordered bg-white input-neutral w-full max-w-xs"
                          />
                        </label>
                        <button
                          className="btn  text-white w-5 btn-outline hover:bg-secondary-color hover:text-white bg-stone-800 bg-opacity-50"
                          onClick={handleIncrement}
                        >
                          +
                        </button>
                        <button
                          className="btn text-white w-5 hover:bg-secondary-color hover:text-white bg-stone-800 bg-opacity-50"
                          onClick={handleDecrement}
                        >
                          -
                        </button>
                      </div>
                      <div className="items-center flex flex-col justify-center">
                        <div className="flex justify-end pl-2">
                          <p className="text-xl md:text-2xl text-primary-color">
                            ₱
                          </p>
                          <h2 className="text-4xl md:text-6xl font-bold text-secondary-color">
                            {selectedSize
                              ? item?.discount > 0
                                ? (
                                    (Number(selectedSize?.price) || 0) *
                                    (1 - (Number(item?.discount) || 0) / 100) *
                                    (Number(quantity) || 1)
                                  ).toFixed(2)
                                : (
                                    (Number(selectedSize?.price) || 0) *
                                    (Number(quantity) || 1)
                                  ).toFixed(2)
                              : "N/A"}
                          </h2>
                        </div>
                        <div className="justify-end flex items-end gap-2 w-full">
                          {item?.vouchers && (
                            <span className="text-base md:text-lg font-bold border border-primary-color px-2">
                              SHOP VOUCHER
                            </span>
                          )}
                          <div className="flex justify-end items-center gap-2">
                            {item?.discount > 0 && (
                              <div className="flex items-center justify-end">
                                <span className="text-xs md:text-sm text-white bg-primary-color border opacity-80 border-primary-color px-0.5 font-bold">
                                  {item?.discount}%
                                </span>
                                <span className="text-base md:text-lg text-secondary-color px-1 font-bold opacity-50 line-through">
                                  ₱
                                  {(Number(selectedSize?.price) || 0).toFixed(
                                    2
                                  ) || "N/A"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="justify-end gap-4 items-center flex h-auto">
                    <button
                      onClick={() => handleProductClick()}
                      className="h-10 px-6 font-semibold rounded-md bg-transparent border-slate-400 border text-slate-400 hover:text-primary-color hover:bg-slate-50 duration-300 transition-all"
                    >
                      More Detail
                    </button>
                    {!item.isOwner &&

                    <>
                    <button
                      onClick={handleAddToCart}
                      className="h-10 px-6 font-semibold rounded-md bg-secondary-color border-black border-b-2 border-r-2 text-white hover:text-primary-color hover:bg-slate-50 duration-300 transition-all"
                    
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={onConfirm}
                      className="h-10 px-6 font-semibold rounded-md bg-primary-color border-secondary-color border-b-2 border-r-2 text-white hover:text-primary-color hover:bg-slate-50 duration-300 transition-all"
                   
                    >
                      Place Order
                    </button>
                    </> || <p className="h-10 px-2 font-semibold rounded-md bg-secondary-color  border-primary-color border-b-2 border-r-2 text-white text-center flex items-center cursor-not-allowed duration-300 transition-all" >Owner can't Order their Products</p>
                      }
                  </div>
              
                </div>
              </div>
            </div>

            {loginDialog && (
              <AuthModal
                isOpen={loginDialog}
                onClose={() => setLoginDialog(false)}
                item={item}
              />
            )}

            <dialog
              id="my_modal_report"
              className="modal modal-bottom sm:modal-middle absolute z-[60] right-4 sm:right-0"
            >
              <ReportDialog
                item={item}
                onClose={closeModalRep}
                accId={profile.id}
                type={"product"}
              />
              <form
                method="dialog"
                className="modal-backdrop min-h-full min-w-full absolute"
              >
                <button onClick={closeModalRep}></button>
              </form>
            </dialog>
          </div>
        )}
      </div>
    );
  }
};

export default BuyConfirm;
