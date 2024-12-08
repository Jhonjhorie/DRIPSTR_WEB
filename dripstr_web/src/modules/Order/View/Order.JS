import React from "react";
import { useLocation } from "react-router-dom";

function Order() {
  const location = useLocation();
  const { item } = location.state || {}; // Retrieve the passed product details

  if (!item) {
    return <div>No order details found.</div>;
  }

  return (
    <div className="w-full bg-slate-200 p-6">
      <h1 className="text-4xl font-bold text-primary-color">Order Details</h1>
      <div className="bg-gray-100 rounded-lg p-4 mt-4">
        <h2 className="text-lg font-bold text-gray-800">{item.product}</h2>
        <p className="text-gray-500">Price: ₱{item.price}</p>
        <p className="text-gray-500">Sold: {item.sold}</p>
        <p className="text-gray-500">Rating: {item.rate.toFixed(1)}</p>
        <p className="text-gray-500">Description: {item.description}</p>
        <img
          src={item.url}
          alt={item.product}
          className="w-60 h-60 object-contain mt-4"
        />
      </div>
    </div>
  );
}

export default Order;
