import React, { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";
import AlertDialog from "../../Products/components/alertDialog2";

const VoucherStream = ({ profile }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimedVouchers, setClaimedVouchers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { data: claimed2, error: claimed2Error } = await supabase
          .from("customer_vouchers")
          .select("voucher_id, isClaim, isUsed")
          .eq("acc_id", profile?.id)
          .eq("isUsed", true)
          .eq("isClaim", true);

        if (claimed2Error) throw claimed2Error;

        const { data: voucherData, error: voucherError } = await supabase
          .from("vouchers")
          .select("*")
          .not("id", "in", `(${claimed2.map((cv) => cv.voucher_id).join(",")})`)
          .order("id", { ascending: false });

        if (voucherError) throw voucherError;

        const { data: claimedData, error: claimedError } = await supabase
          .from("customer_vouchers")
          .select("voucher_id, isClaim, isUsed")
          .eq("acc_id", profile?.id)
          .eq("isUsed", false)
          .eq("isClaim", true);

        if (claimedError) throw claimedError;

        const validVouchers = voucherData.filter((voucher) => {
          const expirationDate = new Date(voucher.expiration);
          expirationDate.setHours(23, 59, 59, 999);

          const claimedVoucher = claimedData.find(
            (cv) => cv.voucher_id === voucher.id
          );

          return (
            expirationDate >= today &&
            (!claimedVoucher ||
              !(claimedVoucher.isClaim && claimedVoucher.isUsed))
          );
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
      const { data, error } = await supabase.from("customer_vouchers").insert([
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
          return (
            !claimedVoucher ||
            !(claimedVoucher.isClaim && claimedVoucher.isUsed)
          );
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
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      alert(`Error claiming voucher: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vouchers.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + vouchers.length) % vouchers.length
    );
  };

  if (loading) return <div>Loading vouchers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full md:w-[65%] lg:w-[42%] flex-1 rounded-md mx-2 md:mx-5 flex gap-2 text-secondary-color font-[iceland] relative">
      {showAlert && (
        <div className="w-[95%] absolute -top-60 justify-center flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
          <AlertDialog
            emote={require("@/assets/emote/success.png")}
            text={
              "Voucher claimed successfully! Please use it before the expiration date."
            }
          />
        </div>
      )}
      <button
        onClick={handlePrev}
        className="absolute -left-5 sm:top-2.5 top-1.5 transform bg-slate-200 p-2 rounded-lg z-10"
      >
        &lt;
      </button>
      <div className="w-full flex gap-1 bg-stone-900 bg-opacity-50 rounded-lg p-0 h-[52px] md:h-[62px] justify-start items-center overflow-hidden">
        <div className="bg-slate-100 rounded-r-lg">
          <p className="w-[6.25rem] md:w-[6rem] lg:w-[7rem] text-xs px-2 h-8 md:h-10 items-center flex justify-end">
            Claim Vouchers
          </p>
        </div>
        {vouchers.map((voucher, index) => {
          const isClaimed = claimedVouchers.some(
            (cv) => cv.voucher_id === voucher.id && cv.isClaim
          );
          const isProd = voucher.voucher_type === "Product";

          return (
            <div
              key={voucher.id}
              className={`${
                isClaimed ? "bg-secondary-color" : "bg-slate-50"
              } flex flex-none gap-2 items-center rounded-lg drop-shadow-sm overflow-hidden p-2 ${
                isProd ? "border-primary-color" : "border-green-700"
              } border-t-2 h-12 md:h-14 w-64 md:w-64 transition-transform duration-300 z-20`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              <div
                className={`absolute opacity-20 w-[60%] ${
                  isProd ? "text-primary-color" : "text-green-700"
                } font-bold text-5xl md:text-7xl left-14 -top-2 z-0 drop-shadow-customViolet`}
              >
                <p>{voucher.voucher_type}</p>
              </div>
              <div
                className={`flex justify-between gap-1 w-full items-center ${
                  isClaimed ? "text-slate-300" : "text-secondary-color"
                } p-0`}
              >
                <div className="w-full flex flex-col justify-start">
                  <h2 className="text-lg md:text-xl font-bold">
                    {voucher.voucher_name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Exp: {voucher.expiration}
                  </p>
                </div>
                <div className="flex flex-col w-[50%] items-end">
                  <p className="text-[0.65rem] md:text-xs text-slate-500">
                    Min: ₱{voucher.condition}
                  </p>
                  <h3 className="text-lg md:text-2xl font-bold">
                    ₱{voucher.discount}
                  </h3>
                </div>
                <div className="justify-end z-50">
                  {isClaimed ? (
                    <button
                      className={`p-1 md:p-2 font-bold cursor-not-allowed rounded-md ${
                        isProd ? "bg-primary-color" : "bg-green-700"
                      } text-white text-xs md:text-sm`}
                    >
                      Claimed
                    </button>
                  ) : (
                    <button
                      className={`btn duration-300 transition-all ${
                        isClaimed
                          ? "bg-gray-800 text-slate-50 cursor-not-allowed"
                          : "text-slate-800 hover:bg-slate-200 hover:text-primary-color glass"
                      } text-xs md:text-sm`}
                      onClick={() => handleClaimVoucher(voucher.id)}
                      disabled={isClaimed}
                    >
                      {isClaimed ? "Claimed" : "Claim"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="bg-secondary-color text-white absolute right-0.5 top-2.5 rounded-l-lg">
          <p className="w-[6.25rem] md:w-[6rem] lg:w-[7rem] text-xs md:text-sm px-2 h-8 md:h-10 flex items-center justify-start">
            Start Shopping
          </p>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute -right-5 sm:top-2.5 top-1.5  transform bg-slate-200 p-2 rounded-lg z-10"
      >
        &gt;
      </button>
    </div>
  );
};

export default VoucherStream;