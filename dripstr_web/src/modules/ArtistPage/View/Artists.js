import React from "react";
import style from "../Style/style.css";
import drplogo from "@/assets/logoBlack.png";
import hmmEmote from "@/assets/emote/hmmm.png";
import successEmote from "@/assets/emote/success.png";
import questionEmote from "@/assets/emote/question.png";
import { supabase } from "@/constants/supabase";
import { useNavigate } from "react-router-dom";
const { useState, useEffect } = React;

function Artists() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false); // AlertReportArt
  const [error, setError] = useState(null);
  const [artistData, setArtistData] = useState([]);
  const [imageOrientations, setImageOrientations] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [likes, setLikes] = useState({});
  const [userId, setUserId] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [selectArt, setSelectArt] = useState(null);
  const [selectMessage, setMessage] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [report, setReport] = useState(false);
  const [selectArt2, setSelectArt2] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const handleImageLoad = (event, artId) => {
    const { naturalWidth, naturalHeight } = event.target;
    setImageOrientations((prev) => ({
      ...prev,
      [artId]: naturalWidth > naturalHeight ? "landscape" : "portrait",
    }));
  };
  const handleSelectArt = async (art) => {
    if (!art) {
      console.error("Selected art is null!");
      return;
    }

    console.log("Selected Art:", art);
    setSelectArt(art);

    try {
      const { data: artData, error } = await supabase
        .from("artist_Arts")
        .select("comments")
        .eq("id", art.id)
        .single();

      if (error) {
        console.error("Error fetching comments:", error.message);
        setComments([]);
        return;
      }

      const commentsList = artData?.comments || [];
      setComments(commentsList);
    } catch (err) {
      console.error("Unexpected error:", err.message);
      setComments([]);
    }
  };
  const handleSelectArtReport = async (art2) => {
    if (!art2) {
      console.error("Selected art is null!");
      return;
    }
    setSelectArt2(art2);
    setReport(true);
  };
  useEffect(() => {
    const fetchUserAndArtworks = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching user:", userError.message);
          return;
        }

        if (userData?.user) {
          setUserId(userData.user.id);
        }

        await fetchArtworks();
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };

    fetchUserAndArtworks();
  }, []);

  const fetchLikesData = async () => {
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

      if (Object.keys(likeCounts).length === 0) {
        console.warn("No likes found.");
        return;
      }

      const sortedArtists = Object.entries(likeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const topArtistIds = sortedArtists.map(([id]) => parseInt(id, 10));

      if (topArtistIds.length === 0) return;

      const { data: artists, error: artistError } = await supabase
        .from("artist")
        .select("id, artist_Name, artist_Image, art_Type")
        .in("id", topArtistIds);

      if (artistError) {
        console.error("Error fetching artist names:", artistError.message);
        return;
      }

      const marginTops = ["mt-10", "mt-24", "mt-32"];
      const colors = ["yellow-400", "sky-400", "pink-400"];
      const topArtistsList = sortedArtists.map(([id, likes], index) => {
        const artist = artists.find((a) => a.id === parseInt(id, 10));
        return {
          id: parseInt(id, 10),
          name: artist?.artist_Name || "Unknown",
          type: artist?.art_Type || "Not set",
          color: colors[index],
          image: artist?.artist_Image || "/default-image.png",
          mt: marginTops[index],
          tag: `${index + 1}`,
          likes: likes || 0,
        };
      });

      setTopArtists([topArtistsList[1], topArtistsList[0], topArtistsList[2]]);
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };
  useEffect(() => {
    fetchLikesData();
  }, []);

  const colorClasses = {
    "sky-400": "bg-sky-400",
    "yellow-400": "bg-yellow-400",
    "pink-400": "bg-pink-400",
    "red-400": "bg-red-400",
    "green-400": "bg-green-400",
    "purple-400": "bg-purple-400",
    "teal-400": "bg-teal-400",
    "indigo-400": "bg-indigo-400",
  };
  const fetchArtworks = async () => {
    try {
      const { data: arts, error } = await supabase.from("artist_Arts").select(`
        id, 
        art_Name, 
        art_Image, 
        art_Description, 
        likes, 
        artist_Id,
        artists:artist_Id (id, artist_Name, artist_Image, is_Premium) 
      `);

      if (error) throw error;

      setArtistData(arts);
    } catch (error) {
      console.error("Error fetching artworks:", error.message);
    }
  };
  const handleLike = async (artId, currentLikes) => {
    try {
      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !userData?.user) {
        console.error("Authentication error:", authError?.message);
        return;
      }

      const userId = userData.user.id;
      const likesArray = Array.isArray(currentLikes) ? currentLikes : [];

      const updatedLikes = likesArray.includes(userId)
        ? likesArray.filter((id) => id !== userId)
        : [...likesArray, userId];

      const { error } = await supabase
        .from("artist_Arts")
        .update({ likes: updatedLikes })
        .eq("id", artId);

      if (error) throw error;

      setArtistData((prevData) =>
        prevData.map((art) =>
          art.id === artId ? { ...art, likes: updatedLikes } : art
        )
      );
      fetchLikesData();
    } catch (error) {
      console.error("Error updating likes:", error.message);
    }
  };
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

      // Fetch the artwork's artist ID
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

      const formattedComments = Array.isArray(comments)
        ? comments.map((cmt) => ({
            ...cmt,
            isOwner: cmt.userId === currentUserId && isOwner,
          }))
        : [];

      // Fetch user profiles for comments
      const userIds = [
        ...new Set(formattedComments.map((cmt) => cmt.userId).filter(Boolean)),
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

        // Create user lookup
        const userMap = usersData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        // Attach user details
        const updatedComments = formattedComments.map((cmt) => ({
          ...cmt,
          user: userMap?.[cmt.userId] || null,
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

  return (
    <div className="h-full w-full  bg-slate-300   ">
      <h1 className="text-center pt-5 text-5xl text-slate-50  bg-violet-500 font-extrabold  iceland-regular">
        DRIPSTR TOP ARTIST
      </h1>
      <div className="w-full place-content-center py-16 gap-10 bg-slate-200 relative h-auto flex">
        <div className="absolute w-full h-full bg-gradient-to-b  from-violet-500 to-fuchsia-500 inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, index) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const colors = [
              "red",
              "green",
              "yellow",
              "purple",
              "pink",
              "orange",
              "teal",
              "indigo",
            ];
            const randomColor =
              colors[Math.floor(Math.random() * colors.length)];

            return (
              <div
                key={index}
                className={`absolute w-5 h-5 bg-${randomColor}-500 rounded-sm confetti`}
                style={{
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                  animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                }}
              ></div>
            );
          })}
        </div>
        <img
          src={drplogo}
          alt="Artist"
          className="h-80  blur-sm w-80  rounded-md absolute bottom-2 right-2"
        />
        <div className="">
          <img
            src={drplogo}
            alt="Artist"
            className="h-80  blur-sm w-80 -scale-x-100 rounded-md absolute bottom-2 left-2"
          />
        </div>

        {topArtists.map((artist, index) => (
          <div
            onClick={() => {
              console.log("Selected Artist Data:", artist);
              // Use artist.id if available, otherwise try artist.artist_Id
              const artistId = artist.id;
              if (artistId) {
                navigate(`/arts/ArtistPage/${artistId}`);
              } else {
                console.error(
                  "Artist ID is undefined! Check if the correct ID property exists in your data."
                );
              }
            }}
            key={index}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(100px)",
            }}
            className={`w-[150px] cursor-pointer group hover:scale-105 duration-150 h-[300px] rounded-sm relative ${
              colorClasses[artist.color] || "bg-gray-400"
            } ${artist.mt}`}
          >
            <div
              className={`rounded-full z-10 shadow-lg h-[170px] w-[170px] absolute p-1 -top-20 left-1/2 -translate-x-1/2 ${
                colorClasses[artist.color] || "bg-gray-400"
              }`}
            >
              <img
                alt="top2"
                src={artist.image}
                className="rounded-full object-cover w-full h-full"
              />
            </div>

            <div className="absolute z-20 px-3 bg-slate-50 -translate-x-1/2 text-yellow-700 font-semibold iceland-regular left-1/2 top-1/4 shadow-md border-slate-50 border-2 bg-opacity-80 rounded-full p-1">
              {artist.tag}
            </div>

            <div
              className={`w-[150px] h-[250px] rounded-sm overflow-hidden mt-20 relative ${
                colorClasses[artist.color] || "bg-gray-400"
              }`}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(100px)",
              }}
            >
              <div className="place-content-center pb-12 justify-items-center h-full w-full">
                <div className="text-lg font-semibold text-slate-100">
                  {artist.name}
                </div>
                <div className="text-sm mt-2 text-slate-50 bg-custom-purple shadow-md rounded-full px-5 p-1 font-semibold">
                  {artist.type}
                </div>
                <div className="text-xs mt-2 text-slate-50 glass bg-gray-700 bg-opacity-50 shadow-md rounded-full px-4 p-1 font-semibold">
                  ❤️ {artist.likes} Likes
                </div>
              </div>
              <div className="bg-fuchsia-500 h-36 w-36 rotate-45 absolute -bottom-24 right-1"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-b  from-fuchsia-500 to-slate-300 h-40">
        <div className="text-slate-800 text-5xl font-bold iceland-regular text-center w-full p-5 ">
          DRIPSTR GALLERY
        </div>
      </div>
      <div className="h-auto p-2 md:px-10 w-full bg-slate-300 ">
        {loading && (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        <div className="px-4 mb-20 space-y-6">
          {/* Artist that avail premium priority HAHA */}
          <div className="columns-2 sm:columns-3 mb-2 md:columns-4 gap-2 space-y-2">
            {artistData
              .filter((art) => art.artists?.is_Premium)
              .map((art) => (
                <div
                  key={art.id}
                  className="relative p-1 hover:scale-105 hover:drop-shadow-customViolet duration-200  bg-gradient-to-r from-yellow-500 to-fuchsia-500 shadow-lg rounded-md overflow-hidden break-inside-avoid"
                >
                  <div></div>
                  {/* Art Image */}
                  <div
                    onClick={() => handleSelectArt(art)}
                    className="cursor-pointer overflow-hidden rounded-md"
                  >
                    <img
                      src={art.art_Image}
                      alt="Art"
                      className="w-full h-auto object-cover rounded-md"
                    />
                  </div>

                  {/* Art Name Badge */}
                  <div className="absolute glass bottom-2 left-2  bg-gradient-to-r from-yellow-500 to-fuchsia-500 text-white text-sm font-semibold px-3 py-1 rounded-md flex items-center gap-2">
                    <img
                      src={art.artists?.artist_Image}
                      alt="Logo"
                      className="h-7 w-7 rounded-md"
                    />
                    {art.art_Name}
                  </div>
                  <div className="flex items-center absolute top-0 right-0 glass bg-transparent rounded-bl-2xl px-2  gap-2">
                    <div className="flex items-center hover:scale-105 cursor-pointer hover:text-red-700 duration-200 gap-1 text-sm text-slate-800 font-bold">
                      {art.likes?.length || 0}
                      <box-icon
                        name="heart"
                        color={art.likes?.includes(userId) ? "red" : "gray"}
                        onClick={() => handleLike(art.id, art.likes)}
                        className="cursor-pointer "
                        type="solid"
                      ></box-icon>
                    </div>
                    <div
                      onClick={() => {
                        console.log("Selected Art Data:", art);
                        console.log("Artist Data:", art.artist);

                        if (art.artists && art.artists.id) {
                          navigate(`/arts/ArtistPage/${art.artists.id}`);
                        } else {
                          console.error(
                            "Artist ID is undefined! Check if artist_Id exists in your database."
                          );
                        }
                      }}
                      data-tip="Visit Artist"
                      className="flex tooltip tooltip-bottom items-center gap-1 cursor-pointer hover:scale-105 duration-200 text-sm  text-slate-800 "
                    >
                      <box-icon
                        type="solid"
                        name="user-pin"
                        color="blue"
                      ></box-icon>
                    </div>
                    <div
                      onClick={() => handleSelectArtReport(art)}
                      data-tip="Report this Post"
                      className=" tooltip tooltip-left text-sm flex items-center gap-1 cursor-pointer hover:scale-105 duration-200 text-yellow-500 "
                    >
                      <box-icon
                        name="shield-x"
                        type="solid"
                        color="gold"
                      ></box-icon>
                    </div>
                  </div>
                </div>
              ))}
          </div>
 {/* Art Not premium*/}
          <div className="columns-2 sm:columns-3 md:columns-4 mb-20 gap-2 space-y-2">
            {artistData.map((art) => (
              <div
                key={art.id}
                className={`relative hover:scale-105 hover:drop-shadow-customViolet  duration-200  shadow-lg rounded-md overflow-hidden break-inside-avoid ${
                  art.artists?.is_Premium
                    ? "bg-gradient-to-r from-yellow-500 p-1 to-fuchsia-500 "
                    : "bg-custom-purple"
                }`}
       
              >
                {/* Art Image */}
                <div
                  onClick={() => handleSelectArt(art)}
                  className="cursor-pointer overflow-hidden rounded-md"
                >
                  <img
                    src={art.art_Image}
                    alt="Art"
                    className="w-full h-auto object-cover rounded-md"
                  />
                </div>

                {/* Art Name Badge */}
                <div
                  className={`absolute glass bottom-2 left-2 ${
                    art.artists?.is_Premium
                      ? " bg-gradient-to-r from-yellow-500 to-fuchsia-500"
                      : "bg-custom-purple"
                  } text-white text-sm font-semibold px-3 py-1 rounded-md flex items-center gap-2`}
                >
                  <img
                    src={art.artists?.artist_Image}
                    alt="Logo"
                    className="h-7 w-7 rounded-md"
                  />
                  {art.art_Name}
                </div>

                <div className="flex items-center absolute top-0 right-0 glass bg-transparent rounded-bl-2xl px-2  gap-2">
                  <div className="flex items-center hover:scale-105 cursor-pointer hover:text-red-700 duration-200 gap-1 text-sm text-slate-800 font-bold">
                    {art.likes?.length || 0}
                    <box-icon
                      name="heart"
                      color={art.likes?.includes(userId) ? "red" : "gray"}
                      onClick={() => handleLike(art.id, art.likes)}
                      className="cursor-pointer "
                      type="solid"
                    ></box-icon>
                  </div>
                  <div
                    onClick={() => {
                      console.log("Selected Art Data:", art);
                      console.log("Artist Data:", art.artist);

                      if (art.artists && art.artists.id) {
                        navigate(`/arts/ArtistPage/${art.artists.id}`);
                      } else {
                        console.error(
                          "Artist ID is undefined! Check if artist_Id exists in your database."
                        );
                      }
                    }}
                    data-tip="Visit Artist"
                    className="flex tooltip tooltip-bottom items-center gap-1 cursor-pointer hover:scale-105 duration-200 text-sm  text-slate-800 "
                  >
                    <box-icon
                      type="solid"
                      name="user-pin"
                      color="blue"
                    ></box-icon>
                  </div>
                  <div
                    onClick={() => handleSelectArtReport(art)}
                    data-tip="Report this Post"
                    className=" tooltip tooltip-left text-sm flex items-center gap-1 cursor-pointer hover:scale-105 duration-200 text-yellow-500 "
                  >
                    <box-icon
                      name="shield-x"
                      type="solid"
                      color="gold"
                    ></box-icon>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectArt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 overflow-y-scroll md:flex justify-center items-center z-50"
          onClick={() => {
            setSelectArt(null);
            setComments([]);
          }}
        >
          <div
            className="relative min-h-[300px] bg-gradient-to-br from-violet-500 to-fuchsia-500 place-content-center justify-items-center p-4 rounded-lg shadow-lg min-w-[300px] max-w-3xl"
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
                {selectArt?.artists?.artist_Name || "Unknown Artist"}
              </div>
              <div
                onClick={() => {
                  console.log("Selected Art Data:", selectArt);
                  console.log("Artist Data:", selectArt.artist);

                  if (selectArt.artists && selectArt.artists.id) {
                    navigate(`/arts/ArtistPage/${selectArt.artists.id}`);
                  } else {
                    console.error(
                      "Artist ID is undefined! Check if artist_Id exists in your database."
                    );
                  }
                }}
                className="bg-fuchsia-500 cursor-pointer text-white w-20 h-16 p-1 rounded-md"
              >
                <img
                  src={selectArt?.artists?.artist_Image || successEmote}
                  alt="Artist"
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            </div>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-full md:w-1/3 h-full relative bg-slate-200 px-5"
          >
            <div className="text-2xl mt-5 text-fuchsia-800 font-bold text-center p-2">
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
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
    </div>
  );
}

export default Artists;
