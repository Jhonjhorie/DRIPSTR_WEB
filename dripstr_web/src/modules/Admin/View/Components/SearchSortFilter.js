import React, { useState } from "react";

const SearchSortFilter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const [filterBy, setFilterBy] = useState("All");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
  };

  return (
    <div className="flex flex-row items-center justify-between p-4">
      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <label htmlFor="search" className="text-white font-bold">
          Search Account:
        </label>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Enter account name/id"
          className="p-2 h-7 w-[13rem] rounded-xl border text-black border-gray-300 bg-white"
        />
      </div>

      {/* Sort and Filter Options */}
      <div className="flex items-center space-x-4">
        {/* Sort By Dropdown */}
        <div>
          <label htmlFor="sort" className="text-white font-bold">
            Sort By:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="text-white border border-gray-300 rounded-xl p-1 m-1"
          >
            <option value="Name">Name</option>
            <option value="Date">Date</option>
            <option value="Role">Role</option>
          </select>
        </div>

        {/* Filter Dropdown */}
        <div>
          <label htmlFor="filter" className="text-white font-bold">
            Filter:
          </label>
          <select
            id="filter"
            value={filterBy}
            onChange={handleFilterChange}
            className="text-white border border-gray-300 rounded-xl p-1 m-1"
          >
            <option value="All">All</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="designer">Designer</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchSortFilter;
