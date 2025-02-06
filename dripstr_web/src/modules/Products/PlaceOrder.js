import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "../../shared/mulletFirst.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '@/constants/supabase';
import SuccessAlert from "./components/alertDialog.js";

function PlaceOrder() {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
    const navigate = useNavigate();
  const selectedItems = location.state?.selectedItems; 
  const solo = location.state?.solo; 
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [shippingFee, setShippingFee] = useState(50); 

  if (!selectedItems || selectedItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">
          No items selected for order. Please return to the cart page.
        </p>
      </div>
    );
  }

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

  if (!isLoggedIn) {
    return (
      <div className="w-full relative pb-16 items-center justify-center bg-slate-300 flex flex-col gap-2 px-2 lg:px-8 h-[100%] py-4">
        <h1 className="absolute top-20 bg-red-500 p-4 rounded-md drop-shadow-lg">
          Error: You are not logged in
        </h1>
        <LoginFirst />
      </div>
    );
  }

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.size.price * item.qty,
    0
  );

  const grandTotal = totalPrice + shippingFee;

  const handlePlaceOrder = async () => {
    try {
 
      const orders = selectedItems.map((item) => ({
        acc_num: profile.id,
        prod_num: item.prod.id,
        quantity: item.qty,
        total_price: item.size.price * item.qty,
        payment_method: paymentMethod,
        payment_stamp: new Date().toISOString(), // Current timestamp
        order_variation: item.variant.variant_Name,
        order_size: item.size.size,
        shipping_addr: profile?.address || "No address provided",
        shipping_method: shippingMethod,
        shipping_fee: shippingFee,
        discount: item.prod.discount || 0, // Assuming discount is available in item.prod
        final_price:
          item.size.price * item.qty * (1 - (item.prod.discount || 0) / 100), // Include discount
        order_status: "Pending to Admin",
      }));

      // Insert each order individually into the Supabase table
      const { data, error } = await supabase
        .from("orders")
        .insert(orders)
        .select();

      if (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      } else {
        console.log("Orders placed successfully:", data);
        setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      navigate(`/`); // Redirect after 5 seconds
    }, 3000);
        
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="w-full relative pb-16 items-start justify-start bg-slate-300 flex flex-col gap-2 px-2 lg:px-8 h-[100%] py-4">
      
      {showAlert && <div className=" w-[95%] absolute pb-16 items-center justify-center  flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
   
      <SuccessAlert />    </div>}
      <h1 className="font-bold text-xl">Check Out</h1>
      <div className="flex flex-col gap-2 bg-slate-50 p-2 w-full border-t-primary-color border-t-2 rounded-md">
        <h1 className="font-semibold text-primary-color text-sm">
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
        <div className="flex flex-col gap-2 w-full rounded-md">
          {selectedItems.map((item) => {
            const variant = item.variant;
            const size = item.size;
            const qty = item.qty;
            const itemI = solo ? item.prod : item.prod;

            return (
              <div
                key={item.id}
                className="flex flex-row bg-white border-b-8 border-primary-color gap-2 py-3 pl-2 pr-4 rounded-md text-secondary-color drop-shadow-lg w-full justify-between items-center"
              >
                <div className="flex gap-2">
                  <div className="w-20 h-20 z-50 bg-slate-200 rounded-l-lg">
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
                    <h1 className="text-3xl font-semibold">
                      {itemI.item_Name}
                    </h1>
                    <h1 className="text-md mt-1">
                      Shop: {itemI.shop_Name}
                    </h1>
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-[0.65rem]">Variant / Size</h1>
                  <h1 className="text-md font-semibold">
                    {variant.variant_Name} / {size.size}
                  </h1>
                </div>
                <div className="text-center">
                  <h1 className="text-[0.65rem]">Price * Quantity</h1>
                  <h1 className="text-md font-semibold">
                    {size.price} * {qty}
                  </h1>
                </div>
                <div className="text-center">
                  <h1 className="text-[0.65rem]">Total</h1>
                  <h1 className="text-3xl font-semibold">
                    ₱{(size.price * qty).toFixed(2)}
                  </h1>
                </div>
              </div>
            );
          })}
          <div className="flex justify-end p-4 gap-4">
            <div>
          <h1 className="text-lg font-semibold">Total Price</h1>
            <h1 className="text-xl font-bold">
              ₱{totalPrice.toFixed(2)}
            </h1>
            </div>  <div>
            <h1 className="text-lg font-semibold">Shipping Fee</h1>
            <h1 className="text-xl font-bold">
               ₱{shippingFee}
            </h1>
              </div>  <div>
            <h1 className="text-lg font-semibold">Grand Total:</h1>
            <h1 className="text-5xl font-bold">
               ₱{grandTotal.toFixed(2)}
            </h1>
            </div>
          </div>
        </div>
      </div>

     <div className="flex flex-row w-full justify-between items-start">
      <div className="flex flex-col gap-2 mb-4 ">
        <h1 className="font-bold text-xl">Payment Method:</h1>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="radio radio-primary"
            />
            <span>Cash on Delivery (COD)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="Gcash"
              checked={paymentMethod === "Gcash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="radio radio-primary"
            />
            <span>Gcash</span>
          </label>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="flex flex-col gap-2 ">
        <h1 className="font-bold text-xl">Shipping Details:</h1>
        <div className="flex flex-row gap-5">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Shipping Method</span>
            </div>
            <select
              className="select select-bordered"
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
            >
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Shipping Fee</span>
            </div>
            <input
              type="number"
              value={shippingFee}
              onChange={(e) => setShippingFee(Number(e.target.value))}
              className="input input-bordered"
              disabled
            />
          </label>
        </div>
      </div>
    
      <div className="flex justify-end p-4">
        <button
          className="btn glass py-4 text-xl bg-primary-color h-20 w-auto px-10"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
      </div>
    </div>
  );
}

export default PlaceOrder;