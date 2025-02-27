import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/constants/supabase"; // Adjust the import path as needed

const JntDetailed = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch shipments from Supabase
  const fetchShipments = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          user:acc_num (username, full_name, mobile),
          product:prod_num (item_Name, shop_Name)
        `)
        .order("estimated_delivery", { ascending: true }) // Sort by estimated_delivery
        .order("shipping_method", { ascending: true }) // Then by shipping_method
        .order("created_at", { ascending: true }); // Then by oldest date_of_order

      if (error) throw error;

      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch shipments on component mount
  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
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
                      <th>Product</th>
                      <th>Shop</th>
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
                        <td>{shipment.shop_transaction_id}</td>
                        <td>{shipment.user?.username || shipment.user?.full_name}</td>
                        <td>{shipment.product?.item_Name}</td>
                        <td>{shipment.product?.shop_Name}</td>
                        <td>{shipment.quantity}</td>
                        <td>₱{shipment.final_price.toFixed(2)}</td>
                        <td>{shipment.shipping_method}</td>
                        <td>{shipment.estimated_delivery || "N/A"}</td>
                        <td>{new Date(shipment.created_at).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              shipment.shipping_status === "Delivered"
                                ? "badge-success"
                                : shipment.shipping_status === "To Prepare"
                                ? "badge-warning"
                                : "badge-info"
                            }`}
                          >
                            {shipment.shipping_status}
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