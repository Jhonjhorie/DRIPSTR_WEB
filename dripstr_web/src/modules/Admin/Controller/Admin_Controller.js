import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "../View/Dashboard";
import Reviews from "../View/Reviews";
import Reports from "../View/Reports";
import Accounts from "../View/Accounts";
import AccountDetail from "../View/Components/AccountDetail";
import Settings from "../View/Settings";
import ReportDetail from "../View/Components/ReportDetail";

const AdminController = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/accounts/:accountId" element={<AccountDetail />} />

      <Route path="/settings" element={<Settings />} />
      <Route path="/reports/:reportNo" element={<ReportDetail />} />
    </Routes>
  );
};

export default AdminController;
