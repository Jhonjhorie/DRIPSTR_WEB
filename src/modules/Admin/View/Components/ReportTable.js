import React from "react";
import { useNavigate } from "react-router-dom";

const ReportTable = () => {
  const navigate = useNavigate();

  const tableData = Array.from({ length: 7 }, (_, i) => ({
    reportNo: `RPT-${i + 1}`,
    reportedUser: `User_${i + 1}`,
    reportedBy: `Admin_${i + 1}`,
    createdAt: `2024-12-${String(i + 1).padStart(2, "0")}`,
    category: "Spam",
    description: `This is a sample description for report ${i + 1}.`,
  }));

  const handleRowClick = (reportNo) => {
    navigate(`/admin/reports/${reportNo}`);
  };

  return (
    <div className="h-full overflow-x-auto">
      <table className="min-w-full border-collapse mt-6 hide overflow-hidden">
        <thead>
          <tr className="text-white border-b-4 border-violet-600">
            <th className="px-4 py-2 text-sm font-medium">REPORT NO.</th>
            <th className="px-4 py-2 text-sm font-medium">REPORTED USER</th>
            <th className="px-4 py-2 text-sm font-medium">REPORTED BY</th>
            <th className="px-4 py-2 text-sm font-medium">CREATED AT</th>
            <th className="px-4 py-2 text-sm font-medium">CATEGORY</th>
            <th className="px-4 py-2 text-sm font-medium">DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              key={row.reportNo}
              onClick={() => handleRowClick(row.reportNo)}
              className="h-20 border-b-2 border-violet-600 hover:scale-105 duration-500 cursor-pointer"
            >
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.reportNo}
              </td>
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.reportedUser}
              </td>
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.reportedBy}
              </td>
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.createdAt}
              </td>
              <td className="px-4 py-2 text-sm text-white text-center">
                <div className="bg-red-950 border-red-600 border-2 rounded-3xl">
                  {row.category}
                </div>
              </td>
              <td className="px-4 py-2 text-sm text-white">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
