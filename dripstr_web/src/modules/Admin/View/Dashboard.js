import React, { useState, useEffect } from "react";
import TopItems from "./Components/TopItems";
import Sidebar from "./Shared/Sidebar";
import SalesStatistics from "./Components/SalesStatistics";
import { supabase } from "../../../constants/supabase";

// Mock Data
const topItems = Array(6).fill({ label: "Item", soldCount: "6" });

// Icon Component
const Icon = ({ name }) => {
  const iconPaths = {
    "user-group": "M18 18.72a9.094 9.094 0 0 0 3.741-...",
    store: "M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a...",
    pencil: "M16.862 4.487 1.687-1.688a1.875 1.875 0 1...",
    users: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337...",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-10 h-10 text-white"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[name]} />
    </svg>
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
        .from('shop')
        .select('id', { count: 'exact' })  // Replace 'id' with any column in the table
        .eq('is_Approved', true);  // Filter where is_Approved is true

      if (error) throw error;
      
      return count;  // Return the count to use it later
    } catch (error) {
      console.error('Error fetching merchant count:', error.message);
      return 0;  // Return 0 in case of an error
    }
  };

  const fetchCustomerCount = async () => {
    try {
      const { count, error } = await supabase
        .from('accounts')
        .select('id', { count: 'exact' })  // Replace 'id' with any column in the table

      if (error) throw error;
      
      return count;  // Return the count to use it later
    } catch (error) {
      console.error('Error fetching customer count:', error.message);
      return 0;  // Return 0 in case of an error
    }
  };

  const fetchDesignerCount = async () => {
    try {
      const { count, error } = await supabase
        .from('artist')
        .select('id', { count: 'exact' })  // Replace 'id' with any column in the table

      if (error) throw error;
      
      return count;  // Return the count to use it later
    } catch (error) {
      console.error('Error fetching designer count:', error.message);
      return 0;  // Return 0 in case of an error
    }
  };





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
        { label: "Customer", count: customerCount, icon: "user-group" },
        { label: "Merchant", count: merchantCount, icon: "store" },
        { label: "Designer", count: designerCount, icon: "pencil" },
        { label: "Overall User", count: overall, icon: "users" },
      ];

      setStatisticsData(updatedStatisticsData);
    };

    updateStatisticsData();
  }, []);

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-4">
        <h1 className="text-white font-extrabold text-4xl mb-4">Dashboard</h1>
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
              <option value="" disabled hidden>Time Period</option>
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
          <div className="flex flex-wrap gap-4 mt-4">
            {topItems.map((item, index) => (
              <TopItems key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
