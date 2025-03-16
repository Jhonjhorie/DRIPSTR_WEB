import React, { useState, useEffect } from 'react';
import { supabase } from '../../../constants/supabase';

function RefundsTab() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(
          'id, acc_num(full_name, mobile), prod_num(item_Name, shop_Name), shop_id(wallet(id, revenue)), *'
        )
        .eq('refund_status', 'Requested');

      if (error) throw error;
      setRefunds(data || []);
    } catch (error) {
      console.error('Error in fetchRefunds:', error.message);
      setError(error.message);
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleApproveRefund = async (orderId) => {
    try {
      const now = new Date();
      const phtOffset = 8 * 60 * 60 * 1000; // 8 hours in milliseconds for PHT
      const phtTime = new Date(now.getTime() + phtOffset).toISOString();
  
      // 1. Get the order details including shop_id and its wallet relationship
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          total_price,
          shop_id (
            wallet (
              id,
              revenue
            )
          )
        `)
        .eq('id', orderId)
        .single();
  
      if (orderError) throw orderError;
  
      // 2. Get the wallet data from the nested relationship
      const walletData = orderData.shop_id?.wallet;
      if (!walletData || !walletData.id) {
        throw new Error('Wallet not found for this shop');
      }
  
      // 3. Calculate 97% of total_price
      const refundAmount = Number(orderData.total_price) * 0.97;
  
      // 4. Calculate new revenue
      const newRevenue = Number(walletData.revenue) - refundAmount;
  
      // 5. Start a transaction to update both tables atomically
      await Promise.all([
        // Update order refund status
        supabase
          .from('orders')
          .update({ 
            refund_status: 'Approved', 
            refund_processed_at: phtTime,
            payment_status: 'Refunded'
          })
          .eq('id', orderId),
  
        // Update shop wallet revenue
        supabase
          .from('merchant_Wallet')
          .update({ 
            revenue: newRevenue,
          })
          .eq('id', walletData.id)
      ]);
  
      await fetchRefunds(); // Refetch data after update
    } catch (error) {
      console.error('Error approving refund:', error.message);
      setError(error.message); // Optional: show error to user
    }
  };

  const handleRejectRefund = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ refund_status: 'Rejected' })
        .eq('id', orderId);

      if (error) throw error;
      await fetchRefunds(); // Refetch data after update
    } catch (error) {
      console.error('Error rejecting refund:', error.message);
    }
  };

  return (
    <div className="p-3 flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <h2 className="text-xl font-semibold text-white mb-2">Refunds</h2>
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : refunds.length === 0 ? (
          <p className="text-white text-center font-semibold">No Refund Requests</p>
        ) : (
          <div className="space-y-2">
            {refunds.map((refund) => (
              <div
                key={refund.id}
                className="flex items-center bg-white rounded-lg shadow-sm p-2 gap-2 hover:bg-gray-50 transition"
              >
                <img
                  src={refund.order_variation?.imagePath}
                  alt="product"
                  className="w-16 h-16 object-contain rounded"
                />
                <div className="flex-1 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-semibold truncate">
                      {refund.prod_num?.shop_Name} - {refund.prod_num?.item_Name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {refund.id} |{' '}{refund.transaction_id} |{' '}
                      {new Date(refund.refund_requested_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    {refund.acc_num?.full_name} - {refund.shipping_addr}
                  </p>
                  <p className="text-gray-600 line-clamp-2">
                    Mobile Number: {refund.acc_num?.mobile}
                  </p>
                  <p className="text-gray-600 line-clamp-2">
                    Payment Method: {refund.payment_method}
                  </p>
                  <p className="text-gray-600 line-clamp-2">
                    Reason: {refund.refund_reason}
                  </p>
                  {refund.payment_method === 'Gcash' && (
                    <p
                      className="text-blue-600 text-xs underline cursor-pointer hover:text-blue-800"
                      onClick={() => openModal(refund.refund_images)}
                    >
                      Proof of Payment
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">
                        ₱{Number(refund.total_price).toLocaleString('en-US')}{' '}
                      </span>
                      <span className="text-xs text-gray-500">
                        | Qty: {refund.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                        {refund.refund_status}
                      </span>
                      <button
                        onClick={() => handleApproveRefund(refund.id)}
                        className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRefund(refund.id)}
                        className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default RefundsTab;