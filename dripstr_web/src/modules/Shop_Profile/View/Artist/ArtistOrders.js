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
  const [artistId, setArtistId] = useState(null);

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
  const fetchArtistDetails = async (userId) => {
    if (!userId) {
      console.error("User ID is null or undefined.");
      return null;
    }
    const { data, error } = await supabase
      .from("artist")
      .select("id, artist_Name, artist_Image, owner_Id")
      .eq("owner_Id", userId)
      .single();

    if (error) {
      console.error("Error fetching artist details:", error.message);
      return null;
    }
    return data;
  };

  // Fetch messages based on artistId
  const fetchMessages = async (artistId) => {
    if (!artistId) {
      console.error("Artist ID is null or undefined.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("artist_Messages")
      .select(
        `id, sender_Id, content, what_for, created_at, status, profiles:sender_Id (id, full_name, profile_picture)`
      )
      .eq("artist_Id", artistId) // Filter messages based on artistId
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
    setLoading(false);
  };

  // Fetch artist and messages once currentUser is available
  useEffect(() => {
    if (!currentUser) return; // Wait until currentUser is set

    const getArtistAndMessages = async () => {
      const artistDetails = await fetchArtistDetails(currentUser.id);
      if (!artistDetails) return;

      setArtist(artistDetails);
      fetchMessages(artistDetails.id);
    };

    getArtistAndMessages();
  }, [currentUser]); // Only runs when currentUser changes

  if (loading) return <div>Loading...</div>;

  // Handle other logic such as message sending, image uploading, etc.

  const handleChatClick = (message) => {
    setIsOpening(true);
    setTimeout(() => {
      setSelectedUser({
        name: message.profiles?.full_name || "Unknown User",
        photo: message.profiles?.profile_picture || "/default-avatar.png",
        messages: message.content || [],
        follow: "Following", // If this is dynamic, update accordingly
      });
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
                        "/default-avatar.png"
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
                      className="hover:scale-95 duration-300 cursor-pointer rounded-md p-1 justify-center flex"
                    >
                      <box-icon name="message-square-x" color="#000"></box-icon>
                    </div>
                  </div>

                  <div className="h-[500px] w-full bg-white overflow-y-scroll custom-scrollbar p-4">
                    {selectedUser && selectedUser.messages ? (
                      <>
                        {selectedUser.messages.length > 0 ? (
                          selectedUser.messages.map((message, index) => {
                            console.log("Rendering Message:", message);

                            const isSenderMessage =
                              message.sender_Id !== undefined;
                            const isArtistMessage =
                              message.artist_Id !== undefined;

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
                                        src={selectedUser.photo}
                                        alt={
                                          message.sender?.full_name || "Sender"
                                        }
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Chat Body */}
                                <div className="chat-body flex flex-col">
                                  <div
                                    className={`chat-header font-semibold text-slate-800 flex items-center ${
                                      isSenderMessage
                                        ? "justify-start"
                                        : "justify-end"
                                    }`}
                                  >
                                    <span
                                      className={`mr-2 ${
                                        isSenderMessage
                                          ? "text-left"
                                          : "text-right"
                                      }`}
                                    >
                                      {isSenderMessage && selectedUser
                                        ? selectedUser.name || "Sender"
                                        : "You"}
                                    </span>

                                  </div>

                                  <div
                                    className={`chat-bubble p-2 justify-center w-auto rounded-lg text-sm mt-2 ${
                                      isSenderMessage
                                        ? "bg-violet-500 text-white"
                                        : "bg-gray-300 text-gray-800"
                                    }`}
                                  >
                                    {message.text || "No message content"}

                                    {/* Attachments */}
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
                      </>
                    ) : (
                      <p className="text-center text-gray-500">
                        Select a user to start chatting.
                      </p>
                    )}
                  </div>

                  <div className="h-auto w-full flex gap-2 p-1 border-t-2 border-slate-400 bg-slate-100">
                    <textarea
                      placeholder="Type your message here..."
                      type="text"
                      className="bg-slate-100 w-5/6 h-14 border-custom-purple border-[0.5px] shadow-inner shadow-slate-400 rounded-md text-slate-800 p-2"
                    ></textarea>
                    <button className="iceland-regular text-xl text-slate-800 shadow shadow-black glass rounded-md duration-300 place-items-center flex gap-2 px-5 hover:bg-slate-400 hover:scale-95">
                      <box-icon
                        color="#000"
                        type="solid"
                        name="send"
                      ></box-icon>
                      SENT
                    </button>
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
