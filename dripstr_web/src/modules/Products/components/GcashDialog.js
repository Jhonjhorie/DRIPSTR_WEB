import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faX } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { supabase } from "../../../constants/supabase";

const GcashDialog = ({ onClose, order, total }) => {
  const [mascotR, setMascotR] = useState(false);
  const [image, setImage] = useState(null);

  const onConfirm = async () => {
    if (!image) {
      alert("Please provide proof of payment.");
      return;
    }

    if (image) {
      await order();
      setTimeout(() => {
        setMascotR(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="font-sans sm:w-full max-w-[60.40rem] h-[27rem] bg-slate-50 rounded-lg shadow-lg  mx-4">
        {mascotR ? (
          <div className="flex flex-col items-center justify-center h-full w-full p-6">
            <img
              src={require("@/assets/emote/success.png")}
              alt="No Images Available"
              className="object-contain animate-pulse drop-shadow-customViolet "
            />
            <span className="text-xl text-center mt-4">
              Proof of Payment Uploaded!
            </span>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full ">
            <div className="flex-col w-full md:w-80 relative items-center flex justify-center p-6">
              <img
                src={image ? image : require("@/assets/emote/success.png")}
                alt={"Proof of Payment"}
                className="w-full h-auto object-none drop-shadow-customViolet"
              />
            </div>
            <div className="flex flex-wrap h-full bg-slate-200 w-full p-6 pb-12 justify-between">
              <div className="flex flex-col justify-start h-full w-full ">
                <div className="flex justify-between items-start">
                  <div className="flex items-start ">
                    <p className="text-2xl text-slate-500 font-medium">
                      Gcash Payment
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
                  >
                    <FontAwesomeIcon icon={ faX} />
                  </button>
                </div>
                <h1 className="text-3xl font-semibold text-slate-900 mt-4">
                  Please Pay ₱{total || 0}
                </h1>

                <div className="mt-3">
                  <label className="block text-lg font-medium text-slate-700 mb-2">
                    Scan QR code in Gcash and Upload Proof of payment
                  </label>
                  <label class="form-control w-full max-w-xs">
                    <div class="label">
                      <span class="label-text">Upload Here</span>
                    </div>
                    <input
                      type="image"
                      class="file-input file-input-bordered w-full max-w-xs"
                    />
                    <div class="label">
                      <span class="label-text-alt">Please make sure it's visible</span>
                    </div>
                  </label>
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

export default GcashDialog;
