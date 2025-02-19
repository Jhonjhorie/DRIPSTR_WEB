import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessAlert = () => {
  const [showAlert, setShowAlert] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
      navigate(`/`); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      {showAlert && (
        <div role="alert" className="alert alert-success drop-shadow-lg bg-slate-50 border-b-8 border-primary-color z-50 shadow-lg text-secondary-color text-2xl">
            <img
        src={require("@/assets/emote/success.png")}
          alt="No Images Available"
          className="object-none mb-2 mt-1 w-[180px] drop-shadow-customViolet h-[200px]"
        />
          <span>Your purchase has been confirmed!</span>
          
        </div>
      )}
    </>
  );
};

export default SuccessAlert;