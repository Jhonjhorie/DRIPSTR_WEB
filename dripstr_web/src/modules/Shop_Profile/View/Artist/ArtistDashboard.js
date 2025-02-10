import React from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import avatar from "../../../../assets/car.jpg";
import drplogo from "../../../../assets/logoBlack.png";
import rank from "../../../../assets/starrank.png";
import art1 from "../../../../assets/art1.jpg";
import art2 from "../../../../assets/art2.jpg";
import art3 from "../../../../assets/art3.jpg";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../../../constants/supabase";

const { useState, useEffect } = React;
function MerchantDashboard() {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [artistData, setArtistData] = useState(null);
  const [showAddArt, setShowSelectedArts] = React.useState(false); // Alert Success
  const [adName, setAdName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageSrcArt, setImageSrcArt] = useState("");
  const [imageSrcArts, setImageSrcArts] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [artistArts, setArtistArts] = useState([]);

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
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (user) {
        console.log("Current user:", user);

        const { data: artists, error: artistError } = await supabase
          .from("artist")
          .select("artist_Name, id, artist_Image")
          .eq("owner_Id", user.id);

        if (artistError) {
          throw artistError;
        }

        if (artists && artists.length > 0) {
          const artist = artists[0];
          setArtistData(artist);
          setSelectedArtistId(artist.id);
          console.log("Artist Name:", artist.artist_Name);
          console.log("Artist ID:", artist.id);

          const { data: arts, error: artsError } = await supabase
            .from("artist_Arts")
            .select("art_Name, id, art_Description, art_Image")
            .eq("artist_Id", artist.id);

          if (artsError) {
            throw artsError;
          }

          setArtistArts(arts); // Assuming `setArtistArts` is a state setter
        } else {
          console.log("No artist page found for the current user.");
          setError("No artist page found for the current user.");
        }
      } else {
        console.log("No user is signed in.");
        setError("No user is signed in.");
      }
    } catch (error) {
      console.error("Error fetching user/shop data:", error.message);
      setError("An error occurred while fetching user/shop data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProfileAndArt();
  }, []); // Run once on mount

  //handle Add art to the gallery
  const handleAddAd = async () => {
    const { artName, artDesc } = formData;
    if (!imageSrcArt || !artName || !artDesc) {
      alert("Please provide both the ad name and marketing visual.");
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
      alert("Art successfully added!");
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
  };
  const handleOpenAddArt = () => {
    setShowSelectedArts(true);
  };
  return (
    <div className="h-full w-full bg-slate-300   ">
      <div className="w-full h-20  bg-violet-600 shadow-md px-16 ">
        <div className="w-full h-full flex gap-3 p-2">
          <div className="flex justify-between w-full ">
            <div className="flex gap-2">
              <div className="h-full w-24 rounded-md border bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1">
                <img
                  src={avatar}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                />
              </div>
              <div className="">
                <h1 className="text-[20px] pt-1 font-semibold text-slate-100">
                    Cat perspective 
                </h1>
                <h2 className="text-[13px]  text-slate-50">Digital Art</h2>
              </div>
              <div></div>
            </div>

            <div className="flex gap-5">
              <div className="h-full w-20 ">
                <div className="h-full w-20 justify-items-center ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="text-2xl text-slate-100">10</div>
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
                    <div className="text-2xl text-slate-100">2</div>
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
              <div className="h-full w-20 duration-300 hover:scale-95 cursor-pointer">
                <div className="h-full w-20 justify-items-center bg-slate-900 bg-opacity-30 shadow-md rounded-md ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="pt-1">
                      {" "}
                      <box-icon
                        color="white"
                        type="solid"
                        name="user-pin"
                      ></box-icon>
                    </div>
                  </div>

                  <div className="text-slate-50  text-sm">Account</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="bg-slate-300 h-[520px] rounded-md w-full overflow-hidden flex flex-wrap gap-9 overflow-y-scroll p-5">
          {artistArts && artistArts.length > 0 ? (
            <div className="art-gallery h-auto flex flex-wrap items-centers gap-9 px-10">
              {artistArts.map((art) => (
                <div
                  key={art.id}
                  className="bg-slate-50 rounded-sm cursor-pointer h-auto hover:scale-105 duration-300 shadow-md p-1 flex flex-col"
                >
                  <div className="flex justify-center h-auto bg-slate-100 w-full">
                    {art.art_Image ? (
                      <img
                        src={art.art_Image}
                        alt={art.art_Name}
                        className="object-cover w-full h-48 rounded-sm"
                      />
                    ) : (
                      <span>No image available</span>
                    )}
                  </div>
                  <div className="w-full bg-slate-900 text-sm text-center text-slate-200 p-1">
                    <span>{art.art_Name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No arts found for this artist.</p>
          )}
        </div>
      </div>
      {/* ALLERTS ADD Item SUCCESS */}
      {showAddArt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
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
                        <span>Ads will appear here</span>
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
    </div>
  );
}

export default MerchantDashboard;
