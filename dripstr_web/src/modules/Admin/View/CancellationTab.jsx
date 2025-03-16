import React, { useState, useEffect } from 'react';
import { supabase } from '../../../constants/supabase';
import Pagination from './Components/Pagination';

function CancellationTab() {
    const [cancellations, setCancellations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const itemsPerPage = 3; // Same as OrdersTab
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCancellations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select(
                    'id, acc_num(full_name), prod_num(item_Name, shop_Name), quantity, total_price, order_variation, shipping_addr, transaction_id, date_of_order, cancellation_status, payment_method, proof_of_payment, cancellation_reason, shipping_status'
                )
                .eq('cancellation_status', 'Requested');

            if (error) throw error;
            setCancellations(data || []);
        } catch (error) {
            console.error('Error in fetchCancellations:', error.message);
            setError(error.message);
            setCancellations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCancellations();
    }, []);

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const handleApproveCancellation = async (orderId) => {
        try {
            const now = new Date();
            const phtOffset = 8 * 60 * 60 * 1000; // 8 hours in milliseconds for PHT
            const phtTime = new Date(now.getTime() + phtOffset).toISOString();
            // 1. Get order details including payment_method
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select(`
          total_price,
          payment_method,
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

            // 2. Prepare the basic update for all cases
            const updates = [
                supabase
                    .from('orders')
                    .update({
                        cancellation_status: 'Approved',
                        shipping_status: 'Cancelled',
                        payment_status: 'Cancelled',
                        updated_at: phtTime,
                        isPaid: false
                    })
                    .eq('id', orderId)
            ];

            // 3. If payment method is Gcash, handle wallet deduction
            if (orderData.payment_method === 'Gcash') {
                // Get wallet data
                const walletData = orderData.shop_id?.wallet;
                if (!walletData || !walletData.id) {
                    throw new Error('Wallet not found for this shop');
                }

                // Calculate 97% of total_price
                const refundAmount = Number(orderData.total_price) * 0.97;

                // Calculate new revenue
                const newRevenue = Number(walletData.revenue) - refundAmount;

                // Add wallet update to the transaction
                updates.push(
                    supabase
                        .from('merchant_Wallet')
                        .update({
                            revenue: newRevenue,
                        })
                        .eq('id', walletData.id)
                );
            }

            // 4. Execute all updates atomically
            await Promise.all(updates);

            await fetchCancellations(); // Refetch data after update
        } catch (error) {
            console.error('Error approving cancellation:', error.message);
            // Optionally set an error state to show to user
            // setError(error.message);
        }
    };

    const handleRejectCancellation = async (orderId) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ cancellation_status: 'Rejected' })
                .eq('id', orderId);

            if (error) throw error;
            await fetchCancellations();
        } catch (error) {
            console.error('Error rejecting cancellation:', error.message);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCancellations = cancellations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(cancellations.length / itemsPerPage);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-3">
                <h2 className="text-xl font-semibold text-white mb-2">Cancellations</h2>
                {loading ? (
                    <p className="text-white text-center">Loading...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : currentCancellations.length === 0 ? (
                    <p className="text-white text-center font-semibold">No Cancellation Requests</p>
                ) : (
                    <div className="space-y-2">
                        {currentCancellations.map((cancellation) => (
                            <div
                                key={cancellation.id}
                                className="flex items-center bg-white rounded-lg shadow-sm p-2 gap-2 hover:bg-gray-50 transition"
                            >
                                <img
                                    src={cancellation.order_variation?.imagePath}
                                    alt="product"
                                    className="w-16 h-16 object-contain rounded"
                                />
                                <div className="flex-1 text-sm text-gray-800">
                                    <div className="flex justify-between">
                                        <span className="font-semibold truncate">
                                            {cancellation.prod_num?.shop_Name} - {cancellation.prod_num?.item_Name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {cancellation.id} | {cancellation.transaction_id} |{' '}
                                            {new Date(cancellation.date_of_order).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 line-clamp-2">
                                        {cancellation.acc_num?.full_name} - {cancellation.shipping_addr}
                                    </p>
                                    <p className="text-gray-600 line-clamp-2">
                                        Payment Method: {cancellation.payment_method}
                                    </p>
                                    <p className="text-gray-600 line-clamp-2">
                                        Reason: {cancellation.cancellation_reason}
                                    </p>
                                    {cancellation.payment_method === 'Gcash' && (
                                        <p
                                            className="text-blue-600 text-xs underline cursor-pointer hover:text-blue-800"
                                            onClick={() => openModal(cancellation.proof_of_payment)}
                                        >
                                            Proof of Payment
                                        </p>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium">
                                                ₱{Number(cancellation.total_price).toLocaleString('en-US')}{' '}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                | Qty: {cancellation.quantity}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                                                {cancellation.cancellation_status}
                                            </span>
                                            <button
                                                onClick={() => handleApproveCancellation(cancellation.id)}
                                                className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600 transition"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectCancellation(cancellation.id)}
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
            <div className="p-3 border-t border-gray-700">
                <Pagination
                    currentPage={currentPage}
                    totalItems={cancellations.length}
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

export default CancellationTab;