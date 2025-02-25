import React, { useState, useEffect } from "react";
import Sidebar from "./Shared/Sidebar";
import AccountTable from "./Components/AccountTable";
import SearchSortFilter from "./Components/SearchSortFilter";
import { supabase } from "../../../constants/supabase";

function Accounts() {
  const [fetchedAccounts, setFetchedAccounts] = useState([]);
  
  useEffect(() => {
    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, first_name, last_name, username, email, phone, address");

      if (error) {
        console.error("Error fetching accounts:", error.message);
      } else {
        setFetchedAccounts(data);
      }
    };

    fetchAccounts();
  }, []);

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
              {/* Pass fetched accounts data to AccountTable */}
              <AccountTable accounts={fetchedAccounts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accounts;
