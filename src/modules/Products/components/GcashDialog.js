import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { supabase } from "../../../constants/supabase";

const GcashDialog = ({ onClose, order, total }) => {
  const [mascotR, setMascotR] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleImageChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader(); 
      reader.onloadend = () => {
        setImage(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const uploadImageToSupabase = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop(); 
    const fileName = `${Date.now()}.${fileExt}`; 
    const filePath = `proof_of_payment/${fileName}`; 

    const { data, error } = await supabase.storage
      .from("orders") 
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("orders")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl; 
  };

  const onConfirm = async () => {
    if (!image) {
      alert("Please provide proof of payment.");
      return;
    }

    setLoading(true); // Start loading

    const file = await fetch(image)
      .then((res) => res.blob())
      .then((blob) => new File([blob], "proof_of_payment.png", { type: "image/png" }));

    const imageUrl = await uploadImageToSupabase(file);

    if (imageUrl) {
      await order(imageUrl); 
      setMascotR(true); 
      setTimeout(() => {
        setMascotR(false);
      }, 3000);
    }

    setLoading(false); // Stop loading
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="sm:w-full max-w-[60.40rem] h-[35rem] font-[iceland]  md:mr-0 mr-8 pr-2 bg-slate-50 rounded-lg shadow-lg mx-4">
        {mascotR ? (
          <div className="flex flex-col items-center justify-center h-full w-full p-6">
            <img
              src={require("@/assets/emote/success.png")}
              alt="No Images Available"
              className="object-contain animate-pulse drop-shadow-customViolet"
            />
            <span className="text-xl text-center mt-4">
              Proof of Payment Uploaded!
            </span>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full overflow-y-auto custom-scrollbar rounded-lg ">
            <div className="flex-col w-full md:w-80 relative items-center flex justify-center">
              <p className="font-semibold text-2xl">Scan QR Code</p>
              <img
                src={require("@/assets/images/gcashQR.jpg")}
                alt={"Proof of Payment"}
                className="w-full object-contain"
              />
            </div>
            <div className="flex flex-wrap h-full bg-slate-200 w-full p-6 pb-12 justify-between">
              <div className="flex flex-col justify-start h-full w-full">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <p className="text-2xl text-slate-500 font-medium">
                      Gcash Payment
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
                <div className="flex gap-8 justify-between px-4">
                  <div>
                    <h1 className="text-3xl font-semibold text-slate-900 mt-4">
                      Please Pay ₱{total || 0}
                    </h1>

                    <div className="mt-3">
                      <label className="block text-lg font-medium text-slate-700 mb-2">
                        Scan QR code in Gcash and Upload Proof of payment
                      </label>
                      <div className="flex gap-2 items-start">
                        <label className="form-control w-full max-w-xs">
                          <div className="label">
                            <span className="label-text">Upload Here</span>
                          </div>
                          <input
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="file-input file-input-bordered w-full max-w-xs"
                          />
                          <div className="label">
                            <span className="label-text-alt">
                              Please make sure it's visible
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-2">
                  <p className="text-md font-semibold">Preview</p>
                  <div className="flex-col w-40 h-60 rounded-md bg-slate-50 border-t-2 drop-shadow-md border-primary-color relative items-center flex justify-center">
                 {image != null ? <img
                      src={
                        image != null
                          ? image
                          : require("@/assets/emote/mascot.png")
                      }
                      alt={"Preview"}
                      className="w-full h-full object-contain"
                    />:
                    <div className="h-full w-full flex p-4 items-center justify-center"
                    >
                      <p>
                      Please Upload Proof of Payment</p>
                    </div>
                    }
                    
                    
                  </div>
                </div>
              </div>
              </div>
              <div className="w-full flex justify-end">
                <button
                  onClick={onConfirm}
                  disabled={loading} // Disable button while loading
                  className="w-full md:w-auto h-10 px-6 font-semibold rounded-md bg-secondary-color border-primary-color border-b-2 border-r-2 text-white hover:text-primary-color hover:bg-slate-50 duration-300 transition-all"
                >
                  {loading ? "Uploading..." : "Submit"}
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