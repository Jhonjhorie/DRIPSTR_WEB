import React from "react";
import Sidebar from "../components/Sidebar";

const Address = () => {
  return (
    <div className="p-4 bg-slate-200 min-h-screen flex flex-row">
      <Sidebar />

      <div className="px-5">
        <div className="p-4 bg-slate-200 min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">Address Book</h1>
          </div>

          {/* Address List */}
          <div className="mb-6 p-4 bg-slate-100 rounded-md shadow-md">
            {/* Default Address Actions */}
            <div className="flex justify-end items-center mb-4 text-sm">
              <button className="text-indigo-600 mr-4">
                Make default shipping address
              </button>
              <button className="text-indigo-600">
                Make default billing address
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse">
                {/* Table Header */}
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-bold">
                      Full Name
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-bold">
                      Address
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-bold">
                      Postcode
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-bold">
                      Phone Number
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 font-bold">
                      Default
                    </th>
                    <th className="px-4 py-2 text-center text-gray-700 font-bold">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Table Rows */}
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-gray-600">
                      Jhonjhorie Quiling
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      Mangga St. no. 16
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      Metro Manila ~ Quezon City - Payatas
                    </td>
                    <td className="px-4 py-2 text-gray-600">09563592007</td>
                    <td className="px-4 py-2 text-gray-600">
                      <div className="flex flex-col">
                        <span>Default Billing Address</span>
                        <span>Default Shipping Address</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center text-indigo-600 cursor-pointer">
                      Edit
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Add New Address Button */}
          <div className="flex justify-end">
            <button className="btn btn-primary w-60">+ ADD NEW ADDRESS</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
