import React, { useState, useEffect } from "react";
import Sidebar from "./Shared/Sidebar";
import AccountTable from "./Components/AccountTable";
import SearchSortFilter from "./Components/SearchSortFilter";
import { supabase } from "../../../constants/supabase";
import Pagination from "./Components/Pagination";

function Accounts() {
  const [fetchedAccounts, setFetchedAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Set to 7 items per page

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, full_name, email, mobile, address")
          .eq("isMerchant", false) // Where isMerchant is false
          .or("isArtist.eq.false,isArtist.is.null"); // Where isArtist is false OR null

        if (error) {
          console.error("Error fetching accounts:", error.message);
          throw error;
        }

        console.log("Fetched data:", data); // Debug: Check the returned data
        setFetchedAccounts(data || []);
      } catch (error) {
        console.error("Error in fetchAccounts:", error.message);
        setFetchedAccounts([]); // Set empty array on error
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
  const all = fetchedAccounts.length;

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="h-16 px-5">
          <SearchSortFilter />
        </div>

        <div className="flex-1 m-5 bg-slate-900 rounded-3xl p-6">
          <h1 className="text-white text-2xl font-bold mb-4">Accounts</h1>
          <p>Total Users: {all}</p> {/* Fixed <p1> to <p> */}
          <div className="w-full h-full overflow-auto">
            <AccountTable accounts={currentAccounts} /> {/* Pass paginated data */}
            <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Accounts;