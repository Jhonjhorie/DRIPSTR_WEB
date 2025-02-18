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
import AuthModal from "@/shared/login/Auth.js";
import useCarts from "../hooks/useCart.js";
import AlertDialog from "./alertDialog2.js";
import ReportDialog from "./reportModal.js";

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
    setImagePreview(color.imagePath);
  };

  const handleProductClick = () => {
    navigate(`/product/${item.item_Name}`, { state: { item } });
  };
  const handleShopClick = () => {
    navigate(`/product/merchant-shop/${item.shop.shop_Name}`, { state: { shop: item.shop } });
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

  const closeModalRep = () => {
    document.getElementById("my_modal_report").close();
  };

  const mulletReport = () => {
    document.getElementById("my_modal_report").showModal();
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
      }, 3000);
    } else {
      setActionLog("cart");
      setLoginDialog(true);
    }
  };
  if (loadingP) {
    return (
      <div className="w-[60.40rem] rounded-lg relative pb-16 items-center justify-center bg-slate-100 flex flex-col  px-2 lg:px-8 h-[27rem] py-4">
        <img
          src={require("@/assets/emote/hmmm.png")}
          alt="No Images Available"
          className="object-none mb-2 mt-1 w-[180px] h-[200px] drop-shadow-customViolet animate-pulse"
        />
        <h1 className=" font-[iceland] font-semibold text-3xl  rounded-md drop-shadow-lg">
          Loading
        </h1>
      </div>
    );
  } else {
    return (
      <div className=" font-sans w-[60.40rem] h-[26.5rem] bg-slate-50 rounded-lg shadow-lg overflow-hidden">
        {mascot ? (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <img
              src={require("@/assets/emote/success.png")}
              alt="No Images Available"
              className="object-contain animate-bounce  drop-shadow-customViolet "
            />
            <span className="text-3xl">Item added to cart successfully!</span>
          </div>
        ) : (
          <div className="flex">
            <div className="flex-none w-80 relative items-center flex justify-center">
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
            <div className="flex flex-wrap h-full bg-slate-200 w-full">
              <div className="flex flex-col justify-start   h-full w-full p-4 ">
                <div className="flex flex-col   ">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1 ">
                      <p className="text-xs text-slate-400 font-medium">
                        Shop:
                      </p>
                      <button
                      onClick={handleShopClick}
                      className=" px-1 text-xs py-0 min-h-6 h-6 rounded-md btn-ghost btn duration-300 transition-all ">
                        {item.shop_Name || "No shop available"}
                      </button>
                    </div>

                    <div className="flex justify-end gap-2 items-center">
                      <div className="flex gap-1">
                        <div className="flex gap-1 items-center">
                          <h2 className="text-xs font-medium ">
                            {averageRate(item.reviews) || "N/A"}
                          </h2>
                          <RateSymbol
                            item={averageRate(item.reviews)}
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
                      {isLoggedIn && (
                        <button class="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800">
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                      )}
                      {isLoggedIn && (
                        <button
                          onClick={mulletReport}
                          class="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
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
                  <h1 className="flex-auto text-3xl font-semibold text-slate-900 line-clamp-1">
                    {item.item_Name}
                  </h1>

                  <div className="flex flex-row justify-between py-2  border-b border-slate-400">
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
                        <button
                          className="btn btn-error"
                          onClick={handleDecrement}
                        >
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
                  <div className=" justify-end gap-4 items-center flex h-auto ">
                    <button
                      onClick={() => handleProductClick()}
                      className="h-10 px-6 font-semibold rounded-md bg-transparent border-slate-400 border  text-slate-400 hover:text-primary-color hover:bg-slate-50 duration-300 transition-all"
                    >
                      More Detail
                    </button>
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

            {loginDialog && (
              <AuthModal
                isOpen={loginDialog}
                onClose={() => setLoginDialog(false)}
                action={actionLog}
                order={{
                  itemT: item,
                  qty: quantity,
                  variant: selectedColor,
                  size: selectedSize,
                  to_order: true,
                }}
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
                className="modal-backdrop min-h-full min-w-full absolute "
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
