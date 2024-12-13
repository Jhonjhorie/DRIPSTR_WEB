import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faStore } from '@fortawesome/free-solid-svg-icons'; 

function Cart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Ensure each item has a 'count' property, defaulting to 1 if not present
  const [cartItems, setCartItems] = useState(
    cart.map(item => ({
      ...item,
      count: item.count || 1, // Initialize count if it's not set
    }))
  );

  useEffect(() => {
    // Persist cart items back to local storage whenever they change
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div>
        <h1>Shopping Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const minusCount = (itemId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, count: Math.max(1, item.count - 1) } : item
      )
    );
  };

  const plusCount = (itemId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  return (
    <div className="flex flex-col bg-slate-200 p-6 h-full">
      <h1 className="text-4xl font-bold text-primary-color mb-6">Shopping Cart</h1>
      <div>
        {cartItems.map((item) => (
          <div key={item.id} className='flex bg-slate-400 p-4 gap-2 mb-4'>
            <div>
              <h1 className="text-xl font-bold text-black mb-2 ml-3">
                <FontAwesomeIcon icon={faStore}/> {item.shop?.shop_name}
              </h1>
              <img
                src={item.url}
                alt={item.product_name}
                className="w-20 h-20 object-cover ml-3"
              />
            </div>
            <div className='text-black font-bold mt-8'>
              <h2>{item.product_name}</h2>
              <div className='flex flex-row'>
                <h2>Quantity:</h2>
                <div className='ml-2'>
                  <FontAwesomeIcon icon={faMinus} onClick={() => minusCount(item.id)} />
                  <span> {item.count} </span>
                  <FontAwesomeIcon icon={faPlus} onClick={() => plusCount(item.id)} />
                </div>
              </div>
              <p>Price: ₱{item.price * item.count}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto sticky bottom-0 w-full bg-slate-400 p-6 shadow-xl flex justify-between items-center">
        {/* Left Side (Shipping and Total Price) */}
        <div className="text-xl flex flex-col gap-4">
          <p className="text-md font-bold text-black">Shipping: ₱</p>
          <p className="text-2xl font-bold text-black">Total Price: ₱</p>
        </div>

        {/* Right Side (Voucher and Payment Options) */}
        <div className="flex flex-col gap-4 items-end">
          {/* Apply Voucher */}
          <div className="flex items-center gap-4">
            <h1 className="text-md font-bold text-black">Apply Voucher:</h1>
            <input
              type="text"
              placeholder="Enter Voucher"
              className="p-2 border border-gray-300 bg-gray-300 rounded-md w-40 text-black h-8"
            />
          </div>

          {/* Payment Option */}
          <div className="flex items-center gap-4">
            <p className="text-md font-bold text-black">Payment Option:</p>
            <div>
              <label className="flex items-center text-black">
                <input type="radio" name="paymentOption" value="cashOnDelivery" />
                Cash on Delivery
              </label>
              <label className="flex items-center text-black">
                <input type="radio" name="paymentOption" value="paypal" />
                Paypal
              </label>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="flex gap-4 items-center">
          <button className="btn btn-lg btn-primary py-2 px-6">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
