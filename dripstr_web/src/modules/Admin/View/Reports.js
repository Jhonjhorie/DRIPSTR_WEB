import React, { useState, useEffect } from "react";
import Sidebar from "./Shared/Sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";

function Reports() {
  const navigate = useNavigate();
  const [fetchedReports, setFetchedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the clicked image
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

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
      .select("id, art_Image")  // Fetch only the 'id' and 'art_Image' columns
      .in("id", artIds);  // Filter based on the art_Id values from reported_Art

    if (artsError) {
      console.error("❌ Error fetching arts:", artsError.message);
      setLoading(false);
      return;
    }

    // Merge the reports with their corresponding art images
    const reportsWithImages = reports.map((report) => {
      const art = arts.find((artItem) => artItem.id === report.art_Id);  // Match by 'id' from artist_Arts
      return { ...report, art_Image: art ? art.art_Image : null };  // Attach the art_Image or null if not found
    });

    setFetchedReports(reportsWithImages);  // Set the final data to state
    setLoading(false);  // Stop loading
  };


  useEffect(() => {
    fetchReports();
  }, []);

  const setImageFull = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the selected image URL
    setIsModalOpen(true); // Open the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedImage(null); // Clear the selected image
  };

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col w-full bg-slate-900 rounded-lg p-4 m-4">
        <h1 className="text-white text-2xl font-bold mb-4">Reports</h1>
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
                <th className="p-2 border border-gray-500">Reason</th>
                <th className="p-2 border border-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchedReports.length > 0 ? (
                fetchedReports.map((report) => (
                  <tr key={report.id} className="text-center border-b border-gray-600">
                    <td className="p-2 border border-gray-500">{report.id}</td>
                    <td className="p-2 border border-gray-500">{report.created_at}</td>
                    <td className="p-2 border border-gray-500">
                      {report.art_Image ? (
                        <img
                          src={report.art_Image}
                          alt="Art"
                          className="cursor-pointer h-16 w-16 object-cover mx-auto"
                          onClick={() => setImageFull(report.art_Image)}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="p-2 border border-gray-500">{report.art_Name || "No Name"}</td>
                    <td className="p-2 border border-gray-500">{report.reason}</td>
                    <td className="p-2 border border-gray-500">{report.action}</td>
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
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={closeModal} // Close modal when clicking outside of the image
          >
            <div className="relative">
              <img
                src={selectedImage}
                alt="Full Screen"
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />
              <button
                className="absolute top-4 right-4 text-black font-bold text-2xl"
                onClick={closeModal} // Close the modal
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
