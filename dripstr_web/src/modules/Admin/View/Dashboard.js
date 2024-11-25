import React from "react";
// import {
//   UserGroupIcon,
//   BuildingStorefrontIcon,
//   PencilIcon,
//   UsersIcon,
// } from "@heroicons/react/24/solid";
import StatCard from "./Components/StatCard";
import TopItems from "./Components/TopItems";
import Sidebar from "./Shared/Sidebar";

const statCards = [
  { icon: '', value: "63459", label: "Customer" },
  { icon: '', value: "69", label: "Merchant" },
  { icon: '', value: "69", label: "Designer" },
  { icon: '', value: "69", label: "Overall Users" },
];

const topItems = Array(6).fill({ label: "Item", soldCount: "6" });

function Dashboard() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full h-screen flex-col">
        {/* Users Statistics */}
        <div className="grid grid-cols-2 2xl:grid-cols-4 2xl:m-1 gap-1 2xl:gap-4">
          {statCards.map((stat, index) => (
            <StatCard
              key={index}
          
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>

        {/* Sales Statistics */}
        <div className="h-3/6 m-1 flex flex-col">
          <div className="bg-slate-900 2xl:w-4/6 sm:w-full h-full w-3/4 m-4 rounded-3xl p-2 cursor-default">
            <div className="flex h-full flex-col">
              <div className="h-1/6  w-full justify-between flex items-center">
                <p className="text-white text-2xl font-bold pl-2">
                  Sales Statistics
                </p>
                <select
                  className="bg-slate-900 rounded-xl text-violet-600 text-lg font-bold mr-5 cursor-pointer"
                  name="Time Period"
                  id="timePeriod"
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Time Period
                  </option>
                  <option className="bg-transparent" value="daily">
                    Daily
                  </option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        <div className="h-2/6  m-1 flex">
          <div className="bg-slate-900 sm:w-full 2xl:w-5/6 m-4 rounded-3xl p-2 flex flex-col">
            <p className="text-white text-2xl font-bold pl-2 pt-2 cursor-default">
              Top Sold Items
            </p>
            <div className="h-full flex flex-row cursor-pointer">
              {topItems.map((item, index) => (
                <TopItems
                  key={10}
                  label={item.label}
                  soldCount={item.soldCount}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
