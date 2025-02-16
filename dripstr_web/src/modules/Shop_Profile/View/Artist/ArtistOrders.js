import React from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import streetBG from "@/assets/streetbg.png";
import starBG from "@/assets/starDrp.png";
import sample1 from "@/assets/images/samples/2.png";
import cust1 from "@/assets/shop/erica.jpg";
import cust2 from "@/assets/shop/sample2.jpg";
import cust3 from "@/assets/shop/nevercry.jpg";
import drp from "@/assets/DrpTxt.png";
import logo from "@/assets/shop/shoplogo.jpg";
import sample3 from "@/assets/images/samples/5.png";
import sample2 from "@/assets/images/samples/10.png";
import hmmmEmote from "@/assets/emote/hmmm.png";
import { supabase } from "@/constants/supabase";

const { useState, useEffect } = React;
const CustnameData = [
  {
    id: 1,
    photo: cust1,
    order: sample2,
    name: "Erina Mae",
    message: "Just order an Item.",
    status: "sent",
    orderRating: "to rate",
    timeSent: "2m ago",
    reply: " Thank you for purchasing on our store.",
    follow: "Followers",
  },
  {
    id: 2,
    photo: cust2,
    order: sample3,
    name: "Paolo",
    message: "Just order an Item.",
    status: "read",
    timeSent: "1h ago",
    orderRating: "4",
    follow: "Followers",
    message2: "The product is good<3",
    reply: " Thank you for purchasing on our store.",
  },
  {
    id: 3,
    photo: cust3,
    order: sample1,
    name: "Queen",
    message: "Just order an Item.",
    status: "sent",
    timeSent: "1m ago",
    orderRating: "to rate",
    reply: " Thank you for purchasing on our store.",
    follow: "Customer",
  },
];

