import React, { useState, useEffect } from "react";
import TopItems from "./Components/TopItems"; // Ensure the path is correct
import Sidebar from "./Shared/Sidebar";
import SalesStatistics from "./Components/SalesStatistics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../../constants/supabase";
import { faPalette, faStore, faUser, faUsers, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";

// Icon Component
const Icon = ({ name }) => {
  const iconMap = {
    "user-group": faUser,
    store: faStore,
    pencil: faPalette,
    users: faUsers,
  };

  return (
    <FontAwesomeIcon icon={iconMap[name]} className="w-10 h-10 text-white" />
  );
};

// User Statistic Card Component
const UserStatisticCard = ({ label, count, icon }) => (
  <div className="bg-slate-900 w-full rounded-3xl p-4 flex items-center shadow-md">
    <div className="w-14 h-14 bg-violet-400 rounded-3xl flex items-center justify-center">
      <Icon name={icon} />
    </div>
    <div className="flex flex-col mx-4">
      <p className="text-violet-600 font-bold text-2xl">{label}</p>
      <p className="text-violet-600 font-bold">{count}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [merchantNum, setMerchantNum] = useState(0);
  const [custNum, setCustNum] = useState(0);
  const [designerNum, setDesignerNum] = useState(0);
  const [statisticsData, setStatisticsData] = useState([]);

  const fetchMerchantCount = async () => {
    try {
      const { count, error } = await supabase
        .from("shop")
        .select("id", { count: "exact" })
        .eq("is_Approved", true);

      if (error) throw error;
      return count;
    } catch (error) {
      console.error("Error fetching merchant count:", error.message);
      return 0;
    }
  };

  const fetchCustomerCount = async () => {
    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("isMerchant", false)
        .or("isArtist.eq.false,isArtist.is.null");

      if (error) throw error;
      return count;
    } catch (error) {
      console.error("Error fetching customer count:", error.message);
      return 0;
    }
  };

  const fetchDesignerCount = async () => {
    try {
      const { count, error } = await supabase
        .from("artist")
        .select("id", { count: "exact" });

      if (error) throw error;
      return count;
    } catch (error) {
      console.error("Error fetching designer count:", error.message);
      return 0;
    }
  };

  const username = localStorage.getItem("username");

  useEffect(() => {
    const updateStatisticsData = async () => {
      const merchantCount = await fetchMerchantCount();
      setMerchantNum(merchantCount);
      const customerCount = await fetchCustomerCount();
      setCustNum(customerCount);
      const designerCount = await fetchDesignerCount();
      setDesignerNum(designerCount);

      const overall = customerCount + merchantCount + designerCount;

      const updatedStatisticsData = [
        { label: `${customerCount === 1 ? "Customer" : "Customers"}`, count: customerCount, icon: "user-group" },
        { label: `${merchantCount === 1 ? "Merchant" : "Merchants"}`, count: merchantCount, icon: "store" },
        { label: `${designerCount === 1 ? "Artist" : "Artists"}`, count: designerCount, icon: "pencil" },
        { label: `${overall === 1 ? "Total User" : "Total Users"}`, count: overall, icon: "users" },
      ];

      setStatisticsData(updatedStatisticsData);
    };

    updateStatisticsData();
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-4">
        <div className="flex flex-row justify-between mb-4">
          <h1 className="text-white font-extrabold text-4xl mb-4">Dashboard</h1>
          <div className="flex flex-col items-end">
            <h1 className="text-white font-extrabold text-4xl mb-2">Welcome, {username}!</h1>
            <button
              onClick={handleLogout}
              className="items-end justify-end hover:text-blue-500 hover:underline text-lg text-white"
            >
              <FontAwesomeIcon icon={faRightFromBracket} /> Logout
            </button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statisticsData.map((stat, index) => (
            <UserStatisticCard key={index} {...stat} />
          ))}
        </div>

        {/* Sales Statistics */}
        <div className="bg-slate-900 w-full mt-6 p-4 rounded-3xl shadow-md">
          <div className="flex justify-between items-center">
            <p className="text-white text-2xl font-bold">Sales Statistics</p>
            <select className="bg-slate-900 rounded-xl text-violet-600 text-lg font-bold cursor-pointer">
              <option value="" disabled hidden>
                Time Period
              </option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="mt-4">
            <SalesStatistics />
          </div>
        </div>

        {/* Top Sold Items */}
        <div className="bg-slate-900 w-full mt-6 p-4 rounded-3xl shadow-md">
          <p className="text-white text-2xl font-bold">Top Sold Items</p>
          <div className="mt-4">
            <TopItems /> {/* Render TopItems component directly */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;