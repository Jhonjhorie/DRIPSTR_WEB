import React from "react";
import { supabase } from "@/constants/supabase";

const { useState, useEffect } = React;

function MessagesArtist() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [messageModal, setMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [artistArts, setArtistArts] = useState([]);
  const [totalArtsCount, setTotalArtsCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [artist, setArtist] = useState(null);

  // Fetch current user (example)
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

  // Example: Fetch artist details (using owner_Id or id as required)
  useEffect(() => {
    const fetchArtist = async () => {
      if (!currentUser) return;
      // For example, fetch the artist where currentUser is the owner
      const { data, error } = await supabase
        .from("artist")
        .select("id, artist_Name, artist_Bio, art_Type, artist_Image, owner_Id")
        .eq("owner_Id", currentUser.id)
        .single();
      if (error) {
        console.error("Error fetching artist:", error.message);
        return;
      }
      setArtist(data);
      setSelectedArtistId(data.id);
    };
    fetchArtist();
  }, [currentUser]);

  // Fetch messages function (corrected)
  const fetchMessages = async () => {
    // Only proceed if both currentUser and artist exist
    if (!currentUser || !artist) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("artist_Messages")
        .select("content")
        .eq("sender_Id", currentUser.id)
        .eq("artist_Id", artist.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching messages:", error.message);
      } else {
        const conversationContent = data ? data.content : [];
        setMessages(
          Array.isArray(conversationContent) ? conversationContent : []
        );
      }
    } catch (err) {
      console.error("Unexpected error fetching messages:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example: call fetchMessages when artist changes
  useEffect(() => {
    if (artist) {
      fetchMessages();
    }
  }, [artist]);

  return (
    <div>
      <div className="p-2 overflow-hidden w-full h-full  ">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-slate-50 w-full mb-2 p-2 cursor-pointer"
            onClick={() => setSelectedMessage(msg)}
          >
            <div className="flex items-center gap-2">
              {/* You can display an avatar image if available */}
              <div className="h-10 w-10 mt-1 rounded-full bg-slate-200">
                {/* For example, if msg.avatar exists, you can use:
              <img src={msg.avatar} alt="Avatar" className="object-cover rounded-full" />
              */}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold">{msg.name}</div>
                <div className="truncate">{msg.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/*messages*/}
      {selectedMessage && (
        <div className="fixed h-96 bottom-1 w-96 left-80 bg-slate-200 rounded-sm drop-shadow-custom ">
          <div className="flex justify-between  rounded-t-sm bg-slate-500 sticky top-0 z-10">
            <h2 className="text-xl sticky  top-0 z-10 p-2 font-bold text-slate-800 mb-2">
              {selectedMessage.name}
            </h2>
            <button
              className=" bg-violet-900 z-10 hover:scale-95 duration-200 mt-1 text-white px-2 rounded absolute top-2 right-2"
              onClick={() => setSelectedMessage(null)}
            >
              X
            </button>
          </div>
          <div className="h-64 z-0 overflow-hidden overflow-y-scroll  p-2 ">
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
          </div>

          <div className="w-full absolute bottom-1 p-2 flex">
            <textarea className="w-full text-sm text-slate-900 font-semibold p-1 rounded-l-md bg-slate-300 "></textarea>
            <div className="p-2 bg-purple-600 rounded-r-md px-3 hover:scale-95 duration-200 cursor-pointer">
              <box-icon name="send" type="solid"></box-icon>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagesArtist;
