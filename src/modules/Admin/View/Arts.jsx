import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';
import Pagination from './Components/Pagination';

function Arts() {
    // State management
    const [arts, setArts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [declineModal, setDeclineModal] = useState(false); // To control modal visibility
    const [declineReason, setDeclineReason] = useState("");    // To store decline reason
    const [otherReason, setOtherReason] = useState("");        // For other reason text
    const [selectedArtId, setSelectedArtId] = useState(null);   // To store selected artId for decline
    
    const itemsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);

    const fetchArts = async () => {
        try {
            const { data, error } = await supabase
                .from('artist_Arts')
                .select('*, artist_Id(artist_Name)')
                .eq('status', 'Pending');

            if (error) throw error;
            setArts(data || []);
        } catch (error) {
            console.error('Error fetching data:', error.message);
            setError(error.message);
            setArts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArts();
    }, []);

    const approveArt = async (artId) => {
        try {
            const { error } = await supabase
                .from('artist_Arts')
                .update({ status: 'Approved' })
                .eq('id', artId);

            if (error) throw error;
            setArts((prevArts) => prevArts.filter((art) => art.id !== artId));
        } catch (error) {
            console.error('Error approving art:', error.message);
            setError(error.message);
        }
    };

    const declineArt = async (artId, reason) => {
        try {
            const { error } = await supabase
                .from('artist_Arts')
                .update({ status: 'Declined', decline_reason: reason })
                .eq('id', artId);
    
            if (error) throw error;
    
            setArts((prevArts) => prevArts.filter((art) => art.id !== artId));
            closeDeclineModal();
        } catch (error) {
            console.error('Error declining art:', error.message);
            setError(error.message);
        }
    };
    
    const handleDecline = (artId) => {
        setSelectedArtId(artId);
        setDeclineModal(true); // Show the decline modal
    };
    
    const closeDeclineModal = () => {
        setDeclineModal(false); // Close the modal
        setDeclineReason("");   // Reset the reason
        setOtherReason("");     // Reset other reason
        setSelectedArtId(null); // Clear the selected artId
    };
    
    const confirmDecline = () => {
        const reasonToUse = declineReason === "Others" && otherReason ? otherReason : declineReason;
        declineArt(selectedArtId, reasonToUse);  // Pass the correct reason
    };
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentArts = arts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(arts.length / itemsPerPage);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4 bg-slate-900 rounded-lg">
                <h1 className="text-2xl font-bold mb-4 text-white">Arts</h1>

                {loading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-900">
                        {currentArts.length === 0 ? (
                            <p className="text-gray-400 text-center col-span-full py-10">No pending arts found</p>
                        ) : (
                            currentArts.map((art) => (
                                <div key={art.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                    <div className="w-full">
                                        <img src={art.art_Image} alt={art.art_Name} className="w-full h-[15rem] object-contain bg-gray-100" />
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-semibold text-gray-800 truncate">{art.art_Name}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{art.art_Description}</p>
                                            <div className="text-sm space-y-1">
                                                <p className="text-gray-700"><span className="font-medium">Artist:</span> {art.artist_Id?.artist_Name || "Unknown"}</p>
                                                <p className="text-gray-700"><span className="font-medium">Created:</span> {new Date(art.created_at).toLocaleDateString()}</p>
                                                <p className="text-gray-700"><span className="font-medium">Status:</span> <span className={`${art.status === "Approved" ? "text-green-600" : "text-yellow-600"} font-medium`}>{art.status}</span></p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-3">
                                            <button onClick={() => approveArt(art.id)} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium">Approve</button>
                                            <button onClick={() => handleDecline(art.id)} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-sm font-medium">Decline</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {!loading && !error && arts.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={arts.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}

                {/* Decline Modal */}
                {declineModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4 text-black">Reason for Declining Merchant</h2>
                            <div className="space-y-4 mb-6">
                                {['Invalid ID', 'Credentials not Match', 'ID Expired', 'Blurry Photos'].map((reason) => (
                                    <div key={reason} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={reason}
                                            name="declineReason"
                                            value={reason}
                                            checked={declineReason === reason}
                                            onChange={(e) => {
                                                setDeclineReason(e.target.value);
                                                setOtherReason(''); // Clear text box when radio is selected
                                            }}
                                            className="mr-2"
                                        />
                                        <label htmlFor={reason} className="text-black">{reason}</label>
                                    </div>
                                ))}
                                <div className="flex flex-col">
                                    <h1 className='text-black'>Others:</h1>
                                    <input
                                        type="text"
                                        placeholder="Please specify other reason"
                                        value={otherReason}
                                        onChange={(e) => {
                                            setOtherReason(e.target.value);
                                            setDeclineReason('Others'); // Set to 'Others' when typing
                                        }}
                                        className="mt-2 px-2 py-1 border rounded w-full text-black bg-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button onClick={closeDeclineModal} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                                <button
                                    onClick={confirmDecline}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Confirm Decline
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Arts;
