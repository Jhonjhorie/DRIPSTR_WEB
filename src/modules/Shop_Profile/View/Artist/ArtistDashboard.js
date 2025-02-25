import React from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import avatar from "../../../../assets/car.jpg";
import drplogo from "../../../../assets/logoBlack.png";
import rank from "../../../../assets/starrank.png";
import art1 from "../../../../assets/art1.jpg";
import art2 from "../../../../assets/art2.jpg";
import art3 from "../../../../assets/art3.jpg";
import MessagesArtist from "../../Component/MessagesArtist";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";
import questionEmote from "../../../../../src/assets/emote/question.png";
import { supabase } from "../../../../constants/supabase";
import hmmmEmote from "../../../../../src/assets/emote/hmmm.png";
import successEmote from "@/assets/emote/success.png";
const { useState, useEffect } = React;

function MerchantDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [artistData, setArtistData] = useState([]);
  const [showAddArt, setShowSelectedArts] = React.useState(false); // Alert Success
  const [adName, setAdName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageSrcArt, setImageSrcArt] = useState("");
  const [imageSrcArts, setImageSrcArts] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [artistArts, setArtistArts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // show the image of the selected post
  const [showAlert, setShowAlert] = React.useState(false); // Alert Complete Info
  const [showAlertSize, setShowAlertSize] = React.useState(false); // Alert
  const [imageOrientations, setImageOrientations] = useState({});
  const [showAlertSuccess, setShowAlertSuccess] = React.useState(false); // Alert Success
  const [imageLoading, setImageLoading] = useState(true);
  const [totLikes, setTotalLikesAll] = useState([]);
  const [totalArtsCount, setTotalArtsCount] = useState(0);
  const [totalFollowers, setTotalFollowersCount] = useState(0);
  const [selectArt, setSelectArt] = useState(null);
  const [selectMessage, setMessage] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        console.error("Error fetching user:", error?.message);
        return;
      }
      setUserId(userData.user.id);
    };
    fetchUser();
  }, []);
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
      setSelectedImage(true);
      const commentsList = artData?.comments || [];
      setComments(commentsList);
    } catch (err) {
      console.error("Unexpected error:", err.message);
      setComments([]);
    }
  };
  const handleImageLoad = (event, artId) => {
    const { naturalWidth, naturalHeight } = event.target;
    setImageOrientations((prev) => ({
      ...prev,
      [artId]: naturalWidth > naturalHeight ? "landscape" : "portrait",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [formData, setFormData] = useState({
    artName: "",
    artDesc: "",
  });
  const fetchUserProfileAndArt = async () => {
    setLoading(true);
  
    try {
      // Get the current authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
  
      if (!user) {
        console.log("No user is signed in.");
        setError("No user is signed in.");
        setLoading(false);
        return;
      }
  
      console.log("Current user:", user);
  
      // Fetch artist profile associated with the logged-in user
      const { data: artist, error: artistError } = await supabase
        .from("artist")
        .select("id, artist_Name, artist_Bio, art_Type, artist_Image, followers_Detail")
        .eq("owner_Id", user.id)
        .single();
  
      if (artistError || !artist) {
        console.log("No artist account found.");
        setError("No artist account found.");
        setLoading(false);
        return;
      }
  
      setArtistData(artist);
      setSelectedArtistId(artist.id);
      console.log("Artist Name:", artist.artist_Name);
      console.log("Artist ID:", artist.id);
  
      const totalFollowers = Array.isArray(artist.followers_Detail)
        ? artist.followers_Detail.length
        : 0;
  
      setTotalFollowersCount(totalFollowers);
      console.log("Total followers count:", totalFollowers);
  
      // Fetch only arts linked to this artist
      const { data: arts, error: artsError } = await supabase
        .from("artist_Arts")
        .select("id, art_Name, art_Description, art_Image, likes, comments")
        .eq("artist_Id", artist.id);
  
      if (artsError) {
        console.error("Error fetching arts:", artsError.message);
        setError("Error fetching arts.");
        setLoading(false);
        return;
      }
  
      setArtistArts(arts);
      setTotalArtsCount(arts.length);
      console.log("Total arts count:", arts.length);
    } catch (error) {
      console.error("Error fetching user/shop data:", error.message);
      setError("An error occurred while fetching user/shop data.");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchUserProfileAndArt();
  }, []);

  //handle Add art to the gallery
  const handleAddAd = async () => {
    const { artName, artDesc } = formData;
    if (!imageSrcArt || !artName || !artDesc) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }
    // Check image size
    const minWidth = 300;
    const minHeight = 300;

    const checkImageSize = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            if (img.width < minWidth || img.height < minHeight) {
              setShowAlertSize(true);
              setTimeout(() => {
                setShowAlertSize(false);
              }, 3000);
            } else {
              resolve();
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      await checkImageSize(imageFile);
    } catch (error) {
      alert(error);
      return;
    }

    setLoading(true);

    try {
      // Upload the selected image to Supabase storage
      const fileName = `${Date.now()}-${imageFile.name}`; // Unique file name
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("shop_profile/artist_Arts")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Image upload error:", uploadError.message);
        alert("Failed to upload image.");
        return;
      }

      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("shop_profile/artist_Arts")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData?.publicUrl;
      if (!imageUrl) {
        alert("Failed to get image URL.");
        return;
      }

      // Insert the new art into the database
      const { error } = await supabase.from("artist_Arts").insert([
        {
          art_Name: artName,
          art_Description: artDesc,
          artist_Id: selectedArtistId,
          art_Image: imageUrl,
        },
      ]);

      if (error) {
        console.error("Error adding art:", error.message);
        alert("Failed to add art.");
        return;
      }

      // Reset form data
      setFormData({
        artName: "",
        artDesc: "",
      });
      setImageSrcArt(null);
      document.getElementById("imageInput").value = "";
      setShowAlertSuccess(true);
      handleCloseModal();
      fetchUserProfileAndArt();
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      console.log("Preview URL:", previewUrl);
      setImageSrcArt(previewUrl); // Show preview
      setImageSrcArts(URL.createObjectURL(file)); // Show preview
    } else {
      setImageSrcArt("");
    }
  };
  const cancelImage = () => {
    setImageSrcArt(null);
    document.getElementById("imageInput").value = "";
  };
  const handleCloseModal = () => {
    setShowSelectedArts(false);
    setImageSrcArt("");
  };
  const handleCloseArtAddModal = () => {
    setShowAlertSuccess(false);
  };
  const handleOpenAddArt = () => {
    setShowSelectedArts(true);
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
        .eq("id", artId)
        .eq("artist_Id", selectedArtistId || userId);

      if (error) throw error;

      setArtistArts((prevArts) =>
        prevArts.map((art) =>
          art.id === artId ? { ...art, likes: updatedLikes } : art
        )
      );
    } catch (error) {
      console.error("Error updating likes:", error.message);
    }
    fetchTotalLikes();
  };

  const handleAddComment = async (artId) => {
    if (!newComment.trim()) return;

    try {
      // Get current user data
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw new Error("User fetch failed: " + userError.message);

      const userId = userData?.user?.id;
      if (!userId) throw new Error("User not logged in");

      // Check if the user is an artist
      const { data: artistData, error: artistError } = await supabase
        .from("artist")
        .select("id, artist_Name, artist_Image")
        .eq("id", selectedArtistId) // Get artist details using artist_Id
        .single();

      let commentAuthor = {};

      if (artistData) {
        // If user is an artist, store artist details
        commentAuthor = {
          isArtist: true,
          artistId: artistData.id,
          artistName: artistData.artist_Name,
          artistImage: artistData.artist_Image,
        };
      } else {
        // If user is a regular profile, fetch from "profiles" table
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_picture")
          .eq("id", userId)
          .single();

        if (profileError) throw new Error("Error fetching user profile");

        commentAuthor = {
          isArtist: false,
          userId: userProfile.id,
          userName: userProfile.full_name,
          userImage: userProfile.profile_picture,
        };
      }

      // Fetch existing comments
      const { data: artData, error: fetchError } = await supabase
        .from("artist_Arts")
        .select("comments")
        .eq("id", artId)
        .single();

      if (fetchError)
        throw new Error("Error fetching comments: " + fetchError.message);

      const existingComments = artData?.comments || [];

      // Add new comment with correct author details
      const updatedComments = [
        ...existingComments.map(comment => ({
          isArtist: comment.isArtist ?? false,
          artistId: comment.artistId ?? null,
          artistName: comment.artistName ?? null,
          artistImage: comment.artistImage ?? null,
          userId: comment.userId ?? null,
          userName: comment.userName ?? null,
          userImage: comment.userImage ?? null,
          text: comment.text,
          timestamp: comment.timestamp
        })),
        {
          ...commentAuthor,
          text: newComment,
          timestamp: new Date().toISOString(),
        }
      ];

      // Update the database
      const { error: updateError } = await supabase
        .from("artist_Arts")
        .update({ comments: updatedComments })
        .eq("id", artId);

      if (updateError)
        throw new Error("Error updating comment: " + updateError.message);

      // Update UI
      setArtistArts((prevArts) =>
        prevArts.map((art) =>
          art.id === artId ? { ...art, comments: updatedComments } : art
        )
      );

      setNewComment("");
      await fetchCommentsWithUsers(artId);  

    } catch (error) {
      console.error(error.message);
    }
    
  };

  const fetchCommentsWithUsers = async (artId) => {
    if (!artId) return;

    try {
      setLoading(true);

      const { data: commentsData, error } = await supabase
        .from("artist_Arts")
        .select("comments")
        .eq("id", artId)
        .single();

      if (error) {
        console.error("Error fetching comments:", error.message);
        return;
      }

      console.log("Fetched Comments Data:", commentsData);

      const comments = Array.isArray(commentsData?.comments)
        ? commentsData.comments
        : [];

      if (comments.length === 0) {
        console.warn("No comments found for this art.");
        setComments([]);
        return;
      }

      const userIds = [
        ...new Set(comments.map((cmt) => cmt.userId).filter(Boolean)),
      ];

      console.log("User IDs:", userIds);

      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_picture")
          .in("id", userIds);

        if (usersError) {
          console.error("Error fetching users:", usersError.message);
          return;
        }

        console.log("Fetched Users Data:", usersData);

        const userMap = usersData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        const updatedComments = comments.map((cmt) => ({
          ...cmt,
          user: userMap[cmt.userId] || null,
        }));

        console.log("Updated Comments with Users:", updatedComments);

        setComments(updatedComments);
      } else {
        setComments(comments);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchTotalLikes = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError) {
        console.error("Error fetching user:", authError.message);
        return;
      }
  
      if (!user) {
        console.log("No user is signed in.");
        return;
      }
  
      // Fetch artist ID linked to the user
      const { data: artist, error: artistError } = await supabase
        .from("artist")
        .select("id")
        .eq("owner_Id", user.id)
        .single();
  
      if (artistError || !artist) {
        console.log("No artist account found.");
        return;
      }
  
      // Fetch all artworks of the current artist
      const { data: artworks, error: artsError } = await supabase
        .from("artist_Arts")
        .select("likes")
        .eq("artist_Id", artist.id);
  
      if (artsError) {
        console.error("Error fetching likes:", artsError.message);
        return;
      }
  
      // Calculate total likes across all artworks
      const totalLikes = artworks.reduce(
        (sum, art) => sum + (Array.isArray(art.likes) ? art.likes.length : 0),
        0
      );
  
      setTotalLikesAll(totalLikes); // Update the state
      console.log("Total likes across all arts:", totalLikes);
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };
  
  useEffect(() => {
    fetchTotalLikes();
  }, []);
  useEffect(() => {
    if (selectArt?.id) {
      fetchCommentsWithUsers(selectArt.id);
    }
  }, [selectArt]);

  return (
    <div className="h-full w-full bg-slate-300  overflow-hidden  ">
      <div className="absolute mx-3 right-0 z-20">
        <ArtistSideBar />
      </div>
      <div className="w-full h-20  sticky top-0 z-10 bg-violet-600 shadow-md pr-20 px-16 ">
        <div className="w-full h-full flex gap-3 p-2">
          <div className="flex justify-between w-full ">
            <div className="flex gap-2">
              <div className="h-full w-24 relative rounded-md border bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-custom-purple rounded-md ">
                    <span className="loading loading-bars loading-lg"></span>
                  </div>
                )}

                {artistData && (
                  <img
                    src={artistData.artist_Image}
                    alt={artistData.artist_Name}
                    className={`drop-shadow-custom h-full w-full object-cover rounded-md ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    } transition-opacity duration-300`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                )}
              </div>
              {!loading ? (
                <div className="">
                  <h1 className="text-[20px] pt-1 font-semibold text-slate-100">
                    {artistData.artist_Name}
                  </h1>

                  <h2 className="text-[13px]  text-slate-50">
                    {artistData.art_Type}
                  </h2>
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span>Loading...</span>
                </div>
              )}

              <div></div>
            </div>

            <div className="flex gap-5">
            <div className="h-full w-20 ">
                <div className="h-full w-20 justify-items-center ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="text-2xl text-slate-100"> {totLikes}</div>
                    <div className="pt-1">
                      {" "}
                      <box-icon  color="white" size="100%" type='solid' name='like'></box-icon>
                    </div>
                  </div>

                  <div className="text-slate-50 text-sm">Arts Likes</div>
                </div>
              </div>
              <div className="h-full w-20 ">
                <div className="h-full w-20 justify-items-center ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="text-2xl text-slate-100"> {totalFollowers}</div>
                    <div className="pt-1">
                      {" "}
                      <box-icon
                        color="white"
                        size="100%"
                        name="group"
                        type="solid"
                      ></box-icon>
                    </div>
                  </div>

                  <div className="text-slate-50 text-sm">Followers</div>
                </div>
              </div>
              <div className="h-full w-20 ">
                <div className="h-full w-20 justify-items-center ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="text-2xl text-slate-100">
                      {totalArtsCount}
                    </div>
                    <div className="pt-1">
                      {" "}
                      <box-icon
                        color="white"
                        type="solid"
                        name="book-heart"
                      ></box-icon>
                    </div>
                  </div>

                  <div className="text-slate-50  text-sm">Arts</div>
                </div>
              </div>

              <div
                onClick={handleOpenAddArt}
                className="h-full w-20 duration-300 hover:scale-95 cursor-pointer"
              >
                <div className="h-full w-20 justify-items-center bg-slate-50 bg-opacity-25 shadow-md rounded-md ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="pt-1">
                      {" "}
                      <box-icon
                        color="white"
                        type="solid"
                        name="edit"
                      ></box-icon>
                    </div>
                  </div>

                  <div className="text-slate-50  text-sm">Post Art</div>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
      <div className=" flex w-full h-full bg-slate-300 overflow-hidden">
        <div className="p-2 w-full">
          <div className="bg-slate-300 h-[545px]  z-0 rounded-md w-full overflow-hidden  overflow-y-scroll p-5">
            {artistArts && artistArts.length > 0 ? (
              <div className="columns-2 sm:columns-3 md:columns-4 gap-2 px-4 space-y-2">
                {artistArts
                  .slice()
                  .reverse()
                  .map((art) => (
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
                          className="tooltip tooltip-left text-sm flex items-center gap-1 cursor-pointer hover:scale-105 duration-200 text-yellow-500"
                          data-tip="See complaints"
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
            ) : (
              <div className=" h-full w-full place-content-center justify-items-center">
                <img
                  src={hmmmEmote}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-28 justify-center w-28 object-cover"
                />
                <h1 className="text-slate-900 font-semibold ">
                  No upload yet.
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ALLERTS ADD Item SUCCESS */}
      {showAddArt && (
        <div className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white h-auto  w-[60%]  justify-items-center rounded-md shadow-md relative">
            <div className=" w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>
            <div className=" p-2 w-full">
              <div className=" p-5 h-auto w-full ">
                <div className="font-medium text-slate-800 py-2 w-full flex justify-between place-items-center  ">
                  <span className="font-bold text-[20px] md:text-2xl">
                    Add Art to your Gallery
                  </span>
                  <box-icon name="images" color="#4D077C"></box-icon>
                </div>
                <div className="h-auto w-full bg-slate-200 place-items-center md:place-items-start  rounded-md shadow-sm mb-2 p-2 md:flex gap-2">
                  <div className="w-full h-auto p-2">
                    <div className="mt-2">
                      <label className=" text-slate-800  text-sm font-semibold">
                        Name:
                      </label>{" "}
                      <br />
                      <input
                        type="text"
                        name="artName"
                        className="bg-slate-100 p-1 rounded-sm shadow-md mt-1 text-slate-800 w-full"
                        placeholder="Type Art Name"
                        value={formData.artName}
                        onChange={handleChange}
                      ></input>{" "}
                      <br />
                    </div>
                    <div className="mt-2">
                      <label className=" text-slate-800  text-sm font-semibold">
                        Name:
                      </label>{" "}
                      <br />
                      <textarea
                        type="text"
                        name="artDesc"
                        className="bg-slate-100 p-1 rounded-sm shadow-md mt-1 text-slate-800 w-full"
                        placeholder="Art Description"
                        value={formData.artDesc}
                        onChange={handleChange}
                      ></textarea>{" "}
                      <br />
                    </div>
                    <div className="mt-2 ">
                      <label className=" text-slate-800  text-sm font-semibold mt-2">
                        Choose a marketing visual
                      </label>{" "}
                      <br />
                      <input
                        onChange={handleImagePick}
                        accept="image/*"
                        id="imageInput"
                        type="file"
                        className="bg-slate-100 text-slate-700 w-full shadow-md mt-1"
                      ></input>
                      <div className=" place-items-end py-2">
                        <div
                          onClick={cancelImage}
                          className="bg-custom-purple p-1 glass rounded-md hover:scale-95 duration-300 cursor-pointer text-white"
                        >
                          Cancel{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[180px] h-2/3 md:w-full md:h-64 bg-custom-purple shadow-md glass rounded-sm p-2">
                    <div className="bg-slate-100 h-[200px] md:h-full rounded-sm shadow-md place-items-center flex place-content-center">
                      {imageSrcArt ? (
                        <img
                          src={imageSrcArt}
                          className="h-full w-full object-contain"
                          alt="Preview of the selected marketing visual"
                        />
                      ) : (
                        <span>Art will appear here</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between w-full">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-green-500  text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={handleAddAd}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Image Modal */}
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
                {artistData.artist_Name || "Unknown Artist"}
              </div>
              <div className="bg-fuchsia-500 text-white w-20 h-16 p-1 rounded-md">
                <img
                  src={artistData.artist_Image || successEmote}
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
            <div className="text-2xl mt-5 md:mt-14 text-fuchsia-800 font-bold text-center p-2">
              Comment on {selectArt?.art_Name || "Untitled"}
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
              className="h-[60%] w-full rounded-md shadow-inner overflow-y-auto shadow-slate-400 bg-slate-300"
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
                    <img src={hmmmEmote} alt="" className="h-20 w-20" />
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
      {showAlert && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-20 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Please Complete the Information to proceed.</span>
          </div>
        </div>
      )}
      {showAlertSize && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-20 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Image size should exceed to 300 x 300 pixels.</span>
          </div>
        </div>
      )}
      {showAlertSuccess && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-96 p-5   justify-items-center rounded-md shadow-md relative">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>
            <div className="p-5">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1  drop-shadow-customViolet"
              />
            </div>

            <h2 className="text-2xl font-bold iceland-regular mb-4 text-slate-900 ">
              New Art Successfully Added.
            </h2>
            <div
              onClick={handleCloseArtAddModal}
              className="bg-primary-color m-2 p-1 px-2 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
            >
              Okay!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MerchantDashboard;
