import React, { useState, useEffect } from "react";

const DoubleRangeSlider = ({ onRangeChange }) => {
  const [minValue, setMinValue] = useState(100); 
  const [maxValue, setMaxValue] = useState(1000); 

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxValue) {
      setMinValue(value); 
    }
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minValue) {
      setMaxValue(value); 
    }
  };

 
  useEffect(() => {
    if (onRangeChange) {
      onRangeChange({ min: minValue, max: maxValue });
    }
  }, [minValue, maxValue, onRangeChange]);

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Min Slider */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Min Value: <span className="text-primary">₱{minValue}</span>
        </label>
        <input
          type="range"
          min={0}
          max={10000}
          step={500}
          value={minValue}
          onChange={handleMinChange}
          className="range"
        />
      </div>

      {/* Max Slider */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Value: <span className="text-primary">₱{maxValue}</span>
        </label>
        <input
          type="range"
          min={0}
          max={10000}
          step={500}
          value={maxValue}
          onChange={handleMaxChange}
          className="range"
        />
      </div>


      <div className="flex w-full justify-between px-2 text-xs">
        <span className={minValue === 0 || maxValue === 0 ? "text-primary font-bold" : ""}>₱0</span>
        <span
          className={
            (minValue > 1250 && minValue <= 3750) ||
            (maxValue > 1250 && maxValue <= 3750)
              ? "text-primary font-bold"
              : ""
          }
        >
          ₱2500
        </span>
        <span
          className={
            (minValue > 3750 && minValue <= 6250) ||
            (maxValue > 3750 && maxValue <= 6250)
              ? "text-primary font-bold"
              : ""
          }
        >
          ₱5000
        </span>
        <span
          className={
            (minValue > 6250 && minValue <= 8750) ||
            (maxValue > 6250 && maxValue <= 8750)
              ? "text-primary font-bold"
              : ""
          }
        >
          ₱7500
        </span>
        <span
          className={minValue >= 8750 || maxValue >= 8750 ? "text-primary font-bold" : ""}
        >
          ₱10000
        </span>
      </div>

      {/* Selected Range Display */}
      <div className="text-center text-sm font-medium">
        Selected Price Range:{" "}
        <span className="text-primary">₱{minValue}</span> -{" "}
        <span className="text-primary">₱{maxValue}</span>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;
