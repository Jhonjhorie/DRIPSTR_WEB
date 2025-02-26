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
  const [selectedTab, setSelectedTab] = useState("Products");
  const [productReports, setProductReports] = useState([]);

  const fetchProductReports = async () => {
    setLoading(true);

    const { data: reports, error: reportError } = await supabase
      .from("reported_Chinese")
      .select("id, created_at, prod_Id(item_Variant, shop_Name), prod_Name, reason, action");

    if (reportError) {
      console.error("❌ Error fetching reports:", reportError.message);
      setLoading(false);
      return;
    }

    setProductReports(reports);
    setLoading(false);
  }

  useEffect(() => {
    fetchProductReports();
  }, []);


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

  const updateReportAction = async (reportId, action) => {
    if (selectedTab === "Arts") {
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
    }else{
      const { data, error } = await supabase
      .from("reported_Chinese")
      .update({ action })
      .eq("id", reportId);

    if (error) {
      console.error("❌ Error updating report action:", error.message);
    } else {
      setProductReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, action } : report
        )
      );
      closeModal();
    }
    }

  };

  const deleteReport = async (reportId) => {
    if (selectedTab === "Arts") {
      const { data, error } = await supabase
      .from("reported_Art")
      .delete()
      .eq("id", reportId);

    if (error) {
      console.error("❌ Error deleting report:", error.message);
    } else {
      setFetchedReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );
      closeModal();
    }}
    else{
      const { data, error } = await supabase
      .from("reported_Chinese")
      .delete()
      .eq("id", reportId);

    if (error) {
      console.error("❌ Error deleting report:", error.message);
    } else {
      setProductReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );
      closeModal();
    }
    }
  };

  const handleActionClick = (action) => {
    if (modalContent && modalContent.type === "action") {
      if (action === "Dismiss") {
        deleteReport(modalContent.content.id);
      } else {
        updateReportAction(modalContent.content.id, action);
      }
    }
  };

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

        {/* Tab Buttons */}
        <div className="flex mb-4">
          <button
            className={`p-2 w-1/2 text-center ${selectedTab === "Products" ? "bg-blue-500" : "bg-gray-700"} text-white`}
            onClick={() => setSelectedTab("Products")}
          >
            Products
          </button>
          <button
            className={`p-2 w-1/2 text-center ${selectedTab === "Arts" ? "bg-blue-500" : "bg-gray-700"} text-white`}
            onClick={() => setSelectedTab("Arts")}
          >
            Arts
          </button>
        </div>

        {/* Tab Content */}
        {selectedTab === "Products" && (
          <div>
            {loading ? (
              <p className="text-white text-center">Loading reports...</p>
            ) : (
              <table className="w-full table-fixed text-white border border-gray-600 bg-gray-800">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-2 border border-gray-500">ID</th>
                    <th className="p-2 border border-gray-500">Report Date</th>
                    <th className="p-2 border border-gray-500">Image</th>
                    <th className="p-2 border border-gray-500">Product Name</th>
                    <th className="p-2 border border-gray-500">Merchant Name</th>
                    <th className="p-2 border border-gray-500">Reason</th>
                    <th className="p-2 border border-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productReports && productReports.length > 0 ? (
                    productReports.map((report) => (
                      <tr key={report.id} className="text-center border-b border-gray-600">
                        <td className="p-2 border border-gray-500">{report.id}</td>
                        <td className="p-2 border border-gray-500">{formatDate(report.created_at)}</td>
                        <td className="p-2 border border-gray-500">
                          {report.prod_Id?.item_Variant[0].imagePath ? (
                            <img
                              src={report.prod_Id?.item_Variant[0].imagePath}
                              alt="Art"
                              className="cursor-pointer h-16 w-16 object-cover mx-auto"
                              onClick={() => openImageModal(report.prod_Id?.item_Variant[0].imagePath)}
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </td>
                        <td className="p-2 border border-gray-500">{report.prod_Name || "No Name"}</td>
                        <td className="p-2 border border-gray-500">{report.prod_Id?.shop_Name || "No Name"}</td>
                        <td className="p-2 border border-gray-500">{report.reason}</td>
                        <td className="p-2 border border-gray-500 cursor-pointer hover:text-blue-500 underline" onClick={() => openActionModal(report)}>{report.action}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center p-2">No Reports found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {selectedTab === "Arts" && (
          <div>
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
          </div>
        )}

        {/* Modal for action buttons */}
        {isModalOpen && modalContent && modalContent.type === "action" && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={closeModal}
          >
            <div
              className="relative bg-gray-900 p-4 rounded-md"
              onClick={(e) => e.stopPropagation()} // Prevents closing modal when clicking inside it
            >
              <h2 className="text-white text-2xl mb-4">Pending Review</h2>
              <p className="text-white mb-4">Choose an action for the report:</p>
              <div className="flex justify-between flex-col w-auto gap-2">
                <button
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-gray-500"
                  onClick={() => handleActionClick("Warn")}
                >
                  Warn
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded hover:bg-gray-500"
                  onClick={() => handleActionClick("Suspend")}
                >
                  Suspend
                </button>
                <button
                  className="bg-green-500 text-white p-2 rounded hover:bg-gray-500"
                  onClick={() => handleActionClick("Dismiss")}
                >
                  Dismiss
                </button>
              </div>
              <button
                className="absolute top-2 right-2 text-white font-bold text-2xl hover:text-black"
                onClick={closeModal}
              >
                X
              </button>
            </div>
          </div>
        )}

        {/* Modal for full image */}
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
