 import React, { useState, useEffect } from "react";
 import Sidebar from "../components/Sidebar";
const Orders = () => {

  const [selectedTab, setSelectedTab] = useState("All");

  const tabs = ["All", "To Pay", "To Ship", "To Receive", "Received (32)"];

  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Fetch data from localStorage
    const savedOrderDetails = localStorage.getItem("orderDetails");
    if (savedOrderDetails) {
      setOrderDetails(JSON.parse(savedOrderDetails));
    }
  }, []);

  if (!orderDetails) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="p-4 bg-slate-200 min-h-screen flex flex-row">

    <Sidebar />
    <div className="px-5">
    <div className="p-4 bg-slate-200 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-6">My Orders</h1>

      {/* Navigation Tabs */}
      <div className="tabs mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(tab)}
            className={`tab tab-bordered ${
              selectedTab === tab ? "tab-active text-gray-900" : "text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="form-control mb-6">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search by Item or Store name"
            className="input input-bordered w-full"
          />
          <span className="input-group-addon bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16a6 6 0 116 6 6 6 0 01-6-6zm2-1h4m-2 0v4"
              />
            </svg>
          </span>
        </div>
      </div>
      <div>
      </div>
      {/* Order Items */}
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          LIXIAOJU 1718344222
        </h2>
        <span className="text-green-500 font-medium mb-4 block">Received</span>
        <div className="flex gap-4">
          <img
            src="https://via.placeholder.com/80"
            alt="Order Item"
            className="w-20 h-20 rounded-lg"
          />
          <div className="flex-1">
            <p className="text-gray-800 font-medium">
              [LIXIAOJU] For Dell Latitude 3410 3510 E3510 E3410 Laptop Charging
              Flex Cable 07DM5H 0N8R4T DC Power Jack cable
            </p>
            <p className="text-gray-500">5CM</p>
            <p className="text-green-500">Free Returns</p>
            <p className="text-gray-800 font-bold">₱93.60</p>
            <p className="text-gray-500">Qty: 1</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Top_Appliancer
        </h2>
        <span className="text-green-500 font-medium mb-4 block">Received</span>
        <div className="flex gap-4">
          <img
            src="https://via.placeholder.com/80"
            alt="Order Item"
            className="w-20 h-20 rounded-lg"
          />
          <div className="flex-1">
            <p className="text-gray-800 font-medium">
              1Pc Universal Crossbody Nylon Patch Phone Lanyards Rope Strap
              Lanyard / Nylon Soft Rope Cell Phone Hanging Cord with curing
              cloth
            </p>
            <p className="text-gray-500">Black</p>
            <p className="text-green-500">30 Days Free Returns</p>
            <p className="text-gray-800 font-bold">₱54.00</p>
            <p className="text-gray-500">Qty: 1</p>
          </div>
        </div>
      </div>
      <div>
      <div>
      <div className="mt-4">
        {orderDetails.items?.length > 0 ? (
          orderDetails.items.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {item.shopName}
              </h2>
              </div>
              <p><strong>Shop Name:</strong> {item.shopName}</p>
              <p><strong>Product Name:</strong> {item.productName}</p>
              <p><strong>Price:</strong> {item.price}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
            </div>
          ))
        ) : (
          <p>No items in your order.</p>
        )}
        <hr className="my-4" />
        <p><strong>Total Product Price:</strong> {orderDetails.totalProductPrice}</p>
        <p><strong>Total Shipping Fees:</strong> {orderDetails.totalShippingFees}</p>
        <p><strong>Grand Total:</strong> {orderDetails.grandTotal}</p>
      </div>
      </div>
      {/*Fetched orders */}
      

    </div>

    </div>
    </div>
    </div>
  );
};

export default Orders;
