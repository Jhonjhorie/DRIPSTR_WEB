import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LogoB } from "@/assets/images/BlackLogo.svg";
import { ReactComponent as Logo } from "@/assets/images/LOGO.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const MallRibbon = ({ active }) => {
  const items = [
    {
      label: "Drip Mall",
      color: "bg-primary-color",
      activeColor: "text-secondary-color",
    },
    {
      label: "Just for You",
      color: "bg-secondary-color",
      activeColor: "text-secondary-color",
    },
    {
      label: "Followed Store",
      color: "bg-blue-700",
      activeColor: "text-secondary-color",
    },
    {
      label: "Popular/ Trend",
      color: "bg-red-700",
      activeColor: "text-secondary-color",
    },
    {
      label: "Followed Store",
      color: "bg-blue-700",
      activeColor: "text-secondary-color",
    },
    {
      label: "Followed Store",
      color: "bg-blue-700",
      activeColor: "text-secondary-color",
    },
    {
      label: "Followed Store",
      color: "bg-blue-700",
      activeColor: "text-secondary-color",
    },
    {
      label: "Followed Store",
      color: "bg-blue-700",
      activeColor: "text-secondary-color",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Show only two items at a time
  const visibleItems = items.slice(currentIndex, currentIndex + 3);

  const next = () => {
    if (currentIndex + 3 < items.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative w-[95%] md:w-[42%] py-2 flex flex-col-reverse gap-2 items-center justify-start">
      <div className="flex justify-center gap-2 items-center absolute -bottom-6 md:-bottom-8 bg-slate-50 py-0.5 px-2 rounded-full ">
        <h2 className="text-sm sm:text-md md:text-lg font-semibold">Mall</h2>
        <div className="flex justify-center space-x-2">
          {items.slice(2).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary-color w-10" // Bar covering 3 dots
                  : "bg-secondary-color w-2"
              }`}
            ></button>
          ))}
        </div>
      </div>
      {/* Carousel Wrapper */}
      <div className="flex w-full justify-evenly items-center px-1 md:px-3 gap-1">
        {/* Prev Button */}
        <button
          onClick={prev}
          className={`px-2 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 ${
            currentIndex === 0 ? "opacity-50 hidden" : ""
          }`}
          disabled={currentIndex === 0}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="text-sm md:text-lg"
          />
        </button>
        <div className="justify-evenly items-center  gap-1 lg:gap-3 flex">
          {/* Visible Items */}
          {visibleItems.map((item, index) => (
            <Link
              to={"/"}
              key={currentIndex + index} // Ensure unique keys across transitions
              className={`h-24 flex-1 ${item.color} group text-slate-50 rounded-lg min-w-[30%] items-center justify-center text-sm md:text-md flex py-4 px-8 md:px-42 font-bold drop-shadow-lg btn glass hover:${item.activeColor} overflow-hidden`}
            >
              {active == index + currentIndex ? (
                <Logo className="h-32 w-28 absolute -left-4 top-1 shadow-lg group-hover:scale-150 duration-500 transition-all -z-10" />
              ) : (
                <LogoB className="h-32 w-28 absolute -left-4 group-hover:scale-150 duration-500 transition-all top-1 shadow-lg opacity-50 -z-10" />
              )}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={next}
          className={`px-2 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 ${
            currentIndex + 3 >= items.length ? "opacity-50 hidden" : ""
          }`}
          disabled={currentIndex + 3 >= items.length}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-sm md:text-lg"
          />
        </button>
      </div>
    </div>
  );
};

export default MallRibbon;
