import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const    Wishlist = () => {
  return (
    <div className="p-4 bg-slate-200 min-h-screen flex flex-row">

    <Sidebar />
    <div className="px-5">
      

    <div className="bg-slate-200 min-h-screen p-4">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        My Wishlist & Followed Stores (1)
      </h1>

      {/* Navigation */}
      <div className="flex justify-around bg-white p-3 rounded-md shadow mb-4">
        <span className="text-gray-800 font-semibold cursor-pointer">My Wishlists</span>
        <span className="text-gray-600 cursor-pointer">Past Purchases</span>
        <span className="text-gray-600 cursor-pointer">Followed Stores</span>
      </div>

      {/* Add All to Cart Button */}
      <button className="btn btn-primary w-full mb-4">ADD ALL TO CART</button>

      {/* Wishlist Item */}
      <div className="bg-white p-4 rounded-md shadow mb-4">
        <p className="text-sm text-red-500 font-bold mb-1">Out of Stock</p>
        <h2 className="text-lg font-bold text-gray-800">Zorotech</h2>

        <div className="flex">
          {/* Product Image */}
          <img
            src="https://via.placeholder.com/80"
            alt="Product"
            className="w-20 h-20 mr-4 rounded-lg"
          />

          {/* Product Details */}
          <div>
            <p className="text-gray-700 mb-2">NOT AVAILABLE</p>
            <p className="text-gray-700 font-medium">
              Zoro 2.5" SSD SATA3 128GB 256GB 512GB 1TB 2TB SATA M.2 2280 B&M KEY Computer Built-In Solid State Drive Suitable For Laptop/Desktop
            </p>
            <p className="text-gray-600 mt-1">Specifications: 2.5'' SATA 512GB SSD</p>
            <p className="text-lg font-semibold text-gray-800 mt-2">₱1,499.00</p>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Wishlist;
