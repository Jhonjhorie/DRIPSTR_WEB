import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faTimes, faPaperPlane, faMinus } from "@fortawesome/free-solid-svg-icons";

const ChatMessages = ({ onClose }) => {
  const [selectedChat, setSelected] = useState(null);
  const [isMinimized, setMinimized] = useState(false);

  const messages = Array.from({ length: 12 }, (_, i) => `Message ${i + 1}`);

  const openChat = (message) => {
    setSelected(message);
    setMinimized(false);
  };

  const closeChat = () => setSelected(null);
  const toggleMinimize = () => setMinimized(!isMinimized);

  return (
    <div className="relative">
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

      {selectedChat && (
        <div
          className={`fixed bottom-4 right-12 w-80 bg-white rounded-lg shadow-md transition-all z-50 ${
            isMinimized ? "h-15" : "h-80"
          } flex flex-col`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-[#9800ff]">{selectedChat}</h2>
            <div className="flex items-center gap-2">
              <button className="hover:text-primary-color btn-sm" onClick={toggleMinimize}>
                {isMinimized ? (
                  <FontAwesomeIcon icon={faCommentAlt} size="lg" />
                ) : (
                  <FontAwesomeIcon icon={faMinus} size="lg" />
                )}
              </button>
              <button className="hover:text-primary-color text-slate-800   btn-sm" onClick={closeChat}>
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
          </div>

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
                      <div className="chat-bubble">
                        Thanks po sa patronage (..◜ᴗ◝..)
                      </div>
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
