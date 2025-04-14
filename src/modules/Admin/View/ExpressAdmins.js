import React, { useState, useEffect } from "react";
import { supabase } from "../../../constants/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Shared/Sidebar";

function ExpressAdmins() {
  const [fetchedAdmins, setFetchedAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("ascending");
  // Modal states for admin editing
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  // Form state
  const [adminUsername, setAdminUsername] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [adminBranch, setAdminBranch] = useState("");
  const [adminLvm, setAdminLvm] = useState("");
  const [number, setNumber] = useState("");
  const [branches, setBranches] = useState([]);
  const [adminSubBranch, setAdminSubBranch] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [adminGcash, setAdminGcash] = useState("");
  const [error, setError] = useState("");
  // State for image preview modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch admins from the database
  const fetchAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("express_admins")
      .select("id, username, password, gcash, number, branch, role, lvm, sub_branch");

    if (error) {
      console.error("❌ Error fetching express_admins:", error.message);
    } else {
      setFetchedAdmins(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = () => {
    setIsEditMode(false);
    setAdminUsername("");
    setAdminPassword("");
    setAdminRole("");
    setNumber("");
    setAdminBranch("");
    setAdminSubBranch("");
    setAdminLvm("");
    setSelectedAdminId(null);
    setAdminGcash("");
    setShowModal(true);
  };

  const handleEditAdmin = (admin) => {
    setIsEditMode(true);
    setSelectedAdminId(admin.id);
    setAdminUsername(admin.username);
    setAdminPassword(admin.password);
    setAdminRole(admin.role);
    setNumber(admin.number);
    setAdminBranch(admin.branch);
    setAdminSubBranch(admin.sub_branch);
    setAdminLvm(admin.lvm);
    setAdminGcash(admin.gcash);
    setShowModal(true);
  };

  // Handle image click
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  useEffect(() => {
    if (!adminLvm) return; // Don't fetch if LVM isn't selected

    const fetchBranches = async () => {
      const { data, error } = await supabase
        .from("express_admins")
        .select("branch")
        .eq("lvm", adminLvm);

      if (error) {
        console.error("Error fetching branches:", error);
      } else {
        const uniqueBranches = [...new Set(data.map((item) => item.branch))];

        setBranches(uniqueBranches);
        console.log(branches)
      }
    };

    fetchBranches();
  }, [adminLvm]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (isEditMode) {
      const { error } = await supabase
        .from("express_admins")
        .update({
          username: adminUsername,
          password: adminPassword,
          gcash: adminGcash,
          number: number,
          lvm: adminLvm,
          role: adminRole,
          branch: adminBranch,
          sub_branch: adminSubBranch,
        })
        .eq("id", selectedAdminId);

      if (error) {
        setError(error.message);
      } else {
        setShowModal(false);
        fetchAdmins();
      }
    } else {
      const { error } = await supabase.from("express_admins").insert([
        {
          username: adminUsername,
          password: adminPassword,
          gcash: adminGcash,
          number: number,
          lvm: adminLvm,
          role: adminRole,
          branch: adminBranch,
          sub_branch: adminSubBranch || adminBranch,
        },
      ]);

      if (error) {
        setError(error.message);
      } else {
        setShowModal(false);
        fetchAdmins();
      }
    }
    setLoading(false);
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    const { error } = await supabase
      .from("express_admins")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ Error deleting user:", error.message);
    } else {
      console.log("✅ User deleted successfully");
      setFetchedAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin.id !== id)
      );
    }
    setLoading(false);
  };

  const handleSortChange = (event) => {
    const selectedSortOrder = event.target.value;
    setSortOrder(selectedSortOrder);
    const sortedAdmins = [...fetchedAdmins].sort((a, b) => {
      return selectedSortOrder === "ascending" ? a.id - b.id : b.id - a.id;
    });
    setFetchedAdmins(sortedAdmins);
  };

  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-full">
        <h2 className="text-white text-2xl font-bold mb-4">
          DripStr Express Admins
        </h2>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={handleAddAdmin}
          >
            Add Express User
          </button>
          <div className="flex items-center space-x-2">
            <label
              htmlFor="sortOrder"
              className="text-lg font-medium text-white"
            >
              Sort by User ID:
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={handleSortChange}
              className="bg-blue-500 text-white font-bold rounded py-2"
            >
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
        </div>
        {loading ? (
          <p className="text-white text-center">Loading Express Users...</p>
        ) : (
          <table className="w-full text-white border border-gray-600 bg-gray-800">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 border border-gray-500">ID</th>
                <th className="p-2 border border-gray-500">Username</th>
                <th className="p-2 border border-gray-500">Password</th>
                <th className="p-2 border border-gray-500">Role</th>
                <th className="p-2 border border-gray-500">Island</th>
                <th className="p-2 border border-gray-500">Branch</th>
                <th className="p-2 border border-gray-500">Sub Branch</th>
                <th className="p-2 border border-gray-500">Gcash</th>
                <th className="p-2 border border-gray-500">Contact</th>
                <th className="p-2 border border-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchedAdmins.length > 0 ? (
                fetchedAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-600">
                    <td className="p-2 border border-gray-500 text-center align-middle">
                      {admin.id}
                    </td>
                    <td className="p-2 border border-gray-500 text-center align-middle">
                      {admin.username}
                    </td>
                    <td className="p-2 border border-gray-500 text-center align-middle">
                      {admin.password}
                    </td>
                    <td className="p-2 border border-gray-500 text-center align-middle">
                      {admin.role}
                    </td>
                    <td className="p-2 border border-gray-500 text-center align-middle">
                      {admin.lvm}
                    </td>
                    <td className="p-2 border border-gray-500 text-center align-middle">
                      {admin.branch}
                    </td>
                    <td className="p-2 border border-gray-500 text-center align-middle">
                      {admin.sub_branch}
                    </td>
                    <td className="p-2 border border-gray-500 text-center align-middle">
                      <p
                        className="text-blue-400 hover:text-blue-600 cursor-pointer"
                        onClick={() => handleImageClick(admin.gcash)}
                      >
                        Image
                      </p>
                    </td>
                    <td className="p-2 border border-gray-500 text-center align-middle">
                      {admin.number}
                    </td>
                    <td className="p-2 border border-gray-500">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          className="text-blue-400 hover:text-blue-600 flex items-center"
                          onClick={() => handleEditAdmin(admin)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          <span className="ml-2">Edit</span>
                        </button>
                        <button
                          className="text-red-400 hover:text-red-600 flex items-center"
                          onClick={() => handleDeleteAdmin(admin.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          <span className="ml-2">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-2">
                    No Express User found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Add/Edit Admin Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-slate-800 py-1 px-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-1 text-white">
                {isEditMode ? "Edit User" : "Add User"}
              </h2>

              {error && <p className="text-red-500">{error}</p>}

              <div className="space-y-1">
                <div>
                  <h1 className="text-white text-md font-bold mb-1">
                    Username
                  </h1>
                  <input
                    type="text"
                    placeholder="Username"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full p-2 border rounded mb-1"
                  />
                </div>
                <div>
                  <h1 className="text-white text-md font-bold mb-1">
                    Password
                  </h1>
                  <input
                    type="password"
                    placeholder="Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-1"
                  />
                </div>
                <div>
                  <h1 className="text-white text-md font-bold mb-1">Role</h1>
                  <select
                    value={adminRole}
                    onChange={(e) => setAdminRole(e.target.value)}
                    className="select select-bordered w-full p-2 mb-1"
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    <option value="Main Manager">Main Manager</option>
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Driver">Driver</option>
                  </select>
                </div>

                <div>
                  <h1 className="text-white text-md font-bold mb-1">
                    Main Island
                  </h1>
                  <select
                    value={adminLvm}
                    onChange={(e) => setAdminLvm(e.target.value)}
                    disabled={!adminRole}
                    className="select select-bordered w-full p-2 mb-1"
                  >
                    <option value="" disabled>
                      Select an Island
                    </option>
                    <option value="Luzon">Luzon</option>
                    <option value="Visayas">Visayas</option>
                    <option value="Mindanao">Mindanao</option>
                  </select>
                </div>{!adminLvm && (
                       <div>
                       <h1 className="text-white text-md font-bold mb-1">
                         Branch
                       </h1>
                       <input
                         type="text"
                         placeholder="Branch"
                         value={adminBranch}
                         disabled
                         onChange={(e) => setAdminBranch(e.target.value)}
                         className="w-full p-2 border rounded mb-1 text-black bg-white"
                       />
                     </div>
                )}
                {adminRole !== "Main Manager" && adminLvm && (
                  <div>
                    <h1 className="text-white text-md font-bold mb-1">
                      Branch
                    </h1>
                    <select
                      value={adminBranch}
                      onChange={(e) => setAdminBranch(e.target.value)}
                      className="select select-bordered w-full p-2 mb-1"
                    >
                      <option value="" disabled>
                        Select a Branch
                      </option>
                      {branches.length > 0 ? (
                        branches.map((branch, index) => (
                          <option key={index} value={branch}>
                            {branch}
                          </option>
                        ))
                      ) : (
                        <option disabled>No branches available</option>
                      )}
                    </select>
                  </div>
                )}
                {adminRole === "Main Manager" && adminLvm && (
                  <div>
                    <h1 className="text-white text-md font-bold mb-1">
                      Branch
                    </h1>
                    <input
                      type="text"
                      placeholder="Branch"
                      value={adminBranch}
                      onChange={(e) => setAdminBranch(e.target.value)}
                      className="w-full p-2 border rounded mb-1 text-black bg-white"
                    />
                  </div>
                )}
                {adminRole === "Branch Manager" && adminBranch != "" && (
                  <div>
                    <h1 className="text-white text-md font-bold mb-1">
                      Sub-Branch
                    </h1>
                    <input
                      type="text"
                      placeholder="Enter Sub-Branch"
                      value={adminSubBranch}
                      onChange={(e) => setAdminSubBranch(e.target.value)}
                      className="w-full p-2 border rounded mb-1 text-black bg-white"
                    />
                  </div>
                )}
                   <div>
                  <h1 className="text-white text-md font-bold mb-1">
                    Contact Number
                  </h1>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full p-2 border rounded mb-1 text-black bg-white"
                  />
                </div>
                <div>
                  <h1 className="text-white text-md font-bold mb-1">GCash</h1>
                  <div className="flex flex-col items-center">
                    <img
                      src={adminGcash || "https://via.placeholder.com/112"}
                      className="h-[7rem] w-[7rem] object-cover rounded cursor-pointer mb-1"
                      alt="GCash QR Code"
                      onClick={() =>
                        document.getElementById("gcashInput").click()
                      }
                    />
                    <input
                      id="gcashInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => setAdminGcash(e.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      onClick={() =>
                        document.getElementById("gcashInput").click()
                      }
                      className="text-blue-400 hover:text-blue-600 text-sm"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
             
              </div>

              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                >
                  {loading ? "Saving..." : isEditMode ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {showImageModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
              <img
                src={selectedImage}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded"
                alt="GCash QR Preview"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="bg-gray-400 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpressAdmins;
