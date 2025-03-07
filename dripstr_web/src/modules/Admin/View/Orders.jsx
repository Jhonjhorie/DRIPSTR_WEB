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
          .eq("payment_method", "Gcash")
          .eq('payment_status', 'Pending to Admin')

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
        <div className="p-4">
  {loading ? (
    <p className="text-white">Loading...</p>
  ) : error ? (
    <p className="text-red-500">{error}</p>
  ) : (
    <div className="flex flex-col gap-3">
      {orders.length === 0 ? (
        <h1 className="flex justify-center items-center font-bold text-xl text-white">
          No Pending Orders
        </h1>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-row bg-white rounded-md shadow-md overflow-hidden p-3 gap-3"
          >
            <div className="flex-shrink-0">
              <img
                src={order.order_variation?.imagePath}
                alt="product image"
                className="w-24 h-24 object-contain rounded-md"
              />
            </div>
            <div className="flex flex-col w-full text-md text-black">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold truncate">{order.prod_num?.shop_Name} - {order.prod_num?.item_Name}</p>
                <p className="text-right text-sm text-gray-600">
                  {order.transaction_id} | {new Date(order.date_of_order).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold truncate">{order.acc_num?.full_name} - {order.shipping_addr}</p>
              <p className="font-semibold text-xsm text-black">
                ₱{Number(order.total_price).toLocaleString('en-US')}.00 | Qty: {order.quantity}
              </p>
              <p className=" text-xsm font-semibold text-black">
                {order.payment_status}
              </p>
              
                <p className="font-semibold text-blue-700 text-sm underline cursor-pointer">
                  Proof of payment
                </p>
                {order.proof_of_payment && (
                  <img
                    src={order.proof_of_payment}
                    className="h-5 w-5 inline-block"
                    alt="proof of payment"
                  />
                )}
              
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