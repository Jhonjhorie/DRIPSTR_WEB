import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
const Orders = () => {
  const [selectedTab, setSelectedTab] = useState("All");

  const tabs = ["All", "To Pay", "To Ship", "To Receive", "Received (32)"];

  const [orderDetails, setOrderDetails] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {}; // Retrieve the passed product details

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
      <div className="px-5 flex-1">
        <div className="p-4 bg-slate-200 min-h-screen">
          <h1 className="text-xl font-bold text-gray-800 mb-6">My Orders</h1>
          {/* Navigation Tabs */}
          <div className="tabs mb-1 border-b border-gray-300 flex flex-row justify-around">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-gray-700 font-medium relative ${
                  selectedTab === tab
                    ? "text-purple-600 border-b-4 border-purple-600"
                    : "hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Removed unnecessary margin-top */}
          <div className="group relative flex items-center bg-gray-50 rounded-md my-2">
            <button className="w-10 h-10 flex items-center justify-center group-hover:bg-primary-color transition-all duration-300">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-primary-color group-hover:text-black transition-all duration-300"
              />
            </button>
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

          {/* Adjust Margin and Padding Here */}
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

          {/*Fetched orders */}
          <div className="mt-2">
            {orderDetails.items?.length > 0 ? (
              orderDetails.items.map((item, index) => (
                <div key={index} className="mb-2">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      {item.shopName}
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
                          {item.productName}
                        </p>
                        <p className="text-black">Price: {item.price}</p>
                        <p className="text-black">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in your order.</p>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              {item.shop}
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
                  {item.product}
                </p>
                <p className="text-gray-500">Black</p>
                <p className="text-green-500">30 Days Free Returns</p>
                <p className="text-gray-800 font-bold">₱{item.price}</p>
                <p className="text-gray-500">Qty: 1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   );
};

export default Orders;
