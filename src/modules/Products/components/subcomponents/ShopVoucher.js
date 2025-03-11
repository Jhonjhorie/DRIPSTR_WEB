import React, { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";
import AlertDialog from "../alertDialog2";

const ShopVoucherStream = ({ profile, shop }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimedVouchers, setClaimedVouchers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: claimed2, error: claimed2Error } = await supabase
          .from("customer_shop_vouchers")
          .select(
            "voucher_id, vouch:voucher_id (id, voucher_name, discount, expiration, condition, isDeactivate), merchant_Id, merch:merchant_Id(id, shop_name), isClaim, isUsed"
          )
          .eq("merchant_Id", shop.id)
          .eq("acc_id", profile?.id)
          .eq("isUsed", true)
          .eq("vouch.isDeactivate", false)
          .eq("isClaim", true);

        if (claimed2Error) throw claimed2Error;

        const idsToExclude =
          claimed2.length > 0
            ? `(${claimed2.map((cv) => cv.vouch_MID).join(",")})`
            : null;

        let { data: voucherData, error: voucherError } = await supabase
          .from("merchant_Vouchers")
          .select("*, merchant_Id, merch:merchant_Id(id, shop_name)")
          .eq("merchant_Id", shop.id)
          .eq("isDeactivate", false)
          .order("id", { ascending: false });

        if (idsToExclude) {
          voucherData = voucherData.filter(
            (voucher) => !claimed2.some((cv) => cv.voucher_id === voucher.id)
          );
        }

        if (voucherError) throw voucherError;

        const { data: claimedData, error: claimedError } = await supabase
          .from("customer_shop_vouchers")
          .select(
            "voucher_id, vouch:voucher_id (id, voucher_name, discount, expiration, condition, isDeactivate), merchant_Id, merch:merchant_Id(id, shop_name), isClaim, isUsed"
          )
          .eq("merchant_Id", shop.id)
          .eq("acc_id", profile?.id)
          .eq("isUsed", false)
          .eq("vouch.isDeactivate", false)
          .eq("isClaim", true);

        if (claimedError) throw claimedError;

        const validVouchers = voucherData.filter((voucher) => {
          const claimedVoucher = claimedData.find(
            (cv) => cv.vouch_MID === voucher.id
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
        console.log("voucher:" + vouchers);
        console.log("voucher2:" + claimedVouchers);
      }
    };

    if (profile?.id) {
      fetchData();
    }
  }, [profile, shop]);

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
        .from("customer_shop_vouchers")
        .insert([
          {
            acc_id: profile.id,
            voucher_id: voucherId,
            merchant_Id: shop.id,
            isClaim: true,
            isUsed: false,
          },
        ]);

      if (error) throw error;

      setLoading(true);
      const fetchData = async () => {
        const { data: voucherData, error: voucherError } = await supabase
          .from("merchant_Vouchers")
          .select("*, merch:merchant_Id(id, shop_name)")
          .eq("merch.id", shop.id)
          .eq("isDeactivate", false)
          .order("id", { ascending: false });

        if (voucherError) throw voucherError;

        const { data: claimedData, error: claimedError } = await supabase
          .from("customer_shop_vouchers")
          .select(
            "voucher_id, vouch:voucher_id (id, voucher_name, discount, expiration, condition, isDeactivate), merchant_Id, merch:merchant_Id(id, shop_name), isClaim, isUsed"
          )
          .eq("merchant_Id", shop.id)
          .eq("acc_id", profile?.id)
          .eq("isUsed", false)
          .eq("vouch.isDeactivate", false);

        if (claimedError) throw claimedError;

        const validVouchers = voucherData.filter((voucher) => {
          const claimedVoucher = claimedData.find(
            (cv) => cv.vouch_MID === voucher.id
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
    <div className="w-full lg:min-w-[28.25rem] flex-1 rounded-md mx-1 md:mx-5 flex gap-2 text-secondary-color font-[iceland] relative">
      <div className="absolute -top-[1.2rem] md:-top-[1.2rem] left-4 bg-stone-600 h-5 rounded-t-lg  items-center flex justify-end ">
        <p className=" text-[1rem] md:text-[1.2rem] text-white drop-shadow-md font-bold px-2 ">
          Vouchers
        </p>
      </div>
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
        className="absolute -left-5 sm:top-2.5 top-1.5 transform bg-slate-100 p-2 rounded-lg z-10"
      >
        &lt;
      </button>
      <div className="w-full mr-2.5 sm:mr-0 flex gap-1  bg-stone-600  rounded-lg p-0 h-[52px] md:h-[62px] justify-start items-center overflow-hidden">
        <div className="bg-slate-100 rounded-r-lg z-10">
          <p className="w-[5.5rem] text-xs px-2 h-8 md:h-10 items-center flex justify-end">
            Claim Now
          </p>
        </div>
        {vouchers.length > 0 ? (
          vouchers.map((voucher, index) => {
            const isClaimed = claimedVouchers.some(
              (cv) => cv.voucher_id === voucher.id && cv.isClaim
            );

            return (
              <div
                key={voucher.id}
                className={`${
                  isClaimed ? "bg-secondary-color" : "bg-slate-50"
                } flex flex-none gap-2 items-center rounded-lg drop-shadow-sm overflow-hidden p-2 
               border-primary-color
              border-t-2 h-12 md:h-14 w-64 md:w-64 transition-transform duration-300 z-20`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                <div
                  className={`absolute opacity-20 w-[60%] text-green-700
                font-bold text-5xl md:text-7xl left-14 -top-2 z-0 drop-shadow-customViolet`}
                >
                  <p>{voucher.merch?.shop_name || "Unknown Shop"}</p>
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
                        className={`p-1 md:p-2 font-bold cursor-not-allowed rounded-md bg-primary-color
                      text-white text-xs md:text-sm`}
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
          })
        ) : (
          <div className="flex items-center justify-center ml-[14vw] md:ml-[32vw] text-white ">
            {" "}
            <h1 className="text-center">No Voucher Available</h1>{" "}
          </div>
        )}
        <div className="bg-secondary-color text-white absolute right-0 top-2.5 z-10 rounded-l-lg">
          <p className="w-[5.85rem] text-xs md:text-sm px-2 h-8 md:h-10 flex items-center justify-start">
            Shop Now
          </p>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute -right-2 lg:-right-5 md:top-2.5 top-1.5  transform bg-slate-100 p-2 rounded-lg z-10"
      >
        &gt;
      </button>
    </div>
  );
};

export default ShopVoucherStream;
