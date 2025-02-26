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
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [artistDescription, setArtistDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [imageFile, setImageFile] = useState(null); // State to hold the image file
  const [imageFileID, setImageFileID] = useState(null); // State to hold the image file
  const [selectedImage, setSelectedImage] = useState(null); // show to the modal div
  const [selectedImageID, setSelectedImageID] = useState(null); // show to the modal div
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAlert, setShowAlert] = React.useState(false); // AlertShopname
  const [showAlertFL, setShowAlertFL] = React.useState(false); // AlertShopname
  const [showAlert2, setShowAlert2] = React.useState(false); // AlertContact
  const [showAlert3, setShowAlert3] = React.useState(false); // AlertDescription
  const [showAlert4, setShowAlert4] = React.useState(false); // Alert11digits
  const [showAlert5, setShowAlert5] = React.useState(false); // AlertAddress
  const [showAlert6, setShowAlert6] = React.useState(false); // AlertImageMissing
  const [showAlert7, setShowAlert7] = React.useState(false); // AlertImageMissing
  const [showAlertSuccess, setShowAlertSuccess] = React.useState(false); // Alert Success
  const [loading, setLoading] = useState(false);
  const [AcceptedTermsArtist, setAcceptedTermsArtist] = useState(false);
  const [TermsandConditionArtist, setTermsandConditionArtist] =
    React.useState(false); // Alert TANDC
  const handleArtistNameChange = (e) => setArtistName(e.target.value);
  const handleFullNameChange = (e) => setFullName(e.target.value);
  const handleArtistDescriptionChange = (e) =>
    setArtistDescription(e.target.value);

  const phonedigit = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhoneNumber(value);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setImageFile(file); 
      setSelectedImage(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  const handleFileChangeID = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFileID(file);
      setSelectedImageID(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
 
    //handles alerts on missing inputs
    if (!fullName.trim()) {
      console.error("Full name is required");
      setShowAlertFL(true);
      setTimeout(() => {
        setShowAlertFL(false);
      }, 3000);
      setLoading(false);
      return;
    }
    if (!artistName.trim()) {
      console.error("Shop name is required");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setLoading(false);
      return;
    }
    if (!selectedCategory.trim()) {
      console.error("Shop name is required");
      setShowAlert7(true);
      setTimeout(() => {
        setShowAlert7(false);
      }, 3000);
      setLoading(false);
      return;
    }
    if (!phoneNumber.trim()) {
      console.error("Phone Number is required");
      setShowAlert2(true);
      setTimeout(() => {
        setShowAlert2(false);
      }, 3000);
      setLoading(false);
      return; 
    }
    if (phoneNumber.length !== 11) {
      console.error("Phone Number must be 11 digits");
      setShowAlert4(true);
      setTimeout(() => {
        setShowAlert4(false);
      }, 3000);
      setLoading(false);
      return; 
    }
    if (!artistDescription.trim()) {
      console.error("Shop Description is required");
      setShowAlert5(true);
      setTimeout(() => {
        setShowAlert5(false);
      }, 3000);
      setLoading(false);
      return; 
    }
    if (!selectedImage) {
      console.error("Shop Image is required");
      setShowAlert6(true);
      setTimeout(() => {
        setShowAlert6(false);
      }, 3000);
      setLoading(false);
      return; 
    }

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
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, ""); 
        const uniqueFileName = `artist_profile/${timestamp}_${imageFile.name}`;
    
        const { data, error: uploadError } = await supabase.storage
          .from("shop_profile")
          .upload(uniqueFileName, imageFile);
    
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
    let uploadedImageUrlId = null;

    if (imageFileID) {
      try {
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, ""); 
        const uniqueFileName = `valid_ID/${timestamp}_${imageFile.name}`;
    
        const { data, error: uploadError } = await supabase.storage
          .from("shop_profile")
          .upload(uniqueFileName, imageFile);
    
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
    
          uploadedImageUrlId = publicUrlData.publicUrl;
          console.log("Image uploaded successfully:", uploadedImageUrlId);
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
            full_Name: fullName,
            artist_Name: artistName,
            contact_number: phoneNumber,
            art_Type: selectedCategory,
            artist_Bio: artistDescription,
            owner_Id: userId,
            artist_Image: uploadedImageUrl || null,
            valid_ID: uploadedImageUrlId || null,
          },
        ])
        .single();

      if (shopError) {
        console.error("Error inserting shop data:", shopError.message);
        return;
      }
      console.log("Artist page created successfully:", shopData);


      const { data: walletData, error: walletError } = await supabase
      .from("artist_Wallet")
      .insert([
        {
          number: phoneNumber,
          owner_Name: fullName,
          revenue: "0",
          valid_ID: uploadedImageUrlId || null,
          owner_ID: userId, 
        },
      ]);

    if (walletError) {
      console.error(
        "Error inserting into merchant_Wallet:",
        walletError.message
      );
      return;
    }

    console.log("Merchant Wallet created successfully:", walletData);
      setShowAlertSuccess(true);


      const { error: updateError } = await supabase
        .from("profiles")
        .update({ isArtist: true })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user profile:", updateError.message);
        return;
      }

      // Reset form fields after successful insertion
      setFullName("");
      setArtistName("");
      setPhoneNumber("");
      setArtistDescription("");
      setImageFile(null);
      setImageFileID(null);
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
  const handleCloseTandC = () => {
    setTermsandConditionArtist(false);
  };
  const ShowTandC = () => {
    setTermsandConditionArtist(true);
  };

  useEffect(() => {
    const checkAcceptedTerms = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("acceptTerms_Artist")
        .eq("id", user.id)
        .single();
  
      if (error) {
        console.error("Error fetching terms:", error);
        return;
      }
  
      if (data?.acceptTerms_Artist) {
        setAcceptedTermsArtist(true);
        setTermsandConditionArtist(false);
      } else {
        setTermsandConditionArtist(true);
      }
    };
  
    checkAcceptedTerms();
  }, []);
  

  const handleAcceptTerms = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not authenticated!");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ acceptTerms_Artist: true })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating terms:", error);
      alert("Failed to accept terms. Please try again.");
    } else {
      alert("Terms accepted successfully!");
      handleCloseTandC();
    }
  };

  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const categories = [
    "Street Art/Graffiti",
    "Digital Art",
    "Comic/Cartoon Art",
    "Anime/Manga",
    "Chibi Style",
    "Cubism",
    "Realism",
    "Others",
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === "Others") {
      setShowCustomInput(true);
      setCustomCategory("");
    } else {
      setShowCustomInput(false);
    }
  };

  return (
    <div className="h-full w-full">
      <div className="h-full w-full lg:flex justify-center items-center bg-slate-300 p-1  ">
        {/* FIRST CONTAINER */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white mb-16 md:mb-0 mt-5 md:mt-0 shadow-lg rounded-lg p-6"
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
                        What is your Fullname?
                      </span>
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={handleFullNameChange}
                      placeholder="Type here"
                      className="input input-bordered text-black bg-slate-100 border-violet-950 border-[2px] w-full"
                    />
                  </label>
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
                  <label className="form-control w-full max-w-xs mt-1">
                    <div className="label">
                      <span className="label-text text-slate-800 font-semibold">
                        What is your Gcash number?
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
                </div>
              </div>

              <div className="w-full md:w-1/2 h-full rounded-md -mt-7  place-items-center justify-center p-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text font-semibold text-slate-800">
                      What is your Art Style?
                    </span>
                  </div>

                  {/* Dropdown */}
                  <div className="dropdown dropdown-bottom w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="bg-custom-purple glass hover:scale-95 duration-300 rounded-md text-center text-slate-100 p-2  w-full"
                    >
                      {selectedCategory || "Choose a Category"}
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu border-2 border-primary-color bg-slate-100 text-slate-900 font-semibold rounded-md w-full z-[1] p-1 shadow"
                    >
                      {categories.map((category) => (
                        <li key={category}>
                          <a onClick={() => handleCategorySelect(category)}>
                            {category}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Custom Input for "Others" */}
                  {showCustomInput && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter your art style"
                      className="mt-2 p-2 border bg-slate-50 text-slate-900 border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary-color"
                    />
                  )}
                </label>



                <div className="label mt-1 w-full">
                  <span className="label-text text-slate-800 font-semibold">
                    Select your Artist Photo
                  </span>
                </div>
                <div className="h-auto w-full flex justify-center ">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    placeholder={fileName || "Choose a file..."}
                    className="file-input bg-slate-100 border-violet-950 border-2 max-w-xs  bottom-0 file-input-bordered w-full"
                  />
                </div>
                <div className="flex w-full gap-2 mt-3">
                  <div className=" flex-start">
                    <label className="label-text w-full  font-semibold ml-2 text-slate-800">
                      Upload Valid ID
                    </label>
                  </div>
                  <div className="relative">
                    <div className="group cursor-help inline-block">
                      <box-icon
                        color="#5B21B6"
                        name="info-circle"
                        type="solid"
                        className="hover:scale-105 duration-100"
                      ></box-icon>

                      {/* Tooltip - Only appears when hovering the icon */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-64 p-2 bg-gray-900 text-white text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <p className="font-semibold">
                          Valid IDs for Artist:
                        </p>
                        <ul className="list-disc list-inside">
                          <li>Passport</li>
                          <li>Driver’s License</li>
                          <li>SSS ID</li>
                          <li>UMID</li>
                          <li>PhilHealth ID</li>
                          <li>PRC ID</li>
                          <li>Postal ID</li>
                          <li>Voter’s ID</li>
                          <li>National ID</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-auto w-full flex  justify-center ">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChangeID}
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
          <div className="w-full h-auto justify-start flex m-2 mb-14 md:mb-0">
            {loading ? (
              <div className="text-center place-content-center px-5 mr-14 glass rounded-md bg-custom-purple">
                <span className="loading loading-dots loading-lg bg-slate-100"></span>
              </div>
            ) : (
              <button
                type="submit"
                className="btn glass bg-custom-purple   ml-[6%] iceland-regular tracking-wide text-lg text-white "
              >
                SUBMIT
              </button>
            )}
            <div
              onClick={ShowTandC}
              data-tip="Read Merchant Terms and Condition"
              className=" tooltip-left tooltip bg-slate-50 hover:scale-95 duration-200 cursor-pointer rounded-full shadow-md fixed right-7 bottom-14 md:bottom-7"
            >
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain h-16 w-16 rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
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
      {showAlertFL && (
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
            <span>Your Fullname is required!</span>
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
      {TermsandConditionArtist && (
        <div className="fixed inset-0 md:p-0 p-2 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full overflow-hidden h-[400px] md:h-auto  md:w-auto p-5   justify-items-center rounded-md shadow-md relative">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>

            <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
              Read Terms And Agreement
            </h2>

            <div className="bg-gradient-to-r top-0 overflow-hidden h-full left-0 from-violet-500 to-fuchsia-500 rounded-md text-slate-800 shadow-inner shadow-slate-600 md:h-[400px] md:w-[800px] overflow-y-scroll p-2 space-y-4">
              <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                <h1 className="text-xl md:text-3xl font-bold text-center text-gray-900 mb-6 border-b pb-3">
                  ARTIST’S TERMS AND AGREEMENT OF USE
                </h1>

                <div className="space-y-6 text-gray-700">
                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      1. DEFINITIONS
                    </h2>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        <strong>Artist:</strong> Any individual or entity that
                        uploads and sells digital artwork or accepts commissions
                        via the DRIPSTR platform.
                      </li>
                      <li>
                        <strong>Platform:</strong> DRIPSTR, the integrated
                        e-commerce and design software system for 3D apparel
                        creation, virtual shopping experiences, and digital
                        artwork sales.
                      </li>
                      <li>
                        <strong>Products:</strong> Any digital artwork, 3D
                        apparel designs, or related digital content uploaded by
                        Artists onto the DRIPSTR platform.
                      </li>
                      <li>
                        <strong>Agreement:</strong> These Terms and Conditions,
                        which govern the Artist’s use of the DRIPSTR platform.
                      </li>
                      <li>
                        <strong>Customer:</strong> Any individual or business
                        purchasing Products or commissioning artwork through the
                        DRIPSTR platform.
                      </li>
                    </ul>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      2. AGREEMENT
                    </h2>
                    <p>
                      These Terms and Conditions (referred to as "Agreement")
                      apply to all services and functionality provided by
                      DRIPSTR to the Artist, including the uploading of digital
                      artwork, storefront management, and commission requests
                      via chat.
                    </p>
                    <p>
                      By using the DRIPSTR platform, Artists agree to comply
                      with all terms laid out herein, as well as any additional
                      guidelines issued by DRIPSTR from time to time.
                    </p>
                    <p>
                      DRIPSTR reserves the right to modify these Terms at any
                      time. Changes will take effect immediately upon posting to
                      the platform. Artists are responsible for reviewing the
                      Terms regularly.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      3. ARTIST REGISTRATION AND VERIFICATION
                    </h2>
                    <p>
                      Upon registration, Artists must provide valid and accurate
                      personal or business documentation, including but not
                      limited to:
                    </p>
                    <ul className="list-disc list-inside pl-4">
                      <li>A valid Government-Issued ID</li>
                      <li>Portfolio or sample artwork for verification</li>
                      <li>Payment details for commission earnings</li>
                    </ul>
                    <p>
                      These documents will be used for verification purposes.
                      Failure to provide them may result in denied access to
                      artist functionalities on the DRIPSTR platform.
                    </p>
                    <p>
                      DRIPSTR reserves the right to suspend or terminate
                      accounts that fail to comply with the verification process
                      or provide fraudulent information.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      4. ARTIST RESPONSIBILITIES
                    </h2>
                    <p>
                      Artists are responsible for uploading accurate and
                      original digital artwork to the platform. They must ensure
                      they have legal rights to sell any uploaded Products.
                    </p>
                    <p>
                      Artists may accept commissions via the platform’s chat
                      feature and must ensure clear communication with Customers
                      regarding project scope, pricing, and deadlines.
                    </p>
                    <p>
                      Artists must not upload fraudulent or misleading content
                      or violate applicable laws.
                    </p>
                    <p>
                      Artists are expected to actively manage their storefronts,
                      update artwork regularly, and engage with Customers
                      professionally.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      5. PAYMENT AND REVENUE SHARING
                    </h2>
                    <p>
                      The platform will charge a 1% share on each commissioned
                      transaction, which may be updated from time to time by
                      DRIPSTR.
                    </p>
                    <p>
                      Payments to Artists will be processed through DRIPSTR’s
                      integrated payment system and distributed within 30 days
                      following the successful completion of a commission sale.
                    </p>
                    <p>
                      <strong>Wallet & Cash-Out:</strong>
                    </p>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        Artists will have a wallet where their commission
                        earnings will be reflected.
                      </li>
                      <li>
                        To withdraw funds, artists must submit a cash-out
                        request to DRIPSTR, subject to review and processing.
                      </li>
                    </ul>
                    <p>
                      <strong>Advertisement Services:</strong>
                    </p>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        Artists may promote their artwork or storefront via
                        DRIPSTR’s internal Advertisement System.
                      </li>
                      <li>
                        Advertisement costs will be billed separately and vary
                        based on type, duration, and scope.
                      </li>
                      <li>
                        DRIPSTR reserves the right to provide different
                        advertisement packages, including featured listings and
                        targeted promotions.
                      </li>
                    </ul>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      6. COMMISSION PROCESS AND DEADLINE
                    </h2>
                    <p>
                      Artists may accept commissions through the platform’s chat
                      feature and must provide clear terms regarding the scope,
                      pricing, and deadline of commissioned work.
                    </p>
                    <p>
                      Artists are responsible for ensuring timely completion of
                      commissioned work.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      7. LIABILITY AND WARRANTIES
                    </h2>
                    <p>
                      DRIPSTR makes no warranties regarding the performance or
                      accuracy of the platform.
                    </p>
                    <p>
                      DRIPSTR will not be liable for indirect, incidental, or
                      consequential damages resulting from platform use.
                    </p>
                    <p>
                      Artists are solely responsible for any claims or disputes
                      arising from their artwork.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      8. TERMINATION OF SERVICE
                    </h2>
                    <p>
                      DRIPSTR reserves the right to suspend or terminate an
                      Artist’s access to the platform for violating these Terms
                      or causing harm to DRIPSTR.
                    </p>
                    <p>
                      Artists may terminate their use of the platform at any
                      time but remain responsible for any obligations before the
                      termination date.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      9. INTELLECTUAL PROPERTY
                    </h2>
                    <p>
                      All intellectual property rights related to the DRIPSTR
                      platform remain the exclusive property of DRIPSTR.
                    </p>
                    <p>
                      Artists retain the intellectual property rights to their
                      uploaded artwork but grant DRIPSTR a non-exclusive,
                      royalty-free license to use, display, and promote their
                      work.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      10. GOVERNING LAW
                    </h2>
                    <p>
                      These Terms and Conditions are governed by the laws of the
                      jurisdiction in which DRIPSTR operates.
                    </p>
                    <p>
                      Any disputes arising from these Terms will be resolved in
                      accordance with the legal procedures of this jurisdiction.
                    </p>
                  </section>
                </div>

                <div className="mt-6 justify-center gap-2 flex">
                  {AcceptedTermsArtist ? (
                    <button
                      onClick={handleCloseTandC}
                      className="bg-gray-600 text-sm glass shadow-md shadow-slate-700 m-2 p-2 px-5 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
                    >
                      Close
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/account/shop-setup")}
                        className="bg-gray-600 text-sm glass shadow-md shadow-slate-700 m-2 p-2 px-3 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
                      >
                        Decline Terms
                      </button>
                      <button
                        onClick={handleAcceptTerms}
                        className="bg-primary-color text-sm glass shadow-md shadow-slate-700 m-2 p-2 px-3 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
                      >
                        Accept Terms
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistCreate;
