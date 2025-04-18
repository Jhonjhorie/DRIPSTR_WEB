import React, { useState, useEffect } from 'react';
import Sidebar from './Shared/Sidebar';
import { supabase } from '../../../constants/supabase';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from './Components/Pagination';

function Artists() {
  const [status, setStatus] = useState('artists');
  const [register, setRegister] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idModal, setIdModal] = useState(false);
  const [artists, setArtists] = useState([]);
  const [acceptedArtists, setAcceptedArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [declineModal, setDeclineModal] = useState(false);  // For the decline modal
  const [declineReason, setDeclineReason] = useState('');  // Selected decline reason
  const [otherReason, setOtherReason] = useState('');  // Text input for "Others" reason
  const [searchQuery, setSearchQuery] = useState(''); // New state for search
  const itemsPerPage = 3; // Adjust as needed


  useEffect(() => {
    const fetchArtistRegistration = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('artist_registration')
          .select('id, created_at, acc_id, sample_art2, full_name, address, mobile_number, artist_name, description, art_type, valid_id, selfie, is_approved, artist_profilePic, gcash, decline_reason, sample_art')
          .is('is_approved', null);
        if (error) throw error;
        setRegister(data || []);
      } catch (error) {
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
          .select('id, created_at, artist_Name, artist_Bio, art_Type, artist_Image, contact_number, owner_Id(full_name), followers_Detail, full_Name, is_Premium, selfie, valid_ID, gcash, wallet, sample_art1, sample_art2');
        if (error) throw error;
        setArtists(data || []);
      } catch (error) {
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
      console.log("Fetching artist registration data...");
      const { data: artistData, error: fetchError } = await supabase
        .from('artist_registration')
        .select('id, created_at, acc_id, full_name, address, mobile_number, artist_name, description, art_type, valid_id, selfie, is_approved, artist_profilePic, gcash, sample_art, sample_art2')
        .eq('id', id)
        .single();
      if (fetchError) throw fetchError;

      console.log("Fetched artist data:", artistData);

      console.log("Updating artist registration...");
      const { error: updateError } = await supabase
        .from('artist_registration')
        .update({ is_approved: true })
        .eq('id', id);
      if (updateError) throw updateError;

      console.log("Inserting into artist table...");
      const { data: newArtist, error: insertError } = await supabase
        .from('artist')
        .insert([{

          created_at: artistData.created_at,
          owner_Id: artistData.acc_id, // Ensure this references a valid profile ID
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
          gcash: artistData.gcash,
          sample_art1: artistData.sample_art,
          sample_art2: artistData.sample_art2
        }])
        .select()
        .single(); // Get the newly inserted artist data
      if (insertError) throw insertError;

      console.log("Inserting completed, updating profiles table...");
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ isArtist: true })
        .eq('id', artistData.acc_id); // Use acc_id instead of id
      if (profileError) throw profileError;

      console.log("Updating UI...");
      setRegister(prev => prev.filter(artist => artist.id !== id));
      setAcceptedArtists(prev => [...prev, { ...artistData, id: newArtist.id }]);
    } catch (error) {
      console.error("Error during artist accept:", error.message);
      setError(error.message);
    }
  };


  // Decline an artist with reason
  const declineArtist = async (artistId, reason) => {
    try {
      const { error } = await supabase
        .from('artist_registration')
        .update({ is_approved: false, decline_reason: reason })
        .eq('id', artistId);
      if (error) throw error;
      setRegister(prev => prev.filter((artist) => artist.id !== artistId));
      setDeclineModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Open the decline modal and set selected artist
  const handleDecline = (artist) => {
    setSelectedArtist(artist);
    setDeclineModal(true);
  };

  // Close the decline modal
  const closeDeclineModal = () => {
    setDeclineModal(false);
    setDeclineReason('');
    setOtherReason('');
    setSelectedArtist(null);
  };

  // Handle confirm decline (with selected reason)
  const confirmDecline = () => {
    const reasonToUse = declineReason === 'Others' && otherReason ? otherReason : declineReason;
    if (!reasonToUse) {
      alert('Please select or enter a reason for declining.');
      return;
    }
    declineArtist(selectedArtist.id, reasonToUse);
  };

  const handleId = (artist) => {
    setSelectedArtist(artist);
    setIdModal(true);
  };

  const closeModal = () => {
    setIdModal(false);
    setSelectedArtist(null);
  };

  const handleImageClick = (imageSrc) => {
    setEnlargedImage(imageSrc);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };



  const filteredArtists = artists.filter(artist => {
    const searchLower = searchQuery.toLowerCase();
    return (
      artist.artist_Name?.toLowerCase().includes(searchLower) ||
      artist.full_Name?.toLowerCase().includes(searchLower) ||
      artist.owner_Id?.full_name?.toLowerCase().includes(searchLower) ||
      artist.art_Type?.toLowerCase().includes(searchLower) ||
      artist.contact_number?.toLowerCase().includes(searchLower)
    );
  });


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtists = filteredArtists.slice(indexOfFirstItem, indexOfLastItem);

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
            placeholder="Search artists..."
            className="px-4 py-2 border rounded bg-white text-black w-64"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
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
                        onClick={() => handleId(artist)}
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
                          onClick={() => handleDecline(artist)}
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

        {idModal && selectedArtist && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4 text-black">
                {selectedArtist.artist_name || selectedArtist.artist_Name || 'Unnamed Artist'}'s Identification
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Selfie */}
                <div className="flex flex-col items-center">
                  <p className="text-black font-medium mb-2">Selfie</p>
                  <img
                    src={selectedArtist.selfie || 'https://via.placeholder.com/150'}
                    alt={`${selectedArtist.artist_name || selectedArtist.artist_Name || 'Artist'} selfie`}
                    className="w-24 h-24 object-contain rounded-md cursor-pointer"
                    onClick={() => handleImageClick(selectedArtist.selfie)}
                  />
                </div>
                {/* Valid ID */}
                <div className="flex flex-col items-center">
                  <p className="text-black font-medium mb-2">Valid ID</p>
                  <img
                    src={selectedArtist.valid_id || selectedArtist.valid_ID || 'https://via.placeholder.com/150'}
                    alt={`${selectedArtist.artist_name || selectedArtist.artist_Name || 'Artist'} ID`}
                    className="w-24 h-24 object-contain rounded-md cursor-pointer"
                    onClick={() => handleImageClick(selectedArtist.valid_id || selectedArtist.valid_ID)}
                  />
                </div>
                {/* GCash */}
                <div className="flex flex-col items-center">
                  <p className="text-black font-medium mb-2">GCash</p>
                  <img
                    src={selectedArtist.gcash || 'https://via.placeholder.com/150'}
                    alt={`${selectedArtist.artist_name || selectedArtist.artist_Name || 'Artist'} GCash`}
                    className="w-24 h-24 object-contain rounded-md cursor-pointer"
                    onClick={() => handleImageClick(selectedArtist.gcash)}
                  />
                </div>
                {/* Sample Arts - Spanning across bottom center */}
                <div className="col-span-3 flex flex-col items-center mt-4">
                  <p className="text-black font-medium mb-2">Sample Arts</p>
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      src={selectedArtist.sample_art || selectedArtist.sample_art || 'https://via.placeholder.com/150'}
                      alt={`${selectedArtist.artist_name || selectedArtist.artist_Name || 'Artist'} Sample Art 1`}
                      className="w-24 h-24 object-contain rounded-md cursor-pointer"
                      onClick={() => handleImageClick(selectedArtist.sample_art1)}
                    />
                    <img
                      src={selectedArtist.sample_art2 || 'https://via.placeholder.com/150'}
                      alt={`${selectedArtist.artist_name || selectedArtist.artist_Name || 'Artist'} Sample Art 2`}
                      className="w-24 h-24 object-contain rounded-md cursor-pointer"
                      onClick={() => handleImageClick(selectedArtist.sample_art2)}
                    />
                  </div>
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

        {declineModal && selectedArtist && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black">Reason for Declining Artist</h2>
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
                  <h1 className="text-black">Others:</h1>
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
                <button onClick={confirmDecline} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Confirm Decline</button>
              </div>
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
              <>
                <div className="space-y-6">
                  {currentArtists.length === 0 ? (
                    <h1 className="text-center font-bold text-3xl text-white">
                      {searchQuery ? 'No matching artists found' : 'No Artists'}
                    </h1>
                  ) : (
                    currentArtists.map((artist) => (
                      <div
                        key={artist.id}
                        className="flex flex-row border rounded-lg shadow-lg p-4 bg-gray-800 w-full items-start gap-4"
                      >
                        <img
                          src={artist.artist_Image || 'https://via.placeholder.com/150'}
                          alt={artist.artist_Name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="flex flex-col">
                          <h2 className="text-xl font-semibold text-white hover:text-blue-500 cursor-pointer hover:underline" onClick={() => handleId(artist)}>
                            {artist.artist_Name}
                            {artist.is_Premium && (
                              <div className="bg-yellow-600 text-white text-xs font-semibold px-1 py-0.5 rounded-sm ml-2 inline-block">
                                Premium
                              </div>
                            )}
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
                <Pagination
                  currentPage={currentPage}
                  totalItems={artists.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Artists;