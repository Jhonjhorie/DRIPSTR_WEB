import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./login/Auth";

const LoginFirst = ({ onClose }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col rounded-md justify-center -top-20 relative items-center py-4 modal-box bg-slate-300 gap-4 z-40">
        <img
          src={require("@/assets/emote/success.png")}
          alt="No Images Available"
          className="drop-shadow-customViolet"
        />
        <h1>Guests can only View Products, Please Log in or Sign Up First</h1>
        <button
          onClick={handleLogin}
          className="btn btn-sm btn-outline btn-primary"
        >
          Log In
        </button>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
};

export default LoginFirst;