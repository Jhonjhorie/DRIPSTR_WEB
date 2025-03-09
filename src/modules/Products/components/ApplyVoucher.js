import React, { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import AlertDialog from "./alertDialog2";

const ApplyVoucher = ({ profile, onClose, onSelectVouchers, price }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const fetchData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const { data: cusVoucherData, error: cusVoucherError } = await supabase
        .from("customer_vouchers")
        .select("*, vouch:voucher_id (id, voucher_name, voucher_type, discount, expiration, condition, isDeactivate)")
        .eq("acc_id", profile?.id)
        .eq("vouch.isDeactivate", false)
        .order("id", { ascending: false });
  
      if (cusVoucherError) throw cusVoucherError;
  
      const { data: voucherData, error: voucherError } = await supabase
        .from("vouchers")
        .select("*")
        .eq("isDeactivate", false)
        .not("id", "in", `(${cusVoucherData.map((cv) => cv.voucher_id).join(",")})`)
        .order("id", { ascending: false });
  
      if (voucherError) throw voucherError;
  
      const validVouchers = cusVoucherData.filter((cv) => {
        const expirationDate = new Date(cv.vouch.expiration);
        expirationDate.setHours(23, 59, 59, 999);
        return expirationDate >= today && cv.isClaim === true && cv.isUsed === false;
      });
      const validVouchers2 = voucherData.filter((cv) => {
        const expirationDate = new Date(cv.expiration);
        expirationDate.setHours(23, 59, 59, 999);
        return expirationDate >= today;
      });
  
      const combinedVouchers = [
        ...validVouchers.map((cv) => ({ ...cv.vouch, isClaimed: cv.isClaim })),
        ...validVouchers2.map((voucher) => ({ ...voucher, isClaimed: false })),
      ];
  
      const sortedVouchers = combinedVouchers.sort((a, b) => {
        if (a.isClaimed && !b.isClaimed) return -1;
        if (!a.isClaimed && b.isClaimed) return 1;
        return 0;
      });
  
      const defaultSelectedVouchers = validVouchers
        .map((cv) => ({ ...cv.vouch, isClaimed: true }))
        .filter((voucher) => price >= voucher.condition)
        .reduce((acc, voucher) => {
          if (!acc.some((v) => v.voucher_type === voucher.voucher_type)) {
            acc.push(voucher);
          }
          return acc;
        }, []);
  
      setVouchers(sortedVouchers);
      setSelectedVouchers(defaultSelectedVouchers);
  
      if (onSelectVouchers) {
        onSelectVouchers(defaultSelectedVouchers);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  
    if (profile?.id) {
      fetchData();
    }
  }, [profile]);
  

  const handleClaimVoucher = async (voucherId) => {
    if (!profile?.id) {
      alert("You must be logged in to claim a voucher.");
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

      await fetchData();
  
    } catch (error) {
      alert(`Error claiming voucher: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVoucher = (voucher) => {
    const isAlreadySelected = selectedVouchers.some(
      (v) => v.voucher_type === voucher.voucher_type && v.id === voucher.id
    );

    let updatedSelectedVouchers;

    if (isAlreadySelected) {
      updatedSelectedVouchers = selectedVouchers.filter(
        (v) => v.voucher_type !== voucher.voucher_type
      );
    } else {
      updatedSelectedVouchers = selectedVouchers.filter(
        (v) => v.voucher_type !== voucher.voucher_type
      );
      updatedSelectedVouchers = [...updatedSelectedVouchers, voucher];
    }

    if (price >= voucher.condition) {
      setSelectedVouchers(updatedSelectedVouchers);

      if (onSelectVouchers) {
        onSelectVouchers(updatedSelectedVouchers);
      }
    } else {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };

  if (loading) return <div>Loading vouchers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="fixed flex items-center justify-center w-[22rem] bg-opacity-50 z-50 font-[iceland]">
      {showAlert && (
        <div className="w-[95%] absolute -top-60 justify-center flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
          <AlertDialog
            emote={require("@/assets/emote/sad.png")}
            text={"The minimum purchase requirement for this voucher has not been met."}
          />
        </div>
      )}
      <div className="sm:w-full max-w-[32.40rem] h-[32rem] gap-2 bg-slate-50 p-4 rounded-lg shadow-lg flex flex-col overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <p className="text-2xl text-secondary-color font-medium">Vouchers</p>
          </div>
          <button
            onClick={onClose}
            className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
        <div className="overflow-y-auto custom-scrollbar">
          {vouchers.length > 0 ? vouchers.map((voucher) => {
            const isSelected = selectedVouchers.some(
              (v) => v.id === voucher.id
            );
            const isClaimed = voucher.isClaimed;
            const isProd = voucher.voucher_type == "Product" || voucher.voucher_type == "Products";

            return (
              <div
                key={voucher.id}
                className={`${
                  isSelected ? "bg-primary-color" : isClaimed ? "bg-secondary-color" : "bg-slate-50"
                } flex flex-col gap-2 items-center rounded-md drop-shadow-sm overflow-hidden p-2 ${
                  isProd ? "border-primary-color" : "border-green-700"
                } border-t-2 h-14 w-80 mb-2`}
              >
                <div
                  className={`absolute opacity-20 w-[60%] ${
                    isSelected ? "text-white" : isProd ? "text-primary-color" : "text-green-700"
                  } font-bold text-7xl left-14 -top-2 z-0 drop-shadow-customViolet`}
                >
                  <p>{voucher.voucher_type}</p>
                </div>
                <div
                  className={`flex justify-between gap-1 w-full items-center ${
                    isSelected ? "text-white" : isClaimed ? "text-slate-300" : "text-secondary-color"
                  } p-0`}
                >
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
                    {isClaimed ? (
                      <button
                        className={`p-1 border-b-2 border-base-200 w-8 font-bold rounded-md ${
                          isSelected ? "bg-white text-primary-color" : "bg-primary-color text-white"
                        }`}
                        onClick={() => handleSelectVoucher(voucher)}
                      >
                        {isSelected ? <FontAwesomeIcon icon={faX} /> : <FontAwesomeIcon icon={faCheck} />}
                      </button>
                    ) : (
                      <button
                        className="btn duration-300 transition-all text-slate-800 hover:bg-slate-200 hover:text-primary-color glass"
                        onClick={() => handleClaimVoucher(voucher.id)}
                      >
                        {loading ? "Loading..." : "Claim"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ); 
          }): <div className="font-semibold text-base items-center flex justify-center h-full p-5 flex-col w-full">
               <div className=" z-50 bg-slate-200 rounded-l-lg">
                      <img
                        src={require("@/assets/emote/hmmm.png")}
            
                        className={`h-full w-full  object-contain`}
                      />
                    </div>
            No Vouchers Available
            </div>}
        </div>
      </div>
    </div>
  );
};

export default ApplyVoucher;