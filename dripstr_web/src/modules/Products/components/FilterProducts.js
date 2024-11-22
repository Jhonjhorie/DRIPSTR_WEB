import React, {useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import PriceRangeSlider from './priceRangeSlider';

const FilterProducts = ({ }) => {
    const [range, setRange] = useState({ min: 2500, max: 7500 });

    const handleRangeChange = (newRange) => {
    setRange(newRange);
    console.log("Selected Range:", newRange); // Use this data for filtering or other logic
    };


    return (<div class="drawer drawer-end ">
          <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
          <div class="drawer-content">
          {/* //button */} 
            <label for="my-drawer-4" class="btn drawer-button text-lg glass -top-6 gap-2 p-2 absolute flex flex-row right-1">
              <FontAwesomeIcon icon={faFilter} size={24}  />
               Filter</label>
          </div>
          <div class="drawer-side z-50">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
            <div className='min-h-full w-80 px-4 py-12 flex flex-col gap-2 bg-slate-100'>
                <div className='flex flex-col text-2xl items-center gap-2 font-bold w-full'> 
                Price Range
                <PriceRangeSlider onRangeChange={handleRangeChange}/> 
                </div>
                <div className='flex flex-row text-lg items-center mt-2 gap-2 font-bold w-full justify-evenly'>
                    Str Items? <input type="checkbox" className="toggle toggle-lg toggle-primary" defaultChecked />
                </div>
            </div>
          </div>
        </div>
);};


export default FilterProducts