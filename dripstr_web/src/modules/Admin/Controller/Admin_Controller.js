import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "../View/Dashboard";
import Reviews from "../View/Reviews";
import Reports from "../View/Reports";
import Returns from "../View/Returns";
import Settings from "../View/Settings";

const AdminController = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminController;
