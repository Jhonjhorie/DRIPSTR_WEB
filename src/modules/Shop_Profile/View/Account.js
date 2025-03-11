import React from "react";
import SideBar from "../Component/Sidebars";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import successEmote from "../../../../src/assets/emote/success.png";
import questionEmote from "../../../../src/assets/emote/question.png";
import hmmmEmote from "../../../../src/assets/emote/hmmm.png";
import MerchantWallet from "../Component/MerchantWallet"
import {
  blockInvalidChar,
  validateMinLength2,
} from "../Hooks/ValidNumberInput";
const { useState, useEffect } = React;

function Account() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shopData, setShopData] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [showAlertEdit, setShowEdit] = React.useState(false); // Alert Complete Info
  const [showAlertEditNochanges, setShowEditNochanges] = React.useState(false); // Alert No Complete Info
  const [showAlertSuccessEdit, setShowAlertSuccessEdit] = React.useState(false); // Alert Success Edit
  const [showAlertSuccessEditCon, setShowAlertSuccessEditCON] =
    React.useState(false); // Alert Success Edit Confirmation
  const phonedigit = (e) => {
    validateMinLength2(e, 11);
  };
  const fetchUserProfileAndShop = async () => {
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

        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select(
            "shop_name, id, address, description, contact_number, shop_image, shop_BusinessPermit"
          )
          .eq("owner_Id", user.id);

        if (shopError) {
          throw shopError;
        }

        if (shops && shops.length > 0) {
          const shop = shops[0];
          setShopData(shop);
          setSelectedArtistId(shop.id);
          console.log("Shop Name:", shop.shop_name);
          console.log("Shop ID:", shop.id);
          console.log("Shop Business Permit:", shop.shop_BusinessPermit);
        } else {
          console.log("No shop page found for the current user.");
          setError("No shop page found for the current user.");
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
    fetchUserProfileAndShop();
  }, []); // Run once on mount
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleCloseModalEdit = () => {
    setShowEdit(false);
    setImagePreview(null);
    setSelectedFile(null);
    setFormData({
      shop_name: "",
      address: "",
      description: "",
      contact_number: "",
    });
  };

  const [formData, setFormData] = useState({
    shop_name: shopData?.shop_name || "",
    address: shopData?.address || "",
    description: shopData?.description || "",
    contact_number: shopData?.contact_number || "",
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
      console.log("Updating artist ID:", shopData?.id);
      if (!shopData?.id) {
        alert("Error: Artist ID is missing.");
        return;
      }

      let updatedData = {};
      // Check if the fields name has changed and update only if it's different
      if (formData.shop_name && formData.shop_name !== shopData.shop_name) {
        updatedData.shop_name = formData.shop_name;
      }
      if (formData.address && formData.address !== shopData.address) {
        updatedData.address = formData.address;
      }
      if (
        formData.description &&
        formData.description !== shopData.description
      ) {
        updatedData.description = shopData.description;
      }
      if (
        formData.contact_number &&
        formData.contact_number !== shopData.contact_number
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
        const filePath = `shop_profile/${selectedFile.name}`;
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
        updatedData.shop_image = imageUrl;
      }

      const { data: updatedShop, error: updateError } = await supabase
        .from("shop")
        .update(updatedData)
        .eq("id", shopData.id)
        .select();

      if (updateError) {
        console.error("Update Error:", updateError);
        throw updateError;
      }
      setFormData({
        shop_name: "",
        address: "",
        description: "",
        contact_number: "",
      });
      console.log("Updated Artist Response:", updatedShop);
      setShowAlertSuccessEditCON(false);
      setShowAlertSuccessEdit(true);
      setShowEdit(false);
      setLoading(false);
      fetchUserProfileAndShop();
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
    <div className="h-full w-full  bg-slate-300 md:flex">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      <div className="w-full h-full bg-slate-300 md:px-10 lg:px-16 md:mb-0 mb-7 py-2">
        <div className="text-xl mt-10 md:mt-0 md:text-3xl font-semibold w-full text-center text-custom-purple p-3">
          MERCHANT INFORMATION
        </div>
        <div className="h-auto w-full h-slate-50 px-5 md:px-10 flex justify-center">
          <div className="w-full h-full bg-slate-50 relative justify-items-center shadow-lg rounded-md">
            <div className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md"></div>
            <div className="absolute top-2 right-2">
              <div
                onClick={setShowEdit}
                className="cursor-pointer hover:scale-95 duration-200"
              >
                <box-icon color="black" type="solid" name="edit"></box-icon>
              </div>
            </div>
            <div className="w-auto p-7 h-full md:flex place-items-center md:place-items-start gap-5">
              <div className="md:w-1/3 w-full h-auto ">
                <div className="bg-slate-100 relative md:h-[250px] md:w-[320px] w-[200px] h-[150px] justify-self-center border-2 p-1 border-custom-purple rounded-md">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                       <div className="h-14 w-14 ">
                        <img
                          src={hmmmEmote}
                          className="h-full w-full object-cover"
                        />
                      </div><br/>
                      <div>
                        {" "}
                        <span className="loading loading-bars loading-lg"></span>
                      </div>
                    </div>
                  )}

                  {shopData && (
                    <img
                      src={shopData.shop_image}
                      alt={shopData.shop_name}
                      className={`drop-shadow-custom h-full w-full justify-center object-cover rounded-md ${
                        imageLoading ? "opacity-0" : "opacity-100"
                      } transition-opacity duration-300`}
                      onLoad={handleImageLoad}
                      onError={handleImageLoad}
                    />
                  )}
                </div>
                <div className="text-slate-900 text-xl md:text-2xl text-center mt-2 font-semibold">
                  {shopData.shop_name}
                </div>

                <div className="text-slate-900 text-sm md:text-xl text-center mt-2 font-semibold">
                  0{shopData.contact_number}
                </div>
                <div className="text-slate-100 text-sm p-2 bg-custom-purple glass rounded-md text-center mt-2 font-normal">
                  {shopData.address}
                </div>
              </div>
              <div className="w-full md:mt-0 mt-2 md:w-2/3 h-full ">
                <div className="text-slate-900 text-xl font-semibold text-left">
                  Merchant Description
                </div>
                <div className="text-slate-800 mt-2 font-normal w-full h-full text-sm rounded-sm p-2 bg-slate-200 glass overflow-hidden overflow-y-scroll">
                  "{shopData.description}"
                </div>
              </div>
              <div className="w-full mt-5 md:mt-0 md:w-1/2 h-auto">
                <div className="text-slate-900 text-xl font-semibold text-left">
                  Merchant Business Permit
                </div>
                <div className="text-custom-purple mt-2 font-normal w-full h-[44vh] rounded-md p-2 bg-slate-200 overflow-hidden">
                    <img
                      src={shopData.shop_BusinessPermit}
                      alt="Business Permit"
                      className="w-full h-full border border-gray-300 rounded-md"
                      title="Business Permit"
                      onLoad={handleImageLoad}
                      onError={handleImageLoad}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ALLERTS ADD Item SUCCESS */}
        {showAlertEdit && (
          <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 p-2 flex justify-center items-center">
            <div className="bg-white  md:h-auto mt-5 md:mt-8 w-full md:w-[50%]  justify-items-center rounded-md shadow-md relative">
              <div className=" w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md">
                {" "}
              </div>
              <h1 className="text-custom-purple text-xl md:text-2xl font-semibold">
                Edit Account Information
              </h1>
              <div></div>
              <div className="md:flex gap-2 w-full h-[500px] overflow-y-scroll overflow-hidden px-5 md:px-10 ">
                <div className=" w-full md:w-1/2 h-auto ">
                  <div className=" p-2 w-full flex justify-center">
                    <div className="bg-slate-100 relative h-44 w-60 border-2 p-1 border-custom-purple rounded-md">
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <span className="loading loading-bars loading-lg"></span>
                        </div>
                      )}

                      <img
                        src={imagePreview || shopData?.shop_image}
                        alt={shopData?.shop_name}
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
                        Type your Merchant name
                      </span>
                    </div>
                    <input
                      type="text"
                      name="shop_name"
                      value={formData.shop_name}
                      onChange={handleInputChange}
                      placeholder={shopData.shop_name}
                      className="p-1 bg-slate-300 text-sm w-full font-normal text-slate-900 rounded-sm"
                    ></input>{" "}
                    <br />
                    <div className="label">
                      <span className="label-text text-slate-800 font-semibold">
                        Type your Contact number
                      </span>
                    </div>
                    <input
                      type="number"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      onKeyDown={blockInvalidChar}
                      onInput={phonedigit}
                      placeholder={shopData.contact_number}
                      className="p-1 bg-slate-300 w-full text-sm font-normal text-slate-900 rounded-sm"
                    ></input>{" "}
                    <br />
                    <div className="label">
                      <span className="label-text text-slate-800 font-semibold">
                        Change address
                      </span>
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={shopData.address}
                      className="p-1 bg-slate-300 w-full text-sm font-normal text-slate-900 rounded-sm"
                    ></input>
                  </div>
                </div>
                <div className="w-full md:w-1/2 h-auto p-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="p-1 bg-slate-300 w-full font-normal text-sm text-slate-800 rounded-sm"
                    onChange={handleImageChange}
                  ></input>{" "}
                  <br />
                  <div className="label">
                    <span className="label-text text-slate-800 font-semibold">
                      Type your Artist Page Bio
                    </span>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={shopData.description}
                    className="p-2 h-[150px] md:h-[80%] bg-slate-200 text-sm resize-none shadow-md shadow-slate-400 w-full font-normal text-slate-900"
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

              <h2 className="text-2xl font-bold iceland-regular mb-4 text-center text-slate-900 ">
                Merchant Page Updated Successfully
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
          <div className="fixed z-20 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
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
                Update Merchant Information?
              </h2>
              <div className="w-full flex justify-between">
                <div
                  onClick={closeConfirmEditCon}
                  className="bg-red-500 hover:bg-red-300 m-2 p-1 px-2 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
                >
                  Cancel
                </div>
                <div
                  onClick={handleEdit}
                  className="bg-primary-color m-2 p-1 px-2 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
                >
                  Okay!
                </div>
              </div>
            </div>
          </div>
        )}
        {showAlertEditNochanges && (
          <div className="md:bottom-5  w-auto px-10 bottom-10 z-20 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
    </div>
  );
}

export default Account;
