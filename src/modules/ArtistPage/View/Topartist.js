import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/constants/supabase";
import Topartistcom from "../Component/Topartistcom";




const Topartist = () => {






  return (
    <div className="h-full w-full  bg-slate-300  ">
      {/* Floating Button */}
      <h1 className="text-slate-900 pt-2 text-5xl text-center font-semibold iceland-regular">ARTIST LIST</h1>
      <div className="px-10 py-5">
        <Topartistcom></Topartistcom>
      </div>
    </div>
  );
};

export default Topartist;
