import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useCarts from "./hooks/useCart";
import EditConfirm from "./components/editConfirm";
import { supabase } from "@/constants/supabase";

const Cart = ({action, cartItems2, setCartItems, closeDrawer }) => {
  const { isLoggedIn } = useUserProfile();
  const { cartItems, orderCart, loading, error, fetchDataCart, handleToggleOrder } = useCarts();
  const navigate = useNavigate();
 
  const totalOrderPrice = orderCart.reduce((sum, item) => sum + item.size.price * item.qty, 0);
  const totalQuantity = orderCart.reduce((sum, item) => sum + item.qty, 0);

  const [cartItemS, setCartItemS] = useState(null);
  const [selectedAction, setSelectedAction] = useState("edit");

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
      document.getElementById('editConfirm_Modal').showModal();
    }, 50);
  };

  const closeModal = () => {
    document.getElementById('editConfirm_Modal').close();
    fetchDataCart();
  };

  const onConfirm = () => {
    
    const selectedItems = cartItems.filter((item) => item.to_order);
  
    if (selectedItems.length === 0) {
      alert("No items selected for order. Please select at least one item.");
      return;
    }
    if (closeDrawer) {
      closeDrawer();
    }
    
    navigate(`/product/placeOrder`, { state: { selectedItems } });
   
  };
  

  if (isLoggedIn) {
    return (
      <div className="bg-slate-200 text-base-content justify-between min-h-full gap-2 w-[40rem] pr-8 pt-4 pl-4 flex flex-col">
        <div className="flex items-center gap-2 text-lg">
          <FontAwesomeIcon icon={faShoppingCart} />
          <h1 className="font-bold text-3xl">Cart</h1>
        </div>
        <div className="h-[78vh] overflow-y-auto flex flex-col gap-2 custom-scrollbar pr-2">
          {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <img
          src={require("@/assets/emote/hmmm.png")}
          alt="No Images Available"
          className=" drop-shadow-customViolet "
        />
            <p className="text-center text-lg font-semibold">Loading your cart...</p>
            </div>
          ) : error ? (
            <p className="text-center text-lg text-red-600 font-semibold">
              Error fetching cart: {error}
            </p>
          ) : cartItems.length > 0 ? (
            cartItems.map((cartItem) => (
              <div
                key={cartItem.id}
                className={`flex flex-col gap-2 pb-2 ${cartItem.to_order ? "bg-secondary-color" : "bg-primary-color"} w-full custom_scrollbar rounded-md duration-300 transition-all`}
              >
                {cartItem && (
                  <dialog id="editConfirm_Modal" className="max-w-full modal modal-bottom sm:modal-middle absolute z-50 right-4 sm:right-0">
                    <EditConfirm
                      action={selectedAction}
                      item={cartItemS}
                      onClose={closeModal}
                  
                    />
                    <form method="dialog" className="modal-backdrop min-h-full min-w-full absolute">
                      <button onClick={closeModal}></button>
                    </form>
                  </dialog>
                )}
                <div className={`flex flex-row ${cartItem.to_order ? "bg-primary-color text-white" : "bg-slate-50 text-secondary-color"} duration-300 transition-all gap-2 py-3 px-2 rounded-md drop-shadow-lg w-full justify-between items-center`}>
                  <div className="flex gap-2">
                    <div className="w-20 h-20 z-50 bg-slate-50 rounded-l-lg">
                      <img
                        src={
                          cartItem.variant.imagePath != null || ""
                            ? cartItem.variant.imagePath
                            : require("@/assets/emote/success.png")
                        }
                        alt={cartItem.variant_Name}
                        className={`h-full w-full ${cartItem.imagePath != null || "" ? "object-contain" : "object-scale-down"}`}
                      />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold">{cartItem.prod.item_Name}</h1>
                      <h1 className="text-sm mt-1">{cartItem.prod.shop_Name}</h1>
                      <h1 className="text-xs font-semibold">x{cartItem.qty}</h1>
                    </div>
                  </div>
                  <div className="text-center">
                    <h1 className="text-[0.65rem]">Variant / Size</h1>
                    <h1 className="text-xs font-semibold">
                      {cartItem.variant.variant_Name} / {cartItem.size.size}
                    </h1>
                  </div>
                  <div className="text-center">
                    <h1 className="text-[0.65rem]">Price</h1>
                    <h1 className="text-2xl font-semibold">₱{cartItem.size.price}</h1>
                  </div>
                  <div className="text-center flex flex-col gap-1">
                  <button
                      className={`btn glass p-1 min-h-6 h-6 ${cartItem.to_order ? "bg-secondary-color text-white" : "bg-primary-color text-white"} hover:text-primary-color`}
                      onClick={() => {deleteItem(cartItem)}}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                    
                    <button
                      className={`btn glass p-1 min-h-6 h-6 ${cartItem.to_order ? "bg-secondary-color text-white" : "bg-primary-color text-white"} hover:text-primary-color`}
                      onClick={() => openModal(cartItem, 'edit')}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <input
                      type="checkbox"
                      checked={cartItem.to_order}
                      className="checkbox"
                      onChange={() => handleToggleOrder(cartItem.id, !cartItem.to_order)}
                    />
                    
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full flex-col gap-2">
                <img
          src={require("@/assets/emote/error.png")}
          alt="No Images Available"
          className=" drop-shadow-customViolet "
        />
            <p className="font-semibold font-[iceland] text-xl">Your cart is empty.</p>
            </div>
          )}
        </div>
        <div className="h-20 w-full bg-secondary-color rounded-tr-lg rounded-tl-lg border-t-4 border-t-primary-color flex flex-row text-white p-2 items-center justify-between">
          <div className="flex flex-row gap-3 items-center">
            <h1 className="text-3xl font-semibold"><FontAwesomeIcon icon={faShoppingCart} /></h1>
            <div className="flex flex-col">
              <h1 className="text-xs">Items:</h1>
              <h1 className="text-lg font-bold">x{totalQuantity}</h1>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs">Total Price</h1>
            <h1 className="text-lg font-bold">₱{totalOrderPrice.toFixed(2)}</h1>
          </div>
          <div className="flex flex-col">
            <button className="btn glass btn-outline bg-slate-50 hover:bg-primary-color"
            onClick={onConfirm}
            disabled={cartItems.filter((item) => item.to_order).length <= 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
    <div className="bg-slate-200 text-base-content justify-center min-h-full gap-2 w-[40rem] pr-8 pt-4 pl-4 flex flex-col">
    <div className="flex items-center justify-center gap-2 text-lg">

    <LoginFirst />
    </div>
    </div>);
  }
};

export default Cart;