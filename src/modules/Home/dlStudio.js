import React from "react";
import { useNavigate } from "react-router-dom";

const DownloadStudioP = () => {
    const navigate = useNavigate()
  const handleBackClick = () => {
    navigate("/")
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradient effect - more subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-black z-0"></div>
      
      {/* Grid lines overlay - more subtle */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
      
      {/* Back button */}
      <button
        onClick={handleBackClick}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-all duration-300 z-10 flex items-center gap-2 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">BACK</span>
      </button>

      {/* Main content container - restructured with logo on right */}
      <div className="max-w-5xl w-full px-6 z-10 flex flex-col items-center">
        {/* Title and description section - split layout */}
        <div className="w-full flex flex-col md:flex-row items-center mb-8">
          {/* Left side: Title and description */}
          <div className="w-full md:w-2/3 pr-0 md:pr-8">
            {/* Title with minimal border */}
            <div className="mb-6">
              <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2 relative">
                DRIPSTR STUDIO
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-purple-500"></span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-lg ">
              Experience fashion's future with DRIPSTR's 3D apparel visualization and avatar-based sizing for the perfect fit and style. Custom designs and exclusive digital assets make shopping seamless and immersive.
            </p>
          </div>
          
          {/* Right side: Logo */}
          <div className="w-full absolute right-10 top-10 md:w-1/3 hidden md:flex z-0 flex justify-center md:justify-end mt-6 md:mt-0">
            <div className="relative  flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#17171746] to-transparent p-4 rounded-full "></div>
              <img 
                src={require("@/assets/logoWhite.png")} 
                alt="DRIPSTR Logo" 
                className="w-full h-full relative z-10" 
              />
            </div>
          </div>
        </div>

        {/* Installation card */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl w-full mb-8 overflow-hidden transition-all duration-300 hover:border-gray-700 hover:shadow-lg hover:shadow-black/40">
          <div className="p-6">
            <h2 className="text-2xl font-medium text-white mb-4 flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </span>
              Installation Guide
            </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-purple-500/30">1</div>
                <p>Download the ZIP file using the button below</p>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-purple-500/30">2</div>
                <p>Extract the contents to your preferred location</p>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-purple-500/30">3</div>
                <p>Locate and run <span className="bg-black/40 px-2 py-0.5 rounded text-gray-300 font-mono text-sm">DripstrStudio.exe</span></p>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-purple-500/30">4</div>
                <p>Follow the on-screen instructions to complete setup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download button - more minimal */}
        <button className="group relative px-8 py-4 overflow-hidden rounded-md bg-gray-800 text-white font-medium transition-all duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black border border-purple-500/30">
          <span className="relative z-10 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-400">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            DOWNLOAD NOW
          </span>
        </button>

        {/* System requirements toggle */}
        <div className="mt-8 text-center">
          <button className="text-gray-500 hover:text-gray-300 text-sm flex items-center justify-center">
            <span>System Requirements</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        <p>© 2025 DRIPSTR STUDIO. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DownloadStudioP;