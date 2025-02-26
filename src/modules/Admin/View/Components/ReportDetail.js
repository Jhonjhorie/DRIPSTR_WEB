import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Shared/Sidebar";

function ReportDetail() {
  const { reportNo } = useParams();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveChanges = () => {
    setShowConfirm(true); // Show confirmation modal
  };

  const confirmSave = () => {
    setShowConfirm(false); // Close modal
    console.log("Changes saved!"); // Replace with your save logic
  };

  const cancelSave = () => {
    setShowConfirm(false); // Close modal
  };

  // Example of report details for demonstration, you can replace this with an API call
  const reportDetails = {
    "RPT-1": {
      username: "John",
      userId: "1000099",
      createdAt: "January 10, 2000",
      messageReported: "SPAM SPAM SPAM SPAM SPAM",
      reportReason: "Spam",
    },
    "RPT-2": {
      username: "Jane",
      userId: "1000100",
      createdAt: "January 11, 2000",
      messageReported: "Offensive content",
      reportReason: "Abusive Language",
      freezeStatus: "None",
    },
    // Add more reports as needed
  };

  // Retrieve the details based on the reportNo
  const report = reportDetails[reportNo] || {};

  const navigate = useNavigate();

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="2xl:w-4/6 xl:w-4/6 lg:w-5/6 md:w-full h-5/6 flex-col">
        <div className=" h-16"></div>
        <div className="bg-slate-900 h-5/6 m-5 flex flex-col rounded-3xl p-2 cursor-default">
          <p className="text-white text-2xl font-bold p-6">Detailed Report</p>
          <div className="flex h-full flex-row p-2">
            <div className="text-white 2xl:w-3/6 m-4 flex">
              <table>
                <thead>
                  <tr>
                    <th className="text-violet-600 p-4 text-left">Report No</th>
                    <th className="bg-black rounded-2xl px-16 text-left">
                      {reportNo}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-violet-600 p-4 text-left">Username</th>
                    <th className="bg-black rounded-2xl px-16 text-left">
                      {report.username}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-violet-600 p-4 text-left">User ID</th>
                    <th className="bg-black rounded-2xl px-16 text-left">
                      {report.userId}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-violet-600 p-4 text-left">
                      Created At
                    </th>
                    <th className="bg-black rounded-2xl px-16 text-left">
                      {report.createdAt}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-violet-600 p-4 text-left">Action</th>
                    <th className="bg-black rounded-2xl px-16 text-left">
                      <select className="bg-black">
                        <option value="warn">Warn</option>
                        <option value="temporarilySuspend">
                          Temporarily Suspend
                        </option>
                        <option value="ban">Ban</option>
                        <option value="ignore">Ignore/Resolved</option>
                      </select>
                    </th>
                  </tr>
                  <tr>
                    <th className="text-violet-600 p-4 text-left">
                      Freeze Account
                    </th>
                    <th className="bg-black rounded-2xl px-16 text-left">
                      <select className="bg-black">
                        <option value="warn">Warn</option>
                        <option value="temporarilySuspend">
                          Temporarily Suspend
                        </option>
                        <option value="ban">Ban</option>
                        <option value="ignore">Ignore/Resolved</option>
                      </select>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="w-1/2 2xl:w-3/6 h-full m-4 text-left">
              <p className="text-violet-600 font-bold">ACTION</p>
              <div className="bg-black h-4/6 p-4 m-2 text-white">
                <div className="bg-red-950 border-red-600 text-white border-2 w-full p-2 rounded-3xl">
                  <table>
                    <thead>
                      <tr className="font-bold">
                        <th>Message Reported</th>
                      </tr>
                      <tr>
                        <td>User</td>
                        <td>(with user icon) {report.username}</td>
                      </tr>
                      <tr>
                        <td>Message</td>
                        <td>{report.messageReported}</td>
                      </tr>
                      <tr>
                        <td>Report Reason</td>
                        <td className="bg-white text-black rounded-2xl">
                          {report.reportReason}
                        </td>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="w-full flex flex-row items-center mt-4">
                  <p className="font-bold">Freeze Status</p>
                  <p className="pl-14">{report.freezeStatus}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Buttons for cancel and save */}
          <div className="flex justify-start mx-4 pl-10 pb-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-xl mr-4 hover:scale-125 duration-500"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              className="bg-violet-600 text-white px-4 py-2 rounded-xl hover:scale-125 duration-500"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-900 rounded-xl shadow-lg p-6 w-96">
            <p className="text-white text-lg font-bold mb-4">
              Are you sure you want to save the changes?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-xl mr-4 hover:scale-125 duration-500"
                onClick={cancelSave}
              >
                Cancel
              </button>
              <button
                className="bg-violet-600 text-white px-4 py-2 rounded-xl hover:scale-125 duration-500"
                onClick={confirmSave}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportDetail;
