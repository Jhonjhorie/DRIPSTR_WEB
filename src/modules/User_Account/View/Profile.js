import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import ProfilePictureUploadModal from "../components/ProfilePictureUploadModal";
import hmmmEmote from '../../../assets/emote/hmmm.png';  // Add this import at the top

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
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session || !session.session || !session.session.user) {
        throw new Error("User not logged in or session invalid.");
      }

      const userId = session.session.user.id; // Ensure valid user ID

      // Fetch user profile from database
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email, mobile , birthday, gender, profile_picture"
        )
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
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 px-9">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <i className="fas fa-user-circle mr-3 text-primary-color"></i>
            My Profile
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-primary-color hover:text-primary-color/80 transition-colors"
            >
              <i className="fas fa-edit"></i>
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex mt-36 flex-col h-100 justify-center items-center">
            <img src={hmmmEmote} alt="Loading..." className="w-24 h-24 mb-4 animate-bounce" />
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl relative shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-xl"></div>
            
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <img
                    src={profile.profile_picture || "/default-avatar.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md transition-transform group-hover:scale-105"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute bottom-0 right-0 bg-primary-color text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fas fa-camera text-sm"></i>
                  </button>
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your Full Name"
                      className="text-xl font-semibold bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-color focus:border-transparent outline-none mb-2"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {profile.full_name}
                    </h2>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-address-card mr-2 text-primary-color"></i>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="mobile"
                        value={profile.mobile}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.mobile}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-user mr-2 text-primary-color"></i>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Birthday</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="birthday"
                        value={profile.birthday}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.birthday}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={profile.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">{profile.gender}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateProfile}
                    className="px-6 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Upload */}
      {isModalOpen && (
        <ProfilePictureUploadModal
          isOpen={isModalOpen}
          onClose={(newImageUrl) => {
            if (newImageUrl)
              setProfile((prev) => ({ ...prev, profile_picture: newImageUrl }));
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
