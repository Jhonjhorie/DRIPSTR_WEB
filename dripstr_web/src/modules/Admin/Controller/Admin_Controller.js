import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "../View/Dashboard";
import Reports from "../View/Reports";
import Accounts from "../View/Accounts";
import AccountDetail from "../View/Components/AccountDetail";
import Settings from "../View/Settings";
import ReportDetail from "../View/Components/ReportDetail";
import Headline from "../View/Headline";
import Merchants from "../View/Merchants";
import AdminLogin from "../View/AdminLogin";
import Admins from "../View/Admins";
import Payout from "../View/Payout";
import PrivateRoute from "./PrivateRoute";

const AdminController = () => {
  return (
    <main className="bg-slate-800 p-4">
      <Routes>
        {/* Public Route (Login) */}
        <Route path="/" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/accounts/:accountId" element={<AccountDetail />} />
          <Route path="/headline" element={<Headline />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/merchants" element={<Merchants />} />
          <Route path="/reports/:reportNo" element={<ReportDetail />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/payout" element={<Payout />} />
        </Route>
      </Routes>
    </main>
  );
};

export default AdminController;
