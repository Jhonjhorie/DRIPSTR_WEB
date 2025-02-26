import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../../../assets/car.jpg";
import { supabase } from "../../../constants/supabase";


function ArtistSB() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [artistData, setArtistData] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchUserProfileAndArt = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (user) {
        console.log("Current user:", user);

        const { data: artists, error: artistError } = await supabase
          .from("artist")
          .select("artist_Name, id, artist_Bio, art_Type, artist_Image")
          .eq("owner_Id", user.id);

        if (artistError) {
          throw artistError;
        }

        if (artists && artists.length > 0) {
          const artist = artists[0];
          setArtistData(artist);
          setSelectedArtistId(artist.id);
          console.log("Artist Name:", artist.artist_Name);
          console.log("Artist ID:", artist.id);

        } else {
          console.log("No artist page found for the current user.");
          setError("No artist page found for the current user.");
        }
      } else {
        console.log("No user is signed in.");
        setError("No user is signed in.");
      }
    } catch (error) {
      console.error("Error fetching user/shop data:", error.message);
      setError("An error occurred while fetching user/shop data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProfileAndArt();
  }, []); // Run once on mount




  return (
    <div className="relative flex  md:mr-0" ref={navbarRef}>


      {/* Navbar */}
      <button
        className="fixed w-12 h-12 right-3 z-10 bg-custom-purple  glass text-white rounded-md m-2 shadow-lg"
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-slate-200 shadow-lg transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className=" mt-16  md:mt-24 p-2">
          <div className="h-24 w-full rounded-md bg-slate-900">
            <div className="bg-slate-100 h-28 absolute top-24 md:top-32 mx-[22%]  w-1/2  rounded-md border-[3px]  border-slate-800 ">
              <img
                src={artistData.artist_Image}
                alt="Shop Logo"
                className="drop-shadow-custom object-cover rounded-sm h-full w-full"
              />
            </div>
          </div>

          <div className="text-slate-900 font-semibold pt-[20%]  text-center">
            {artistData.artist_Name}
          </div>
          <li
            onClick={() => navigate("/shop/Artist/ArtistDashboard")}
            className="flex justify-between p-1 hover:bg-slate-300 mt-4 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Dashboard
            </a>
            <box-icon type="solid" name="dashboard" color="#4D077C"></box-icon>
          </li>

          <li
            onClick={() => navigate("/shop/Artist/ArtistAddArts")}
            className="flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Manage Arts
            </a>
            <box-icon type="solid" name="component" color="#4D077C"></box-icon>
          </li>

          <li
            onClick={() => navigate("/shop/Artist/ArtistOrders")}
            className="flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Messages
            </a>
            <box-icon name="basket" type="solid" color="#4D077C"></box-icon>
          </li>

          <li
            onClick={() => navigate("/shop/Artist/ArtistCommision")}
            className="flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Commissions
            </a>
            <box-icon name="basket" type="solid" color="#4D077C"></box-icon>
          </li>

          <li
            onClick={() => navigate("/shop/Artist/ArtistAccount")}
            className="flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Account
            </a>
            <box-icon type='solid' name='user-account' color="#4D077C"></box-icon>
          </li>
        </ul>
        <div className="flex gap-2 absolute bottom-14  md:bottom-2  justify-end ">
          <button className="btn px-2 mx-2 ">
            Messages
            <div className="badge">+99</div>
          </button>
          <button className="btn">
            Inbox
            <div className="badge badge-secondary">+99</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArtistSB;
