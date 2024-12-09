import React, { useState } from "react";
import Sidebar from "./Shared/Sidebar";

function Settings() {
  const [activeTab, setActiveTab] = useState("themes");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [voucherDetails, setVoucherDetails] = useState({
    voucherNumber: "",
    qty: "",
    expiryDate: "",
    description: "",
  });
  const [image, setImage] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    setShowConfirm(true); // Show confirmation modal
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleVoucherChange = (e) => {
    const { name, value } = e.target;
    setVoucherDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full h-screen flex-col">
        <div className="h-16"></div>
        <div className="bg-slate-900 h-5/6 m-5 flex flex-col rounded-3xl p-2 cursor-default">
          <p className="text-white text-2xl font-bold p-6">Admin Settings</p>

          <div className="flex flex-col p-2">
            {/* Tab Navigation */}
            <div className="border-b-4 border-violet-600 text-white flex">
              <div
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeTab === "themes" ? "text-violet-600" : ""
                }`}
                onClick={() => handleTabClick("themes")}
              >
                THEMES
              </div>
              <div
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeTab === "headlines" ? "text-violet-600" : ""
                }`}
                onClick={() => handleTabClick("headlines")}
              >
                HEADLINES
              </div>
              <div
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  activeTab === "vouchers" ? "text-violet-600" : ""
                }`}
                onClick={() => handleTabClick("vouchers")}
              >
                VOUCHERS
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex h-full flex-row p-2">
              <div className="text-white 2xl:w-3/6 m-4 flex">
                {/* Themes Tab */}
                {activeTab === "themes" && (
                  <div>
                    <p>Select a theme:</p>
                    <div className="space-y-2">
                      <div>
                        <input
                          type="radio"
                          id="default"
                          name="theme"
                          value="default"
                          checked={selectedTheme === "default"}
                          onChange={() => setSelectedTheme("default")}
                        />
                        <label htmlFor="default" className="ml-2">
                          Default
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="modern"
                          name="theme"
                          value="modern"
                          checked={selectedTheme === "modern"}
                          onChange={() => setSelectedTheme("modern")}
                        />
                        <label htmlFor="modern" className="ml-2">
                          Modern
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="techno"
                          name="theme"
                          value="techno"
                          checked={selectedTheme === "techno"}
                          onChange={() => setSelectedTheme("techno")}
                        />
                        <label htmlFor="techno" className="ml-2">
                          Techno Street Punk
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="christmas"
                          name="theme"
                          value="christmas"
                          checked={selectedTheme === "christmas"}
                          onChange={() => setSelectedTheme("christmas")}
                        />
                        <label htmlFor="christmas" className="ml-2">
                          Christmas Cheer
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="newYear"
                          name="theme"
                          value="newYear"
                          checked={selectedTheme === "newYear"}
                          onChange={() => setSelectedTheme("newYear")}
                        />
                        <label htmlFor="newYear" className="ml-2">
                          New Year Sparkle
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Headlines Tab */}
                {activeTab === "headlines" && (
                  <div>
                    <p>Upload an image:</p>
                    <div className="border-dashed border-2 border-gray-400 p-6 flex flex-col items-center justify-center">
                      {image ? (
                        <img
                          src={image}
                          alt="Uploaded"
                          className="w-32 h-32 object-cover"
                        />
                      ) : (
                        <p>Drag an image here or click to upload</p>
                      )}
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        className="mt-4"
                      />
                    </div>
                  </div>
                )}

                {/* Vouchers Tab */}
                {activeTab === "vouchers" && (
                  <div>
                    <div className="flex space-x-4">
                      <div>
                        <label
                          htmlFor="voucherNumber"
                          className="block text-sm font-medium text-white"
                        >
                          Voucher #
                        </label>
                        <input
                          type="text"
                          id="voucherNumber"
                          name="voucherNumber"
                          value={voucherDetails.voucherNumber}
                          onChange={handleVoucherChange}
                          className="mt-1 px-4 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="qty"
                          className="block text-sm font-medium text-white"
                        >
                          QTY
                        </label>
                        <input
                          type="number"
                          id="qty"
                          name="qty"
                          value={voucherDetails.qty}
                          onChange={handleVoucherChange}
                          className="mt-1 px-4 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-sm font-medium text-white"
                        >
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          id="expiryDate"
                          name="expiryDate"
                          value={voucherDetails.expiryDate}
                          onChange={handleVoucherChange}
                          className="mt-1 px-4 py-2 rounded-xl border border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-white"
                      >
                        Description of the voucher
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={voucherDetails.description}
                        onChange={handleVoucherChange}
                        className="mt-1 px-4 py-2 rounded-xl border border-gray-300 w-full"
                        rows="4"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-start mx-4 pl-10 pb-4">
              <button
                className="bg-violet-600 text-white px-4 py-2 rounded-xl hover:scale-125 duration-500"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-900 rounded-xl shadow-lg p-6 w-96">
            <p className="text-white text-lg font-bold mb-4">
              Are you sure you want to save the changes?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-xl mr-4 hover:scale-125 duration-500"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button className="bg-violet-600 text-white px-4 py-2 rounded-xl hover:scale-125 duration-500">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
