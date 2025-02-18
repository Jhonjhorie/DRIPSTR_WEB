import React, { useState, useEffect } from "react";
import Sidebar from "./Shared/Sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";

function Reports() {
  const navigate = useNavigate();
  const [fetchedReports, setFetchedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const fetchReports = async () => {
    setLoading(true);

    const { data: reports, error: reportError } = await supabase
      .from("reported_Art")
      .select("id, created_at, art_Id, art_Name, reason, action");

    if (reportError) {
      console.error("❌ Error fetching reports:", reportError.message);
      setLoading(false);
      return;
    }

    const artIds = reports.map((report) => report.art_Id);
    const { data: arts, error: artsError } = await supabase
      .from("artist_Arts")
      .select("id, art_Image, artist_Id")
      .in("id", artIds);

    if (artsError) {
      console.error("❌ Error fetching arts:", artsError.message);
      setLoading(false);
      return;
    }

    const artistIds = arts.map((art) => art.artist_Id);
    const { data: artists, error: artistsDataError } = await supabase
      .from("artist")
      .select("id, artist_Name")
      .in("id", artistIds);

    if (artistsDataError) {
      console.error("❌ Error fetching artists:", artistsDataError.message);
      setLoading(false);
      return;
    }

    const reportsWithDetails = reports.map((report) => {
      const art = arts.find((artItem) => artItem.id === report.art_Id);
      const artist = artists.find((artistItem) => artistItem.id === art?.artist_Id);

      return {
        ...report,
        art_Image: art ? art.art_Image : null,
        artist_Name: artist ? artist.artist_Name : "Unknown Artist",
      };
    });

    setFetchedReports(reportsWithDetails);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openImageModal = (image) => {
    setModalContent({
      type: "image",
      content: image,
    });
    setIsModalOpen(true);
  };

  const openActionModal = (report) => {
    setModalContent({
      type: "action",
      content: report,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  // Function to update the action field in the `reported_Art` table
  const updateReportAction = async (reportId, action) => {
    const { data, error } = await supabase
      .from("reported_Art")
      .update({ action })
      .eq("id", reportId);

    if (error) {
      console.error("❌ Error updating report action:", error.message);
    } else {
      setFetchedReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, action } : report
        )
      );
      closeModal();
    }
  };

  // Function to delete a report (called when "Dismiss" is clicked)
  const deleteReport = async (reportId) => {
    const { data, error } = await supabase
      .from("reported_Art")
      .delete()
      .eq("id", reportId);

    if (error) {
      console.error("❌ Error deleting report:", error.message);
    } else {
      // Remove the deleted report from the local state
      setFetchedReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );
      closeModal();
    }
  };

  const handleActionClick = (action) => {
    if (modalContent && modalContent.type === "action") {
      if (action === "Dismiss") {
        deleteReport(modalContent.content.id);  // Call delete function when "Dismiss" is clicked
      } else {
        updateReportAction(modalContent.content.id, action);  // Update action for Warn or Suspend
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
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
                    <td className="p-2 border border-gray-500 cursor-pointer hover:text-blue-500 underline" onClick={() => openActionModal(report)}>{report.action}</td>
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

        {/* Modal for action buttons */}
        {isModalOpen && modalContent && modalContent.type === "image" && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={closeModal}
          >
            <div
              className="relative bg-gray-900 p-4 rounded-md"
              onClick={(e) => e.stopPropagation()} // Prevents closing modal when clicking inside it
            >
              <img
                src={modalContent.content}
                alt="Full view"
                className="max-w-screen-lg h-[25rem] w-[25rem] object-contain" // Ensures image doesn't overflow
              />

              <button
                className="absolute top-2 right-2 text-white font-bold text-2xl hover:text-black"
                onClick={closeModal}
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
