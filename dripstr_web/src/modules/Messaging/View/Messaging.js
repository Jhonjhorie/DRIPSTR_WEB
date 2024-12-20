import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTimes, faPaperPlane, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Link} from "react-router-dom";

const ChatMessages = ({ onClose }) => {
  const [selectedChat, setSelected] = useState(null);
  const [minimizedChats, setMinimizedChats] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatListVisible, setChatListVisible] = useState(true);

  const chatListRef = useRef(null);
  const chatRef = useRef(null);

  // Sample messages with chat history
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Message 1",
      status: "unread", // New status field to track message read status
      chatHistory: [
        { from: "user", text: "Ganda ng design" },
        { from: "user", text: "Would buy it again (˵ •̀ ᴗ - ˵ )" },
        { from: "admin", text: "Thanks po sa patronage (..◜ᴗ◝..)" }
      ]
    },
    {
      id: 2,
      name: "Message 2",
      status: "unread",
      chatHistory: [
        { from: "user", text: "How much is this?" },
        { from: "admin", text: "It costs 500 pesos" }
      ]
    },
    {
      id: 3,
      name: "Message 3",
      status: "unread",
      chatHistory: [] // No chat history here
    }
  ]);

  // Detect if the screen size is mobile
  useEffect(() => {
    const updateView = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  // Handle opening the selected chat and marking as read
  const openChat = (message) => {
    if (selectedChat && selectedChat.id !== message.id) {
      // Only add to minimized chats if it's a different chat
      setMinimizedChats((prev) => [...prev, selectedChat]);
    }
    setSelected(message);
    // Mark the message as read
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === message.id ? { ...msg, status: "read" } : msg
      )
    );
    // Remove the chat from minimized state if it's already minimized
    setMinimizedChats((prev) => prev.filter((chat) => chat.id !== message.id));
  };

  // Handle minimizing the current chat
  const minimizeChat = () => {
    if (selectedChat) {
      setMinimizedChats((prev) => [...prev, selectedChat]);
      setSelected(null); // Close the currently open chat
    }
  };

  // Handle closing the current chat
  const closeChat = (message) => {
    setMinimizedChats((prev) => prev.filter((chat) => chat.id !== message.id));
    if (selectedChat && selectedChat.id === message.id) {
      setSelected(null);
    }
  };

  // Handle clicking outside to close the chat list
  const handleClickOutside = (e) => {
    if (
      (chatListRef.current && !chatListRef.current.contains(e.target)) &&
      (chatRef.current && !chatRef.current.contains(e.target))
    ) {
      setChatListVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Chat List */}
      {isChatListVisible && (
        <div ref={chatListRef} className="absolute top-0 right-9 bg-white w-80 rounded-lg shadow-md z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-[#9800ff]">Messages</h2>
            <div>

            
              <Link to="/shop/MerchantMessages">
              <button className="p-2 text-slate-800">
                <FontAwesomeIcon icon={faMessage} size="lg" />
                </button> 
              </Link>
              
            <button
              className="hover:text-primary-color text-slate-800 btn-sm"
              onClick={() => setChatListVisible(false)} // Hides the Chat List
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            </div>
           
          </div>
          <div className="max-h-60 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-center gap-4 p-3 hover:text-primary-color cursor-pointer ${message.status === "unread" ? "bg-violet-100" : ""}`}
                onClick={() => openChat(message)}
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{message.name}</span>
                  {/* Show the last message only if chatHistory exists and is non-empty */}
                  <div className="text-xs text-gray-600 mt-1">
                    {message.chatHistory && message.chatHistory.length > 0
                      ? message.chatHistory[message.chatHistory.length - 1].text
                      : "No messages"}
                  </div>
                </div>
                {/* Display unread indicator only for chats with messages */}
                {message.chatHistory.length > 0 && message.status === "unread" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-color ml-auto self-center"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Detail View */}
      {selectedChat && (
        <div
          ref={chatRef}
          className={`fixed ${
            isMobile ? "top-0 left-0 w-full" : "bottom-4 right-12 w-80"
          } bg-slate-100 rounded-lg shadow-lg shadow-slate-300 transition-all z-50 flex flex-col`}
          style={{
            height: isMobile ? "100vh" : "50vh", // Full-screen height on mobile
          }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-[#9800ff]">{selectedChat.name}</h2>
            <div className="flex items-center gap-2">
              <button
                className="hover:text-primary-color text-slate-800 btn-sm"
                onClick={minimizeChat}
              >
                <FontAwesomeIcon icon={faMinus} size="lg" />
              </button>
              <button
                className="hover:text-primary-color text-slate-800 btn-sm"
                onClick={() => closeChat(selectedChat)}
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            {/* Show all chat messages only if chatHistory exists */}
            {selectedChat.chatHistory && selectedChat.chatHistory.length > 0 ? (
              <div className="flex flex-col gap-1 p-4">
                {selectedChat.chatHistory.map((chat, index) => (
                  <div key={index} className={`chat ${chat.from === "user" ? "chat-start" : "chat-end"}`}>
                    <div className={`chat-bubble ${chat.from === "user" ? "bg-slate-200 text-black" : "bg-blue-500 text-white"}`}>
                      {chat.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-600">No messages yet.</div>
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

      {/* Minimized Chat Bubbles */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {minimizedChats.map((chat, index) => (
          <div
            key={index}
            className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md shadow-slate-100 cursor-pointer"
            onClick={() => openChat(chat)}
          >
            {chat.name[0]} {/* Display the first letter of the chat name */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
