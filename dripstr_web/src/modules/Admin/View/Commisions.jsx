import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';

function Commissions() {
    const [commissions, setCommissions] = useState([]);
    const [merchantCommissions, setMerchantCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Artist');
    const [statusTab, setStatusTab] = useState('Pending');
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchMerchantCommissions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('merchant_Commission')
                .select(`
                    id,
                    created_at,
                    client_Id(full_name),
                    fullName,
                    image,
                    description,
                    pricing,
                    status,
                    merchantId(shop_name, wallet(id, revenue)),
                    filePath,
                    notes,
                    receipt
                `);
            if (error) throw error;
            setMerchantCommissions(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCommissions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('art_Commision')
                .select(`
                    id,
                    created_at,
                    client_Id(full_name),
                    artist_Id(artist_Name, wallet(id, revenue)),
                    title,
                    description,
                    deadline,
                    image,
                    payment,
                    commission_Status,
                    image_Ref
                `);
            if (error) throw error;
            setCommissions(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };



    const handleCheck = async (commissionId) => {
        if (!commissionId) {
            setError('Commission ID is undefined');
            return;
        }
        try {
            const { data: commission, error: fetchError } = await supabase
                .from('art_Commision')
                .select(`
                    payment,
                    artist_Id (id, wallet)
                `)
                .eq('id', commissionId)
                .single();

            if (fetchError) throw fetchError;
            if (!commission || !commission.artist_Id || !commission.artist_Id.wallet) {
                throw new Error('Invalid commission or wallet data');
            }

            const { data: wallet, error: walletFetchError } = await supabase
                .from('artist_Wallet')
                .select('id, revenue')
                .eq('id', commission.artist_Id.wallet)
                .single();

            if (walletFetchError) throw walletFetchError;
            if (!wallet || typeof wallet.revenue === 'undefined') {
                throw new Error('Wallet data is incomplete');
            }

            const paymentToArtist = commission.payment * 0.99;
            const walletId = wallet.id;
            const currentRevenue = wallet.revenue;

            const [walletUpdate, statusUpdate] = await Promise.all([
                supabase
                    .from('artist_Wallet')
                    .update({ revenue: currentRevenue + paymentToArtist })
                    .eq('id', walletId),
                supabase
                    .from('art_Commision')
                    .update({ commission_Status: 'Processed' })
                    .eq('id', commissionId),
            ]);

            if (walletUpdate.error) throw walletUpdate.error;
            if (statusUpdate.error) throw statusUpdate.error;

            await fetchCommissions();
        } catch (error) {
            console.error('Error processing commission:', error.message);
            setError(error.message);
        }
    };

    const handleMerchantCheck = async (commissionId) => {
        if (!commissionId) {
            setError('Commission ID is undefined');
            return;
        }
        try {
            const { data: commission, error: fetchError } = await supabase
                .from('merchant_Commission')
                .select(`
                    pricing,
                    merchantId (id, wallet)
                `)
                .eq('id', commissionId)
                .single();

            if (fetchError) throw fetchError;
            if (!commission || !commission.merchantId || !commission.merchantId.wallet) {
                throw new Error('Invalid commission or wallet data');
            }

            const { data: wallet, error: walletFetchError } = await supabase
                .from('merchant_Wallet')
                .select('id, revenue')
                .eq('id', commission.merchantId.wallet)
                .single();

            if (walletFetchError) throw walletFetchError;
            if (!wallet || typeof wallet.revenue === 'undefined') {
                throw new Error('Wallet data is incomplete');
            }

            const paymentToMerchant = commission.pricing * 0.97;
            const walletId = wallet.id;
            const currentRevenue = wallet.revenue;

            const [walletUpdate, statusUpdate] = await Promise.all([
                supabase
                    .from('merchant_Wallet')
                    .update({ revenue: currentRevenue + paymentToMerchant })
                    .eq('id', walletId),
                supabase
                    .from('merchant_Commission')
                    .update({ status: 'Processed' })
                    .eq('id', commissionId),
            ]);

            if (walletUpdate.error) throw walletUpdate.error;
            if (statusUpdate.error) throw statusUpdate.error;

            await fetchMerchantCommissions();
        } catch (error) {
            console.error('Error processing commission:', error.message);
            setError(error.message);
        }
    };

    const handleConfirm = async (commissionId) => {
        if (!commissionId) {
            setError('Commission ID is undefined');
            return;
        }
        try {
            const { error } = await supabase
                .from('art_Commision')
                .update({ commission_Status: 'Confirmed' })
                .eq('id', commissionId);

            if (error) throw error;
            await fetchCommissions();
        } catch (error) {
            console.error('Error confirming commission:', error.message);
            setError(error.message);
        }
    };

    const handleMerchantConfirm = async (commissionId) => {
        if (!commissionId) {
            setError('Commission ID is undefined');
            return;
        }
        try {
            const { error } = await supabase
                .from('merchant_Commission')
                .update({ status: 'Confirmed' })
                .eq('id', commissionId);

            if (error) throw error;
            await fetchMerchantCommissions();
        } catch (error) {
            console.error('Error confirming commission:', error.message);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchCommissions();
        fetchMerchantCommissions();
        const interval = setInterval(() => {
            fetchCommissions();
            fetchMerchantCommissions();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const filteredCommissions = activeTab === 'Artist' ? commissions : merchantCommissions;
    const filteredData = filteredCommissions.filter((commission) => {
        const isStatusTab = commission.status === statusTab || commission.commission_Status === statusTab;
        return isStatusTab;
    });

    const handleImageClick = (image) => {
        console.log("Image clicked:", image);
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className='flex'>
            <Sidebar />
            <div className="flex-1 p-4 bg-slate-900 rounded-lg">
                <h1 className='text-2xl font-bold mb-4 text-white'>Commissions</h1>
                <div className="flex gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-md text-white ${activeTab === 'Artist' ? 'bg-blue-600' : 'bg-gray-600'}`}
                        onClick={() => setActiveTab('Artist')}
                    >
                        Artist
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-white ${activeTab === 'Merchant' ? 'bg-blue-600' : 'bg-gray-600'}`}
                        onClick={() => setActiveTab('Merchant')}
                    >
                        Merchant
                    </button>
                </div>
                <div className="flex gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-md text-white ${statusTab === 'Pending' ? 'bg-blue-600' : 'bg-gray-600'}`}
                        onClick={() => setStatusTab('Pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-white ${statusTab === 'Completed' ? 'bg-blue-600' : 'bg-gray-600'}`}
                        onClick={() => setStatusTab('Completed')}
                    >
                        Completed
                    </button>
                </div>
                <div>
                    {loading ? (
                        <p className="text-white">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="flex flex-col gap-3 w-full">
                            {filteredData.length === 0 ? (
                                <h1 className="flex justify-center items-center font-bold text-2xl text-white py-4">
                                    No {statusTab} {activeTab} Commissions
                                </h1>
                            ) : (
                                filteredData.map((commission) => (
                                    <div
                                        key={commission.id}
                                        className="border rounded-md shadow-sm p-3 w-full bg-white flex items-center gap-3 hover:shadow-md transition-shadow"
                                    >
                                        <img

                                            src={activeTab === 'Artist' ? commission.image_Ref : commission.filePath}
                                            alt={activeTab === 'Artist' ? commission.image_Ref || 'No image available' : commission.filePath || 'No image available'}

                                            className="w-[5.5rem] h-[5.5rem] rounded-sm object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 text-sm">
                                            <div className="flex justify-between items-baseline">
                                                <h2 className="font-semibold text-black truncate">
                                                    {commission.title || `Commission ${commission.id}`}
                                                </h2>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(commission.created_at).toLocaleDateString()} - {new Date(commission.deadline).toLocaleDateString() === 'Invalid Date' ? 'No Deadline' : new Date(commission.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-black truncate">
                                                {commission.artist_Id
                                                    ? `Artist: ${commission.artist_Id.artist_Name}`
                                                    : commission.merchantId
                                                        ? `Merchant: ${commission.merchantId.shop_name}`
                                                        : 'Not commissioned by a merchant yet.'}
                                            </p>
                                            <p className="text-black truncate">
                                                To: {commission.client_Id?.full_name}
                                            </p>
                                            <p className="text-black truncate">
                                                Commission Amount: ₱{Number(commission.pricing || commission.payment).toLocaleString('en-US')}.00
                                            </p>
                                            <p className="text-black truncate max-w-[70%]">
                                                Instruction: {commission.description} - Notes: {commission.notes || 'None'}
                                            </p>
                                            <p
                                                className="text-blue-700 underline truncate cursor-pointer"
                                                onClick={() => handleImageClick(activeTab === 'Artist' ? commission.image : commission.receipt)}
                                            >
                                                Receipt
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                                <div className="flex flex-row justify-around items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${(commission.status === 'Pending' || commission.commission_Status === 'Pending')
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {commission.status || commission.commission_Status}
                                                    </span>
                                                    {(commission.status === 'Completed' || commission.commission_Status === 'Completed') && (
                                                        <button
                                                            onClick={() => {
                                                                if (activeTab === 'Artist') {
                                                                    handleCheck(commission.id);
                                                                } else if (activeTab === 'Merchant') {
                                                                    handleMerchantCheck(commission.id);
                                                                }
                                                            }}
                                                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                    {(commission.status === 'Pending' || commission.commission_Status === 'Pending') && (
                                                        <button
                                                            onClick={() => {
                                                                if (activeTab === 'Artist') {
                                                                    handleConfirm(commission.id);
                                                                } else if (activeTab === 'Merchant') {
                                                                    handleMerchantConfirm(commission.id);
                                                                }
                                                            }}
                                                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedImage && (
                                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                <div className="bg-white rounded-lg w-[20rem] h-[35rem] p-4">
                                                    {/* Close Button */}
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={closeModal}
                                                            className="text-gray-500 hover:text-gray-700 text-xl font-bold p-4"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                    {/* Image */}
                                                    <div className="flex justify-center">
                                                        <img
                                                            src={selectedImage || "path/to/fallback-image.jpg"}
                                                            alt="Commission Receipt"
                                                            className="max-w-full max-h-[90vh] object-contain"
                                                            onError={() => console.log("Image failed to load:", selectedImage)} // Debug
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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

export default Commissions;