import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faX } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../constants/supabase";

const ReportDialog = ({ item, onClose, type, accId }) => {
  const [mascotR, setMascotR] = useState(false);
  const [reason, setReason] = useState(null);
  const isProd = type === "product";
  const isShop = type === "shop";
  const isTicket = type === "admin";
  const [isOpen, setIsOpen] = useState(false);

  // Reasons for reporting a product
  const productReasons = [
    "Fake Product",
    "Fraudulent Seller",
    "Inappropriate Content",
    "Counterfeit Item",
    "Other",
  ];

  // Reasons for reporting a shop/merchant/vendor
  const shopReasons = [
    "Fake Shop",
    "Fraudulent Activity",
    "Selling Counterfeit Items",
    "Poor Customer Service",
    "Non-Delivery of Orders",
    "Misleading Advertising",
    "Inappropriate Behavior",
    "Other",
  ];

  // Reasons for reporting a ticket
  const ticketReasons = [
    "Technical Issue",
    "Billing Problem",
    "Feature Request",
    "Bug Report",
    "Other",
  ];

  const reasons = isProd ? productReasons : isShop ? shopReasons : isTicket ? ticketReasons : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.dropdown')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const onConfirm = async () => {
    if (!reason) {
      alert("Please select a reason for reporting.");
      return;
    }

    if (isProd) {
      try {
        const { data, error } = await supabase.from("reported_Chinese").insert([
          {
            prod_Id: item.id,
            acc_id: accId,
            prod_Name: item.item_Name,
            reason: reason,
            action: "Pending Preview",
          },
        ]);

        if (error) {
          console.error("Error reporting Item:", error.message);
          return { success: false, error: error.message };
        }

        setMascotR(true);

        setTimeout(() => {
          setMascotR(false);
          onClose();
        }, 3000);

        return { success: true, data };
      } catch (err) {
        console.error("Unexpected error:", err);
        return { success: false, error: err.message };
      }
    } else if (isShop) {
      try {
        const { data, error } = await supabase.from("reported_Calma").insert([
          {
            shop_Id: item.id,
            acc_id: accId,
            shop_Name: item.shop_name,
            reason: reason,
            action: "Pending Preview",
          },
        ]);

        if (error) {
          console.error("Error reporting Shop:", error.message);
          return { success: false, error: error.message };
        }

        setMascotR(true);

        setTimeout(() => {
          setMascotR(false);
          onClose();
        }, 3000);

        return { success: true, data };
      } catch (err) {
        console.error("Unexpected error:", err);
        return { success: false, error: err.message };
      }
    } else if (isTicket) {
      try {
        const { data, error } = await supabase.from("reported_Tickets").insert([
          {
            acc_id: accId,
            ticket_Title: "Ticket/Feedback",
            reason: reason,
            action: "Pending Review",
          },
        ]);

        if (error) {
          console.error("Error reporting Ticket:", error.message);
          return { success: false, error: error.message };
        }

        setMascotR(true);

        setTimeout(() => {
          setMascotR(false);
          onClose();
        }, 3000);

        return { success: true, data };
      } catch (err) {
        console.error("Unexpected error:", err);
        return { success: false, error: err.message };
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99] p-4 transition-opacity duration-200">
      <div className="font-sans w-full sm:w-full max-w-[60.40rem] max-h-[90vh] md:h-[60%] overflow-y-auto bg-slate-50 rounded-lg shadow-lg mx-auto">
        {mascotR ? (
          <div className="flex flex-col items-center justify-center h-full w-full p-6">
            <img
              src={require("@/assets/emote/success.png")}
              alt="No Images Available"
              className="object-contain animate-pulse drop-shadow-customViolet max-h-64"
            />
            <span className="text-xl text-center mt-4">
              {isProd
                ? "Item reported successfully, Thank you for your Feedback!"
                : isShop
                ? "Shop reported successfully, Thank you for your Feedback!"
                : "Ticket reported successfully, Thank you for your Feedback!"}
            </span>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            <div className="flex-col w-full md:w-80 relative items-center flex justify-center p-4 md:p-6">
              <img
                src={require("@/assets/emote/error.png")}
                alt={"Report"}
                className="w-full max-w-[200px] md:max-w-none h-auto object-contain drop-shadow-customViolet"
              />
              <p className="font-semibold font-sans text-center text-sm md:text-base mt-2">
                We apologize for the inconvenience. Rest assured, we will
                conduct a thorough investigation.
              </p>
            </div>
            <div className="flex flex-wrap h-full bg-slate-200 w-full p-4 md:p-6 pb-8 md:pb-12 justify-between">
              <div className="flex flex-col justify-start h-full w-full">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <p className="text-xl md:text-2xl text-slate-500 font-medium">
                      {isProd
                        ? "Report Product:"
                        : isShop
                        ? "Report Shop:"
                        : "Report Ticket:"}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
                  >
                    <FontAwesomeIcon icon={isProd ? faBackward : faX} />
                  </button>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mt-3 md:mt-4 break-words">
                  {isProd
                    ? item?.item_Name || "Unknown Product"
                    : isShop
                    ? item?.shop_name || "Unknown Shop"
                    : item?.title || "Unknown Ticket"}
                </h1>

                <div className="mt-3">
                  <label className="block text-base md:text-lg font-medium text-slate-700 mb-2">
                    Reason for Reporting
                  </label>
                  <div className="dropdown w-full relative">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-outline w-full text-left overflow-y-auto h-auto min-h-[40px] py-2"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {reason || "Select a reason"}
                    </div>
                    {isOpen && (
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full shadow max-h-52 overflow-y-auto absolute"
                        style={{ top: '100%', left: 0 }}
                      >
                        {reasons.map((r, index) => (
                          <li key={index}>
                            <a
                              className="py-3 px-4 hover:bg-slate-100 block"
                              onClick={() => {
                                setReason(r);
                                setIsOpen(false);
                              }}
                            >
                              {r}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end mt-6 md:mt-0">
                <button
                  onClick={onConfirm}
                  className="w-full md:w-auto h-10 px-6 font-semibold rounded-md bg-secondary-color border-primary-color border-b-2 border-r-2 text-white hover:text-primary-color hover:bg-slate-50 duration-300 transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDialog;