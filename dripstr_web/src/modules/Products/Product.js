import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faHeart } from "@fortawesome/free-solid-svg-icons";
import RateSymbol from "@/shared/products/rateSymbol";
import { averageRate } from "./hooks/useRate.ts";
import RatingSection from "./components/RatingSection.js";
import ItemOptions from "./components/itemOptions.js";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";
import addToCart from "./hooks/useAddtoCart.js";
import useCarts from "./hooks/useCart.js";
import ReportDialog from "./components/reportModal.js";
import AlertDialog from "./components/alertDialog2.js";
import AuthModal from "../../shared/login/Auth.js";

function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;
  const [showAlert, setShowAlert] = useState(false);
  const { fetchDataCart } = useCarts();
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [selectedColor, setSelectedColor] = useState(item?.item_Variant[0] || "");
  const [selectedSize, setSelectedSize] = useState(item?.item_Variant[0]?.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
   const [loginDialog, setLoginDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const handleSelectedValues = (color, size) => {
    setSelectedColor(color);
    setSelectedSize(size);
  };

  const handleShopClick = () => {
    navigate(`/product/merchant-shop/${item.shop.shop_Name}`, { state: { shop: item.shop } });
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity(1);
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
      setLoginDialog(true)

    }
  };
  const handleAddToCart = async () => {
    if (isLoggedIn) {
    if (!profile || !item) return;

    const response = await addToCart(
      profile.id,
      item.id,
      quantity,
      selectedColor,
      selectedSize
    );

    if (response.success) {
      console.log("Item added to cart successfully:", response.data);
    } else {
      console.error("Failed to add item to cart:", response.error);
    }
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    fetchDataCart();
  } else {
    setLoginDialog(true)

  }
  };

  const closeModalRep = () => {
    document.getElementById('my_modal_report').close();
  };

  const mulletReport = () => {
    document.getElementById('my_modal_report').showModal();
  }

  const imagePreview = `${selectedColor.imagePath}`;

 
  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">
          No product data found. Please return to the products page.
        </p>
      </div>
    );
  }

  

  return (
    <div className="w-full relative pb-16 items-start justify-start bg-slate-300 flex flex-col gap-2 px-2 lg:px-8 py-4">
         {loginDialog && (
              <AuthModal
                isOpen={loginDialog}
                onClose={() => setLoginDialog(false)}
                item={(item)}
              />
            )}
          
        <dialog
                      id="my_modal_report"
                      className="modal modal-bottom sm:modal-middle absolute z-[60] right-4 sm:right-0"
                    >
                      <ReportDialog item={item} onClose={closeModalRep} accId={profile.id} type={"product"} />
                      <form method="dialog" className="modal-backdrop min-h-full min-w-full absolute ">
                        <button onClick={closeModalRep}></button>
                      </form>
                    </dialog>
       {showAlert && (
          <div className=" w-[95%] absolute -top-60 justify-center  flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
            <AlertDialog emote={require("@/assets/emote/success.png")} text={"Item added to cart successfully!"} />
          </div>
        )}
      <img
        src={require("@/assets/images/starDrp.png")}
        className="absolute top-[-320px] -right-16 lg:right-[30%] z-0 opacity-30 w-[35%] h-[50%] object-contain"
      />
      <img
        src={require("@/assets/images/streetbg.png")}
        className="absolute top-[60rem] lg:top-[40rem] -left-[10%] z-0 opacity-30 w-[35%] h-[40%] object-contain"
      />
      <div className="justify-start w-full">
        <div className="max-w-[120rem] flex items-start justify-center gap-8 p-4 hero-content flex-col h-full w-full lg:flex-row">
          <div className="flex flex-col w-full">
            <div className="carousel w-full h-[70vh] bg-slate-50 z-10 rounded-md overflow-y-hidden">
              {imagePreview != null ? (
                <div className="carousel-item relative w-full justify-center items-center">
                  <img
                    src={imagePreview}
                    alt={`${selectedColor.variant_Name}`}
                    className="w-[40rem] h-[90%] object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={require("@/assets/emote/hmmm.png")}
                    alt="No Images Available"
                    className="w-[40rem] h-[35%] object-none"
                  />
                  <p className="text-center font-bold pr-8">No images available.</p>
                </div>
              )}
            </div>
            {item.str && (
              <div className="bg-primary-color w-full rounded-md pl-1">
                <button className="btn rounded-md w-full hover:text-primary-color btn-sm glass">
                  See in Avatar
                </button>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between z-10 lg:items-end min-h-[74vh] h-full w-full pt-6">
            <div className="flex flex-col w-full gap-1">
              <div className="flex justify-between items-center">
                <h1 className="text-5xl font-bold text-secondary-color p-1 pb-2 rounded-t-md">
                  {item.item_Name}
                </h1>
                {isLoggedIn &&
                <div className="flex gap-2">
                 
                  <button className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800">
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                  <button 
                  onClick={mulletReport}
                  className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800">

                    <FontAwesomeIcon icon={faTriangleExclamation} />
                  </button>
                  
                </div>
                }
              </div>
              <div className="h-0.5 mb-2 w-full bg-primary-color"></div>
              <div className="flex flex-col justify-between gap-4">
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Shop:</p>
                    <button 
                    onClick={handleShopClick}
                    className="hover:underline py-0 min-h-8 h-8 btn-ghost btn duration-300 transition-all">
                      {item.shop_Name || "No shop available"}
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <h2 className="text-base font-medium">
                      {item.item_Orders} Sold /{" "}
                    </h2>
                    <div className="flex gap-1 items-center">
                      <h2 className="text-base font-medium text-primary-color">
                        {averageRate(item.reviews) || "N/A"}
                      </h2>
                      <RateSymbol item={item.rate} size={"4"} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-2">
                    <ItemOptions
                      item={item}
                      selectedColor={selectedColor}
                      selectedSize={selectedSize}
                      onSelectedValuesChange={handleSelectedValues}
                    />
                  </div>
                </div>
                <div>
                <div className="justify-start flex flex-col  mb-10">
                <div className="flex justify-between gap-5 pl-2 ">
                  <div className="flex items-end justify-center gap-2">
                    <label className="form-control  w-20 max-w-xs">
                      <div className="label">
                        <span className="label-text">Quantity:</span>
                      </div>
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleInputChange}
                        placeholder="How many"
                        className="input input-bordered input-primary w-full max-w-xs"
                      />
                     
                    </label>
                    <button
                      className="btn btn-success"
                      onClick={handleIncrement}
                    >
                      +
                    </button>
                    <button className="btn btn-error" onClick={handleDecrement}>
                      -
                    </button>
                  </div>
                  <div className="items-center flex flex-col justify-center">
                    <div className="flex  justify-end pl-2">
                      <p className="text-2xl text-primary-color">₱</p>
                      <h2 className="text-6xl font-bold text-primary-color">
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
                        <span className="text-lg font-bold border border-primary-color px-2 ">
                          SHOP VOUCHER
                        </span>
                      )}
                      <div className="flex justify-end items-center gap-2 ">
                        {item?.discount > 0 && (
                          <div
                            className="flex items-center justify-end
                        "
                          >
                            <span className="text-sm text-white bg-primary-color border opacity-80 border-primary-color px-0.5 font-bold">
                              {item?.discount}%
                            </span>
                            <span className="text-lg text-secondary-color px-1 font-bold opacity-50 line-through ">
                              ₱
                              {(Number(selectedSize?.price) || 0).toFixed(2) ||
                                "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              </div>
            </div>

            <div>
              <div className="justify-end gap-2 mt-4 items-center flex">
              
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col z-10 w-full px-4">
        <div className="my-0 divider"></div>
        <p className="text-2xl font-bold">Product Description</p>
        <p className="mt-2 rounded-md bg-slate-100 p-2 max-h-60 overflow-y-auto custom-scrollbar">
          {item.description || "No description available."}
        </p>
      </div>
      <RatingSection item={item} />
    </div>
  );
}

export default Product;