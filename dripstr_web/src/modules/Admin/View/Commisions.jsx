import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';

function Commissions() {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Pending');

// Define fetchCommissions outside useEffect
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

// Handle check function
const handleCheck = async (commissionId) => {
    try {
        // Fetch commission details with the correct join between artist and wallet
        const { data: commission, error: fetchError } = await supabase
            .from('art_Commision')
            .select(`
                payment,
                artist_Id (
                    id,
                    wallet
                )
            `)
            .eq('id', commissionId)
            .single();

        if (fetchError) throw fetchError;

        console.log('Commission Data:', commission); // Log the response

        // Verify commission data exists
        if (!commission || !commission.artist_Id || !commission.artist_Id.wallet) {
            throw new Error('Invalid commission or wallet data');
        }

        // Fetch wallet details from the artist_Wallet table using the wallet ID from artist
        const { data: wallet, error: walletFetchError } = await supabase
            .from('artist_Wallet')
            .select('id, revenue')
            .eq('id', commission.artist_Id.wallet)
            .single();

        if (walletFetchError) throw walletFetchError;

        // Verify wallet data
        if (!wallet) {
            throw new Error('Invalid wallet data');
        }

        // Calculate the payment and get the current wallet revenue
        const paymentToArtist = commission.payment * 0.99; // 99% of the commission amount
        const walletId = wallet.id;
        const currentRevenue = wallet.revenue;

        // Perform updates in a transaction-like manner (wallet update and commission status update)
        const [walletUpdate, statusUpdate] = await Promise.all([
            supabase
                .from('artist_Wallet')
                .update({
                    revenue: currentRevenue + paymentToArtist
                })
                .eq('id', walletId),
            supabase
                .from('art_Commision')
                .update({
                    commission_Status: 'Processed'
                })
                .eq('id', commissionId)
        ]);

        if (walletUpdate.error) throw walletUpdate.error;
        if (statusUpdate.error) throw statusUpdate.error;

        console.log(`Commission ${commissionId} processed successfully! ₱${paymentToArtist.toLocaleString('en-US')}.00 added to wallet ${walletId}`);

        // Refresh commissions
        await fetchCommissions();

    } catch (error) {
        console.error('Error processing commission:', error.message);
        setError(error.message);
    }
};



// useEffect hook
useEffect(() => {
    fetchCommissions();
    const interval = setInterval(fetchCommissions, 60000);
    return () => clearInterval(interval);
}, []);

    const filteredCommissions = commissions.filter(
        (commission) => commission.commission_Status === activeTab
    );

    return (
        <div className='flex'>
            <Sidebar />
            <div className="flex-1 p-4 bg-slate-900 rounded-lg">
                <h1 className='text-2xl font-bold mb-4 text-white'>Commissions</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-md text-white ${activeTab === 'Pending' ? 'bg-blue-600' : 'bg-gray-600'}`}
                        onClick={() => setActiveTab('Pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-white ${activeTab === 'Completed' ? 'bg-blue-600' : 'bg-gray-600'}`}
                        onClick={() => setActiveTab('Completed')}
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
                            {filteredCommissions.length === 0 ? (
                                <h1 className="flex justify-center items-center font-bold text-2xl text-white py-4">
                                    No {activeTab} Commissions
                                </h1>
                            ) : (
                                filteredCommissions.map((commission) => (
                                    <div
                                        key={commission.id}
                                        className="border rounded-md shadow-sm p-3 w-full bg-white flex items-center gap-3 hover:shadow-md transition-shadow"
                                    >
                                        <img
                                            src={commission.image}
                                            alt={commission.image}
                                            className="w-[5.5rem] h-[5.5rem] rounded-sm object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 text-sm">
                                            <div className="flex justify-between items-baseline">
                                                <h2 className="font-semibold text-black truncate">
                                                    {commission.title}
                                                </h2>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(commission.created_at).toLocaleDateString()} - {new Date(commission.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-black truncate">
                                                Artist: {commission.artist_Id?.artist_Name}
                                            </p>
                                            <p className="text-black truncate">
                                                To: {commission.client_Id?.full_name}
                                            </p>
                                            <p className="text-black truncate">
                                                Commission Amount: ₱{Number(commission.payment).toLocaleString('en-US')}.00
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-black truncate max-w-[70%]">
                                                    Instruction: {commission.description}
                                                </p>
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${commission.commission_Status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {commission.commission_Status}
                                                    </span>
                                                    {commission.commission_Status === 'Completed' && (
                                                        <button
                                                            onClick={() => handleCheck(commission.id)}
                                                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                                        >
                                                            Process
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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