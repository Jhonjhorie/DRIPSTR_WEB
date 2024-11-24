import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../../assets/image-removebg-preview.png";

function Sidebar() {
  // State to control sidebar visibility on small screens
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Toggle function for sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const SidebarItem = ({ icon, label, to }) => (
    <NavLink
      to={to} // Use 'to' prop to link to the route
      className={({ isActive }) =>
        `flex items-center w-full p-3 leading-tight transition-all rounded-2xl outline-none text-start duration-500 hover:scale-125 hover:bg-white hover:text-black focus:bg-white focus:text-black ${
          isActive ? "bg-white text-black" : ""
        }`
      }
    >
      <div className="grid mr-4 place-items-center">{icon}</div>
      {label}
    </NavLink>
  );

  return (
    <div className="flex">
      {/* Burger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="flex mt-10 h-9 lg:hidden duration-500 p-2 m-2 text-white rounded-md focus:outline-none hover:bg-gray-800"
        aria-label="Toggle Sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5"
          />
        </svg>
      </button>
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:block flex flex-col h-screen w-full max-w-[13rem] transition-all duration-500 text-lg p-4 text-white`}
      >
        {/* Navigation items */}
        <nav className="flex flex-col gap-5 p-2 text-white">
          <SidebarItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
            label="Dashboard"
            to="/admin/dashboard"
          />
          <SidebarItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
            label="Reviews"
            to="/admin/reviews"
          />
          <SidebarItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H6.912zm13.823 9.75l-2.213-7.191A1.5 1.5 0 0017.088 4.5H6.912a1.5 1.5 0 00-1.434 1.059L3.265 12.75H6.11a3 3 0 012.684 1.658l.256.513a1.5 1.5 0 001.342.829h3.218a1.5 1.5 0 001.342-.83l.256-.512a3 3 0 012.684-1.658h2.844z"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
            label="Reports"
            to="/admin/reports"
          />
          <SidebarItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            }
            label="Returns"
            to="/admin/returns"
          />
          <SidebarItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            }
            label="Settings"
            to="/admin/settings"
          />
        </nav>

        {/* User info */}
        <div className="flex flex-col items-center pt-2 pb-4 mt-24">
          <img
            className="h-10 w-10 rounded-3xl border-2 border-white"
            src={logo}
            alt="Logo"
          />
          <div className="p-1 text-center">
            <p className="font-bold">Moderator Admin</p>
            <p className="text-xs">moderatoradmin@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
