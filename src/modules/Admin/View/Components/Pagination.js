import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Function to handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="pagination-container flex justify-center items-center mt-4">
            <button
                className="px-4 py-2 mx-2 bg-gray-700 text-white rounded"
                onClick={() => handlePageChange(currentPage = 1)}
                disabled={currentPage === 1}
            >
                First
            </button>

            <button
                className="px-4 py-2 mx-2 bg-gray-700 text-white rounded"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>

            {/* Display Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    className={`px-4 py-2 mx-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-black' : 'bg-gray-200 text-gray-500'}`}
                    onClick={() => handlePageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}

            <button
                className="px-4 py-2 mx-2 bg-gray-700 text-white rounded"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
            <button
                className="px-4 py-2 mx-2 bg-gray-700 text-white rounded"
                onClick={() => handlePageChange(Math.ceil(totalItems / itemsPerPage))}
                disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
            >
                Last
            </button>


        </div>
    );
};

export default Pagination;
