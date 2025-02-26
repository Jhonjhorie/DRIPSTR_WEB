import React, { useState, useEffect } from 'react';
import Sidebar from './Shared/Sidebar';
import { supabase } from "../../../constants/supabase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function Payout() {
    const [selectedTab, setSelectedTab] = useState('Merchants');
    const [merchantCashout, setMerchantCashout] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        fetchMerchantCashout();
    }, []);

    const fetchMerchantCashout = async () => {
        const { data, error } = await supabase
            .from('merchant_Cashout')
            .select('id, created_at, full_Name, owner_Id(mobile), qty, reason, status, revenue(id, revenue)')
            .eq('status', 'Pending');
        if (error) {
            console.error("Error fetching cashout:", error);
        } else {
            setMerchantCashout(data);
        }
    };

    const handleApprove = async (item) => {
        try {
            const currentRevenue = item.revenue?.revenue ?? 0;
            const newRevenue = currentRevenue - item.qty;
    
            if (item.revenue?.id) {
                const { error: walletError } = await supabase
                    .from('merchant_Wallet')
                    .update({ revenue: newRevenue })
                    .eq('id', item.revenue.id);
    
                if (walletError) {
                    throw walletError;
                }
            } else {
                console.warn('No linked wallet found for this cashout. Skipping wallet update.');
            }
    
            const { error: cashoutError } = await supabase
                .from('merchant_Cashout')
                .update({ status: 'Success' })
                .eq('id', item.id);
    
            if (cashoutError) {
                throw cashoutError;
            }

            // Show success modal
            setShowSuccessModal(true);
            
            // Refresh data
            await fetchMerchantCashout();

            // Hide modal after 1.5 seconds
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 1500);
    
            console.log('Cashout approved successfully');
        } catch (error) {
            console.error('Error approving cashout:', error.message);
        }
    };

    return (
        <div className='flex flex-row'>
            <Sidebar />
            <div className='bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-screen'>
                <h1 className='font-bold text-white text-xl mb-4'>Payouts</h1>
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

                {selectedTab === 'Merchants' ? (
                    <div className="container mx-auto p-4">
                        <h2 className="text-2xl font-bold mb-4 text-white">Pending Merchant Cashouts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {merchantCashout.length > 0 ? (
                                merchantCashout.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                                    >
                                        <div className="flex flex-row justify-between mb-3">
                                            <div className='flex flex-col'>
                                                <h3 className="text-lg font-semibold text-black">
                                                    {item.full_Name}
                                                </h3>
                                                <p className="text-sm text-black">
                                                    {new Date(item.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                className='text-green-500 text-3xl cursor-pointer hover:text-green-600'
                                                onClick={() => handleApprove(item)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-black">
                                                <span className="font-medium">Mobile:</span>{' '}
                                                {item.owner_Id?.mobile || 'None'}
                                            </p>
                                            <p className="text-black">
                                                <span className="font-medium">Wallet Amount:</span>{' '}
                                                P{item.revenue?.revenue || 0}.00
                                            </p>
                                            <p className="text-black">
                                                <span className="font-medium">Cashout Amount:</span>{' '}
                                                P{item.qty || 0}.00
                                            </p>
                                            <p className="text-black">
                                                <span className="font-medium">Reason:</span>{' '}
                                                {item.reason}
                                            </p>
                                            <p className="text-black">
                                                <span className="font-medium">Status:</span>{' '}
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
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
    <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg animate-fade-in-out">
            <p className="text-lg font-semibold">Cashout Success</p>
        </div>
    </div>
)}
        </div>
    );
}


export default Payout;