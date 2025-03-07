import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "../View/Dashboard";
import Reports from "../View/Reports";
import Accounts from "../View/Accounts";
import AccountDetail from "../View/Components/AccountDetail";
import ReportDetail from "../View/Components/ReportDetail";
import Headline from "../View/Headline";
import Merchants from "../View/Merchants";
import AdminLogin from "../View/AdminLogin";
import Admins from "../View/Admins";
import Cashout from "../View/Payout";
import Vouchers from "../View/Vouchers";
import PrivateRoute from "./PrivateRoute";
import Artists from "../View/Artists";
import Orders from "../View/Orders";
import Commisions from "../View/Commisions";
import Arts from "../View/Arts";
import Management from "../View/Management";
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
          <Route path="/merchants" element={<Merchants />} />
          <Route path="/reports/:reportNo" element={<ReportDetail />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/cashout" element={<Cashout />} />
          <Route path="/commisions" element={<Commisions />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/arts" element={<Arts />} />
          <Route path="/management" element={<Management />} />
        </Route>
      </Routes>
    </main>
  );
};

export default AdminController;
