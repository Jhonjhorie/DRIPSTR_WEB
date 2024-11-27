import React from "react";

const RateSymbol = ({ item, size }) => {
  return (
    <>
      {item >= 4 && (
        <img
          src={require('@/assets/images/others/fillfull.png')}
          className={`w-${size} h-${size} object-contain`}
          alt="Full Rating"
        />
      )}
      {item < 4 && item > 2 && (
        <img
          src={require('@/assets/images/others/fillhalf.png')}
          className={`w-${size} h-${size} object-contain`}
          alt="Half Rating"
        />
      )}
      {item <= 2 && (
        <img
          src={require('@/assets/images/others/fillno.png')}
          className={`w-${size} h-${size} object-contain`}
          alt="No Rating"
        />
      )}
    </>
  );
};

export default RateSymbol;
