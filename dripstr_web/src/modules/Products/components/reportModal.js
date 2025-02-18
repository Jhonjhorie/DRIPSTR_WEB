import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { supabase } from "../../../constants/supabase";

const ReportDialog = ({ item, onClose, type, accId }) => {
  const [mascotR, setMascotR] = useState(false);
  const [reason, setReason] = useState(null);

  const reasons = [
    "Fake Product",
    "Fraudulent Seller",
    "Inappropriate Content",
    "Counterfeit Item",
    "Other",
  ];

  const onConfirm = async () => {
    if (!reason) {
      alert("Please select a reason for reporting.");
      return;
    }

    if (type === "product") {
      try {
        const { data, error } = await supabase.from("reported_Chinese").insert([
          {
            prod_Id: item.item_id,
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
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="font-sans sm:w-full max-w-[60.40rem] h-[27rem] bg-slate-50 rounded-lg shadow-lg overflow-hidden mx-4">
        {mascotR ? (
          <div className="flex flex-col items-center justify-center h-full w-full p-6">
            <img
              src={require("@/assets/emote/success.png")}
              alt="No Images Available"
              className="object-contain animate-pulse drop-shadow-customViolet "
            />
            <span className="text-xl text-center mt-4">
              Item reported successfully, Thank you for your Feedback!
            </span>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full ">
            <div className="flex-col w-full md:w-80 relative items-center flex justify-center p-6">
              <img
                src={require("@/assets/emote/error.png")}
                alt={"Report"}
                className="w-full h-auto object-none "
              />
              <p className="font-semibold font-sans">
                We apologize for the inconvenience. Rest assured, we will
                conduct a thorough investigation
              </p>
            </div>
            <div className="flex flex-wrap h-full bg-slate-200 w-full p-6 pb-12 justify-between">
              <div className="flex flex-col justify-start h-full w-full ">
                <div className="flex justify-between items-start">
                  <div className="flex items-start ">
                    <p className="text-2xl text-slate-500 font-medium">
                      Report Product?
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
                  >
                    <FontAwesomeIcon icon={faBackward} />
                  </button>
                </div>
                <h1 className="text-3xl font-semibold text-slate-900 mt-4">
                  {item.item_Name}
                </h1>

                <div className="mt-3">
                  <label className="block text-lg font-medium text-slate-700 mb-2">
                    Reason for Reporting
                  </label>
                  <div className="dropdown dropdown-hover w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-outline w-full text-left"
                    >
                      {reason || "Select a reason"}
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full shadow "
                    >
                      {reasons.map((r, index) => (
                        <li key={index}>
                          <a onClick={() => setReason(r)}>{r}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end ">
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
