import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FromToCalendar = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [category, setCategory] = useState("");

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <div className="flex flex-row items-center space-x-4">
      {/* Start Date Picker */}
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="From"
          className="bg-white border border-gray-300 font-bold rounded-2xl p-1 m-1"
        />
      </div>

      {/* End Date Picker */}
      <div>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="To"
          className="bg-white border border-gray-300 font-bold rounded-2xl p-1 m-1"
        />
      </div>

      {/* Dropdown Category */}
      <div>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="bg-white border border-gray-300 font-bold rounded-2xl p-1 m-1"
        >
          <option value="All">All</option>
          <option value="Category1">Category 1</option>
          <option value="Category2">Category 2</option>
          <option value="Category3">Category 3</option>
        </select>
      </div>

      {/* Display Selected Dates and Category */}
      <div className="text-gray-800">
        <p>
          <strong>Selected Range:</strong>
        </p>
        <p>
          From: {startDate ? startDate.toLocaleDateString() : "N/A"} | To:{" "}
          {endDate ? endDate.toLocaleDateString() : "N/A"}
        </p>
        <p>
          <strong>Category:</strong> {category || "None Selected"}
        </p>
      </div>
    </div>
  );
};

export default FromToCalendar;
