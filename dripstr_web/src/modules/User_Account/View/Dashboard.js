import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const Account = () => {
  return (
    <div className="p-4 bg-slate-200 min-h-screen flex flex-row">

    <Sidebar />
    <div className="p-4 px-9">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Manage My Account</h1>
      </div>

      {/* Profile Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Personal Profile */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Personal Profile</h2>
            <Link to="/account/edit" className="text-indigo-600">
              Edit Profile
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Avatar"
              className="w-20 h-20 rounded-full bg-gray-300"
            />
            <div>
              <p className="text-gray-600">Behnigno Ahuilar</p>
              <p className="text-gray-600">Beh@example.com</p>
            </div>
          </div>
          <div className="mt-4 text-right">
            <button className="btn btn-primary">Edit Avatar</button>
          </div>
        </div>

        {/* Address Book Section */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Address Book</h2>
            <Link to="/account/address/edit" className="text-indigo-600">
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-600">Default Shipping Address</h3>
              <p className="mt-2">Jhonjhorie Quiling</p>
              <p className="text-gray-600">Mangga St. no. 16</p>
              <p className="text-gray-600">Metro Manila - Quezon City - Payatas</p>
              <p className="text-gray-600">09563592007</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600">Default Billing Address</h3>
              <p className="mt-2">Jhonjhorie Quiling</p>
              <p className="text-gray-600">Mangga St. no. 16</p>
              <p className="text-gray-600">Metro Manila - Quezon City - Payatas</p>
              <p className="text-gray-600">(+63) 09563592007</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="table table-auto w-full">
            <thead>
              <tr className="bg-gray-200">
                <th>Order #</th>
                <th>Placed On</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover">
                <td>12345</td>
                <td>2024-10-30</td>
                <td>
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Item"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td>$50.00</td>
              </tr>
              <tr className="hover">
                <td>67890</td>
                <td>2024-11-01</td>
                <td>
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Item"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td>$75.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Account;
