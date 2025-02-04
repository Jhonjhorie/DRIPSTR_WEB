import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import useCarts from "./hooks/useCart";

const Cart = ({ item, action }) => {
  const { isLoggedIn } = useUserProfile();
  const { cartItems, loading, error, fetchDataCart } = useCarts();
 
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    item?.item_Variant[0] || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    item?.item_Variant[0]?.sizes[0] || ""
  );

  const [isCart, setIsCart] = useState(action === "cart");

  useEffect(() => {
    setIsCart(action === "cart");
  }, [action]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  useEffect(() => {
    fetchDataCart();
  }, []);

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
    navigate(`/product/${item.item_Name}`, { state: { item } });
  };

  const onConfirm = () => {
    const formOrder = {
      item: item,
      quantity: quantity,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
    };

    navigate(`/placeOrder/${item.item_Name}`, { state: { formOrder } });
  };
  

  if (isLoggedIn) {
    return (
      <div className=" bg-slate-200 text-base-content justify-between min-h-full gap-2 w-[40rem] pr-8 pt-4 pl-4 flex flex-col">
        <div className="flex items-center gap-2  text-lg">
          <FontAwesomeIcon icon={faShoppingCart} />
          <h1 className="font-bold text-3xl">Cart</h1>
        </div>
        <div className="h-[78vh] overflow-y-auto flex flex-col gap-2 custom-scrollbar pr-2">
          {loading ? (
          <p className="text-center text-lg font-semibold">Loading your cart...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-600 font-semibold">
            Error fetching cart: {error}
          </p>
        ) : cartItems.length > 0 ? (
            cartItems.map((cartItem) => (
              <div
                key={cartItem.id}
                className="flex flex-col gap-2 pb-2 bg-primary-color w-full custom_scrollbar rounded-md"
              >
                <div className="flex flex-row  bg-slate-50 gap-2 py-3 px-2 rounded-md text-secondary-color drop-shadow-lg w-full justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-20 h-20 z-50 bg-slate-50 rounded-l-lg">
                      <img
                        src={
                          cartItem.variant.imagePath != null || ""
                            ? cartItem.variant.imagePath
                            : require("@/assets/emote/success.png")
                        }
                        alt={cartItem.variant_Name}
                        className={`h-full w-full ${
                          cartItem.imagePath != null || ""
                            ? "object-contain"
                            : "object-none"
                        }`}
                      />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold">
                        {cartItem.prod.item_Name}
                      </h1>
                      <h1 className="text-sm mt-1  ">
                        {" "}
                        {cartItem.prod.shop_Name}
                      </h1>
                      <h1 className="text-xs font-semibold">x{cartItem.qty}</h1>
                    </div>
                  </div>
                  <div className="text-center">
                    <h1 className="text-[0.65rem] ">Variant / Size</h1>
                    <h1 className="text-xs font-semibold">
                      {cartItem.variant.variant_Name} / {cartItem.size.size}
                    </h1>
                  </div>

                  <div className="text-center">
                    <h1 className="text-[0.65rem] ">Price</h1>
                    <h1 className="text-2xl font-semibold">
                      {cartItem.size.price}
                    </h1>
                  </div>
                </div>
              </div>
              
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
        <div className="h-20 w-full bg-secondary-color rounded-tr-lg rounded-tl-lg  border-t-4 border-t-primary-color flex flex-row text-white p-2">
          <div className="flex flex-col">
            <h1 className="text-xs">Items:</h1>
            <h1 className="text-lg font-bold">x2</h1>
          </div>

        </div>
      </div>
    );
  } else {
    return <LoginFirst />;
  }
};

export default Cart;
