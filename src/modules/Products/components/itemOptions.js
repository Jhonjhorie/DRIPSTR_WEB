import React, { useState, useEffect } from "react";

const SUPABASE_STORAGE_URL =
  "https://pbghpzmbfeahlhmopapy.supabase.co/storage/v1/object/public";

const ItemOptions = ({
  item,
  selectedColor,
  selectedSize,
  onSelectedValuesChange,
}) => {
  const [color, setColor] = useState(selectedColor);
  const [size, setSize] = useState(selectedSize);
  const disab = onSelectedValuesChange == null;

  const variants = item?.item_Variant || [];

  const [sizes, setSizes] = useState(color?.sizes || []);
  useEffect(() => {
    setColor(selectedColor);
    setSize(selectedSize);
  }, [item]);

  useEffect(() => {
    if (color) {
      setSizes(color.sizes || []);
      setSize(sizes[0]);
    }
  }, [color, size]);

  useEffect(() => {
    if (size) {
      setSize(size);
    }
  }, [size]);

  const handleRadioChange = (event, type, choiceItem) => {
    if (type == "variant" && !disab) {
      setColor(choiceItem);
      setSizes(choiceItem.sizes || []);
      setSize(sizes[0]);
      onSelectedValuesChange(choiceItem, sizes[0]);
    } else if (type == "size" && !disab) {
      setSize(choiceItem);
      onSelectedValuesChange(color, choiceItem);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="flex form-control  gap-0.5">
        <div className="label py-0">
          <span class="label-text text-xs text-slate-400">Variant:</span>
        </div>
        <div className="flex gap-1 w-full overflow-x-auto custom-scrollbar ml-2 pb-1">
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
                  className={`peer-checked:bg-secondary-color peer-checked:opacity-100 ${
                    disab ? "opacity-100" : "opacity-80"
                  } peer-checked:text-white w-full h-full flex pl-0 items-center hover:bg-secondary-color justify-start  rounded-md duration-300 transition-all glass btn`}
                >
                  {variant.imagePath && (
                    <img
                      src={variant.imagePath}
                      alt={variant.variant_Name}
                      className="rounded-l-md w-8 h-full object-contain bg-slate-50"
                    />
                  )}

                  {variant.variant_Name}
                </span>
              </label>
            ))
          ) : (
            <span>No variants available</span>
          )}
        </div>
      </label>

      <label className="flex form-control gap-0.5 justify-between">
        <div className="label py-0">
          <span class="label-text text-xs text-slate-400">Size:</span>
        </div>
        <div className="flex gap-1  w-full overflow-x-auto custom-scrollbar ml-2 pb-1">
          {sizes.length > 0 ? (
            sizes.map((sizeOption, index) => (
              <label
                key={index}
                className="p-0 form-control btn text-xs cursor-pointer flex items-center justify-center duration-300 transition-all min-w-9 min-h-9 h-9 "
              >
                <input
                  type="radio"
                  name="radio-size"
                  value={sizeOption}
                  className="hidden peer"
                  checked={sizeOption === size}
                  onChange={(e) => handleRadioChange(e, "size", sizeOption)}
                />
                <span
                  className={`peer-checked:bg-secondary-color peer-checked:opacity-100 ${
                    disab ? "opacity-100" : "opacity-80"
                  } peer-checked:text-white w-full items-center  form-control justify-center rounded-md duration-300 transition-all glass btn min-w-9 min-h-9 h-9 p-0 px-1 font-semibold`}
                >
                  {sizeOption.size} 
                </span>
                
              </label>
            ))
          ) : (
            <span>No sizes available</span>
          )}
        </div>
      </label>
      <div className="ml-2 mt-1 text-xs  text-slate-400
      ">
        Stocks: <span className="text-slate-800 text-sm font-semibold">{size?.qty}</span>
      </div>
    </div>
  );
};

export default ItemOptions;
