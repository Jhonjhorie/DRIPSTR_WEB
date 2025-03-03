import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import logo from '../../../assets/logoBlack.png';
import logoName from '../../../assets/logoName.png';
import DateTime from '../Hooks/DateTime';
import successEmote from "../../../../src/assets/emote/success.png";
import { supabase } from "../../../constants/supabase";

function FormCommision() {
  const [records, setRecords] = useState([]);
  const [sData, setSdata] = useState([]);

  useEffect(() => {
    const fetchUserProfileAndShop = async () => {
      try {
        // Get current authenticated user
        const { data: userData, error: authError } =
          await supabase.auth.getUser();
        if (authError) {
          console.error("Auth Error:", authError.message);
          return;
        }

        const user = userData?.user;
        if (!user) {
          console.error("No user is signed in.");
          return;
        }

        // Fetch the shop owned by the current user
        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id")
          .eq("owner_Id", user.id);

        if (shopError) throw shopError;
        setSdata(shops)
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchUserProfileAndShop();
  }, []);
  const fetchMerchantCommissions = async () => {
    const { data, error } = await supabase.from("merchant_Commission")
    .select("*")
    .eq("status", "pending");

    if (error) {
      console.error("Error fetching merchant commissions:", error);
      return;
    }

    setRecords(data.filter((record) => record.status === "pending"));
  };
  useEffect(() => {
    fetchMerchantCommissions();
  }, []);
  //Refetch the commisions
  const handleAccept = async (recordId) => {
    const shopId = sData[0]?.id; 

    if (!shopId) {
      console.error("No shop ID found.");
      return;
    }

    const { error } = await supabase
      .from("merchant_Commission")
      .update({ merchantId: shopId, status: "taken" })
      .eq("id", recordId);

    if (error) {
      console.error("Error updating record:", error);
      return;
    }

    fetchMerchantCommissions(); 
  };

  return (
    <div>

      <div className="overflow-x-auto rounded-md border border-base-content/5 bg-base-200">
        <table className="table">
          {/* head */}
          <thead className='w-full bg-slate-800'>
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
              <td>         
                  {record.status || "Accept"}
              </td>
               <td>
                <button
                  onClick={() => handleAccept(record.id)}
                className="text-white hover:scale-95 duration-200 shadow-sm shadow-slate-800 p-1 bg-custom-purple glass rounded-md">
                  Accept
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>



    </div>
  );
}



export default FormCommision;
