import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const adminToken = localStorage.getItem("adminToken");

  return adminToken ? <Outlet /> : <Navigate to="/express" />;
};

export default PrivateRoute;
