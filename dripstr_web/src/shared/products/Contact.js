import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import React from "react";

const Contact = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="font-sans sm:w-full max-w-[30.40rem] h-[17rem] bg-slate-50 rounded-lg shadow-lg mx-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <div className="flex flex-col items-center justify-center h-6 w-6">
            <img
              src={require("@/assets/images/blackLogo.png")}
              alt="Dripstr"
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Connect with Us
          </h2>
          <button
            onClick={onClose}
            className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
        <div className=" overflow-y-auto p-6 justify-between px-10 text-semibold font-[iceland] text-lg   custom-scrollbar flex text-gray-700">
          <div className="mt-4 ">
            <h1 className="text-lg font-semibold">Contact Information</h1>
            <p className="flex items-center mt-4">
              <span className="mr-2">📞</span> +63 919 123 4567
            </p>
            <p className="flex items-center mt-4">
              <span className="mr-2">✉️</span> dripstr@gmail.com
            </p>
          </div>

          <div className="mt-4  ">
            <h1 className="text-lg font-semibold ">Social</h1>
            <div className="mt-4 flex gap-6 items-center flex-col">
            <a href="https://www.facebook.com/profile.php?id=100077049286014" className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="fill-current"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
              <a href="https://x.com/?mx=2" className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
