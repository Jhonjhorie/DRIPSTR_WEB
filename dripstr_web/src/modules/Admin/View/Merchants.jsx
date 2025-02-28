import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from './Components/Pagination';

const Merchants = () => {
    const [register, setRegister] = useState([]);
    const [acceptedMerchants, setAcceptedMerchants] = useState([]);
    const [status, setStatus] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [merchants, setMerchants] = useState([]);
    const [successAdd, setSuccessAdd] = useState('');
    const [successDecline, setSuccessDecline] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const [idModal, setIdModal] = useState(false);
    const [enlargedImage, setEnlargedImage] = useState(null);

    // Fetch accepted merchants (Auto-refresh every 5 seconds)
    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const { data, error } = await supabase
                    .from('shop')
                    .select('shop_name, description, address, shop_image, contact_number, shop_BusinessPermit, is_Approved, owner_Id(full_name), valid_id, selfie, gcash')
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
        const interval = setInterval(fetchMerchants, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch pending merchant registrations (Auto-refresh every 5 seconds)
    useEffect(() => {
        const fetchMerchantRegistration = async () => {
            try {
                const { data, error } = await supabase
                    .from('merchantRegistration')
                    .select('id, shop_name, description, address, shop_image, contact_number, shop_BusinessPermit, is_Approved, full_Name, validID, selfie, gcash')
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
        const interval = setInterval(fetchMerchantRegistration, 5000);
        return () => clearInterval(interval);
    }, []);

    // Accept Merchant Function
    const handleAccept = async (id) => {
        try {
            const { data: merchantData, error: fetchError } = await supabase
                .from('merchantRegistration')
                .select('id, shop_name, contact_number, description, address, shop_image, is_Approved, shop_BusinessPermit, validID, selfie, gcash')
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
                    shop_name: merchantData.shop_name,
                    contact_number: merchantData.contact_number,
                    description: merchantData.description,
                    address: merchantData.address,
                    owner_Id: merchantData.id,
                    shop_image: merchantData.shop_image,
                    shop_Vouchers: null,
                    shop_BusinessPermit: merchantData.shop_BusinessPermit,
                    shop_Rating: null,
                    is_Approved: true,
                    shop_Ads: null,
                    is_Premium: null,
                    valid_id: merchantData.validID,
                    selfie: merchantData.selfie,
                    gcash: merchantData.gcash
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

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // Filter merchants based on the search term with null checks
    const filteredMerchants = merchants.filter(merchant => {
        const searchLower = search.toLowerCase();
        return (
            (merchant.shop_name?.toLowerCase() || '').includes(searchLower) ||
            (merchant.owner_Id?.full_name?.toLowerCase() || '').includes(searchLower) ||
            (merchant.description?.toLowerCase() || '').includes(searchLower) ||
            (merchant.address?.toLowerCase() || '').includes(searchLower) ||
            (String(merchant.contact_number) || '').toLowerCase().includes(searchLower)
        );
    });

    // Calculate pagination
    const merchantsPerPage = 3;
    const indexOfLastMerchant = currentPage * merchantsPerPage;
    const indexOfFirstMerchant = indexOfLastMerchant - merchantsPerPage;
    const merchantsToDisplay = filteredMerchants.slice(indexOfFirstMerchant, indexOfLastMerchant);

    // Page Change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleId = (merchant) => {
        setSelectedMerchant(merchant);
        setIdModal(true);
    };

    const closeModal = () => {
        setIdModal(false);
        setSelectedMerchant(null);
    };

    const handleImageClick = (imageSrc) => {
        setEnlargedImage(imageSrc);
    };

    const closeEnlargedImage = () => {
        setEnlargedImage(null);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4 bg-slate-900 rounded-lg">
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
                    <input type="text"
                        placeholder="Search"
                        value={search}
                        onChange={handleSearch}
                        className="px-4 py-2 border rounded bg-white text-black"
                    />
                </div>

                {status === 'pending' && (
                    <div>
                        {loading ? (
                            <p className="text-white">Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <div className="flex flex-row flex-wrap items-start gap-4 w-auto">
                                {register.length === 0 ? (
                                    <h1 className="flex justify-center items-center font-bold text-3xl text-white">
                                        No Pending Merchant
                                    </h1>
                                ) : (
                                    register.map((merchant) => (
                                        <div
                                            key={merchant.id}
                                            className="border rounded-lg shadow-lg p-4 relative w-full md:w-1/2 lg:w-1/3 bg-white"
                                        >
                                            <img
                                                src={merchant.shop_image || 'https://via.placeholder.com/150'}
                                                alt={merchant.merchant_name}
                                                className="w-full h-40 rounded-md mb-1"
                                            />
                                            <h2 className="text-xl font-semibold text-black">{merchant.shop_name || 'Unnamed Artist'}</h2>
                                            <h2 className="text-md font-semibold text-black">{merchant.full_Name || merchant.id?.full_name || 'No Name'}</h2>
                                            <p className="text-gray-700">{merchant.description || 'No description'}</p>
                                            <p className="text-gray-500">{merchant.address || 'No address'}</p>
                                            <p className="text-gray-500">{merchant.contact_number || 'N/A'}</p>
                                            <p
                                                className="text-black underline cursor-pointer hover:text-blue-500 mb-4"
                                                onClick={() => handleId(merchant)}
                                            >
                                                Identifications
                                            </p>
                                            <div className="flex justify-center items-center space-x-2">
                                                <button
                                                    onClick={() => handleAccept(merchant.id)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleDecline(merchant.id)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

                {idModal && selectedMerchant && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                            <h2 className="text-xl font-semibold mb-4 text-black">
                                {selectedMerchant.shop_name || 'Unnamed Artist'}'s Identification
                            </h2>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="flex flex-col items-center">
                                    <p className="text-black font-medium mb-2">Business Permit</p>
                                    <img
                                        src={selectedMerchant.shop_BusinessPermit || 'https://via.placeholder.com/150'}
                                        alt={`${selectedMerchant.shop_name || 'Artist'} selfie`}
                                        className="w-24 h-24 object-contain rounded-md"
                                        onClick={() => handleImageClick(selectedMerchant.shop_BusinessPermit)}
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-black font-medium mb-2">Selfie</p>
                                    <img
                                        src={selectedMerchant.selfie || 'https://via.placeholder.com/150'}
                                        alt={`${selectedMerchant.shop_name || 'Artist'} selfie`}
                                        className="w-24 h-24 object-contain rounded-md"
                                        onClick={() => handleImageClick(selectedMerchant.selfie)}
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-black font-medium mb-2">Valid ID</p>
                                    <img
                                        src={selectedMerchant.validID || selectedMerchant.valid_id || 'https://via.placeholder.com/150'}
                                        alt={`${selectedMerchant.artist_name || 'Artist'} ID`}
                                        className="w-24 h-24 object-contain rounded-md"
                                        onClick={() => handleImageClick(selectedMerchant.validID || selectedMerchant.valid_id)}
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-black font-medium mb-2">GCash</p>
                                    <img
                                        src={selectedMerchant.gcash || 'https://via.placeholder.com/150'}
                                        alt={`${selectedMerchant.artist_name || 'Artist'} GCash`}
                                        className="w-24 h-24 object-contain rounded-md"
                                        onClick={() => handleImageClick(selectedMerchant.gcash)}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {enlargedImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
                        onClick={closeEnlargedImage}
                    >
                        <img
                            src={enlargedImage}
                            alt="Enlarged view"
                            className="max-w-[90%] max-h-[90%] object-contain"
                        />
                        <button
                            onClick={closeEnlargedImage}
                            className="absolute top-4 right-4 text-white text-2xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center"
                        >
                            X
                        </button>
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
                        <div className='flex justify-between'>
                            <h2 className="text-xl font-semibold mb-2 text-white">Accepted Merchants: ({merchants.length})</h2>
                        </div>
                        <ul>
                            {merchantsToDisplay.map((merchant) => (
                                <li key={merchant.id} className="border p-4 rounded-lg shadow-md flex mb-4 bg-gray-800">
                                    <div className="flex gap-4 w-full">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={merchant.shop_image || 'No Image'}
                                                alt={merchant.shop_name || 'No Image'}
                                                className="w-24 h-24 object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <p className="text-white text-sm hover:text-blue-900 hover:underline" onClick={() => handleId(merchant)}><strong>Shop Name:</strong> {merchant.shop_name}</p>
                                            <p className="text-white text-sm"><strong>Name:</strong> {merchant.owner_Id?.full_name || 'No Name'}</p>
                                            <p className="text-white text-sm"><strong>Description:</strong> {merchant.description}</p>
                                            <p className="text-white text-sm"><strong>Address:</strong> {merchant.address}</p>
                                            <p className="text-white text-sm"><strong>Contact:</strong> +63{merchant.contact_number}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredMerchants.length}
                            itemsPerPage={merchantsPerPage}
                            onPageChange={handlePageChange}
                            className='fixed'
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Merchants;