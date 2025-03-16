import React, { useState, useEffect } from 'react';
import { supabase } from '../../../constants/supabase';
import Pagination from './Components/Pagination';

function OrdersTab() {
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
        .from('orders')
        .select(
          'id, created_at, acc_num(full_name), prod_num(item_Name, shop_Name), quantity, total_price, payment_method, order_variation, shipping_addr, transaction_id, date_of_order, proof_of_payment, payment_status, shop_id(wallet(id, revenue))'
        )
        .eq('payment_method', 'Gcash')
        .eq('payment_status', 'Pending to Admin');

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error in fetchOrders:', error.message);
      setError(error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const updateOrderStatus = async (orderId) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: 'Paid', isPaid: true })
        .eq('id', orderId);

      if (updateError) throw updateError;
      return true;
    } catch (error) {
      console.error('Error updating order status:', error.message);
      return false;
    }
  };

  const handleApprove = async (orderId) => {
    const success = await updateOrderStatus(orderId);
    if (success) {
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      await fetchOrders();
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="p-3 flex flex-col h-full">
      <div className="flex-1 flex flex-col min-h-0">
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : currentOrders.length === 0 ? (
          <p className="text-white text-center font-semibold">No Pending Orders</p>
        ) : (
          <div className="space-y-2 overflow-auto">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center bg-white rounded-lg shadow-sm p-2 gap-2 hover:bg-gray-50 transition"
              >
                <img
                  src={order.order_variation?.imagePath}
                  alt="product"
                  className="w-16 h-16 object-contain rounded"
                />
                <div className="flex-1 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-semibold truncate">
                      {order.prod_num?.shop_Name} - {order.prod_num?.item_Name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {order.id} |{' '}{order.transaction_id} |{' '}
                      {new Date(order.date_of_order).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 truncate">
                    {order.acc_num?.full_name} - {order.shipping_addr}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">
                        ₱{Number(order.total_price).toLocaleString('en-US')}{' '}
                      </span>
                      <span className="text-xs text-gray-500">
                        | Qty: {order.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.payment_status === 'Pending to Admin'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                      <button
                        onClick={() => openModal(order.proof_of_payment)}
                        className="text-blue-600 text-xs underline hover:text-blue-800"
                      >
                        Proof
                      </button>
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-700">
        <Pagination
          currentPage={currentPage}
          totalItems={orders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-3 rounded-lg max-w-lg max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-md font-semibold">Proof of Payment</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Proof of payment"
                className="max-w-full max-h-[60vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersTab;