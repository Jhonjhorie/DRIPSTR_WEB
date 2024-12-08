import React, {useState} from "react";

const SUPABASE_STORAGE_URL = 'https://pbghpzmbfeahlhmopapy.supabase.co/storage/v1/object/public';

const ItemOptions = ({ item, selectedColor, selectedSize, onSelectedValuesChange }) => {
  const [color, setColor] = useState(selectedColor);
  const [size, setSize] = useState(selectedSize);
  const disab = onSelectedValuesChange == null;

  const handleRadioChange = (event, type, choiceItem) => {
    if (type === "variant" && !disab) {
      setColor(choiceItem); 
      onSelectedValuesChange(choiceItem, size); 
    } else if (type === "sizes" && !disab) {
      setSize(choiceItem); // 
      onSelectedValuesChange(color, choiceItem); 
    }
  };

  const choices = [
    {
      label: "Variant",
      items:
        item.color_variant && Array.isArray(item.color_variant)
          ? item.color_variant 
          : [],
    },
    {
      label: "Sizes",
      items:
        item.size_variant && Array.isArray(item.size_variant)
          ? item.size_variant
          : [],
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {choices.map((choice, choiceIndex) => (
        <div key={choiceIndex} className="flex items-center gap-2">
          <p className="text-lg font-medium">{choice.label}:</p>
          <div className="flex gap-1">
          {choice.items.length > 0 ? (
            choice.items.map((choiceItem, index) => (
              <label
                key={index}
                className="p-0 form-control btn text-xs cursor-pointer flex items-center justify-center duration-300 transition-all min-w-10 h-8 bg-slate-50"
              >
                <input
                  type="radio"
                  name={`radio-${choice.label.toLowerCase()}`}
                  value={choiceItem.name} // `value` is still needed for form behavior
                  className="hidden peer"
                  checked={
                    choice.label.toLowerCase() === "variant"
                      ? choiceItem === selectedColor
                      : choiceItem === selectedSize
                  }
                  onChange={(e) =>
                    handleRadioChange(e, choice.label.toLowerCase(), choiceItem) // Pass the full object here
                  }
                />
                {choice.label === "Variant" ? (
                  <span
                    className={`peer-checked:bg-primary-color peer-checked:opacity-100 ${
                      disab ? "opacity-100" : "opacity-50"
                    } peer-checked:text-white w-full h-full flex items-center hover:bg-primary-color  justify-start pl-0 rounded-md duration-300 transition-all glass btn`}
                  >
                    {choiceItem.image && (
                      <img
                        src={`${SUPABASE_STORAGE_URL}/${choiceItem.image}`}
                        alt={choiceItem.name}
                        className=" rounded-l-md  w-8 h-full object-contain bg-slate-50"
                      />
                    )}
                    {choiceItem.name}
                  </span>
                ) : (
                  <span
                    className={`peer-checked:bg-primary-color peer-checked:opacity-100 ${
                      disab ? "opacity-100" : "opacity-50"
                    }peer-checked:text-white w-full h-full flex items-center justify-center  rounded-md duration-300 transition-all glass btn`}
                  >
                    {choiceItem}
                  </span>
                )}
              </label>
            ))
          ) : (
            <span>No options available</span>
          )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemOptions;
