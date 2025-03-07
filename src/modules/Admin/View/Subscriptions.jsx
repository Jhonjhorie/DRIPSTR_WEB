import React, { useState, useEffect } from 'react';
import { supabase } from '../../../constants/supabase';
import Sidebar from './Shared/Sidebar';

function Subscriptions() {
    const [activeTab, setActiveTab] = useState('Artists'); // Default tab
    const [artists, setArtists] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Artists
    const fetchArtists = async () => {
        try {
            const { data, error } = await supabase
                .from('artist_Subscription')
                .select('*, artist_Id(artist_Name, contact_number, is_Premium)')
                .eq('status', 'Pending')
                .eq('payment', 'Gcash')


            if (error) throw error;

            console.log('Fetched artists:', data);
            setArtists(data || []);
        } catch (error) {
            console.error('Error fetching artists:', error.message);
            setError(error.message);
            setArtists([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Merchants (assuming a 'merchants' table exists)
    const fetchMerchants = async () => {
        try {
            const { data, error } = await supabase
                .from('merchants') // Replace with your actual table name
                .select('*, merchant_Id(merchant_Name)') // Adjust fields as needed
                .eq('status', 'Pending');

            if (error) throw error;

            console.log('Fetched merchants:', data);
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

    // Placeholder action functions (replace with actual logic)
    const approveItem = (id) => console.log(`Approved item with ID: ${id}`);
    const declineItem = (id) => console.log(`Declined item with ID: ${id}`);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4 bg-slate-900 rounded-lg">
                <h1 className='text-white text-2xl font-semibold mb-4'>Subscription</h1>
                {/* Tab Navigation */}
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

                {/* Loading State */}
                {loading && (
                    <p className="text-gray-500">Loading...</p>
                )}

                {/* Error State */}
                {error && (
                    <p className="text-red-500">Error: {error}</p>
                )}

                {/* Data Display */}
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

                                    {/* Details Section */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-semibold text-gray-800 truncate">
                                                {item.artist_Id?.artist_Name}
                                            </h3>
                                            <h3 className="text-xl font-semibold text-gray-800 truncate">
                                            {item.artist_Id?.contact_number}
                                            </h3>
                                            <p className="text-gray-700">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item.reason}
                                            </p>
                                            <div className="text-sm text-white bg-orange-500 rounded-md w-[3.5rem]  ">
                                            <p className="text-sm text-white text-center">
                                                {item.status}
                                            </p>
                                            </div>
                                        </div>
                                        {/* Buttons Section */}
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
            </div>
        </div>
    );
}

export default Subscriptions;