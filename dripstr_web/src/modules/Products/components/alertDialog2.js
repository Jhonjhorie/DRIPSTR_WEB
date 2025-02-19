import React, { useEffect, useState } from "react";

const AlertDialog = ({ emote, text }) => {
  const [showAlert, setShowAlert] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
  
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

 
    const hideTimer = setTimeout(() => {
      setShowAlert(false);
    }, 3000); 

    // Cleanup timers
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {showAlert && (
        <div
          className={`w-[99%] z-50 justify-center items-center left-0 fixed bottom-10 flex flex-col max-h-[5rem] transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            role="alert"
            className="alert px-2 py-2 w-[80%] alert-success drop-shadow-lg bg-slate-50 border-b-8 border-primary-color z-50 shadow-lg text-secondary-color text-xl flex"
          >
            <img
              src={emote}
              alt="No Images Available"
              className="object-contain w-[80px] h-[80px] drop-shadow-customViolet"
            />
            <span>{text}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertDialog;