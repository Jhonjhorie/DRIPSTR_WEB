import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import logo from '../../../assets/logoBlack.png';
import logoName from '../../../assets/logoName.png';
import DateTime from '../Hooks/DateTime';
import successEmote from "../../../../src/assets/emote/success.png";
import { supabase } from "../../../constants/supabase";


function CommissionItem() {
    const [records, setRecords] = useState([]);
    const [sData, setSdata] = useState([]);
    const [shopId, setShopId] = useState(null);
    const [modalCon, openModalCon] = useState(false);
    const [showModalComplete, setShowModalComplete] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [selectedRecordName, setSelectedRecordName] = useState("");


    useEffect(() => {
        const fetchUserProfileAndShop = async () => {
            try {
                const { data: userData, error: authError } = await supabase.auth.getUser();
                if (authError) {
                    console.error("Auth Error:", authError.message);
                    return;
                }

                const user = userData?.user;
                if (!user) {
                    console.error("No user is signed in.");
                    return;
                }

                const { data: shops, error: shopError } = await supabase
                    .from("shop")
                    .select("id")
                    .eq("owner_Id", user.id)
                    .single();

                if (shopError) throw shopError;

                setShopId(shops?.id || null);
            } catch (error) {
                console.error("Error fetching shop data:", error.message);
            }
        };

        fetchUserProfileAndShop();
    }, []);

    const fetchMerchantCommissions = async () => {
        if (!shopId) return;

        const { data, error } = await supabase
            .from("merchant_Commission")
            .select("*")
            .eq("status", "taken")
            .eq("merchantId", shopId);

        if (error) {
            console.error("Error fetching merchant commissions:", error);
            return;
        }

        setRecords(data);
    };

    useEffect(() => {
        fetchMerchantCommissions();
    }, [shopId]);


    const handleAccept = async () => {
        if (!selectedRecordId) return;

        const { error } = await supabase
            .from("merchant_Commission")
            .update({ status: "taken" })
            .eq("id", selectedRecordId);

        if (error) {
            console.error("Error updating record:", error);
            return;
        }

        setShowModalComplete(false);
        fetchMerchantCommissions(); 
    };

    return (
        <div>

            <div className="overflow-x-auto rounded-md border border-base-content/5 bg-base-200">
                <table className="table">
                    {/* head */}
                    <thead className='w-full bg-custom-purple glass'>
                        <tr className='text-sm '>
                            <th></th>
                            <th className='text-white'>Name</th>
                            <th className='text-white'>Image</th>
                            <th className='text-white'>Description</th>
                            <th className='text-white'>Pricing</th>
                            <th className='text-white'>Status</th>
                            <th className='text-white'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='bg-slate-100 text-black'>
                        {records.map((record, index) => (
                            <tr key={record.id}>
                                <th>{index + 1}</th>
                                <td>{record.fullName}</td>
                                <td>
                                    <img
                                        src={record.image || successEmote}
                                        className="shadow-md shadow-slate-400 bg-slate-100 h-12 w-12 object-cover rounded-md"
                                        sizes="100%"
                                        alt="Merchant"
                                    />
                                </td>
                                <td>{record.description}</td>
                                <td>{record.pricing}</td>
                                <td>{record.status || "Accept"}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setShowModalComplete(true);
                                            setSelectedRecordId(record.id);
                                            setSelectedRecordName(record.fullName);
                                        }}
                                        className="text-white hover:scale-95 duration-200 shadow-sm shadow-slate-800 p-1 bg-custom-purple glass rounded-md"
                                    >
                                        Completed?
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {showModalComplete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-md shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">
                            Are you sure you want to accept{" "}
                            <span className="font-bold text-primary-color">
                                {selectedRecordName}
                            </span>
                            ?
                        </h2>
                        <div className="flex w-full justify-between">
                            <button
                                onClick={() => setShowModalComplete(false)}
                                className="mt-4 p-2 px-4 hover:bg-red-700 duration-300 bg-red-500 text-white rounded-md"
                            >
                                No
                            </button>
                            <button
                                onClick={handleAccept}
                                className="mt-4 p-2 px-4 hover:bg-green-700 duration-300 bg-green-500 text-white rounded-md"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



export default CommissionItem;