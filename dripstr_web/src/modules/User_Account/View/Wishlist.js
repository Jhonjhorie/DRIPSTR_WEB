import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const    Wishlist = () => {
  return (
    <div className="p-4 bg-slate-200 min-h-screen flex flex-row">

    <Sidebar />
    <div className="px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
      </div>

      {/* Profile Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6"> 
    
      </div>
    </div>
    </div>
  );
};

export default Wishlist;
