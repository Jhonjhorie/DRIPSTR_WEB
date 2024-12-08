import React from "react";
import { useNavigate } from "react-router-dom";

const AccountTable = () => {
  const navigate = useNavigate();

  const tableData = Array.from({ length: 7 }, (_, i) => ({
    accountId: `ID-${i + 1}`,
    accountName: `Test-${i + 1}`,
    username: `User_${i + 1}`,
    email: `email${i + 1}`,
    joined: `2024-12-${String(i + 1).padStart(2, "0")}`,
    role: "Designer",
  }));

  const handleRowClick = (accountId) => {
    navigate(`/admin/accounts/${accountId}`);
  };

  return (
    <div className="h-full overflow-x-auto">
      <table className="min-w-full border-collapse mt-6 hide overflow-hidden">
        <thead>
          <tr className="text-white border-b-4 border-violet-600">
            <th className="px-4 py-2 text-sm font-medium">ID</th>
            <th className="px-4 py-2 text-sm font-medium">NAME</th>
            <th className="px-4 py-2 text-sm font-medium">USERNAME</th>
            <th className="px-4 py-2 text-sm font-medium">EMAIL</th>
            <th className="px-4 py-2 text-sm font-medium">JOINED</th>
            <th className="px-4 py-2 text-sm font-medium">ROLE</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr
              key={row.accountId}
              onClick={() => handleRowClick(row.accountId)}
              className="h-20 border-b-2 border-violet-600 hover:scale-105 duration-500 cursor-pointer"
            >
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.accountId}
              </td>
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.accountName}
              </td>
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.username}
              </td>
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.email}
              </td>
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.joined}
              </td>
              <td className="px-4 py-2 text-sm text-white text-center">
                {row.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;
