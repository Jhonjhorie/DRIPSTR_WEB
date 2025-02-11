import React, { useState, useEffect } from "react";
import { supabase } from "../../../constants/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons"
import Sidebar from "./Shared/Sidebar";

function Admins() {
    const [fetchedAdmins, setFetchedAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmins = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("admins")
                .select("id, username, password");  // Ensure 'id' is included

            if (error) {
                console.error("❌ Error fetching admins:", error.message);
            } else {
                console.log("✅ Fetched admins:", data);  // Debugging
                setFetchedAdmins(data);
            }
            setLoading(false);
        };

        fetchAdmins();
    }, []);

    return (
        <div className="flex flex-row h-screen">
            <Sidebar />
            <div className="bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-full">
                <h2 className="text-white text-xl mb-4">Admins</h2>
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
                                        <td className="p-2 border border-gray-500 flex justify-center gap-2">
                                            <button className="text-blue-400 hover:text-blue-600">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="text-red-400 hover:text-red-600">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center p-2">No admins found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Admins;
