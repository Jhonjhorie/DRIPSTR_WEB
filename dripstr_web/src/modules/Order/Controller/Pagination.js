import { useState } from 'react';

const Pagination = ({ totalPages, handlePageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const maxPageButtons = 10; // Maximum visible page buttons

  const handleFirst = () => {
    handlePageChange(1); // Call the page change handler
    setCurrentPage(1);   // Update the current page state
  };
  
  const handleLast = () => {
    handlePageChange(totalPages);
    setCurrentPage(totalPages);
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      handlePageChange(newPage);
      setCurrentPage(newPage);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      handlePageChange(newPage);
      setCurrentPage(newPage);
    }
  };
  

  // Calculate the start and end range of visible page numbers
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  // Call handlePageChange whenever currentPage changes
  const changePage = (page) => {
    setCurrentPage(page);
    handlePageChange(page);
  };

  return (
    <div className="flex justify-center mb-4 items-center space-x-2">
      {/* First Button */}
        <button
            onClick={handleFirst}
            className={`px-3 py-1 rounded bg-purple-500 text-white font-bold
                ${currentPage === 1 ? 'cursor-not-allowed opacity-75' : ''}`}
            disabled={currentPage === 1}
            >
            First
        </button>   

      {/* Previous Button */}
      <button
            onClick={handlePrevious}
            className={`px-3 py-1 rounded bg-purple-500 text-white font-bold
                ${currentPage === 1 ? 'cursor-not-allowed opacity-75' : ''}`}
            disabled={currentPage === 1}
            >
            Previous
      </button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === page
              ? 'bg-purple-500 text-white font-bold'
              : 'bg-slate-500 text-white font-bold'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={handleNext}
        className={`px-3 py-1 rounded bg-purple-500 text-white font-bold
            ${currentPage === totalPages ? 'cursor-not-allowed opacity-75' : ''}`}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      {/* Last Button */}
      <button
        onClick={handleLast}
        className={`px-3 py-1 rounded bg-purple-500 text-white font-bold
            ${currentPage === totalPages ? 'cursor-not-allowed opacity-75' : ''}`}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
