import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/constants/supabase";
import successEmote from "@/assets/emote/success.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faImage, faTimes, faArrowLeft, faCheckDouble, faCircle, faBars } from "@fortawesome/free-solid-svg-icons";
import { format, isSameDay } from "date-fns";

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const messages1 = location.state?.messages;
  const selectedMessageId = location.state?.selectedMessageId;
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState(messages1 || []);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check if mobile screen
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Always show sidebar on mobile when no chat is selected
      setShowSidebar(mobile && !selectedUser ? true : !mobile);
    };
    
    // Check on initial load
    checkMobile();
    
    // Set up event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [selectedUser]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      setCurrentUser(data?.user || null);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // If a specific message ID was passed, select that chat
    if (selectedMessageId) {
      const message = messages.find(msg => msg.id === selectedMessageId);
      if (message) {
        handleChatClick(message);
      }
    }
  }, [messages, selectedMessageId]);

  const fetchMessages = async (userId) => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select(`*, profiles:sender_id (id, full_name, profile_picture), merch:merchant_Id(*)`)
      .eq("merchant_Id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error.message);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  // Handle real-time updates
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUser]);

  const handleChatClick = async (message) => {
    setSelectedUser({
      id: message.id,
      merchantId: message.merchant_Id,
      name: message.merch?.shop_name || "Unknown Shop",
      photo: message.merch?.shop_image || successEmote,
      messages: message.content || [],
    });

    // On mobile, hide the sidebar when a chat is selected
    if (isMobile) {
      setShowSidebar(false);
    }

    // Mark the message as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", message.id);
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() && !imageFile) return;

    let imageUrl = null;
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from("merchant_Messages")
        .upload(`messages/${currentUser.id}/${Date.now()}`, imageFile);

      if (error) {
        console.error("Error uploading image:", error.message);
        return;
      }
      
      const { data: fileData } = supabase.storage
        .from("merchant_Messages")
        .getPublicUrl(data.path);
        
      imageUrl = fileData.publicUrl;
    }

    const newMessageObj = {
      text: imageFile ? "Client sent an image file." : messageContent,
      send_file: imageUrl,
      sender_id: currentUser.id,
      timestamp: new Date().toISOString(),
    };

    // Add new message to the current chat
    const updatedMessages = [...selectedUser.messages, newMessageObj];
    
    try {
      const { error } = await supabase
        .from("messages")
        .update({ 
          content: updatedMessages, 
          last_message: imageFile ? "Client sent an image file." : messageContent,
          is_read: true,
          is_readM: false
        })
        .eq("id", selectedUser.id);

      if (error) throw error;
      
      // Update the UI
      setSelectedUser({
        ...selectedUser,
        messages: updatedMessages
      });
      
      setMessageContent("");
      setImageFile(null);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const messageDate = new Date(timestamp);
    const today = new Date();

    // If the message was sent today, only show the time
    if (isSameDay(messageDate, today)) {
      return format(messageDate, "hh:mm a");
    }

    // Otherwise, show the full date and time
    return format(messageDate, "MM/dd/yyyy hh:mm a");
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedUser?.messages]);

  return (
    <div className="h-[85vh]  md:h-[85vh] w-full bg-gray-50">
      <div className="max-w-screen-xl mx-auto h-full mb-20 sm:mb-0 overflow-hidden flex flex-col md:flex-row shadow-lg">
        {/* Left Sidebar with Customer Data */}
        {showSidebar && (
          <div className={`${isMobile ? 'w-full' : 'w-full md:w-1/3'} bg-white border-r border-gray-200 md:block flex flex-col h-full`}>
            <div className="bg-gradient-to-r from-gray-600 to-gray-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-serif">Messages</h2>
              {isMobile && (
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    onClick={() => handleChatClick(message)}
                    className={`relative flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-all hover:bg-purple-50 ${
                      !message.is_read 
                        ? "bg-purple-50 border-l-4 border-purple-500" 
                        : "bg-white border border-gray-100"
                    } ${selectedUser?.id === message.id ? "ring-2 ring-purple-300" : ""}`}
                  >
                    <div className="relative mr-3">
                      <img
                        src={message?.merch?.shop_image || successEmote}
                        alt="Profile"
                        className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full border border-gray-200"
                      />
                      {!message.is_read && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-purple-500 border-2 border-white"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {message?.merch?.shop_name || "Unknown User"}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {message.last_message || "No messages"}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(message.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <FontAwesomeIcon icon={faCircle} className="text-purple-200 mb-2" />
                  <p>No messages found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Chat Window */}
        <div className={`${isMobile && !selectedUser ? 'hidden' : 'flex '
} ${isMobile ? 'w-full ' : 'w-full md:w-2/3 '} h-full flex-col bg-purple-50`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <button 
                    onClick={() => isMobile ? setShowSidebar(true) : setSelectedUser(null)}
                    className="mr-3 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                  
                  <div className="relative mr-3">
                    <img
                      src={selectedUser.photo}
                      className="h-10 w-10 object-cover rounded-full border border-gray-200"
                      alt="User"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-800 truncate max-w-32 sm:max-w-full">{selectedUser.name}</h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                
                {!isMobile && (
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
                
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="text-gray-500 hover:text-purple-600 transition-colors md:hidden"
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-white bg-opacity-50"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#818cf8 #e0e7ff' }}
              >
                {selectedUser.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-3 shadow-sm ${
                        message.sender_id === currentUser?.id 
                          ? "bg-purple-600 text-white rounded-br-none" 
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm break-words">{message.text || "No message content"}</p>
                      
                      {message.send_file && (
                        <div className="mt-2">
                          <img
                            src={message.send_file}
                            alt="Attachment"
                            className="rounded-md max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedImage(message.send_file)}
                          />
                        </div>
                      )}
                      
                      <div className={`text-xs mt-1 flex items-center justify-end ${
                        message.sender_id === currentUser?.id ? "text-purple-200" : "text-gray-500"
                      }`}>
                        <span>{formatTimestamp(message.timestamp)}</span>
                        {message.sender_id === currentUser?.id && (
                          <FontAwesomeIcon
                            icon={faCheckDouble}
                            className="ml-1 text-green-300"
                            size="xs"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Area */}
              <div className="p-3 bg-white border-t border-gray-200">
                {imageFile && (
                  <div className="mb-2 p-2 bg-purple-50 rounded-lg flex items-center">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="h-12 w-12 sm:h-14 sm:w-14 object-cover rounded-md border border-gray-200"
                    />
                    <div className="ml-2 flex-1">
                      <p className="text-sm text-gray-700 truncate">{imageFile.name}</p>
                      <p className="text-xs text-gray-500">{(imageFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => setImageFile(null)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
                  >
                    <FontAwesomeIcon icon={faImage} />
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 mx-2 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim() && !imageFile}
                    className={`p-2 rounded-full ${
                      messageContent.trim() || imageFile
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-200 text-gray-400"
                    } transition-colors`}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faCircle} size="3x" className="text-purple-200" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-purple-800 mb-2">No conversation selected</h3>
              <p className="text-sm text-gray-500 text-center px-4">
                {isMobile ? "Tap menu to select a chat" : "Select a chat from the sidebar to start messaging"}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-3xl max-h-[90vh] w-full mx-4 bg-white p-2 sm:p-4 rounded-lg relative">
            <img
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;