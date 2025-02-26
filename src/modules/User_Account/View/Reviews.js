import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const    Review = () => {
  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full ">  
      <Sidebar />
      </div>
      
    <div className="px-5">
    <div className="bg-slate-200 min-h-screen p-4">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-800 mb-6">My Reviews</h1>

      {/* To Be Reviewed Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700">To Be Reviewed</h2>
        <div className="bg-white p-4 mt-2 rounded-lg shadow">
          <p className="text-base text-gray-800">Purchased on</p>
          <p className="text-gray-700 mt-2 font-medium">
            HomeAce Aluminum Foil Butyl Waterproof Tape For roof leak Roof Sealant Wall Crack Pandikit Sa Bubong Tape
          </p>
          <p className="text-gray-600">Size: wide 10CM * long 5M</p>
          <button className="btn btn-primary mt-4">Write a Review</button>
        </div>
      </div>

      {/* History Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700">History (7)</h2>

        {/* Review Item 1 */}
        <div className="bg-white p-4 mt-2 rounded-lg shadow">
          <p className="text-base text-gray-800">Purchased on</p>
          <p className="text-gray-700 mt-2 font-medium">
            HomeAce Aluminum Foil Butyl Waterproof Tape For roof leak Roof Sealant Wall Crack Pandikit Sa Bubong Tape
          </p>
          <p className="text-gray-600">Size: wide 10CM * long 5M</p>
          <div className="mt-2">
            <p className="text-gray-800 font-bold">Delightful</p>
            <p className="text-gray-700">
              Easy to apply and use, Easy to apply and use, Easy to apply and use, Easy to apply and use, Easy to apply and
              use...
            </p>
            <p className="text-sm text-gray-600">Sold by HomeAce</p>
          </div>
        </div>

        {/* Review Item 2 */}
        <div className="bg-white p-4 mt-2 rounded-lg shadow">
          <p className="text-base text-gray-800">Purchased on</p>
          <p className="text-gray-700 mt-2 font-medium">
            Dell Laptop Charger 19.5V 3.34A 4.5mm Dell Inspiron Series
          </p>
          <div className="mt-2">
            <p className="text-gray-800 font-bold">Delightful</p>
            <p className="text-gray-700">
              It is good quality, stock that sent to me is new, and it's working totally fine, the seller is very good
            </p>
            <p className="text-sm text-gray-600">Sold by SOCUM & CCTV</p>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Review;
