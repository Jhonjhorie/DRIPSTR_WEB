import React from "react";

function AccountTable({ accounts }) {
  return (
    <table className="w-full text-white">
      <thead>
        <tr className="bg-gray-700">
          <th className="p-2">ID</th>
          <th className="p-2">Full Name</th>
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
            <td className="p-2">{account.full_name || 'No Name'}</td>
            <td className="p-2">{account.username || 'No Username'}</td>
            <td className="p-2">{account.email || 'No Email'}</td>
            <td className="p-2">{account.mobile || 'No Number'}</td>
            <td className="p-2">{account.address || 'No Address'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AccountTable;
