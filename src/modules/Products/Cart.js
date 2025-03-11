import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faPen,
  faTrashCan,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import useCarts from "./hooks/useCart";
import EditConfirm from "./components/editConfirm";
import { supabase } from "@/constants/supabase";

const Cart = ({ cartItems2,  closeDrawer }) => {
  const { isLoggedIn } = useUserProfile();
  const {
    cartItems,
    orderCart,
    loading,
    error,
    fetchDataCart,
    handleToggleOrder,
  } = useCarts();
  const navigate = useNavigate();

  const [cartItemS, setCartItemS] = useState(null);
  const [selectedAction, setSelectedAction] = useState("edit");

  const groupedCartItems = cartItems.reduce((acc, item) => {
    const shopName = item.prod.shop.shop_name;
    if (!acc[shopName]) {
      acc[shopName] = [];
    }
    acc[shopName].push(item);
    return acc;
  }, {});

  const totalOrderPrice = orderCart.reduce(
    (sum, item) => sum + item.size.price * item.qty,
    0
  );
  const totalQuantity = orderCart.reduce((sum, item) => sum + item.qty, 0);

  const deleteItem = async (cartItem) => {
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cartItem.id);

      if (error) {
        console.error("Error deleting item from cart:", error.message);
        return { success: false, error: error.message };
      }
      fetchDataCart();
      return { success: true };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchDataCart();
  }, [cartItems2, fetchDataCart]);

  const openModal = (item, action) => {
    setCartItemS(item);
    setSelectedAction(action);
    setTimeout(() => {
      document.getElementById("editConfirm_Modal").showModal();
    }, 50);
  };

  const closeModal = () => {
    document.getElementById("editConfirm_Modal").close();
    fetchDataCart();
  };

  const onConfirm = () => {
    const selectedItems = cartItems.filter((item) => item.to_order);

    if (selectedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    if (closeDrawer) {
      closeDrawer();
    }

    navigate(`/product/placeOrder`, { state: { selectedItems } });
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
        <LoginFirst />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-[90%] md:h-full pr-5  ">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faShoppingCart} className="text-gray-600" />
          <h1 className="font-semibold text-xl">My Cart</h1>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar ">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <p className="text-gray-500">Loading your cart...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            Error loading cart: {error}
          </div>
        ) : Object.keys(groupedCartItems).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={require("@/assets/emote/success.png")}
              alt="Empty Cart"
              className="w-24 h-24 mb-4"
            />
            <p className="text-gray-500 mb-2">Your cart is empty</p>
            <button
              className="px-4 py-2 bg-primary-color text-white rounded-md mt-2 text-sm"
              onClick={() => navigate("/mall")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          Object.entries(groupedCartItems).map(([shopName, items]) => (
            <div
              key={shopName}
              className="bg-gray-50 rounded-lg overflow-hidden mb-4"
            >
              {/* Shop Header */}
              <div className="bg-gray-100 px-4 py-2 flex items-center">
                <h3 className="font-medium">{shopName}</h3>
              </div>

              {/* Shop Items */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 flex items-center ${
                      item.to_order ? "bg-purple-50" : ""
                    } transition-colors duration-200`}
                  >
                    {/* Checkbox */}
                    <div className="mr-3">
                      <input
                        type="checkbox"
                        checked={item.to_order}
                        className="h-5 w-5 rounded checkbox checkbox-secondary border-gray-300 text-primary-color"
                        onChange={() =>
                          handleToggleOrder(item.id, !item.to_order)
                        }
                      />
                    </div>

                    {/* Product Image */}
                    <div className="h-16 w-16 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                      <img
                        src={
                          item.variant.imagePath ||
                          require("@/assets/emote/success.png")
                        }
                        alt={item.variant.variant_Name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm">
                        {item.prod.item_Name}
                      </h4>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.variant.variant_Name} / {item.size.size}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs">Qty: {item.qty}</span>
                        <span className="font-semibold">
                          ₱
                          {(
                            (Number(item.size.price) || 0) *
                            (Number(item.qty) || 1)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-4 flex space-x-2">
                      <button
                        className="p-1.5 text-gray-500 hover:text-primary-color rounded-full"
                        onClick={() => openModal(item, "edit")}
                      >
                        <FontAwesomeIcon icon={faPen} size="xs" />
                      </button>
                      <button
                        className="p-1.5 text-gray-500 hover:text-red-500 rounded-full"
                        onClick={() => deleteItem(item)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} size="xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with Summary and Checkout */}
      <div className="border-t p-4  rounded-bl-lg bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Items:</span>
            <span className="font-semibold">{totalQuantity}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Total:</span>
            <span className="font-semibold">₱{totalOrderPrice.toFixed(2)}</span>
          </div>
        </div>
        <button
          className={`w-full py-2 rounded-md font-medium ${
            orderCart.length > 0
              ? "bg-primary-color text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          onClick={onConfirm}
          disabled={orderCart.length === 0}
        >
          Place Order
        </button>
      </div>

      {/* Edit Modal */}
      {cartItemS && (
        <dialog id="editConfirm_Modal" className="modal">
          <EditConfirm
            action={selectedAction}
            item={cartItemS}
            onClose={closeModal}
          />
          <form
            method="dialog"
            className="modal-backdrop min-h-full min-w-full absolute"
          >
            <button onClick={closeModal}></button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default Cart;
