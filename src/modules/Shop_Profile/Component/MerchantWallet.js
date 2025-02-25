import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/logoBlack.png";
import logoName from "../../../assets/logoName.png";
import DateTime from "../Hooks/DateTime";

function Subscription() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };
  const Subscription = ({ onClose }) => {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-red-600 text-2xl font-bold hover:scale-110 transition-transform"
            onClick={onClose} // Close the modal on click
          >
            &times;
          </button>
  
          <h2 className="text-xl font-semibold text-center mb-4">
            Contact Us
          </h2>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
  
            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
  
            {/* Message Input */}
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
  
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    );
  };
  

}

export default Subscription;
