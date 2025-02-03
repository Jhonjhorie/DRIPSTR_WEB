import React, { useEffect, useState } from "react";
import logo from "../../../assets/shop/logoWhite.png";
import "../../../assets/shop/fonts/font.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import questionEmote from "../../../../src/assets/emote/question.png";
import successEmote from "../../../../src/assets/emote/success.png";
import "boxicons";

function ArtistCreate() {
  const navigate = useNavigate();
  const [artistName, setArtistName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [artistDescription, setArtistDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [imageFile, setImageFile] = useState(null); // State to hold the image file
  const [selectedImage, setSelectedImage] = useState(null); // show to the modal div
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAlert, setShowAlert] = React.useState(false); // AlertShopname
  const [showAlert2, setShowAlert2] = React.useState(false); // AlertContact
  const [showAlert3, setShowAlert3] = React.useState(false); // AlertDescription
  const [showAlert4, setShowAlert4] = React.useState(false); // Alert11digits
  const [showAlert5, setShowAlert5] = React.useState(false); // AlertAddress
  const [showAlert6, setShowAlert6] = React.useState(false); // AlertImageMissing
  const [showAlert7, setShowAlert7] = React.useState(false); // AlertImageMissing
  const [showAlertSuccess, setShowAlertSuccess] = React.useState(false); // Alert Success
  const [loading, setLoading] = useState(false);

  const handleArtistNameChange = (e) => setArtistName(e.target.value);
  const handleArtistDescriptionChange = (e) => setArtistDescription(e.target.value);
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const phonedigit = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhoneNumber(value);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setImageFile(file); // Store the file in state
      setSelectedImage(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setLoading(true);
    //handles alerts on missing inputs
    //handles alerts on missing inputs
    if (!artistName.trim()) {
      console.error("Shop name is required");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setLoading(false);
      return; // Do not proceed if the field is empty
    }
    if (!selectedCategory.trim()) {
      console.error("Shop name is required");
      setShowAlert7(true);
      setTimeout(() => {
        setShowAlert7(false);
      }, 3000);
      setLoading(false);
      return; // Do not proceed if the field is empty
    }
    if (!phoneNumber.trim()) {
      console.error("Phone Number is required");
      setShowAlert2(true);
      setTimeout(() => {
        setShowAlert2(false);
      }, 3000);
      setLoading(false);
      return; // Do not proceed if the phone number is empty
    }
    if (phoneNumber.length !== 11) {
      console.error("Phone Number must be 11 digits");
      setShowAlert4(true);
      setTimeout(() => {
        setShowAlert4(false);
      }, 3000);
      setLoading(false);
      return; // Ensure phone number is exactly 11 digits
    }
    if (!artistDescription.trim()) {
      console.error("Shop Description is required");
      setShowAlert5(true);
      setTimeout(() => {
        setShowAlert5(false);
      }, 3000);
      setLoading(false);
      return; // Do not proceed if the field is empty
    }
    if (!selectedImage) {
      console.error("Shop Image is required");
      setShowAlert6(true);
      setTimeout(() => {
        setShowAlert6(false);
      }, 3000);
      setLoading(false);
      return; // Do not proceed if the field is empty
    }
    //define current user credit
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user || userError) {
      console.error("No user found");
      return;
    }

    let uploadedImageUrl = null;

    if (imageFile) {
      try {
        // Upload the image to Supabase storage
        const { data, error: uploadError } = await supabase.storage
          .from("shop_profile")
          .upload(`artist_profile/${imageFile.name}`, imageFile);

        if (uploadError) {
          console.error("Error uploading image:", uploadError.message);
          return;
        }
        if (data?.path) {
          const { data: publicUrlData, error: urlError } = supabase.storage
            .from("shop_profile")
            .getPublicUrl(data.path);

          if (urlError) {
            console.error("Error fetching image URL:", urlError.message);
            return;
          }

          uploadedImageUrl = publicUrlData.publicUrl;
          console.log("Image uploaded successfully:", uploadedImageUrl);
        }
      } catch (err) {
        console.error("Unexpected error while uploading image:", err);
        return;
      }
    }

    const userId = user.id;

    try {
      const { data: shopData, error: shopError } = await supabase
        .from("artist")
        .insert([
          {
            artist_Name: artistName,
            contact_number: phoneNumber,
            art_Type: selectedCategory,
            artist_Bio: artistDescription,
            owner_Id: userId, // Set the owner_id to the current user's ID
            artist_Image: uploadedImageUrl || null,
          },
        ])
        .single();

      if (shopError) {
        console.error("Error inserting shop data:", shopError.message);
        return;
      }

      setShowAlertSuccess(true);
      console.log("Artist page created successfully:", shopData);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ isArtist: true })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user profile:", updateError.message);
        return;
      }

      // Reset form fields after successful insertion
      setArtistName("");
      setPhoneNumber("");
      setArtistDescription("");
      setImageFile(null);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };
  const closeConfirmArtistCreation = () => {
    setTimeout(() => {
      setShowAlertSuccess(false);
    }, 1000);
    navigate("/shop/Artist/ArtistDashboard");
  };

  return (
    <div className="h-full w-full">
      <div className="h-full w-full lg:flex justify-center items-center bg-slate-300 p-1  ">
        {/* SECOND CONTAINER */}

        {/* FIRST CONTAINER */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6"
        >
          <div className=" h-auto  w-full md:px-10 -mt-2 overflow-hidden ">
            <div className="flex w-full md:gap-2 md:justify-start justify-center mt-5 md:mt-0  ">
              <box-icon
                name="palette"
                type="solid"
                color="#4D077C"
                size="md"
              ></box-icon>
              <div className="font-bold text-2xl  flex p-2 text-custom-purple iceland-regular ">
                Create Artist Account
              </div>
            </div>
            <div className="font-bold text-5xl text-center md:text-left p-2 text-custom-purple iceland-bold">
              Get Started
            </div>

            <div className="md:flex w-full -mt-5 place-items-center h-[50%] gap-2 lg:gap-8  p-2 ">
              <div className="w-full md:w-1/2 h-full flex items-center justify-center">
                <div className="w-full max-w-xs">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text text-slate-800 font-semibold">
                        What is your Artist Name?
                      </span>
                    </div>
                    <input
                      type="text"
                      id="artistName"
                      value={artistName}
                      onChange={handleArtistNameChange}
                      placeholder="Type here"
                      className="input input-bordered text-black bg-slate-100 border-violet-950 border-[2px] w-full"
                    />
                  </label>
                  <label className="form-control w-full max-w-xs mt-2">
                    <div className="label">
                      <span className="label-text text-slate-800 font-semibold">
                        What is your contact number?
                      </span>
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      placeholder="Type here"
                      onChange={phonedigit}
                      className="input input-bordered bg-slate-100 text-black border-violet-950 border-[2px] w-full"
                    />
                  </label>
                  <div className="label">
                    <span className="label-text-alt text-slate-700">
                      Phone number should be 11 digits.
                    </span>
                  </div>

                  <label className="form-control w-full max-w-xs ">
                    <div className="label">
                      <span className="label-text font-semibold text-slate-800">
                        What is your Art Style?
                      </span>
                    </div>
                    <div className="dropdown dropdown-top w-full">
                      <div
                        tabIndex={0}
                        role="button"
                        className="bg-custom-purple glass hover:scale-95 duration-300 rounded-md text-center text-slate-100 p-2 mt-2 w-full"
                      >
                        {selectedCategory || "Choose a Category"}
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu border-2 border-primary-color bg-slate-100 text-slate-900 font-semibold rounded-md w-full z-[1] p-1 shadow"
                      >
                        {[
                          "Street Art/Graffiti",
                          "Digital Art",
                          "Comic/Cartoon Art",
                          "Anime/Manga",
                          "Chibi Style",
                          "Cubism",
                          "Realism",
                          "Others",
                        ].map((category) => (
                          <li key={category}>
                            <a onClick={() => handleCategorySelect(category)}>
                              {category}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </label>
                </div>
              </div>

              <div className="w-full md:w-1/2 h-full rounded-md  place-items-center justify-center p-2">
                <div className="bg-slate-100 w-72 h-52 flex items-center justify-center mt-5 border-violet-950 border-2 rounded-md">
                  {/* SHOP LOGO GOES HERE */}
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Uploaded shop photo"
                      className="w-full h-full object-cover rounded-sm"
                    />
                  ) : (
                    <div className=" w-full text-4xl text-custom-purple place-content-center text-center h-full">
                      <i className="fa-solid fa-image"></i>
                    </div>
                  )}
                  {""}
                </div>
                <div className="h-auto w-full flex mt-6 justify-center ">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    placeholder={fileName || "Choose a file..."}
                    className="file-input bg-slate-100 border-violet-950 border-2 max-w-xs  bottom-0 file-input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            <label className="form-control -mt-5 mx-2 flex justify-center items-center md:items-start ">
              <div className="label">
                <span className="label-text font-semibold text-slate-800">
                  Introduce yourself
                </span>
              </div>
              <textarea
                id="artistDescription"
                value={artistDescription}
                onChange={handleArtistDescriptionChange}
                className="textarea font-semibold resize-none textarea-bordered w-[90%] md:w-full bg-slate-100 text-black border-violet-950 border-[2px] h-24"
              ></textarea>
            </label>
          </div>
          <div className="w-full h-auto justify-end flex m-2 mb-14 md:mb-0">
            {loading ? (
              <div className="text-center place-content-center px-5 mr-14 glass rounded-md bg-custom-purple">
                <span className="loading loading-dots loading-lg bg-slate-100"></span>
              </div>  
            ) : (
              <button
                type="submit"
                className="btn glass bg-custom-purple   mr-[8%] iceland-regular tracking-wide text-lg text-white "
              >
                SUBMIT
              </button>
            )}
          </div>
        </form>
      </div>
      {showAlert && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
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
            <span>Shop name is required!</span>
          </div>
        </div>
      )}
      {showAlert2 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-20 -z-10 justify-items-center content-center">
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
            <span>Artist Contact Number is Required!</span>
          </div>
        </div>
      )}
      {showAlert3 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
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
            <span>Artist Introduction is Required!</span>
          </div>
        </div>
      )}
      {showAlert4 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-36  -z-10 justify-items-center content-center">
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
            <span>Artist number should be 11 digits!</span>
          </div>
        </div>
      )}
      {showAlert5 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-32 -z-10 justify-items-center content-center">
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
            <span>Artist Description is Required!</span>
          </div>
        </div>
      )}
      {showAlert6 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
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
            <span>Artist Image is Required!</span>
          </div>
        </div>
      )}
      {showAlert7 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
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
            <span>Artist Category is Required!</span>
          </div>
        </div>
      )}
      {/* ALLERTS ARTIST PAGE SUCCESSFULLY */}
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
              Artist Page Created Successfully
            </h2>
            <div
              onClick={closeConfirmArtistCreation}
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

export default ArtistCreate;
