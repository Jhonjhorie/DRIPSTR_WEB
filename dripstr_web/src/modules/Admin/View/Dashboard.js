import React from "react";
import TopItems from "./Components/TopItems";
import Sidebar from "./Shared/Sidebar";
import SalesStatistics from "./Components/SalesStatistics";

const topItems = Array(6).fill({ label: "Item", soldCount: "6" });

function Dashboard() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full h-screen flex-col">
        {/* Users Statistics */}
        <div className="grid grid-cols-2 2xl:grid-cols-4 2xl:w-5/6 2xl:m-1 gap-4">
          <div className="bg-slate-900 w-full 2xl:h-5/6 rounded-3xl m-4 p-2 flex">
            <div className="flex items-center h-full mx-6">
              <div className="w-14 h-14 bg-violet-400 rounded-3xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-10"
                  color="white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              </div>
              <div className="flex flex-col mx-4">
                <p className="text-violet-600 font-bold text-3xl">Customer</p>
                <p className="text-violet-600 font-bold">456</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 w-full 2xl:h-5/6 rounded-3xl m-4 p-2 flex">
            <div className="flex items-center h-full mx-6">
              <div className="w-14 h-14 bg-violet-400 rounded-3xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-10"
                  color="white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                  />
                </svg>
              </div>
              <div className="flex flex-col mx-4">
                <p className="text-violet-600 font-bold text-3xl">Merchant</p>
                <p className="text-violet-600 font-bold">456</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 w-full 2xl:h-5/6 rounded-3xl m-4 p-2 flex">
            <div className="flex items-center h-full mx-6">
              <div className="w-14 h-14 bg-violet-400 rounded-3xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-10"
                  color="white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </div>
              <div className="flex flex-col mx-4">
                <p className="text-violet-600 font-bold text-3xl">Designer</p>
                <p className="text-violet-600 font-bold">456</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 w-full 2xl:h-5/6 rounded-3xl m-4 p-2 flex">
            <div className="flex items-center h-full mx-6">
              <div className="w-14 h-14 bg-violet-400 rounded-3xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-10"
                  color="white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <div className="flex flex-col mx-4">
                <p className="text-violet-600 font-bold text-3xl">
                  Overall User
                </p>
                <p className="text-violet-600 font-bold">456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Statistics */}
        <div className="h-3/6 m-1 flex flex-col">
          <div className="bg-slate-900 2xl:w-4/6 sm:w-full h-full w-3/4 m-4 rounded-3xl p-2 cursor-default">
            <div className="flex h-full flex-col">
              <div className="h-1/6 w-full justify-between flex items-center">
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
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              {/* Add content here */}
              <div className="flex-grow text-white">
                <SalesStatistics />
              </div>
            </div>
          </div>
        </div>

        <div className="h-2/6 m-1 flex">
          <div className="bg-slate-900 sm:w-full 2xl:w-5/6 m-4 rounded-3xl p-2 flex flex-col">
            <p className="text-white text-2xl font-bold pl-2 pt-2 cursor-default">
              Top Sold Items
            </p>
            <div className="h-full flex flex-row cursor-pointer">
              {topItems.map((item, index) => (
                <TopItems
                  key={index}
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
