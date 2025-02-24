import React, { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase"; 

const VoucherStream = ({ profile }) => {
  const [vouchers, setVouchers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [claimedVouchers, setClaimedVouchers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const { data: voucherData, error: voucherError } = await supabase
          .from("vouchers")
          .select("*")
          .order("id", { ascending: false });

        if (voucherError) throw voucherError;
        const { data: claimedData, error: claimedError } = await supabase
          .from("customer_vouchers")
          .select("voucher_id, isClaim, isUsed")
          .eq("acc_id", profile?.id);

        if (claimedError) throw claimedError;

        // Filter out vouchers that are claimed and used
        const validVouchers = voucherData.filter((voucher) => {
          const claimedVoucher = claimedData.find(
            (cv) => cv.voucher_id === voucher.id
          );
          return !claimedVoucher || !(claimedVoucher.isClaim && claimedVoucher.isUsed);
        });

        // Sort vouchers: claimed but not used at the end
        const sortedVouchers = validVouchers.sort((a, b) => {
          const aClaimed = claimedData.find((cv) => cv.voucher_id === a.id);
          const bClaimed = claimedData.find((cv) => cv.voucher_id === b.id);

          if (aClaimed?.isClaim && !aClaimed?.isUsed) return 1; // Move claimed but not used to the end
          if (bClaimed?.isClaim && !bClaimed?.isUsed) return -1;
          return 0;
        });

        setVouchers(sortedVouchers);
        setClaimedVouchers(claimedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) {
      fetchData();
    }
  }, [profile]);


  const handleClaimVoucher = async (voucherId) => {
    if (!profile?.id) {
      alert("You must be logged in to claim a voucher.");
      return;
    }

    
    const isAlreadyClaimed = claimedVouchers.some(
      (cv) => cv.voucher_id === voucherId && cv.isClaim
    );

    if (isAlreadyClaimed) {
      alert("You have already claimed this voucher.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("customer_vouchers")
        .insert([
          {
            acc_id: profile.id,
            voucher_id: voucherId,
            isClaim: true,
            isUsed: false,
          },
        ]);

      if (error) throw error;

     
      setLoading(true);
      const fetchData = async () => {
        const { data: voucherData, error: voucherError } = await supabase
          .from("vouchers")
          .select("*")
          .order("id", { ascending: false });

        if (voucherError) throw voucherError;

        const { data: claimedData, error: claimedError } = await supabase
          .from("customer_vouchers")
          .select("voucher_id, isClaim, isUsed")
          .eq("acc_id", profile.id);

        if (claimedError) throw claimedError;

        const validVouchers = voucherData.filter((voucher) => {
          const claimedVoucher = claimedData.find(
            (cv) => cv.voucher_id === voucher.id
          );
          return !claimedVoucher || !(claimedVoucher.isClaim && claimedVoucher.isUsed);
        });

        const sortedVouchers = validVouchers.sort((a, b) => {
          const aClaimed = claimedData.find((cv) => cv.voucher_id === a.id);
          const bClaimed = claimedData.find((cv) => cv.voucher_id === b.id);

          if (aClaimed?.isClaim && !aClaimed?.isUsed) return 1;
          if (bClaimed?.isClaim && !bClaimed?.isUsed) return -1;
          return 0;
        });

        setVouchers(sortedVouchers);
        setClaimedVouchers(claimedData);
      };

      fetchData();
      alert("Voucher claimed successfully!");
    } catch (error) {
      alert(`Error claiming voucher: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading vouchers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-[90%] rounded-md flex gap-2 text-secondary-color font-[iceland] relative overflow-x-auto custom-scrollbar">
      {vouchers.map((voucher) => {
        const isClaimed = claimedVouchers.some(
          (cv) => cv.voucher_id === voucher.id && cv.isClaim
        );
        const isProd = voucher.voucher_type == 'Product'

        return (
          <div
            key={voucher.id}
            className={`${isClaimed ? 'bg-secondary-color' : 'bg-slate-50'}  flex flex-none gap-2 items-center rounded-md drop-shadow-sm overflow-hidden p-2 ${isProd ? 'border-primary-color': 'border-green-700'} border-t-2 h-14 w-64 mb-2`}
          >
          
            <div className={`absolute opacity-20 w-[60%]  ${isProd ? 'text-primary-color ': 'text-green-700'} font-bold text-7xl left-14 -top-2 z-0 drop-shadow-customViolet`}>
              <p>{voucher.voucher_type}</p>
            </div>
            <div className={`flex justify-between gap-1 w-full items-center ${isClaimed ? 'text-slate-300' : 'text-secondary-color'} p-0`}>
              <div className="w-full flex flex-col justify-start">
                <h2 className="text-xl font-bold">{voucher.voucher_name}</h2>
                <p className="text-xs text-slate-500">
                  Exp: {voucher.expiration}
                </p>
              </div>
              <div className="flex flex-col w-[40%] items-end">
                <p className="text-xs text-slate-500">
                  Min: ₱{voucher.condition}
                </p>
                <h3 className="text-2xl font-bold">₱{voucher.discount}</h3>
              </div>
              <div className="justify-end z-50">
                {isClaimed ? <button className={`p-2 font-bold cursor-not-allowed rounded-md ${isProd ? 'bg-primary-color' :'bg-green-700' } text-white`}>Claimed</button>:<button
                  className={`btn duration-300 transition-all ${
                    isClaimed
                      ? "bg-gray-800 text-slate-50 cursor-not-allowed"
                      : "text-slate-800 hover:bg-slate-200 hover:text-primary-color glass"
                  }`}
                  onClick={() => handleClaimVoucher(voucher.id)}
                  disabled={isClaimed}
                >
                  {isClaimed ? "Claimed" : "Claim"}
                </button>}
                
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VoucherStream;