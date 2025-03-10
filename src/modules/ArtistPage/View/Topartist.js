import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/constants/supabase";
import Topartistcom from "../Component/Topartistcom";
import des from "../../../assets/emote/Group10.png";
import { useNavigate } from "react-router-dom";
const Topartist = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full  bg-slate-300  relative ">
      {/* Floating Button */}
      <div
        onClick={() => navigate("/arts/artists")}
      className="hover:scale-90 duration-300 cursor-pointer absolute top-5 left-5">
        <box-icon name="share" type="solid" size="40px"></box-icon>
      </div>
      
      <h1 className="text-slate-900 pt-2 text-5xl text-center font-semibold iceland-regular">
        ARTIST LIST
      </h1>
      <div className=" px-3 md:mb-0 mb-10 md:px-10 py-5">
        <Topartistcom></Topartistcom>
      </div>
      {/* <div className="transform-3d">
        <img className=" hidden md:block fixed bottom-0 blur-sm left-10 h-40" src={des} alt="design"/>
        <img className="hidden md:block fixed top-24 blur-sm right-2.5 h-40 transform rotate-180" src={des} alt="design"/>
      </div> */}
    </div>
  );
};

export default Topartist;
