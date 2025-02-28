import React, { useState, useEffect } from "react";
import Sidebar from "./Shared/Sidebar";
import AccountTable from "./Components/AccountTable";
import SearchSortFilter from "./Components/SearchSortFilter";
import { supabase } from "../../../constants/supabase";
import Pagination from "./Components/Pagination";

function Accounts() {
  const [fetchedAccounts, setFetchedAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Set to 6 items per page

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, email, mobile, address");

      if (error) {
        console.error("Error fetching accounts:", error.message);
      } else {
        setFetchedAccounts(data || []);
      }
    };

    fetchAccounts();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAccounts = fetchedAccounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = fetchedAccounts.length;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="h-16 px-5">
          <SearchSortFilter />
        </div>
        <div className="flex-1 m-5 bg-slate-900 rounded-3xl p-6">
          <h1 className="text-white text-2xl font-bold mb-4">Accounts</h1>
          <div className="w-full h-full overflow-auto">
            <AccountTable accounts={currentAccounts} /> {/* Pass paginated data */}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Accounts;