function AristOrders() {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [userId, setUserId] = useState(null);
  const [artist, setArtist] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        console.error("Error fetching user:", error?.message);
        return;
      }
      setCurrentUser(userData.user);
    };
    fetchUser();
  }, []);

  // Fetch artist details for the current user
  useEffect(() => {
    if (!currentUser) return;

    const fetchArtistDetails = async () => {
      const { data, error } = await supabase
        .from("artist")
        .select("id, artist_Name, artist_Image, owner_Id")
        .eq("owner_Id", currentUser.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching artist details:", error.message);
        return;
      }
      if (data) {
        setArtist(data);
        setSelectedArtistId(data.id);
      }
    };

    fetchArtistDetails();
  }, [currentUser]);

  // Fetch messages with sender profile joined (for current artist)
  const fetchMessagesWithSenderProfile = async () => {
    if (!artist || !artist.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("artist_Messages")
        .select(
          `
        id,
        sender_Id,
        content,
        what_for,
        created_at,
        status,
        profiles:sender_Id (id, full_name, profile_picture)
      `
        )
        .eq("artist_Id", artist.id);

      if (error) {
        console.error(
          "Error fetching messages with sender profile:",
          error.message
        );
        return;
      }

      console.log("Fetched messages with sender profile:", data);

      // Flatten messages and attach sender profile
      const allMessages = data.flatMap((row) => {
        if (!row || !row.content) {
          console.warn("Skipping row due to missing content:", row);
          return [];
        }

        let parsedContent;
        try {
          parsedContent =
            typeof row.content === "string"
              ? JSON.parse(row.content)
              : row.content;
        } catch (error) {
          console.error("Error parsing content:", error);
          return [];
        }

        return (
          Array.isArray(parsedContent) ? parsedContent : [parsedContent]
        ).map((msg) => ({
          ...msg,
          sender: row.profiles || {
            id: "unknown",
            full_name: "Unknown User",
            profile_picture: null,
          },
          artist_Id: row.artist_Id, 
          conversation_Id: row.id || "unknown",
          created_at: row.created_at || new Date().toISOString(),
          what_for: row.what_for || "",
          status: row.status ?? false,
        }));
        
      });

      console.log("Processed messages:", allMessages);

      setMessages(allMessages);
    } catch (err) {
      console.error("Unexpected error fetching messages:", err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("Selected user updated:", selectedUser);
  }, [selectedUser]);

  // Fetch messages when artist is set
  useEffect(() => {
    if (artist && artist.id) {
      fetchMessagesWithSenderProfile();
    }
  }, [artist]);

  const sortedData = [...messages].sort((a, b) =>
    a.status === "sent" ? -1 : 1
  );

  // Use useEffect to call the function when artist is set
  useEffect(() => {
    if (artist && artist.id) {
      fetchMessagesWithSenderProfile();
    }
  }, [artist]);

  useEffect(() => {
    console.log("Updated selectedUser:", selectedUser);
  }, [selectedUser]);

  const handleCloseChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedUser(null);
      setIsClosing(false);
    }, 500);
  };
  const handleChatClick = async (clickedMessage) => {
    console.log("Clicked Sender Data:", clickedMessage);
  
    const senderMessages = messages.filter(
      (msg) => msg.sender_Id === clickedMessage.sender_Id
    );
  
    if (senderMessages.length === 0) {
      console.error("No messages found for this sender.");
      return;
    }
  
    // Force re-render by setting a new object reference
    setSelectedUser((prev) => ({
      ...prev,
      sender: clickedMessage.sender,
      messages: [...senderMessages], // Ensure it's a new array reference
    }));
  
    // Update status in DB
    const { error } = await supabase
      .from("artist_Messages")
      .update({ status: true })
      .eq("sender_Id", clickedMessage.sender_Id)
      .eq("artist_Id", artist.id);
  
    if (error) {
      console.error("Error updating message status:", error.message);
    } else {
      console.log("Message status updated in DB!");
    }
  };
  useEffect(() => {
    console.log("Updated selectedUser:", selectedUser);
    setMessages(selectedUser?.messages || []);
  }, [selectedUser]);  

  const uniqueSenders = Object.values(
    sortedData.reduce((acc, message) => {
      if (!acc[message.sender?.id]) {
        acc[message.sender?.id] = message;
      }
      return acc;
    }, {})
  );

  const handleSendMessage = async () => {
    if (!selectedUser || !selectedUser.messages.length) {
      console.error(" No selected user or messages to update!");
      return;
    }

    const messageId = selectedUser.messages[0].conversation_Id; // Get conversation ID
    const artistId = artist?.id;

    console.log("🛠 Sending message with:", {
      messageId,
      artistId,
      senderId: currentUser?.id,
    });

    if (!messageId || !artistId) {
      console.error("No selected message or invalid message ID!");
      return;
    }

    // Upload image if it exists
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await handleUploadImage();
      if (!imageUrl) {
        console.error(" Failed to upload image.");
        return;
      }
    }

    const newMessage = {
      text: messageContent,
      send_file: imageUrl || null,
      artist_Id: artist.id,
      timestamp: new Date().toISOString(),
    };

    try {
      // Fetch the current message content
      const { data, error: fetchError } = await supabase
        .from("artist_Messages")
        .select("content")
        .eq("id", messageId)
        .single();

      if (fetchError) {
        console.error("Error fetching selected message:", fetchError.message);
        return;
      }

      const updatedContent = Array.isArray(data.content)
        ? [...data.content, newMessage]
        : [newMessage];

      // Update the content in the DB
      const { error: updateError } = await supabase
        .from("artist_Messages")
        .update({ content: updatedContent })
        .eq("id", messageId);

      if (updateError) {
        console.error(" Error updating message:", updateError.message);
        return;
      }

      console.log("Message sent successfully!");

      // Update the local state immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          sender: {
            id: currentUser.id,
            full_name: currentUser.full_name,
            profile_picture: currentUser.profile_picture,
          },
          conversation_Id: messageId,
          created_at: new Date().toISOString(),
          what_for: selectedUser.messages[0].what_for,
          status: true,
        },
      ]);

      // Update the selectedUser's messages
      setSelectedUser((prevSelectedUser) => ({
        ...prevSelectedUser,
        messages: [
          ...prevSelectedUser.messages,
          {
            ...newMessage,
            sender: {
              id: currentUser.id,
              full_name: currentUser.full_name,
              profile_picture: currentUser.profile_picture,
            },
            conversation_Id: messageId,
            created_at: new Date().toISOString(),
            what_for: selectedUser.messages[0].what_for,
            status: true,
          },
        ],
      }));

      // Clear input fields
      setMessageContent("");
      setImageFile(null);
    } catch (error) {
      console.error("Unexpected error sending message:", error.message);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return null;

    // Create a unique image name
    const uniqueImageName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}-${imageFile.name}`;
    // Use the unique name in the file path (adjust bucket name as needed)
    const filePath = `messages/${currentUser.id}/${uniqueImageName}`;
    console.log("Uploading image to:", filePath);

    const { error: uploadError } = await supabase.storage
      .from("art_messages")
      .upload(filePath, imageFile);
    if (uploadError) {
      console.error("Error uploading image:", uploadError.message);
      return null;
    }

    // Retrieve public URL – note: getPublicUrl returns an object with data.publicUrl
    const { data, error: publicUrlError } = supabase.storage
      .from("art_messages")
      .getPublicUrl(filePath);
    if (publicUrlError) {
      console.error("Error getting public URL:", publicUrlError.message);
      return null;
    }
    console.log("Image uploaded successfully. Public URL:", data.publicUrl);
    return data.publicUrl;
  };

  return (
    <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar">
      <div className="absolute mx-3 right-0 z-20">
        <ArtistSideBar />
      </div>

      <div className="w-full h-full bg-slate-300 md:px-10 lg:px-16">
        <div className="w-full h-full bg-slate-100 flex">
          {/* Left Sidebar with Customer Data */}
          <div className="w-2/5 bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1 h-full shadow-black">
            <div className="text-2xl font-semibold p-2 py-5 text-white flex items-center justify-between">
              <label>Messages</label>
              <box-icon
                type="solid"
                color="#4D077C"
                name="message-square-dots"
              />
            </div>
            <div className="h-[500px] overflow-hidden overflow-y-scroll rounded-md bg-slate-100 bg-opacity-40 glass shadow-black w-full shadow-inner pt-2 pl-2">
              {uniqueSenders.map((message, index) => (
                <div
                  key={index}
                  onClick={() => handleChatClick(message)} // Show the conversation in another UI
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
                        message.sender?.profile_picture || "/default-avatar.png"
                      }
                      alt={`Profile picture of ${
                        message.sender?.full_name || "User"
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
                      {message.sender?.full_name || "Unknown User"}
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
          <div className="w-full relative bg-gradient-to-bl from-violet-500 to-fuchsia-500 h-full">
            {/* Background Images */}
            <div className="absolute z-10 top-0 right-0">
              <img
                src={streetBG}
                className="drop-shadow-customWhite h-full w-full object-cover rounded-full"
                sizes="100%"
              />
            </div>
            <div className="absolute z-0 bottom-0 left-0">
              <img
                src={starBG}
                className="drop-shadow-customWhite h-full w-full object-cover rounded-full"
                sizes="100%"
              />
            </div>
            <div className="absolute top-32 z-0">
              <img
                src={drp}
                className="drop-shadow-customWhite h-full w-full object-cover rounded-full"
                sizes="100%"
              />
            </div>
            {selectedUser && (
              <div
                className={`w-full relative z-10 bg-violet-100 h-full flex ${
                  isClosing ? "fade-out" : "fade-in"
                }`}
              >
                <div className="w-full">
                  {/* Chat Header: Display sender's image & name */}
                  <div className="bg-white relative z-10 shadow-sm shadow-slate-400 w-full p-2 px-5 py-3 flex items-center justify-between gap-2">
                    <div className="flex gap-4 items-center">
                      <div className="h-10 w-10 border-[2px] border-primary-color rounded-full">
                        {selectedUser.sender?.profile_picture ? (
                          <img
                            src={selectedUser.sender.profile_picture}
                            alt={selectedUser.sender.full_name}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            No Image
                          </div>
                        )}
                      </div>
                      <span className="text-2xl font-bold iceland-regular text-slate-800">
                        {selectedUser.sender?.full_name || "Unknown User"}
                      </span>
                    </div>
                    <div
                      onClick={handleCloseChat}
                      className="cursor-pointer rounded-md p-1 hover:scale-95 duration-300 flex justify-center"
                    >
                      <box-icon name="message-square-x" color="#000"></box-icon>
                    </div>
                  </div>

                  {/* Chat History */}
                  <div className="h-[500px] w-full bg-white overflow-y-scroll custom-scrollbar p-2 overflow-hidden">
                    {selectedUser && selectedUser.messages ? (
                      <>
                        {selectedUser.messages.length > 0 ? (
                          selectedUser.messages.map((message, index) => {
                            console.log("Rendering Message:", message);

                            const isSenderMessage =
                              message.sender_Id !== undefined; // If sender_Id exists, it's on the left
                            const isArtistMessage =
                              message.artist_Id !== undefined; // If artist_Id exists, it's on the right

                            return (
                              <div
                                key={index}
                                className={`chat ${
                                  isSenderMessage ? "chat-start" : "chat-end"
                                }`}
                              >
                                {isSenderMessage && (
                                  <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                      <img
                                        src={
                                          message.sender?.profile_picture ||
                                          "/default-avatar.png"
                                        }
                                        alt={
                                          message.sender?.full_name || "Sender"
                                        }
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="chat-header font-semibold text-slate-800">
                                  {isSenderMessage
                                    ? message.sender?.full_name || "Sender"
                                    : "Artist"}
                                  <time className="text-xs ml-2 opacity-50">
                                    {new Date(
                                      message.timestamp
                                    ).toLocaleTimeString()}
                                  </time>
                                </div>

                                <div
                                  className={`chat-bubble text-sm ${
                                    isSenderMessage
                                      ? "bg-violet-500 text-white"
                                      : "bg-white text-black"
                                  }`}
                                >
                                  {message.text || "No message content"}

                                  {message.send_file && (
                                    <div className="mt-2 w-auto max-w-full sm:max-w-[12rem] lg:max-w-[20rem]">
                                      <img
                                        src={message.send_file}
                                        alt="Attached"
                                        className="w-full h-auto object-cover rounded-md"
                                        onClick={() =>
                                          setSelectedImage(message.send_file)
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center text-gray-500">
                            No messages yet.
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-center text-gray-500">
                        Select a user to start chatting.
                      </p>
                    )}
                  </div>
                  <div className="w-full h-20 bg-slate-500">
                    {/* Message Input Area: Always shown */}
                    <div className="w-full h-20 bg-slate-600 rounded-md flex gap-1 p-1 items-center">
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
                      <div className="w-2/12 flex justify-center items-center hover:bg-primary-color glass bg-custom-purple rounded-r-md hover:scale-95 duration-150 cursor-pointer h-full">
                        <div
                          onClick={handleSendMessage}
                          className="px-4 py-2 place-content-center"
                        >
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
        </div>
      </div>
    </div>
  );
}

export default AristOrders;
