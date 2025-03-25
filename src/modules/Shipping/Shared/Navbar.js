import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-purple-600 shadow-md p-3 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center justify-between w-full md:w-auto">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            DripStr Express
          </h1>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-4">
            <li>
              <Link
                to="/express"
                className="text-white hover:text-red-100 font-medium text-sm"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/express/track"
                className="text-white hover:text-red-100 font-medium text-sm"
              >
                Track
              </Link>
            </li>
            <li>
              <Link
                to="/express/detailed"
                className="text-white hover:text-red-100 font-medium text-sm"
              >
                Details
              </Link>
            </li>
          </ul>
          <div className="divider divider-horizontal hidden md:flex"></div>
          <div className="flex items-center gap-1">
            <span className="text-white font-medium text-sm flex gap-1 items-center">
              <FontAwesomeIcon icon={faUser} size={"sm"} /> {username}
            </span>
            <div className="divider divider-horizontal hidden md:flex"></div>
            <button
              onClick={handleLogout}
              className="hover:text-blue-500 hover:underline text-white font-medium text-sm flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faRightFromBracket} size={"sm"} /> Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-red-600 px-4 py-2 shadow-lg">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link
                  to="/express"
                  className="block text-white hover:text-red-100 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/express/track"
                  className="block text-white hover:text-red-100 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Track
                </Link>
              </li>
              <li>
                <Link
                  to="/express/detailed"
                  className="block text-white hover:text-red-100 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Details
                </Link>
              </li>
            </ul>

            <div className="flex flex-col mt-4 pt-4 border-t border-red-500">
              <span className="text-white font-medium text-sm flex gap-2 items-center py-2">
                <FontAwesomeIcon icon={faUser} size={"sm"} /> {username}
              </span>
           
              <button
                onClick={handleLogout}
                className="text-left hover:text-blue-500 hover:underline text-white font-medium text-sm flex items-center gap-2 py-2"
              >
                <FontAwesomeIcon icon={faRightFromBracket} size={"sm"} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;