import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Shared/Sidebar";

function AccountDetail() {
  const { accountId } = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // Track active tab

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

  // Example of account details for demonstration, you can replace this with an API call
  const accountDetails = {
    "ID-1": {
      accountName: "Test-1",
      username: "User_1",
      email: "email1@example.com",
      role: "Designer",
      joined: "2024-12-01",
      status: "Active",
    },
    "ID-2": {
      accountName: "Test-2",
      username: "User_2",
      email: "email2@example.com",
      role: "Admin",
      joined: "2024-12-02",
      status: "Suspended",
    },
    // Add more accounts as needed
  };

  // Retrieve the details based on the accountId
  const account = accountDetails[accountId] || {};

  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="2xl:w-4/6 xl:w-4/6 lg:w-5/6 md:w-full h-5/6 flex-col">
        <div className="h-16"></div>
        <div className="bg-slate-900 h-5/6 m-5 flex flex-col rounded-3xl p-2 cursor-default">
          <p className="text-white text-2xl font-bold p-6">Account Details</p>

          {/* Tab Headers */}
          <div className="border-b-4 border-violet-600 text-white flex">
            <div
              className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                activeTab === "overview" ? "text-violet-600" : ""
              }`}
              onClick={() => handleTabClick("overview")}
            >
              OVERVIEW
            </div>
            <div
              className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                activeTab === "activity" ? "text-violet-600" : ""
              }`}
              onClick={() => handleTabClick("activity")}
            >
              ACTIVITY LOG
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex h-full flex-row p-2">
            <div className="text-white 2xl:w-3/6 m-4 flex">
              {activeTab === "overview" && (
                <table>
                  <thead>
                    <tr>
                      <th className="text-violet-600 p-4 text-left">
                        Account ID
                      </th>
                      <th className="bg-black rounded-2xl px-16 text-left">
                        {accountId}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-violet-600 p-4 text-left">
                        Account Name
                      </th>
                      <th className="bg-black rounded-2xl px-16 text-left">
                        {account.accountName}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-violet-600 p-4 text-left">
                        Username
                      </th>
                      <th className="bg-black rounded-2xl px-16 text-left">
                        {account.username}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-violet-600 p-4 text-left">Email</th>
                      <th className="bg-black rounded-2xl px-16 text-left">
                        {account.email}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-violet-600 p-4 text-left">Role</th>
                      <th className="bg-black rounded-2xl px-16 text-left">
                        {account.role}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-violet-600 p-4 text-left">Joined</th>
                      <th className="bg-black rounded-2xl px-16 text-left">
                        {account.joined}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-violet-600 p-4 text-left">Status</th>
                      <th className="bg-black rounded-2xl px-16 text-left">
                        {account.status}
                      </th>
                    </tr>
                  </thead>
                </table>
              )}

              {activeTab === "activity" && (
                <div className="text-white">
                  <p>Activity Log content goes here...</p>
                  {/* Add the Activity Log content */}
                </div>
              )}
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

      {/* Confirmation Modal */}
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

export default AccountDetail;
