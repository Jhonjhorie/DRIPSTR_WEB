import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/constants/supabase"; // Adjust the import path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faBox,
  faCheckCircle,
  faSpinner,
  faUser,
  faShoppingCart,
  faCalendar,
  faMapMarker,
  faMoneyBill,
  faClock,
  faStore,
  faTriangleCircleSquare,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const Jnt = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch orders with user and product details from Supabase
  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(
          `*,
          user:acc_num (username, full_name, mobile),
          product:prod_num (item_Name, shop_Name)`
        )
        .not("shipping_status", "eq", "cancel")
        .order("created_at", { ascending: false });

        if (ordersData) {
          ordersData.sort((a, b) => (statusOrder[a.shipping_status] ?? Infinity) - (statusOrder[b.shipping_status] ?? Infinity));
        }

      if (ordersError) throw ordersError;

      // Group orders by shop_transaction_id
      const grouped = ordersData.reduce((acc, order) => {
        const transactionId = order.shop_transaction_id;
        if (!acc[transactionId]) {
          acc[transactionId] = {
            ...order,
            items: [order],
            total_price: order.final_price,
          };
        } else {
          acc[transactionId].items.push(order);
          acc[transactionId].total_price += order.final_price;
        }
        return acc;
      }, {});

      setGroupedOrders(grouped);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update shipping status for all items in a grouped order
  const updateShippingStatus = async (transactionId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ shipping_status: newStatus })
        .eq("shop_transaction_id", transactionId);

      if (error) throw error;

      // Refetch orders to update the UI
      await fetchOrders();
    } catch (error) {
      console.error("Error updating shipping status:", error.message);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Shipping status options
  const statusOptions = [
    { label: "To Ship", value: "To ship", icon: faTruck },
    { label: "To Deliver", value: "To deliver", icon: faTruck },
    { label: "Delivered", value: "delivered", icon: faCheckCircle },
    { label: "Fail Delivery", value: "Fail deliver", icon: faTriangleExclamation },
    { label: "To Refund", value: "refund", icon: faMoneyBill },
  ];

  const statusOrder = statusOptions.reduce((acc, item, index) => {
    acc[item.value] = index;
    return acc;
  }, {});

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-red-600 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">J&T Express</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/jnt" className="text-black font-semibold hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jnt/track" className="text-black font-semibold hover:underline">
              Track a Shipment
            </Link>
          </li>
          <li>
            <Link to="/jnt/detailed" className="text-black font-semibold hover:underline">
              Detailed List
            </Link>
          </li>
        </ul>
      </nav>

      {/* Orders List */}
      <div className="container mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin text-4xl text-red-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(groupedOrders).map((group) => (
              <div key={group.shop_transaction_id} className="card bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="card-body p-6">
                  {/* Order ID and Status */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title text-2xl font-bold">Order: {group.shop_transaction_id}</h2>
                    <div className="flex items-center space-x-2">
                      <select
                        className="select select-bordered select-sm"
                        value={group.shipping_status}
                        onChange={(e) => updateShippingStatus(group.shop_transaction_id, e.target.value)}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <FontAwesomeIcon
                        icon={statusOptions.find((opt) => opt.value === group.shipping_status)?.icon || faBox}
                        className="text-2xl text-red-600"
                      />
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                      <span className="font-semibold">Customer:</span>
                      <span>{group.user?.username || group.user?.full_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faMapMarker} className="text-gray-600" />
                      <span className="font-semibold">Address:</span>
                      <span>{group.shipping_addr}</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Items:</h3>
                    <div className="space-y-4">
                      {group.items.map((item, index) => (
                        <div key={index} className="card bg-base-200 shadow-sm">
                          <div className="card-body p-4">
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faShoppingCart} className="text-gray-600" />
                              <span className="font-semibold">Product:</span>
                              <span>{item.product?.item_Name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faStore} className="text-gray-600" />
                              <span className="font-semibold">Shop:</span>
                              <span>{item.product?.shop_Name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                              <span className="font-semibold">Variant:</span>
                              <span>{item.order_variation?.variant_Name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                              <span className="font-semibold">Size:</span>
                              <span>{item.order_size?.size}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FontAwesomeIcon icon={faMoneyBill} className="text-gray-600" />
                              <span className="font-semibold">Price:</span>
                              <span>₱{item.final_price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-gray-600" />
                      <span className="font-semibold">Order Date:</span>
                      <span>{new Date(group.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faTruck} className="text-gray-600" />
                      <span className="font-semibold">Method:</span>
                      <span>{group.shipping_method}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faMoneyBill} className="text-gray-600" />
                      <span className="font-semibold">Total Price:</span>
                      <span>₱{group.total_price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faClock} className="text-gray-600" />
                      <span className="font-semibold">Estimated Delivery:</span>
                      <span>{group.estimated_delivery || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jnt;