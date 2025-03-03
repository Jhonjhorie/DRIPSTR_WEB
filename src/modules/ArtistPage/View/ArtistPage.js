import React from "react";
import style from "../Style/style.css";
import drplogo from "@/assets/logoBlack.png";
import star from "@/assets/starrank.png";
import hmmEmote from "@/assets/emote/hmmm.png";
import successEmote from "@/assets/emote/success.png";
import questionEmote from "@/assets/emote/question.png";
import qrCode from "@/assets/qr.png";
import { supabase } from "@/constants/supabase";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import FormCommision from "../Component/FormCommission";
import History from "../Component/History";

const { useState, useEffect } = React;

function ArtistPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [countArtist, setCountArtist] = useState(null);
  const [artistRank, setArtistRank] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAlertFollow, setShowAlertFollow] = React.useState(false);
  const [showAlertUnfollow, setShowAlertUnfollow] = React.useState(false);
  const [artistArts, setArtistArts] = useState([]);
  const userId = currentUser?.id;
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [report, setReport] = useState(false);
  const [selectArt2, setSelectArt2] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [selectArt, setSelectArt] = useState(null);
  const [imageOrientations, setImageOrientations] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false); // AlertReportArt
  const [messageModal, setMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [commisionQR, setCommissionQR] = useState(false);
  const [showAlertYO, setShowAlertYO] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageOrientation, setImageOrientation] = useState("landscape");
  const [messageStatus, setMessageStatus] = useState(false);

  const handleFollow = async () => {
    if (!artist || !currentUser) return;

    try {
      const { data: artistData, error } = await supabase
        .from("artist")
        .select("followers_Detail")
        .eq("id", artist.id)
        .single();

      if (error) throw error;

      let currentFollowers = artistData.followers_Detail || [];

      const alreadyFollowing = currentFollowers.some(
        (follower) => follower.id === currentUser.id
      );

      if (alreadyFollowing) return;

      const updatedFollowers = [
        ...currentFollowers,
        { id: currentUser.id, name: currentUser.name },
      ];

      setIsFollowing(true);

      const { error: updateError } = await supabase
        .from("artist")
        .update({ followers_Detail: updatedFollowers })
        .eq("id", artist.id);

      if (updateError) throw updateError;
      fetchTotalFollowers();
      setShowAlertFollow(true);
      setTimeout(() => {
        setShowAlertFollow(false);
      }, 3000);
    } catch (err) {
      console.error("Error following artist:", err);
    }
  };

  const checkIfFollowing = async () => {
    if (!artist || !currentUser) return;

    try {
      const { data: artistData, error } = await supabase
        .from("artist")
        .select("followers_Detail")
        .eq("id", artist.id)
        .single();

      if (error) throw error;

      const isUserFollowing = artistData.followers_Detail?.some(
        (follower) => follower.id === currentUser.id
      );

      setIsFollowing(isUserFollowing);
    } catch (err) {
      console.error("Error checking following status:", err);
    }
  };

  useEffect(() => {
    if (artist?.id && currentUser?.id) {
      checkIfFollowing();
    }
  }, [artist?.id, currentUser?.id]);

  useEffect(() => {
    if (id) {
      fetchTotalFollowers();
      checkIfFollowing();
    }
  }, [id]);

  const handleUnfollow = async () => {
    if (!artist || !currentUser) return;

    try {
      const { data: artistData, error } = await supabase
        .from("artist")
        .select("followers_Detail")
        .eq("id", artist.id)
        .single();

      if (error) throw error;

      let currentFollowers = artistData.followers_Detail || [];

      const isFollowing = currentFollowers.some(
        (follower) => follower.id === currentUser.id
      );

      if (!isFollowing) {
        alert("You're not following this artist!");
        return;
      }

      // Remove the current user from the followers list
      const updatedFollowers = currentFollowers.filter(
        (follower) => follower.id !== currentUser.id
      );

      const { error: updateError } = await supabase
        .from("artist")
        .update({ followers_Detail: updatedFollowers })
        .eq("id", artist.id);

      if (updateError) throw updateError;
      fetchTotalFollowers();
      setIsFollowing(false);
      setShowAlertUnfollow(true);
      setTimeout(() => {
        setShowAlertUnfollow(false);
      }, 3000);
    } catch (err) {
      console.error("Error unfollowing artist:", err);
    }
  };

  //Fetch artist arts
  useEffect(() => {
    const fetchArtistArts = async () => {
      try {
        console.log("Fetching artworks for artist ID:", id);

        const { data, error } = await supabase
          .from("artist_Arts")
          .select("*")
          .eq("artist_Id", id);

        if (error) {
          console.error("Error fetching artworks:", error);
        } else {
          console.log("Fetched Artworks:", data);
          setArtistArts(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    if (id) fetchArtistArts();
  }, [id]);

  const handleLike = async (artId, likes) => {
    let updatedLikes = likes.includes(userId)
      ? likes.filter((id) => id !== userId) // Unlike
      : [...likes, userId]; // Like

    const { error } = await supabase
      .from("artist_Arts")
      .update({ likes: updatedLikes })
      .eq("id", artId);

    if (!error) {
      setArtistArts((prevArts) =>
        prevArts.map((art) =>
          art.id === artId ? { ...art, likes: updatedLikes } : art
        )
      );
    } else {
      console.error("Error liking:", error);
    }
    fetchTotalLikes();
  };

  const handleSelectArtReport = (art2) => {
    if (!art2) {
      console.error("Selected art is null!");
      return;
    }
    setSelectArt2(art2);
    setReport(true);
  };

  const fetchTotalLikes = async () => {
    try {
      const { data: artworks, error } = await supabase
        .from("artist_Arts")
        .select("likes")
        .eq("artist_Id", id);

      if (error) {
        console.error("Error fetching likes:", error.message);
        return;
      }

      // Calculate total likes
      const total = artworks.reduce(
        (sum, art) => sum + (art.likes?.length || 0),
        0
      );
      setTotalLikes(total);
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  useEffect(() => {
    if (id) fetchTotalLikes();
  }, [id]);

  const fetchTotalFollowers = async () => {
    try {
      const { data: artistData, error } = await supabase
        .from("artist")
        .select("followers_Detail")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching followers:", error.message);
        return;
      }

      const total = artistData?.followers_Detail?.length || 0;
      setTotalFollowers(total);
      checkIfFollowing();
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  useEffect(() => {
    if (id) fetchTotalFollowers();
  }, [id]);

  const fetchArtistRank = async () => {
    try {
      const { data: artworks, error } = await supabase
        .from("artist_Arts")
        .select("artist_Id, likes");

      if (error) {
        console.error("Error fetching artworks:", error.message);
        return;
      }

      const likeCounts = {};
      artworks.forEach(({ artist_Id, likes }) => {
        if (artist_Id) {
          likeCounts[artist_Id] =
            (likeCounts[artist_Id] || 0) + (likes?.length || 0);
        }
      });

      const sortedArtists = Object.entries(likeCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([id, likes], index) => ({
          id: parseInt(id, 10),
          likes,
          rank: index + 1,
        }));

      const selectedArtistRank = sortedArtists.find(
        (artist) => artist.id === parseInt(id, 10)
      );

      if (!selectedArtistRank) {
        console.warn("Artist not found in ranking.");
        setArtistRank(null);
        return;
      }

      setArtistRank(selectedArtistRank);
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  useEffect(() => {
    fetchArtistRank();
  }, [id]);

  useEffect(() => {
    const fetchArtist = async () => {
      console.log("Fetching artist with ID:", id);
      const { data, error } = await supabase
        .from("artist")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching artist:", error);
      } else {
        console.log("Fetched Artist Data:", data);
        setArtist(data);
      }
    };

    if (id) fetchArtist();
  }, [id]);
  //Rank out of all artists
  const countArtists = async () => {
    const { count, error } = await supabase
      .from("artist")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error counting artists:", error);
    } else {
      console.log("Total Artists:", count);
      setCountArtist(count);
    }
  };
  // fetch all the arts of the selected aritist
  useEffect(() => {
    const fetchArtistArts = async () => {
      try {
        console.log("Fetching arts for artist ID:", id);
        const { data, error } = await supabase
          .from("artist_Arts")
          .select("*")
          .eq("artist_Id", id);

        if (error) {
          console.error("Error fetching artist arts:", error.message);
        } else {
          console.log("Fetched Artist Arts Data:", data);
          setArtistArts(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };

    if (id) fetchArtistArts();
  }, [id]);
  //add comment
  const handleAddComment = async (artId) => {
    if (!newComment.trim()) return;

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw new Error("User fetch failed: " + userError.message);

      const userId = userData?.user?.id;
      if (!userId) throw new Error("User not logged in");

      // Fetch the user's full_name and profile_picture from 'profiles' table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, profile_picture")
        .eq("id", userId)
        .single();

      if (profileError)
        throw new Error("User profile fetch failed: " + profileError.message);

      // Optimistically update UI with fetched profile data
      const newCommentObj = {
        userId,
        text: newComment,
        timestamp: new Date().toISOString(),
        user: {
          full_name: profileData?.full_name || "Unknown",
          profile_picture: profileData?.profile_picture || successEmote,
        },
      };

      setComments((prevComments) => [...prevComments, newCommentObj]);
      setNewComment("");

      const { data: artData, error: fetchError } = await supabase
        .from("artist_Arts")
        .select("comments")
        .eq("id", artId)
        .single();

      if (fetchError)
        throw new Error("Error fetching comments: " + fetchError.message);

      const existingComments = artData?.comments || [];
      const updatedComments = [
        ...existingComments,
        { ...newCommentObj, user: undefined },
      ];

      const { error: updateError } = await supabase
        .from("artist_Arts")
        .update({ comments: updatedComments })
        .eq("id", artId);

      if (updateError)
        throw new Error("Error updating comment: " + updateError.message);
    } catch (error) {
      console.error(error.message);
    }
  };
  //Comments of the users/visitors
  const fetchCommentsWithUsers = async (artId) => {
    if (!artId) return;

    try {
      setLoading(true);

      // Fetch current user
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }
      const currentUserId = user?.user?.id;

      // Fetch the artwork's artist ID and comments
      const { data: artData, error: artError } = await supabase
        .from("artist_Arts")
        .select("artist_Id, comments")
        .eq("id", artId)
        .single();

      if (artError) {
        console.error("Error fetching artwork:", artError.message);
        return;
      }

      const { artist_Id, comments } = artData || {};
      if (!artist_Id) return;

      // Fetch artist owner_Id
      const { data: artistData, error: artistError } = await supabase
        .from("artist")
        .select("owner_Id")
        .eq("id", artist_Id)
        .single();

      if (artistError) {
        console.error("Error fetching artist:", artistError.message);
        return;
      }

      const isOwner = artistData?.owner_Id === currentUserId;

      // Adjust the key here if your comments store the sender id under a different name
      const formattedComments = Array.isArray(comments)
        ? comments.map((cmt) => ({
            ...cmt,
            isOwner: (cmt.sender_Id || cmt.userId) === currentUserId && isOwner,
          }))
        : [];

      // Use the appropriate key for sender id
      const userIds = [
        ...new Set(
          formattedComments
            .map((cmt) => cmt.sender_Id || cmt.userId)
            .filter(Boolean)
        ),
      ];

      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_picture")
          .in("id", userIds);

        if (usersError) {
          console.error("Error fetching users:", usersError.message);
          return;
        }

        // Create a lookup object for user profiles
        const userMap = usersData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        // Attach user details using the correct sender id key
        const updatedComments = formattedComments.map((cmt) => ({
          ...cmt,
          user: userMap[cmt.sender_Id || cmt.userId] || null,
        }));

        setComments(updatedComments);
      } else {
        setComments(formattedComments);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
      setComments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectArt?.id) {
      fetchCommentsWithUsers(selectArt.id);
    }
  }, [selectArt]);

  //Report submit
  const handleReportSubmit = async () => {
    if (!selectArt2) {
      console.error("No art selected for reporting!");
      return;
    }

    const finalReport = reportReason === "Others" ? otherReason : reportReason;

    const { data, error } = await supabase.from("reported_Art").insert([
      {
        art_Id: selectArt2.id,
        reason: finalReport,
        action: "Pending Review",
        art_Name: selectArt2.art_Name,
      },
    ]);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setSelectArt2(null);
    }, 3000);
    setReport(false);
    if (error) {
      console.error("Error reporting art:", error);
    } else {
      console.log("Report submitted successfully:", data);
    }
  };

  //artist details
  const fetchArtistDetails = async (artistId) => {
    const { data, error } = await supabase
      .from("artist")
      .select("artist_Name, artist_Image, owner_Id, is_Premium")
      .eq("id", artistId)
      .single();

    if (error) {
      console.error("Error fetching artist details:", error.message);
      return null;
    }
    return data;
  };

  const handleSelectArt = async (art) => {
    setSelectArt(art);

    // If the art has an artist_Id, fetch the artist details
    if (art.artist_Id) {
      const artistDetails = await fetchArtistDetails(art.artist_Id);
      if (artistDetails) {
        // Update the selectArt state to include the artist details
        setSelectArt((prevArt) => ({
          ...prevArt,
          artist: artistDetails,
        }));
      }
    }
  };

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

  // Message function commision
  const handleSendMessage = async () => {
    // Check if the current user is the owner of the artist page
    if (currentUser?.id === artist?.owner_Id) {
      alert("You own this art page");
      return;
    }

    // If both text and image are empty, do nothing
    if (!messageContent.trim() && !imageFile) return;

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await handleUploadImage();
      console.log("Image URL returned:", imageUrl);
    }

    const newMsg = {
      sender_Id: currentUser?.id,
      text: messageContent,
      timestamp: new Date().toISOString(),
      send_file: imageUrl, // Store image URL inside the message JSON
      status: false,
    };

    // Check if a conversation already exists for this sender and artist
    const { data: existingConversation, error: selectError } = await supabase
      .from("artist_Messages")
      .select("*")
      .eq("sender_Id", currentUser?.id)
      .eq("artist_Id", artist?.id)
      .maybeSingle();
    if (selectError) {
      console.error("Error fetching conversation:", selectError.message);
      return;
    }

    if (existingConversation) {
      // Append the new message to the existing content array.
      const existingContent = Array.isArray(existingConversation.content)
        ? existingConversation.content
        : [];
      const updatedContent = [...existingContent, newMsg];

      // Update the conversation record with the new content.
      // When creating a new conversation, we also set what_for to the selected option.
      const updatePayload = { content: updatedContent, status: false };
      if (!existingConversation.what_for && selectedOption) {
        updatePayload.what_for = selectedOption;
      }
      const { error: updateError } = await supabase
        .from("artist_Messages")
        .update(updatePayload)
        .eq("id", existingConversation.id);
      if (updateError) {
        console.error("Error updating conversation:", updateError.message);
        return;
      }
      setMessages(updatedContent);
    } else {
      // Create a new conversation record with the new message
      const messageData = {
        sender_Id: currentUser?.id,
        artist_Id: artist?.id,
        artist_Name: artist?.artist_Name,
        artist_Image: artist?.artist_Image,
        content: [newMsg],
        status: false,
      };

      const { data, error } = await supabase
        .from("artist_Messages")
        .insert([messageData]);
      if (error) {
        console.error("Error creating conversation:", error.message);
        return;
      }
      setMessages([newMsg]);
    }

    setMessageContent("");
    setImageFile(null);
  };

  const fetchMessages = async () => {
    if (!currentUser?.id || !artist?.id) {
      console.warn(
        "Skipping fetchMessages: currentUser or artist is undefined"
      );
      return;
    }

    const { data, error } = await supabase
      .from("artist_Messages")
      .select("content, status, message_dot")
      .eq("sender_Id", currentUser.id)
      .eq("artist_Id", artist.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching messages:", error.message);
    } else if (data) {
      setMessages(data.content || []);
      setMessageStatus(data.message_dot);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentUser?.id, artist?.id]);

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

  useEffect(() => {
    if (messageModal) {
      fetchMessages();
    }
  }, [messageModal]);
  useEffect(() => {
    fetchMessages();
  }, [currentUser?.id, artist?.id]);
  countArtists();

  if (!artist)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col gap-4 w-52 animate-pulse">
          <div className="h-32 w-full bg-gray-500 rounded"></div>
          <div className="h-4 w-28 bg-gray-500 rounded"></div>
          <div className="h-4 w-full bg-gray-500 rounded"></div>
          <div className="h-4 w-full bg-gray-500 rounded"></div>
        </div>
      </div>
    );

  return (
    <div className="h-full w-full relative bg-slate-300  ">
      <div className="absolute z-10 top-5 left-5">
        <button
          onClick={() => navigate("/arts/Artists")}
          className="hover:scale-90 duration-300"
        >
          {" "}
          <box-icon name="share" type="solid" size="40px"></box-icon>
        </button>
      </div>
      <div
        className={`${
          artist?.is_Premium
            ? "bg-gradient-to-b from-violet-500 to-gray-200"
            : "bg-gray-200"
        } md:flex gap-2 w-full h-auto  justify-center p-2 `}
      >
        <div
          className={`h-80 w-80 mt-3 ${
            artist?.is_Premium ? "bg-yellow-500" : "bg-violet-900"
          } glass mx-auto md:mx-0 rounded-md shadow-md p-2`}
        >
          <img
            src={artist.artist_Image}
            alt={artist.artist_Name}
            className="object-cover rounded-sm h-full w-full"
          />
        </div>
        <div className=" gap-2  ">
          <div className="flex mt-2 md:mt-0 justify-between">
            <div className="flex gap-2 items-center">
              <h1 className="text-violet-900 font-bold text-2xl p-2">
                {artist.artist_Name}
              </h1>
              <div>
                {artist.is_Premium && (
                  <div className="badge badge-warning border-2 border-slate-100">
                    DripStar
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div
                onClick={async () => {
                  if (currentUser?.id === artist?.owner_Id) {
                    setShowAlertYO(true);
                    setTimeout(() => {
                      setShowAlertYO(false);
                    }, 3000);
                  } else {
                    setMessageModal(true);

                    // Update message status in Supabase (mark as read)
                    const { error } = await supabase
                      .from("artist_Messages")
                      .update({ message_dot: false })
                      .eq("sender_Id", currentUser?.id)
                      .eq("artist_Id", artist?.id);

                    if (error) {
                      console.error(
                        "Error updating message status:",
                        error.message
                      );
                    } else {
                      setMessageStatus(false); // Hide red dot locally
                    }
                  }
                }}
                className="relative flex items-center gap-4 rounded-md hover:scale-95 hover:bg-violet-600 duration-200 cursor-pointer justify-center bg-violet-800 text-slate-100 font-semibold iceland-regular glass px-1"
              >
                Message
                <box-icon
                  name="message-dots"
                  type="solid"
                  color="white"
                ></box-icon>
                {messageStatus && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </div>

              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                className={`flex items-center gap-4 rounded-md hover:scale-95 duration-200 cursor-pointer justify-center font-semibold iceland-regular glass px-2 
    ${
      isFollowing
        ? "bg-slate-800  hover:bg-slate-600 text-white"
        : "bg-violet-800 hover:bg-violet-600 text-slate-100"
    }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
                <box-icon
                  name={isFollowing ? "bookmark-minus" : "bookmark-plus"}
                  type="solid"
                  color="white"
                ></box-icon>
              </button>
            </div>
          </div>
          <div className="h-auto flex flex-col ">
            <div className=" md:h-32 h-auto mt-2 flex flex-col gap-4 md:flex-row text-slate-900 my-auto relative rounded-t-md bg-slate-100 stats shadow">
              <div className=" w-full absolute top-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                {" "}
              </div>

              <div className="stat  ">
                <div className="stat-figure text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-8 w-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title text-slate-900">Total Likes</div>
                <div className="stat-value text-primary">{totalLikes}</div>
                <div className="stat-desc text-slate-900">
                  Across all artworks
                </div>
              </div>

              <div className="stat -mt-7 md:-mt-0">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-8 w-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title text-slate-900">Followers</div>
                <div className="stat-value text-secondary">
                  {totalFollowers}
                </div>
                <div className="stat-desc text-slate-900">All over DRIPSTR</div>
              </div>

              <div className="stat -mt-7 md:-mt-0">
                <div className="stat-figure text-secondary">
                  <div className="w-20 h-20">
                    <img src={star} alt="Star Icon" />
                  </div>
                </div>

                <div className="stat-value">
                  {artistRank ? (
                    <div className="flex items-center gap-2">
                      <span className="text-4xl  font-bold">
                        #{artistRank.rank}
                      </span>
                    </div>
                  ) : (
                    <span>Not ranked yet</span>
                  )}
                </div>

                <div className="stat-title text-slate-900">
                  Rank based on Like
                </div>
                <div className="stat-desc text-secondary">
                  <span>Out of {countArtist} artists</span>
                </div>
              </div>
            </div>
            <div className="w-full h-auto p-2 md:p-0 ">
              <div className="mt-2 w-full md:w-1/2 h-36  overflow-hidden overflow-y-scroll bg-white md:absolute p-2 rounded-md shadow-md">
                <h1 className="text-slate-800 font-semibold mb-2">
                  Artist Description:
                </h1>
                <p className="text-sm text-slate-800">{artist.artist_Bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Artist Arts */}
      <div className="h-auto relative p-2 pb-10 md:px-10 w-full bg-slate-300 ">
        <div className="columns-2 sm:columns-3 mt-5 md:columns-4 gap-2 px-4 space-y-2">
          {artistArts.length > 0 ? (
            artistArts.map((art) => (
              <div
                key={art.id}
                className="relative hover:scale-105 duration-200 bg-white shadow-lg rounded-md overflow-hidden break-inside-avoid"
              >
                {/* Art Image */}
                <div
                  onClick={() => handleSelectArt(art)}
                  className="cursor-pointer overflow-hidden rounded-md"
                >
                  <img
                    src={art.art_Image}
                    alt={art.art_Name}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </div>

                {/* Art Name Badge */}
                <div className="absolute bottom-2 left-2 bg-custom-purple text-white text-sm font-semibold px-3 py-1 rounded-md flex items-center gap-2">
                  <img src={drplogo} alt="Logo" className="h-5 w-5" />
                  {art.art_Name}
                </div>

                {/* Like and Actions */}
                <div className="flex items-center absolute top-0 right-0 glass bg-transparent rounded-bl-2xl px-2 gap-2">
                  <div
                    className="flex items-center hover:scale-105 cursor-pointer hover:text-red-700 duration-200 gap-1 text-sm text-slate-800 font-bold"
                    onClick={() => handleLike(art.id, art.likes)}
                  >
                    {art.likes?.length || 0}
                    <box-icon
                      name="heart"
                      type="solid"
                      color={art.likes?.includes(userId) ? "red" : "gray"}
                    ></box-icon>
                  </div>
                  <div
                    onClick={() => handleSelectArtReport(art)}
                    className="tooltip tooltip-left text-sm flex items-center gap-1 cursor-pointer hover:scale-105 duration-200 text-yellow-500"
                    data-tip="Report this Post"
                  >
                    <box-icon
                      name="shield-x"
                      type="solid"
                      color="gold"
                    ></box-icon>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full col-span-full">
              No artworks available.
            </p>
          )}
        </div>
        {/* Floating history of commissions */}

        <div>
          {/* Hide hihi History if the user is the artist */}
          {currentUser?.id !== artist?.owner_Id && (
            <History artistId={artist.id} />
          )}
        </div>
      </div>

      {showAlertFollow && (
        <div className="fixed bottom-10 right-10 z-50 px-4 py-2  shadow-md rounded-md transition-opacity duration-1000 ease-in-out">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Successfully Follow this Artist </span>
          </div>
        </div>
      )}

      {showAlertUnfollow && (
        <div className="fixed bottom-10 right-10 z-50 px-4 py-2  shadow-md rounded-md transition-opacity duration-1000 ease-in-out">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>You Unfollow this Artist</span>
          </div>
        </div>
      )}
      {showAlertYO && (
        <div className="fixed bottom-10 right-10 z-50 px-4 py-2  shadow-md rounded-md transition-opacity duration-1000 ease-in-out">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>You are the Owner of this Artist Page.</span>
          </div>
        </div>
      )}

      {selectArt && (
        <div
          className="fixed inset-0 overflow-y-scroll bg-black bg-opacity-70 md:flex justify-center items-center z-50"
          onClick={() => {
            setSelectArt(null);
            setComments([]);
          }}
        >
          <div
            className="relative md:min-h-[300px] bg-gradient-to-br from-violet-500 to-fuchsia-500 place-content-center justify-items-center p-4 rounded-lg shadow-lg min-w-[300px] max-w-3xl"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Close Button */}
            <button
              className="absolute top-0 right-0 text-white bg-gradient-to-br from-violet-500 to-fuchsia-500 px-3 rounded-full p-2"
              onClick={() => {
                setSelectArt(null);
                setComments([]);
              }}
            >
              ✕
            </button>

            {/* Art Image */}
            {selectArt?.art_Image && (
              <img
                src={selectArt.art_Image}
                alt="Expanded Art"
                className={`overflow-hidden rounded-md border shadow-md border-custom-purple ${
                  imageOrientations[selectArt.id] === "landscape"
                    ? "w-full h-[550px] flex justify-center"
                    : "w-auto h-[550px] mx-auto"
                }`}
              />
            )}
            <div className="bg-violet-500 text-white px-3 text-xl iceland-bold py-2 rounded-md absolute top-2 left-2">
              {selectArt?.art_Name || "Untitled"}
            </div>

            <div className="absolute bottom-2 right-2 flex">
              <div className="text-white text-xl drop-shadow-customWhite iceland-bold p-2 h-auto w-auto">
                {selectArt?.artist?.artist_Name || "Unknown Artist"}
              </div>
              <div className="bg-fuchsia-500 text-white w-20 h-16 p-1 rounded-md">
                <img
                  src={selectArt?.artist?.artist_Image || successEmote}
                  alt="Artist"
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            </div>
          </div>
          {/* Art Comments */}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-full md:w-1/3 h-full relative bg-slate-200 px-5"
          >
            <div className="text-2xl mt-2 md:mt-5 text-fuchsia-800 font-bold text-center p-2">
              Comment on {selectArt?.art_Name || "Untitled"}
            </div>
            <div className="text-sm text-slate-900 font-bold ">
              Description:
            </div>
            <div className=" h-auto max-h-20 mb-2 overflow-auto scrollbar-hide  py-2 px-5  w-full">
              <p className="text-gray-900 text-sm ">
                {selectArt.art_Description}
              </p>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="h-[55%] w-full rounded-md shadow-inner overflow-y-auto shadow-slate-400 bg-slate-300"
            >
              {loading ? (
                <div className="flex w-52 flex-col p-2 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="skeleton bg-slate-500 h-10 w-10 shrink-0 rounded-full"></div>
                    <div className="flex flex-col gap-4">
                      <div className="skeleton bg-slate-500  h-4 w-20"></div>
                      <div className="skeleton bg-slate-500  h-4 w-28"></div>
                    </div>
                  </div>
                </div>
              ) : Array.isArray(comments) && comments.length > 0 ? (
                comments.map((cmt, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 mb-2">
                    <img
                      src={
                        cmt.isArtist
                          ? cmt.artistImage
                          : cmt.user?.profile_picture || successEmote
                      }
                      alt="User"
                      className={`w-12 h-12 rounded-md object-cover border-2 border-gray-100 
                      ${
                        cmt.isArtist
                          ? "bg-purple-500 border-purple-900 rounded-md drop-shadow-customViolet"
                          : "bg-white"
                      }`}
                    />

                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {cmt.isArtist
                          ? cmt.artistName
                          : cmt.user?.full_name || "Unknown"}
                      </div>
                      <span
                        className={`w-12 h-12 rounded-md object-cover border-2 border-gray-100 
                      ${
                        cmt.isArtist
                          ? "bg-purple-500 px-2 text-slate-100  rounded-md "
                          : "bg-white text-slate-900 px-1"
                      }`}
                      >
                        {cmt.text}
                      </span>

                      <span className="text-xs text-gray-400 ml-2">
                        {new Date(cmt.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full place-content-center align-middle justify-center place-items-center">
                  <div className="">
                    <img src={hmmEmote} alt="" className="h-20 w-20" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-sm">
                      No comments yet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="h-[10%] mt-1 p-2 w-full bg-slate-300"
            >
              <textarea
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your thoughts about this art..."
                className="w-full text-sm font-semibold text-slate-900 p-1 resize-none h-full bg-slate-50 rounded-md"
              ></textarea>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-full h-auto p-1 flex justify-end "
            >
              <button
                onClick={() => handleAddComment(selectArt.id)}
                className="px-4 text-slate-50 p-1 bg-custom-purple glass hover:scale-95 duration-200 rounded-md "
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {report && selectArt2 && (
        <div
          onClick={() => {
            setSelectArt2(null);
          }}
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-96 h-auto rounded-md relative bg-slate-100"
          >
            <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-2 rounded-t-md"></div>

            <div className="text-violet-900 flex justify-center px-3 text-2xl iceland-bold py-2 rounded-md">
              Report {selectArt2?.art_Name || "Untitled"} ?
            </div>

            <div className="w-full h-auto bg-slate-300 rounded-b-md overflow-hidden overflow-y-scroll p-4">
              <p className="text-gray-900 font-semibold">Select a reason:</p>
              {/* Report Options */}
              <div className="mt-2 flex text-sm flex-col gap-2">
                {[
                  "Inappropriate Content",
                  "Plagiarism",
                  "Hate Speech",
                  "Spam or Misleading",
                  "Sexually Explicit Content",
                  "Violence or Gore",
                  "Harassment or Bullying",
                  "Copyright Violation",
                  "Scam or Fraud",
                  "Misuse of Platform",
                ].map((reason, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      className="form-radio text-violet-500"
                      onChange={() => setReportReason(reason)}
                    />
                    <span className="text-gray-800">{reason}</span>
                  </label>
                ))}

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reportReason"
                    value="Others"
                    className="form-radio text-violet-500"
                    onChange={() => setReportReason("Others")}
                  />
                  <span className="text-gray-800">Others</span>
                </label>

                {reportReason === "Others" && (
                  <textarea
                    className="w-full mt-2 p-2 border bg-slate-50 text-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Please describe your concern..."
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                className="mt-4 w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition"
                onClick={handleReportSubmit}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlert && selectArt2 && (
        <div className=" fixed bottom-10 right-10 z-50 px-4 py-2  shadow-md rounded-md transition-opacity duration-1000 ease-in-out">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span> Art Reported "{selectArt2?.art_Name || "Untitled"}"</span>
          </div>
        </div>
      )}

      {/* Message Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
          messageModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-t-lg relative w-full max-w-xl px-5 py-3 transform transition-transform duration-300 ${
            messageModal ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Gradient */}
          <div className="w-full absolute top-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md"></div>

          <div className="w-full py-2 mb-2 flex justify-between items-center h-auto">
            <h2 className="text-3xl font-bold iceland-regular text-custom-purple">
              Message
            </h2>
            <button
              className="hover:text-primary-color duration-100 text-custom-purple text-4xl rounded"
              onClick={() => setMessageModal(false)}
            >
              &times;
            </button>
          </div>

          {/* Chat History */}
          <div className="h-96 mb-2 p-2 overflow-hidden overflow-y-scroll w-full bg-slate-200 shadow-inner shadow-slate-400 rounded-md relative">
            {messages.length > 0 ? (
              messages.map((message, index) => {
                const isCurrentUser = message.sender_Id === currentUser?.id;
                return (
                  <div
                    key={index}
                    className={`chat ${
                      isCurrentUser ? "chat-end" : "chat-start"
                    }`}
                  >
                    {/* Only show the artist avatar if it's not the current user */}
                    {!isCurrentUser && (
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                          <img alt="Artist Avatar" src={artist.artist_Image} />
                        </div>
                      </div>
                    )}
                    <div className="chat-header text-slate-800">
                      {isCurrentUser
                        ? currentUser.full_name
                        : artist.artist_Name}
                      <time className="text-xs ml-2 opacity-50">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </time>
                    </div>
                    <div
                      className={`chat-bubble cursor-pointer ${
                        isCurrentUser
                          ? "bg-white text-black"
                          : "bg-violet-500 text-white"
                      }`}
                    >
                      {message.text}
                      {message.send_file && (
                        <div className="mt-2">
                          <img
                            src={message.send_file}
                            alt="Attached"
                            className="min-w-[5rem] min-h-[5rem] object-cover rounded"
                            onClick={() => setSelectedImage(message.send_file)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="mt-10 ">
                  <img
                    src={hmmEmote}
                    alt="Success Emote"
                    className="object-contain h-20 w-20 rounded-lg p-1 drop-shadow-customViolet"
                  />
                </div>
                <div className="text-sm font-bold text-slate-700">
                  Start art commission now!
                </div>
              </div>
            )}
          </div>

          <div className="right-5 justify-between rounded p-1 text-sm z-10 flex gap-4">
            <button
              onClick={() => {
                setCommissionQR(true);
              }}
              className="px-6 py-1 bg-purple-500 text-white rounded-md shadow hover:bg-purple-600 transition-colors duration-150"
            >
              Start Commission
            </button>
          </div>

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
                <label htmlFor="message-image-input" className="cursor-pointer">
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
                <box-icon type="solid" name="send" size="30px"></box-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative bg-custom-purple p-2 rounded-md ">
            <img
              src={selectedImage}
              alt="Full-size preview"
              onLoad={(e) => {
                const img = e.target;
                // Check natural dimensions to determine orientation
                const orientation =
                  img.naturalWidth > img.naturalHeight
                    ? "landscape"
                    : "portrait";
                setImageOrientation(orientation);
              }}
              className={`rounded ${
                imageOrientation === "landscape"
                  ? "max-w-full max-h-[80vh]"
                  : "max-w-[80vw] max-h-[80vh]"
              }`}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 right-0 text-white text-3xl p-2 drop-shadow-lg "
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {commisionQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative bg-custom-purple h-auto w-auto p-2 rounded-md ">
            <FormCommision />
            <button
              onClick={() => {
                setCommissionQR(false);
              }}
              className="absolute text-custom-purple -top-2 right-0  text-3xl p-2 drop-shadow-lg "
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistPage;
