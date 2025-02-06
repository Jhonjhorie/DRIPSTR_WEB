import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RateSymbol from "@/shared/products/rateSymbol";
import { averageRate } from "../hooks/useRate.ts";
import ItemOptions from "./itemOptions.js";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";
import addToCart from "../hooks/useAddtoCart.js";
import useCarts from "../hooks/useCart.js";
import AddtoCartAlert from "./alertDialog2.js";

 

const BuyConfirm = ({ action, item, onClose }) => {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [showAlert, setShowAlert] = useState(false);
  const { fetchDataCart } = useCarts();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(item?.item_Variant[0] || ""); 
  const [selectedSize, setSelectedSize] = useState(item?.item_Variant[0]?.sizes[0] || "");
  
  
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

  const imagePreview = `${selectedColor.imagePath}`

  const handleProductClick = () => {
    navigate(`/product/${item.item_Name}`, { state: { item } });
  };
  const handleToCart = () => {
    navigate(`/cart`, { state: { item } });
   
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
    
    navigate(`/placeOrder`, { state: { selectedItems, solo} });
   
  };

  const handleAddToCart = async () => {
    if (!profile || !item || !isCart) return;
  
    const response = await addToCart(profile.id, item.id, quantity, selectedColor, selectedSize);
  
    if (response.success) {
      console.log("Item added to cart successfully:", response.data);
    } else {
      console.error("Failed to add item to cart:", response.error);
    }
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      onClose();
      document.getElementById('my_modal_4').close();
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


  if(isLoggedIn){
  return (
    <div className="w-[40rem] relative right-16 sm:-right-40 ">
       {showAlert && <div className=" w-[95%] absolute pb-16 items-center justify-center  flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
   
   <AddtoCartAlert />    </div>}
      <div className="absolute right-[75%] top-[55%] sm:right-[100%] sm:-top-4 w-[30vw] h-[30vw] z-50 bg-slate-50 rounded-l-lg">
        <img
          src={selectedColor.imagePath != null || "" ? imagePreview : require("@/assets/emote/success.png")}
          alt={selectedColor.variant_Name}
          className={`h-full w-full ${selectedColor.imagePath != null || "" ? 'object-contain' : 'object-none'}`}
        />
        
      </div>
      <div className="lg:w-[200rem] max-w-[200rem] rounded-md w-[100rem]  justify-center -top-20 relative items-center p-0  custom-scrollbar  modal-box  bg-slate-300 gap-2 z-40">
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
                {item.item_Name}
              </h1>
            </div>
            <div className="flex flex-col justify-between p-1  gap-4 mb-2">
              <div className="flex justify-between gap-2 items-center">
                <div className="flex items-center gap-2 ">
                  <p className="text-sm font-medium">Shop:</p>
                  <div className="hover:underline  py-0 min-h-8 h-8 btn-ghost btn duration-300 transition-all ">
                    {item.shop_Name || "No shop available"}
                  </div>
                </div>
                <div className="flex gap-1">
                  <h2 className="text-base font-medium">{item.item_Orders} Sold / </h2>
                  <div className="flex gap-1 items-center">
                    <h2 className="text-base font-medium text-primary-color">
                      {averageRate(item.reviews) || "No"} Reviews
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
                  Variant: {selectedColor?.variant_Name} - Size: {selectedSize?.size} -
                  Quantity: {quantity}
                </p>
              </div>
              <div className="flex justify-end pl-2 ">
                <p className="text-2xl text-primary-color">₱</p>
                <h2 className="text-6xl font-bold text-primary-color">
                {selectedSize != null ? item.discount > 0
                      ? ((Number(selectedSize?.price) || 0).toFixed(2) * (1 - item.discount / 100) * quantity).toFixed(2)
                      : (Number(selectedSize?.price) || 0).toFixed(2) : 'N/A'}
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
                      ₱{(Number(selectedSize?.price) || 0).toFixed(2) || "N/A"}
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
              
                onClick={isCart ? () => handleToCart() : onClose}
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
