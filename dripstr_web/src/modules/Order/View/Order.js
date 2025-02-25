import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {}; // Retrieve the passed product details
  const shipping = 120.00;

  const handleToCart = () => {
    navigate('/account/orders', { state: { item } }); // Pass the product data to the Order page
  };

  if (!item) {
    return <div>No order details found.</div>;
  }

  return (
    <div className="w-full bg-slate-200 p-6 h-full flex flex-col">
      <h1 className="text-4xl font-bold text-primary-color mb-6">Order Details</h1>

      {/* Card layout for product details */}
      <div className="bg-white shadow-xl rounded-lg p-4  flex flex-col gap-2">
        {/* Shop name */}
        <div className="text-xl font-bold text-black ">
          {item.shop}
        </div>

        {/* Product details (Image on the left, Info on the right) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product image */}
          <img
            src={item.url}
            alt={item.product}
            className="w-60 h-60 object-contain mx-auto lg:mx-0"
          />

          {/* Product details */}
          <div className="flex flex-col gap-4 text-lg">
            <h2 className="text-2xl font-bold text-gray-800">{item.product}</h2>
            <p className="text-lg text-gray-500">Price: ₱{item.price}</p>

            
            
          </div>
        </div>
      </div>

      <div className="mt-auto sticky bottom-0 w-full bg-white p-6 shadow-xl flex justify-between items-center">
        {/* Left Side (Shipping and Total Price) */}
        <div className="text-xl flex flex-col gap-4">
          <p className="text-md font-bold text-black">Shipping: ₱{shipping}</p>
          <p className="text-2xl font-bold text-black">Total Price: ₱{shipping + item.price}</p>
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
          <button className="btn btn-lg btn-primary py-2 px-6" onClick={handleToCart}>
            Checkout
          </button>
        </div>
      </div>

    </div>
  );
}

export default Order;
