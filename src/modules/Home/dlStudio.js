import React,{useState} from "react";
import { useNavigate } from "react-router-dom";

const DownloadStudioP = () => {
  const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate()
  const handleBackClick = () => {
    navigate("/")
  };

  const downloadZip = async () => {
    setIsDownloading(true); 

    const zipFileUrl =
      "https://pbghpzmbfeahlhmopapy.supabase.co/storage/v1/object/public/download//Dripstr%20Studio.zip";

    const link = document.createElement("a");
    link.href = zipFileUrl;
    link.download = "dripstr.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Simulate a delay to show the loader (remove this in production)
    setTimeout(() => {
      setIsDownloading(false); // Stop loading after download starts
    }, 3000);
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

      

      <div className="max-w-5xl w-full px-6 z-10 flex flex-col items-center">
        {/* Header section */}
        <div className="w-full flex justify-between items-center mb-8">
          <div className="max-w-xl">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2 relative">
              DRIPSTR STUDIO
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-purple-500"></span>
            </h1>
            <p className="text-gray-400 text-lg mt-4">
              Experience fashion's future with DRIPSTR's 3D apparel visualization and avatar-based sizing for the perfect fit and style.
            </p>
          </div>
         
          <div className="w-full absolute right-20 top-10 md:w-1/3 hidden md:flex z-0  justify-center md:justify-end mt-6 md:mt-0">
            <div className="relative  flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#17171746] to-transparent p-4 rounded-full "></div>
              <img 
                src={require("@/assets/logoWhite.png")} 
                alt="DRIPSTR Logo" 
                className=" w-full h-full relative z-10" 
              />
            </div>
          </div>
        </div>

        {/* Installation and requirements card - using flex row */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl w-full mb-8 overflow-hidden transition-all duration-300 hover:border-gray-700 hover:shadow-lg hover:shadow-black/40">
          <div className="flex flex-col md:flex-row">
            {/* Left side: Installation Guide */}
            <div className="p-6 md:w-1/2 border-r border-gray-800">
              <h2 className="text-2xl font-medium text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mr-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
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
                  <p>Open the Folder <span className="bg-black/40 px-2 py-0.5 rounded text-gray-300 font-mono text-sm">DRIP RELEASE</span></p>
                </div>
                <div className="flex items-start">
                  <div className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-purple-500/30">4</div>
                  <p>Run <span className="bg-black/40 px-2 py-0.5 rounded text-gray-300 font-mono text-sm">DripstrStudio</span> (Type: Application)</p>
                </div>
                <div className="w-full flex justify-center mt-10">
          <button
            onClick={downloadZip}
            disabled={isDownloading}
            className={`group relative px-8 py-4 rounded-md font-medium transition-all duration-300 border border-purple-500/30 ${
              isDownloading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isDownloading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <span className="relative z-10 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-purple-400"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                DOWNLOAD NOW
              </span>
            )}
          </button>
        </div>

              </div>
            </div>
            
            {/* Right side: System Requirements */}
            <div className="p-6 md:w-1/2">
              <h2 className="text-2xl font-medium text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mr-2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                System Requirements
              </h2>
              
              <div className="mb-4">
                <h3 className="text-white text-lg mb-2">Minimum</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Windows 7/8/10/11 (64-bit)</li>
                  <li>• Intel Core i3 / AMD Ryzen 3</li>
                  <li>• 8GB RAM</li>
                  <li>• NVIDIA GTX 660 / AMD Radeon HD 7870</li>
                  <li>• 10GB available space</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white text-lg mb-2">Recommended</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Windows 10/11 (64-bit)</li>
                  <li>• Intel Core i5 / AMD Ryzen 5</li>
                  <li>• 16GB RAM</li>
                  <li>• NVIDIA GTX 1060 / AMD RX 580</li>
                  <li>• 20GB available space</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
       
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        <p>© 2025 DRIPSTR STUDIO. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DownloadStudioP;