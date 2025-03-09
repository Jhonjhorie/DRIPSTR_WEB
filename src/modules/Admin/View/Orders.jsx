import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';
import Pagination from './Components/Pagination';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, acc_num(full_name), prod_num(item_Name, shop_Name), quantity, total_price, payment_method, order_variation, shipping_addr, transaction_id, date_of_order, proof_of_payment, payment_status, shop_id(wallet(id, revenue))")
        .eq("payment_method", "Gcash")
        .eq('payment_status', 'Pending to Admin');

      if (error) throw error;

      console.log("Fetched data:", data);
      setOrders(data || []);
    } catch (error) {
      console.error("Error in fetchOrders:", error.message);
      setError(error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Modal handlers
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleApprove = async (orderId) => {
    try {
      // First, get the order details including total_price and shop_id
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('total_price, shop_id(wallet(id, revenue))')
        .eq('id', orderId)
        .single(); // Get single record
  
      if (orderError) throw orderError;
  
      // Calculate 97% of total_price
      const revenueIncrease = Number(orderData.total_price) * 0.97;
  
      // Start a transaction-like operation
      // Update order status
      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'Paid',
          isPaid: true
        })
        .eq('id', orderId)
        .select();
  
      if (updateError) throw updateError;
  
      // Update wallet revenue
      const currentRevenue = orderData.shop_id?.wallet?.revenue || 0;
      const newRevenue = currentRevenue + revenueIncrease;
  
      const { data: walletData, error: walletError } = await supabase
        .from('merchant_Wallet')
        .update({
          revenue: newRevenue
        })
        .eq('id', orderData.shop_id.wallet.id)
        .select();
  
      if (walletError) throw walletError;

      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

      // Then refetch to ensure consistency with database
      await fetchOrders();
  
      console.log('Order updated:', updatedOrder);
      console.log('Wallet updated:', walletData);
  
    } catch (error) {
      console.error('Error in approval process:', error.message);
    }
  };
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

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
              {currentOrders.length === 0 ? (
                <h1 className="flex justify-center items-center font-bold text-xl text-white">
                  No Pending Orders
                </h1>
              ) : (
                currentOrders.map((order) => (
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
                      <p
                        className="font-semibold text-blue-700 text-sm underline cursor-pointer"
                        onClick={() => openModal(order.proof_of_payment)}
                      >
                        Proof of payment
                      </p>
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="flex-1 w-20 mt-2 p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalItems={orders.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Proof of Payment</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Proof of payment"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;