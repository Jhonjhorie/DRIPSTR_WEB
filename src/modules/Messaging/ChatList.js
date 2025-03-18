import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTimes, faCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/constants/supabase";
import { format } from "date-fns";

const ChatList = ({ profile, onSelectChat }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const chatListRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check on initial load
    checkMobile();
    
    // Set up event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*, merch:merchant_Id(*)")
        .eq("receiver_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to mark a message as read
  const markMessageAsRead = async (messageId) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId)
        .select();

      if (error) throw error;

      // Update the local state to reflect the change
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleChat = () => {
    navigate(`/chat`, { state: { messages } });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return format(new Date(timestamp), "MM/dd/yyyy hh:mm a");
  };

  return (
    <div 
      ref={chatListRef} 
      className={`fixed z-50 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden ${
        isMobile 
          ? "inset-0 m-4" 
          : "top-16 right-4 md:right-24 w-full max-w-xs sm:max-w-md md:w-96"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 sticky top-0">
        <h2 className="text-lg font-serif text-purple-800">Messages</h2>
        <div className="flex space-x-3">
          <button 
            className="text-purple-700 hover:text-purple-900 transition-colors duration-200" 
            onClick={handleChat}
          >
            <FontAwesomeIcon icon={faMessage} size="lg" />
          </button>
          <button
            className="text-gray-500 hover:text-purple-700 transition-colors duration-200"
            onClick={() => onSelectChat(null)}
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
      </div>
      
      <div className={`overflow-y-auto scrollbar-thin custom-scrollbar scrollbar-thumb-purple-200 scrollbar-track-gray-50 ${
        isMobile ? "max-h-[calc(100vh-8rem)]" : "max-h-96"
      }`}>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start p-4 border-b border-gray-50 hover:bg-purple-50 transition-colors duration-150 cursor-pointer ${
                !message.is_read ? "bg-blue-50" : ""
              }`}
              onClick={async () => {
      
                await markMessageAsRead(message.id);
                
              
                onSelectChat(message);
                
                if (isMobile) {
                  navigate(`/chat`, { state: { selectedMessageId: message.id } });
                }
              }}
            >
              <div className="relative">
                <img
                  src={message?.merch?.shop_image || "https://via.placeholder.com/40"}
                  alt={message?.merch?.shop_name || "Shop"}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200"
                />
                {!message.is_read && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full border-2 border-white"></span>
                )}
              </div>
              
              <div className="ml-3 sm:ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-800 truncate max-w-32 sm:max-w-full">{message?.merch?.shop_name || "Unknown Shop"}</span>
                  <span className="text-xs text-gray-500 font-light whitespace-nowrap ml-1">
                    {format(new Date(message.created_at), "MM/dd")}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {message.last_message || "No messages"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <FontAwesomeIcon icon={faMessage} size="2x" className="text-purple-200 mb-3" />
            <p className="text-center">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;