import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import useUserProfile from "@/shared/mulletCheck.js";

const Orders = () => {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [selectedTab, setSelectedTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ["All", "To Pay", "To Ship", "To Receive", "Received (32)"];

  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {}; // Retrieve the passed product details

  useEffect(() => {
    if (profile?.id) {
      const fetchOrders = async () => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .eq('acc_num', profile.id);
  
          if (error) {
            throw error;
          }
  
          setOrders(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }
  }, [profile]); // Add profile as a dependency


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-slate-200 flex flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="px-5 flex-1 flex flex-col">  
        {/* Main Content */}
        <div className="p-4 bg-slate-200 flex-1">
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

          {/* Search Bar */}
          <div className="group relative flex items-center bg-gray-50 rounded-md my-2">
            <button className="w-10 h-10 flex items-center justify-center group-hover:bg-primary-color transition-all duration-300">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-primary-color group-hover:text-black transition-all duration-300"
              />
            </button>
          </div>


          {loading ? (
          <div className="flex flex-col items-center">
            <img src="/emote/hmmm.png" alt="Loading..." className="w-16 h-16" />
            <span>Loading...</span>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-gray-100 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Order ID: {order.id}
              </h2>
              <span className="text-green-500 font-medium mb-4 block">
                Status: {order.order_status}
              </span>
              <div className="flex gap-4">
                <img
                  src={order.order_variation?.imagePath}  // Ensure order_variation exists
                  alt="Order Item"
                  className="w-20 h-20 rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">
                    Product Number: {order.prod_num}
                  </p>
                  <p className="text-gray-500">Quantity: {order.quantity}</p>
                  <p className="text-gray-800 font-bold">
                    Total Price: ₱{order.total_price}
                  </p>
                  <p className="text-gray-500">
                    Payment Method: {order.payment_method}
                  </p>
                  <p className="text-gray-500">
                    Shipping Address: {order.shipping_addr}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}

          
        </div>
      </div>
    </div>
  );
};

export default Orders;