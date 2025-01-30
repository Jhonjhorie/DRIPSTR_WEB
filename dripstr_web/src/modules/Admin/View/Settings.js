import React, { useState } from "react";
import Sidebar from "./Shared/Sidebar";

// Tab Button Component
const TabButton = ({ label, activeTab, setActiveTab }) => (
  <div
    className={`px-4 py-2 text-sm font-medium cursor-pointer ${
      activeTab === label.toLowerCase() ? "text-violet-600" : ""
    }`}
    onClick={() => setActiveTab(label.toLowerCase())}
  >
    {label.toUpperCase()}
  </div>
);

// Theme Selector Component
const ThemeSelector = ({ selectedTheme, setSelectedTheme }) => {
  const themes = [
    { id: "default", name: "Default" },
    { id: "modern", name: "Modern" },
    { id: "techno", name: "Techno Street Punk" },
    { id: "christmas", name: "Christmas Cheer" },
    { id: "newYear", name: "New Year Sparkle" },
  ];

  return (
    <div>
      <div className="mb-4"> 
        <h1>Select a Theme:</h1>
      </div>
      <div className="flex flex-col gap-3">
        {themes.map((theme) => (
          <div key={theme.id}>
            <input
              type="radio"
              id={theme.id}
              name="theme"
              value={theme.id}
              checked={selectedTheme === theme.id}
              onChange={() => setSelectedTheme(theme.id)}
            />
            <label htmlFor={theme.id} className="ml-2">
              {theme.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

// Image Uploader Component
const ImageUploader = ({ image, setImage }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <p>Upload an image:</p>
      <div className="border-dashed border-2 border-gray-400 p-6 flex flex-col items-center justify-center">
        {image ? (
          <img src={image} alt="Uploaded" className="w-32 h-32 object-cover" />
        ) : (
          <p>Drag an image here or click to upload</p>
        )}
        <input type="file" onChange={handleImageUpload} className="mt-4" />
      </div>
    </div>
  );
};

// Voucher Form Component
const VoucherForm = ({ voucherDetails, handleVoucherChange }) => (
  <div>
    <div className="flex space-x-4">
      {[
        { label: "Voucher #", name: "voucherNumber", type: "text" },
        { label: "QTY", name: "qty", type: "number" },
        { label: "Expiry Date", name: "expiryDate", type: "date" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-white" htmlFor={field.name}>
            {field.label}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={voucherDetails[field.name]}
            onChange={handleVoucherChange}
            className="mt-1 px-4 py-2 rounded-xl border border-gray-300"
          />
        </div>
      ))}
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-white" htmlFor="description">
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
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState("themes");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [voucherDetails, setVoucherDetails] = useState({
    voucherNumber: "",
    qty: "",
    expiryDate: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveChanges = () => setShowConfirm(true);

  const handleVoucherChange = (e) => {
    const { name, value } = e.target;
    setVoucherDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full h-screen flex-col">
        <div className="bg-slate-900 h-5/6 m-5 flex flex-col rounded-3xl p-2">
          <p className="text-white text-2xl font-bold p-6">Admin Settings</p>

          {/* Tab Navigation */}
          <div className="border-b-4 border-violet-600 text-white flex">
            {["Themes", "Headlines", "Vouchers"].map((label) => (
              <TabButton key={label} label={label} activeTab={activeTab} setActiveTab={setActiveTab} />
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex h-full flex-row p-2">
            <div className="text-white 2xl:w-3/6 m-4 flex">
              {activeTab === "themes" && <ThemeSelector selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />}
              {activeTab === "headlines" && <ImageUploader image={image} setImage={setImage} />}
              {activeTab === "vouchers" && <VoucherForm voucherDetails={voucherDetails} handleVoucherChange={handleVoucherChange} />}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-start mx-4 pl-10 pb-4">
            <button className="bg-violet-600 text-white px-4 py-2 rounded-xl hover:scale-110 transition-transform" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-900 rounded-xl shadow-lg p-6 w-96">
            <p className="text-white text-lg font-bold mb-4">Are you sure you want to save the changes?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-xl mr-4 hover:scale-110 transition-transform"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button className="bg-violet-600 text-white px-4 py-2 rounded-xl hover:scale-110 transition-transform">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
