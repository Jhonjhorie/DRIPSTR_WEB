import React, { useState, useEffect } from 'react';
import Sidebar from './Shared/Sidebar';
import { supabase } from '../../../constants/supabase';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Artists() {
    const [status, setStatus] = useState('pending');
    const [register, setRegister] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [idModal, setIdModal] = useState(false);
    const [artists, setArtists] = useState([]);
    const [acceptedArtists, setAcceptedArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null); // New state for selected artist

    // Fetch pending artist registrations (Auto-refresh every 5 seconds)
    useEffect(() => {
        const fetchArtistRegistration = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('artist_registration')
                    .select('id, created_at, acc_id, full_name, address, mobile_number, artist_name, description, art_type, valid_id, selfie, is_approved, artist_profilePic')
                    .is('is_approved', null);

                if (error) throw error;
                console.log('Fetched Data:', data);
                setRegister(data || []);
            } catch (error) {
                console.error('Fetch Error:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistRegistration();
        const interval = setInterval(fetchArtistRegistration, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchArtists = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('artist')
                    .select('id, created_at, artist_Name, artist_Bio, art_Type, artist_Image, contact_number, owner_Id(full_name), followers_Detail, full_Name, is_Premium, selfie, valid_ID')

                if (error) throw error;
                console.log('Fetched Data:', data);
                setArtists(data || []);
            } catch (error) {
                console.error('Fetch Error:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
        const interval = setInterval(fetchArtists, 60000);

        return () => clearInterval(interval);
    }, []);

    
    const handleAccept = async (id) => {
        try {
            const { data: artistData, error: fetchError } = await supabase
                .from('artist_registration')
                .select('id, created_at, acc_id, full_name, address, mobile_number, artist_name, description, art_type, valid_id, selfie, is_approved, artist_profilePic, valid_id')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            await supabase
                .from('artist_registration')
                .update({ is_approved: true })
                .eq('id', id);

            await supabase
                .from('artist')
                .insert([{
                    id: artistData.id,
                    created_at: artistData.created_at,
                    owner_Id: artistData.acc_id,
                    artist_Name: artistData.artist_name,
                    artist_Bio: artistData.description,
                    art_Type: artistData.art_type,
                    artist_Image: artistData.artist_profilePic,
                    contact_number: artistData.mobile_number,
                    full_Name: artistData.full_name,
                    selfie: artistData.selfie,
                    valid_ID: artistData.valid_id,
                    followers_Detail: null,
                    is_Premium: null,
                }]);

            await supabase
                .from('profiles')
                .update({ isArtist: true })
                .eq('id', id);

            setRegister(prev => prev.filter(artist => artist.id !== id));
            setAcceptedArtists(prev => [...prev, artistData]);

        } catch (error) {
            setError(error.message);
        }
    };

    const handleDecline = async (id) => {
        console.log('Declining artist with ID:', id);
        try {
            const { error } = await supabase
                .from('artist_registration')
                .update({ is_approved: false })
                .eq('id', id);
            if (error) throw error;
            setRegister((prev) => prev.filter((artist) => artist.id !== id));
        } catch (error) {
            console.error('Decline Error:', error.message);
            setError(error.message);
        }
    };

    const handleId = (artist) => {
        setSelectedArtist(artist); // Store the selected artist
        setIdModal(true); // Show the modal
    };

    const closeModal = () => {
        setIdModal(false);
        setSelectedArtist(null); // Clear the selected artist
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4 bg-slate-900 rounded-lg">
                <h1 className="text-2xl font-bold mb-4 text-white">Artists</h1>
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => setStatus('artists')}
                        className={`px-4 py-2 rounded ${status === 'artists' ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                    >
                        Artists
                    </button>
                    <button
                        onClick={() => setStatus('pending')}
                        className={`px-4 py-2 rounded ${status === 'pending' ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                    >
                        Pending
                    </button>
                    <input
                        type="text"
                        placeholder="Search"
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
                                        No Pending Artists
                                    </h1>
                                ) : (
                                    register.map((artist) => (
                                        <div
                                            key={artist.id}
                                            className="border rounded-lg shadow-lg p-4 relative w-full md:w-1/2 lg:w-1/3 bg-white"
                                        >
                                            <img
                                                src={artist.artist_profilePic || 'https://via.placeholder.com/150'}
                                                alt={artist.artist_name}
                                                className="w-full h-40 rounded-md mb-1"
                                            />
                                            <h2 className="text-xl font-semibold text-black">{artist.artist_name || 'Unnamed Artist'}</h2>
                                            <h2 className="text-md font-semibold text-black">{artist.full_name || 'No Name'}</h2>
                                            <p className="text-black text-sm mb-2">
                                                {new Date(artist.created_at).toLocaleString()}
                                            </p>
                                            <p className="text-gray-700">{artist.description || 'No description'}</p>
                                            <p className="text-gray-500">{artist.address || 'No address'}</p>
                                            <p className="text-gray-500">{artist.mobile_number || 'N/A'}</p>
                                            <p
                                                className="text-black underline cursor-pointer hover:text-blue-500 mb-4"
                                                onClick={() => handleId(artist)} // Pass the full artist object
                                            >
                                                Identifications
                                            </p>

                                            <div className="flex justify-center items-center space-x-2">
                                                <button
                                                    onClick={() => handleAccept(artist.id)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleDecline(artist.id)}
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

                {/* Modal for ID and Selfie */}
                {idModal && selectedArtist && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-xl font-semibold mb-4 text-black">
                                {selectedArtist.artist_name}'s Identification
                            </h2>
                            <div className="flex flex-col gap-4">
                                <p className='text-black font-medium'>Selfie</p>
                                <img
                                    src={selectedArtist.selfie || 'https://via.placeholder.com/150'}
                                    alt={`${selectedArtist.artist_name} selfie`}
                                    className="w-full h-40 object-contain rounded-md"
                                />
                                <p className='text-black font-medium'>Valid Id</p>
                                <img
                                    src={selectedArtist.valid_id || 'https://via.placeholder.com/150'}
                                    alt={`${selectedArtist.artist_name} ID`}
                                    className="w-full h-40 object-contain rounded-md"
                                />
                            </div>
                            <button
                                onClick={closeModal}
                                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {status === 'artists' && (
                    <div>
                        {loading ? (
                            <p className="text-white text-center">Loading...</p>
                        ) : error ? (
                            <p className="text-red-500 text-center">{error}</p>
                        ) : (
                            <div className="space-y-6">
                                {artists.length === 0 ? (
                                    <h1 className="text-center font-bold text-3xl text-white">
                                        No Artists
                                    </h1>
                                ) : (
                                    artists.map((artist) => (
                                        <div
                                            key={artist.id}
                                            className="flex flex-row border rounded-lg shadow-lg p-4 bg-gray-800 w-full items-start gap-4"
                                        >
                                            {/* Picture on the left */}
                                            <img
                                                src={artist.artist_Image || 'https://via.placeholder.com/150'}
                                                alt={artist.artist_Name}
                                                className="w-24 h-24 object-cover rounded-md"
                                            />
                                            {/* Info column on the right */}
                                            <div className="flex flex-col">
                                                <h2 className="text-xl font-semibold text-white flex flex-row">
                                                    {artist.artist_Name} {artist.is_Premium && (<div className='bg-yellow-500 p-0 rounded-sm'><p className='text-white'>premiym</p></div>)}
                                                </h2>
                                                <h3 className="text-md font-medium text-white">
                                                    {artist.full_Name || artist.owner_Id?.full_name || 'Unnamed Artist'}
                                                </h3>
                                                <p className="text-white text-sm">
                                                    {new Date(artist.created_at).toLocaleString()}
                                                </p>
                                                <p className="text-white">
                                                    Art Type: {artist.art_Type || 'N/A'}
                                                </p>
                                                <p className="text-white">
                                                    Contact: {artist.contact_number || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Artists;