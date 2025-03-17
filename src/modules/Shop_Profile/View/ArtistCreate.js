import React, { useEffect, useState } from "react";
import logo from "../../../assets/shop/logoWhite.png";
import "../../../assets/shop/fonts/font.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import questionEmote from "../../../../src/assets/emote/question.png";
import successEmote from "../../../../src/assets/emote/success.png";
import sadEmote from "../../../../src/assets/emote/error.png";
import hmmEmote from "../../../../src/assets/emote/hmmm.png";
import { useAddressFields } from "../../../../src/shared/login/hooks/useAddressFields";
import "boxicons";

function ArtistCreate() {
  const navigate = useNavigate();
  const [artistName, setArtistName] = useState("");
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
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
  const [loadings, setLoadings] = useState(false);
  const [AcceptedTermsArtist, setAcceptedTermsArtist] = useState(false);
  const [TermsandConditionArtist, setTermsandConditionArtist] =
    React.useState(false); // Alert TANDC
  const handleArtistNameChange = (e) => setArtistName(e.target.value);
  const handleArtistDescriptionChange = (e) =>
    setArtistDescription(e.target.value);

  //checking the reg of the artist
  const [hasCreatedAccount, setHasCreatedAccount] = useState(false);
  const [error, setError] = useState(null);
  const [isStat, setStatus] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        const { data: artData, error: artError } = await supabase
          .from("artist_registration")
          .select("is_approved, decline_reason")
          .eq("acc_id", user.id);

        if (artError) {
          console.error("Error fetching shop data:", artError.message);
        } else if (artData && artData.length > 0) {
          const artsShop = artData[0];
          setHasCreatedAccount(true);

          if (artsShop.is_approved === true) {
            setStatus("approved");
          } else if (artsShop.is_approved === false) {
            setStatus("declined");
            setDeclineReason(artsShop.decline_reason);
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

  const [showAlert11, setShowAlert11] = useState(false);
  const [showAlert22, setShowAlert22] = useState(false);
  const [showAlert33, setShowAlert33] = useState(false);
  const [showAlert44, setShowAlert44] = useState(false);
  const [showAlert55, setShowAlert55] = useState(false);
  const [showAlert66, setShowAlert66] = useState(false);
  const maxSize = 2 * 1024 * 1024;

  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleMiddleNameChange = (e) => setMiddleName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);

  const [declineReason, setDeclineReason] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullName = `${firstName} ${middleName} ${lastName}`.trim();
    const findRegion =
      regions?.find((r) => r.code === selected.region)?.name ||
      "Unknown Region";
    const findCity =
      cities?.find((c) => c.code === selected.city)?.name || "Unknown City";
    const findBarangay =
      barangays?.find((b) => b.code === selected.barangay)?.name ||
      "Unknown Barangay";

    const fullAddress = `${selected.exactLocation}, ${findBarangay}, ${findCity}, ${findRegion}`;
    console.log("Final Full Address:", fullAddress);

    // Handle input validation
    if (!firstName.trim() || !lastName.trim()) {
      console.error("Full name is required");
      setShowAlertFL(true);
      setTimeout(() => setShowAlertFL(false), 3000);
      setLoading(false);
      return;
    }
    if (!artistName.trim()) {
      console.error("Shop name is required");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setLoading(false);
      return;
    }
    if (!selectedCategory.trim()) {
      console.error("Category is required");
      setShowAlert7(true);
      setTimeout(() => setShowAlert7(false), 3000);
      setLoading(false);
      return;
    }
    if (!phoneNumber.trim()) {
      console.error("Phone Number is required");
      setShowAlert2(true);
      setTimeout(() => setShowAlert2(false), 3000);
      setLoading(false);
      return;
    }
    if (phoneNumber.length !== 11) {
      console.error("Phone Number must be 11 digits");
      setShowAlert4(true);
      setTimeout(() => setShowAlert4(false), 3000);
      setLoading(false);
      return;
    }
    if (!artistDescription.trim()) {
      console.error("Shop Description is required");
      setShowAlert5(true);
      setTimeout(() => setShowAlert5(false), 3000);
      setLoading(false);
      return;
    }
    if (!selectedImage) {
      console.error("Shop Image is required");
      setShowAlert6(true);
      setTimeout(() => setShowAlert6(false), 3000);
      setLoading(false);
      return;
    }
    if (!selectedImageUP1) {
      console.error("art2 is required");
      setShowAlert6(true);
      setTimeout(() => setShowAlert6(false), 3000);
      setLoading(false);
      return;
    }
    if (!selectedImageUP2) {
      console.error("art1 is required");
      setShowAlert6(true);
      setTimeout(() => setShowAlert6(false), 3000);
      setLoading(false);
      return;
    }
    if (!setImageFileSELFIE) {
      console.error("Seldie is required");
      setShowAlert6(true);
      setTimeout(() => setShowAlert6(false), 3000);
      setLoading(false);
      return;
    }
    if (!setImageFileGCASH) {
      console.error("Gcash is required");
      setShowAlert6(true);
      setTimeout(() => setShowAlert6(false), 3000);
      setLoading(false);
      return;
    }

    // Get user ID
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user || userError) {
      console.error("No user found");
      setLoading(false);
      return;
    }

    // Upload images
    const uploadImage = async (file, path) => {
      if (!file) return null;
      try {
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
        const uniqueFileName = `${path}/${timestamp}_${file.name}`;

        const { data, error: uploadError } = await supabase.storage
          .from("shop_profile")
          .upload(uniqueFileName, file);

        if (uploadError) {
          console.error(`Error uploading ${path}:`, uploadError.message);
          return null;
        }

        const { data: publicUrlData, error: urlError } = supabase.storage
          .from("shop_profile")
          .getPublicUrl(data.path);

        if (urlError) {
          console.error(`Error fetching ${path} URL:`, urlError.message);
          return null;
        }

        return publicUrlData.publicUrl;
      } catch (err) {
        console.error(`Unexpected error while uploading ${path}:`, err);
        return null;
      }
    };

    const uploadedImageUrl = await uploadImage(imageFile, "artist_profile");
    const uploadedImageUrlId = await uploadImage(imageFileID, "valid_ID");
    const uploadedImageUrlGCASH = await uploadImage(imageFileGCASH, "valid_ID");
    const uploadedImageUrlSELFIE = await uploadImage(
      imageFileSELFIE,
      "valid_ID"
    );
    const uploadedImageUP1 = await uploadImage(imageFileUP1, "sampleart");
    const uploadedImageUP2 = await uploadImage(imageFileUP2, "sampleart2");

    try {
      // Insert into "artist" table
      const { data: shopData, error: shopError } = await supabase
        .from("artist_registration")
        .insert([
          {
            acc_id: user.id,
            full_name: fullName,
            address: fullAddress,
            artist_name: artistName,
            description: artistDescription,
            art_type: selectedCategory,
            valid_id: uploadedImageUrlId || null,
            selfie: uploadedImageUrlSELFIE || null,
            is_approved: null,
            mobile_number: phoneNumber,
            artist_profilePic: uploadedImageUrl || null,
            gcash: uploadedImageUrlGCASH || null,
            sample_art: uploadedImageUP1,
            sample_art2: uploadedImageUP2,
          },
        ])
        .single();

      if (shopError) {
        console.error("Error inserting artist data:", shopError.message);
        setLoading(false);
        return;
      }

      console.log("Artist page created successfully:", shopData);

      // Insert into "artist_Wallet" table
      const { data: walletData, error: walletError } = await supabase
        .from("artist_Wallet")
        .insert([
          {
            number: phoneNumber,
            owner_Name: fullName,
            revenue: "0",
            valid_ID: uploadedImageUrlId || null,
            owner_ID: user.id,
          },
        ]);

      if (walletError) {
        console.error(
          "Error inserting into artist_Wallet:",
          walletError.message
        );
        setLoading(false);
        return;
      }

      console.log("Artist Wallet created successfully:", walletData);

      // Update profile to set isArtist to true
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ isArtist: false })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating user profile:", updateError.message);
        setLoading(false);
        return;
      }

      console.log("User profile updated successfully.");

      // Show success message
      setShowAlertSuccess(true);
      setTimeout(() => setShowAlertSuccess(false), 3000);

      // Reset form fields after successful submission
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setFullName("");
      setArtistName("");
      setPhoneNumber("");
      setArtistDescription("");
      setSelectedCategory("");
      setSelected({
        region: "",
        city: "",
        barangay: "",
        exactLocation: "",
      });
      setImageFile(null);
      setImageFileID(null);
      setImageFileGCASH(null);
      setImageFileSELFIE(null);
      setImageFileUP1(null);
      setImageFileUP2(null);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };
  const {
    addressData: { regions, cities, barangays },
    selected,
    handleRegionChange,
    handleCityChange,
    handleExactLocationChange,
    setSelected,
  } = useAddressFields(true, false);

  const closeConfirmArtistCreation = () => {
    fetchUserProfile();
    setShowAlertSuccess(false);
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

  //chech if accepted
  const handleClickFetch = () => {
    setLoadingFetch(true);
    setTimeout(() => {
      setLoadingFetch(false);
    }, 5000);
    fetchUserProfile();
  };

  const handleSetisArtist = async (e) => {
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

  //when decline delete the data both merchantreg and wallet
  const handleRedo = async (artID) => {
    if (!artID) {
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
        .from("artist_registration")
        .delete()
        .eq("acc_id", userId);

      if (deleteError) {
        console.error("Error deleting artist:", deleteError.message);
        setIsSubmitting(false);
        return;
      }

      const { error: deleteError2 } = await supabase
        .from("artist_Wallet")
        .delete()
        .eq("owner_ID", userId);

      if (deleteError2) {
        console.error("Error deleting artist:", deleteError2.message);
        setIsSubmitting(false);
        return;
      }

      console.log("artist deleted and user profile updated.");
      fetchUserProfile();
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  //MODAL FOR IMAGES
  const handleCloseModal = () => {
    setshowImage(false);
    setshowImageG(false);
    setshowImageSS(false);
    setshowImageID(false);
    setshowImageS1(false);
    setshowImageS2(false);
  };
  const [imageFileSELFIE, setImageFileSELFIE] = useState(null);
  const [selectedImageSELFIE, setSelectedImageSELFIE] = useState(null);
  const [imageFileGCASH, setImageFileGCASH] = useState(null);
  const [selectedImageGCASH, setSelectedImageGCASH] = useState(null);
  const [selectedImageUP1, setSelectedImageUP1] = useState(null);
  const [selectedImageUP2, setSelectedImageUP2] = useState(null);
  const [imageFileUP1, setImageFileUP1] = useState(null);
  const [imageFileUP2, setImageFileUP2] = useState(null);
  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    setIsLandscape(naturalWidth > naturalHeight);
  };

  const [showImage, setshowImage] = React.useState(false); //Show image modal
  const [showImageG, setshowImageG] = React.useState(false); //Show image modal
  const [showImageSS, setshowImageSS] = React.useState(false); //Show image modal
  const [showImageID, setshowImageID] = React.useState(false); //Show image modal
  const [showImageS1, setshowImageS1] = React.useState(false); //Show image modal
  const [showImageS2, setshowImageS2] = React.useState(false); //Show image modal
  const [isLandscape, setIsLandscape] = useState(null);

  //modals images
  const handleOpenImage = () => {
    if (selectedImage) {
      setshowImage(true);
    } else {
      console.log("Please select a file");
    }
  };
  const handleOpenImageG = () => {
    if (selectedImageGCASH) {
      setshowImageG(true);
    } else {
      console.log("Please select a file");
    }
  };
  const handleOpenImageSS = () => {
    if (selectedImageSELFIE) {
      setshowImageSS(true);
    } else {
      console.log("Please select a file");
    }
  };
  const handleOpenImageID = () => {
    if (selectedImageID) {
      setshowImageID(true);
    } else {
      console.log("Please select a file");
    }
  };
  const handleOpenImageS1 = () => {
    if (selectedImageUP1) {
      setshowImageS1(true);
    } else {
      console.log("Please select a file");
    }
  };
  const handleOpenImageS2 = () => {
    if (selectedImageUP2) {
      setshowImageS2(true);
    } else {
      console.log("Please select a file");
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > maxSize) {
        console.error("File size exceeds 2MB limit.");
        setShowAlert11(true);
        setTimeout(() => setShowAlert11(false), 3000);
        event.target.value = "";
        return;
      }

      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  const handleFileChangeID = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxSize) {
        setShowAlert44(true);
        setTimeout(() => setShowAlert44(false), 3000);
        console.log("Selected file:", file);
        event.target.value = "";
        return;
      }
      // Only set the file if it meets the size limit
      setImageFileID(file);
      setSelectedImageID(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  const handleFileChangeGCASH = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxSize) {
        setShowAlert22(true);
        setTimeout(() => setShowAlert22(false), 3000);
        console.log("Selected file:", file);
        event.target.value = "";
        return;
      }
      // Only set the file if it meets the size limit
      setImageFileGCASH(file);
      setSelectedImageGCASH(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  const handleFileChangeSELFIE = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxSize) {
        setShowAlert33(true);
        setTimeout(() => setShowAlert33(false), 3000);
        console.log("Selected file:", file);
        event.target.value = "";
        return;
      }
      // Only set the file if it meets the size limit
      setImageFileSELFIE(file);
      setSelectedImageSELFIE(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  const handleFileChangeUP1 = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxSize) {
        setShowAlert55(true);
        setTimeout(() => setShowAlert55(false), 3000);
        console.log("Selected file:", file);
        event.target.value = "";
        return;
      }
      // Only set the file if it meets the size limit
      setImageFileUP1(file);
      setSelectedImageUP1(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };
  const handleFileChangeUP2 = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxSize) {
        setShowAlert66(true);
        setTimeout(() => setShowAlert66(false), 3000);
        console.log("Selected file:", file);
        event.target.value = "";
        return;
      }
      // Only set the file if it meets the size limit
      setImageFileUP2(file);
      setSelectedImageUP2(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };

  return (
    <div className="h-full w-full">
      {/* Modal for showing selected images */}
      {showImage && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-5 h-auto lg:w-auto md:m-0 auto">
            <div className="flex items-center justify-center border-custom-purple border-2 bg-slate-100 rounded-md p-2">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded shop photo"
                  onLoad={handleImageLoad}
                  className={`rounded-sm object-cover ${
                    isLandscape === null
                      ? "w-[250px] h-[250px]"
                      : isLandscape
                      ? "w-[500px] h-[400px]"
                      : "w-[300px] h-[300px]"
                  }`}
                />
              ) : (
                <p className="text-black">Please select an image</p>
              )}
            </div>
            <div className="flex justify-between w-full mt-2">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageG && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-5 h-auto lg:w-auto md:m-0 auto">
            <div className="flex items-center justify-center border-custom-purple border-2 bg-slate-100 rounded-md p-2">
              {selectedImageGCASH ? (
                <img
                  src={selectedImageGCASH}
                  alt="Uploaded shop photo"
                  onLoad={handleImageLoad}
                  className={`rounded-sm object-cover ${
                    isLandscape === null
                      ? "w-[250px] h-[250px]"
                      : isLandscape
                      ? "w-[500px] h-[400px]"
                      : "w-[300px] h-[300px]"
                  }`}
                />
              ) : (
                <p className="text-black">Please select an image</p>
              )}
            </div>
            <div className="flex justify-between w-full mt-2">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageSS && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-5 h-auto lg:w-auto md:m-0 auto">
            <div className="flex items-center justify-center border-custom-purple border-2 bg-slate-100 rounded-md p-2">
              {selectedImageSELFIE ? (
                <img
                  src={selectedImageSELFIE}
                  alt="Uploaded shop photo"
                  onLoad={handleImageLoad}
                  className={`rounded-sm object-cover ${
                    isLandscape === null
                      ? "w-[250px] h-[250px]"
                      : isLandscape
                      ? "w-[500px] h-[400px]"
                      : "w-[300px] h-[300px]"
                  }`}
                />
              ) : (
                <p className="text-black">Please select an image</p>
              )}
            </div>
            <div className="flex justify-between w-full mt-2">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageID && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-5 h-auto lg:w-auto md:m-0 auto">
            <div className="flex items-center justify-center border-custom-purple border-2 bg-slate-100 rounded-md p-2">
              {selectedImageID ? (
                <img
                  src={selectedImageID}
                  alt="Uploaded shop photo"
                  onLoad={handleImageLoad}
                  className={`rounded-sm object-cover ${
                    isLandscape === null
                      ? "w-[250px] h-[250px]"
                      : isLandscape
                      ? "w-[500px] h-[400px]"
                      : "w-[300px] h-[300px]"
                  }`}
                />
              ) : (
                <p className="text-black">Please select an image</p>
              )}
            </div>
            <div className="flex justify-between w-full mt-2">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageS1 && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-5 h-auto lg:w-auto md:m-0 auto">
            <div className="flex items-center justify-center border-custom-purple border-2 bg-slate-100 rounded-md p-2">
              {selectedImageUP1 ? (
                <img
                  src={selectedImageUP1}
                  alt="Uploaded shop photo"
                  onLoad={handleImageLoad}
                  className={`rounded-sm object-cover ${
                    isLandscape === null
                      ? "w-[250px] h-[250px]"
                      : isLandscape
                      ? "w-[500px] h-[400px]"
                      : "w-[300px] h-[300px]"
                  }`}
                />
              ) : (
                <p className="text-black">Please select an image</p>
              )}
            </div>
            <div className="flex justify-between w-full mt-2">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageS2 && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-5 h-auto lg:w-auto md:m-0 auto">
            <div className="flex items-center justify-center border-custom-purple border-2 bg-slate-100 rounded-md p-2">
              {selectedImageUP2 ? (
                <img
                  src={selectedImageUP2}
                  alt="Uploaded shop photo"
                  onLoad={handleImageLoad}
                  className={`rounded-sm object-cover ${
                    isLandscape === null
                      ? "w-[250px] h-[250px]"
                      : isLandscape
                      ? "w-[500px] h-[400px]"
                      : "w-[300px] h-[300px]"
                  }`}
                />
              ) : (
                <p className="text-black">Please select an image</p>
              )}
            </div>
            <div className="flex justify-between w-full mt-2">
              <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-full w-full lg:flex justify-center items-center bg-slate-300 p-1  ">
        {/* FIRST CONTAINER */}
        {loadings ? (
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
        ) : hasCreatedAccount ? (
          isStat === "approved" ? (
            <div className="-mt-10 place-items-center flex justify-center w-full h-full  p-2">
              <div className="bg-white w-auto p-5 h-auto  justify-items-center rounded-md shadow-md relative">
                <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                  {" "}
                </div>

                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  ✅ You are an Artist now! 🎉{" "}
                </h2>
                <div className="p-5">
                  <img
                    src={successEmote}
                    alt="Success Emote"
                    className="object-contain rounded-lg p-1  drop-shadow-customViolet"
                  />
                </div>

                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  Start the journey now!
                </h2>
                <div
                  onClick={handleSetisArtist}
                  className="p-4 bg-custom-purple cursor-pointer hover:scale-95 duration-200 text-white rounded flex items-center justify-center"
                >
                  {" "}
                  <span className="iceland-regular text-2xl ">
                    Enter Dripstr Artist
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
                  ⏳ Your artist account is pending for approval.
                </h2>
                <div className="p-5">
                  <img
                    src={hmmEmote}
                    alt="Success Emote"
                    className="object-contain rounded-lg p-1  drop-shadow-customViolet"
                  />
                </div>

                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  Please wait for admin approval. The verification process may
                  take 1-7 days.
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
                  ❌ Your artist account request was declined.
                </h2>
                <div className="p-5">
                  <img
                    src={sadEmote}
                    alt="Success Emote"
                    className="object-contain rounded-lg p-1  drop-shadow-customViolet"
                  />
                </div>

                <p className="text-slate-800 text-center font-medium">
                  Reason:
                </p>
                <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900 ">
                  {declineReason}
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
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl bg-white mb-16 md:mb-0 mt-5 md:mt-0 shadow-lg rounded-lg p-6"
          >
            <div className=" h-auto  w-full md:px-5 -mt-2 overflow-hidden ">
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
              <div className="label-text text-xl  font-semibold px-2 text-slate-900">
                Artist Information
              </div>

              <div className=" w-full mt-1 place-items-center h-[50%] gap-2 lg:gap-8  p-2 ">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full ">
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text text-slate-900 font-semibold">
                          Type your Fullname
                        </span>
                      </div>
                    </label>
                    <div className="w-full -mt-2 gap-3 md:flex">
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text-alt px-1 font-medium text-slate-700">
                            First Name
                          </span>
                        </div>
                        <input
                          id="firstName"
                          value={firstName}
                          onChange={handleFirstNameChange}
                          type="text"
                          placeholder="Type here"
                          className="input  input-bordered text-black rounded text-sm bg-slate-200 border-violet-950 border w-full"
                        />
                      </label>
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text-alt px-1 font-medium text-slate-700">
                            Middle Name
                          </span>
                        </div>
                        <input
                          id="middleName"
                          value={middleName}
                          onChange={handleMiddleNameChange}
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered text-black rounded text-sm bg-slate-200 border-violet-950 border w-full"
                        />
                      </label>
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text-alt px-1 font-medium text-slate-700">
                            Last Name
                          </span>
                        </div>
                        <input
                          id="lastName"
                          value={lastName}
                          onChange={handleLastNameChange}
                          type="text"
                          placeholder="Type here"
                          className="input  input-bordered text-black text-sm rounded bg-slate-200 border-violet-950 border w-full"
                        />
                      </label>
                    </div>
                    <div className="md:flex mt-4 gap-1 w-full">
                      <div className="w-full md:w-1/2 ">
                        <label className="form-control  w-full">
                          <div className="label">
                            <span className="label-text text-slate-900 font-semibold">
                              What is your Artist Name?
                            </span>
                          </div>
                          <input
                            type="text"
                            id="artistName"
                            value={artistName}
                            onChange={handleArtistNameChange}
                            placeholder="Type here"
                            className="input input-bordered text-sm text-black rounded bg-slate-200 border-violet-950 border w-full"
                          />
                        </label>
                        <div className="w-full mt-4">
                          <div className="label  w-full">
                            <span className="label-text text-slate-900  font-semibold">
                              Select your Artist Photo
                            </span>
                          </div>
                          <div className="h-auto w-full gap-1 flex justify-center ">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              placeholder={fileName || "Choose a file..."}
                              className="file-input text-sm rounded bg-slate-200 border-violet-950 border   bottom-0 file-input-bordered w-full"
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
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 h-full -mt-2 rounded-md place-items-center justify-center p-2">
                        <label className="form-control w-full">
                          <div className="label">
                            <span className="label-text font-semibold text-slate-900">
                              What is your Art Style?
                            </span>
                          </div>

                          {/* Dropdown */}
                          <div className="dropdown dropdown-bottom w-full">
                            <div
                              tabIndex={0}
                              role="button"
                              className="bg-custom-purple border-violet-950 glass h-[49px]  hover:scale-95 duration-300 rounded text-center text-slate-100 p-2  w-full"
                            >
                              {selectedCategory || "Choose a Category"}
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu border-2 border-primary-color bg-slate-100 text-slate-900 font-semibold rounded-md w-full z-[1] p-1 shadow"
                            >
                              {categories.map((category) => (
                                <li key={category}>
                                  <a
                                    onClick={() =>
                                      handleCategorySelect(category)
                                    }
                                  >
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
                              onChange={(e) =>
                                setCustomCategory(e.target.value)
                              }
                              placeholder="Enter your art style"
                              className="input mt-2  input-bordered text-black text-sm rounded bg-slate-200 border-violet-950 border w-full"
                            />
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <label className="form-control mt-2 mx-2 flex justify-center items-center md:items-start ">
                <div className="label">
                  <span className="label-text font-semibold text-slate-900">
                    Introduce yourself
                  </span>
                </div>
                <textarea
                  id="artistDescription"
                  value={artistDescription}
                  onChange={handleArtistDescriptionChange}
                  className="textarea text-sm resize-none textarea-bordered w-[90%] md:w-full text-black rounded bg-slate-200 border-violet-950 border h-16"
                ></textarea>
              </label>
              <div className="w-full mt-4 px-2">
                {/* Region Dropdown */}
                <div className="label">
                  <span className="label-text font-semibold text-slate-900">
                    Select and type your Address
                  </span>
                </div>
                <div className="flex gap-2 w-full  -mt-2">
                  <div className="w-full">
                    <label className="block label-text-alt font-medium text-slate-700 p-2">
                      Region
                    </label>
                    <select
                      name="region"
                      className="select select-bordered text-black rounded border-violet-950 border bg-gray-100 w-full"
                      value={selected.region}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      disabled={loading.regions}
                    >
                      <option value="">
                        {loading.regions ? "Loading..." : "Select Region"}
                      </option>
                      {regions.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    {/* City Dropdown */}
                    <label className="block label-text-alt font-medium text-slate-700 p-2">
                      City/Municipality
                    </label>
                    <select
                      name="city"
                      className="select select-bordered text-black rounded border-violet-950 border bg-gray-100 w-full"
                      value={selected.city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      disabled={!selected.region || loading.cities}
                    >
                      <option value="">
                        {loading.cities ? "Loading..." : "Select City"}
                      </option>
                      {cities.map((city) => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Barangay Dropdown */}
                  <div className="w-full">
                    <label className="block label-text-alt font-medium text-slate-700 p-2">
                      Barangay
                    </label>
                    <select
                      name="barangay"
                      className="select select-bordered text-black rounded border-violet-950 border bg-gray-100 w-full"
                      value={selected.barangay}
                      onChange={(e) =>
                        setSelected((prev) => ({
                          ...prev,
                          barangay: e.target.value,
                        }))
                      }
                      disabled={!selected.city || loading.barangays}
                    >
                      <option value="">
                        {loading.barangays ? "Loading..." : "Select Barangay"}
                      </option>
                      {barangays.map((barangay) => (
                        <option key={barangay.code} value={barangay.code}>
                          {barangay.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Exact Location Input */}
                <label className="block mt-3 text-sm font-medium p-2 text-slate-900">
                  Exact Location
                </label>
                <input
                  type="text"
                  name="exactLocation"
                  placeholder="Street, Block, Building, Floor, etc."
                  className="input input-bordered text-sm rounded bg-slate-200  border-violet-950 border text-black w-full"
                  value={selected.exactLocation}
                  onChange={(e) => handleExactLocationChange(e.target.value)}
                />
              </div>

              <div className="border mt-8  border-slate-300 w-full"></div>
              <div className="label-text text-xl mt-5 font-semibold  text-slate-900">
                Wallet Information
              </div>
              <div className="md:flex w-full px-2 gap-3 mt-5">
                {/* Gcash Number Input */}
                <div className="w-full md:w-1/2">
                  <label className="form-control w-full">
                    <span className="label-text text-slate-900 font-semibold px-1">
                      Type your verified Gcash number
                    </span>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      placeholder="Type here"
                      onChange={phonedigit}
                      className="input input-bordered text-sm mt-2 text-black rounded bg-slate-200 border-violet-950 border w-full"
                    />
                    <span className="label-text-alt text-slate-700 mt-1">
                      Phone number should be 11 digits.
                    </span>
                  </label>
                </div>

                <div className="md:w-1/2 h-auto  w-full">
                  <span className="label-text text-slate-900 font-semibold px-1">
                    Screenshot of verified Gcash account
                  </span>
                  <div className="flex gap-1 mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChangeGCASH}
                      className="file-input bg-slate-200 border-violet-950 border rounded w-full"
                    />
                    <div
                      onClick={handleOpenImageG}
                      className="p-2 place-content-center cursor-pointer hover:scale-95 duration-200 bg-violet-900 rounded-md"
                    >
                      <box-icon
                        type="solid"
                        name="image-alt"
                        color="#FFFFFF"
                      ></box-icon>
                    </div>
                  </div>
                </div>
              </div>
              {/* Upload Valid ID */}
              <div className="w-full gap-3 px-2 mt-4 md:flex">
                <div className=" md:w-1/2 h-auto w-full">
                  <span className="label-text text-slate-900 font-semibold px-1">
                    Upload a selfie of you
                  </span>
                  <div className="flex mt-1 gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChangeSELFIE}
                      className="file-input  bg-slate-200 border-violet-950 border rounded w-full"
                    />
                    <div
                      onClick={handleOpenImageSS}
                      className="p-2 place-content-center cursor-pointer hover:scale-95 duration-200 bg-violet-900 rounded-md"
                    >
                      <box-icon
                        type="solid"
                        name="image-alt"
                        color="#FFFFFF"
                      ></box-icon>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 -mt-1.5 rounded-md">
                  <div className="flex items-center gap-3">
                    <label className="label-text font-semibold text-slate-900">
                      Upload Valid ID
                    </label>
                    {/* Info Tooltip */}
                    <div className="group relative cursor-pointer">
                      <box-icon
                        color="#5B21B6"
                        name="info-circle"
                        type="solid"
                        className="hover:scale-105 duration-100"
                      ></box-icon>
                      {/* Tooltip */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-64 p-2 bg-gray-900 text-white text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <p className="font-semibold">Valid IDs for Artist:</p>
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
                    {/* File Upload */}
                  </div>
                  <div className="flex mt-1 gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChangeID}
                      className="file-input bg-slate-200 border-violet-950 border rounded w-full"
                    />
                    <div
                      onClick={handleOpenImageID}
                      className="p-2 place-content-center cursor-pointer hover:scale-95 duration-200 bg-violet-900 rounded-md"
                    >
                      <box-icon
                        type="solid"
                        name="image-alt"
                        color="#FFFFFF"
                      ></box-icon>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border mt-7  border-slate-300 w-full"></div>
              <div className="label-text text-xl mt-5 font-semibold px-2 text-slate-900">
                Supporting Art
              </div>
              <div className="md:flex w-full px-2 gap-3 mt-5">
                <div className=" md:w-1/2  w-full">
                  <span className="label-text text-slate-900 font-semibold px-1">
                    Upload you art 1
                  </span>
                  <div className="flex mt-1 gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChangeUP1}
                      className="file-input bg-slate-200 border-violet-950 border rounded w-full"
                    />
                    <div
                      onClick={handleOpenImageS1}
                      className="p-2 place-content-center cursor-pointer hover:scale-95 duration-200 bg-violet-900 rounded-md"
                    >
                      <box-icon
                        type="solid"
                        name="image-alt"
                        color="#FFFFFF"
                      ></box-icon>
                    </div>
                  </div>
                </div>

                <div className=" md:w-1/2 w-full">
                  <span className="label-text text-slate-900 font-semibold px-1">
                    Upload you art 2
                  </span>
                  <div className="flex mt-1  gap-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChangeUP2}
                    className="file-input  bg-slate-200 border-violet-950 border rounded w-full"
                  />
                    <div
                      onClick={handleOpenImageS2}
                      className="p-2 place-content-center cursor-pointer hover:scale-95 duration-200 bg-violet-900 rounded-md"
                    >
                      <box-icon
                        type="solid"
                        name="image-alt"
                        color="#FFFFFF"
                      ></box-icon>
                    </div>
                  </div>
                
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn  justify-center w-full md:w-auto md:justify-center place-self-center mt-10 flex glass bg-custom-purple md:mr-7 md:px-10 iceland-regular tracking-wide text-lg text-white md:items-center "
              disabled={loading}
            >
              {loading ? (
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
        )}
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
      {showAlert11 && (
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
            <span>Artist photo should not exceed to 2mb!</span>
          </div>
        </div>
      )}
      {showAlert22 && (
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
            <span>Gcash screenshot should not exceed to 2mb!</span>
          </div>
        </div>
      )}
      {showAlert33 && (
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
            <span>Your selfie should not exceed to 2mb!</span>
          </div>
        </div>
      )}
      {showAlert44 && (
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
            <span>Valid ID should not exceed to 2mb!</span>
          </div>
        </div>
      )}
      {showAlert55 && (
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
            <span>Sample art 1 should not exceed to 2mb!</span>
          </div>
        </div>
      )}
      {showAlert66 && (
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
            <span>Sample art 2 should not exceed to 2mb!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistCreate;
