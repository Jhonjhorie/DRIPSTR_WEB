import React, { useState, useEffect } from "react";
import Sidebar from "./Shared/Sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";

function Reports() {
  const navigate = useNavigate();
  const [fetchedReports, setFetchedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null); // State to hold the clicked image

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [modalContent, setModalContent] = useState(null);

  const fetchReports = async () => {
    setLoading(true);

    // Fetch reports from the 'reported_Art' table
    const { data: reports, error: reportError } = await supabase
      .from("reported_Art")
      .select("id, created_at, art_Id, art_Name, reason, action");  // Fetch data including art_Id

    if (reportError) {
      console.error("❌ Error fetching reports:", reportError.message);
      setLoading(false);
      return;
    }

    // Now, fetch the art_Image from 'artist_Arts' table using art_Id (which corresponds to 'id' in artist_Arts)
    const artIds = reports.map((report) => report.art_Id);  // Extract all art_Id values

    // Fetch the art_Image from artist_Arts where the artist_Arts.id matches the art_Id in reported_Art
    const { data: arts, error: artsError } = await supabase
      .from("artist_Arts")
      .select("id, art_Image, artist_Id")  // Fetch art Image and artist_Id columns
      .in("id", artIds);  // Filter based on the art_Id values from reported_Art

    if (artsError) {
      console.error("❌ Error fetching arts:", artsError.message);
      setLoading(false);
      return;
    }

    // Now, fetch the artist data based on the artist_Id
    const artistIds = arts.map((art) => art.artist_Id);  // Extract all artist_Id values
    const { data: artists, error: artistsDataError } = await supabase
      .from("artist")
      .select("id, artist_Name")  // Fetch artist's name
      .in("id", artistIds);  // Filter based on the artist_Id values from artist_Arts

    if (artistsDataError) {
      console.error("❌ Error fetching artists:", artistsDataError.message);
      setLoading(false);
      return;
    }

    // Merge the reports, arts, and artists data
    const reportsWithDetails = reports.map((report) => {
      // Find the corresponding art data
      const art = arts.find((artItem) => artItem.id === report.art_Id);
      // Find the corresponding artist data
      const artist = artists.find((artistItem) => artistItem.id === art?.artist_Id);

      return {
        ...report,
        art_Image: art ? art.art_Image : null,
        artist_Name: artist ? artist.artist_Name : "Unknown Artist",  // Default to "Unknown Artist" if not found
      };
    });

    setFetchedReports(reportsWithDetails);  // Set the final data to state
    setLoading(false);  // Stop loading
  };



  useEffect(() => {
    fetchReports();
  }, []);

  const openImageModal = (image) => {
    setModalContent({
      type: "image", // Type for identifying that it's an image
      content: image,
    });
    setIsModalOpen(true);
  };

  // Open modal with action options (Warn, Suspend, Dismiss)
  const openActionModal = (report) => {
    setModalContent({
      type: "action", // Type for identifying that it's action options
      content: report,
    });
    setIsModalOpen(true);
  };

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };


  // Format date
  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Options to format the date
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    // Options to format the time
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    // Get the day of the week
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    return `${formattedDate} - ${dayOfWeek} - ${formattedTime}`;
  };



  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-full bg-slate-900 rounded-lg p-4 m-4">
        <div>
          <h1 className="text-white text-3xl font-bold mb-4">Reports</h1>
        </div>
        {loading ? (
          <p className="text-white text-center">Loading reports...</p>
        ) : (
          <table className="w-full table-fixed text-white border border-gray-600 bg-gray-800">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 border border-gray-500">ID</th>
                <th className="p-2 border border-gray-500">Report Date</th>
                <th className="p-2 border border-gray-500">Image</th>
                <th className="p-2 border border-gray-500">Art Name</th>
                <th className="p-2 border border-gray-500">Artist</th>
                <th className="p-2 border border-gray-500">Reason</th>
                <th className="p-2 border border-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchedReports.length > 0 ? (
                fetchedReports.map((report) => (
                  <tr key={report.id} className="text-center border-b border-gray-600">
                    <td className="p-2 border border-gray-500">{report.id}</td>
                    <td className="p-2 border border-gray-500">{formatDate(report.created_at)}</td>
                    <td className="p-2 border border-gray-500">
                      {report.art_Image ? (
                        <img
                          src={report.art_Image}
                          alt="Art"
                          className="cursor-pointer h-16 w-16 object-cover mx-auto"
                          onClick={() => openImageModal(report.art_Image)}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="p-2 border border-gray-500">{report.art_Name || "No Name"}</td>
                    <td className="p-2 border border-gray-500">{report.artist_Name || "No Name"}</td>
                    <td className="p-2 border border-gray-500">{report.reason}</td>
                    <td className="p-2 border border-gray-500 cursor-pointer hover:text-blue-500 underline" onClick={() => openActionModal(report)}   >{report.action}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-2">No Reports found</td>
                </tr>
              )}
            </tbody>
          </table>

        )}
{/* Modal for image or action */}
{isModalOpen && modalContent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal} // Close modal when clicking outside of the modal
        >
          <div className="relative bg-gray-900 p-4 rounded-md">
            {modalContent.type === "image" && (
              <img
                src={modalContent.content}
                alt="Full Screen"
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
            )}

            {modalContent.type === "action" && (
              <div className="text-white p-6">
                <h2 className="text-xl mb-4">Select Action for Report ID: {modalContent.content.id}</h2>
                <button
                  className="w-full py-2 mb-2 bg-yellow-500 text-black"
                  onClick={() => {}}
                >
                  Warn
                </button>
                <button
                  className="w-full py-2 mb-2 bg-red-600 text-white"
                  onClick={() => {}}
                >
                  Suspend Account
                </button>
                <button
                  className="w-full py-2 mb-2 bg-green-500 text-white"
                  onClick={() => {}}
                >
                  Dismiss
                </button>
              </div>
            )}

            <button
              className="absolute top-4 right-4 text-white font-bold text-2xl"
              onClick={closeModal}  // Close the modal
            >
              X
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

export default Reports;
