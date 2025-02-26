import React, { useState, useEffect } from "react";

const StarRangeSlider = ({ onRateChange }) => {
  const [minRate, setMinRate] = useState(0); // Default min rate
  const [maxRate, setMaxRate] = useState(5); // Default max rate

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxRate) {
      setMinRate(value);
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minRate) {
      setMaxRate(value);
    }
  };

  // Call the parent callback whenever rates change
  useEffect(() => {
    if (onRateChange) {
      onRateChange({ min: minRate, max: maxRate });
    }
  }, [minRate, maxRate, onRateChange]);

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      {/* Min Rate Slider */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Min Rate: <span className="text-primary">{minRate} Stars</span>
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={minRate}
          onChange={handleMinChange}
          className="range"
        />
      </div>

      {/* Max Rate Slider */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Rate: <span className="text-primary">{maxRate} Stars</span>
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={maxRate}
          onChange={handleMaxChange}
          className="range"
        />
      </div>

      {/* Ticks */}
      <div className="flex w-full justify-between px-2 text-xs">
        <span className={minRate <= 1 || maxRate <= 1 ? "text-primary font-bold" : ""}>
          <img
            src={require("@/assets/images/others/fillno.png")}
            className="w-4 h-5 object-contain"
            alt="0 Stars"
          />
        </span>
        <span className={minRate > 1 && minRate <= 2 ? "text-primary font-bold" : ""}>
          <img
            src={require("@/assets/images/others/fillhalf.png")}
            className="w-4 h-5 object-contain"
            alt="1-2 Stars"
          />
        </span>
        <span className={minRate > 2 && minRate <= 3 ? "text-primary font-bold" : ""}>
          <img
            src={require("@/assets/images/others/fillhalf.png")}
            className="w-4 h-5 object-contain"
            alt="2-3 Stars"
          />
        </span>
        <span className={minRate > 3 && minRate <= 4 ? "text-primary font-bold" : ""}>
          <img
            src={require("@/assets/images/others/fillhalf.png")}
            className="w-4 h-5 object-contain"
            alt="3-4 Stars"
          />
        </span>
        <span className={minRate >= 5 ? "text-primary font-bold" : ""}>
          <img
            src={require("@/assets/images/others/fillfull.png")}
            className="w-4 h-5 object-contain"
            alt="5 Stars"
          />
        </span>
      </div>

      {/* Selected Range Display */}
      <div className="text-center text-sm font-medium">
        Star Range:{" "}
        <span className="text-primary">{minRate}</span> -{" "}
        <span className="text-primary">{maxRate}</span> Stars
      </div>
    </div>
  );
};

export default StarRangeSlider;
