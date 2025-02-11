import React, { useState, useEffect } from "react";
import { supabase } from "../../../constants/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons"
import Sidebar from "./Shared/Sidebar";

function Admins() {
    const [fetchedAdmins, setFetchedAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    
    // Form state
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [error, setError] = useState("");

    // Fetch admins from the database
    const fetchAdmins = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("admins")
            .select("id, username, password");

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
        setShowModal(true);
    };

    // Open modal for editing an admin
    const handleEditAdmin = (admin) => {
        setIsEditMode(true);
        setSelectedAdminId(admin.id);
        setAdminUsername(admin.username);
        setAdminPassword(admin.password);
        setShowModal(true);
    };

    // Handle submit (both add & edit)
    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        if (isEditMode) {
            // Update existing admin
            const { error } = await supabase
                .from("admins")
                .update({ username: adminUsername, password: adminPassword })
                .eq("id", selectedAdminId);

            if (error) {
                setError(error.message);
            } else {
                setShowModal(false);
                fetchAdmins(); // Refresh the admin list after editing
            }
        } else {
            // Add new admin
            const { error } = await supabase
                .from("admins")
                .insert([{ username: adminUsername, password: adminPassword }]);

            if (error) {
                setError(error.message);
            } else {
                setShowModal(false);
                fetchAdmins(); // Refresh the admin list after adding
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
            setFetchedAdmins((prevAdmins) => prevAdmins.filter(admin => admin.id !== id)); // Update state locally
        }
        setLoading(false);
    };
    

    return (
        <div className="flex flex-row h-screen">
            <Sidebar />
            <div className="bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-full">
                <h2 className="text-white text-2xl font-bold mb-4">Admins</h2>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" 
                    onClick={handleAddAdmin}
                >
                    Add Admin
                </button>

                {loading ? (
                    <p className="text-white text-center">Loading admins...</p>
                ) : (
                    <table className="w-full text-white border border-gray-600 bg-gray-800">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="p-2 border border-gray-500">Username</th>
                                <th className="p-2 border border-gray-500">Password</th>
                                <th className="p-2 border border-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetchedAdmins.length > 0 ? (
                                fetchedAdmins.map((admin) => (
                                    <tr key={admin.id} className="text-center border-b border-gray-600">
                                        <td className="p-2 border border-gray-500">{admin.username}</td>
                                        <td className="p-2 border border-gray-500">{admin.password}</td>
                                        <td className="p-2 border-gray-500 flex justify-center gap-4">
                                            <button 
                                                className="text-blue-400 hover:text-blue-600" 
                                                onClick={() => handleEditAdmin(admin)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                                <span className="ml-2">Edit</span>
                                            </button>
                                            <button className="text-red-400 hover:text-red-600" onClick={() => handleDeleteAdmin(admin.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                                <span className="ml-2">Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center p-2">No admins found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* Add/Edit Admin Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-slate-800 p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">
                                {isEditMode ? "Edit Admin" : "Add Admin"}
                            </h2>

                            {error && <p className="text-red-500">{error}</p>}

                            <input
                                type="text"
                                placeholder="Username"
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                            />

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
            </div>
        </div>
    );
}

export default Admins;
