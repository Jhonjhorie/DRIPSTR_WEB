import React from "react";

function AccountTable({ accounts }) {
  return (
    <table className="w-full text-white">
      <thead>
        <tr className="bg-gray-700">
          <th className="p-2">ID</th>
          <th className="p-2">First Name</th>
          <th className="p-2">Last Name</th>
          <th className="p-2">Username</th>
          <th className="p-2">Email</th>
          <th className="p-2">Phone</th>
          <th className="p-2">Address</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) => (
          <tr key={account.id} className="text-center border-b border-gray-600">
            <td className="p-2">{account.id}</td>
            <td className="p-2">{account.first_name}</td>
            <td className="p-2">{account.last_name}</td>
            <td className="p-2">{account.username}</td>
            <td className="p-2">{account.email}</td>
            <td className="p-2">{account.phone}</td>
            <td className="p-2">{account.address}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AccountTable;
