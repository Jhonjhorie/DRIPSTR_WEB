import React from "react";
import SideBar from "../Component/Sidebars";
import streetBG from "../../../assets/streetbg.png";
import starBG from "../../../assets/starDrp.png";
import sBG from "../../../assets/bgdrip.png";
import sample1 from "../../../assets/images/samples/2.png";
import cust1 from "../../../assets/shop/erica.jpg";
import cust2 from "../../../assets/shop/sample2.jpg";
import cust3 from "../../../assets/shop/nevercry.jpg";
import drp from "../../../assets/DrpTxt.png";
import "../Component/Style.css";
import logo from "../../../assets/shop/shoplogo.jpg";
import sample3 from "../../../assets/images/samples/5.png";
import sample2 from "../../../assets/images/samples/10.png";
import successEmote from "../../../assets/emote/success.png"
import { supabase } from "@/constants/supabase";



const { useState, useEffect, useRef } = React;


function Messages() {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [merchant, setMerchant] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageOrientation, setImageOrientation] = useState("landscape");

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

  // Fetch artist details based on currentUser.id
  const fetchMerchantDetails = async (userId) => {
    if (!userId) {
      console.error("User ID is null or undefined.");
      return null;
    }
    const { data, error } = await supabase
      .from("shop")
      .select("*")
      .eq("owner_Id", userId)
      .single();

    if (error) {
      console.error("Error fetching artist details:", error.message);
      return null;
    }
    return data;
  };

  // Fetch messages based on artistId
  const fetchMessages = async (merchantId) => {
    if (!merchantId) {
      console.error("Merchant ID is null or undefined.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select(
        `id, sender_id, content, created_at, is_read, profiles:sender_id (id, full_name, profile_picture)`
      )
      .eq("merchant_Id", merchantId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Error fetching messages with sender profile:",
        error.message
      );
      setLoading(false);
      return;
    }

    console.log("Fetched Messages:", data);
    setMessages(data);

    // Update selectedUser with the fetched messages
    if (selectedUser) {
      const userMessages =
        data.find((msg) => msg.id === selectedUser.id)?.content || [];
      setSelectedUser((prevUser) => ({
        ...prevUser,
        messages: userMessages,
      }));
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!currentUser) return;

    const getMerchantAndMessages = async () => {
      const merchantDetails = await fetchMerchantDetails(currentUser.id);
      if (!merchantDetails) return;

      setMerchant(merchantDetails);
      fetchMessages(merchantDetails.id);
    };

    getMerchantAndMessages();
  }, [currentUser]);

  const chatContainerRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleLoadMessages = async () => {
    if (!merchant) {
      console.error("Artist data is missing.");
      return;
    }

    setIsFetching(true);
    setLoading(true);

    try {
      await fetchMessages(merchant.id);

      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

    setIsFetching(false);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  const handleChatClick = async (message) => {
    setIsOpening(true);

    const messageContent = Array.isArray(message.content)
      ? message.content
      : [];

    try {
      const { data, error } = await supabase
        .from("messages")
        .update({  is_readM: true })
        .eq("id", message.id);

      if (error) {
        console.error("Error updating message:", error);
      } else {
        console.log("Message updated successfully:", data);

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === message.id
              ? { ...msg, is_read: true }
              : msg
          )
        );

        setMessageContent("");
        setImageFile(null);
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }

    setTimeout(() => {
      setSelectedUser({
        name: message.profiles?.full_name || "Unknown User",
        photo: message.profiles?.profile_picture || "/default-avatar.png",
        messages: messageContent,
        id: message.id,
        follow: "Following",
      });

      // Now you can access the message ID here
      console.log("Selected Message ID:", message.id);

      setIsOpening(false);
    }, 1);
  };

  const handleCloseChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedUser(null);
      setIsClosing(false);
    }, 500);
  };

  // Image upload helper function
  const handleUploadImage = async () => {
    if (!imageFile) {
      console.log("No image file selected.");
      return null;
    }

    // Validate file type and size (optional)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(imageFile.type)) {
      alert("Invalid file type. Please upload a JPEG, PNG, or GIF.");
      return null;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB max file size
    if (imageFile.size > maxSize) {
      alert("File size is too large. Please upload an image smaller than 5MB.");
      return null;
    }

    // Create a unique image name
    const uniqueImageName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}-${imageFile.name}`;
    const filePath = `messages/${currentUser.id}/${uniqueImageName}`;
    console.log("Uploading image to:", filePath);

    try {
      // Upload the image to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("merchant_Messages")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError.message);
        return null;
      }

      // Retrieve public URL after uploading
      const { data, error: publicUrlError } = supabase.storage
        .from("merchant_Messages")
        .getPublicUrl(filePath);

      if (publicUrlError) {
        console.error("Error getting public URL:", publicUrlError.message);
        return null;
      }

      console.log("Image uploaded successfully. Public URL:", data.publicUrl);

      // Optionally, clean up object URL after usage
      URL.revokeObjectURL(imageFile);

      return data.publicUrl; // Return the public URL for the image
    } catch (error) {
      console.error("Unexpected error during image upload:", error);
      return null;
    }
  };
  const handleSendMessage = async () => {
    if (!messageContent.trim() && !imageFile) return;

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await handleUploadImage();
      console.log("Image URL returned:", imageUrl);
    }

    const newMessage = {
      merchant_Id: selectedUser.artist_Id,
      text: messageContent,
      send_file: imageUrl,
      timestamp: new Date().toISOString(),
    };

    const updatedContent = Array.isArray(selectedUser.messages)
      ? [...selectedUser.messages, newMessage]
      : [newMessage];

    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ content: updatedContent, is_read: false})
        .match({ id: selectedUser.id });

      if (error) {
        console.error("Error updating message:", error);
      } else {
        console.log("Message updated successfully:", data);

        // Update messages state
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === selectedUser.id
              ? { ...msg, content: updatedContent }
              : msg
          )
        );

        // Update selectedUser state
        setSelectedUser((prevUser) => ({
          ...prevUser,
          messages: updatedContent,
        }));

        // Clear input fields
        setMessageContent("");
        setImageFile(null);
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };
  



  return (
    <div className="h-full w-full bg-slate-300  ">
      <div className="absolute mx-3 right-0 z-20">
        <SideBar />
      </div>

      <div className="w-full h-full overflow-hidden bg-slate-300 md:px-10 lg:px-16">
        <div className="w-full h-full bg-slate-100 md:flex ">
          {/* Left Sidebar with Customer Data */}
          <div className="md:w-2/5 w-full bg-gradient-to-br relative from-violet-500 to-fuchsia-500 p-1 h-auto shadow-black">
            <div className="text-2xl font-semibold p-2 py-5 text-white flex items-center justify-between">
              <label>Messages</label>
              <box-icon
                type="solid"
                color="#4D077C"
                name="message-square-dots"
              />
            </div>
            <div className="h-[500px] overflow-hidden overflow-y-scroll rounded-md bg-slate-100 bg-opacity-40 glass shadow-black w-full shadow-inner md:pt-2 p-2 md:p-0 md:pl-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  onClick={() => handleChatClick(message)}
                  className={`relative hover:scale-95 duration-300 cursor-pointer items-center mb-1 flex gap-2 p-1 rounded-md shadow-md ${
                    message.status === false
                      ? "bg-violet-500 text-white"
                      : "bg-white"
                  }`}
                >
                  <div
                    className={`h-12 w-12 ${
                      message.status === false
                        ? "border-[2px] border-violet-500 rounded-full"
                        : "border-[2px] border-slate-400 rounded-full"
                    }`}
                  >
                    <img
                      src={
                        message.profiles?.profile_picture ||
                        successEmote
                      }
                      alt={`Profile picture of ${
                        message.profiles?.full_name || "User"
                      }`}
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        message.status === false
                          ? "text-white"
                          : "text-slate-700"
                      }`}
                    >
                      {message.profiles?.full_name || "Unknown User"}
                    </div>
                  </div>
                  <div className="absolute top-1 text-sm right-2">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right Chat Window */}
          <div className="w-full absolute md:top-0 top-32 md:relative bg-gradient-to-bl from-violet-500 to-fuchsia-500 md:h-full">
            {/* Background Images */}
            <div className="hidden md:absolute md:block  z-10 top-0 right-0">
              <img
                src={streetBG}
                className="drop-shadow-customWhite h-full w-full object-cover rounded-full"
                sizes="100%"
              />
            </div>
            <div className="hidden md:absolute md:block z-0 bottom-0 left-0">
              <img
                src={starBG}
                className="drop-shadow-customWhite h-full w-full object-cover rounded-full"
                sizes="100%"
              />
            </div>
            <div className="hidden md:absolute md:block  top-32 z-0">
              <img
                src={drp}
                className="drop-shadow-customWhite h-full w-full object-cover rounded-full"
                sizes="100%"
              />
            </div>
            {selectedUser && (
              <div
                className={`w-full md:h-full relative z-10 md:mb-0 mb-16 bg-custom-purple glass flex ${
                  isClosing ? "fade-out" : "fade-in"
                }`}
              >
                <div className="w-full h-auto">
                  <div className="bg-white relative z-10 shadow-sm shadow-slate-400 w-full h-auto p-2 px-5 py-3 flex place-items-center justify-between gap-2">
                    <div className="flex gap-2 place-items-center">
                      <div className="h-12 w-12 border-[2px] border-primary-color rounded-full">
                        <img
                          src={selectedUser.photo}
                          className="h-full w-full object-cover rounded-full"
                          sizes="100%"
                        />
                      </div>
                      <label className="text-slate-800 font-semibold">
                        {selectedUser.name}
                      </label>
                    </div>
                    <div
                      onClick={handleCloseChat}
                      className="hover:scale-95 duration-300 md:pr-20 cursor-pointer rounded-md p-1 justify-center flex"
                    >
                      <box-icon name="message-square-x" color="#000"></box-icon>
                    </div>
                  </div>

                  {/* Set fixed height for the chat area */}
                  <div
                    ref={chatContainerRef}
                    className="h-[65vh] w-full bg-white overflow-y-scroll custom-scrollbar p-4"
                  >
                    {selectedUser && selectedUser.messages ? (
                      <>
                        {selectedUser.messages.length > 0 ? (
                          selectedUser.messages.map((message, index) => {
                            console.log("Rendering Message:", message);

                            const isSenderMessage =
                              message.sender_Id !== undefined;
                            const isMerchantMessage =
                              message.merchant_Id !== undefined;

                            return (
                              <div
                                key={index}
                                className={`chat ${
                                  isSenderMessage ? "chat-start" : "chat-end"
                                } mb-4`}
                              >
                                {/* Sender Image */}
                                {isSenderMessage && selectedUser && (
                                  <div className="chat-image avatar mr-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
                                      <img
                                        src={selectedUser.photo || successEmote}
                                        alt={
                                          message.sender?.full_name || "Sender"
                                        }
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Chat Body */}
                                <div
                                  className={`chat-body flex  flex-col space-y-2 ${
                                    isSenderMessage
                                      ? "items-start"
                                      : "items-end"
                                  }`}
                                >
                                  {/* Chat Header */}
                                  <div
                                    className={`chat-header font-semibold w-full justify-between  text-slate-800 flex items-center ${
                                      isSenderMessage
                                        ? "justify-start"
                                        : "justify-end"
                                    }`}
                                  >
                                    <span
                                      className={`text-sm ${
                                        isSenderMessage
                                          ? "text-start"
                                          : "text-left"
                                      }`}
                                    >
                                      {isSenderMessage && selectedUser
                                        ? selectedUser.name || "Sender"
                                        : "You"}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-2">
                                      {new Date(
                                        message.timestamp
                                      ).toLocaleString()}
                                    </span>
                                  </div>

                                  {/* Chat Bubble */}
                                  <div
                                    className={`chat-bubble shadow-lg px-4 py-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg text-sm relative 
    ${
      isSenderMessage
        ? "bg-violet-500 text-white  "
        : "bg-gray-300 text-gray-800"
    } 
    flex flex-col`}
                                  >
                                    <p>
                                      {message.text || "No message content"}
                                    </p>

                                    {message.send_file && (
                                      <div className="mt-2 w-full max-w-[18rem] sm:max-w-[20rem] lg:max-w-[25rem]">
                                        <img
                                          src={message.send_file}
                                          alt="Attached"
                                          className="w-full h-auto object-cover rounded-lg shadow-md cursor-pointer"
                                          onClick={() =>
                                            setSelectedImage(message.send_file)
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center text-gray-500">
                            No messages yet.
                          </p>
                        )}
                        <div className="w-full h-auto">
                          <div className="justify-center text-center text-sm">
                            {!isFetching ? (
                              <h1
                                onClick={handleLoadMessages}
                                className="cursor-pointer text-custom-purple"
                              >
                                Click to Load new message
                              </h1>
                            ) : null}

                            {isFetching && (
                              <span className="loading bg-blue-600 rounded-md loading-dots loading-xs"></span>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-gray-500">
                        Select a user to start chatting.
                      </p>
                    )}
                  </div>

                  <div className="w-full h-20 bg-slate-900">
                    {/* Message Input Area: Always shown */}
                    <div className="w-full h-20 bg-custom-purple glass rounded-sm flex gap-1 p-1 items-center">
                      <div className="w-full h-full relative">
                        {/* Image Preview (if selected) */}
                        {imageFile && (
                          <div className="absolute top-0 left-0 z-10 p-1">
                            <img
                              src={URL.createObjectURL(imageFile)}
                              alt="Preview"
                              className="w-5 h-5 object-cover rounded"
                            />
                            <button
                              onClick={() => setImageFile(null)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                              data-tip="Cancel Image"
                            >
                              &times;
                            </button>
                          </div>
                        )}
                        <textarea
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          placeholder="Type your Inquiry Here..."
                          className={`h-full w-full p-1 bg-slate-200 border-custom-purple rounded-l-md border resize-none text-slate-800 text-sm ${
                            imageFile ? "pt-7" : ""
                          }`}
                        />
                        <div
                          data-tip="Add image"
                          className="w-7 tooltip tooltip-left absolute right-0 top-11 h-7 cursor-pointer hover:scale-105 duration-150"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              console.log("Selected file:", file);
                              setImageFile(file);
                            }}
                            className="hidden"
                            id="message-image-input"
                          />
                          <label
                            htmlFor="message-image-input"
                            className="cursor-pointer"
                          >
                            <box-icon
                              type="solid"
                              color="black"
                              name="file-image"
                            ></box-icon>
                          </label>
                        </div>
                      </div>
                      <div
                        className={`w-2/12 flex justify-center items-center hover:bg-primary-color glass bg-custom-purple rounded-r-md hover:scale-95 duration-150 cursor-pointer h-full ${
                          !messageContent || !selectedUser
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={
                          messageContent && selectedUser
                            ? handleSendMessage
                            : null
                        }
                      >
                        <div className="px-4 py-2 place-content-center">
                          <box-icon
                            type="solid"
                            name="send"
                            size="30px"
                          ></box-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative p-2 bg-custom-purple">
                <img
                  src={selectedImage}
                  alt="Full-size preview"
                  onLoad={(e) => {
                    const img = e.target;
                    setImageOrientation(
                      img.naturalWidth > img.naturalHeight
                        ? "landscape"
                        : "portrait"
                    );
                  }}
                  className="rounded shadow-lg object-contain max-w-[90vw] max-h-[90vh]"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 text-white text-3xl p-2 drop-shadow-lg bg-black bg-opacity-50 rounded-full"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
