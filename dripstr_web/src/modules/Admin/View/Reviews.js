import React from "react";
import Sidebar from "./Shared/Sidebar";
import ReviewTable from "./Components/ReviewTable";

function Reviews() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full h-screen flex-col">
        <div className="bg-slate-900 h-5/6 m-5 mt-20 flex flex-col rounded-3xl p-2 cursor-default">
          <div className="h-full p-6">
            <h1 className="text-white text-2xl font-bold mb-4">Reviews</h1>
            <div className="h-full">
              <ReviewTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Reviews;
