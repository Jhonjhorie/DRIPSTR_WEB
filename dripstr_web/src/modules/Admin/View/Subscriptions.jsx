import React, { useState, useEffect } from 'react';
import { supabase } from '../../../constants/supabase';
import Sidebar from './Shared/Sidebar';

function Subscriptions() {
    const [activeTab, setActiveTab] = useState('Artists');
    const [artists, setArtists] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedScreenshot, setSelectedScreenshot] = useState(null); // New state for modal

    // Fetch functions remain unchanged
    const fetchArtists = async () => {
        try {
            const { data, error } = await supabase
                .from('artist_Subscription')
                .select('*, artist_Id(artist_Name, contact_number, is_Premium), user_Id(full_name)')
                .eq('status', 'Pending')
                .eq('payment', 'Gcash');

            if (error) throw error;
            setArtists(data || []);
        } catch (error) {
            console.error('Error fetching artists:', error.message);
            setError(error.message);
            setArtists([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMerchants = async () => {
        try {
            const { data, error } = await supabase
                .from('merchant_Subscription')
                .select('*, merchant_Id(shop_name, contact_number, is_Premium), user_Id(full_name)')
                .eq('payment', 'Gcash')
                .eq('status', 'Pending');

            if (error) throw error;
            setMerchants(data || []);
        } catch (error) {
            console.error('Error fetching merchants:', error.message);
            setError(error.message);
            setMerchants([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'Artists') {
            fetchArtists();
        } else if (activeTab === 'Merchants') {
            fetchMerchants();
        }
    }, [activeTab]);

    const approveItem = async (id) => {
        try {
            // Start a transaction-like operation
            setLoading(true);
            
            // Determine if it's an artist or merchant based on activeTab
            if (activeTab === 'Artists') {
                // 1. Get the artist subscription details first
                const { data: subscription, error: fetchError } = await supabase
                    .from('artist_Subscription')
                    .select('artist_Id')
                    .eq('id', id)
                    .single();
    
                if (fetchError) throw fetchError;
    
                // 2. Update artist's is_Premium status
                const { error: artistError } = await supabase
                    .from('artist')
                    .update({ is_Premium: true })
                    .eq('id', subscription.artist_Id);
    
                if (artistError) throw artistError;
    
                // 3. Update subscription status
                const { error: statusError } = await supabase
                    .from('artist_Subscription')
                    .update({ status: 'Completed' })
                    .eq('id', id);
    
                if (statusError) throw statusError;
    
            } else if (activeTab === 'Merchants') {
                // 1. Get the merchant subscription details first
                const { data: subscription, error: fetchError } = await supabase
                    .from('merchant_Subscription')
                    .select('merchant_Id')
                    .eq('id', id)
                    .single();
    
                if (fetchError) throw fetchError;
    
                // 2. Update merchant's is_Premium status
                const { error: merchantError } = await supabase
                    .from('shop') // Assuming the table name is 'shop' for merchants
                    .update({ is_Premium: true })
                    .eq('id', subscription.merchant_Id);
    
                if (merchantError) throw merchantError;
    
                // 3. Update subscription status
                const { error: statusError } = await supabase
                    .from('merchant_Subscription')
                    .update({ status: 'Completed' })
                    .eq('id', id);
    
                if (statusError) throw statusError;
            }
    
            // Refresh the data after successful update
            if (activeTab === 'Artists') {
                await fetchArtists();
            } else {
                await fetchMerchants();
            }
    
        } catch (error) {
            console.error('Error approving item:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    
    const declineItem = (id) => console.log(`Declined item with ID: ${id}`);

    // Function to open modal
    const openModal = (screenshot) => {
        setSelectedScreenshot(screenshot);
    };

    // Function to close modal
    const closeModal = () => {
        setSelectedScreenshot(null);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4 bg-slate-900 rounded-lg">
                <h1 className='text-white text-2xl font-semibold mb-4'>Subscription</h1>
                <div className="flex space-x-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-md font-medium ${activeTab === 'Artists' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                        onClick={() => setActiveTab('Artists')}
                    >
                        Artists
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md font-medium ${activeTab === 'Merchants' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                        onClick={() => setActiveTab('Merchants')}
                    >
                        Merchants
                    </button>
                </div>

                <h1 className="text-2xl font-bold mb-4 text-white">{activeTab}</h1>

                {loading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-900">
                        {(activeTab === 'Artists' ? artists : merchants).length === 0 ? (
                            <p className="text-gray-400 text-center col-span-full py-10">
                                No items found
                            </p>
                        ) : (
                            (activeTab === 'Artists' ? artists : merchants).map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                                >
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-semibold text-gray-800 truncate">
                                                {item.artist_Id?.artist_Name || item.merchant_Id?.shop_name}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item.user_Id?.full_name}
                                            </p>
                                            <h3 className="text-xl font-semibold text-gray-800 truncate">
                                                {item.artist_Id?.contact_number || item.merchant_Id?.contact_number}
                                            </h3>
                                            <p className="text-gray-700">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item.reason || 'N/A'}
                                            </p>
                                            {/* Updated screenshot display */}
                                            <p 
                                                className="text-sm text-blue-600 cursor-pointer hover:underline"
                                                onClick={() => openModal(item.screenshot)}
                                            >
                                                Proof
                                            </p>
                                            <div className="text-sm text-white bg-orange-500 rounded-md w-[3.5rem]">
                                                <p className="text-sm text-white text-center">
                                                    {item.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <button
                                                onClick={() => approveItem(item.id)}
                                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Modal */}
                {selectedScreenshot && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-4 w-[20rem">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Payment Proof</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    ×
                                </button>
                            </div>
                            <img
                                src={selectedScreenshot}
                                alt="Payment Proof"
                                className="w-full h-auto max-h-[70vh] object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Subscriptions;