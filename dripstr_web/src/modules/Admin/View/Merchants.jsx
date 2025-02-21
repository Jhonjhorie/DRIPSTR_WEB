import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Merchants = () => {
    const [register, setRegister] = useState([]);
    const [acceptedMerchants, setAcceptedMerchants] = useState([]);
    const [status, setStatus] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});
    const [merchants, setMerchants] = useState([]);
    const [successAdd, setSuccessAdd] = useState('');
    const [successDecline, setSuccessDecline] = useState('');

    // Fetch accepted merchants (Auto-refresh every 5 seconds)
    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const { data, error } = await supabase
                    .from('shop')
                    .select('shop_name, description, address, shop_image, contact_number, shop_BusinessPermit, is_Approved')
                    .is('is_Approved', true);

                if (error) throw error;
                setMerchants(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMerchants();
        const interval = setInterval(fetchMerchants, 5000); // Auto-refresh every 5 seconds

        return () => clearInterval(interval); // Cleanup to prevent memory leaks
    }, []);

    // Fetch pending merchant registrations (Auto-refresh every 5 seconds)
    useEffect(() => {
        const fetchMerchantRegistration = async () => {
            try {
                const { data, error } = await supabase
                    .from('merchantRegistration')
                    .select('id, shop_name, description, address, shop_image, contact_number, shop_BusinessPermit, is_Approved, profiles(full_name)')
                    .is('is_Approved', null);

                if (error) throw error;
                setRegister(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMerchantRegistration();
        const interval = setInterval(fetchMerchantRegistration, 5000); // Auto-refresh every 5 seconds

        return () => clearInterval(interval); // Cleanup
    }, []);

    // Open business permit
    const toggleCard = (id) => {
        setExpandedCards((prevState) => ({
            ...prevState,
            [id]: !prevState[id],  // Toggles only the clicked card
        }));
    };



    // Accept Merchant Function
    const handleAccept = async (id) => {
        try {
            const { data: merchantData, error: fetchError } = await supabase
                .from('merchantRegistration')
                .select('id, shop_name, description, address, shop_image, contact_number, shop_BusinessPermit, is_Approved')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            await supabase
                .from('merchantRegistration')
                .update({ is_Approved: true })
                .eq('id', id);

            await supabase
                .from('shop')
                .insert([{
                    owner_Id: merchantData.id,
                    shop_name: merchantData.shop_name,
                    description: merchantData.description,
                    address: merchantData.address,
                    shop_image: merchantData.shop_image,
                    contact_number: merchantData.contact_number,
                    shop_BusinessPermit: merchantData.shop_BusinessPermit,
                    is_Approved: true
                }]);

            await supabase
                .from('profiles')
                .update({ isMerchant: true })
                .eq('id', id);

            setRegister(prev => prev.filter(merchant => merchant.id !== id));
            setAcceptedMerchants(prev => [...prev, merchantData]);
            setSuccessAdd('Merchant added successfully.');
            setTimeout(() => setSuccessAdd(''), 1500);

        } catch (error) {
            setError(error.message);
        }
    };

    const handleDecline = async (id) => {
        try {
            await supabase
                .from('merchantRegistration')
                .update({ is_Approved: false })
                .eq('id', id);

            setRegister(prev => prev.filter(merchant => merchant.id !== id));
            setSuccessDecline('Merchant declined successfully.');
            setTimeout(() => setSuccessDecline(''), 1500);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4  bg-slate-900 rounded-lg">
                <h1 className="text-2xl font-bold mb-4 text-white">Merchants</h1>
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => setStatus('merchants')}
                        className={`px-4 py-2 rounded ${status === 'merchants' ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                    >
                        Merchants
                    </button>
                    <button
                        onClick={() => setStatus('pending')}
                        className={`px-4 py-2 rounded ${status === 'pending' ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                    >
                        Pending
                    </button>
                    <input type="text" placeholder="Search" className="px-4 py-2 border rounded" />
                </div>

                {status === 'pending' && (
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (

                            <div className="flex flex-row flex-wrap items-start gap-4 w-auto">
                                {register.map((merchant) => (
                                    <div key={merchant.id} className="border rounded-lg shadow-lg p-4 relative w-full md:w-1/2 lg:w-1/3">
                                        <img src={merchant.shop_image} alt={merchant.shop_name} className="w-full h-40 object-cover rounded-md" />
                                        <h2 className="text-xl font-semibold mb-2">{merchant.shop_name}</h2>
                                        <h2 className="text-xl font-semibold mb-2">{merchant.profiles?.full_name || 'No Name'}</h2>
                                        <p className="text-gray-700 mb-1">{merchant.description}</p>
                                        <p className="text-gray-500 mb-1">{merchant.address}</p>
                                        <p className="text-gray-500 mb-4">Contact: {merchant.contact_number}</p>

                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => handleAccept(merchant.id)} className="px-4 py-2 bg-green-500 text-white rounded">Accept</button>
                                            <button onClick={() => handleDecline(merchant.id)} className="px-4 py-2 bg-red-500 text-white rounded">Decline</button>
                                        </div>

                                        <button onClick={() => toggleCard(merchant.id)} className="absolute top-4 right-4">
                                            <FontAwesomeIcon
                                                icon={faChevronCircleDown}
                                                className={`transform transition-transform duration-300 ${expandedCards[merchant.id] ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        <div className={`transition-all duration-500 ease-in-out ${expandedCards[merchant.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden mt-4`}>
                                            {merchant.shop_BusinessPermit ? (
                                                <object data={merchant.shop_BusinessPermit} type="application/pdf" width="100%" height="400px">
                                                    <p>Your browser does not support PDFs.
                                                        <a href={merchant.shop_BusinessPermit} target="_blank" rel="noopener noreferrer" className="text-blue-500">Download PDF</a>
                                                    </p>
                                                </object>
                                            ) : (
                                                <p>No Business Permit Uploaded.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {successAdd && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg z-50">
                        {successAdd}
                    </div>
                )}
                {successDecline && (
                    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg z-50">
                        {successDecline}
                    </div>
                )}


                {status === 'merchants' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-white">Accepted Merchants</h2>
                        <ul>
                            {merchants.map((merchant, index) => (
                                <li key={merchant.id} className="border p-4 rounded-lg shadow-md flex mb-4 bg-gray-800">
                                    <div className="flex gap-4 w-full">
                                        {/* Image with improved sizing */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={merchant.shop_image}
                                                alt={merchant.shop_name}
                                                className="w-24 h-24 object-cover rounded-md"
                                            />
                                        </div>

                                        {/* Merchant Info */}
                                        <div className="flex flex-col w-full">
                                            <p className="text-white text-sm"><strong>Shop Name:</strong> {merchant.shop_name}</p>
                                            <p className="text-white text-sm"><strong>Description:</strong> {merchant.description}</p>
                                            <p className="text-white text-sm"><strong>Address:</strong> {merchant.address}</p>
                                            <p className="text-white text-sm"><strong>Contact:</strong> {merchant.contact_number}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}

                        </ul>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Merchants;
