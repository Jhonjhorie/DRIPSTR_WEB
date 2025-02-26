import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faTag,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/constants/supabase";
import SuccessAlert from "./components/alertDialog.js";
import GcashDialog from "./components/GcashDialog.js";
import TermsCon from "@/shared/products/termsCon";
import ApplyVoucher from "./components/ApplyVoucher.js";
import { format, addDays } from "date-fns";

function PlaceOrder() {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItems = location.state?.selectedItems;
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPostcode, setSelectedPostcode] = useState("");
  const [shippingFee, setShippingFee] = useState(50);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  const handleSelectedVouchers = (vouchers) => {
    setSelectedVouchers(vouchers);
  };

  const openModalTerms2 = () => {
    const modal = document.getElementById("my_modal_terms2");
    if (modal) {
      modal.showModal();
    }
  };

  const calculateEstimatedDelivery = () => {
    const today = new Date();
    const start = addDays(today, 5);
    const end = addDays(today, 7);

    const formattedStartDate = format(start, "MMM dd");
    const formattedEndDate = format(end, "dd, yyyy");
    const displayDateRange = `${formattedStartDate}-${formattedEndDate}`;

    setEstimatedDelivery(displayDateRange);

    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    };
  };

  const deleteItem = async (item) => {
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("acc_id", profile.id)
        .eq("prod_id", item.prod.id)
        .eq("variant->>variant_Name", item.variant.variant_Name)
        .eq("size->>id", item.size.id);
      if (error) {
        console.error("Error deleting item from cart:", error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: err.message };
    }
  };

  const groupItemsByShop = (items) => {
    const grouped = {};
    items.forEach((item) => {
      const shopName = item.prod.shop_Name;
      if (!grouped[shopName]) {
        grouped[shopName] = {
          items: [],
          shippingFee: shippingFee,
        };
      }
      grouped[shopName].items.push(item);
    });
    return grouped;
  };

  const calculateTotals = (items) => {
    const groupedItems = groupItemsByShop(items);

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalShippingFee = 0;
    let holder = 0;

    const shippingVoucher = selectedVouchers.find(
      (v) => v.voucher_type === "Shipping"
    );
    const productVouchers = selectedVouchers.filter(
      (v) => v.voucher_type !== "Shipping"
    );

    let isFirstShop = true;

    for (const shopName in groupedItems) {
      const { items: shopItems, shippingFee: shopShippingFee } =
        groupedItems[shopName];
      let shopTotal = shopItems.reduce(
        (sum, item) =>
          sum +
          (item.prod.discount
            ? item.size.price * (1 - item.prod.discount / 100)
            : item.size.price) *
            item.qty,
        0
      );

      totalPrice = shopTotal;
      if (isFirstShop && productVouchers.length > 0) {
        const productDiscount = productVouchers.reduce(
          (sum, v) => sum + v.discount,
          0
        );
        shopTotal = Math.max(0, shopTotal - productDiscount);
      }
      holder += shopTotal;

      if (isFirstShop && shippingVoucher) {
        totalShippingFee += Math.max(
          0,
          shopShippingFee - shippingVoucher.discount
        );
        isFirstShop = false;
      } else {
        totalShippingFee += shopShippingFee;
      }
    }

    totalDiscountPrice = holder;
    const grandTotal = totalDiscountPrice + totalShippingFee;

    return { totalPrice, grandTotal, totalShippingFee, totalDiscountPrice };
  };

  const { totalPrice, grandTotal, totalShippingFee, totalDiscountPrice } =
    calculateTotals(selectedItems);

  const sendOrder = async (image) => {
    const { startDate, endDate } = calculateEstimatedDelivery();

    try {
      const groupedItems = groupItemsByShop(selectedItems);
      const transactionId = Date.now();

      const orders = [];
      let isFirstShop = true;
      const shippingVoucher = selectedVouchers.find(
        (v) => v.voucher_type === "Shipping"
      );
      const productVouchers = selectedVouchers.filter(
        (v) => v.voucher_type !== "Shipping"
      );

      for (const shopName in groupedItems) {
        const { items: shopItems, shippingFee: shopShippingFee } =
          groupedItems[shopName];
        let isFirstItemInShop = true;

        let finalShippingFee = shopShippingFee;
        if (isFirstShop && shippingVoucher) {
          finalShippingFee = Math.max(
            0,
            shopShippingFee - shippingVoucher.discount
          );
        }

        // Apply product voucher discount only to the first shop
        const productDiscount =
          isFirstShop && productVouchers.length > 0
            ? productVouchers.reduce((sum, v) => sum + v.discount, 0)
            : 0;

        // Add voucher_used only for the first shop
        const voucherUsed = isFirstShop ? selectedVouchers : null;

        for (const item of shopItems) {
          let itemPrice =
            (item.prod.discount
              ? item.size.price * (1 - item.prod.discount / 100)
              : item.size.price) * item.qty;

          // Apply product voucher discount only to the first item of the first shop
          if (isFirstShop && isFirstItemInShop && productVouchers.length > 0) {
            itemPrice = Math.max(0, itemPrice - productDiscount);
          }

          // Add shipping fee only to the first item of the shop
          const itemShippingFee = isFirstItemInShop ? finalShippingFee : 0;

          orders.push({
            acc_num: profile.id,
            prod_num: item.prod.id,
            quantity: item.qty,
            total_price: item.size.price * item.qty,
            payment_method: paymentMethod,
            payment_stamp: new Date().toISOString(),
            order_variation: item.variant,
            order_size: item.size,
            shipping_addr:
              selectedAddress.full_address || "No address provided",
            shipping_postcode: selectedPostcode || "No postcode provided",
            shipping_method: shippingMethod,
            shipping_fee: itemShippingFee,
            discount: item.prod.discount || 0,
            final_price: itemPrice + itemShippingFee, // Include shipping fee only for the first item
            order_status:
              paymentMethod == "COD" ? "To pay" : "Pending to Admin",
            proof_of_payment: image,
            shop_transaction_id: transactionId,
            isPaid: false,
            shipping_status: "To prepare",
            voucher_used: isFirstShop && isFirstItemInShop ? voucherUsed : null,
            estimated_delivery: endDate,
          });

          isFirstItemInShop = false;
        }

        isFirstShop = false;
      }

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

        // Mark vouchers as used
        for (const voucher of selectedVouchers) {
          await supabase
            .from("customer_vouchers")
            .update({ isUsed: true })
            .eq("voucher_id", voucher.id)
            .eq("acc_id", profile.id);
        }

        for (const item of selectedItems) {
          await deleteItem(item);
        }

        setTimeout(() => {
          setShowAlert(false);
          navigate(`/`);
        }, 3000);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  useEffect(() => {
    calculateEstimatedDelivery();
  }, []);

  const handlePlaceOrder = async () => {
    if (paymentMethod === "COD") {
      await sendOrder();
    } else if (paymentMethod === "Gcash") {
      document.getElementById("my_modal_gcash").showModal();
    }
  };

  const openModalVoucher = () => {
    const modal = document.getElementById("my_modal_Voucher");
    if (modal) {
      modal.showModal();
    }
  };

  const closeModalVoucher = () => {
    const modal = document.getElementById("my_modal_Voucher");
    if (modal) {
      modal.close();
    }
  };

  return (
    <div className="w-full relative items-start justify-start bg-slate-300 flex flex-col font-[iceland] gap-2 px-2 lg:px-8 h-[100%] py-4">
      <dialog
        id="my_modal_gcash"
        className="modal modal-bottom sm:modal-middle absolute z-[60] right-4 sm:right-0"
      >
        <GcashDialog
          onClose={() => document.getElementById("my_modal_gcash").close()}
          order={sendOrder}
          total={grandTotal.toFixed(2)}
        />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute"
        >
          <button
            onClick={() => document.getElementById("my_modal_gcash").close()}
          ></button>
        </form>
      </dialog>

      {showAlert && (
        <div className="w-[95%] absolute pb-16 items-center justify-center flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
          <SuccessAlert />
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
                <select
                  className="select min-h-[2.5rem] h-[2.5rem] select-bordered w-full line-clamp-1 font-semibold text-md"
                  value={selectedAddress.full_address}
                  onChange={(e) => {
                    const selected = addresses.find(
                      (addr) => addr.full_address === e.target.value
                    );
                    setSelectedAddress(e.target.value);
                    setSelectedPostcode(selected ? selected.postcode : "");
                  }}
                >
                  {addresses.map((addr) => (
                    <option
                      key={addr.id}
                      value={addr.full_address}
                      className="line-clamp-1 font-semibold"
                    >
                      {addr.full_address}
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
        <div className="flex flex-col gap-2 w-full rounded-md h-72 overflow-y-auto custom-scrollbar pr-2">
          {Object.entries(groupItemsByShop(selectedItems)).map(
            ([shopName, { items, shippingFee }], index) => (
              <div
                key={shopName}
                className="flex flex-col bg-white border-t-2 border-primary-color gap-2 py-3 pl-2 pr-4 rounded-md text-secondary-color drop-shadow-lg w-full"
              >
                <h2 className="text-2xl font-bold">{shopName}</h2>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-row justify-between items-center"
                  >
                    <div className="flex gap-2">
                      <div className="w-20 h-20 z-50 bg-slate-200 rounded-l-lg">
                        <img
                          src={
                            item.variant.imagePath ||
                            require("@/assets/emote/success.png")
                          }
                          alt={item.variant.variant_Name}
                          className={`h-full w-full ${
                            item.variant.imagePath
                              ? "object-contain"
                              : "object-none"
                          }`}
                        />
                      </div>
                      <div>
                        <h1 className="text-3xl font-semibold">
                          {item.prod.item_Name}
                        </h1>
                        <h1 className="text-md mt-1">
                          Variant: {item.variant.variant_Name}
                        </h1>
                        <h1 className="text-md">Size: {item.size.size}</h1>
                      </div>
                    </div>
                    <div className="flex gap-10 justify-end items-center">
                      <div className="text-center">
                        <h1 className="text-[0.65rem]">Price * Quantity</h1>
                        <h1 className="text-md font-semibold">
                          ₱
                          {item.prod.discount
                            ? item.size.price * (1 - item.prod.discount / 100)
                            : item.size.price}{" "}
                          * {item.qty}
                        </h1>
                      </div>
                      <div className="text-center">
                        <h1 className="text-[0.65rem]">Total</h1>
                        <h1 className="text-3xl font-semibold">
                          ₱
                          {(
                            (item.prod.discount
                              ? item.size.price * (1 - item.prod.discount / 100)
                              : item.size.price) * item.qty
                          ).toFixed(2)}
                        </h1>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end gap-5 items-center">
                  <h3 className="text-base font-semibold">
                    <FontAwesomeIcon icon={faTruckFast} /> Shipping Fee: ₱
                    {shippingFee}
                  </h3>

                  {index === 0 && (
                    <>
                      {selectedVouchers.find(
                        (v) => v.voucher_type === "Shipping"
                      ) && (
                        <h3 className="text-base font-semibold text-green-700">
                          <FontAwesomeIcon icon={faTag} /> Shipping: -₱
                          {
                            selectedVouchers.find(
                              (v) => v.voucher_type === "Shipping"
                            ).discount
                          }
                        </h3>
                      )}
                      {selectedVouchers.filter(
                        (v) => v.voucher_type !== "Shipping"
                      ).length > 0 && (
                        <h3 className="text-base font-semibold text-primary-color">
                          <FontAwesomeIcon icon={faTag} /> Product: -₱
                          {selectedVouchers
                            .filter((v) => v.voucher_type !== "Shipping")
                            .reduce((sum, v) => sum + v.discount, 0)}
                        </h3>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex flex-row w-full justify-between gap-2 items-start font-[iceland]">
        <div className="flex flex-col gap-4 bg-slate-50 p-4 border-t-primary-color border-t-2 rounded-md h-40 w-[20%]">
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

        <div className="flex flex-col gap-4 bg-slate-50 p-4 border-t-primary-color border-t-2 rounded-md h-40 w-[20%]">
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
            <label className="form-control w-[6rem]">
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

        <div className="flex flex-col gap-1 bg-slate-50 p-4 border-t-primary-color border-t-2 rounded-md h-40 w-[20%]">
          <div className="flex justify-between">
            <h1 className="font-bold text-xl">Vouchers:</h1>
            <button
              className="btn min-h-7 h-7 bg-primary-color text-slate-50 hover:text-primary-color"
              onClick={openModalVoucher}
            >
              USE
            </button>
          </div>
          <div className="overflow-y-auto custom-scrollbar items-center justify-center flex flex-col gap-2">
            {selectedVouchers.length > 0 ? (
              selectedVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className={`${
                    voucher.isClaimed ? "bg-secondary-color" : "bg-slate-50"
                  } flex flex-col gap-1 items-center rounded-md drop-shadow-sm overflow-hidden p-1 px-2 ${
                    voucher.voucher_type === "Product"
                      ? "border-primary-color"
                      : "border-green-700"
                  } border-t-2 h-10 w-56`}
                >
                  <div
                    className={`absolute opacity-20 w-[60%] ${
                      voucher.voucher_type === "Product"
                        ? "text-primary-color"
                        : "text-green-700"
                    } font-bold text-7xl left-14 -top-2 z-0 drop-shadow-customViolet`}
                  >
                    <p>{voucher.voucher_type}</p>
                  </div>
                  <div
                    className={`flex justify-between gap-1 w-full items-center ${
                      voucher.isClaimed
                        ? "text-slate-300"
                        : "text-secondary-color"
                    } p-0`}
                  >
                    <h2 className="text-xl font-bold">
                      {voucher.voucher_name}
                    </h2>
                    <h3 className="text-2xl font-bold">₱{voucher.discount}</h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full w-full min-h-20">
                <p className="font-bold">No Vouchers used</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center w-[40%] h-40 justify-center gap-2">
          <div className="flex flex-col justify-end gap-1 items-end px-2">
            <div className="flex flex-col">
              <h1 className="label-text text-xs text-slate-400">
                Est. Delivery:
              </h1>
              <h1 className="text-lg font-bold text-end">
                {estimatedDelivery}
              </h1>
            </div>
            <div className="flex justify-end gap-4 items-end">
              <div>
                <h1 className="label-text text-xs text-slate-400">
                  Total Price
                </h1>
                <h1 className="text-xl font-bold text-end">
                  ₱{totalPrice.toFixed(2)}
                </h1>
              </div>
              <div>
                <h1 className="label-text text-xs text-slate-400">
                  Shipping Fee
                </h1>
                <h1 className="text-xl font-bold text-end">
                  ₱{totalShippingFee}
                </h1>
              </div>
            </div>
            <p className="label-text text-xs text-slate-700 text-end">
              By clicking <span className="font-bold">Place Order</span>, I
              state that I have read and understood the{" "}
              <span
                onClick={openModalTerms2}
                className="underline cursor-pointer font-bold"
              >
                Terms and Conditions
              </span>
            </p>
          </div>
          <div className="flex flex-col justify-start w-full gap-2">
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

      <dialog
        id="my_modal_terms2"
        className="modal modal-bottom sm:modal-middle absolute z-50 right-4 sm:right-0"
      >
        <TermsCon
          onClose={() => document.getElementById("my_modal_terms2").close()}
        />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute"
        >
          <button
            onClick={() => document.getElementById("my_modal_terms2").close()}
          ></button>
        </form>
      </dialog>

      <dialog
        id="my_modal_Voucher"
        className="modal modal-bottom sm:modal-middle absolute z-50 right-4 sm:right-0"
      >
        <ApplyVoucher
          profile={profile}
          onClose={closeModalVoucher}
          price={totalPrice}
          onSelectVouchers={handleSelectedVouchers}
        />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute"
        >
          <button onClick={closeModalVoucher}></button>
        </form>
      </dialog>
    </div>
  );
}

export default PlaceOrder;
