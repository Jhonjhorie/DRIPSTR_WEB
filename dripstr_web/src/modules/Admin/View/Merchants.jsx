import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase"; // Assuming supabase client is properly initialized
import Sidebar from './Shared/Sidebar';

const Merchants = () => {
    const [merchants, setMerchants] = useState([]);
    const [status, setStatus] = useState('all'); // State to track the selected category
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track error state

    // Fetch merchants data from Supabase where isMerchant is true
    useEffect(() => {
        const fetchMerchants = async () => {
            setLoading(true); // Set loading to true while fetching data
            setError(null); // Reset error state

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('isMerchant', true); // Fetch where isMerchant is true
                
                if (error) {
                    throw error;
                }

                // Update status to 'approved' for all merchants where isMerchant is true
                const updatedMerchants = data.map(merchant => ({
                    ...merchant,
                    status: 'Approved', // Set status to 'approved'
                }));

                setMerchants(updatedMerchants); // Update merchants state with the fetched data
            } catch (err) {
                setError('Error fetching merchants data.');
                console.error(err);
            } finally {
                setLoading(false); // Set loading to false after fetch is complete
            }
        };

        fetchMerchants(); // Call the fetch function
    }, []);

    // Filter merchants based on selected status
    const filteredMerchants = merchants.filter(merchant =>
        status === 'all' ? true : merchant.status === status
    );

    // Handle status update for merchant
    const updateMerchantStatus = (id, newStatus) => {
        setMerchants(prevMerchants =>
            prevMerchants.map(merchant =>
                merchant.id === id ? { ...merchant, status: newStatus } : merchant
            )
        );
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full h-screen flex flex-col items-center">
                <div className="bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-full">
                    <div className='flex justify-between'>
                        <h1 className="text-white text-2xl font-bold mb-4">Merchants</h1>
                        <input type="text" placeholder="Search..." className="px-4 py-2 rounded-lg bg-gray-800 text-white" />
                    </div>
                    <div className='flex mb-4'>
                        <button onClick={() => setStatus('all')} className="px-4 py-2 mx-2 text-white bg-gray-800 rounded-lg">Merchant List</button>
                        <button onClick={() => setStatus('pending')} className="px-4 py-2 mx-2 text-white bg-gray-800 rounded-lg">Pending</button>
                        <button onClick={() => setStatus('approved')} className="px-4 py-2 mx-2 text-white bg-gray-800 rounded-lg">Approved</button>
                        <button onClick={() => setStatus('declined')} className="px-4 py-2 mx-2 text-white bg-gray-800 rounded-lg">Declined</button>
                    </div>
                    <div className='flex text-white text-md mb-4'>
                        <p className='mr-2'>Total Merchants: {filteredMerchants.length}</p>
                    </div>
                    <table className="min-w-full bg-transparent text-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Shop Name</th>
                                <th className="py-2 px-4 border-b">Merchant Username</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                {status === 'pending' && <th className="py-2 px-4 border-b">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMerchants.map(merchant => (
                                <tr key={merchant.id}>
                                    <td className="py-2 px-4 border-b text-center">{merchant.name}</td>
                                    <td className="py-2 px-4 border-b text-center">{merchant.full_name}</td>
                                    <td className="py-2 px-4 border-b text-center">{merchant.email}</td>
                                    <td className="py-2 px-4 border-b text-center">{merchant.status}</td>
                                    {status === 'pending' && (
                                        <td className="py-2 px-4 border-b text-center">
                                            <button
                                                onClick={() => updateMerchantStatus(merchant.id, 'approved')}
                                                className="px-4 py-2 mx-2 text-white bg-green-500 rounded-lg"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateMerchantStatus(merchant.id, 'declined')}
                                                className="px-4 py-2 mx-2 text-white bg-red-500 rounded-lg"
                                            >
                                                Decline
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Merchants;
