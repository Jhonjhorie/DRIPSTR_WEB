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
import LoginFirst from "@/shared/mulletFirst";
import useCarts from "../hooks/useCart.js";

const EditConfirm = ({ action, item, onClose }) => {
  const { fetchDataCart, handleEdit } = useCarts();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(item?.qty || 1);
  const [selectedColor, setSelectedColor] = useState(item?.variant);
  const [selectedSize, setSelectedSize] = useState(item?.size);
  const [imagePreview, setImagePreview] = useState(selectedColor?.imagePath || "");
  const [disabtn, setDisabtn] = useState(true);

  // Automatically fetch selectedColor and selectedSize from the item prop
  useEffect(() => {
    if (item) {
      setSelectedColor(item.variant);
      setSelectedSize(item.size);
      setQuantity(item.qty);
    }
  }, [item]);

  // Update imagePreview when selectedColor changes
  useEffect(() => {
    if (selectedColor?.imagePath) {
      setImagePreview(selectedColor.imagePath);
    } else {
      setImagePreview("");
    }
  }, [selectedColor]);

  // Disable the Update button if selectedColor or selectedSize is null
  useEffect(() => {
    if (selectedColor && selectedSize) {
      setDisabtn(false); // Enable the button
    } else {
      setDisabtn(true); // Disable the button
    }
  }, [selectedColor, selectedSize]);

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

  const handleProductClick = () => {
    navigate(`/product/${item?.prod.item_Name}`, { state: { item } });
  };

  const handleEditBtn = () => {
    handleEdit(item, quantity, selectedColor, selectedSize);
    onClose();
  };

  return (
    <div className="flex font-sans w-[60.40rem] h-[27rem] bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex-none w-80 relative">
        <img
          src={
            imagePreview && imagePreview !== ""
              ? imagePreview
              : require("@/assets/emote/success.png")
          }
          alt={selectedColor?.variant_Name}
          className={`h-full w-full ${
            selectedColor?.imagePath ? "object-contain" : "object-none"
          }`}
        />
      </div>
      <div className="flex flex-wrap bg-slate-200 w-full">
        <div className="flex flex-col justify-start h-full w-full p-4">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <p className="text-xs text-slate-400 font-medium">Shop:</p>
                <div className="px-1 text-xs py-0 min-h-6 h-6 rounded-md btn-ghost btn duration-300 transition-all">
                  {item?.prod.shop_Name || "No shop available"}
                </div>
              </div>

              <div className="flex justify-end gap-2 items-center">
                <div className="flex gap-1">
                  <div className="flex gap-1 items-center">
                    <h2 className="text-xs font-medium">
                      {averageRate(item?.prod.reviews) || "N/A"}
                    </h2>
                    <RateSymbol item={averageRate(item?.prod.reviews || [])} size={"4"} />
                  </div>
                  <h2 className="text-xs font-medium">
                    {item?.prod.item_Orders}{" "}
                    <span className="text-slate-400 font-normal">Sold</span>
                  </h2>
                </div>
              </div>
              <div className="flex justify-end gap-1 items-center">
                <button className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800">
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800">
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                </button>
                <button
                  onClick={onClose}
                  className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            </div>
            <h1 className="flex-auto text-3xl font-semibold text-slate-900">
              {item?.prod.item_Name}
            </h1>

            <div className="flex flex-row justify-between py-2 border-b border-slate-400">
              <div className="flex flex-col gap-2">
                <ItemOptions
                  item={item?.prod}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  onSelectedValuesChange={handleSelectedValues}
                />
              </div>
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
                    {item?.prod.vouchers && (
                      <span className="text-lg font-bold border border-primary-color px-2">
                        SHOP VOUCHER
                      </span>
                    )}
                    <div className="flex justify-end items-center gap-2">
                      {item?.prod.discount > 0 && (
                        <div className="flex items-center justify-end">
                          <span className="text-sm text-white bg-primary-color border opacity-80 border-primary-color px-0.5 font-bold">
                            {item?.prod.discount}%
                          </span>
                          <span className="text-lg text-secondary-color px-1 font-bold opacity-50 line-through">
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
            <div className="justify-end gap-4 items-center flex h-auto">
              <button
                onClick={() => handleProductClick()}
                className="h-10 px-6 font-semibold rounded-md bg-transparent border-slate-400 border text-slate-400 hover:text-primary-color hover:bg-slate-50 duration-300 transition-all"
              >
                More Detail
              </button>
              <button
                onClick={handleEditBtn}
                disabled={disabtn} // Disable the button if disabtn is true
                className="h-10 px-6 font-semibold rounded-md bg-secondary-color border-black border-b-2 border-r-2 text-white hover:text-primary-color hover:bg-slate-50 duration-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditConfirm;