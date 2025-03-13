import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const tabs = [
    'All',
    'GCash Approval',
    'Preparing',
    'To Ship',
    'To Deliver',
    'Delivered',
 
    'Refund Requests',
    'Cancelled'

  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:acc_num (username, full_name),
          shop_Product:prod_num (item_Name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(searchQuery) ||
        order.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shop_Product?.item_Name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (selectedTab) {
      case 'GCash Approval':
        return filtered.filter(order => 
          order.payment_method === 'Gcash' && 
          order.payment_status === 'Pending to Admin'
        );
 
      case 'Preparing':
        return filtered.filter(order => 
          order.shipping_status === 'To prepare' && 
          (order.payment_status === 'Paid' || order.payment_method === 'COD')
        );
      case 'To Ship':
        return filtered.filter(order => 
          order.shipping_status === 'To ship'
        );
      case 'To Deliver':
        return filtered.filter(order => 
          order.shipping_status === 'To deliver'
        );
      case 'Delivered':
        return filtered.filter(order => 
          order.shipping_status === 'delivered'
        );
      case 'Cancelled':
        return filtered.filter(order => 
          order.shipping_status === 'cancel' 
        );
      case 'Refund Requests':
        return filtered.filter(order => 
          order.refund_status === 'Requested'
        );
      default:
        return filtered;
    }
  };

  const handlePaymentVerification = async (orderId, isApproved) => {
    try {
      const updates = {
        payment_status: isApproved ? 'Paid' : 'Rejected',
        shipping_status: isApproved ? 'To prepare' : 'cancel',
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;
      
      // Reload orders after update
      fetchOrders();
      
      // Show success message (you can add a toast notification here)
      alert(isApproved ? 'Payment approved successfully' : 'Payment rejected');
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error updating payment status');
    }
  };

  const handleRefundRequest = async (orderId, isApproved) => {
    try {
      const updates = {
        refund_status: isApproved ? 'Approved' : 'Rejected',
        refund_processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Set payment_status to Refunded if approved
        payment_status: isApproved ? 'Refunded' : 'Paid',
        // Set shipping_status to complete if approved
        shipping_status: isApproved ? 'complete' : 'delivered'
      };

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;
      
      // Reload orders after update
      fetchOrders();
      
      // Show success message
      alert(isApproved ? 'Refund approved successfully' : 'Refund rejected');
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Error processing refund request');
    }
  };

  const handleCancellation = async (orderId, isApproved) => {
    try {
      const updates = {
        cancellation_status: isApproved ? 'Approved' : 'Rejected',
        shipping_status: isApproved ? 'cancel' : null,
        updated_at: new Date().toISOString()
      };

      if (isApproved) {
        updates.payment_status = 'Cancelled';
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;
      
      // Reload orders after update
      fetchOrders();
      
      // Show success message
      alert(isApproved ? 'Cancellation approved successfully' : 'Cancellation rejected');
    } catch (error) {
      console.error('Error processing cancellation:', error);
      alert('Error processing cancellation request');
    }
  };

  const handleShippingUpdate = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ shipping_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Error updating shipping status:', error);
    }
  };

  const ImageModal = ({ imageUrl, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-[90vh] bg-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700"
        >
          ✕
        </button>
        <img
          src={imageUrl}
          alt="Proof of Payment"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );

  const RefundImagesModal = ({ images, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-[90vh] bg-gray-800 rounded-lg p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700"
        >
          ✕
        </button>
        <div className="grid grid-cols-2 gap-4 mt-8">
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Refund Evidence ${index + 1}`}
              className="w-full h-64 object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-white mb-6">Order Management</h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-2 px-4 ${
                selectedTab === tab
                  ? 'text-violet-400 border-b-2 border-violet-400'
                  : 'text-gray-400 hover:text-violet-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-6 bg-gray-800 text-white rounded border border-gray-700"
        />

        {/* Orders List */}
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <div className="space-y-4">
            {getFilteredOrders().map((order) => (
              <div key={order.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div> 
                    <h3 className="text-white text-lg font-semibold">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-400">
                      Customer: {order.profiles?.full_name || 'N/A'}
                    </p>
                    <p className="text-gray-400">
                      Product: {order.shop_Product?.item_Name || 'N/A'}
                    </p>
                    <p className="text-gray-400">
                      Payment Method: {order.payment_method}
                    </p>
                    {order.payment_method === 'Gcash' && order.proof_of_payment && (
                      <div className="mt-2">
                        <p className="text-gray-400 mb-2">Proof of Payment:</p>
                        <img
                          src={order.proof_of_payment}
                          alt="Proof of Payment"
                          className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => {
                            setSelectedImage(order.proof_of_payment);
                            setShowImageModal(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-violet-400 font-bold">
                      ₱{order.final_price}
                    </p>
                    <p className="text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {order.refund_status === 'Requested' && (
                  <div className="mt-4 p-4 bg-gray-700 rounded">
                    <h4 className="text-white font-semibold mb-2">Refund Request Details</h4>
                    <p className="text-gray-300">Reason: {order.refund_reason}</p>
                    <p className="text-gray-300">
                      Requested at: {new Date(order.refund_requested_at).toLocaleString()}
                    </p>
                    {order.refund_images && order.refund_images.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedImage(order.refund_images);
                          setShowImageModal(true);
                        }}
                        className="flex items-center gap-2 text-violet-400 hover:text-violet-300 mt-2"
                      >
                        <FontAwesomeIcon icon={faImages} />
                        View Evidence ({order.refund_images.length} images)
                      </button>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.payment_method === 'Gcash' && 
                   order.payment_status === 'Pending to Admin' && (
                    <>
                      <button
                        onClick={() => handlePaymentVerification(order.id, true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve Payment
                      </button>
                      <button
                        onClick={() => handlePaymentVerification(order.id, false)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject Payment
                      </button>
                    </>
                  )}

                  {order.refund_status === 'Requested' && (
                    <>
                      <button
                        onClick={() => handleRefundRequest(order.id, true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve Refund
                      </button>
                      <button
                        onClick={() => handleRefundRequest(order.id, false)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject Refund
                      </button>
                    </>
                  )}

                  {order.cancellation_status === 'Requested' && (
                    <>
                      <button
                        onClick={() => handleCancellation(order.id, true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve Cancellation
                      </button>
                      <button
                        onClick={() => handleCancellation(order.id, false)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject Cancellation
                      </button>
                    </>
                  )}

                  {['To prepare', 'To ship', 'To deliver'].includes(order.shipping_status) && (
                    <select
                      onChange={(e) => handleShippingUpdate(order.id, e.target.value)}
                      value={order.shipping_status}
                      className="px-4 py-2 bg-gray-700 text-white rounded"
                    >
                      <option value="To prepare">Preparing</option>
                      <option value="To ship">To Ship</option>
                      <option value="To deliver">To Deliver</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {showImageModal && (
          Array.isArray(selectedImage) ? (
            <RefundImagesModal
              images={selectedImage}
              onClose={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
            />
          ) : (
            <ImageModal
              imageUrl={selectedImage}
              onClose={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Orders;