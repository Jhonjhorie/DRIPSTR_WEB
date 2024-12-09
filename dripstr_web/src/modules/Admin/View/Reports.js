import React from "react";
import Sidebar from "./Shared/Sidebar";
import ReportTable from "./Components/ReportTable";
import FromToCalendar from "./Components/FromToCalendar";
import { useNavigate } from "react-router-dom";

function Reports() {
  const navigate = useNavigate();

  const handleRowClick = (reportNo) => {
    navigate(`/admin/reports/${reportNo}`);
  };

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full h-screen flex-col">
        <div className="justify-end flex h-16">
          <FromToCalendar />
        </div>

        <div className="bg-slate-900 h-5/6 m-5 flex flex-col rounded-3xl p-2 cursor-default">
          <div className="h-full p-6">
            <h1 className="text-white text-2xl font-bold mb-4">Reports</h1>
            <div className="h-full">
              {/* Pass the row click handler to ReportTable */}
              <ReportTable onRowClick={handleRowClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
