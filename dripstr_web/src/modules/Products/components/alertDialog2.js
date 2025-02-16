import React, { useEffect, useState } from "react";

const AddtoCartAlert = () => {
  const [showAlert, setShowAlert] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);

    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showAlert && (
        <div role="alert" className="alert alert-success drop-shadow-lg bg-slate-50 border-b-8 border-primary-color z-50 shadow-lg text-secondary-color text-2xl">
            <img
        src={require("@/assets/emote/success.png")}
          alt="No Images Available"
          className="object-none mb-2 mt-1 w-[180px] h-[200px] drop-shadow-customViolet"
        />
          <span>Added to Cart</span>
          
        </div>
      )}
    </>
  );
};

export default AddtoCartAlert;