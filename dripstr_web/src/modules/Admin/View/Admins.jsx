import React, { useState, useEffect } from "react";
import { supabase } from "../../../constants/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Shared/Sidebar";

function Admins() {
    const [fetchedAdmins, setFetchedAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('ascending');
    // Modal states for admin editing
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    // Form state
    const [adminUsername, setAdminUsername] = useState("");
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
            .from("admins")
            .select("id, username, password, gcash");

        if (error) {
            console.error("❌ Error fetching admins:", error.message);
        } else {
            console.log("✅ Fetched admins:", data);
            setFetchedAdmins(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // Open modal for adding an admin
    const handleAddAdmin = () => {
        setIsEditMode(false);
        setAdminUsername("");
        setAdminPassword("");
        setSelectedAdminId(null);
        setAdminGcash("");
        setShowModal(true);
    };

    // Open modal for editing an admin
    const handleEditAdmin = (admin) => {
        setIsEditMode(true);
        setSelectedAdminId(admin.id);
        setAdminUsername(admin.username);
        setAdminPassword(admin.password);
        setAdminGcash(admin.gcash);
        setShowModal(true);
    };

    // Handle image click
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    // Handle submit (both add & edit)
    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        if (isEditMode) {
            const { error } = await supabase
                .from("admins")
                .update({ username: adminUsername, password: adminPassword, gcash: adminGcash })
                .eq("id", selectedAdminId);

            if (error) {
                setError(error.message);
            } else {
                setShowModal(false);
                fetchAdmins();
            }
        } else {
            const { error } = await supabase
                .from("admins")
                .insert([{ username: adminUsername, password: adminPassword, gcash: adminGcash }]);

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
        if (!window.confirm("Are you sure you want to delete this admin?")) return;

        setLoading(true);
        const { error } = await supabase
            .from("admins")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("❌ Error deleting admin:", error.message);
        } else {
            console.log("✅ Admin deleted successfully");
            setFetchedAdmins((prevAdmins) => prevAdmins.filter(admin => admin.id !== id));
        }
        setLoading(false);
    };

    const handleSortChange = (event) => {
        const selectedSortOrder = event.target.value;
        setSortOrder(selectedSortOrder);
        const sortedAdmins = [...fetchedAdmins].sort((a, b) => {
            return selectedSortOrder === 'ascending' ? a.id - b.id : b.id - a.id;
        });
        setFetchedAdmins(sortedAdmins);
    };

    return (
        <div className="flex flex-row h-screen">
            <Sidebar />
            <div className="bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-full">
                <h2 className="text-white text-2xl font-bold mb-4">Admins</h2>
                <div className="flex justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                        onClick={handleAddAdmin}
                    >
                        Add Admin
                    </button>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="sortOrder" className="text-lg font-medium text-white">Sort by Admin ID:</label>
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
                    <p className="text-white text-center">Loading admins...</p>
                ) : (
                    <table className="w-full text-white border border-gray-600 bg-gray-800">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="p-2 border border-gray-500">ID</th>
                                <th className="p-2 border border-gray-500">Username</th>
                                <th className="p-2 border border-gray-500">Password</th>
                                <th className="p-2 border border-gray-500">Gcash</th>
                                <th className="p-2 border border-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetchedAdmins.length > 0 ? (
                                fetchedAdmins.map((admin) => (
                                    <tr key={admin.id} className="border-b border-gray-600">
                                        <td className="p-2 border border-gray-500 text-center align-middle">{admin.id}</td>
                                        <td className="p-2 border border-gray-500 text-center align-middle">{admin.username}</td>
                                        <td className="p-2 border border-gray-500 text-center align-middle">{admin.password}</td>
                                        <td className="p-2 border border-gray-500 text-center align-middle">
                                            <p 
                                                className="text-blue-400 hover:text-blue-600 cursor-pointer"
                                                onClick={() => handleImageClick(admin.gcash)}
                                            >
                                                Image
                                            </p>
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
                                    <td colSpan="5" className="text-center p-2">No admins found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* Add/Edit Admin Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4 text-white">
                                {isEditMode ? "Edit Admin" : "Add Admin"}
                            </h2>

                            {error && <p className="text-red-500">{error}</p>}
                            
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-white text-md font-bold mb-1">Username</h1>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={adminUsername}
                                        onChange={(e) => setAdminUsername(e.target.value)}
                                        className="w-full p-2 border rounded mb-2"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-white text-md font-bold mb-1">Password</h1>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        className="w-full p-2 border rounded mb-2"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-white text-md font-bold mb-1">GCash</h1>
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={adminGcash || 'https://via.placeholder.com/112'}
                                            className="h-[7rem] w-[7rem] object-cover rounded cursor-pointer mb-2"
                                            alt="GCash QR Code"
                                            onClick={() => document.getElementById('gcashInput').click()}
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
                                            onClick={() => document.getElementById('gcashInput').click()}
                                            className="text-blue-400 hover:text-blue-600 text-sm"
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
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

export default Admins;