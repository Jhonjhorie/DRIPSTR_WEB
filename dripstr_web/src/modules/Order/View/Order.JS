import React from "react";
import { useLocation } from "react-router-dom";

function Order() {
  const location = useLocation();
  const { item } = location.state || {}; // Retrieve the passed product details
  const shipping = 120.00;

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

            <p className="text-md font-bold text-black">Payment Option:</p>
            <div className="flex gap-4">
              <div className="">
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
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto sticky bottom-0 w-full bg-white p-6 shadow-xl flex justify-between items-center">
        <div className="text-xl">
          <p className="text-gray-500">Shipping: ₱{shipping}</p>
          <p className="text-2xl font-bold text-black">Total Price: ₱{shipping + item.price}</p>
        </div>
        <button className="btn btn-lg btn-primary py-2 px-6">Checkout</button>
      </div>
    </div>
  );
}

export default Order;
