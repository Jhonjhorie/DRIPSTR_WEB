import React from "react";
import Sidebar from "../components/Sidebar";

const UserProfile = () => {
  return (
    <div className="p-4 flex min-h-screen bg-slate-200">
      <Sidebar />

      <div className="flex-1 p-4 px-9">
        <div className="bg-slate-200 ">
          <h1 className="text-xl font-bold text-gray-800 mb-6">My Profile</h1>

          <div className="bg-gray-100 p-4 rounded-lg shadow">

          {/* Profile Picture Section */}
          <div className="flex items-center mb-6  ">
 
            <img
              src="path_to_profile_picture" // Placeholder for profile picture
              alt=""
              className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">Jhonjhorie Quiling</h2>
              <button className="text-blue-600 font-medium">Change Picture</button>
            </div>            </div>
         

          {/* Contact Information Section */}
          <div className="mb-6 ">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Section */}
              <div>
                <label className="text-gray-600 font-medium block">Email Address</label>
                <div className="flex justify-between bg-slate-200 items-center p-2 border border-gray-300 rounded-md w-full">
                  <p className="text-lg text-gray-900">jh********@gmail.com</p>
                  <button className="text-blue-600 font-medium">Change</button>
                </div>
              </div>

              {/* Mobile Section */}
              <div>
                <label className="text-gray-600 font-medium block">Mobile</label>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Enter your mobile number"
                    className="text-lg bg-slate-200 text-gray-700 border border-gray-300 rounded-md p-2 w-full"
                  />
                  <button className="bg-blue-600 text-white font-medium py-1 px-3 rounded-md ml-2">Add</button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Birthday Section */}
              <div>
                <label className="text-gray-600 font-medium block">Birthday</label>
                <input
                  type="date"
                  className="text-lg bg-slate-200 text-gray-700 border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              {/* Gender Section */}
              <div>
                <label className="text-gray-600 font-medium block">Gender</label>
                <select className="text-lg text-gray-700 border bg-slate-200 border-gray-300 rounded-md p-2 w-full">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-10 gap-6">
            <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex-1">Save Changes</button>
            <button className="bg-red-600 text-white font-medium py-2 px-4 rounded-md flex-1">Delete Account</button>
          </div>
        </div>
      </div></div>
    </div>
  );
};

export default UserProfile;