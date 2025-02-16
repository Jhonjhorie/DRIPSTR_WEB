import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faHeart,
  faX,

} from "@fortawesome/free-solid-svg-icons";
import RateSymbol from "@/shared/products/rateSymbol";
import { averageRate } from "../hooks/useRate.ts";
import ItemOptions from "./itemOptions.js";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";
import addToCart from "../hooks/useAddtoCart.js";
import useCarts from "../hooks/useCart.js";
import AddtoCartAlert from "./alertDialog2.js";

const BuyConfirm = ({ item, onClose }) => {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [showAlert, setShowAlert] = useState(false);
  const { fetchDataCart } = useCarts();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    item?.item_Variant[0] || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    item?.item_Variant[0]?.sizes[0] || ""
  );

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

  const handleSelectedValues = (color, size) => {
    setSelectedColor(color);
    setSelectedSize(size);
  };

  const imagePreview = `${selectedColor.imagePath}`;

  const handleProductClick = () => {
    navigate(`/product/${item.item_Name}`, { state: { item } });
  };

  const onConfirm = () => {
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

    navigate(`/placeOrder`, { state: { selectedItems, solo } });
  };

  const handleAddToCart = async () => {
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
      onClose();
      document.getElementById("my_modal_4").close();
    }, 3000);

    fetchDataCart();
  };
  if (loadingP) {
    return (
      <div className="w-full relative pb-16 items-center justify-center bg-slate-300 flex flex-col gap-2 px-2 lg:px-8 h-[100%] py-4">
        <img
          src={require("@/assets/emote/hmmm.png")}
          alt="No Images Available"
          className="object-none mb-2 mt-1 w-[180px] h-[200px]"
        />
        <h1 className="top-20 bg-primary-color p-4 rounded-md drop-shadow-lg">
          Loading
        </h1>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="flex font-sans w-[60.40rem] bg-white rounded-lg shadow-lg overflow-hidden">
        {showAlert && (
          <div className=" w-[95%] absolute pb-16 items-center justify-center  flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
            <AddtoCartAlert />{" "}
          </div>
        )}

        <div className="flex-none w-80 relative">
          <img
            src={
              selectedColor.imagePath != null || ""
                ? imagePreview
                : require("@/assets/emote/success.png")
            }
            alt={selectedColor.variant_Name}
            className={`h-full w-full ${
              selectedColor.imagePath != null || ""
                ? "object-contain"
                : "object-none"
            }`}
          />
        </div>
        <div className="flex flex-wrap bg-slate-200 w-full">
          <div className="flex flex-col gap-2 justify-between   h-full w-full p-4 ">
            <div className="flex flex-col  z-10 ">
              <div className="flex justify-between">
                <div className="flex items-center gap-2 ">
                  <p className="text-xs font-medium">Shop:</p>
                  <div className="hover:underline px-2 text-xs py-0 min-h-6 h-6 btn-ghost btn duration-300 transition-all ">
                    {item.shop_Name || "No shop available"}
                  </div>
                </div>

                <div className="flex justify-end gap-2 items-center">
                  <div className="flex gap-1">
                  
                    <div className="flex gap-1 items-center">
                      <h2 className="text-xs font-medium ">
                        {averageRate(item.reviews) || "N/A"} 
                      </h2>
                      <RateSymbol item={averageRate(item.reviews)} size={"4"} />
                    </div>
                    <h2 className="text-xs font-medium">
                      {item.item_Orders} Sold {" "}
                    </h2>
                  </div>
                </div>
                <div className="flex justify-end gap-1 items-center">
                <button class="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800" >
                    <FontAwesomeIcon  icon={faHeart} />
                  </button>
                  <button class="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800" >
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                  </button>
                  <button
                onClick={onClose}
                class="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800" 
              >
                   <FontAwesomeIcon icon={faX} />
              </button>
                </div>
              </div>
              <h1 className="flex-auto text-2xl font-semibold text-slate-900">
                {item.item_Name}
              </h1>

              <div className="flex flex-col justify-between p-1  gap-4 mb-2"></div>
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
            </div>
            <div className="flex items-center justify-center gap-2">
              <label className="form-control w-20 max-w-xs">
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
                <div className="label justify-end">
                  <span className="label-text-alt">Only Number</span>
                </div>
              </label>
              <button className="btn btn-success" onClick={handleIncrement}>
                +
              </button>
              <button className="btn btn-error" onClick={handleDecrement}>
                -
              </button>
            </div>

            <div>
           
              <div className="justify-end flex flex-col mt-2  mb-3">
                <div className="flex justify-end">
                  <p className=" text-sm font-semibold lg:text-lg text-secondary-color">
                    Variant: {selectedColor?.variant_Name} - Size:{" "}
                    {selectedSize?.size} - Quantity: {quantity}
                  </p>
                </div>
                <div className="flex justify-end pl-2 ">
                  <p className="text-2xl text-primary-color">₱</p>
                  <h2 className="text-6xl font-bold text-primary-color">
                    {selectedSize != null
                      ? item.discount > 0
                        ? (
                            (Number(selectedSize?.price) || 0).toFixed(2) *
                            (1 - item.discount / 100) *
                            quantity
                          ).toFixed(2)
                        : (Number(selectedSize?.price) || 0).toFixed(2)
                      : "N/A"}
                  </h2>
                </div>
                <div className="justify-end flex items-end gap-2 ">
                  {item?.vouchers && (
                    <span className="text-lg font-bold border border-primary-color px-2 ">
                      SHOP VOUCHER
                    </span>
                  )}
                  <div className="flex justify-end items-center gap-2 flex-col">
                    {item?.discount > 0 && (
                      <div className="flex items-center">
                        <span className="text-lg text-white bg-primary-color border border-primary-color px-0.5 font-bold">
                          {item?.discount}%
                        </span>
                        <span className="text-3xl text-secondary-color px-1 font-bold opacity-50 line-through ">
                          ₱
                          {(Number(selectedSize?.price) || 0).toFixed(2) ||
                            "N/A"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className=" justify-end gap-2 items-center flex">
                <button
                  onClick={() => handleProductClick()}
                  className="btn btn-sm  btn-outline "
                >
                  Go to Product Page
                </button>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-sm btn-outline btn-primary  "
                >
                  Add to Cart
                </button>
                <button
                  onClick={onConfirm}
                  className="btn btn-sm btn-outline btn-primary  "
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <LoginFirst item={item} onClose={onClose} />;
  }
};

export default BuyConfirm;
