import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTimes, faPaperPlane, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { supabase } from "@/constants/supabase";

const ChatMessages = ({ profile, selectedChat: initialSelectedChat, onClose }) => {
  const [selectedChat, setSelectedChat] = useState(initialSelectedChat);
  const [minimizedChats, setMinimizedChats] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatListVisible, setChatListVisible] = useState(true);
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 

  const chatListRef = useRef(null);
  const chatRef = useRef(null);
  const chatContainerRef = useRef(null); 

  const fetchMessages = async () => {
    setIsLoading(true); // Start loading
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
      setIsLoading(false); // Stop loading
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const newMessageObj = {
        text: newMessage,
        send_file: null,
        sender_id: profile.id,
        timestamp: new Date().toISOString(),
      };

      const updatedContent = [...(selectedChat.content || []), newMessageObj];

      // Update the message in the database
      const { data, error } = await supabase
        .from("messages")
        .update({ content: updatedContent, last_message: newMessage })
        .eq("id", selectedChat.id)
        .select("*, merch:merchant_Id(*)") 
        .single();

      if (error) throw error;

      setSelectedChat((prev) => ({
        ...data,
        merch: prev.merch, 
      }));

      setNewMessage("");
      fetchMessages(); 
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  // Listen for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
          );
          // Update selectedChat if it's the currently open chat
          if (selectedChat && selectedChat.id === payload.new.id) {
            setSelectedChat((prev) => ({
              ...payload.new,
              merch: prev.merch, // Preserve the existing merch object
            }));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedChat]);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

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
    setSelectedChat(message);
    // Mark the message as read
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === message.id ? { ...msg, is_read: true } : msg
      )
    );
    // Remove the chat from minimized state if it's already minimized
    setMinimizedChats((prev) => prev.filter((chat) => chat.id !== message.id));
  };

  // Handle minimizing the current chat
  const minimizeChat = () => {
    if (selectedChat) {
      setMinimizedChats((prev) => [...prev, selectedChat]);
      setSelectedChat(null); // Close the currently open chat
    }
  };

  // Handle closing the current chat
  const closeChat = (message) => {
    setMinimizedChats((prev) => prev.filter((chat) => chat.id !== message.id));
    if (selectedChat && selectedChat.id === message.id) {
      setSelectedChat(null);
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

  // Auto-scroll to the bottom of the chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, selectedChat?.content]); // Scroll when messages or selectedChat.content changes

  useEffect(() => {
    if(initialSelectedChat){
      setChatListVisible(false);
      setSelectedChat(initialSelectedChat);
    }
   
  }, [initialSelectedChat]);



  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Chat List */}
      {isChatListVisible && !selectedChat && (
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
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <span className="loading loading-dots loading-xl"></span>
              </div>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-center gap-4 p-3 hover:text-primary-color cursor-pointer ${!message.is_read ? "bg-violet-100" : ""}`}
                  onClick={() => openChat(message)}
                >
                  <img
                    src={message?.merch?.shop_image}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{message?.merch?.shop_name}</span>
                    <div className="text-xs text-gray-600 mt-1">
                      {message.last_message || "No messages"}
                    </div>
                  </div>
                  {!message.is_read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-color ml-auto self-center"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-4 text-gray-600">No Messages yet</div>
            )}
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
          <div className="flex justify-between items-center p-1 border-b">
            <div className="flex gap-1 items-center">
              <img
                src={selectedChat?.merch?.shop_image}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-base font-semibold">{selectedChat?.merch?.shop_name}</h2>
            </div>
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

          <div
            ref={chatContainerRef} // Ref for the chat container
            className="flex-grow overflow-y-auto custom-scrollbar p-2"
          >
            {selectedChat.content?.length > 0 ? (
              selectedChat.content.map((msg, index) => (
                <div
                  key={index}
                  className={`chat ${
                    msg.sender_id === profile.id ? "chat-end" : "chat-start"
                  }`}
                >
                  <div
                    className={`chat-bubble text-sm ${
                      msg.sender_id === profile.id
                        ? "bg-blue-500 text-white"
                        : "bg-slate-200 text-black"
                    }`}
                  >
                    {msg.text}
                    {msg.send_file && (
                      <img
                        src={msg.send_file}
                        alt="Attachment"
                        className="mt-1 rounded-lg max-w-full"
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">No messages yet.</div>
            )}
          </div>

          <div className="flex items-center bg-slate-100 border-t p-1">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="input input-bordered flex-1"
            />
            <button
              className="btn bg-slate-800 text-white hover:bg-primary-color ml-1"
              onClick={sendMessage}
            >
              <FontAwesomeIcon icon={faPaperPlane} size="lg" />
            </button>
          </div>
        </div>
      )}

      {/* Minimized Chat Bubbles */}
      <div className="fixed bottom-60 right-4 flex flex-col gap-2">
        {minimizedChats.map((chat, index) => (
          <div
            key={index}
            className="hover:scale-105 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md shadow-slate-100 opacity-80 hover:opacity-100 cursor-pointer"
            onClick={() => openChat(chat)}
          >
            <img
              src={chat?.merch?.shop_image}
              alt="Avatar"
              className="rounded-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;