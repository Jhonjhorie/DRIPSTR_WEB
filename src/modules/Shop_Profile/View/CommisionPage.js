import React from 'react';
import SideBar from '../Component/Sidebars'
import girl from '../../../assets/shop/erica.jpg';
import boy from '../../../assets/shop/sample2.jpg'
import successEmote from "../../../../src/assets/emote/success.png";
import FormCommission from '../Component/FormCommision';
import CommissionItem from '../Component/CommissionItem';


const { useState } = React;

function CommissionPage() {
    const [selectedOption, setSelectedOption] = useState("");
    const [activePage, setActivePage] = useState("form");

 
    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const refresh = () => {
        
    }
    return (
        <div className="h-full w-full bg-slate-300  ">
            <div className="h-full w-full  bg-slate-300 px-2 md:px-10 lg:px-20 ">
                <div className="absolute mx-3 right-0 z-10">
                    <SideBar />
                </div>

                <div className="w-full h-full bg-slate-300 ">
                    <div className=" text-2xl md:text-4xl text-custom-purple font-semibold p-2 py-3">
                        Commission Page
                    </div>
                    <div className="bg-slate-100 w-full h-auto p-1 rounded-md">
                        {/* Header with buttons */}
                        <div className="flex justify-between w-full  items-center gap-4 mb-2">
                            <div className='gap-2 flex'>
                                <button
                                    onClick={() => setActivePage("form")}
                                    className={`px-4 py-2 rounded-md ${activePage === "form" ? "bg-custom-purple text-white" : "bg-gray-300 text-slate-700"
                                        }`}
                                >
                                    All Commissions
                                </button>
                                <button
                                    onClick={() => setActivePage("commission")}
                                    className={`px-4 py-2 rounded-md ${activePage === "commission" ? "bg-custom-purple text-white" : "bg-gray-300 text-slate-700"
                                        }`}
                                >
                                    Client Commission
                                </button>
                            </div>
                            {/* <div onClick={refresh} className='px-2 py-1 rounded-full cursor-pointer'>
                            <box-icon name='history' size="25px" color="black"></box-icon>
                            </div> */}
                        </div>

                        {/* Conditional Rendering */}
                        {activePage === "form" ? <FormCommission /> : <CommissionItem />}
                    </div>

                </div>
            </div>

        </div>
    );
}



export default CommissionPage;
