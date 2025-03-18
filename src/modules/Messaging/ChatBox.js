import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane, faMinus, faImage, faMessage } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/constants/supabase";
import { format, isSameDay } from "date-fns";

const ChatBox = ({ profile, chat, onClose, onMinimize }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const chatContainerRef = useRef(null);

  // Fetch messages for the chat
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*, merch:merchant_Id(*)")
        .eq("id", chat.id)
        .single();

      if (error) throw error;

      setMessages(data.content || []);

      // Mark all messages as read when the chat box is opened
      await markMessagesAsRead(data.content);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark all messages as read
  const markMessagesAsRead = async (messages) => {
    const unreadMessages = messages.filter((msg) => !msg.is_read);
    if (unreadMessages.length > 0) {
      const updatedMessages = messages.map((msg) => ({
        ...msg,
        is_read: true,
      }));

      try {
        await supabase
          .from("messages")
          .update({ content: updatedMessages })
          .eq("id", chat.id);
      } catch (error) {
        console.error("Error marking messages as read:", error.message);
      }
    }
  };

  // Handle sending a message (text or image)
  const sendMessage = async () => {
    if (!newMessage.trim() && !imageFile) return;

    let imageUrl = null;
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from("merchant_Messages")
        .upload(`messages/${profile.id}/${Date.now()}`, imageFile);
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
      text: imageUrl ? "Client send an image file." : newMessage,
      send_file: imageUrl,
      sender_id: profile.id,
      timestamp: new Date().toISOString(),
    };

    const updatedContent = [...messages, newMessageObj];
    
    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ content: updatedContent, last_message: imageUrl ? "Client send an image file." : newMessage, is_read: true, is_readM: false})
        .eq("id", chat.id)
        .select("*, merch:merchant_Id(*)")
        .single();

      if (error) throw error;

      setMessages(updatedContent);
      setNewMessage("");
      setImageFile(null);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setNewMessage(file.name); 
    }
  };
  
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
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

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, [chat]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-11 sm:bottom-0 right-0 sm:right-4 z-[999] md:right-20 w-full sm:w-80 bg-purple-50 rounded-t-lg shadow-lg overflow-hidden transition-all  flex flex-col border border-purple-100 max-w-full">
      {/* Chat Header */}
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <img
              src={chat?.merch?.shop_image}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-white"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
          </div>
          <h2 className="text-base font-medium truncate max-w-40">{chat?.merch?.shop_name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-purple-100 hover:text-white transition-colors"
            onClick={onMinimize}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <button
            className="text-purple-100 hover:text-white transition-colors"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto h-[75vh] sm:h-72 p-3 bg-white"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#818cf8 #e0e7ff' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-3 ${msg.sender_id === profile.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm ${
                  msg.sender_id === profile.id
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
                {msg.send_file && (
                  <div className="mt-2">
                    <img
                      src={msg.send_file}
                      alt="Attachment"
                      className="rounded-md max-w-full cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
                      onClick={() => openImageModal(msg.send_file)}
                    />
                  </div>
                )}
                <div className={`text-xs mt-1 text-right ${msg.sender_id === profile.id ? "text-purple-200" : "text-gray-500"}`}>
                  {formatTimestamp(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FontAwesomeIcon icon={faMessage} size="2x" className="text-purple-200 mb-2" />
            <p>No messages yet.</p>
          </div>
        )}
      </div>

      {/* Message Input Area */}
      <div className="flex items-center bg-white border-t border-purple-100 p-2">
        {/* Image Upload Button */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer p-2 hover:bg-purple-50 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faImage} className="text-purple-500" />
          </label>
          {imageFile && (
            <div className="absolute bottom-10 left-0 bg-white p-2 rounded-lg shadow-lg border border-purple-100">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-auto max-w-40 h-auto max-h-40 z-50 object-cover rounded"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setNewMessage("");
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-3 py-2 bg-purple-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          disabled={!!imageFile}
        />

        {/* Send Button */}
        <button
          className={`ml-2 p-2 rounded-full ${
            newMessage.trim() || imageFile
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-400"
          } transition-colors`}
          onClick={sendMessage}
          disabled={!newMessage.trim() && !imageFile}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg relative max-w-full mx-4 max-h-[90vh] overflow-hidden">
            <img
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />
            <button
              onClick={closeImageModal}
              className="absolute -top-3 -right-3 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;