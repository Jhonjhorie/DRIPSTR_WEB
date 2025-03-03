import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faTag,
  faTruckFast,
  faCreditCard,
  faMoneyBill,
  faShoppingBag,
  faReceipt,
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
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [selectedPostcode, setSelectedPostcode] = useState("");
  const [shippingFee, setShippingFee] = useState(50);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0);
  const [totalShippingFee, setTotalShippingFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleSelectedVouchers = (vouchers) => {
    setSelectedVouchers(vouchers);
  };

  const openModalTerms2 = () => {
    const modal = document.getElementById("my_modal_terms2");
    if (modal) {
      modal.showModal();
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", profile.id);

        if (error) throw error;

        if (data.length > 0) {
          setAddresses(data);
          const defaultAddress = data.find((addr) => addr.is_default_shipping);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
            setSelectedPostcode(defaultAddress.postcode);
          } else {
            setSelectedAddress(data[0]);
            setSelectedPostcode(data[0].postcode);
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err.message);
      }
    };

    fetchAddresses();
  }, [profile]);

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

  useEffect(() => {
    const groupedItems = groupItemsByShop(selectedItems);

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalShippingFee = 0;
    let holder = 0;

    const productVouchers = selectedVouchers.filter(
      (v) => v.voucher_type === "Product"
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

      totalPrice += shopTotal;
      if (isFirstShop && productVouchers.length > 0) {
        shopTotal = Math.max(0, shopTotal - productVouchers[0].discount);
        isFirstShop = false;
      }
      holder += shopTotal;
    }
    let isFirstShop2 = true;
    for (const shopName in groupedItems) {
      const { items: shopItems, shippingFee: shopShippingFee } =
        groupedItems[shopName];

      const shippingVoucher = selectedVouchers.find(
        (v) => v.voucher_type === "Shipping"
      );
      

      if (isFirstShop2 && shippingVoucher) {
        totalShippingFee += Math.max(
          0,
          shopShippingFee - shippingVoucher.discount
        );
        isFirstShop2 = false;
      } else {
        totalShippingFee += shopShippingFee;
      }
    }

    totalDiscountPrice = holder;
    const grandTotal =
      (totalDiscountPrice == 0 ? totalPrice : totalDiscountPrice) +
      totalShippingFee;
    setTotalPrice(totalPrice);
    setTotalDiscountPrice(totalDiscountPrice);
    setTotalShippingFee(totalShippingFee);
    setGrandTotal(grandTotal);
  }, [selectedItems, selectedVouchers, grandTotal]);

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

        const productDiscount =
          isFirstShop && productVouchers.length > 0
            ? productVouchers.reduce((sum, v) => sum + v.discount, 0)
            : 0;

        const voucherUsed = isFirstShop ? selectedVouchers : null;

        for (const item of shopItems) {
          let itemPrice =
            (item.prod.discount
              ? item.size.price * (1 - item.prod.discount / 100)
              : item.size.price) * item.qty;

          if (isFirstShop && isFirstItemInShop && productVouchers.length > 0) {
            itemPrice = Math.max(0, itemPrice - productDiscount);
          }

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
            final_price: itemPrice + itemShippingFee,
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
    <div className="bg-gray-100  min-h-screen py-6 px-4 md:px-6 lg:px-8">
      {/* Modals */}
      <dialog
        id="my_modal_gcash"
        className="modal modal-bottom sm:modal-middle"
      >
        <GcashDialog
          onClose={() => document.getElementById("my_modal_gcash").close()}
          order={sendOrder}
          total={grandTotal.toFixed(2)}
        />
        <form method="dialog" className="modal-backdrop">
          <button
            onClick={() => document.getElementById("my_modal_gcash").close()}
          ></button>
        </form>
      </dialog>

      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <SuccessAlert />
        </div>
      )}

      <dialog
        id="my_modal_terms2"
        className="modal modal-bottom sm:modal-middle"
      >
        <TermsCon
          onClose={() => document.getElementById("my_modal_terms2").close()}
        />
        <form method="dialog" className="modal-backdrop">
          <button
            onClick={() => document.getElementById("my_modal_terms2").close()}
          ></button>
        </form>
      </dialog>

      <dialog
        id="my_modal_Voucher"
        className="modal modal-bottom sm:modal-middle"
      >
        <ApplyVoucher
          profile={profile}
          onClose={closeModalVoucher}
          price={totalPrice}
          onSelectVouchers={handleSelectedVouchers}
        />
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModalVoucher}></button>
        </form>
      </dialog>

      <div className="max-w-6xl mx-auto space-y-2">
        <h1 className="text-2xl font-bold mb-1">Checkout</h1>

        {/* Delivery Address Section */}
        <section className="bg-white rounded-lg shadow-sm border-t-4 border-primary-color overflow-hidden">
          <div className="p-4">
            <h2 className="font-medium flex items-center gap-2 text-gray-800 mb-2">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-primary-color"
              />
              Delivery Address
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <p className="font-semibold">
                  {profile?.username ||
                    profile?.full_name ||
                    "No Name Provided"}
                </p>
                <p className="text-gray-600">
                  {profile?.mobile || "No Contact Number Provided"}
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <select
                      className="select select-bordered w-full h-10 py-1"
                      value={selectedAddress.full_address}
                      onChange={(e) => {
                        const selected = addresses.find(
                          (addr) => addr.full_address === e.target.value
                        );
                        setSelectedAddress(selected);
                        setSelectedPostcode(selected ? selected.postcode : "");
                      }}
                    >
                      {addresses.map((addr) => (
                        <option key={addr.id} value={addr.full_address}>
                          {addr.full_address}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={selectedPostcode}
                      disabled
                      className="input input-bordered w-full h-10 bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Items Section */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium flex items-center gap-2 text-gray-800">
              <FontAwesomeIcon
                icon={faShoppingBag}
                className="text-primary-color"
              />
              Order Items
            </h2>
          </div>

          <div className="max-h-96 overflow-y-auto p-4">
            {Object.entries(groupItemsByShop(selectedItems)).map(
              ([shopName, { items, shippingFee }], index) => (
                <div key={shopName} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <h3 className="font-medium text-gray-800">{shopName}</h3>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap md:flex-nowrap items-center gap-4 py-3 border-b last:border-b-0"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                        <img
                          src={
                            item.variant.imagePath ||
                            require("@/assets/emote/success.png")
                          }
                          alt={item.variant.variant_Name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="flex-grow min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">
                          {item.prod.item_Name}
                        </h4>
                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                          <span>Variant: {item.variant.variant_Name}</span>
                          <span>Size: {item.size.size}</span>
                          <span>Qty: {item.qty}</span>
                        </div>
                      </div>

                      <div className="ml-auto text-right">
                        <div className="text-sm text-gray-600">Unit Price</div>
                        <div className="font-medium">
                          ₱
                          {item.prod.discount
                            ? Number(
                                item.size.price * (1 - item.prod.discount / 100)
                              ).toFixed(2)
                            : Number(item.size.price).toFixed(2)}
                        </div>
                      </div>

                      <div className="text-right min-w-20">
                        <div className="text-sm text-gray-600">Subtotal</div>
                        <div className="font-semibold text-lg">
                          ₱
                          {(item.prod.discount
                            ? Number(
                                item.size.price * (1 - item.prod.discount / 100)
                              ).toFixed(2)
                            : Number(item.size.price) * item.qty
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-wrap justify-end gap-3 items-center mt-3 text-sm">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon
                        icon={faTruckFast}
                        className="text-gray-600"
                      />
                      Shipping Fee: ₱{shippingFee}
                    </span>

                    {index === 0 && (
                      <>
                        {selectedVouchers.find(
                          (v) => v.voucher_type === "Shipping"
                        ) && (
                          <span className="text-green-600 flex items-center gap-1">
                            <FontAwesomeIcon icon={faTag} />
                            Shipping: -₱
                            {
                              selectedVouchers.find(
                                (v) => v.voucher_type === "Shipping"
                              ).discount
                            }
                          </span>
                        )}

                        {selectedVouchers.filter(
                          (v) => v.voucher_type !== "Shipping"
                        ).length > 0 && (
                          <span className="text-primary-color flex items-center gap-1">
                            <FontAwesomeIcon icon={faTag} />
                            Product: -₱
                            {selectedVouchers
                              .filter((v) => v.voucher_type !== "Shipping")
                              .reduce((sum, v) => sum + v.discount, 0)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* Order Options Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Method */}
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium flex items-center gap-2 text-gray-800">
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="text-primary-color"
                />
                Payment Method
              </h2>
            </div>

            <div className="p-4 space-y-3">
              <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="radio radio-neutral"
                />
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    className="text-gray-600"
                  />
                  <span>Cash on Delivery (COD)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Gcash"
                  checked={paymentMethod === "Gcash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="radio radio-info"
                />
                <div className="flex items-center gap-2">
                  <img
                    src={require("@/assets/gcash.png")}
                    alt="Gcash"
                    className="h-6 w-12 object-contain"
                  />
                  <span>GCash</span>
                </div>
              </label>
            </div>
          </section>

          {/* Shipping Details */}
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium flex items-center gap-2 text-gray-800">
                <FontAwesomeIcon
                  icon={faTruckFast}
                  className="text-primary-color"
                />
                Shipping Details
              </h2>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Method
                  </label>
                  <select
                    className="select select-bordered w-full h-10"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee (₱)
                  </label>
                  <input
                    type="text"
                    value={shippingFee}
                    className="input input-bordered w-full h-10 bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="font-medium">{estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Vouchers */}
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-medium flex items-center gap-2 text-gray-800">
                <FontAwesomeIcon icon={faTag} className="text-primary-color" />
                Vouchers
              </h2>

              <button
                className="btn btn-sm bg-primary-color text-white hover:bg-primary-color/90"
                onClick={openModalVoucher}
              >
                Apply
              </button>
            </div>

            <div className="p-4 h-36 overflow-auto">
              {selectedVouchers.length > 0 ? (
                <div className="space-y-2">
                  {selectedVouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className={`flex justify-between p-2 rounded border-l-4 ${
                        voucher.voucher_type === "Product"
                          ? "border-l-primary-color bg-primary-color/5"
                          : "border-l-green-600 bg-green-50"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-800">
                          {voucher.voucher_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {voucher.voucher_type} Voucher
                        </div>
                      </div>
                      <div className="font-semibold">-₱{voucher.discount}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No vouchers applied
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Order Summary Section */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-medium flex items-center gap-2 text-gray-800">
              <FontAwesomeIcon
                icon={faReceipt}
                className="text-primary-color"
              />
              Order Summary
            </h2>
          </div>

          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₱{totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee:</span>
                  <span>₱{totalShippingFee.toFixed(2)}</span>
                </div>

                {selectedVouchers.length > 0 && (
                  <div className="flex justify-between text-primary-color">
                    <span>Discount:</span>
                    <span>
                      -₱{(totalPrice - totalDiscountPrice).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-primary-color">
                    <span>Total:</span>
                    <span>
                      <span className="text-lg">₱</span>
                      <span className=" font-bold text-2xl ">
                        {grandTotal.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <p className="text-sm text-gray-600 mb-4">
                  By clicking "Place Order", I confirm that I have read and
                  agree to the
                  <button
                    onClick={openModalTerms2}
                    className="text-primary-color hover:underline font-medium mx-1"
                  >
                    Terms and Conditions
                  </button>
                  of this purchase.
                </p>

                <button
                  className="btn bg-primary-color hover:bg-primary-color/90 text-white w-full"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PlaceOrder;
