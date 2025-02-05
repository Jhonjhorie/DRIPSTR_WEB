import React, { useEffect, useState } from "react";
import logo from "../../../assets/shop/logoWhite.png";
import "../../../assets/shop/fonts/font.css";
import { useNavigate } from "react-router-dom";
import "boxicons";
import { supabase } from "../../../constants/supabase";
import questionEmote from "../../../../src/assets/emote/question.png";
import successEmote from "../../../../src/assets/emote/success.png";
import sadEmote from "../../../../src/assets/emote/error.png";
import hmmEmote from "../../../../src/assets/emote/hmmm.png";

function Login() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [showAlert, setShowAlert] = React.useState(false); // AlertShopname
  const [showAlert2, setShowAlert2] = React.useState(false); // AlertContact
  const [showAlert3, setShowAlert3] = React.useState(false); // AlertDescription
  const [showAlert4, setShowAlert4] = React.useState(false); // Alert11digits
  const [showAlert5, setShowAlert5] = React.useState(false); // AlertAddress
  const [showAlert6, setShowAlert6] = React.useState(false); // AlertImageMissing
  const [showAlert7, setShowAlert7] = React.useState(false); // AlertFileMissing
  const [showImage, setshowImage] = React.useState(false); //Show image modal
  const [showFile, setshowFile] = React.useState(false); //Show File modal
  const [selectedImage, setSelectedImage] = useState(null); // show to the modal div
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(null);
  const [showAlertSuccess, setShowAlertSuccess] = React.useState(false); // Alert Success

  const [imageFile, setImageFile] = useState(null); // State to hold the image file
  const [pdfFile, setpdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStat, setStatus] = useState(null);
  const [hasCreatedAccount, setHasCreatedAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const fetchUserProfile = async () => {
    setLoading(false);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setError(authError.message);

        return;
      }

      if (user) {
        const { data: shopData, error: shopError } = await supabase
          .from("merchantRegistration")
          .select("is_Approved")
          .eq("id", user.id);

        if (shopError) {
          console.error("Error fetching shop data:", shopError.message);
        } else if (shopData && shopData.length > 0) {
          const firstShop = shopData[0];
          setHasCreatedAccount(true);

          if (firstShop.is_Approved === true) {
            setStatus("approved");
          } else if (firstShop.is_Approved === false) {
            setStatus("declined");
          } else {
            setStatus("pending");
          }
        } else {
          setHasCreatedAccount(false);
          setStatus(null);
        }
      } else {
        console.log("No user is signed in.");
        setError("No user is signed in.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setError("An error occurred while fetching user data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const phonedigit = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhoneNumber(value);
  };
  const handleClickFetch = () => {
    setLoadingFetch(true);
    setTimeout(() => {
      setLoadingFetch(false);
    }, 5000);
    fetchUserProfile();
  };
  // Handle input change
  const handleShopNameChange = (e) => setShopName(e.target.value);
  const handleShopAddressChange = (e) => setShopAddress(e.target.value);
  const handleShopDescriptionChange = (e) => setShopDescription(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    //handles alerts on missing inputs
    if (!shopName.trim()) {
      console.error("Shop name is required");
      setIsSubmitting(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return; 
    }
    if (!phoneNumber.trim()) {
      console.error("Phone Number is required");
      setIsSubmitting(false);
      setShowAlert2(true);
      setTimeout(() => {
        setShowAlert2(false);
      }, 3000);
      return;
    }
    if (phoneNumber.length !== 11) {
      console.error("Phone Number must be 11 digits");
      setIsSubmitting(false);
      setShowAlert4(true);
      setTimeout(() => {
        setShowAlert4(false);
      }, 3000);
      return; 
    }
    if (!shopDescription.trim()) {
      console.error("Shop Description is required");
      setIsSubmitting(false);
      setShowAlert5(true);
      setTimeout(() => {
        setShowAlert5(false);
      }, 3000);
      return; 
    }
    if (!shopAddress.trim()) {
      console.error("Shop Address is required");
      setIsSubmitting(false);
      setShowAlert3(true);
      setTimeout(() => {
        setShowAlert3(false);
      }, 3000);
      return; 
    }
    if (!selectedImage) {
      console.error("Shop Image is required");
      setIsSubmitting(false);
      setShowAlert6(true);
      setTimeout(() => {
        setShowAlert6(false);
      }, 3000);
      return; 
    }
    if (!selectedFile) {
      console.error("Shop File is required");
      setIsSubmitting(false);
      setShowAlert7(true);
      setTimeout(() => {
        setShowAlert7(false);
      }, 3000);
      return;
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

    //set null if there's no Image & File Inputted
    let uploadedImageUrl = null;
    let uploadedPdfUrl = null;

    //Set Image from shop to DB
    if (imageFile) {
      try {
        // Generate a unique name using timestamp + random ID
        const uniqueImageName = `shop_profile/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}-${imageFile.name}`;

        const { data, error: uploadError } = await supabase.storage
          .from("shop_profile")
          .upload(uniqueImageName, imageFile);

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
      }
    }

    //Set Business Permit from shop to DB
    if (pdfFile) {
      try {
        const uniquePdfName = `pdfs/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}-${pdfFile.name}`;

        const { data, error: uploadError } = await supabase.storage
          .from("shop_profile")
          .upload(uniquePdfName, pdfFile);

        if (uploadError) {
          console.error("Error uploading PDF:", uploadError.message);
          return;
        }

        if (data?.path) {
          const { data: publicUrlData, error: urlError } = supabase.storage
            .from("pdfs")
            .getPublicUrl(data.path);

          if (urlError) {
            console.error("Error fetching PDF URL:", urlError.message);
            return;
          }

          uploadedPdfUrl = publicUrlData.publicUrl;
          console.log("PDF uploaded successfully:", uploadedPdfUrl);
        }
      } catch (err) {
        console.error("Unexpected error while uploading PDF:", err);
      }
    }

    const userId = user.id;

    try {
      const { data: shopData, error: shopError } = await supabase
        .from("merchantRegistration")
        .insert([
          {
            shop_name: shopName,
            contact_number: phoneNumber,
            description: shopDescription,
            address: shopAddress,
            id: userId,
            is_Approved: null,
            shop_image: uploadedImageUrl || null,
            shop_BusinessPermit: uploadedPdfUrl || null,
          },
        ])
        .single();

      if (shopError) {
        console.error("Error inserting shop data:", shopError.message);
        setIsSubmitting(false);
        return;
      }

      console.log("Shop created successfully:", shopData);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ isMerchant: false })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user profile:", updateError.message);
        setIsSubmitting(false);
        return;
      }

      console.log(
        "User profile updated with merchant_id and ismerchant = true"
      );

      // Reset form fields after successful insertion
      setShopName("");
      setPhoneNumber("");
      setShopDescription("");
      setShopAddress("");
      setImageFile(null);
      setpdfFile(null);
      setShowAlertSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSetisMerchant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user || userError) {
      console.error("No user found");
      return;
    }

    const userId = user.id;

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ isMerchant: true })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user profile:", updateError.message);
        setIsSubmitting(false);
        return;
      }

      console.log(
        "User profile updated with merchant_id and ismerchant = true"
      );
      navigate("/shop/MerchantDashboard");
      window.location.reload(); 
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRedo = async (shopId) => {
    if (!shopId) {
      console.error("No shop ID provided");
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure user is authenticated
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        console.error("No user found");
        setIsSubmitting(false);
        return;
      }

      const userId = user.id;

      // Delete the shop row where shop_id matches
      const { error: deleteError } = await supabase
        .from("merchantRegistration")
        .delete()
        .eq("owner_Id", userId);

      if (deleteError) {
        console.error("Error deleting shop:", deleteError.message);
        setIsSubmitting(false);
        return;
      }

      console.log("Shop deleted and user profile updated.");
      fetchUserProfile();
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeConfirmArtistCreation = () => {
    setShowAlertSuccess(false);
    fetchUserProfile();
  };
  //Open Modal for Viewing Image
  const handleOpenImage = () => {
    if (selectedImage) {
      setshowImage(true);
    } else {
      alert("Please select an image");
    }
  };

  //Open Modal for Viewing Pdf File
  const handleOpenFile = () => {
    if (selectedFile) {
      setshowFile(true);
    } else {
      alert("Please select a file");
    }
  };

  //MODAL FOR IMAGES
  const handleCloseModal = () => {
    setshowImage(false);
    setshowFile(false);
  };

  //define image input
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setImageFile(file); // Store the file in state
      setSelectedImage(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };

  //define file input
  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setpdfFile(file);
      setFileName(file.name);
      setSelectedFile(file);
    } else {
      alert("Please select a valid file (PDF document)");
    }
  };
  return (
    <div className="h-full w-full relative">
      <div className="h-full w-full lg:flex bg-slate-300 p-1 justify-center  ">
        {/* FIRST CONTAINER */}

        {loading ? (
          <div className="-mt-10 place-items-center flex justify-center w-full h-full  p-2">
            <div className="bg-white w-auto p-5 h-auto  justify-items-center rounded-md shadow-md relative">
              <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                {" "}
              </div>

              <div className="p-5">
                <img
                  src={hmmEmote}
                  alt="hmmm Emote"
                  className="object-contain rounded-lg p-1  drop-shadow-customViolet"
                />
              </div>

              <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                Waiting...
              </h2>
            </div>
          </div>
        ) : hasCreatedAccount ? ( // Only show merchant status if the account is created
          isStat === "approved" ? (
            <div className="-mt-10 place-items-center flex justify-center w-full h-full  p-2">
              <div className="bg-white w-auto p-5 h-auto  justify-items-center rounded-md shadow-md relative">
                <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                  {" "}
                </div>

                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  ✅ You are already a merchant! 🎉{" "}
                </h2>
                <div className="p-5">
                  <img
                    src={successEmote}
                    alt="Success Emote"
                    className="object-contain rounded-lg p-1  drop-shadow-customViolet"
                  />
                </div>

                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  Start Selling now!
                </h2>
                <div
                  onClick={handleSetisMerchant}
                  className="p-4 bg-custom-purple cursor-pointer hover:scale-95 duration-200 text-white rounded flex items-center justify-center"
                >
                  {" "}
                  <span className="iceland-regular text-2xl ">
                    Enter Dripstr Merchant
                  </span>{" "}
                </div>
              </div>
            </div>
          ) : isStat === "pending" ? (
            <div className="-mt-10 place-items-center flex justify-center w-full h-full  p-2">
              <div className="bg-white w-auto p-5 h-auto  justify-items-center rounded-md shadow-md relative">
                <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                  {" "}
                </div>

                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  ⏳ Your merchant account is pending for approval.
                </h2>
                <div className="p-5">
                  <img
                    src={successEmote}
                    alt="Success Emote"
                    className="object-contain rounded-lg p-1  drop-shadow-customViolet"
                  />
                </div>

                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  Wait for the Admin Approval
                </h2>
                <button
                  onClick={handleClickFetch}
                  className="p-4 bg-custom-purple text-white rounded flex items-center justify-center"
                  disabled={loadingFetch}
                >
                  {loadingFetch ? (
                    <span className="loading loading-dots loading-lg"></span>
                  ) : (
                    <span className="iceland-regular text-2xl">
                      Reload for Update
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : isStat === "declined" ? (
            <div className="-mt-10 place-items-center flex justify-center w-full h-full  p-2">
              <div className="bg-white w-auto p-5 h-auto  justify-items-center rounded-md shadow-md relative">
                <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                  {" "}
                </div>

                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  ❌ Your merchant account request was declined.
                </h2>
                <div className="p-5">
                  <img
                    src={sadEmote}
                    alt="Success Emote"
                    className="object-contain rounded-lg p-1  drop-shadow-customViolet"
                  />
                </div>

                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  Create new registration? or Contact our support.
                </h2>
                <div
                  onClick={handleRedo}
                  className="bg-primary-color m-2 p-1 px-2 hover:scale-95 glass duration-300 rounded-sm text-white font-semibold cursor-pointer"
                >
                  {" "}
                  <span className="iceland-regular text-2xl ">
                    Redo registration
                  </span>{" "}
                </div>
              </div>
            </div>
          ) : null
        ) : (
          <div className="h-auto w-full lg:w-[55%] bg-white shadow-lg rounded-lg p-3 px-7 overflow-hidden">
            <div className="flex md:gap-2 md:justify-start justify-center">
              <box-icon
                name="store"
                type="solid"
                color="#4D077C"
                size="md"
              ></box-icon>
              <div className="font-bold text-2xl flex p-2 text-custom-purple iceland-regular">
                Create Merchant Account
              </div>
            </div>
            <div className="font-bold text-5xl text-center md:text-left p-1 text-custom-purple iceland-bold">
              Get Started
            </div>
            <form onSubmit={handleSubmit}>
              <div className="md:flex w-full place-items-center h-[50%] gap-2 lg:gap-5 p-2">
                <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
                  <div className="w-full max-w-xs">
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text text-slate-800 font-semibold">
                          What is your SHOP name?
                        </span>
                      </div>
                      <input
                        id="shopName"
                        value={shopName}
                        onChange={handleShopNameChange}
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered text-black bg-slate-100 border-violet-950 border-[2px] w-full"
                      />
                    </label>
                    <label className="form-control w-full max-w-xs mt-2">
                      <div className="label">
                        <span className="label-text text-slate-800 font-semibold">
                          What is your SHOP contact number?
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
                <div className="w-full md:w-1/2 h-full rounded-md justify-center mt-1 p-2">
                  <label className="label-text font-semibold ml-2 text-slate-800">
                    Upload shop photo
                  </label>
                  <div className="h-auto w-full flex mt-2 justify-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      placeholder={fileName || "Choose a file..."}
                      className="file-input bg-slate-100 border-violet-950 border-2 max-w-xs bottom-0 file-input-bordered w-full"
                    />
                    <div
                      onClick={handleOpenImage}
                      className="p-2 place-content-center cursor-pointer hover:scale-95 duration-200 bg-violet-900 rounded-md"
                    >
                      <box-icon
                        type="solid"
                        name="image-alt"
                        color="#FFFFFF"
                      ></box-icon>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="label-text font-semibold ml-2 text-slate-800">
                      Upload business permit
                    </label>
                    <div className="h-auto w-full flex mt-1 justify-center gap-2">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange2}
                        className="file-input bg-slate-100 border-violet-950 border-2 max-w-xs bottom-0 file-input-bordered w-full"
                      />
                      <div
                        onClick={handleOpenFile}
                        className="p-2 place-content-center cursor-pointer hover:scale-95 duration-200 bg-violet-900 rounded-md"
                      >
                        <box-icon
                          type="solid"
                          name="file"
                          color="#FFFFFF"
                        ></box-icon>
                      </div>
                    </div>
                    <div className="label">
                      <span className="label-text-alt text-slate-700">
                        PDF file format is only accepted.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <label className="form-control mx-5 -mt-3 flex justify-center items-center md:items-start">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-semibold text-slate-800">
                      Shop description?
                    </span>
                  </div>
                  <textarea
                    id="shopDescription"
                    value={shopDescription}
                    onChange={handleShopDescriptionChange}
                    className="w-full textarea h-16 textarea-bordered bg-slate-100 text-black border-violet-950 rounded-md border-[2px] p-1 resize-none"
                  ></textarea>
                </label>
                <div className="label">
                  <span className="label-text font-semibold text-slate-800">
                    What is your SHOP address?
                  </span>
                </div>
                <textarea
                  value={shopAddress}
                  onChange={handleShopAddressChange}
                  className="textarea resize-none textarea-bordered w-[90%] md:w-full bg-slate-100 text-black border-violet-950 border-[2px] h-16"
                  placeholder="Type your Shop Address here"
                ></textarea>
              </label>
              <button
                type="submit"
                className="btn mt-4 ml-2 glass bg-custom-purple mr-5 iceland-regular tracking-wide text-lg text-white flex items-center justify-center"
                disabled={isSubmitting} // Disable button while loading
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "SUBMIT"
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {showAlert && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            <span>Shop name is required!</span>
          </div>
        </div>
      )}
      {showAlert2 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            <span>Shop Contact Number is Required!</span>
          </div>
        </div>
      )}
      {showAlert3 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            <span>Shop Address is Required!</span>
          </div>
        </div>
      )}
      {showAlert4 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            <span>Phone number should be 11 digits!</span>
          </div>
        </div>
      )}
      {showAlert5 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            <span>Shop Description is Required!</span>
          </div>
        </div>
      )}
      {showAlert6 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            className="alert bg-custom-purple shadow-md flex items-center p-4  font-semibold rounded-md"
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
            <span>Shop Image is Required!</span>
          </div>
        </div>
      )}
      {showAlert7 && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            <span>Shop Business Permit is Required!</span>
          </div>
        </div>
      )}
      {showImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50 ">
          <div className="bg-white rounded-lg p-5 h-auto   lg:w-auto   md:m-0 auto">
            {/*Image goes here*/}
            <div className=" h-[350px] w-[350px] border-custom-purple border-2 bg-slate-600 rounded-md  place-items-center   ">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded shop photo"
                  className="w-full h-full object-cover rounded-sm"
                />
              ) : (
                <p className="text-white">Please select an image</p>
              )}{" "}
            </div>
            <div className="flex justify-between  w-full mt-2">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded  hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50 ">
          <div className="bg-white rounded-lg p-5 h-auto   lg:w-auto   md:m-0 auto">
            {/*Image goes here*/}
            <div className=" h-[450px] w-[400px]  bg-slate-600 rounded-md  place-items-center   ">
              {selectedFile ? (
                <iframe
                  src={URL.createObjectURL(selectedFile)}
                  title="Uploaded file"
                  className="w-full h-full"
                ></iframe>
              ) : (
                <p className="text-white">Please select a file</p>
              )}
            </div>
            <div className="flex justify-between  w-full mt-2">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded  hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlertSuccess && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-96 p-5   justify-items-center rounded-md shadow-md relative">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>

            <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
              Merchant Account Created Successfully
            </h2>
            <div className="p-5">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1  drop-shadow-customViolet"
              />
            </div>

            <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
              Wait for the Admin Approval
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

export default Login;
