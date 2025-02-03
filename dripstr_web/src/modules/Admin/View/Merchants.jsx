import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase"; // Assuming supabase client is properly initialized
import Sidebar from './Shared/Sidebar';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Merchants = () => {
    const [merchants, setMerchants] = useState([]);
    const [shops, setShops] = useState([]);
    const [status, setStatus] = useState('pending'); // Default to 'pending' tab
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track error state
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const fetchMerchants = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, full_name, email, mobile')
                    .eq('isApplying', true);
                if (error) throw error;
                setMerchants(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchShops = async () => {
            try {
                const { data, error } = await supabase
                    .from('shop')
                    .select('shop_name, description, address, shop_image, shop_BusinessPermit')
                    .eq('is_Approved', true);
                if (error) throw error;
                setShops(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchMerchants();
        fetchShops();
    }, []);

    const toggleCard = (index) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    const handleAccept = async (id) => {
        try {
            await supabase
                .from('merchant')
                .update({ is_Approved: true })
                .eq('id', id);
            setMerchants();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDecline = async (id) => {
        try {
            await supabase
                .from('merchant')
                .update({ is_Approved: false })
                .eq('id', id);
            setMerchants();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <h1 className="text-2xl font-bold mb-4">Merchants</h1>
                <div className="flex space-x-4 mb-4">
                    <button onClick={() => setStatus('merchants')} className="px-4 py-2 bg-blue-500 text-white rounded">Merchants</button>
                    <button onClick={() => setStatus('pending')} className="px-4 py-2 bg-gray-500 text-white rounded">Pending</button>
                    <input type="text" placeholder="Search" className="px-4 py-2 border rounded" />
                </div>

                {status === 'pending' && (
                    <div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <ul>
                                {merchants.map((merchant, index) => (
                                    <li key={index} className="border p-4 mb-2 rounded shadow-sm">
                                        <p><strong>Username:</strong> {merchant.username}</p>
                                        <p><strong>Full Name:</strong> {merchant.full_name}</p>
                                        <p><strong>Email:</strong> {merchant.email}</p>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleAccept(merchant.id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleDecline(merchant.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {status === 'merchants' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {shops.map((shop, index) => (
                            <div key={index} className="border rounded-lg shadow-lg p-4 relative">
                                <img src={shop.shop_image} alt={shop.shop_name} className="w-full h-40 object-cover rounded-md mb-4" />
                                <h2 className="text-xl font-semibold mb-2 text-white">{shop.shop_name}</h2>
                                <p className="text-gray-700 mb-1">{shop.description}</p>
                                <p className="text-gray-500 mb-4">{shop.address}</p>

                                <button onClick={() => toggleCard(index)} className="absolute top-4 right-4">
                                    <FontAwesomeIcon icon={faChevronCircleDown} className={`transform transition-transform ${expandedCard === index ? 'rotate-180' : ''}`} />
                                </button>

                                {expandedCard === index && (
    <div className="mt-4 transition-all duration-300 ease-in-out">
        {shop.shop_BusinessPermit && (
            <object
                data={shop.shop_BusinessPermit}  // Use URL or base64 here
                type="application/pdf"
                width="100%"
                height="600px"
            >
                <p>Your browser does not support PDF viewing. You can <a href={shop.shop_BusinessPermit}>download the PDF</a> instead.</p>
            </object>
        )}
    </div>
)}




                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Merchants;
