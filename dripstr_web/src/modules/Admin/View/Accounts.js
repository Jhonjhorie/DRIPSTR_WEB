import React from "react";
import Sidebar from "./Shared/Sidebar";
import AccountTable from "./Components/AccountTable";
import SearchSortFilter from "./Components/SearchSortFilter";

function Accounts() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full h-screen flex-col">
        <div className="h-16">
          <SearchSortFilter />
        </div>
        <div className="bg-slate-900 h-5/6 m-5 flex flex-col rounded-3xl p-2 cursor-default">
          <div className="h-full p-6">
            <h1 className="text-white text-2xl font-bold mb-4">Accounts</h1>
            <div className="h-full">
              <AccountTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Accounts;
