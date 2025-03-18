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
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-[999] right-0  h-auto fixed transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={emote}
                alt="Alert"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
          >
            
            <span>{text}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertDialog;
