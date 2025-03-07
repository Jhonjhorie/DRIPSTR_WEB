import React, { useState, useEffect } from 'react';
import Sidebar from './Shared/Sidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { supabase } from "../../../constants/supabase";
import { min } from 'date-fns';

function Vouchers() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const [voucherName, setVoucherName] = useState('');
    const [voucherType, setVoucherType] = useState('');
    const [minimum, setMinimum] = useState('');
    const [expiration, setExpiration] = useState('');
    const [discount, setDiscount] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch vouchers data from the table when the component loads
    useEffect(() => {
        const fetchVouchers = async () => {
            const { data, error } = await supabase
                .from('vouchers')
                .select('*');
            if (error) {
                console.error("Error fetching vouchers:", error);
            } else {
                setVouchers(data);
            }
        };

        fetchVouchers();
    }, []);

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to add a new voucher to the database
    const addVoucher = async () => {
        // Check if all fields are filled
        if (!voucherName || !voucherType || !discount) {
            alert('All fields are required');
            return;
        }

        const { data, error } = await supabase
            .from('vouchers')
            .insert([
                { voucher_name: voucherName, voucher_type: voucherType, discount: discount, condition: minimum, expiration: expiration }
            ])
            .select();  // Make sure we get the newly inserted data

        if (error) {
            console.error("Error adding voucher:", error);
            return;
        }

        if (data && data.length > 0) {
            // Successfully added the voucher, update the state
            setVouchers([...vouchers, data[0]]);

            // Close the modal and reset form fields
            closeModal();

            // Clear the form fields
            setVoucherName('');
            setVoucherType('');
            setDiscount('');
            setMinimum('');
            setExpiration('');
        } else {
            console.error('Voucher was not added correctly');
        }
    };

    const handleDeleteVoucher = async (id) => {
        if (!window.confirm("Are you sure you want to delete this voucher?")) return;

        setLoading(true);
        const { error } = await supabase
            .from("vouchers")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("❌ Error deleting voucher:", error.message);
        } else {
            console.log("✅ Voucher deleted successfully");

            // Re-fetch the vouchers after deletion
            await fetchVouchers();
        }
        setLoading(false);
    };

    const handleDeactivateVoucher = async (id) => {
        if (!window.confirm("Are you sure you want to deactivate this voucher?")) return;

        setLoading(true);
        const { error } = await supabase
            .from("vouchers")
            .update({ isDeactivate: true })
            .eq("id", id);

        if (error) {
            console.error("❌ Error deactivating voucher:", error.message);
        } else {
            console.log("✅ Voucher deactivated successfully");

            // Re-fetch the vouchers after deactivation
            await fetchVouchers();
        }
        setLoading(false);
    };

    const handleActivateVoucher = async (id) => {
        if (!window.confirm("Are you sure you want to activate this voucher?")) return;

        setLoading(true);
        const { error } = await supabase
            .from("vouchers")
            .update({ isDeactivate: false })
            .eq("id", id);

        if (error) {
            console.error("❌ Error activating voucher:", error.message);
        } else {
            console.log("✅ Voucher activated successfully");

            // Re-fetch the vouchers after activation
            await fetchVouchers();
        }
        setLoading(false);
    };

    // Re-fetch the vouchers data
    const fetchVouchers = async () => {
        const { data, error } = await supabase
            .from('vouchers')
            .select('*');
        if (error) {
            console.error("Error fetching vouchers:", error);
        } else {
            setVouchers(data);
        }
    };

    return (
        <>
            <div className='flex flex-row'>
                <div className='bg-slate-900 p-6 rounded-3xl shadow-lg w-full'>

                    <div className="flex items-end justify-end">
                        <button
                            className="text-white bg-blue-500 p-2 rounded-lg mb-4 hover:bg-slate-400"
                            onClick={openModal}
                        >
                            Add Voucher
                        </button>
                    </div>

                    {/* Vouchers Table */}
                    <table className="w-full text-white border border-gray-600 bg-gray-800 text-center">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Voucher Name</th>
                                <th className="py-2 px-4 border-b">Voucher Type</th>
                                <th className="py-2 px-4 border-b">Discount</th>
                                <th className="py-2 px-4 border-b">Minimum Order Total</th>
                                <th className="py-2 px-4 border-b">Expiration</th>
                                <th className="py-2 px-4 border-b">Available</th>
                                <th className="py-2 px-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{voucher.voucher_name}</td>
                                    <td className="py-2 px-4 border-b">{voucher.voucher_type}</td>
                                    <td className="py-2 px-4 border-b">₱{voucher.discount}.00</td>
                                    <td className="py-2 px-4 border-b">₱{voucher.condition}.00</td>
                                    <td className="py-2 px-4 border-b">{voucher.expiration}</td>
                                    <td className="py-2 px-4 border-b">{voucher.isDeactivate ? "No" : "Yes"}</td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex justify-center gap-3">
                                            {voucher.isDeactivate ? (
                                                <button
                                                    className="text-green-400 hover:text-green-600 underline cursor-pointer"
                                                    onClick={() => handleActivateVoucher(voucher.id)}
                                                >
                                                    Activate
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-yellow-400 hover:text-yellow-600 underline cursor-pointer"
                                                    onClick={() => handleDeactivateVoucher(voucher.id)}
                                                >
                                                    Deactivate
                                                </button>
                                            )}
                                            <button
                                                className="text-red-400 hover:text-red-600 flex items-center"
                                                onClick={() => handleDeleteVoucher(voucher.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                                <span className="ml-2">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                    {/* Modal for Add Voucher */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-slate-800 p-6 rounded-lg w-1/3">
                                <div className="flex flex-row justify-between">
                                    <h2 className="font-bold text-xl text-white mb-4">Add Voucher</h2>
                                    <h1 className='text-2xl font-bold text-white hover:text-black cursor-pointer' onClick={closeModal}>X</h1>
                                </div>
                                <div className='flex gap-2 flex-col'>
                                    <label className="font-semibold text-md mb-1 text-white block">Voucher Name</label>
                                    <input
                                        type="text"
                                        value={voucherName}
                                        onChange={(e) => setVoucherName(e.target.value)}
                                        placeholder="Input Voucher Name"
                                        className="bg-gray-100 rounded-lg p-2 w-full text-black"
                                    />
                                    <label className="font-semibold text-md mb-1 text-white block">Voucher Type</label>
                                    <select
                                        value={voucherType}
                                        onChange={(e) => setVoucherType(e.target.value)}
                                        className="bg-gray-100 rounded-lg p-2 w-full text-black"
                                    >
                                        <option value="" disabled>Select Voucher Type</option>
                                        <option value="Shipping">Shipping</option>
                                        <option value="Products">Products</option>
                                    </select>
                                    <label className="font-semibold text-md mb-1 text-white block">Voucher Discount/Off</label>
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        placeholder="Input Voucher Discount"
                                        className="bg-gray-100 rounded-lg p-2 w-full text-black"
                                    />
                                    <label className="font-semibold text-md mb-1 text-white block">Minimum Order Total</label>
                                    <input
                                        type="number"
                                        value={minimum}
                                        onChange={(e) => setMinimum(e.target.value)}
                                        placeholder="Input Voucher Discount"
                                        className="bg-gray-100 rounded-lg p-2 w-full text-black"
                                    />
                                    <label className="font-semibold text-md mb-1 text-white block">Expiration Date</label>
                                    <input
                                        type="date"
                                        value={expiration}
                                        onChange={(e) => setExpiration(e.target.value)}
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
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        onClick={addVoucher}
                                    >
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
