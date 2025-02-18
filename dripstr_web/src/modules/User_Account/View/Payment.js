import React from "react";
import Sidebar from "../components/Sidebar";

const Payments = () => {
  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full ">  
      <Sidebar />
      </div>

      {/* Main Content */}
      
      <div className="flex-1 p-4 px-9">
        <div></div>
        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-800 mb-6">Select Payment Method</h1>

        {/* Payment Methods Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Saved Payment Methods</h2>
            <button className="btn btn-primary btn-sm">+ Add Payment</button>
          </div>

          {/* Payment Items */}
          <div className="space-y-4">
            {/* Gcash */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
              <div>
                <p className="font-medium text-gray-800">Gcash</p>
                <p className="text-sm text-gray-600">+639*****2007</p>
              </div>
              <button className="btn btn-error btn-sm">Delete</button>
            </div>

            {/* Paymaya */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
              <div>
                <p className="font-medium text-gray-800">Paymaya</p>
                <p className="text-sm text-gray-600">63-9****92007</p>
              </div>
              <button className="btn btn-error btn-sm">Delete</button>
            </div>
          </div>
        </div>

        {/* Add Payment Method */}
        <div className="mt-6 text-center">
          <button className="btn btn-primary btn-lg w-full">+ Add New Payment Method</button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
