import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RateSymbol from "@/shared/products/rateSymbol";
import { averageRate } from "../hooks/useRate.ts";
import ItemOptions from "./itemOptions.js";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";



const SUPABASE_STORAGE_URL = 'https://pbghpzmbfeahlhmopapy.supabase.co/storage/v1/object/public';

 

const BuyConfirm = ({ action, item, onClose }) => {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(item?.color_variant[0] || ""); 
  const [selectedSize, setSelectedSize] = useState(item?.size_variant[0] || "");
  
  const [isCart, setIsCart] = useState(action === 'cart');

  useEffect(() => {
    setIsCart(action === 'cart');
  }, [action]);

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

  const imagePreview =`${SUPABASE_STORAGE_URL}/${selectedColor.image}`

  const handleProductClick = () => {
    navigate(`/product/${item.product}`, { state: { item } });
  };


  if(isLoggedIn){
  return (
    <div className="relative right-16 sm:-right-40 ">
      <div className="absolute right-[75%] top-[55%] sm:right-[100%] sm:-top-4 w-[30vw] h-[30vw] z-50 bg-slate-50 rounded-l-lg">
        <img
          src={imagePreview}
          alt={selectedColor.name}
          className="h-full w-full object-contain"
        />
        
      </div>
      <div className="lg:w-[80rem] rounded-md w-full justify-center -top-20 relative items-center p-0  overflow-y-auto custom-scrollbar  modal-box  bg-slate-300 gap-2 z-40">
        <img
          src={require("@/assets/images/starDrp.png")}
          className=" absolute bottom-0 lg:-bottom-0 -left-12 z-0 opacity-50 
          w-[35%] h-[50%] object-contain"
        />
        <div className="flex flex-col gap-2 justify-between   h-full w-full p-4 ">
          <div className="flex flex-col gap-1 z-10 ">
            <h1 className="text-lg font-bold text-secondary-color  p-1 rounded-t-md ">
              {isCart ? "Add to Cart" : "Buy Now"}
            </h1>
            <div className="items-center justify-center bg-slate-50 rounded-md flex">
              <h1 className="text-2xl font-bold text-secondary-color  p-1 pb-2 rounded-t-md ">
                {item.product_name}
              </h1>
            </div>
            <div className="flex flex-col justify-between p-1  gap-4 mb-2">
              <div className="flex justify-between gap-2 items-center">
                <div className="flex items-center gap-2 ">
                  <p className="text-sm font-medium">Shop:</p>
                  <div className="hover:underline  py-0 min-h-8 h-8 btn-ghost btn duration-300 transition-all ">
                    {item.shop?.shop_name || "No shop available"}
                  </div>
                </div>
                <div className="flex gap-1">
                  <h2 className="text-base font-medium">{item.sold} Sold / </h2>
                  <div className="flex gap-1 items-center">
                    <h2 className="text-base font-medium text-primary-color">
                      {averageRate(item.reviews) || "N/A"}
                    </h2>
                    <RateSymbol item={averageRate(item.reviews)} size={"4"} />
                  </div>
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
          </div>
          <div className="flex items-center justify-center gap-2">
            <label className="form-control w-full max-w-xs">
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
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost fixed right-2 top-2"
            >
              ✕
            </button>
            <div className="justify-end flex flex-col mt-2  mb-3">
              <div className="flex justify-end">
                <p className=" text-sm font-semibold lg:text-lg text-secondary-color">
                  Variant: {selectedColor.name} - Size: {selectedSize} -
                  Quantity: {quantity}
                </p>
              </div>
              <div className="flex justify-end pl-2 ">
                <p className="text-2xl text-primary-color">₱</p>
                <h2 className="text-6xl font-bold text-primary-color">
                  {item.discount > 0
                    ? (
                        item.price *
                        (1 - item.discount / 100) *
                        quantity
                      ).toFixed(2)
                    : item.price.toFixed(2) * quantity}
                </h2>
              </div>
              <div className="justify-end flex items-end gap-2 ">
                {item.vouchers && (
                  <span className="text-lg font-bold border border-primary-color px-2 ">
                    SHOP VOUCHER
                  </span>
                )}
                <div className="flex justify-end items-center gap-2 flex-col">
                  {item.discount > 0 && (
                    <div className="flex items-center">
                      <span className="text-lg text-white bg-primary-color border border-primary-color px-0.5 font-bold">
                        {item.discount}%
                      </span>
                      <span className="text-3xl text-secondary-color px-1 font-bold opacity-50 line-through ">
                        ₱{item.price.toFixed(2) || "N/A"}
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
                onClick={onClose}
                className="btn btn-sm btn-outline btn-primary  "
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}else{
  return <LoginFirst />
}
};

export default BuyConfirm;
