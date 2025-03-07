import React, { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../../assets/logoName.png";
import { ArrowDownCircleIcon } from "@heroicons/react/16/solid";
import { faDashboard, faMoneyBill, faShoppingBag, faImages, faTag, faShop, faUserTie, faPalette, faCircleUser, faExclamationCircle, faHamburger, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isChief, setIsChief] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const adminId = localStorage.getItem("id");
      if (adminId) {
        const { data: admin, error } = await supabase
          .from("admins")
          .select("id, chief")
          .eq("id", adminId)
          .single();

        if (error) {
          console.error("Error fetching admin data:", error);
        } else {
          setIsChief(admin?.chief);
        }
      }
    };

    fetchAdminData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleUsersDropdown = () => {
    setIsUsersDropdownOpen(!isUsersDropdownOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const SidebarItem = ({ icon, label, to, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center w-full p-3 leading-tight transition-all rounded-2xl outline-none text-start duration-500 hover:scale-125 hover:bg-white hover:text-black focus:bg-white focus:text-black ${isActive && !onClick ? "bg-white text-black" : ""
        }`
      }
    >
      <div className="grid mr-4 place-items-center">{icon}</div>
      {label}
    </NavLink>
  );

  return (
    <div className="flex gap-0 w-max">
      <button
        onClick={toggleSidebar}
        className="flex mt-10 h-9 lg:hidden duration-500 p-2 m-2 text-white rounded-md focus:outline-none hover:bg-gray-800"
        aria-label="Toggle Sidebar"
      >
        <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
      </button>

      <div
        className={`${isSidebarOpen ? "block" : "hidden"}
          lg:block flex flex-col h-screen w-full max-w-[13rem] transition-all duration-500 text-lg p-4 text-white`}
      >
        <nav className="flex flex-col gap-5 p-2 text-white">
          <SidebarItem
            icon={
              <FontAwesomeIcon icon={faDashboard} className="w-5 h-5" />
            }
            label="Dashboard"
            to="/admin/dashboard"
          />
          <SidebarItem
            icon={
              <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5" />
            }
            label="Reports"
            to="/admin/reports"
          />
          <SidebarItem
            icon={
              <FontAwesomeIcon icon={faMoneyBill} className="w-5 h-5" />
            }
            label="Cashout"
            to="/admin/cashout"
          />
          <SidebarItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H6.912zm13.823 9.75l-2.213-7.191A1.5 1.5 0 0017.088 4.5H6.912a1.5 1.5 0 00-1.434 1.059L3.265 12.75H6.11a3 3 0 012.684 1.658l.256.513a1.5 1.5 0 001.342.829h3.218a1.5 1.5 0 001.342-.83l.256-.512a3 3 0 012.684-1.658h2.844z"
                  clipRule="evenodd"
                />
              </svg>
            }
            label="Commisions"
            to="/admin/commisions"
          />
          <SidebarItem
            icon={
              <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
            }
            label="Arts"
            to="/admin/arts"
          />
          <SidebarItem
            icon={
              <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
            }
            label="Orders"
            to="/admin/orders"
          />
          <SidebarItem
            icon={
              <FontAwesomeIcon icon={faTag} className="w-5 h-5" />
            }
            label="Vouchers"
            to="/admin/vouchers"
          />
          <SidebarItem
            icon={
              <FontAwesomeIcon icon={faImages} className="w-5 h-5" />
            }
            label="Headline"
            to="/admin/headline"
          />

          {/* Users with Dropdown */}
          <div className="relative">
            <div className="flex flex-row">
              <SidebarItem
                icon={
                  <FontAwesomeIcon icon={faCircleUser} className="w-5 h-5" />
                }
                label={
                  <span className="flex items-center justify-between w-full">
                    Users
                    <button><ArrowDownCircleIcon
                      className={`w-5 h-5 cursor-pointer hover:text-black transition-transform ${isUsersDropdownOpen ? "rotate-180" : ""
                        }`}
                      onClick={toggleUsersDropdown}
                    /> </button>
                  </span>
                }
                to="/admin/accounts"
              />
            </div>

            {isUsersDropdownOpen && (
              <div className="ml-6 mt-2 flex flex-col gap-2">
                <SidebarItem
                  icon={
                    <FontAwesomeIcon icon={faShop} className="w-5 h-5" />
                  }
                  label="Merchants"
                  to="/admin/merchants"
                />
                <SidebarItem
                  icon={
                    <FontAwesomeIcon icon={faPalette} className="w-5 h-5" />
                  }
                  label="Artists"
                  to="/admin/artists"
                />
                {isChief && (
                  <SidebarItem
                    icon={
                      <FontAwesomeIcon icon={faUserTie} className="w-5 h-5" />
                    }
                    label="Admins"
                    to="/admin/admins"
                  />
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="mt-auto w-full p-3 text-center bg-red-600 rounded-2xl hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;