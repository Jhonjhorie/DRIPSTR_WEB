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
import successEmote from "../../../../../src/assets/emote/success.png";
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
  const [artsCounts, setArtsCounts] = useState([]);
  const [totalArtsCount, setTotalArtsCount] = useState(0); // Initialize with 0

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
          .select("artist_Name, id, artist_Bio, art_Type, artist_Image")
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
            console.error("Error fetching products:", artsError.message);
            setError(artsCounts.message);
          } else {
            // Count products by shop
            const artCountByArtist = artists.map((artist) => ({
              artist_Id: artist.id,
              artsCount: arts.filter((art) => art.artist_Id === artists.id)
                .length,
            }));

            setArtsCounts(artCountByArtist);

            // Calculate total art count
            const totalArtCount = artCountByArtist.reduce(
              (acc, artist) => acc + artist.artsCount,
              0
            );

            console.log("Total arts count:", totalArtCount);
            setTotalArtsCount(totalArtCount);

            setArtistArts(arts);
          }
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
  return (
    <div className="h-full w-full bg-slate-300  overflow-hidden  ">
      <div className="absolute mx-3 right-0 z-20">
        <ArtistSideBar></ArtistSideBar>
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
              <div
                onClick={() => navigate("/shop/Artist/ArtistAccount")}
                className="h-full w-20 duration-300 hover:scale-95 cursor-pointer"
              >
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
      <div className=" flex w-full h-full bg-slate-300 overflow-hidden">
        <div className="bg-violet-900 z-10 overflow-y-scroll sticky max-h-[550px] my-1 rounded-sm w-[350px]">
          <MessagesArtist></MessagesArtist>
        </div>
        <div className="p-2 w-full">
          <div className="bg-slate-300 h-[545px]  z-0 rounded-md w-full overflow-hidden  overflow-y-scroll p-5">
            {artistArts && artistArts.length > 0 ? (
              <div className="art-gallery h-auto w-auto gap-9 px-5  place-items-center">
                {artistArts
                  .slice()
                  .reverse()
                  .map((art) => (
                    <div
                      key={art.id}
                      className="bg-slate-50 relative group   rounded-md w-[60%] mb-5 m-2 p-4 h-auto"
                    >
                      <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-full border bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1">
                            <img
                              src={artistData.artist_Image}
                              alt="Shop Logo"
                              className="drop-shadow-custom h-full w-full object-cover rounded-full"
                            />
                          </div>
                          <div className="-mt-1">
                            <h1 className="text-[18px] pt-1 font-semibold text-custom-purple">
                              {artistData.artist_Name}
                            </h1>

                            <h2 className="text-[13px]  text-custom-purple ">
                              {artistData.art_Type}
                            </h2>
                          </div>
                        </div>
                        <div className="hover:scale-105 duration-200 cursor-pointer">
                          <box-icon type="solid" name="edit"></box-icon>
                        </div>
                      </div>

                      <div className="text-slate-800 font-semibold text-sm px-5 mt-2">
                        {art.art_Description}
                      </div>

                      <div
                        className={`mt-3 overflow-hidden cursor-pointer rounded-md border shadow-md border-custom-purple ${
                          imageOrientations[art.id] === "landscape"
                            ? "w-full h-[300px] flex justify-center"
                            : "w-[300px] h-[400px] mx-auto"
                        }`}
                        onClick={() =>
                          setSelectedImage({
                            image: art.art_Image,
                            name: art.art_Name,
                            artist: artistData.artist_Image,
                            artist_name: artistData.artist_Name,
                            id: art.id,
                          })
                        }
                      >
                        <img
                          src={art.art_Image}
                          alt="Art"
                          onLoad={(event) => handleImageLoad(event, art.id)}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="bg-custom-purple glass transition-transform duration-300 group-hover:scale-125 flex place-content-center gap-2 right-5 text-slate-50 font-semibold  rounded-md absolute w-auto bottom-5 h-auto p-3">
                        {" "}
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
            ) : (
              <div className=" h-full w-full place-content-center justify-items-center">
                <img
                  src={hmmmEmote}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-28 justify-center w-28 object-cover"
                />
                <h1 className="text-slate-900 font-semibold ">No upload yet.</h1>
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
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative min-h-[300px] bg-gradient-to-br from-violet-500 to-fuchsia-500 place-content-center justify-items-center p-4 rounded-lg shadow-lg min-w-[300px] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 text-white bg-gradient-to-br from-violet-500 to-fuchsia-500 px-3  rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            <img
              src={selectedImage.image}
              alt="Expanded Art"
              className={` overflow-hidden cursor-pointer rounded-md border shadow-md border-custom-purple ${
                imageOrientations[selectedImage.id] === "landscape"
                  ? "w-full h-[550px] flex justify-center"
                  : "w-auto h-[550px] mx-auto"
              }`}
            />

            <div className="bg-violet-500 text-white px-3 text-xl iceland-bold py-2 rounded-md absolute top-2 left-2 ">
              {selectedImage.name}
            </div>
            <div className=" absolute bottom-2 right-2 flex  ">
              <div className="text-white text-xl  drop-shadow-customWhite iceland-bold p-2 h-auto w-auto">
                {selectedImage.artist_name}
              </div>
              <div className="bg-fuchsia-500 text-white w-20 h-16 p-1 rounded-md ">
                <img
                  src={selectedImage.artist}
                  alt="Expanded Art"
                  className="h-full w-full  object-cover rounded-md"
                />
              </div>
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
