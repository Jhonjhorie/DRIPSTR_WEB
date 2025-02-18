import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "../../shared/mulletFirst.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/constants/supabase";
import SuccessAlert from "./components/alertDialog.js";
import GcashDialog from "./components/GcashDialog.js";

function PlaceOrder() {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItems = location.state?.selectedItems;
  const solo = location.state?.solo;
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPostcode, setSelectedPostcode] = useState("");
  const [shippingFee, setShippingFee] = useState(50);

  const closeModalGcash = () => {
    document.getElementById("my_modal_gcash").close();
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data, error } = await supabase
          .from("addresses")
          .select("id, address, postcode, is_default_shipping")
          .eq("user_id", profile.id);

        if (error) throw error;

        if (data.length > 0) {
          setAddresses(data);
          const defaultAddress = data.find((addr) => addr.is_default_shipping);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress.id);
            setSelectedPostcode(defaultAddress.postcode);
          } else {
            setSelectedAddress(data[0].id);
            setSelectedPostcode(data[0].postcode);
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err.message);
      }
    };

    fetchAddresses();
  }, [profile]);

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
    (sum, item) =>
      sum +
      (item.prod.discount
        ? item.size.price * (1 - item.prod.discount / 100)
        : item.size.price) *
        item.qty,
    0
  );

  const grandTotal = totalPrice + shippingFee;

  const sendOrder = async () => {
    try {
      const orders = selectedItems.map((item) => ({
        acc_num: profile.id,
        prod_num: item.prod.id,
        quantity: item.qty,
        total_price: item.size.price * item.qty,
        payment_method: paymentMethod,
        payment_stamp: new Date().toISOString(), // Current timestamp
        order_variation: item.variant,
        order_size: item.size,
        shipping_addr: selectedAddress || "No address provided",
        shipping_postcode: selectedPostcode || "No postcode provided",
        shipping_method: shippingMethod,
        shipping_fee: shippingFee,
        discount: item.prod.discount || 0, // Assuming discount is available in item.prod
        final_price:
          (item.prod.discount
            ? item.size.price * (1 - item.prod.discount / 100)
            : item.size.price) * item.qty,
        order_status: "Pending to Admin",
      }));

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
  }

  const handlePlaceOrder = async () => {
    if(paymentMethod == "COD"){
await sendOrder();
    }else if(paymentMethod == "Gcash"){
      document.getElementById("my_modal_gcash").showModal();
    }
  };

  return (
    <div className="w-full relative items-start justify-start bg-slate-300 flex flex-col font-[iceland] gap-2 px-2 lg:px-8 h-[100%] py-4">
       <dialog
              id="my_modal_gcash"
              className="modal modal-bottom sm:modal-middle absolute z-[60] right-4 sm:right-0"
            >
              <GcashDialog
                onClose={closeModalGcash}
                order={sendOrder}
                total={grandTotal}
              />
              <form
                method="dialog"
                className="modal-backdrop min-h-full min-w-full absolute "
              >
                <button onClick={closeModalGcash}></button>
              </form>
            </dialog>
      {showAlert && (
        <div className=" w-[95%] absolute pb-16 items-center justify-center  flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
          <SuccessAlert />{" "}
        </div>
      )}
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
          <div className="flex flex-col w-full ml-4 pr-16 text-md">
      <label className="form-control">
        <div className="label py-0">
          <span className="label-text">Address</span>
        </div>
        <div className="flex w-full gap-4">
          {/* Address Dropdown */}
          <select
            className="select min-h-[2.5rem] h-[2.5rem] select-bordered w-full line-clamp-1
               font-semibold text-md"
            value={selectedAddress}
            onChange={(e) => {
              const selected = addresses.find((addr) => addr.id === e.target.value);
              setSelectedAddress(e.target.value);
              setSelectedPostcode(selected ? selected.postcode : "");
            }}
          >
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id} className="line-clamp-1
               font-semibold">
                {addr.address}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered min-h-[2.5rem] h-[2.5rem] w-32"
            value={selectedPostcode}
            disabled
          >
            <option value={selectedPostcode}>{selectedPostcode}</option>
          </select>
        </div>
      </label>
    </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h1 className="font-bold text-xl">Products Ordered:</h1>
        <div className="flex flex-col gap-2 w-full rounded-md h-72  overflow-y-auto custom-scrollbar pr-2">
          {selectedItems.map((item) => {
            const variant = item.variant;
            const size = item.size;
            const qty = item.qty;
            const itemI = item.prod;

            return (
              <div
                key={item.id}
                className="flex flex-row bg-white border-t-2 border-primary-color gap-2 py-3 pl-2 pr-4 rounded-md text-secondary-color drop-shadow-lg w-full justify-between items-center"
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
                    <h1 className="text-md mt-1">Shop: {itemI.shop_Name}</h1>
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
                    {itemI.discount
                      ? size.price * Number(1 - itemI.discount / 100)
                      : size.price}{" "}
                    * {qty}
                  </h1>
                </div>
                <div className="text-center">
                  <h1 className="text-[0.65rem]">Total</h1>
                  <h1 className="text-3xl font-semibold">
                    ₱
                    {(
                      (itemI.discount
                        ? size.price * Number(1 - itemI.discount / 100)
                        : size.price) * qty
                    ).toFixed(2)}
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-row w-full justify-between items-start font-[iceland]">
        <div className="flex flex-col gap-4 bg-slate-50 p-4 border-t-primary-color border-t-2 rounded-md h-40 w-[25%]">
          <h1 className="font-bold text-xl">Payment Method:</h1>
          <div className="flex flex-col gap-4">
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
        <div className="flex flex-col gap-4 bg-slate-50 p-4 border-t-primary-color border-t-2 rounded-md h-40 w-[30%]">
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
        <div className="flex flex-row items-center w-[40%] h-40  justify-center gap-2">
          <div className="flex flex-col justify-end gap-4 items-end px-2">
            <div className="flex justify-end gap-4 items-end">
              <div>
                <h1 className="label-text text-xs text-slate-400">
                  Total Price
                </h1>
                <h1 className="text-xl font-bold text-end">
                  ₱{totalPrice.toFixed(2)}
                </h1>
              </div>{" "}
              <div>
                <h1 className="label-text text-xs text-slate-400">
                  Shipping Fee
                </h1>
                <h1 className="text-xl font-bold text-end">₱{shippingFee}</h1>
              </div>{" "}
            </div>
            <p className="label-text text-xs text-slate-700 text-end">
              By clicking <span className="font-bold">Place Order</span>, I
              state that I have read and understood the terms and conditions
            </p>
          </div>
          <div className="flex flex-col justify-start w-full gap-2 ">
            <div>
              <h1 className="label-text text-sm font-semibold text-slate-400">
                Grand Total:
              </h1>
              <h1 className="text-5xl font-bold">₱{grandTotal.toFixed(2)}</h1>
            </div>
            <button
              className="h-12 px-6 w-full font-semibold rounded-md bg-primary-color border-secondary-color border-b-2 border-r-2 text-white hover:text-primary-color hover:bg-slate-50 duration-300 transition-all"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
