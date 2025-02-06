import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import ProfilePictureUploadModal from "../components/ProfilePictureUploadModal";

import useUserData from "../Model/User_Account_Model";


const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    mobile: "",
    birthday: "",
    gender: "",
    profile_picture: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null); // Store original profile
  const [loading, setLoading] = useState(true); // Show loading while fetching
  const [error, setError] = useState(""); // Handle errors
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch logged-in user info and profile
  const fetchUserProfile = async () => {
    try {
      const { data: session, error: sessionError } = await supabase.auth.getSession();
  
      if (sessionError) throw sessionError;
      if (!session || !session.session || !session.session.user) {
        throw new Error("User not logged in or session invalid.");
      }
  
      const userId = session.session.user.id; // Ensure valid user ID
  
      // Fetch user profile from database
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, mobile , birthday, gender, profile_picture")
        .eq("id", userId)
        .single();
  
      if (profileError) throw profileError;
  
      setProfile(data);
      setOriginalProfile(data); // Save original profile
    } catch (err) {
      setError(err.message || "An error occurred while fetching the profile.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          email: profile.email,
          mobile: profile.mobile,
          birthday: profile.birthday,
          gender: profile.gender,
          profile_picture: profile.profile_picture,
        })
        .eq("id", profile.id);

      if (error) throw error;

      setIsEditing(false);
      fetchUserProfile(); // Refresh profile after saving changes
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile); // Revert changes
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
 

  return (
    <div className="p-4 flex min-h-screen bg-slate-200">
      <Sidebar />

      <div className="flex-1 p-4 px-9">
        <div className="bg-slate-200 ">
          <h1 className="text-xl font-bold text-gray-800 mb-6">My Profile</h1>

          <div className="bg-gray-100 p-4 rounded-lg shadow">
          {loading ? (
          <div className="flex flex-col justify-center items-center">
            <img src="/emote/hmmm.png" alt="Loading..." className="w-50 h-50" />
            <label>Loading...</label>
          </div>
        ) : (
        <div className="">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
              <img
                src={profile.profile_picture || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-gray-300 mr-2 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
                <div>
                {isEditing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={profile.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your Full Namer"
                        className="text-lg bg-slate-200 text-gray-700 border border-gray-300 rounded-md p-2 w-full"
                      />
                    ) : (
                       <h2 className="text-lg text-gray-900 font-semibold">{profile.full_name}</h2>

                    )}
                  <button className="text-blue-600 font-medium" onClick={() => setIsModalOpen(true)}
                  >
                    Change Picture
                  </button>
                </div>
              </div>
              <div className="align-middle justify-center">
                <Link to="../Cc">
                  <button className="text-blue-600 font-medium">
                    Create Avatar
                  </button>
                </Link>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-600 font-medium block">
                    Email Address
                  </label>
                  <div className="flex justify-between rounded-md w-full">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="text-lg text-gray-900 border p-2 border-gray-300 bg-slate-200 rounded-md w-full"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">{profile.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 font-medium block">
                    Mobile
                  </label>
                  <div className="flex items-center justify-between">
                    {isEditing ? (
                      <input
                        type="text"
                        name="mobile"
                        value={profile.mobile}
                        onChange={handleInputChange}
                        placeholder="Enter your mobile number"
                        className="text-lg bg-slate-200 text-gray-700 border border-gray-300 rounded-md p-2 w-full"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">{profile.mobile}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-600 font-medium block">
                    Birthday
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthday"
                      value={profile.birthday}
                      onChange={handleInputChange}
                      className="text-lg bg-slate-200 text-gray-700 border border-gray-300 rounded-md p-2 w-full"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{profile.birthday}</p>
                  )}
                </div>

                <div>
                  <label className="text-gray-600 font-medium block">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleInputChange}
                      className="text-lg text-gray-700 border bg-slate-200 border-gray-300 rounded-md p-2 w-full"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-lg text-gray-900">{profile.gender}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-10">
              {isEditing && (
                <button
                  className="bg-gray-400 text-white font-medium py-2 px-4 rounded-md"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
              <button
                className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                onClick={isEditing ? updateProfile : () => setIsEditing(true)}
              >
                {isEditing ? "Save Changes" : "Edit"}
              </button>
            </div>
            </div>
                    )}

          </div>
          
        </div>
      </div>



      {/* Modal for Upload */}
      {isModalOpen && (
        <ProfilePictureUploadModal
          isOpen={isModalOpen}
          onClose={(newImageUrl) => {
            if (newImageUrl) setProfile((prev) => ({ ...prev, profile_picture: newImageUrl }));
            setIsModalOpen(false);
          }}
          userId={profile.id}
          currentImage={profile.profile_picture}
        />
      )}


    </div>
  );
};

export default UserProfile;
