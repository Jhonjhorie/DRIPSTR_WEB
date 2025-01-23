import React, { useState } from "react";

const SUPABASE_STORAGE_URL = "https://pbghpzmbfeahlhmopapy.supabase.co/storage/v1/object/public";

const ItemOptions = ({ item, selectedColor, selectedSize, onSelectedValuesChange }) => {
  const [color, setColor] = useState(selectedColor || null);
  const [size, setSize] = useState(selectedSize || null);
  const disab = onSelectedValuesChange == null;

  // Extracting variants from item
  const variants = item?.item_Variant || [];

  // Extract sizes from the selected variant
  const sizes = color ? color.sizes || [] : [];

  const handleRadioChange = (event, type, choiceItem) => {
    if (type === "variant" && !disab) {
      setColor(choiceItem);
      setSize(null); // Reset size when variant changes
      onSelectedValuesChange(choiceItem, null);
    } else if (type === "size" && !disab) {
      setSize(choiceItem);
      onSelectedValuesChange(color, choiceItem);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Variant Selection */}
      <div className="flex items-center gap-2">
        <p className="text-lg font-medium">Variant:</p>
        <div className="flex gap-1">
          {variants.length > 0 ? (
            variants.map((variant, index) => (
              <label
                key={index}
                className="p-0 form-control btn text-xs cursor-pointer flex items-center justify-center duration-300 transition-all min-w-10 h-8 bg-slate-50"
              >
                <input
                  type="radio"
                  name="radio-variant"
                  value={variant.variant_Name}
                  className="hidden peer"
                  checked={variant === color}
                  onChange={(e) => handleRadioChange(e, "variant", variant)}
                />
                <span
                  className={`peer-checked:bg-primary-color peer-checked:opacity-100 ${
                    disab ? "opacity-100" : "opacity-50"
                  } peer-checked:text-white w-full h-full flex items-center hover:bg-primary-color justify-start pl-0 rounded-md duration-300 transition-all glass btn`}
                >
                  <img
                    src={variant.imagePath}
                    alt={variant.variant_Name}
                    className="rounded-l-md w-8 h-full object-contain bg-slate-50"
                  />
                  {variant.variant_Name}
                </span>
              </label>
            ))
          ) : (
            <span>No variants available</span>
          )}
        </div>
      </div>

      {/* Size Selection */}
      <div className="flex items-center gap-2">
        <p className="text-lg font-medium">Size:</p>
        <div className="flex gap-1">
          {sizes.length > 0 ? (
            sizes.map((sizeOption, index) => (
              <label
                key={index}
                className="p-0 form-control btn text-xs cursor-pointer flex items-center justify-center duration-300 transition-all min-w-10 h-8 bg-slate-50"
              >
                <input
                  type="radio"
                  name="radio-size"
                  value={sizeOption.size}
                  className="hidden peer"
                  checked={sizeOption === size}
                  onChange={(e) => handleRadioChange(e, "size", sizeOption)}
                />
                <span
                  className={`peer-checked:bg-primary-color peer-checked:opacity-100 ${
                    disab ? "opacity-100" : "opacity-50"
                  } peer-checked:text-white w-full h-full flex items-center justify-center rounded-md duration-300 transition-all glass btn`}
                >
                  {sizeOption.size} - ₱{sizeOption.price}
                </span>
              </label>
            ))
          ) : (
            <span>No sizes available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemOptions;
