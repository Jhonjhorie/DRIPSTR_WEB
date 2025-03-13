import React from "react";
import SideBar from "../Component/Sidebars";
import girl from "../../../assets/shop/erica.jpg";
import boy from "../../../assets/shop/sample2.jpg";
import successEmote from "../../../../src/assets/emote/success.png";
import FormCommission from "../Component/FormCommision";
import CommissionItem from "../Component/CommissionItem";

const { useState } = React;

function CommissionPage() {
  const [selectedOption, setSelectedOption] = useState("");
  const [activePage, setActivePage] = useState("form");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const refresh = () => {};
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
              <div className="gap-2 flex">
                <button
                  onClick={() => setActivePage("form")}
                  className={`px-4 py-2 rounded-md ${
                    activePage === "form"
                      ? "bg-custom-purple text-white"
                      : "bg-gray-300 text-slate-700"
                  }`}
                >
                  All Commissions
                </button>
                <button
                  onClick={() => setActivePage("commission")}
                  className={`px-4 py-2 rounded-md ${
                    activePage === "commission"
                      ? "bg-custom-purple text-white"
                      : "bg-gray-300 text-slate-700"
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
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-5 right-5 text-bold bg-white bg-opacity-25 text-slate-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-600 hover:text-white transition"
      >
    <box-icon name='question-mark'></box-icon>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-3">How Commission Works?</h2>
            <p className="text-gray-700 text-sm">
              Orders are assigned based on your shop's location:
            </p>
            <ul className="mt-3 text-sm text-gray-600">
              <li>
                <strong>Luzon</strong>: Receives orders from Luzon users.
              </li>
              <li>
                <strong>Visayas</strong>: Receives orders from Visayas users.
              </li>
              <li>
                <strong>Mindanao</strong>: Receives orders from Mindanao
                users.
              </li>
            </ul>

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommissionPage;
