import React, { useState, useEffect } from 'react';
import Sidebar from './Shared/Sidebar';
import { supabase } from "../../../constants/supabase";

function Payout() {
    // Manage the selected tab (either 'Merchants' or 'Artists')
    const [selectedTab, setSelectedTab] = useState('Merchants');
    const [merchantCashout, setMerchantCashout] = useState([]);

    useEffect(() => {
        const fetchMerchantCashout = async () => {
            const { data, error } = await supabase
                .from('merchant_Cashout')
                .select('id, created_at, full_Name, owner_Id(mobile), qty, reason, status, revenue(revenue)')
                .eq('status', 'Pending');
            if (error) {
                console.error("Error fetching cashout:", error);
            } else {
                setMerchantCashout(data);
            }
        };

        fetchMerchantCashout();
    }, []);

    return (
        <>
            <div className='flex flex-row'>
                <Sidebar />
                <div className='bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-screen'>
                    <h1 className='font-bold text-white text-xl mb-4'>Payouts</h1>
                    {/* Tab buttons */}
                    <div className="flex mb-6">
                        <button
                            className={`text-white p-2 mr-4 rounded-lg ${selectedTab === 'Merchants' ? 'bg-blue-500' : 'bg-gray-700'}`}
                            onClick={() => setSelectedTab('Merchants')}
                        >
                            Merchants
                        </button>
                        <button
                            className={`text-white p-2 rounded-lg ${selectedTab === 'Artists' ? 'bg-blue-500' : 'bg-gray-700'}`}
                            onClick={() => setSelectedTab('Artists')}
                        >
                            Artists
                        </button>
                    </div>

                    {/* Tab content */}
                    {selectedTab === 'Merchants' ? (
                        <div className="container mx-auto p-4">
                            <h2 className="text-2xl font-bold mb-4">Pending Merchant Cashouts</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {merchantCashout.length > 0 ? (
                                    merchantCashout.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                                        >
                                            <div className="mb-4">
                                                <h3 className="text-lg font-semibold text-black">
                                                    {item.full_Name}
                                                </h3>
                                                <p className="text-sm text-black">
                                                    {new Date(item.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-black">
                                                    <span className="font-medium">Mobile:</span>
                                                    {' '}
                                                    {item.owner_Id?.mobile || 'None'}
                                                </p>
                                                <p className="text-black">
                                                    <span className="font-medium">Wallet Amount:</span>
                                                    {' '}
                                                    P{item.revenue?.revenue}.00
                                                </p>
                                                <p className="text-black">
                                                    <span className="font-medium">Cashout Amoutnt:</span>
                                                    {' '}
                                                    P{item.qty}.00
                                                </p>
                                                <p className="text-black">
                                                    <span className="font-medium">Reason:</span>
                                                    {' '}
                                                    {item.reason}
                                                </p>
                                                <p className="text-black">
                                                    <span className="font-medium">Status:</span>
                                                    {' '}
                                                    <span className="inline-block px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                                                        {item.status}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No pending cashouts found
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-white">
                            <h2 className="font-semibold">Artists' Payout Requests</h2>
                            <p>Content for Artists goes here.</p>
                            {/* Add content for Artists */}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Payout;
