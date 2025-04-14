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
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/constants/supabase";
import AlertDialog from "./components/alertDialog2.js";
import GcashDialog from "./components/GcashDialog.js";
import TermsCon from "@/shared/products/termsCon";
import ApplyVoucher from "./components/ApplyVoucher.js";
import { format, addDays } from "date-fns";
import ApplyShopVoucher from "./components/ApplyShopVoucher.js";

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
  const [shops, setShops] = useState(null);
  const [selectedPostcode, setSelectedPostcode] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [shippingFee, setShippingFee] = useState(50);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [selectedShopVouchers, setSelectedShopVouchers] = useState([]);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0);
  const [totalShippingFee, setTotalShippingFee] = useState(0);
  const [shopTotal, setShopTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleSelectedVouchers = (vouchers) => {
    setSelectedVouchers(vouchers);
  };
  const handleSelectedShopVouchers = (vouchers) => {
    setSelectedShopVouchers(vouchers);
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

  const calculateEstimatedDelivery = (daysToAddStart, daysToAddEnd) => {
    const today = new Date();
    const start = addDays(today, daysToAddStart);
    const end = addDays(today, daysToAddEnd);

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
      const shopName = item.prod.shop.shop_name;
      const shopLvm = item.prod.shop?.lvm;
      const profileLvm = selectedAddress?.lvm;
      console.log("shop object:", item.prod.shop);
      console.log("shop: " + shopName);
      console.log("shop: " + shopLvm);
      console.log("prof: " + profileLvm);

      let shippingFee = 100;
      let daysToAddStart = 7;
      let daysToAddEnd = 12;

      if (profileLvm === shopLvm) {
        shippingFee = 50;
        daysToAddStart = 4;
        daysToAddEnd = 8;
      } else if (
        (profileLvm === "Luzon" && shopLvm === "Visayas") ||
        (profileLvm === "Visayas" && shopLvm === "Luzon") ||
        (profileLvm === "Visayas" && shopLvm === "Mindanao") ||
        (profileLvm === "Mindanao" && shopLvm === "Visayas")
      ) {
        shippingFee = 100;
        daysToAddStart = 7;
        daysToAddEnd = 12;
      } else if (
        (profileLvm === "Luzon" && shopLvm === "Mindanao") ||
        (profileLvm === "Mindanao" && shopLvm === "Luzon")
      ) {
        shippingFee = 150;
        daysToAddStart = 7;
        daysToAddEnd = 12;
      }

      const today = new Date();
      const startDate = addDays(today, daysToAddStart);
      const endDate = addDays(today, daysToAddEnd);
      const endDateF = format(endDate, "yyyy-MM-dd");

      const estDeliveryDays = `${format(startDate, "MMM dd")}-${format(
        endDate,
        "dd, yyyy"
      )}`;

      if (!grouped[shopName]) {
        grouped[shopName] = {
          items: [],
          shippingFee: shippingFee,
          estDeliveryDays: estDeliveryDays,
          endDate: endDateF,
          shop: item.prod.shop,
        };
      }

      grouped[shopName].items.push(item);
    });

    return grouped;
  };

  useEffect(() => {
    const groupedItems = groupItemsByShop(selectedItems);
    const firstShopKey = Object.keys(groupedItems)[0];
    const endDate = groupedItems[firstShopKey]?.endDate;

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalShippingFee = 0;
    let holder = 0;

    const productVouchers = selectedVouchers.filter(
      (v) => v.voucher_type === "Product"
    );

    let isFirstShop = true;
    const newShopTotals = {};

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

      const shopVoucher = selectedShopVouchers.find(
        (v) => v.shopId === shopItems[0].prod.shop.id
      );
      if (shopVoucher && shopItems[0].size.price >= shopVoucher.condition) {
        shopTotal = Math.max(0, shopTotal - shopVoucher.discount);
      }

      totalPrice += shopTotal;

      if (isFirstShop && productVouchers.length > 0) {
        shopTotal = Math.max(0, shopTotal - productVouchers[0].discount);
        isFirstShop = false;
      }

      newShopTotals[shopName] = shopTotal;
      console.log(shopName + ": " + newShopTotals[shopName]);
      holder += shopTotal;
    }

    // Calculate total shipping fee
    let isFirstShop2 = true;
    for (const shopName in groupedItems) {
      const { shippingFee: shopShippingFee } = groupedItems[shopName];

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

    const grandTotal = ((totalDiscountPrice*1.12) + totalShippingFee);

    setTotalPrice(totalPrice);
    setTotalDiscountPrice(totalDiscountPrice);
    setTotalShippingFee(totalShippingFee);
    setGrandTotal(grandTotal);
    setShopTotal(newShopTotals);
  }, [selectedItems, selectedVouchers, selectedShopVouchers, selectedAddress]);

  const sendOrder = async (image) => {
    try {
      const groupedItems = groupItemsByShop(selectedItems);
      const transactionId = Date.now();

      const orders = [];
      let isFirstShop = true;
      const shippingVoucher = selectedVouchers.find(
        (v) => v.voucher_type === 'Shipping'
      );
      const productVouchers = selectedVouchers.filter(
        (v) => v.voucher_type !== 'Shipping'
      );

      const productDiscount =
        isFirstShop && productVouchers.length > 0
          ? productVouchers.reduce((sum, v) => sum + v.discount, 0)
          : 0;

      for (const shopName in groupedItems) {
        const {
          items: shopItems,
          shippingFee: shopShippingFee,
          endDate,
        } = groupedItems[shopName];
        let isFirstItemInShop = true;

        let finalShippingFee = shopShippingFee;
        if (isFirstShop && shippingVoucher) {
          finalShippingFee = Math.max(
            0,
            shopShippingFee - shippingVoucher.discount
          );
        }

        const shopVoucher = selectedShopVouchers.find(
          (v) => v.shopId === shopItems[0].prod.shop.id
        );

        for (const item of shopItems) {
          let itemPrice =
            ((item.prod.discount
              ? (item.size.price) * (1 - item.prod.discount / 100)
              : item.size.price) * item.qty)*1.12;

          if (isFirstItemInShop) {
            if (
              shopVoucher &&
              shopItems[0].size.price >= shopVoucher.condition
            ) {
              itemPrice = Math.max(0, itemPrice - shopVoucher.discount);
            }
            if (isFirstShop && productVouchers.length > 0) {
              itemPrice = Math.max(0, itemPrice - productDiscount);
            }
          }
          const itemShippingFee = isFirstItemInShop ? finalShippingFee : 0;

          orders.push({
            acc_num: profile.id,
            prod_num: item.prod.id,
            quantity: item.qty,
            total_price: itemPrice,
            payment_method: paymentMethod,
            payment_stamp: new Date().toISOString(),
            order_variation: item.variant,
            order_size: item.size,
            shipping_addr:
              selectedAddress.full_address || 'No address provided',
            shipping_postcode: selectedPostcode || 'No postcode provided',
            shipping_method: shippingMethod,
            shipping_fee: itemShippingFee || 0,
            discount: item.prod.discount || 0,
            final_price: itemPrice + itemShippingFee,
            payment_status:
              paymentMethod === "COD" ? "To pay" : "Pending to Admin",
            proof_of_payment: image,
            shop_transaction_id: transactionId,
            shipping_status: "Prepairing",
            voucher_used:
              isFirstShop && isFirstItemInShop ? selectedVouchers : null,
            estimated_delivery: endDate,
            shop_id: item.prod.shop.id,
            customizable_note: customNote || "",
          });

          // Add notification for the merchant
          await addProductNotification({
            userId: profile.id,
            merchantId: item.prod.shop_Id,
            type: 'ORDER_PLACED',
            title: 'New Order Received',
            message: `A new order has been placed for your product: ${item.prod.item_Name}.`,
          });

          isFirstItemInShop = false;
        }

        isFirstShop = false;
      }

      const { data, error } = await supabase
        .from('orders')
        .insert(orders)
        .select();

      if (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
      } else {
        console.log('Orders placed successfully:', data);
        setShowAlert(true);

        // Mark used vouchers as used
        for (const voucher of selectedVouchers) {
          await supabase
            .from('customer_vouchers')
            .update({ isUsed: true })
            .eq('voucher_id', voucher.id)
            .eq('acc_id', profile.id);
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
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

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

  const openModalShopVoucher = (shop) => {
    setShops(shop);
    const modal = document.getElementById("my_modal_ShopVoucher");

    if (modal) {
      setTimeout(() => {
        modal.showModal();
      }, 50);
    }
  };

  const closeModalShopVoucher = () => {
    const modal = document.getElementById("my_modal_ShopVoucher");
    if (modal) {
      modal.close();
    }
  };
  const addProductNotification = async ({ userId, merchantId, type, title, message }) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: userId,
            merchantId: merchantId,
            type: type,
            title: title,
            message: message,
            timestamp: new Date().toISOString(),
            read: false,
            deleted: false,
          },
        ])
        .select()
        .single();
  
      if (error) {
        console.error('Error inserting notification:', error.message);
        return { success: false, error: error.message };
      }
  
      console.log('Notification added successfully:', data);
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error inserting notification:', err.message);
      return { success: false, error: err.message };
    }
  };

  const handleOrderNotification = async (product, userId) => {
    const notification = {
      userId: userId,
      merchantId: product.shop_Id, // Assuming `shop_Id` is the merchant ID
      type: 'ORDER_PLACED',
      title: 'New Order Received',
      message: `A new order has been placed for your product: ${product.item_Name}.`,
    };
  
    const result = await addProductNotification(notification);
  
    if (result.success) {
      console.log('Order notification sent successfully.');
    } else {
      console.error('Failed to send order notification:', result.error);
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <AlertDialog
            emote={require("@/assets/emote/success.png")}
            text={"Your purchase has been confirmed!"}
          />
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

      <dialog
        id="my_modal_ShopVoucher"
        className="modal modal-bottom sm:modal-middle"
      >
        <ApplyShopVoucher
          profile={profile}
          onClose={closeModalShopVoucher}
          price={totalPrice}
          shop={shops}
          onSelectVouchers={handleSelectedShopVouchers}
        />
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModalShopVoucher}></button>
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
              ([shopName, { items, shippingFee, estDeliveryDays }], index) => {
                const shopId = items[0]?.prod?.shop?.id;

                return (
                  <div key={shopName} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b justify-between">
                      <h3 className="font-medium text-gray-800">{shopName}</h3>
                      <div className="flex items-center justify-center">
                        <button
                          className="flex items-center justify-center bg-[#171717] text-white pl-2 py-0 gap-2 text-sm font-medium rounded-md hover:bg-[#111111] duration-300 transition-all hover:px-2"
                          onClick={() =>
                            openModalShopVoucher(items[0].prod.shop)
                          }
                        >
                          <p>Select:</p>
                          {selectedShopVouchers.some(
                            (voucher) => voucher.shopId === shopId
                          ) ? (
                            selectedShopVouchers
                              .filter((voucher) => voucher.shopId === shopId)
                              .map((voucher) => (
                                <div
                                  key={voucher.id}
                                  className="flex justify-between gap-2 p-1 rounded border-l-4 border-l-yellow-600 bg-yellow-50"
                                >
                                  <div>
                                    <div className="text-sm w-32 text-left truncate font-medium text-gray-800">
                                      {voucher.voucher_name}:
                                    </div>
                                  </div>
                                  <div className="text-gray-800 text-sm">
                                    -₱{voucher.discount}
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="flex justify-between p-1 rounded border-l-4 border-l-yellow-600 bg-yellow-50">
                              <div>
                                <div className="text-sm text-gray-800">
                                  No Voucher Applied
                                </div>
                              </div>
                            </div>
                          )}
                        </button>
                      </div>
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
                          <div className="text-sm text-gray-600">
                            Unit Price
                          </div>
                          <div className="font-medium">
                            ₱
                            {item.prod.discount
                              ? Number(
                                  item.size.price *
                                    (1 - item.prod.discount / 100)
                                ).toFixed(2)
                              : Number(item.size.price).toFixed(2)}
                          </div>
                        </div>

                        <div className="text-right min-w-20">
                          <div className="text-sm text-gray-600">Subtotal</div>
                          <div className="font-semibold text-lg">
                            ₱
                            {Number(
                              item.prod.discount
                                ? item.size.price *
                                    (1 - Number(item.prod.discount) / 100)
                                : item.size.price * item.qty
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex flex-wrap justify-between gap-3 items-center mt-1 text-sm">
                      <div className="flex-wrap flex gap-2">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <img
                            src={require("@/assets/jnt.png")}
                            alt="Jnt"
                            className="h-8 w-12 object-contain"
                          />
                          Shipping Fee:
                          <span className="font-medium">{shippingFee}</span>/
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          Estimated Delivery:
                          <span className="font-medium">{estDeliveryDays}</span>
                        </span>
                      </div>
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
                      {selectedShopVouchers
                        .filter((voucher) => voucher.shopId === shopId)
                        .map((voucher) => (
                          <span
                            key={voucher.id}
                            className="text-yellow-600 flex items-center gap-1"
                          >
                            <FontAwesomeIcon icon={faTag} />
                            Merchant: -₱
                            {voucher.discount}
                          </span>
                        ))}
                    </div>
                  </div>
                );
              }
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
                        voucher.voucher_type == "Product" ||
                        voucher.voucher_type == "Products"
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
       
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium flex items-center gap-2 text-gray-800">
                <FontAwesomeIcon icon={faPen} className="text-primary-color" />
                Custom Request
              </h2>
            </div>

            <div className="p-4">
            {selectedItems[0]?.prod?.isCustomizable && selectedItems.length === 1 ? 
              <div className="">

                <label className="block text-sm font-medium text-gray-700 mb-1">
                Customization Notes (Auto-applied at checkout)

                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24 bg-gray-50"
                  placeholder="Enter any specific customization requests here..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                ></textarea>
              </div>
              : <div className="flex items-center justify-center flex-col mt-4">

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Not Available for Customization
              </label>
              <label className="block text-sm font-medium text-gray-500 mb-1">
{selectedItems.length !== 1 ? "Custom requests are only available for single item purchases." : "Item is not available for customization."}
              </label>
            </div>}
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
                  <span
                    className={`${
                      selectedShopVouchers.length > 0 ? "text-yellow-600" : ""
                    } font-semibold`}
                  >
                    ₱{totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span
                    className={` flex justify-between ${
                      selectedVouchers.filter(
                        (v) => v.voucher_type == "Shipping"
                      ).length > 0
                        ? "text-green-600"
                        : "text-gray-600"
                    } font-semibold`}
                  >
                    ₱{totalShippingFee.toFixed(2)}
                  </span>
                </div>

                {selectedVouchers.filter((v) => v.voucher_type !== "Shipping")
                  .length > 0 && (
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
                  <div className="text-xs text-gray-500 flex text-right justify-end">
                  The total amount includes 12% VAT in accordance with Philippine tax regulations.
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
