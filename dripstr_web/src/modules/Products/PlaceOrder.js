import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import RateSymbol from "@/shared/products/rateSymbol";
import { averageRate } from "./hooks/useRate.ts";
import RatingSection from "./components/RatingSection.js";
import BuyConfirm from "./components/buyConfirm.js";
import ItemOptions from "./components/itemOptions.js";
import useGetImage from "./hooks/useGetImageUrl.js";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "../../shared/mulletFirst.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

function PlaceOrder() {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const location = useLocation();
  const formOrder = location.state?.formOrder;
  const variant = formOrder?.selectedColor;
  const size = formOrder?.selectedSize;
  const item = formOrder?.item;
  const qty = formOrder?.quantity;

  if (!formOrder) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">
          No product data found. Please return to the products page.
        </p>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="w-full relative pb-16 items-start justify-start bg-slate-300 flex flex-col gap-2 px-2 lg:px-8 h-[100%] py-4">
        <h1 className="font-bold text-xl">Check Out</h1>
        <div className="flex flex-col gap-2 bg-slate-50 p-2 w-full border-t-primary-color border-t-2 rounded-md">
          <h1 className="font-semibold text-primary-color text-sm">
            {" "}
            <FontAwesomeIcon icon={faLocationDot} /> Delivery Address
          </h1>
          <div className="flex flex-row gap-10 px-2">
            <div className="flex flex-col text-md font-bold">
              <p>
                {profile?.username || profile?.full_name || "No Name Provided"}
              </p>
              <p>{profile?.mobile || "No Contact Number Provided"}</p>
            </div>
            <div className="flex flex-col text-md">
              <p>
                {profile?.address || "Please add address first in the Profile"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
        <h1 className="font-bold text-xl">Products Ordered:</h1>
        <div className="flex flex-col gap-2 bg-slate-50 w-full rounded-md">
        
          <div className="flex flex-row bg-primary-color gap-2 py-3 px-2 rounded-md text-white drop-shadow-lg w-full justify-between items-center">
            <div className="flex gap-2">
              <div className="w-20 h-20 z-50 bg-slate-50 rounded-l-lg">
                <img
                  src={
                    variant.imagePath != null || ""
                      ? variant.imagePath
                      : require("@/assets/emote/success.png")
                  }
                  alt={variant.variant_Name}
                  className={`h-full w-full ${
                    variant.imagePath != null || ""
                      ? "object-contain"
                      : "object-none"
                  }`}
                />
              </div>
              <div>
                <h1 className="text-3xl font-semibold">{item.item_Name}</h1>
                <h1 className="text-md mt-1  ">Shop: {item.shop_Name}</h1>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-[0.65rem] ">Variant / Size</h1>
              <h1 className="text-md font-semibold">
                {variant.variant_Name} / {size.size}
              </h1>
            </div>

            <div className="text-center">
              <h1 className="text-[0.65rem] ">Price * Quantity</h1>
              <h1 className="text-md font-semibold">
                {size.price} * {qty}
              </h1>
            </div>

            <div className="text-center">
              <h1 className="text-[0.65rem] ">Total</h1>
              <h1 className="text-3xl font-semibold">{size.price * qty}</h1>
            </div>
          </div>
          <div>Shop Vouchers</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full relative pb-16 items-center justify-center bg-slate-300 flex flex-col gap-2 px-2 lg:px-8 h-[100%] py-4">
        <h1 className=" absolute top-20 bg-red-500 p-4 rounded-md drop-shadow-lg">
          {" "}
          Error: you are not log in
        </h1>
        <LoginFirst />
      </div>
    );
  }
}

export default PlaceOrder;
