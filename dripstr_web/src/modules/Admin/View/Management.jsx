import React, { useState } from "react";
import Sidebar from "./Shared/Sidebar";
import Vouchers from "./Vouchers"; // Assuming Vouchers.jsx is in the same directory
import Headline from "./Headline"; // Assuming Headline.jsx is in the same directory
import Tickets from "./Tickets";


function Management() {
    const [activeTab, setActiveTab] = useState("vouchers"); // Default tab is "Vouchers"

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full h-screen flex flex-col items-center">
                <div className="bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-full">
                <h1 className="text-white font-bold text-3xl mb-4">E-commerce Management</h1>
                    {/* Tab Navigation */}
                    <div className="flex justify-start mb-6">
                        <button
                            className={`px-4 py-2 mr-4 rounded-lg text-white font-bold ${
                                activeTab === "vouchers"
                                    ? "bg-violet-600"
                                    : "bg-gray-600 hover:bg-gray-500"
                            }`}
                            onClick={() => handleTabChange("vouchers")}
                        >
                            Vouchers
                        </button>
                        <button
                            className={`px-4 py-2 mr-4 rounded-lg text-white font-bold ${
                                activeTab === "headline"
                                    ? "bg-violet-600"
                                    : "bg-gray-600 hover:bg-gray-500"
                            }`}
                            onClick={() => handleTabChange("headline")}
                        >
                            Headline
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-white font-bold ${
                                activeTab === "tickets"
                                    ? "bg-violet-600"
                                    : "bg-gray-600 hover:bg-gray-500"
                            }`}
                            onClick={() => handleTabChange("tickets")}
                        >
                            Tickets
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="w-full h-[calc(100%-4rem)] overflow-auto">
                        {activeTab === "vouchers" && <Vouchers />}
                        {activeTab === "headline" && <Headline />}
                        {activeTab === "tickets" && <Tickets />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Management;