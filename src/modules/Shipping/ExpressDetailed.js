import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/constants/supabase";
import Navbar from "./Shared/Navbar";

const JntDetailed = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState("orders"); // Track active table

  const statusOptions = [
    "To prepare",
    "To ship",
    "To receive",
    "delivered",
    "completed",
    "returning",
    "returned",
  ];

  const statusOrder = statusOptions.reduce((acc, item, index) => {
    acc[item] = index;
    return acc;
  }, {});

  const fetchShipments = async () => {
    try {
      let query;
      if (activeTable === "orders") {
        query = supabase
          .from("orders")
          .select(
            `*,
            user:acc_num (username, full_name, mobile),
            product:prod_num (item_Name, shop_Name)`
          )
          .not("shipping_status", "eq", "cancel");
      } else {
        query = supabase
          .from("merchant_Commission")
          .select(
            `*,
            client:client_Id (username, full_name, mobile),
            merchant:merchantId (shop_name, contact_number, address)`
          )
          .not("status", "eq", "cancel");
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        data.sort(
          (a, b) =>
            (statusOrder[a.shipping_status || a.status] ?? Infinity) -
            (statusOrder[b.shipping_status || b.status] ?? Infinity)
        );
      }

      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [activeTable]);

  const getStatusColor = (status) => {
    switch (status) {
      case "To prepare":
        return "bg-blue-100 text-blue-800";
      case "To ship":
        return "bg-purple-100 text-purple-800";
      case "To receive":
        return "bg-amber-100 text-amber-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "returning":
        return "bg-orange-100 text-orange-800";
      case "returned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
    <Navbar />

      {/* Table Selection Tabs */}
      <div className="container mx-auto px-2 py-4">
        <div className="flex rounded-lg overflow-hidden shadow-sm mb-4">
          <button
            onClick={() => setActiveTable("orders")}
            className={`flex-1 py-2 text-center text-sm font-medium transition-colors 
              ${activeTable === "orders" 
                ? "bg-red-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTable("merchant_Commission")}
            className={`flex-1 py-2 text-center text-sm font-medium transition-colors
              ${activeTable === "merchant_Commission" 
                ? "bg-red-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            Commissions
          </button>
        </div>
      </div>

      {/* Shipment Details */}
      <div className="p-6">
        <div className="card bg-white shadow-lg rounded-lg">
          <div className="card-body p-6">
            <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner text-red-600"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  {/* Table Header */}
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>{activeTable === "orders" ? "Product" : "Shop"}</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Shipping Method</th>
                      <th>Estimated Delivery</th>
                      <th>Date Ordered</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {shipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-gray-50">
                        <td>{shipment.shop_transaction_id || shipment.transaction_id}</td>
                        <td>
                          {activeTable === "orders"
                            ? shipment.user?.username || shipment.user?.full_name
                            : shipment.client?.username || shipment.client?.full_name}
                        </td>
                        <td>
                          {activeTable === "orders"
                            ? shipment.product?.item_Name
                            : shipment.merchant?.shop_name}
                        </td>
                        <td>{shipment.quantity}</td>
                        <td>₱{(shipment.final_price || shipment.pricing || 0).toFixed(2)}</td>
                        <td>{shipment.shipping_method || "N/A"}</td>
                        <td>{shipment.estimated_delivery || "N/A"}</td>
                        <td>{new Date(shipment.created_at).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getStatusColor(shipment.shipping_status || shipment.status)
                            }`}
                          >
                            {shipment.shipping_status || shipment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JntDetailed;