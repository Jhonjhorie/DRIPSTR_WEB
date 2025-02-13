import React from "react";
import style from "../Style/style.css";
import drplogo from "@/assets/logoBlack.png";
import hmmEmote from "../../../../src/assets/emote/hmmm.png";
import { supabase } from "@/constants/supabase";

const { useState, useEffect } = React;
function Artists() {
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
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
            name: artist?.artist_Name || "Unknown",
            type: artist?.art_Type || "Not set",
            color: colors[index],
            image: artist?.artist_Image || "/default-image.png",
            mt: marginTops[index],
            tag: `${index + 1}`,
            likes: likes || 0,
          };
        });

        setTopArtists([
          topArtistsList[1],
          topArtistsList[0],
          topArtistsList[2],
        ]);
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };

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
        artists:artist_Id (artist_Name, artist_Image) 
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
        { userId, text: newComment, timestamp: new Date().toISOString() },
      ];

      const { error: updateError } = await supabase
        .from("artist_Arts")
        .update({ comments: updatedComments })
        .eq("id", artId);

      if (updateError)
        throw new Error("Error updating comment: " + updateError.message);

      setComments(updatedComments);
      setNewComment("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchCommentsWithUsers = async (artId) => {
    if (!artId) return;

    try {
    
      const { data: commentsData, error } = await supabase
        .from("artist_Arts")
        .select("comments")
        .eq("id", artId) 
        .single();

      if (error) {
        console.error("Error fetching comments:", error.message);
        return;
      }

      // Ensure comments is an array
      const comments = Array.isArray(commentsData?.comments)
        ? commentsData.comments
        : [];

      // Extract unique userIds from comments
      const userIds = [
        ...new Set(comments.map((cmt) => cmt.userId).filter(Boolean)),
      ];

      if (userIds.length > 0) {
        // Fetch user details
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_picture")
          .in("id", userIds);

        if (usersError) {
          console.error("Error fetching users:", usersError.message);
          return;
        }

        // Create a user lookup map
        const userMap = usersData?.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        // Attach user details to comments
        const updatedComments = comments.map((cmt) => ({
          ...cmt,
          user: userMap?.[cmt.userId] || null,
        }));

        setComments(updatedComments);
      } else {
        setComments(comments);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };


  useEffect(() => {
    if (selectArt?.id) {
      fetchCommentsWithUsers(selectArt.id);
    }
  }, [selectArt]);

  return (
    <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar  ">
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
      <div className="bg-gradient-to-b  from-fuchsia-500 to-slate-300 h-40"></div>
      <div className="h-auto p-10 w-full bg-slate-300 ">
        {loading && (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2  gap-10">
          {artistData.map((art) => (
            <div
              key={art.id}
              className="bg-white relative group p-2 shadow-lg h-auto rounded-md"
            >
              <div className=" w-full absolute top-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                {" "}
              </div>
              <div className="flex  justify-between  items-center p-4">
                <div className="flex gap-2">
                  <img
                    src={art.artists?.artist_Image || "default-profile.png"}
                    alt="Artist"
                    className="h-14 w-14 rounded-full object-cover border border-gray-300"
                  />
                  <div className="text-xl mt-3 text-slate-800 font-bold">
                    {art.artists?.artist_Name || "Unknown Artist"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center hover:scale-105 cursor-pointer hover:text-red-700 duration-200 gap-1 text-xl text-slate-800 font-bold">
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
                    data-tip="Visit Artist."
                    className="flex tooltip items-center gap-1 cursor-pointer hover:scale-105 duration-200 text-sm  text-slate-800 "
                  >
                    <box-icon type="solid" name="user-pin"></box-icon>
                  </div>
                  <div
                    data-tip="Report this Post."
                    className=" tooltip text-sm flex items-center gap-1 cursor-pointer hover:scale-105 duration-200 text-yellow-500 "
                  >
                    <box-icon name="shield-x" type="solid"></box-icon>
                  </div>
                </div>
              </div>

              <p className="text-gray-900 p-2 px-10 mt-1 font-semibold">
                {art.art_Description}
              </p>
              <div
                onClick={() => handleSelectArt(art)}
                className="w-full px-5 border shadow-md border-custom-purple  rounded-md p-2"
              >
                <div
                  className={`mt-3 overflow-hidden cursor-pointer  ${
                    imageOrientations[art.id] === "landscape"
                      ? "w-full h-[300px] flex justify-center"
                      : "w-[300px] h-[300px] mx-auto"
                  }`}
                  onDoubleClick={() => handleLike(art.id, art.likes)}
                >
                  <img
                    src={art.art_Image}
                    alt="Art"
                    onLoad={(event) => handleImageLoad(event, art.id)}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="bg-custom-purple glass transition-transform duration-300 group-hover:scale-125 flex place-content-center gap-2 right-5 text-slate-50 font-semibold rounded-md absolute w-auto bottom-5 h-auto p-3">
                <img
                  src={drplogo}
                  alt="Art"
                  className="h-6 w-6 object-contain drop-shadow-custom"
                />
                {art.art_Name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectArt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => {
            setSelectArt(null);
            setComments([]);
          }}
        >
          <div
            className="relative min-h-[300px] bg-gradient-to-br from-violet-500 to-fuchsia-500 place-content-center justify-items-center p-4 rounded-lg shadow-lg min-w-[300px] max-w-3xl"
            onClick={(e) => {
              e.stopPropagation();
              setComments([]);
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
                className={`overflow-hidden cursor-pointer rounded-md border shadow-md border-custom-purple ${
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
              <div className="bg-fuchsia-500 text-white w-20 h-16 p-1 rounded-md">
                <img
                  src={
                    selectArt?.artists?.artist_Image || "default-profile.png"
                  }
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
            className="w-1/3 h-full relative bg-slate-200 px-5"
          >
            <div className="text-2xl mt-14 text-fuchsia-800 font-bold text-center p-2">
              Comment on {selectArt?.art_Name || "Untitled"}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="h-[60%] w-full rounded-md shadow-inner shadow-slate-400 bg-slate-300"
            >
              {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((cmt, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 mb-2">
                    <img
                      src={cmt.user?.profile_picture || "default-profile.png"}
                      alt="User"
                      className="w-12 h-12 rounded-md object-cover border-2 border-gray-100"
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {cmt.user?.full_name || "Unknown"}
                      </div>
                      <span className="text-sm px-2 p-1 bg-white rounded-md text-gray-900">
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
    </div>
  );
}

export default Artists;
