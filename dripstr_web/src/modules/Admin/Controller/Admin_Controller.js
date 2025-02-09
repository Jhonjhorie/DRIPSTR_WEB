import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "../View/Dashboard";
import Reviews from "../View/Reviews";
import Reports from "../View/Reports";
import Accounts from "../View/Accounts";
import AccountDetail from "../View/Components/AccountDetail";
import Settings from "../View/Settings";
import ReportDetail from "../View/Components/ReportDetail";
import Headline from "../View/Headline";
import Merchants from "../View/Merchants";
import Admin from "../View/Admin";

const AdminController = () => {
  return (
    <main className="bg-slate-800 p-4">
    <Routes>
   
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/accounts/:accountId" element={<AccountDetail />} />
      <Route path="/headline" element={<Headline />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/merchants" element={<Merchants />} />
      <Route path="/" element={<Admin />} />
      <Route path="/reports/:reportNo" element={<ReportDetail />} />

    </Routes>
    </main>
  );
};

export default AdminController;
