import React from "react";
import { Link } from "react-router-dom";

const LoginFirst = (item, action, onClose) => {
  
  return (
    <div className="flex flex-col  rounded-md justify-center -top-20 relative items-center py-4 modal-box  bg-slate-300 gap-4 z-40">
        <img
          src={require("@/assets/emote/success.png")}
          alt="No Images Available"
          className=" drop-shadow-customViolet "
        />
      <h1>Guests can only View Products, Please Log in or Sign Up First</h1>
      <button
        
        className="btn btn-sm btn-outline btn-primary  "
      >
        Log In
      </button>
    </div>
  );
};

export default LoginFirst;
