import React from "react";
import Sidebar from "../components/Sidebar";

const UserProfile = () => {
  return (
    <div className="p-4 bg-slate-200 min-h-screen flex flex-row">
      {/* Profile Header */}
      <Sidebar />

      <div className="px-5">
        <div className="flex items-center justify-between mb-6">

          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>

        <div className="p-10 bg-slate-100 rounded-md">
          <div className="flex flex-wrap justify-between mb-10 gap-6">
            {/* Full Name Section */}
            <div className="mb-4 flex-1">
              <label className="text-gray-600 font-medium block">Full Name</label>
              <p className="text-lg text-gray-900">Jhonjhorie Quiling</p>
            </div>

            {/* Email Section */}
            <div className="flex-1">
              <label className="text-gray-600 font-medium block">Email Address</label>
              <div className="flex justify-between items-center">
                <p className="text-lg text-gray-900">jh********@gmail.com</p>
                <button className="text-indigo-600 font-medium">Change</button>
              </div>
            </div>

            {/* Mobile Section */}
            <div className="flex-1">
              <label className="text-gray-600 font-medium block">Mobile</label>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Please enter your mobile"
                  className="text-lg text-gray-400 border border-gray-300 rounded-md p-2 w-full"
                />
                <button className="text-indigo-600 font-medium ml-2">Add</button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-6">
            {/* Birthday Section */}
            <div className="flex-1">
              <label className="text-gray-600 font-medium block">Birthday</label>
              <input
                type="text"
                placeholder="Please enter your birthday"
                className="text-lg text-gray-400 border border-gray-300 rounded-md p-2 w-full"
              />
            </div>

            {/* Gender Section */}
            <div className="flex-1">
              <label className="text-gray-600 font-medium block">Gender</label>
              <input
                type="text"
                placeholder="Please enter your gender"
                className="text-lg text-gray-400 border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-10 gap-6">
            <button className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-md flex-1">
              Edit
            </button>
            <button className="bg-gray-600 text-white font-medium py-2 px-4 rounded-md flex-1">
              Set Password
            </button>
          </div>
        </div>
      </div>    
    </div>

  );
};

export default UserProfile;
