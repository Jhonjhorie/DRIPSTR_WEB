import SideBar from "../Component/Sidebars";
import React, { useEffect, useState } from "react";
import { blockInvalidChar } from "../Hooks/ValidNumberInput";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import successEmote from "../../../../src/assets/emote/success.png";
import questionEmote from "../../../../src/assets/emote/hmmm.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faLeftLong } from "@fortawesome/free-solid-svg-icons";

const AddItem = () => {
  const navigate = useNavigate();
  const [variants, setVariants] = useState([]);
  const [imageSrc, setImageSrc] = useState("");
  const [showAlert, setShowAlert] = React.useState(false); // Alert Max Variant
  const [showAlert2, setShowAlert2] = React.useState(false); // Alert Max Variant Information
  const [showAlert3, setShowAlert3] = React.useState(false); // Alert Required fields
  const [showAlert4, setShowAlert4] = React.useState(false); // Alert Image per Variant
  const [showAlert5, setShowAlert5] = React.useState(false); // Alert Name per Variant
  const [showAlertsize, setShowAlertsize] = React.useState(false); // Alert Name per Variant
  const [showAlert6, setShowAlert6] = React.useState(false); // Alert When no variant is added
  const [showModalDelete, setShowModalDelete] = React.useState(false); // Modal for Delete Variant Information
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [variantToDeleteName, setVariantToDeleteName] = useState("");
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryYN, setSelectedCategoryVouchYN] = useState("");
  const [showAlertSuccess, setShowAlertSuccess] = React.useState(false); // Alert Success
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [textureFile, setTextureFile] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  const handleCategorySelectYN = (categoryyn) => {
    setSelectedCategoryVouchYN(categoryyn);
  };
  //Get the user Shop Data
  const [formData, setFormData] = useState({
    itemTitle: "",
    itemDescription: "",
    tag1: "",
    tag2: "",
    tag3: "",
  });
  const addVariant = () => {
    if (variants.length >= 10) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return; // Do not add more variants if the limit is reached
    }

    setVariants([
      ...variants,
      {
        name: "", // Initial value for variant name
        info: [], // Initial empty array for variant info
        image: "", // Initial empty value for image
      },
    ]);
  };

  // Fetch the current user and shop data
  useEffect(() => {
    const fetchUserProfileAndShop = async () => {
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
            .select("shop_name, id") // Specify fields to fetch
            .eq("owner_Id", user.id);

          if (shopError) {
            throw shopError;
          }

          if (shops && shops.length > 0) {
            const shop = shops[0]; // Select the first shop (assuming single shop)
            setShopData(shop);
            setSelectedShopId(shop.id);
            console.log("Shop Name:", shop.shop_name);
            console.log("Shop ID:", shop.id);
          } else {
            console.log("No shop found for the current user.");
            setError("No shop found for the current user.");
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

    fetchUserProfileAndShop();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const addInfo = (index) => {
    const updatedVariants = [...variants];
    if (updatedVariants[index].info.length >= 10) {
      setShowAlert2(true);
      setTimeout(() => {
        setShowAlert2(false);
      }, 3000);
      return;
    }
    updatedVariants[index].info.push({
      size: "",
      quantity: "",
      price: "",
    });
    setVariants(updatedVariants);
  };
  // Handle item on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { itemTitle, itemDescription, tag1, tag2, tag3 } = formData;
    const tags = [tag1, tag2, tag3].filter(Boolean);

    try {
      // Validate required fields
      if (
        !itemTitle ||
        !itemDescription ||
        !selectedShopId ||
        !selectedCategory ||
        !selectedCategoryYN
      ) {
        console.log("Please fill in all required fields.");
        setShowAlert3(true);
        setTimeout(() => {
          setShowAlert3(false);
        }, 3000);
        setLoading(false);
        return;
      }
      //if no varainst is added
      if (variants.length === 0) {
        console.log("Please add at least one variant before submitting.");
        setShowAlert6(true);
        setTimeout(() => {
          setShowAlert6(false);
        }, 3000);
        setLoading(false);
        return;
      }
      // Validate that all variants have a selected image
      const hasMissingImages = variants.some((variant) => !variant.image);
      const hasMissingName = variants.some((variant) => !variant.name);
      const hasMissingSize = variants.some((variant) => !variant.info || variant.info.length === 0);
      if (hasMissingName) {
        console.log("Please ensure that each variant has a Name.");
        setShowAlert5(true);
        setTimeout(() => {
          setShowAlert5(false);
        }, 3000);
        setLoading(false);
        return;
      }
      if (hasMissingImages) {
        console.log("Please ensure that each variant has a selected image.");
        setShowAlert4(true);
        setTimeout(() => {
          setShowAlert4(false);
        }, 3000);
        setLoading(false);
        return;
      }
      if (hasMissingSize) {
        console.log("Please ensure that each variant has a sizes.");
        setShowAlertsize(true);
        setTimeout(() => {
          setShowAlertsize(false);
        }, 3000);
        setLoading(false);
        return;
      }

      // Handle texture upload if 3D is enabled
      let texturePath = null;
      if (is3DEnabled && textureFile) {
        const textureFileName = `texture_${Date.now()}_${textureFile.name}`;
        const { data: textureData, error: textureError } = await supabase.storage
          .from('textures') // Create this bucket in Supabase
          .upload(textureFileName, textureFile);

        if (textureError) {
          throw new Error(`Texture Upload Error: ${textureError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('textures')
          .getPublicUrl(textureFileName);

        texturePath = publicUrlData.publicUrl;
      }

      // Upload images for all variants
      const updatedVariants = await Promise.all(
        variants.map(async (variant) => {
          if (variant.file) {
            const filePath = `product/${Date.now()}_${variant.file.name}`;
            const { data, error } = await supabase.storage
              .from("product")
              .upload(filePath, variant.file);

            if (error) throw error;

            const { data: publicUrlData } = supabase.storage
              .from("product")
              .getPublicUrl(filePath);

            return {
              ...variant,
              image: data.path,
              imagePath: publicUrlData.publicUrl,
            };
          }
          return variant;
        })
      );

      // Prepare the formatted variants
      const formattedVariants = updatedVariants.map((variant) => ({
        img: variant.image || "",
        imagePath: variant.imagePath || "", 
        variant_Name: variant.name,
        sizes: variant.info.map((info, index) => ({
          id: index + 1,
          qty: info.quantity,
          size: info.size,
          price: info.price,
        })),
      }));

      // Insert the product data
      const { data, error } = await supabase.from("shop_Product").insert([
        {
          item_Name: itemTitle,
          item_Description: itemDescription,
          item_Tags: tags,
          item_Category: selectedCategory,
          apply_Vouch: selectedCategoryYN,
          item_Rating: 0,
          item_Orders: 0,
          is_Post: false,
          shop_Id: selectedShopId,
          shop_Name: shopData?.shop_name || "Unknown Shop",
          item_Variant: formattedVariants,
          is3D: is3DEnabled,
          texture_3D: texturePath
        },
      ]);

      if (error) throw error;

      setShowAlertSuccess(true);
      setFormData({
        itemTitle: "",
        itemDescription: "",
        tag1: "",
        tag2: "",
        tag3: "",
      });
      setSelectedCategory("");
      setSelectedCategoryVouchYN("");
      setVariants([]);
    } catch (error) {
      console.error("Error adding product:", error.message);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };
  const closeConfirmAdd = () => {
    setTimeout(() => {
      setShowAlertSuccess(false);
    }, 1000);
  };
  const removeVariant = () => {
    if (variantToDelete !== null) {
      const newVariants = variants.filter((_, i) => i !== variantToDelete);
      setVariants(newVariants);
      setImageSrc(""); // Clear the image preview
      const fileInput = document.getElementById("imageInput");
      if (fileInput) {
        fileInput.value = ""; 
      }
      setVariantToDelete(null); 
      setVariantToDeleteName(""); 
      setShowModalDelete(false); 
    }
  };

  const handleNameChange = (index, e) => {
    const updatedVariants = [...variants];
    updatedVariants[index].name = e.target.value;
    setVariants(updatedVariants);
  };

  const handleInfoChange = (variantIndex, infoIndex, field, e) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].info[infoIndex][field] = e.target.value;
    setVariants(updatedVariants);
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
      console.error("No file selected or input cleared.");
      return; // Exit if no file is selected
    }

    // Store the image preview URL temporarily
    const previewUrl = URL.createObjectURL(file);

    setVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index
          ? { ...variant, image: previewUrl, file } // Add the file object to the variant for later upload
          : variant
      )
    );

    console.log(`Preview for variant ${index} updated.`);
  };

  const removeInfo = (variantIndex, infoIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].info = newVariants[variantIndex].info.filter(
      (_, i) => i !== infoIndex
    );
    setVariants(newVariants);
  };

  const closeModal = () => {
    setShowModalDelete(false);
  };
  const handleDelConfirmation = (index, name) => {
    setShowModalDelete(true);
    setVariantToDelete(index);
    setVariantToDeleteName(name);
  };
  return (
    <div className="h-full w-full bg-slate-300 overflow-hidden  ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar></SideBar>
      </div>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="h-full w-full px-5 md:px-10 py-5">
          <div className="w-full h-auto mt-2 gap-5 md:flex">
            <div className=" w-full md:w-3/12 gap-5 h-auto p-2">
              <div className="md:text-3xl text-2xl flex font-bold text-slate-800">
                <div>
                  <button
                    onClick={() => navigate("/shop/MerchantProducts")}
                    className="hover:scale-90 duration-300"
                  >
                    {" "}
                    <FontAwesomeIcon icon={faLeftLong} /> 
                  </button>
                </div>
                <span className="ml-3 ">Add Item</span>
              </div>
              <div className=" w-full mt-2 ">
                <label className="text-slate-950  font-semibold mr-2 text-[15px]">
                  Item Title:
                </label>
                <br />
                <input
                  type="text"
                  className=" bg-slate-50 p-2 rounded-sm  mt-2 text-sm text-slate-800 w-full shadow-md"
                  placeholder="Item Name "
                  name="itemTitle"
                  value={formData.itemTitle}
                  onChange={handleChange}
                ></input>{" "}
              </div>
              <div className=" w-full h-auto mt-2">
                <label className="text-slate-950  font-semibold mr-2 text-[15px]">
                  Item Description:
                </label>
                <br />
                <textarea
                  className=" bg-slate-50 p-2 rounded-sm h-28 mt-2 text-sm text-slate-800 w-full shadow-md resize-none"
                  placeholder="Type your Item Description "
                  value={formData.itemDescription}
                  onChange={handleChange}
                  name="itemDescription"
                ></textarea>
              </div>
              <label className="text-slate-950  font-semibold mr-2 text-[15px]">
                Item Category:
              </label>
              <div className="">
                <div className="dropdown dropdown-right w-full">
                  <div
                    tabIndex={0}
                    role="button"
                    className="bg-custom-purple   glass hover:scale-95 duration-300 rounded-md text-center text-slate-100 p-2 w-full"
                  >
                    {selectedCategory || "Choose a Category"}
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu border-2 border-primary-color bg-slate-100 text-slate-900 font-semibold rounded-md w-full z-[1] p-1 shadow"
                  >
                    {[
                      "Jersey",
                      "Tshirt",
                      "Longsleeves",
                      "Shorts",
                      "Skirt",
                      "Pants",
                      "Tumbler",
                      "Mug",
                      "Shoes",
                      "Boots",
                      "Totebag",
                      "Skirt",
                      "Boots",
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
              </div>
              <label className="text-slate-950  font-semibold mr-2 text-[15px]">
                Voucher Applicable?
              </label>
              <div className="">
                <div className="dropdown dropdown-top w-full">
                  <div
                    tabIndex={0}
                    role="button"
                    className="bg-custom-purple glass hover:scale-95 duration-300 rounded-md text-center text-slate-100 p-2 mt-2 w-full"
                  >
                    {selectedCategoryYN || "Yes or No?"}
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu border-2 border-primary-color bg-slate-100 text-slate-900 font-semibold rounded-md w-full z-[1] p-1 shadow"
                  >
                    {["Yes", "No"].map((categoryyn) => (
                      <li key={categoryyn}>
                        <a onClick={() => handleCategorySelectYN(categoryyn)}>
                          {categoryyn}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="w-full h-56">
                <div className="w-full flex justify-between align">
                  <div className="p-1 text-slate-950  font-semibold text-[15px]">
                    Type 3 tags for your Item.
                  </div>
                  <div
                    className="tooltip tooltip-left md:tooltip-bottom p-1 cursor-help "
                    data-tip="Type three tags here such as 'Shirt', 'Polo', 'Appliances', etc... that suits to your Item."
                  >
                     <FontAwesomeIcon icon={faInfoCircle} /> 
                  </div>
                </div>
                <div className=" w-full ">
                  <input
                    type="text"
                    name="tag1"
                    className=" bg-slate-50 p-2 rounded-sm  mt-2 text-slate-800 w-full shadow-md"
                    placeholder="Type the 1st tag here.."
                    value={formData.tag1}
                    onChange={handleChange}
                  ></input>{" "}
                  <input
                    type="text"
                    name="tag2"
                    className=" bg-slate-50 p-2 rounded-sm  mt-2 text-slate-800 w-full shadow-md"
                    placeholder="Type the 2nd tag here.."
                    value={formData.tag2}
                    onChange={handleChange}
                  ></input>{" "}
                  <input
                    type="text"
                    name="tag3"
                    className=" bg-slate-50 p-2 rounded-sm  mt-2 text-slate-800 w-full shadow-md"
                    placeholder="Type the 3rd tag here.."
                    value={formData.tag3}
                    onChange={handleChange}
                  ></input>{" "}
                </div>
              </div>
              {/* <div className="mb-5 md:mb-0 -mt-2">
                <label className="text-slate-950 font-semibold mr-2 text-[15px]">
                  Enable 3D Preview:
                </label>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text text-slate-800">Add 3D Texture</span>
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary" 
                      checked={is3DEnabled}
                      onChange={(e) => setIs3DEnabled(e.target.checked)}
                    />
                  </label>
                </div>

                {is3DEnabled && (
                  <div className="mt-2 md:mb-0 mb-5">
                    <label className="text-slate-950 font-semibold mr-2 text-[15px]">
                      Upload Texture File (PNG):
                    </label>
                    <input
                      type="file"
                      accept="image/png"
                      className="bg-custom-purple text-white p-1.5 w-full mt-2 shadow-md rounded-md"
                      onChange={(e) => setTextureFile(e.target.files[0])}
                    />
                    <p className="text-xs text-slate-600 mt-1">
                      *Upload a PNG texture file for 3D preview
                    </p>
                  </div>
                )}
              </div> */}
            </div>
            <div className="w-full h-full md:-mt-0 mt-2 p-2 ">
              <div
                onClick={addVariant}
                className="p-2 w-28 text-center cursor-pointer bg-green-700 rounded-md shadow-slate-700 hover:scale-95 duration-200 shadow-md text-white"
              >
                Add Variant
              </div>
              <div className="w-full h-[70vh] overflow-y-scroll mt-2 p-1 md:p-3">
                {variants.length === 0 && (
                  <div className="w-fill h-full justify-items-center content-center">
                    <div className="-mt-10">
                      <img
                        src={questionEmote}
                        alt="Success Emote"
                        className="object-contain rounded-lg p-1 drop-shadow-customViolet"
                      />
                    </div>
                    <div className="-ml-7    ">
                      {" "}
                      <h1 className="text-2xl text-custom-purple iceland-regular font-extrabold">
                        Add Variants
                      </h1>
                    </div>
                  </div>
                )}
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="h-auto w-full bg-gradient-to-br from-violet-500 to-fuchsia-500 glass p-2 rounded-md shadow-slate-500 shadow-md mb-5"
                  >
                    <div className="w-full h-auto md:flex  gap-2 justify-center">
                      <div className="w-full bg-slate-300 mb-2 md:mb-0 h-[300px] bg-opacity-50 rounded-md overflow-hidden glass overflow-y-scroll p-5">
                        <div className="w-full  flex  justify-between items-center mb-2 justify-items-center place-content-center">
                          <input
                            type="text"
                            placeholder="Variant Name"
                            className="bg-slate-100 p-2 font-semibold text-slate-800   shadow-md md:w-full max-w-xs w-44  rounded-md"
                            value={variant.name}
                            onChange={(e) => handleNameChange(index, e)}
                          />
                          <div
                            onClick={() => addInfo(index)}
                            data-tip="Add Sizing, Price, and Quantity."
                            className="bg-green-800 cursor-pointer text-sm md:text-[15px] hover:bg-green-500 duration-200 glass rounded-md p-2.5 hover:scale-95 text-white tooltip tooltip-bottom flex items-center gap-2"
                          >
                            Add Info<i className="fas fa-plus"></i>
                          </div>
                          <div
                            onClick={() =>
                              handleDelConfirmation(index, variant.name)
                            }
                            data-tip="Remove this Variant."
                            className="bg-red-800 cursor-pointer text-sm md:text-[15px] hover:bg-red-500 duration-200 glass rounded-md p-2.5 hover:scale-95 text-white flex tooltip tooltip-bottom items-center gap-2"
                          >
                            Delete<i className="fas fa-trash-alt"></i>
                          </div>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          className="bg-custom-purple text-white p-1.5 w-full mb-3  shadow-md rounded-md"
                          onChange={(e) => handleImageChange(index, e)}
                          id="imageInput"
                        />
                        {variant.info === 0 && <div>Add information?</div>}
                        {variant.info.map((info, infoIndex) => (
                          <div
                            key={infoIndex}
                            className="w-full flex items-center mt-2"
                          >
                            <div className="w-full flex justify-between">
                              <div className="gap-2 flex place-items-center">
                                <label className="text-black  font-semibold text-sm">
                                  Size:
                                </label>
                                <input
                                  type="text"
                                  className="w-20 p-1 text-black  bg-slate-100 rounded-md"
                                  value={info.size}
                                  onChange={(e) =>
                                    handleInfoChange(
                                      index,
                                      infoIndex,
                                      "size",
                                      e
                                    )
                                  }
                                />
                              </div>
                              <div className="gap-2 flex place-items-center">
                                <label className="text-black  font-semibold text-sm">
                                  Quantity:
                                </label>
                                <input
                                  type="number"
                                  onKeyDown={blockInvalidChar}
                                  className="w-20 p-1 text-black  bg-slate-100 rounded-md"
                                  value={info.quantity}
                                  onChange={(e) =>
                                    handleInfoChange(
                                      index,
                                      infoIndex,
                                      "quantity",
                                      e
                                    )
                                  }
                                />
                              </div>
                              <div className="gap-2 flex place-items-center">
                                <label className="text-black font-semibold text-sm">
                                  Price:
                                </label>
                                <input
                                  type="number"
                                  onKeyDown={blockInvalidChar}
                                  className="w-20 p-1 text-black  bg-slate-100 rounded-md"
                                  value={info.price}
                                  onChange={(e) =>
                                    handleInfoChange(
                                      index,
                                      infoIndex,
                                      "price",
                                      e
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <div
                                onClick={() => removeInfo(index, infoIndex)}
                                className="bg-red-800 ml-5 cursor-pointer hover:bg-red-500 duration-200 glass rounded-md p-2 hover:scale-95 text-white flex tooltip tooltip-bottom items-center gap-2"
                              >
                                Delete
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="w-auto bg-slate-50 rounded-md p-2 justify-center">
                        <div className="h-[285px] w-[250px] mx-auto place-content-center bg-slate-200 rounded-sm">
                          {/*Selected Image will show here*/}
                          {!variant.image && (
                            <div className="text-center text-slate-600 p-10">
                              <box-icon name="image-alt" size="50px"></box-icon>{" "}
                              <br />
                              <span>Input an Image</span>
                            </div>
                          )}
                          {variant.image && (
                            <img
                              src={variant.image}
                              alt={`Selected image for variant ${index}`}
                              className="h-full w-full object-cover rounded-sm"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className=" absolute bottom-16 md:bottom-10 right-10 p-2 bg-violet-700 bg-opacity-40 rounded-md">
              {loading ? (
                <div className="text-center">
                  <span className="loading loading-infinity text-slate-50 w-16"></span>
                  <h1 className="text-slate-50 font-semibold iceland-regular text-xl">
                    Submitting
                  </h1>
                </div>
              ) : (
                <button
                  type="submit"
                  className="text-slate-100 font-semibold px-5 shadow-md shadow-primary-color
                 p-2 hover:scale-105 hover:bg-primary-color duration-300 rounded-md bg-custom-purple glass "
                >
                  Submit
                </button>
              )}
            </div>
          </div>
          {/* Reach Max Variant */}
          {showAlert && (
            <div className="md:bottom-5  w-auto px-10 bottom-16 z-10 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
              <div
                role="alert"
                className="alert  bg-custom-purple shadow-md flex items-center p-4  font-semibold rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm text-white md:text-[15px]">
                  You reach the maximum variant per Item!
                </span>
              </div>
            </div>
          )}
          {/* Reach Max Variant Information */}
          {showAlert2 && (
            <div className="md:bottom-5  w-auto px-10 bottom-16 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
              <div
                role="alert"
                className="alert  bg-custom-purple shadow-md flex items-center p-4  font-semibold rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm text-white md:text-[15px]">
                  You reach the maximum input for Variant Information!
                </span>
              </div>
            </div>
          )}
          {/* Fill the required fields */}
          {showAlert3 && (
            <div className="md:bottom-5  w-auto px-10 bottom-16 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
              <div
                role="alert"
                className="alert  bg-custom-purple shadow-md flex items-center p-4  font-semibold rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm text-white md:text-[15px]">
                  Required field is empty!
                </span>
              </div>
            </div>
          )}
          {/* Image each variant */}
          {showAlert4 && (
            <div className="md:bottom-5  w-auto px-10 bottom-16 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
              <div
                role="alert"
                className="alert  bg-custom-purple shadow-md flex items-center p-4  font-semibold rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm text-white md:text-[15px]">
                  Variants Image are Missing!
                </span>
              </div>
            </div>
          )}
          {/* Image each variant */}
          {showAlert5 && (
            <div className="md:bottom-5  w-auto px-10 bottom-16 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
              <div
                role="alert"
                className="alert  bg-custom-purple shadow-md flex items-center p-4  font-semibold rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm text-white md:text-[15px]">
                  Variants Name are Missing!
                </span>
              </div>
            </div>
          )}
          {/* Image sizes variant */}
          {showAlertsize && (
            <div className="md:bottom-5  w-auto px-10 bottom-16 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
              <div
                role="alert"
                className="alert  bg-custom-purple shadow-md flex items-center p-4  font-semibold rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm text-white md:text-[15px]">
                  Variants Sizes Information are Missing!
                </span>
              </div>
            </div>
          )}
          {/* Image each variant */}
          {showAlert6 && (
            <div className="md:bottom-5  w-auto px-10 bottom-16 z-10 right-0   h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
              <div
                role="alert"
                className="alert  bg-custom-purple shadow-md flex items-center p-4  font-semibold rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm text-white md:text-[15px]">
                  Please Input Atleast 1 Variant.
                </span>
              </div>
            </div>
          )}
          {/* Delete Variant Confirmation */}
          {showModalDelete && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-5 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-slate-800">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-primary-color">
                    {variantToDeleteName}
                  </span>
                  ?
                </h2>
                <div className="flex w-full justify-between">
                  <button
                    onClick={closeModal}
                    className="mt-4 p-2 hover:bg-red-700 duration-300 bg-red-500 text-white rounded-md"
                  >
                    No! go back.
                  </button>
                  <button
                    onClick={removeVariant}
                    className="mt-4 p-2 hover:bg-green-700 duration-300 bg-green-500 text-white rounded-md"
                  >
                    I'm sure!
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* ALLERTS ADD Item SUCCESS */}
          {showAlertSuccess && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white w-80  justify-items-center rounded-md shadow-md relative">
                <div className=" w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
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
                  Item Successfully Added
                </h2>
                <div
                  onClick={closeConfirmAdd}
                  className="bg-primary-color m-2 p-1 px-2 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
                >
                  Confirm
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddItem;
