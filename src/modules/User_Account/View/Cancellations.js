import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const Cancellation = () => {
  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full ">  
      <Sidebar />
      </div>
    <div className="px-5">
    <div className="p-4 bg-slate-200 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Cancellations</h1>

      {/* Cancellation Item 1 */}
      <div className="mb-6 bg-gray-100 rounded-lg shadow">
        <div className="flex justify-between p-4">
          <div>
            <p className="text-gray-700 font-semibold">Canceled on 2024-07-19 07:54:07</p>
            <p className="text-gray-600">Order #875767726071274</p>
          </div>
          <div className="text-center">
            <p className="text-gray-800 font-medium">Return to SOCUM & CCTV</p>
            <button className="text-indigo-600 mt-2">MORE DETAILS</button>
          </div>
        </div>
        <div className="divider my-0"></div>
        <div className="flex justify-between p-4">
          <div className="flex gap-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Product"
              className="w-20 h-20 rounded-lg"
            />
            <p className="flex-1">
              POCO X6 Pro 5G powered by Dimensity 8300-Ultra 8+256G/12+512G Global Version in 1
              year Warranty
            </p>
          </div>
          <p className="text-gray-600 text-center">Qty: 1</p>
          <p className="text-green-600 text-right font-semibold">Cancelled</p>
        </div>
      </div>

      {/* Cancellation Item 2 */}
      <div className="mb-6 bg-gray-100 rounded-lg shadow">
        <div className="flex justify-between p-4">
          <div>
            <p className="text-gray-700 font-semibold">Canceled on 2024-02-12 09:50:20</p>
            <p className="text-gray-600">Order #791586564871274</p>
          </div>
          <div className="text-center">
            <p className="text-gray-800 font-medium">Return to SOCUM & CCTV</p>
            <button className="text-indigo-600 mt-2">MORE DETAILS</button>
          </div>
        </div>
        <div className="divider my-0"></div>
        <div className="flex justify-between p-4">
          <div className="flex gap-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Product"
              className="w-20 h-20 rounded-lg"
            />
            <p className="flex-1">
              Winda Wrist Guard Sports Weightlifting Fitness Training Horizontal Bar Assist
              Wrapping Protector Fitness Wrist Guard
            </p>
          </div>
          <p className="text-gray-600 text-center">Qty: 1</p>
          <p className="text-green-600 text-right font-semibold">Refund issued</p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Cancellation;
