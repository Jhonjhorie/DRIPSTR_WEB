import React, { useState, useEffect } from 'react';
import { supabase } from "../../../constants/supabase";
import Sidebar from './Shared/Sidebar';
import Pagination from './Components/Pagination';

function Arts() {
  // State management
  const [arts, setArts] = useState([]);        // Store fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state
  const itemsPerPage = 6;                       // Items per page
  const [currentPage, setCurrentPage] = useState(1); // Current page

  const fetchArts = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_Arts')
        .select('*, artist_Id(artist_Name)')
        .eq('status', 'Pending');

      if (error) {
        throw error;
      }

      console.log('Fetched data:', data);
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
      // Update the status in Supabase
      const { error } = await supabase
        .from('artist_Arts')
        .update({ status: 'Approved' })
        .eq('id', artId);

      if (error) {
        throw error;
      }

      // Update local state to remove the approved item from the list
      setArts((prevArts) => prevArts.filter((art) => art.id !== artId));
    } catch (error) {
      console.error('Error approving art:', error.message);
      setError(error.message);
    }
  };

  const declineArt = async (artId) => {
    try {
      // Update the status in Supabase
      const { error } = await supabase
        .from('artist_Arts')
        .update({ status: 'Declined' })
        .eq('id', artId);

      if (error) {
        throw error;
      }

      // Update local state to remove the approved item from the list
      setArts((prevArts) => prevArts.filter((art) => art.id !== artId));
    } catch (error) {
      console.error('Error approving art:', error.message);
      setError(error.message);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArts = arts.slice(indexOfFirstItem, indexOfLastItem); // Slice arts, not orders
  const totalPages = Math.ceil(arts.length / itemsPerPage);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-slate-900 rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-white">Arts</h1>

        {/* Loading State */}
        {loading && (
          <p className="text-gray-500">Loading...</p>
        )}

        {/* Error State */}
        {error && (
          <p className="text-red-500">Error: {error}</p>
        )}

        {/* Data Display */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {currentArts.length === 0 ? ( // Use currentArts here
              <p className="text-gray-500 text-center col-span-full">
                No items found
              </p>
            ) : (
              currentArts.map((art) => ( 
                <div
                  key={art.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* Image Column */}
                    <div className="md:col-span-1">
                      <img
                        src={art.art_Image}
                        alt={art.art_Name}
                        className="w-full h-60 object-contain"
                      />
                    </div>

                    {/* Details Column */}
                    <div className="md:col-span-2 p-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {art.art_Name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {art.art_Description}
                        </p>
                        <div className="text-sm">
                          <p className="text-gray-700">
                            <span className="font-medium">Artist:</span>{" "}
                            {art.artist_Id?.artist_Name || "Unknown"}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(art.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Status:</span>{" "}
                            <span
                              className={`${
                                art.status === "Approved"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {art.status}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => approveArt(art.id)}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declineArt(art.id)}
                          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && arts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={arts.length} // Use arts.length, not orders.length
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

export default Arts;