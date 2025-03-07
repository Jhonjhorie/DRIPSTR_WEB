import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, created_at, acc_num(full_name), prod_num(item_Name, shop_Name), quantity, total_price, payment_method, order_variation, shipping_addr, transaction_id, date_of_order, proof_of_payment, payment_status")
          .eq("payment_method", "Gcash");

        if (error) {
          console.error("Error fetching orders:", error.message);
          throw error; // Throw to catch block
        }

        console.log("Fetched data:", data); // Debug: Check the returned data
        setOrders(data || []); // Set data or empty array if null
      } catch (error) {
        console.error("Error in fetchOrders:", error.message);
        setError(error.message); // Set error state
        setOrders([]); // Set empty array on error
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className='flex'>
      <Sidebar />
      <div className="flex-1 m-5 bg-slate-900 rounded-3xl p-6">
        <h1 className="text-white text-2xl font-bold mb-4">Orders</h1>
        <div>
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="flex flex-col gap-2 w-auto">
              {orders.length === 0 ? (
                <h1 className="flex justify-center items-center font-bold text-3xl text-white">
                  No Pending Orders
                </h1>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-md shadow-md p-2 relative w-full bg-white flex flex-row gap-2"
                  >
                    <div className="">
                      <img
                        src={order.order_variation?.imagePath}
                        alt=""
                        className="w-40 h-40 rounded-md object-contain"
                      />
                    </div>
                    <div className="w-3/4 flex flex-col gap-0.5 text-xs">
                      <p className="font-semibold text-black truncate">
                        {order.prod_num?.shop_Name} - {order.prod_num?.item_Name}
                      </p>
                      <p className="font-semibold text-black">
                        {order.transaction_id} | {new Date(order.date_of_order).toLocaleDateString()}
                      </p>
                      <p className="font-semibold text-black truncate">
                        {order.acc_num?.full_name} - {order.shipping_addr}
                      </p>
                      <p className="font-semibold text-black">
                        ₱{Number(order.total_price).toLocaleString('en-US')}.00 | Qty: {order.quantity}
                      </p>
                      <p className="font-semibold text-black">
                        {order.payment_status} via Gcash
                        <img
                          src={order.proof_of_payment}
                          className="h-4 w-4 inline-block ml-1"
                          alt="proof"
                        />
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;