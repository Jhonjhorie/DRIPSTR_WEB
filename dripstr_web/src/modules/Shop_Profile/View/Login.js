import React, { useEffect, useState } from "react";
import logo from "../../../assets/shop/logoWhite.png";
import "../../../assets/shop/fonts/font.css";
import { useNavigate } from "react-router-dom";
import "boxicons";
import { supabase } from "../../../constants/supabase";
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

  const [imageFile, setImageFile] = useState(null); // State to hold the image file
  const [pdfFile, setpdfFile] = useState(null);
  const phonedigit = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhoneNumber(value);
  };

  // Handle input change
  const handleShopNameChange = (e) => setShopName(e.target.value);
  const handleShopAddressChange = (e) => setShopAddress(e.target.value);
  const handleShopDescriptionChange = (e) => setShopDescription(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    //handles alerts on missing inputs
    if (!shopName.trim()) {
      console.error("Shop name is required");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return; // Do not proceed if the field is empty
    }
    if (!phoneNumber.trim()) {
      console.error("Phone Number is required");
      setShowAlert2(true);
      setTimeout(() => {
        setShowAlert2(false);
      }, 3000);
      return; // Do not proceed if the phone number is empty
    }
    if (phoneNumber.length !== 11) {
      console.error("Phone Number must be 11 digits");
      setShowAlert4(true);
      setTimeout(() => {
        setShowAlert4(false);
      }, 3000);
      return; // Ensure phone number is exactly 11 digits
    }
    if (!shopDescription.trim()) {
      console.error("Shop Description is required");
      setShowAlert5(true);
      setTimeout(() => {
        setShowAlert5(false);
      }, 3000);
      return; // Do not proceed if the field is empty
    }
    if (!shopAddress.trim()) {
      console.error("Shop Address is required");
      setShowAlert3(true);
      setTimeout(() => {
        setShowAlert3(false);
      }, 3000);
      return; // Do not proceed if the field is empty
    }
    if (!selectedImage) {
      console.error("Shop Image is required");
      setShowAlert6(true);
      setTimeout(() => {
        setShowAlert6(false);
      }, 3000);
      return; // Do not proceed if the field is empty
    }
    if (!selectedFile) {
      console.error("Shop File is required");
      setShowAlert7(true);
      setTimeout(() => {
        setShowAlert7(false);
      }, 3000);
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

    //set null if there's no Image & File Inputted
    let uploadedImageUrl = null;
    let uploadedPdfUrl = null;

    //Set Image from shop to DB
    if (imageFile) {
      try {
        // Upload the image to Supabase storage
        const { data, error: uploadError } = await supabase.storage
          .from("shop_profile") // Replace with your storage bucket name
          .upload(`shop_profile/${imageFile.name}`, imageFile);

        if (uploadError) {
          console.error("Error uploading image:", uploadError.message);
          return; // Exit if there's an error uploading the image
        }
        if (data?.path) {
          const { data: publicUrlData, error: urlError } = supabase.storage
            .from("shop_profile")
            .getPublicUrl(data.path);

          if (urlError) {
            console.error("Error fetching image URL:", urlError.message);
            return; // Exit if there's an error fetching the image URL
          }

          uploadedImageUrl = publicUrlData.publicUrl; // Correctly assign the public URL
          console.log("Image uploaded successfully:", uploadedImageUrl);
        }
      } catch (err) {
        console.error("Unexpected error while uploading image:", err);
        return; // Exit if there's an unexpected error during image upload
      }
    }

    //Set Business Permit from shop to DB
    if (pdfFile) {
      try {
        // Upload the image to Supabase storage
        const { data, error: uploadError } = await supabase.storage
          .from("shop_profile") // Replace with your storage bucket name
          .upload(`pdfs/${pdfFile.name}`, pdfFile);

        if (uploadError) {
          console.error("Error uploading pdffile:", uploadError.message);
          return; // Exit if there's an error uploading the image
        }
        if (data?.path) {
          const { data: publicUrlData, error: urlError } = supabase.storage
            .from("shop_profile")
            .getPublicUrl(data.path);

          if (urlError) {
            console.error("Error fetching pdf URL:", urlError.message);
            return; // Exit if there's an error fetching the image URL
          }

          uploadedPdfUrl = publicUrlData.publicUrl; // Correctly assign the public URL
          console.log("Image uploaded successfully:", uploadedPdfUrl);
        }
      } catch (err) {
        console.error("Unexpected error while uploading image:", err);
        return; // Exit if there's an unexpected error during image upload
      }
    }
    const userId = user.id; // Get the current user's ID

  // Insert the shop with the user ID as the owner ID
    try {
      // Fetch current user ID

      // Insert the shop with the user ID as the owner ID
      const { data: shopData, error: shopError } = await supabase
        .from("shop")
        .insert([
          {
            shop_name: shopName,
            contact_number: phoneNumber,
            description: shopDescription,
            address: shopAddress,
            owner_Id: userId, // Set the owner_id to the current user's ID
            shop_image: uploadedImageUrl || null,
            shop_BusinessPermit: uploadedPdfUrl || null,
          },
        ])
        .single(); // Insert a single shop and get the inserted row

      if (shopError) {
        console.error("Error inserting shop data:", shopError.message);
        return; // Exit early if there's an error inserting the shop data
      }

      console.log("Shop created successfully:", shopData);

      // Now, update the user's profile to set merchant_id to the new shop's shop_id
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ isMerchant: true })
        .eq("id", userId); // Update the user's profile with ismerchant = true

      if (updateError) {
        console.error("Error updating user profile:", updateError.message);
        return; // Exit if there's an error updating the user profile
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
      // Navigate to the Merchant Dashboard
      navigate("/shop/MerchantDashboard");
    } catch (err) {
      console.error("Unexpected error:", err);
    }
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

        <div className=" h-auto w-full lg:w-[55%]  overflow-hidden ">
          <div className="flex md:gap-2 md:justify-start justify-center  ">
            <box-icon
              name="store"
              type="solid"
              color="#4D077C"
              size="md"
            ></box-icon>
            <div className="font-bold text-2xl  flex p-2 text-custom-purple iceland-regular ">
              Create Merchant Account
            </div>
          </div>
          <div className="font-bold text-5xl text-center md:text-left p-1 text-custom-purple iceland-bold">
            Get Started
          </div>
          <form onSubmit={handleSubmit}>
            <div className="md:flex w-full place-items-center h-[50%] gap-2 lg:gap-5  p-2 ">
              <div className="w-full lg:w-1/2 h-full flex  items-center justify-center">
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

              <div className="w-full md:w-1/2 h-full rounded-md   justify-center mt-1 p-2">
                <label className="label-text font-semibold ml-2 text-slate-800">
                  Upload shop photo
                </label>
                <div className="h-auto w-full flex mt-2 justify-center gap-2 ">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    placeholder={fileName || "Choose a file..."}
                    className="file-input bg-slate-100 border-violet-950 border-2 max-w-xs  bottom-0 file-input-bordered w-full"
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
                  <div className="h-auto w-full flex mt-1 justify-center gap-2 ">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange2}
                      className="file-input bg-slate-100 border-violet-950 border-2 max-w-xs  bottom-0 file-input-bordered w-full"
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

            <label className="form-control mx-5 -mt-3 flex justify-center items-center md:items-start ">
              <label className="form-control w-full  ">
                <div className="label">
                  <span className="label-text font-semibold text-slate-800 ">
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
            <button className="btn mt-4 ml-2 glass bg-custom-purple mr-5 iceland-regular tracking-wide text-lg text-white ">
              SUBMIT
            </button>
          </form>
          <div className="w-full md:mb-0 mb-16 bg-slate-400 h-auto relative justify-between flex m-2 ">
            <button
              onClick={() => navigate("/shop/ArtistCreate")}
              className="  text-slate-600 iceland-bold absolute right-0 bottom-1 hover:text-custom-purple hover:duration-300 self-end mx-5 m-2"
            >
              BE A DRIPSTR ARTIST?{" "}
            </button>
          </div>
        </div>
      </div>

      {showAlert && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div
            role="alert"
            className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md"
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
          <div
            role="alert"
            className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md"
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
          <div
            role="alert"
            className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md"
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
          <div
            role="alert"
            className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md"
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
          <div
            role="alert"
            className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md"
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
          <div
            role="alert"
            className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md"
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
          <div
            role="alert"
            className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md"
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
    </div>
  );
}

export default Login;
