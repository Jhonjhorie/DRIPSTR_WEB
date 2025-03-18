import React from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../constants/supabase";
import successEmote from "../../../../../src/assets/emote/success.png";
import questionEmote from "../../../../../src/assets/emote/question.png";
import {
  blockInvalidChar,
  validateMinLength2,
} from "../../Hooks/ValidNumberInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const { useState, useEffect } = React;
function ArtistAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [artistData, setArtistData] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [showAlertEdit, setShowEdit] = React.useState(false); // Alert Complete Info
  const [showAlertEditNochanges, setShowEditNochanges] = React.useState(false); // Alert No Complete Info
  const [showAlertSuccessEdit, setShowAlertSuccessEdit] = React.useState(false); // Alert Success Edit
  const [showAlertSuccessEditCon, setShowAlertSuccessEditCON] =
    React.useState(false); // Alert Success Edit Confirmation
  const phonedigit = (e) => {
    validateMinLength2(e, 11);
  };
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
          .select(
            "artist_Name, id, artist_Bio, art_Type, artist_Image, contact_number"
          )
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
  }, []); 

  const handleCloseModalEdit = () => {
    setShowEdit(false);
    setImagePreview(null);
    setSelectedFile(null);
    setFormData({
      artist_Name: "",
      art_Type: "",
      artist_Bio: "",
      contact_number: "",
    });
  };

  const [formData, setFormData] = useState({
    artist_Name: artistData?.artist_Name || "",
    art_Type: artistData?.art_Type || "",
    artist_Bio: artistData?.artist_Bio || "",
    contact_number: artistData?.contact_number || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleEdit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log("Updating artist ID:", artistData?.id);
      if (!artistData?.id) {
        alert("Error: Artist ID is missing.");
        return;
      }

      let updatedData = {};
      // Check if the fields name has changed and update only if it's different
      if (
        formData.artist_Name &&
        formData.artist_Name !== artistData.artist_Name
      ) {
        updatedData.artist_Name = formData.artist_Name;
      }
      if (formData.art_Type && formData.art_Type !== artistData.art_Type) {
        updatedData.art_Type = formData.art_Type;
      }
      if (
        formData.artist_Bio &&
        formData.artist_Bio !== artistData.artist_Bio
      ) {
        updatedData.artist_Bio = formData.artist_Bio;
      }
      if (
        formData.contact_number &&
        formData.contact_number !== artistData.contact_number
      ) {
        updatedData.contact_number = formData.contact_number;
      }

      if (Object.keys(updatedData).length === 0 && !selectedFile) {
        setShowEditNochanges(true);
        setTimeout(() => {
          setShowEditNochanges(false);
        }, 3000);
        setLoading(false);
        return;
      }

      // Upload image if new file is selected
      if (selectedFile) {
        const filePath = `artist_profile/${selectedFile.name}`;
        console.log("Uploading Image:", filePath);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("shop_profile")
          .upload(filePath, selectedFile, { upsert: true });

        if (uploadError) {
          console.error("Image Upload Error:", uploadError);
          throw uploadError;
        }

        console.log("Uploaded Data:", uploadData);

        const imageUrl = `https://pbghpzmbfeahlhmopapy.supabase.co/storage/v1/object/public/shop_profile/${filePath}`;
        updatedData.artist_Image = imageUrl;
      }

      const { data: updatedArtist, error: updateError } = await supabase
        .from("artist")
        .update(updatedData)
        .eq("id", artistData.id)
        .select();

      if (updateError) {
        console.error("Update Error:", updateError);
        throw updateError;
      }
      setFormData({
        artist_Name: "",
        art_Type: "",
        artist_Bio: "",
        contact_number: "",
      });
      console.log("Updated Artist Response:", updatedArtist);
      setShowAlertSuccessEditCON(false);
      setShowAlertSuccessEdit(true);
      setShowEdit(false);
      setLoading(false);
      fetchUserProfileAndArt();
    } catch (error) {
      console.error("Error updating artist data:", error);
      alert("Failed to update artist information.");
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setImageLoading(true);
    }
  };
  const closeConfirmEdit = () => {
    setShowAlertSuccessEdit(false);
  };
  const closeConfirmEditCon = () => {
    setShowAlertSuccessEditCON(false);
  };
  const handleConfirmEditCon = () => {
    setShowAlertSuccessEditCON(true);
  };
  return (
    <div className="h-full w-full bg-slate-300 overflow-y-scroll custom-scrollbar  ">
      <div className="absolute mx-3 right-0 z-10">
        <ArtistSideBar></ArtistSideBar>
      </div>
      <div className="text-3xl font-bold w-full text-left md:text-center text-custom-purple p-3">
        MANAGE ACCOUNT
      </div>
      <div className=" h-auto  w-full px-2 md:px-10 flex justify-center ">
        <div className="w-full md:w-1/2 mb-16  h-auto bg-slate-50 relative justify-items-center p-7 shadow-lg rounded-md">
          <div className="absolute top-2 right-2">
            <div
              onClick={setShowEdit}
              className="cursor-pointer hover:scale-95 duration-200"
            >
              {" "}
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
          </div>
          <div className="w-full md:flex gap-5">
            <div>
              <div className="bg-slate-100 relative h-44 place-self-center w-60 border-2 p-1 border-custom-purple rounded-md">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
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
              <div className="text-slate-900 text-2xl text-center mt-2 iceland-bold font-semibold">
                {artistData.artist_Name}
              </div>
              <div className="text-slate-100 text-lg bg-custom-purple glass rounded-md text-center mt-2 iceland-bold font-semibold">
                {artistData.art_Type}
              </div>
              <div className="text-slate-900 text-xl text-center mt-2 iceland-bold font-semibold">
                {artistData.contact_number}
              </div>
            </div>
            <div className="w-full">
              <div className=" text-slate-700 text-sm font-semibold text-left">
                Your Bio
              </div>
              <div className="text-custom-purple font-medium w-full h-64 rounded-md p-2 bg-red-100 overflow-hidden overflow-y-scroll ">
                " {artistData.artist_Bio} "
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ALLERTS ADD Item SUCCESS */}
      {showAlertEdit && (
        <div className="fixed inset-0 z-30 bg-gray-600 p-2 bg-opacity-50  flex justify-center items-center">
          <div className="bg-white md:h-auto mt-8 w-full md:w-[50%]  justify-items-center rounded-md shadow-md relative">
            <div className=" w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md">
              {" "}
            </div>
            <h1 className="text-custom-purple text-2xl iceland-bold">
              Edit Account Information
            </h1>
              <div></div>
              <div className="md:flex gap-2 w-full h-[500px] overflow-y-scroll overflow-hidden px-5 md:px-10 ">
                <div className="w-full md:w-1/2 h-auto ">
                  <div className=" p-2 w-full flex justify-center">
                    <div className="bg-slate-100 relative h-44 w-60 border-2 p-1 border-custom-purple rounded-md">
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <span className="loading loading-bars loading-lg"></span>
                        </div>
                      )}

                      <img
                        src={imagePreview || artistData?.artist_Image}
                        alt={artistData?.artist_Name}
                        className={`drop-shadow-custom h-full w-full object-cover rounded-md ${
                          imageLoading ? "opacity-0" : "opacity-100"
                        } transition-opacity duration-300`}
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                      />
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="label">
                      <span className="label-text text-slate-800 font-semibold">
                        Type is your Artist name
                      </span>
                    </div>
                    <input
                      type="text"
                      name="artist_Name"
                      value={formData.artist_Name}
                      onChange={handleInputChange}
                      placeholder={artistData.artist_Name}
                      className="p-1 bg-slate-300 w-full text-sm text-slate-800  rounded-sm"
                    ></input>{" "}
                    <br />
                    <div className="label">
                      <span className="label-text text-slate-800 font-semibold">
                        Type is your Contact number
                      </span>
                    </div>
                    <input
                      type="number"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      onKeyDown={blockInvalidChar}
                      onInput={phonedigit}
                      placeholder={artistData.contact_number}
                      className="p-1 bg-slate-300 w-full text-sm text-slate-800 rounded-sm"
                    ></input>{" "}
                    <br />
                    <div className="label">
                      <span className="label-text text-slate-800 font-semibold">
                        Type is your Art style
                      </span>
                    </div>
                    <input
                      type="text"
                      name="art_Type"
                      value={formData.art_Type}
                      onChange={handleInputChange}
                      placeholder={artistData.art_Type}
                      className="p-1 bg-slate-300 w-full text-slate-800 text-sm rounded-sm"
                    ></input>
                  </div>
                </div>
                <div className="w-full md:w-1/2 h-auto p-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="p-1 bg-slate-300 w-full text-sm text-slate-800 rounded-sm"
                    onChange={handleImageChange}
                  ></input>{" "}
                  <br />
                  <div className="label">
                    <span className="label-text text-slate-800 font-semibold">
                      Type your Artist Page Bio
                    </span>
                  </div>
                  <textarea
                    name="artist_Bio"
                    value={formData.artist_Bio}
                    onChange={handleInputChange}
                    placeholder={artistData.artist_Bio}
                    className="p-2 h-[80%] bg-slate-200 text-sm resize-none text-slate-800 shadow-md shadow-slate-400 w-full "
                  ></textarea>
                </div>
              </div>

              <div className="p-2  flex justify-between w-full px-12">
                <button
                  onClick={handleCloseModalEdit}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  {" "}
                  Close{" "}
                </button>
                <button
                  onClick={handleConfirmEditCon}
                  className="w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 flex justify-center items-center hover:bg-custom-purple-dark transition duration-300"
                >
                  Edit
                </button>
              </div>
          </div>
        </div>
      )}
      {/* ALLERTS ARTIST PAGE SUCCESSFULLY */}
      {showAlertSuccessEdit && (
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
              Artist Page Updated Successfully
            </h2>
            <div
              onClick={closeConfirmEdit}
              className="bg-primary-color m-2 p-1 px-2 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
            >
              Okay!
            </div>
          </div>
        </div>
      )}
      {showAlertSuccessEditCon && (
        <div className="fixed z-30 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-96 p-5   justify-items-center rounded-md shadow-md relative">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>
            <div className="p-5">
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1  drop-shadow-customViolet"
              />
            </div>

            <h2 className="text-2xl font-bold iceland-regular mb-4 text-slate-900 ">
              Update Account Information?
            </h2>
            <div className="w-full flex justify-between">
              <div
                onClick={closeConfirmEditCon}
                className="mt-4 p-2 px-4 bg-gray-500 cursor-pointer hover:bg-gray-700 duration-300 text-sm text-white py-2 rounded"
              >
                Cancel
              </div>
              <div
                onClick={handleEdit}
                className="mt-4 p-2 px-4 hover:bg-blue-700 cursor-pointer text-sm duration-300 bg-blue-500 text-white rounded"
              >
                Confirm
              </div>
            </div>
          </div>
        </div>
      )}
      {showAlertEditNochanges && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-30 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16 -z-10 justify-items-center content-center">
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
            <span>No information change made!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistAccount;
