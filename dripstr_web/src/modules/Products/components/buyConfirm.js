import React, { useState, useEffect, act } from "react";
import { useNavigate } from "react-router-dom";
import RateSymbol from "@/shared/products/rateSymbol";
import { averageRate } from "../hooks/useRate.ts";

const BuyConfirm = ({ action, item, onClose }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(item.colorVariant[0] || ""); 
  const [selectedSize, setSelectedSize] = useState(item.sizeVariant?.[0] || "");
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

  const handleRadioChange = (event, type) => {
    const value = event.target.value;
    if (type === "variant") {
      setSelectedColor(value);
    } else if (type === "sizes") {
      setSelectedSize(value);
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${item.product}`, { state: { item } });
  };

  return (
    <div className="lg:w-[60rem]  p-0  overflow-y-auto overflow-x-hidden lg:overflow-hidden custom-scrollbar  modal-box">
      <img
        src={require("@/assets/images/starDrp.png")}
        className=" absolute bottom-0 lg:-bottom-8 -left-12 z-0 opacity-50 shadow-2xl
          w-[35%] h-[50%] object-contain"
      />
      <div className="flex flex-col gap-2 justify-between  bg-slate-300 h-full w-full p-4 ">
        <div className="flex flex-col gap-1 z-10 ">
          <h1 className="text-lg font-bold text-secondary-color  p-1 rounded-t-md ">        
            {isCart ? 'Add to Cart': 'Buy Now'} 
          </h1>
          <div className="items-center justify-center bg-slate-50 rounded-md flex">
            <h1 className="text-2xl font-bold text-secondary-color  p-1 pb-2 rounded-t-md ">
              {item.product}
            </h1>
          </div>
          <div className="flex flex-col justify-between p-1  gap-4 mb-2">
            <div className="flex justify-between gap-2 items-center">
              <div className="flex items-center gap-2 ">
                <p className="text-sm font-medium">Shop:</p>
                <div className="hover:underline  py-0 min-h-8 h-8 btn-ghost btn duration-300 transition-all ">
                  {item.shop}
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
              {[
                { label: "Variant", items: item.colorVariant },
                {
                  label: "Sizes",
                  items: item.sizeVariant ? item.sizeVariant : [],
                }, // Ensure size is handled as an array
              ].map((choice, choiceIndex) => (
                <div key={choiceIndex} className="flex items-center gap-2">
                  <p className="text-lg font-medium">{choice.label}:</p>
                  <div className="flex gap-1">
                    {choice.items.map((choiceItem, index) => (
                      <label
                        key={index}
                        className="p-0 form-control btn  text-xs cursor-pointer flex items-center justify-center duration-300 transition-all min-w-10 h-8 bg-slate-50"
                      >
                        <input
                          type="radio"
                          name={`radio-${choice.label.toLowerCase()}`}
                          value={choiceItem}
                          className="hidden peer"
                          checked={
                            choice.label.toLowerCase() === "variant"
                              ? choiceItem === selectedColor
                              : choiceItem === selectedSize
                          }
                          onChange={(e) =>
                            handleRadioChange(e, choice.label.toLowerCase())
                          }
                        />
                        <span className="peer-checked:bg-primary-color peer-checked:opacity-100 opacity-50 peer-checked:text-white w-full h-full flex items-center justify-center p-2 rounded-md duration-300 transition-all glass btn">
                          {choiceItem}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
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
          <p className="text-lg text-secondary-color">Variant: {selectedColor} - Size: {selectedSize} - Quantity: {quantity}</p>
          </div>
            <div className="flex justify-end pl-2 ">
          
              <p className="text-2xl text-primary-color">₱</p>
              <h2 className="text-6xl font-bold text-primary-color">
                {item.discount > 0
                  ? (item.price * (1 - item.discount / 100) * quantity).toFixed(2)
                  : item.price.toFixed(2) * quantity}
              </h2>
            </div>
            <div className="justify-end flex items-end gap-2 ">
              {item.voucher && (
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
  );
};

export default BuyConfirm;