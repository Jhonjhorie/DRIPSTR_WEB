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
  const [showAlert8, setShowAlert8] = React.useState(false); // AlertIDmissing
  const [showAlertEX, setShowAlertEX] = React.useState(false); // AlertImage
  const [showAlertEY, setShowAlertEY] = React.useState(false); // AlertIDmissing
  const [showImage, setshowImage] = React.useState(false); //Show image modal
  const [showFile, setshowFile] = React.useState(false); //Show File modal
  const [selectedImage, setSelectedImage] = useState(null); // show to the modal div
  const [selectedImageID, setSelectedImageID] = useState(null); // show to the modal div
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(null);
  const [showAlertSuccess, setShowAlertSuccess] = React.useState(false); // Alert Success
  const [TermsandCondition, setTermsandCondition] = React.useState(true); // Alert Terms and Conditions
  const [imageFile, setImageFile] = useState(null); // State to hold the image file
  const [imageFileID, setImageFileID] = useState(null); // State to hold the image fileid
  const [pdfFile, setPdfFile] = useState(null);
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

    const maxImageSize = 2 * 1024 * 1024;
    const maxPdfSize = 5 * 1024 * 1024;

    if (!shopName.trim()) {
      console.error("Shop name is required");
      setIsSubmitting(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!phoneNumber.trim()) {
      console.error("Phone Number is required");
      setIsSubmitting(false);
      setShowAlert2(true);
      setTimeout(() => setShowAlert2(false), 3000);
      return;
    }

    if (phoneNumber.length !== 11) {
      console.error("Phone Number must be 11 digits");
      setIsSubmitting(false);
      setShowAlert4(true);
      setTimeout(() => setShowAlert4(false), 3000);
      return;
    }

    if (!shopDescription.trim()) {
      console.error("Shop Description is required");
      setIsSubmitting(false);
      setShowAlert5(true);
      setTimeout(() => setShowAlert5(false), 3000);
      return;
    }

    if (!shopAddress.trim()) {
      console.error("Shop Address is required");
      setIsSubmitting(false);
      setShowAlert3(true);
      setTimeout(() => setShowAlert3(false), 3000);
      return;
    }

    if (!selectedImage) {
      console.error("Shop Image is required");
      setIsSubmitting(false);
      setShowAlert6(true);
      setTimeout(() => setShowAlert6(false), 3000);
      return;
    }
    if (!selectedImageID) {
      console.error("ID is required");
      setIsSubmitting(false);
      setShowAlert8(true);
      setTimeout(() => setShowAlert8(false), 3000);
      return;
    }

    if (!selectedFile) {
      console.error("Shop File is required");
      setIsSubmitting(false);
      setShowAlert7(true);
      setTimeout(() => setShowAlert7(false), 3000);
      return;
    }

    if (imageFile.size > maxImageSize) {
      console.error("Image size exceeds the 2MB limit.");
      setIsSubmitting(false);
      setShowAlertEY(true);
      setTimeout(() => setShowAlertEY(false), 3000);
      return;
    }

    if (pdfFile.size > maxPdfSize) {
      console.error("PDF file size exceeds the 5MB limit.");
      setIsSubmitting(false);
      setShowAlertEX(true);
      setTimeout(() => setShowAlertEX(false), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = async () => {
        // Upload image to Supabase if everything is valid
        const uniqueImageName = `shop_profile/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}-${imageFile.name}`;
        const uniqueImageNameID = `valid_ID/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}-${imageFileID.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("shop_profile")
          .upload(uniqueImageName, imageFile);

        if (uploadError) {
          console.error("Error uploading image:", uploadError.message);
          return;
        }
        const { dataID, error: uploadErrorID } = await supabase.storage
          .from("shop_profile")
          .upload(uniqueImageNameID, imageFileID);

        if (uploadErrorID) {
          console.error("Error uploading image:", uploadErrorID.message);
          return;
        }


        let uploadedImageUrl = null;
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
        let uploadedImageUrlId = null;
          if (dataID?.path) {
            const { data: publicUrlData, error: urlError } = supabase.storage
            .from("shop_profile")
            .getPublicUrl(dataID.path);
          if (urlError) {
            console.error("Error fetching image URL:", urlError.message);
            return;
          }
          uploadedImageUrlId = publicUrlData.publicUrl;
          console.log("Image uploaded successfully:", uploadedImageUrlId);
        }
        // Upload PDF file
        let uploadedPdfUrl = null;
        if (pdfFile) {
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
        }

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
                id_Image: uploadedImageUrlId || null,
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
          setImageFileID(null);
          setPdfFile(null);
          setShowAlertSuccess(true);
          setIsSubmitting(false);
        } catch (err) {
          console.error("Unexpected error:", err);
          setIsSubmitting(false);
        }
      };

      image.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
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
        .eq("id", userId);

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
  const handleCloseTandC = () => {
    setTermsandCondition(false);
  };
  const ShowTandC = () => {
    setTermsandCondition(true);
  };
  //define image input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  //define Image
  const handleFileChangeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFileID(file);
      setSelectedImageID(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  //define file input
  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
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
                    src={hmmEmote}
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
          <div className="h-auto w-full lg:w-[55%] mb-16 md:mb-0 mt-5 md:mt-0 bg-white shadow-lg rounded-lg p-3 px-7 overflow-hidden">
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
                  <div className="flex gap-2 ">
                    <div>
                      <label className="label-text font-semibold ml-2 text-slate-800">
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
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 w-64 p-2 bg-gray-900 text-white text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <p className="font-semibold">
                            Valid IDs for Merchants:
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

                  <div className="h-auto w-full flex mt-2 justify-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChangeImage}
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
                  <label className="label-text font-semibold ml-2 text-slate-800">
                    Upload shop LOGO
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
                  <div className="">
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
        <div
          onClick={ShowTandC}
          data-tip="Read Merchant Terms and Condition"
          className=" tooltip-left tooltip bg-slate-50 hover:scale-95 duration-200 cursor-pointer rounded-full shadow-md  fixed right-7 bottom-14 md:bottom-7"
        >
          <img
            src={questionEmote}
            alt="Success Emote"
            className="object-contain h-16 w-16 rounded-lg p-1 drop-shadow-customViolet"
          />
        </div>
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
      {showAlert8 && (
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
            <span>Merchant ID is Required!</span>
          </div>
        </div>
      )}
      {showAlertEX && (
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
            <span>PDF file size exceeds the 5MB limit.</span>
          </div>
        </div>
      )}
      {showAlertEY && (
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
            <span>Image size exceeds the 2MB limit.</span>
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
      {TermsandCondition && (
        <div className="fixed inset-0 md:p-0 p-2 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full overflow-hidden h-[400px] md:h-auto  md:w-auto p-5   justify-items-center rounded-md shadow-md relative">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>

            <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
              Read Terms And Condition
            </h2>

            <div className="bg-gradient-to-r top-0 overflow-hidden h-full left-0 from-violet-500 to-fuchsia-500 rounded-md text-slate-800 shadow-inner shadow-slate-600 md:h-[400px] md:w-[800px] overflow-y-scroll p-2 space-y-4">
              <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                <h1 className="text-xl md:text-3xl font-bold text-center text-gray-900 mb-6 border-b pb-3">
                  MERCHANT’S TERMS AND CONDITIONS OF USE
                </h1>

                <div className="space-y-6 text-gray-700">
                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      1. DEFINITIONS
                    </h2>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        <strong>Merchant:</strong> Any individual, business, or
                        entity that uploads and sells products via the DRIPSTR
                        platform.
                      </li>
                      <li>
                        <strong>Platform:</strong> DRIPSTR, the integrated
                        e-commerce and design software system for 3D apparel
                        creation and virtual shopping experiences.
                      </li>
                      <li>
                        <strong>Products:</strong> Any 3D apparel designs,
                        clothing items, or related digital content uploaded by
                        Merchants onto the DRIPSTR platform.
                      </li>
                      <li>
                        <strong>Agreement:</strong> These Terms and Conditions,
                        which govern the Merchant’s use of the DRIPSTR platform.
                      </li>
                      <li>
                        <strong>Customer:</strong> Any individual or business
                        purchasing Products through the DRIPSTR platform.
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
                      DRIPSTR to the Merchant, including the uploading of
                      products, storefront management, and customer
                      interactions.
                    </p>
                    <p>
                      By using the DRIPSTR platform, Merchants agree to comply
                      with all terms laid out herein, as well as any additional
                      guidelines issued by DRIPSTR from time to time.
                    </p>
                    <p>
                      DRIPSTR reserves the right to modify these Terms at any
                      time. Changes will take effect immediately upon posting to
                      the platform. Merchants are responsible for reviewing the
                      Terms regularly.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      3. MERCHANT REGISTRATION AND BUSINESS VERIFICATION
                    </h2>
                    <p>
                      Upon registration, Merchants must provide valid and
                      accurate business documentation, including but not limited
                      to:
                    </p>
                    <ul className="list-disc list-inside pl-4">
                      <li>A valid Business Permit</li>
                      <li>
                        A Government-Issued ID of the business owner or
                        authorized representative
                      </li>
                      <li>
                        Business Information (e.g., legal name, business
                        address)
                      </li>
                      <li>
                        Owner or Representative Information (e.g., full name,
                        contact details)
                      </li>
                    </ul>
                    <p>
                      These documents will be used for the verification of the
                      business to ensure compliance with legal and operational
                      standards. Failure to provide the required documentation
                      will result in the denial of access to merchant
                      functionalities on the DRIPSTR platform.
                    </p>
                    <p>
                      DRIPSTR reserves the right to suspend or terminate
                      accounts that fail to comply with the verification process
                      or provide fraudulent or inaccurate information.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      4. MERCHANT RESPONSIBILITIES
                    </h2>
                    <p>
                      Merchants are responsible for uploading accurate and
                      original 3D apparel designs to the platform. They must
                      ensure that they have the legal rights to sell any
                      Products uploaded.
                    </p>
                    <p>
                      Merchants are expected to actively manage their
                      storefronts, upload Products regularly, and engage with
                      Customers through the platform's communication tools.
                    </p>
                    <p>
                      Merchants must not upload content that is fraudulent,
                      misleading, or in violation of any applicable laws.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      5. PAYMENT AND REVENUE SHARING
                    </h2>
                    <p>
                      The platform will charge a commission on each sale, as
                      stated in the Merchant's Agreement, which may be updated
                      from time to time by DRIPSTR.
                    </p>
                    <p>
                      Payments to Merchants will be processed through DRIPSTR’s
                      integrated payment system and distributed within 30 days
                      following the successful completion of each sale.
                    </p>
                    <p>
                      <strong>Subscription Plans:</strong>
                    </p>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        Merchants can subscribe to a Monthly or Annual plan with
                        premium features like enhanced marketplace exposure,
                        analytics, and customer engagement tools.
                      </li>
                      <li>
                        Pricing and benefits are outlined on the platform and
                        may be subject to change with prior notice.
                      </li>
                      <li>
                        Subscription payments are auto-debited, and
                        cancellations do not offer refunds for partially used
                        months or years.
                      </li>
                    </ul>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      6. DELIVERY AND PRODUCT DISPLAY
                    </h2>
                    <p>
                      DRIPSTR offers tools for Merchants to showcase Products
                      via 3D visualizations. Merchants are responsible for
                      ensuring the accuracy of these digital representations.
                    </p>
                    <p>
                      Merchants acknowledge that delivery of virtual goods is
                      instant and final upon successful purchase. For physical
                      goods, Merchants are responsible for managing delivery
                      logistics and ensuring timely shipping to Customers.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      7. LIABILITY AND WARRANTIES
                    </h2>
                    <p>
                      DRIPSTR makes no warranties regarding the performance or
                      accuracy of the platform, including the 3D apparel
                      creation tools and any marketplace services.
                    </p>
                    <p>
                      DRIPSTR will not be liable for any indirect, incidental,
                      or consequential damages resulting from the use of the
                      platform, including but not limited to, loss of profits,
                      data, or business interruptions.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      8. TERMINATION OF SERVICE
                    </h2>
                    <p>
                      DRIPSTR reserves the right to suspend or terminate a
                      Merchant’s access to the platform if they are found to be
                      in violation of these Terms or if their use of the
                      platform causes harm or reputational damage to DRIPSTR.
                    </p>
                    <p>
                      Merchants may terminate their use of the platform at any
                      time, but they will remain responsible for any obligations
                      that arise before the termination date.
                    </p>
                  </section>

                  <section className="border-l-4 border-blue-500 pl-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      9. INTELLECTUAL PROPERTY
                    </h2>
                    <p>
                      All intellectual property rights related to the DRIPSTR
                      platform, including the software, interface, and design
                      tools, remain the exclusive property of DRIPSTR.
                    </p>
                  </section>
                </div>

                <div className="mt-6 justify-center gap-2 flex">
                  <button
                    onClick={() => navigate("/account/shop-setup")}
                    className="bg-gray-600 text-sm glass shadow-md shadow-slate-700 m-2 p-2 px-3 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
                  >
                    Decline Terms
                  </button>
                  <button
                    onClick={handleCloseTandC}
                    className="bg-primary-color text-sm glass shadow-md shadow-slate-700 m-2 p-2 px-3 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
                  >
                    Accept Terms
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

export default Login;
