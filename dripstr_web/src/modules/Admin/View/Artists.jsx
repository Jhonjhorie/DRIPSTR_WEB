import React, { useState, useEffect } from 'react';
import Sidebar from './Shared/Sidebar';
import { supabase } from '../../../constants/supabase';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Artists() {
    const [status, setStatus] = useState('artists');
    const [register, setRegister] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});

    // Fetch pending artist registrations (Auto-refresh every 5 seconds)
    useEffect(() => {
        const fetchArtistRegistration = async () => {
            setLoading(true); // Reset loading each fetch
            try {
                const { data, error } = await supabase
                    .from('artist_registration')
                    .select('id, created_at, acc_id, full_name, address, mobile_number, artist_name, description, art_type, valid_id, selfie, is_approved, artist_profilePic')
                    .is('is_approved', null);

                if (error) throw error;

                console.log('Fetched Data:', data); // Debug: Log raw data
                setRegister(data || []); // Fallback to empty array if data is null
            } catch (error) {
                console.error('Fetch Error:', error.message); // Debug: Log errors
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistRegistration();
        const interval = setInterval(fetchArtistRegistration, 60000); // Auto-refresh every 5 seconds

        return () => clearInterval(interval); // Cleanup
    }, []);

    // Toggle card expansion
    const toggleCard = (id) => {
        setExpandedCards((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    // Handle Accept/Decline actions (placeholder functions)
    const handleAccept = async (id) => {
        console.log('Accepting artist with ID:', id); // Debug: Log action
        try {
            const { error } = await supabase
                .from('artist_registration')
                .update({ is_approved: true })
                .eq('id', id);
            if (error) throw error;
            // Refresh data after update
            setRegister((prev) => prev.filter((artist) => artist.id !== id));
        } catch (error) {
            console.error('Accept Error:', error.message);
            setError(error.message);
        }
    };

    const handleDecline = async (id) => {
        console.log('Declining artist with ID:', id); // Debug: Log action
        try {
            const { error } = await supabase
                .from('artist_registration')
                .update({ is_approved: false })
                .eq('id', id);
            if (error) throw error;
            // Refresh data after update
            setRegister((prev) => prev.filter((artist) => artist.id !== id));
        } catch (error) {
            console.error('Decline Error:', error.message);
            setError(error.message);
        }
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
                                            <h2 className="text-xl font-semibold mb-1">{artist.artist_name || 'Unnamed Artist'}</h2>
                                            <h2 className="text-xl font-semibold mb-2">{artist.full_name || 'No Name'}</h2>
                                            <h2 className="text-xl font-semibold mb-2">
                                                Registered at: {new Date(artist.created_at).toLocaleString()}
                                            </h2>
                                            <p className="text-gray-700 mb-1">{artist.description || 'No description'}</p>
                                            <p className="text-gray-500 mb-1">{artist.address || 'No address'}</p>
                                            <p className="text-gray-500 mb-4">Contact: {artist.mobile_number || 'N/A'}</p>

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

                                            <button onClick={() => toggleCard(artist.id)} className="absolute top-4 right-4">
                                                <FontAwesomeIcon
                                                    icon={faChevronCircleDown}
                                                    className={`transform transition-transform duration-300 ${expandedCards[artist.id] ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>

                                            <div
                                                className={`transition-all duration-500 ease-in-out ${expandedCards[artist.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                                    } overflow-hidden mt-4`}
                                            >
                                                {artist.shop_BusinessPermit ? (
                                                    <object
                                                        data={artist.shop_BusinessPermit}
                                                        type="application/pdf"
                                                        width="100%"
                                                        height="400px"
                                                    >
                                                        <p>
                                                            Your browser does not support PDFs.
                                                            <a
                                                                href={artist.shop_BusinessPermit}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500"
                                                            >
                                                                Download PDF
                                                            </a>
                                                        </p>
                                                    </object>
                                                ) : (
                                                    <p>No Business Permit Uploaded.</p>
                                                )}
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