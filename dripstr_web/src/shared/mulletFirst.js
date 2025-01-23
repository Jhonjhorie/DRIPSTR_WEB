import React from "react";
import { Link } from "react-router-dom";

const LoginFirst = () => {
  
  return (
    <div className="flex flex-col  rounded-md justify-center -top-20 relative items-center py-4 modal-box  bg-slate-300 gap-4 z-40">
      <h1>Guests can only View Products, Please Log in or Sign Up First</h1>
      <Link
        to="/login"
        className="btn btn-sm btn-outline btn-primary  "
      >
        Log In
      </Link>
    </div>
  );
};

export default LoginFirst;
