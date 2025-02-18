import React, { useState } from 'react';
import Sidebar from './Shared/Sidebar';

function Vouchers() {
    // State for controlling the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className='flex flex-row'>
                <Sidebar />
                <div className='bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-screen'>
                    <h1 className='font-bold text-white text-3xl mb-4'>Vouchers</h1>


                    <div className="flex items-end justify-end">
                        <button
                            className="text-white bg-blue-500 p-2 rounded-lg mb-4 hover:bg-slate-400"
                            onClick={openModal}
                        >
                            Add Voucher
                        </button>
                    </div>
                    {/* Modal for Add Voucher */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg w-1/3">
                                <h2 className="font-bold text-xl mb-4">Add Voucher</h2>
                                <div>
                                    <label className="font-semibold text-md mb-1 block">Voucher Name</label>
                                    <input
                                        type="text"
                                        name="vouchername"
                                        placeholder="Input Voucher Name"
                                        className="bg-gray-100 rounded-lg p-2 w-full text-black"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                                        Add Voucher
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Vouchers;
