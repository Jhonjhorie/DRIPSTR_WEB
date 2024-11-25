import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faTimes, faPaperPlane, faMinus, faArrowLeft, faMultiply } from "@fortawesome/free-solid-svg-icons";

const ChatMessages = ({ onClose }) => {
  const [selectedChat, setSelected] = useState(null);
  const [isMinimized, setMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const messages = Array.from({ length: 12 }, (_, i) => `Message ${i + 1}`);

  // Detect if the screen size is mobile
  useEffect(() => {
    const updateView = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  const openChat = (message) => {
    setSelected(message);
    setMinimized(false);
  };

  const closeChat = () => setSelected(null);
  const toggleMinimize = () => setMinimized(!isMinimized);

  return (
    <div className="relative">
      {/* Chat List */}
      {!selectedChat || !isMobile ? (
        <div className="absolute top-0 right-9 bg-white w-80 rounded-lg shadow-md z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-[#9800ff]">Messages</h2>
            <button className="hover:text-primary-color text-slate-800 btn-sm" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => openChat(message)}
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm">{message}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Chat Detail View */}
      {selectedChat && (
        <div
          className={`fixed ${
            isMobile ? "top-0 left-0 w-full" : "bottom-4 right-12 w-80"
          } bg-white rounded-lg shadow-md transition-all z-50 flex flex-col`}
          style={{
            height: isMinimized ? "50px" : isMobile ? "100vh" : "80vh", // Full-screen height on mobile
            maxHeight: isMobile && !isMinimized ? "100vh" : "50vh", // Prevent excessive height
            transition: "height 0.3s ease-in-out", // Smooth transition
          }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-[#9800ff]">{selectedChat}</h2>
            <div className="flex items-center gap-2">
              {/* Show back arrow in mobile view */}
              {isMobile ? (
                <button
                  className="hover:text-primary-color btn-sm text-black"
                  onClick={() => setSelected(null)}
                >
                  <FontAwesomeIcon icon={faMultiply} size="lg" />
                </button>
              ) : (
                <>
                  <button className="hover:text-primary-color btn-sm" onClick={toggleMinimize}>
                    {isMinimized ? (
                      <FontAwesomeIcon icon={faCommentAlt} size="lg" />
                    ) : (
                      <FontAwesomeIcon icon={faMinus} size="lg" />
                    )}
                  </button>
                  <button
                    className="hover:text-primary-color text-slate-800 btn-sm"
                    onClick={() => setSelected(null)}
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Only show chat content if not minimized */}
          {!isMinimized && (
            <div className="flex flex-col h-full">
              <div className="flex-grow overflow-y-auto">
                {selectedChat === "Message 1" && (
                  <div className="flex flex-col gap-1">
                    <div className="chat chat-start">
                      <div className="chat-bubble bg-slate-200 text-black">Ganda ng design</div>
                    </div>
                    <div className="chat chat-start">
                      <div className="chat-bubble bg-slate-200 text-black">
                        Would buy it again ദ്ദി(˵ •̀ ᴗ - ˵ )
                      </div>
                    </div>
                    <div className="chat chat-end">
                      <div className="chat-bubble">Thanks po sa patronage (..◜ᴗ◝..)</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center bg-slate-100 border-t p-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="input input-bordered flex-1"
                />
                <button className="btn bg-slate-800 text-white hover:bg-primary-color ml-2">
                  <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;




     