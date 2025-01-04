import React from "react";
import SideBar from "../Component/Sidebars";
import sample1 from "../../../assets/images/samples/5.png";
import sample2 from "../../../assets/images/samples/10.png";
import sample3 from "../../../assets/images/samples/3.png";
import sample4 from "../../../assets/images/samples/4.png";
import sample5 from "../../../assets/images/samples/6.png";
import sample6 from "../../../assets/images/samples/7.png";
import sample7 from "../../../assets/images/samples/9.png";
import sample8 from "../../../assets/images/samples/11.png";
import sample9 from "../../../assets/images/samples/12.png";
import sampleads from "../../../assets/shop/s2.jpg";

import { blockInvalidChar } from "../Hooks/ValidNumberInput";
const { useState } = React;

function Products() {
  const [activeTabs, setActiveTab] = useState("manage-products");
  const [isModalOpenItems, setIsModalOpenItem] = useState(false); //Modal for Items
  const [isModalOpenAds, setIsModalOpenAds] = useState(false); //Modal for ads
  const [isModalImage, setIsModalOpenImage] = useState(false); //View Image
  const [imageInputs, setImageInputs] = useState([]);
  const [Total, setNumber] = useState("");
  const [category, setCategory] = useState("");
  const [clotheType, setClotheType] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [imageSrc, setImageSrc] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false); // Alert
  const [viewItem, setViewPost] = React.useState(false); // Confirmation for posting item
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [inputs, setInputs] = useState([]); //add variants inputs
  const [submittedVariants, setSubmittedVariants] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedItems3, setSelectedItems3] = useState([]);
  const [isOpen3, setIsOpen3] = useState(false);
  const [selectedItems2, setSelectedItems2] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [uploadedImages, setUploadedImages] = useState({});

  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
    if (isOpen) setIsOpen(false);
    if (isOpen3) setIsOpen3(false);
  };
  const toggleDropdown3 = () => {
    setIsOpen3(!isOpen3);
    if (isOpen2) setIsOpen2(false);
    if (isOpen) setIsOpen(false);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen2) setIsOpen2(false);
    if (isOpen3) setIsOpen3(false);
  };

  const items = [
    "T-shirt",
    "Shorts",
    "Jeans",
    "Jacket",
    "Sweater",
    "Hat",
    "Scarf",
    "Gloves",
    "Socks",
    "Shoes",
    "Belt",
    "Sunglasses",
    "Watch",
    "Bracelet",
    "Necklace",
  ];
  const others = [
    "Gaming",
    "Electronics",
    "Fashion",
    "Home Appliances",
    "Toys",
    "Books",
    "Health & Beauty",
    "Sports",
    "Groceries",
    "Automotive",
    "Furniture",
    "Accessories",
    "Stationery",
  ];
  const customerTypes = [
    "Kid",
    "Teen",
    "Adult",
    "Senior",
    "Male",
    "Female",
    "Parent",
    "Student",
    "Professional",
    "Athlete",
    "Traveler",
    "Shopper",
    "Collector",
    "Fashion Enthusiast",
    "Casual Buyer",
  ];
  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };
  const handleCheckboxChange2 = (item) => {
    setSelectedItems2((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };
  const handleCheckboxChange3 = (item) => {
    setSelectedItems3((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };
  
  const handleSubmit = (index) => {
    if (inputs[index].trim() === "") {
      alert("Please input something");
      return;
    }
    const newSubmittedVariants = [
      ...submittedVariants,
      { text: inputs[index], sizes: [] },
    ];
    setSubmittedVariants(newSubmittedVariants);
  };
  const handleInputChange = (value, index) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };
  const handleDeleteInput = (indexToDelete) => {
    // Remove the input field at the specified index
    setInputs((prevInputs) =>
      prevInputs.filter((_, index) => index !== indexToDelete)
    );
    setSubmittedVariants((prevVariants) =>
      prevVariants.filter((_, index) => index !== indexToDelete),
      
    );
    setUploadedImages((prevImages) =>
    prevImages.filter((_, index) => index !== indexToDelete),
    
);
    
  };
  const handleAddItem = () => {
    //ITEMS
    setIsModalOpenItem(true);
  };
  const handleViewImage = (variantIndex) => {
    setIsModalOpenImage(true);
    setSelectedVariantIndex(variantIndex);
  };
  const handleImageUpload = (event, variantIndex) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImages((prevImages) => {
                const newUploadedImages = Array.isArray(prevImages) ? [...prevImages] : [];
                newUploadedImages[variantIndex] = reader.result;
                return newUploadedImages;
            });
        };
        reader.readAsDataURL(file);
    }
};
  const handleViewImageClose = () => {
    setIsModalOpenImage(false);
    setSelectedVariantIndex(null);
  };
  const handleAddAds = () => {
    //ADS
    setIsModalOpenAds(true);
  };
  const handleCloseModal = () => {
    //Close all modals even the datas
    setIsModalOpenItem(false);
    setIsModalOpenAds(false);
    setViewPost(false);
    setSelectedItem(null);
  };

  const handleViewClick = (item) => {
    setSelectedItem(item);
  };
  const addImageInput = () => {
    setImageInputs([...imageInputs, ""]);
  };  

  const deleteImageInput = (index) => {
    const newInputs = imageInputs.filter((_, i) => i !== index);
    setImageInputs(newInputs);
  };

  const handleAddInfo = (variantIndex) => {
    const newInfo = { ...additionalInfo };
    if (!newInfo[variantIndex]) {
      newInfo[variantIndex] = [];
    }
    newInfo[variantIndex].push({});
    setAdditionalInfo(newInfo);
  };
  const handleDeleteInfo = (variantIndex, infoIndex) => {
    const newInfo = { ...additionalInfo };
    newInfo[variantIndex] = newInfo[variantIndex].filter(
      (_, i) => i !== infoIndex
    );
    setAdditionalInfo(newInfo);
  };

  //Ads image appear in the div
  const handleImagePick = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageSrc("");
    }
  };
  const cancelImage = () => {
    setImageSrc("");
    document.getElementById("imageInput").value = "";
  };
  const PostNotify = () => {
    //Notify when post
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    setSelectedItem(false);
  };
  const ViewPostEDIT = () => {
    setViewPost(true);
  };
  //Items sample datas
  const sampleData = [
    {
      id: 1,
      photo: sample1,
      name: "Viscount Black",
      qty: 10,
      category: "Top wear",
      type: "T-Shirts",
      customerType: "Adults-Man",
      availableSizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Gray", "White", "Blue", "Red"],
      rating: 4,
    },
    {
      id: 2,
      photo: sample2,
      name: "Duke Blue",
      qty: 5,
      category: "Top wear",
      type: "Polo Shirts",
      customerType: "Adults-Woman",
      availableSizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Blue", "Cyan", "Teal", "White", "Pink"],
      rating: 5,
    },
    {
      id: 3,
      photo: sample3,
      name: "Earl Grey",
      qty: 8,
      category: "Top wear",
      type: "Sweatshirts",
      customerType: "Kids-Boy",
      availableSizes: ["4-5", "6-7", "8-10", "12-14", "16"],
      colors: ["Gray", "Black", "Red", "Green", "Yellow"],
      rating: 3,
    },
    {
      id: 4,
      photo: sample4,
      name: "Count Crimson",
      qty: 12,
      category: "Top wear",
      type: "Hoodies",
      customerType: "Kids-Girl",
      availableSizes: ["4-5", "6-7", "8-10", "12-14", "16"],
      colors: ["Red", "Pink", "Purple", "White", "Lavender"],
      rating: 4,
    },
    {
      id: 5,
      photo: sample5,
      name: "Baron Green",
      qty: 7,
      category: "Top wear",
      type: "Tank Tops",
      customerType: "Adults-Woman",
      availableSizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Green", "Lime", "Olive", "Yellow", "Beige"],
      rating: 5,
    },
    {
      id: 6,
      photo: sample6,
      name: "Marquis Magenta",
      qty: 9,
      category: "Top wear",
      type: "Crop Tops",
      customerType: "Kids-Girl",
      availableSizes: ["4-5", "6-7", "8-10", "12-14", "16"],
      colors: ["Magenta", "Pink", "Purple", "White", "Peach"],
      rating: 3,
    },
    {
      id: 7,
      photo: sample7,
      name: "Lord Lavender",
      qty: 6,
      category: "Top wear",
      type: "Blouses",
      customerType: "Adults-Woman",
      availableSizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Lavender", "Violet", "Silver", "Indigo", "Turquoise"],
      rating: 5,
    },
    {
      id: 8,
      photo: sample8,
      name: "Sir Silver",
      qty: 11,
      category: "Top wear",
      type: "Tunics",
      customerType: "Adults-Man",
      availableSizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Silver", "Gray", "White", "Black", "Teal"],
      rating: 4,
    },
    {
      id: 9,
      photo: sample9,
      name: "Lady Lilac",
      qty: 4,
      category: "Top wear",
      type: "Sweatshirts",
      customerType: "Kids-Boy",
      availableSizes: ["4-5", "6-7", "8-10", "12-14", "16"],
      colors: ["Lilac", "Purple", "Blue", "Pink", "Cyan"],
      rating: 2,
    },
  ];

  return (
    <div className="h-full w-full overflow-y-scroll bg-slate-300 px-2 md:px-10 lg:px-20 custom-scrollbar">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>

      <div className="w-full h-full bg-slate-300 ">
        <div className=" text-4xl text-custom-purple font-bold p-2 py-3">
          Manage Products
        </div>
        <div className="h-[550px] p-5 w-full overflow-hidden rounded-md shadow-md bg-slate-100">
          <div className=" w-full flex gap-5 place-items-center justify-between mb-2">
            <div className="md:flex md:gap-2 font-semibold text-slate-400">
              <div
                className={
                  activeTabs === "manage-products"
                    ? "active-tabs"
                    : "mb-2 md:mb-0"
                }
                onClick={() => setActiveTab("manage-products")}
              >
                <span className=" rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-custom-purple glass p-1  md:p-3">
                  Manage Products
                </span>
              </div>
              <div
                className={
                  activeTabs === "manage-adds" ? "active-tabs" : "mt-2 md:mt-0"
                }
                onClick={() => setActiveTab("manage-adds")}
              >
                <span className=" rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-custom-purple glass p-1 md:p-3">
                  Manage Ads
                </span>
              </div>
            </div>

            <div className="flex  md:gap-2 text-slate-50 rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 glass p-1 md:p-2">
              Create New Design
              <box-icon type="solid" color="#e2e8f0" name="palette"></box-icon>
            </div>
          </div>
          <div className="w-full h-full custom-scrollbar bg-slate-200 shadow-inner rounded-md p-4 overflow-y-scroll">
            {activeTabs === "manage-products" && (
              <div className="mb-8">
                <div className="flex justify-between">
                  <h2 className="text-xl md:text-3xl text-custom-purple iceland-regular mt-3 md:mt-0 font-bold mb-4 flex place-items-center gap-1 md:gap-5">
                    Manage Product
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip=" Once the Item is added, it doesn't mean it automatically added to the shop preview, but it will
                        only store to this page, you can still have the decision to post it. "
                    >
                      <button className="hover:bg-slate-600 glass bg-custom-purple duration-300 shadow-md place-items-center flex rounded-full">
                        <box-icon color="#FFFFFF" name="info-circle"></box-icon>
                      </button>
                    </div>
                  </h2>
                  <div className="flex gap-2 justify-center  place-items-center">
                    <div
                      onClick={handleAddItem}
                      className="bg-custom-purple p-1 md:px-2 text-slate-50 cursor-pointer text-sm  duration-200 hover:scale-95 rounded-sm "
                    >
                      Add Items
                    </div>
                  </div>
                </div>

                <div className=" flex gap-2 font-semibold justify-around md:justify-between px-2 text-slate-800">
                  <li className="list-none md:pl-5">Item ID</li>
                  <li className="list-none lg:-ml-48">Photo</li>
                  <li className="list-none lg:-ml-14">Name</li>
                  <li className="list-none lg:-ml-10">QTY</li>
                  <li className="list-none md:pr-6">Action</li>
                </div>

                {sampleData.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 text-slate-900 h-16 shadow-sm w-full bg-slate-100 flex justify-between gap-2 mb-2"
                  >
                    <div className="h-full w-1/12 flex items-center justify-center">
                      {item.id}
                    </div>
                    <div className="h-full w-2/12 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-sm bg-slate-200">
                        <img
                          src={item.photo}
                          alt={`Image of ${item.name}`}
                          className="drop-shadow-custom h-full w-full object-cover rounded-md"
                          sizes="100%"
                        />
                      </div>
                    </div>
                    <div className="h-full w-4/12 flex items-center justify-center">
                      {item.name}
                    </div>
                    <div className="h-full w-1/12 flex md:pl-5 lg:pl-24 items-center justify-center">
                      <span
                        className={
                          item.qty < 11
                            ? "text-red-500 font-semibold"
                            : "text-primary-color font-bold"
                        }
                      >
                        {item.qty}
                      </span>
                    </div>
                    <div className="h-full w-4/12 flex items-center justify-end gap-2">
                      <div
                        onClick={() => handleViewClick(item)}
                        className="h-full px-2 md:w-24 bg-slate-500 flex items-center justify-center rounded-md font-semibold hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95"
                      >
                        View
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTabs === "manage-adds" && (
              <div>
                <div className="flex justify-between">
                  <h2 className="text-xl md:text-3xl text-custom-purple iceland-regular mt-3 md:mt-0 font-bold mb-4 flex place-items-center gap-1 md:gap-5">
                    Manage Shop Advertisement
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip=" Maximum advertisement photos to be posted is 3 to 5 Images only.  "
                    >
                      <button className="hover:bg-slate-600 glass bg-custom-purple duration-300 shadow-md place-items-center flex rounded-full">
                        <box-icon color="#FFFFFF" name="info-circle"></box-icon>
                      </button>
                    </div>
                  </h2>
                  <div className="flex gap-2 justify-center  place-items-center">
                    <div
                      onClick={handleAddAds}
                      className="bg-custom-purple text-sm p-1 md:px-2 text-slate-50 cursor-pointer duration-200 hover:scale-95 rounded-sm "
                    >
                      Add photo Ads
                    </div>
                  </div>
                </div>

                <div className=" flex font-semibold justify-between px-2 text-slate-800">
                  <li className="list-none">Ads ID / Photo</li>
                  <li className="list-none">Name</li>
                  <li className="list-none pr-4">Action</li>
                </div>
                <div className="p-2 text-slate-900 h-16 shadow-sm w-full bg-slate-100 flex justify-between gap-2">
                  <div className="h-full w-20 place-items-center justify-center flex">
                    {" "}
                    10{" "}
                  </div>
                  <div className="h-full w-14 rounded-sm bg-slate-200">
                    <img
                      src={sampleads}
                      alt="Shop Logo"
                      className="drop-shadow-custom h-full w-full object-cover rounded-md"
                      sizes="100%"
                    />
                  </div>
                  <div className="h-full w-full place-items-center flex justify-center ">
                    {" "}
                    Latest Drip Design{" "}
                  </div>
                  <div
                    className=" h-full w-24 bg-slate-500 place-content-center items-center rounded-md font-semibold
                          hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95 flex "
                  >
                    View
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-slate-600 w-full h-9"></div>
        </div>
      </div>
      {/* Add Item Modal */}
      {isModalOpenItems && (
        <div className="fixed inset-0 pt-16 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white pt-2 rounded-lg p-5 w-full md:w-1/2 lg:w-3/4 m-2 md:m-0">
            <h2 className=" flex justify-between w-full place-items-center   ">
              <span className="font-bold text-[20px] text-slate-800 py-2 md:text-2xl ">
                ADD ITEM
              </span>{" "}
              <box-icon
                type="solid"
                color="#4D077C"
                name="customize"
              ></box-icon>
            </h2>
            <div className="bg-slate-200 h-[400px] md:h-full rounded-md overflow-hidden custom-scrollbar overflow-y-scroll md:flex gap-1 w-full p-2 md:px-5 mb-2">
              <div className="w-full md:w-1/4 h-auto p-1 pr-5 ">
                <label className="text-slate-950  font-semibold mr-2 text-sm">
                  Item Title:
                </label>
                <br />
                <input
                  type="text"
                  className=" bg-slate-50 p-1 rounded-sm  mt-2 text-slate-800 w-full shadow-md"
                  placeholder="Item Name "
                ></input>{" "}
                <br />
                <br />
                <label className="text-slate-950 font-semibold text-sm mr-2 ">
                  Tags:
                </label>
                <br />
                {/* type of clothe */}
                <div>
                  <button
                    type="button"
                    className="inline-flex  justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-slate-300 duration-200 "
                    onClick={toggleDropdown}
                  >
                    Clothe Type
                    <i
                      className={`ml-2 fas mt-1 fa-chevron-${
                        isOpen ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {isOpen && (
                  <div className="origin-top-right mt-2 h-40 overflow-hidden overflow-y-scroll w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {items.map((item) => (
                        <label
                          key={item}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            checked={selectedItems.includes(item)}
                            onChange={() => handleCheckboxChange(item)}
                          />
                          <span className="ml-2">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {/* Customer type */}
                <div className="mt-2">
                  <button
                    type="button"
                    className="inline-flex  justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-slate-300 duration-200 "
                    onClick={toggleDropdown2}
                  >
                    Customer Type
                    <i
                      className={`ml-2 fas mt-1 fa-chevron-${
                        isOpen ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {isOpen2 && (
                  <div className="origin-top-right mt-2 h-40 overflow-hidden overflow-y-scroll w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {customerTypes.map((item2) => (
                        <label
                          key={item2}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            checked={selectedItems2.includes(item2)}
                            onChange={() => handleCheckboxChange2(item2)}
                          />
                          <span className="ml-2">{item2}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {/* Other tags */}
                <div className="mt-2">
                  <button
                    type="button"
                    className="inline-flex  justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-slate-300 duration-200 "
                    onClick={toggleDropdown3}
                  >
                    Others
                    <i
                      className={`ml-2 fas mt-1 fa-chevron-${
                        isOpen3 ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
                {isOpen3 && (
                  <div className="origin-top-right mt-2 h-40 overflow-hidden overflow-y-scroll w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {others.map((item3) => (
                        <label
                          key={item3}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            checked={selectedItems3.includes(item3)}
                            onChange={() => handleCheckboxChange3(item3)}
                          />
                          <span className="ml-2">{item3}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Select sizes */}
              <div className=" w-full md:w-1/4 h-full py-1">
                <div className=" flex gap-2 place-items-center justify-between ">
                  <label className="text-slate-950 font-semibold text-sm ">
                    Add Item Variant
                  </label>
                  <div
                    className="tooltip tooltip-bottom "
                    data-tip="Add an Item."
                  >
                    <button
                      onClick={() => setInputs([...inputs, ""])}
                      className="hover:bg-slate-600 glass bg-custom-purple duration-300 p-0.5 shadow-md place-items-center flex rounded-sm"
                    >
                      <box-icon
                        name="message-square-add"
                        type="solid"
                        color="#FFFFFF"
                      ></box-icon>
                    </button>
                  </div>
                </div>

                <div className="h-[400px] mt-1 w-full px-2  bg-slate-100 overflow-hidden overflow-y-scroll shadow-sm shadow-slate-500 rounded-sm custom-scrollbar">
                  {inputs.length === 0 && (
                    <div className="text-red-500 text-sm mt-4 text-center">
                      Click the Add Button.
                    </div>
                  )}
                  {inputs.map((value, index) => (
                    <div key={index} className="items-center mt-2">
                      <input
                        type="text"
                        className="bg-slate-100 w-full text-slate-800 border py-1 px-2 rounded-sm text-sm shadow-md"
                        value={value}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index)
                        }
                        placeholder="Enter Variant"
                      />
                      <div className="flex g mt-1 justify-end">
                        <button
                          className="ml-2 bg-red-500 hover:bg-red-600 hover:scale-95 duration-300 text-white py-1 px-2 rounded-sm text-sm shadow-md"
                          onClick={() => handleDeleteInput(index)}
                        >
                          Delete
                        </button>
                        <button
                          className={`ml-2 bg-green-500 hover:bg-green-600 hover:scale-95 duration-300 text-white py-1 px-2 rounded-sm text-sm shadow-md ${
                            submittedVariants.some(
                              (variant) => variant.text === value
                            )
                              ? "cursor-not-allowed bg-slate-500"
                              : ""
                          }`}
                          onClick={() => handleSubmit(index)}
                          disabled={submittedVariants.some(
                            (variant) => variant.text === value
                          )}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Select variant and photo */}
              <div className="w-1/2 h-full ">
                <div className="flex justify-between place-items-center w-full ">
                  <label className="text-slate-950 font-semibold mr-2  text-sm">
                    {" "}
                    Put Image, Size, Quantity, Price{" "}
                  </label>

                  <button
                    className="bg-custom-purple justify-center flex text-white p-1 hover:bg-slate-600 duration-300 rounded-md "
                    onClick={addImageInput}
                  >
                    <box-icon
                      type="solid"
                      color="#FFFFFF"
                      name="folder-plus"
                    ></box-icon>
                  </button>
                </div>
                <div className="flex justify-between place-items-center w-full  mt-1 "></div>
                <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 h-[400px] w-full p-2 overflow-hidden overflow-y-scroll shadow-inner shadow-slate-500 rounded-sm  custom-scrollbar ">
                  <div>
                    {submittedVariants.length === 0 && (
                      <div className="text-slate-100 text-sm mt-2 text-center">
                        Please Input a Variant
                      </div>
                    )}
                    {submittedVariants.map((variant, variantIndex) => (
                        <div
                          key={variantIndex}
                          className="rounded-md p-1 mb-2 bg-slate-400 bg-opacity-60 glass shadow-md"
                      >
                        <div className="flex gap-1 justify-between">
                          <label className="block text-gray-800 text-sm text-center w-full bg-slate-100 mb-2 rounded-t-md py-2">
                            Upload an image for variant{" "}
                            <span className="font-bold uppercase">
                              {variant.text}
                            </span>
                          </label>
                          <button
                            className=" bg-blue-500 tooltip tooltip-bottom hover:bg-blue-600 hover:scale-95 mb-2 p-1 duration-300 text-white  rounded-sm text-sm shadow-md"
                            data-tip="View Image"
                            onClick={() => handleViewImage(variantIndex)}
                          >
                            <box-icon name="image" size="20px"></box-icon>
                          </button>
                          <button
                            className=" bg-red-500 hover:bg-red-600 hover:scale-95 mb-2 p-1 duration-300 text-white  rounded-sm text-sm shadow-md"
                            onClick={() => handleDeleteInput(variantIndex)}
                          >
                            <box-icon
                              type="solid"
                              name="trash"
                              size="20px"
                            ></box-icon>
                          </button>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleImageUpload(event, variantIndex)}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-slate-100 focus:outline-none"
                        />

                        <button
                          onClick={() => handleAddInfo(variantIndex)}
                          className="bg-green-600 glass hover:bg-violet-500 duration-200 px-2 py-1 rounded-sm mt-2 text-black text-sm"
                        >
                          Add new information
                        </button>
                        <br />

                        <div className="w-full justify-between flex">
                          <div>
                            <label className="text-slate-800 text-sm ">
                              Size:{" "}
                            </label>
                            <input
                              type="text"
                              className="p-1 bg-slate-100 w-20 rounded-sm text-black text-sm mt-1"
                            ></input>
                          </div>
                          <div>
                            <label className="text-slate-800 text-sm ">
                              Quantity:{" "}
                            </label>
                            <input
                              type="number"
                              onKeyDown={blockInvalidChar}
                              className="p-1 bg-slate-100 w-20 rounded-sm text-black text-sm mt-1"
                            ></input>
                          </div>
                          <div>
                            <label className="text-slate-800 text-sm ">
                              Price:{" "}
                            </label>
                            <input
                              type="number"
                              onKeyDown={blockInvalidChar}
                              className="p-1 bg-slate-100 w-20 rounded-sm text-black text-sm mt-1"
                            ></input>
                          </div>
                        </div>

                        {additionalInfo[variantIndex] &&
                          additionalInfo[variantIndex].map((_, infoIndex) => (
                            <div
                              key={infoIndex}
                              className="w-full justify-between flex mt-2"
                            >
                              <div>
                                <label className="text-slate-800 text-sm">
                                  Size:{" "}
                                </label>
                                <input
                                  type="text"
                                  className="p-1 bg-slate-100 w-20 rounded-sm text-black text-sm mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-slate-800 text-sm">
                                  Quantity:{" "}
                                </label>
                                <input
                                  type="number"
                                  onKeyDown={blockInvalidChar}
                                  className="p-1 bg-slate-100 w-20 rounded-sm text-black text-sm mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-slate-800 text-sm">
                                  Price:{" "}
                                </label>
                                <input
                                  type="number"
                                  onKeyDown={blockInvalidChar}
                                  className="p-1 bg-slate-100 w-20 rounded-sm text-black text-sm mt-1"
                                />
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteInfo(variantIndex, infoIndex)
                                }
                                className="bg-red-600 px-1 rounded-sm text-white hover:bg-red-400 duration-200 glass text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                      </div>
                    ))}

                    {imageInputs.map((input, index) => (
                      <div key={index} className="flex items-center mb-2 gap-2">
                        <input
                          type="text"
                          placeholder="Label"
                          className="bg-slate-50 p-1.5 text-slate-700 text-sm rounded-sm"
                        ></input>
                        <input
                          type="file"
                          accept="image/*"
                          className="border p-0.5 rounded-sm w-full bg-slate-200 h-auto text-slate-800 text-sm"
                        />
                        <button
                          className=" bg-red-500 text-white h-9 px-2 py-1 rounded"
                          onClick={() => deleteImageInput(index)}
                        >
                          Clear
                        </button>
                      </div>
                    ))}
                  </div>
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
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleCloseModal}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Advertisement Modal */}
      {isModalOpenAds && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white rounded-lg p-5 h-auto w-full md:w-3/4 pt-2 lg:w-1/2 m-2 md:m-0 auto">
            <div className="font-medium text-slate-800 py-2 w-full flex justify-between place-items-center  ">
              <span className="font-bold text-[20px] md:text-2xl">
                Add Shop Advertisement Photo
              </span>
              <box-icon name="images" color="#4D077C"></box-icon>
            </div>
            <div className="h-auto w-full bg-slate-200 place-items-center md:place-items-start  rounded-md shadow-sm mb-2 p-2 md:flex gap-2">
              <div className="md:w-1/2 h-auto p-2">
                <div className="mt-2">
                  <label className=" text-slate-800  text-sm font-semibold">
                    Name:
                  </label>{" "}
                  <br />
                  <input
                    type="text"
                    className="bg-slate-100 p-1 rounded-sm shadow-md mt-1 text-slate-800 w-full"
                    placeholder="Type Ad Name"
                  ></input>{" "}
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
              <div className="w-[180px] h-2/3 md:w-1/2 md:h-full bg-custom-purple shadow-md glass rounded-sm p-2">
                <div className="bg-slate-100 h-[200px] md:h-[350px] rounded-sm shadow-md place-items-center flex place-content-center">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      className="h-full w-full object-contain"
                      alt="Preview of the selected marketing visual"
                    />
                  ) : (
                    <span>Ads will appear here</span>
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
                onClick={handleCloseModal}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALLERTS */}
      {showAlert && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Item Posted in the Shop</span>
          </div>
        </div>
      )}

      {/* EDIT, VIEW, POST, REMOVE ITEM */}
      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 p-2">
          <div className="bg-white rounded-lg  md:w-1/2 h-2/3 w-full ">
            <div className=" bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 w-full rounded-t-md  " />
            <div className="text-custom-purple font-semibold iceland-regular text-2xl p-2">
              ITEM INFORMATION
            </div>
            <div className="h-full bg-white w-full p-2 flex gap-2">
              <div className=" w-4/12 h-auto">
                <div className="w-full h-[200px] rounded-sm bg-slate-100 shadow-inner shadow-custom-purple mb-2">
                  <img
                    src={selectedItem.photo}
                    alt={`Image of ${selectedItem.name}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className=" w-auto h-auto p-2 rounded-sm ">
                  <div
                    onClick={PostNotify}
                    className="bg-blue-700 p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-2 text-black font-semibold hover:bg-blue-500"
                  >
                    POST
                  </div>
                  <div
                    className="bg-green-700 p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-2 text-black font-semibold hover:bg-green-500"
                  >
                    EDIT
                  </div>
                  <div
                    className="bg-red-700 p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-2 text-black font-semibold hover:bg-red-500"
                  >
                    REMOVE
                  </div>
                  <div
                    onClick={handleCloseModal}
                    className="bg-custom-purple p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-10 md:mt-24 text-black font-semibold hover:bg-primary-color"
                  >
                    CLOSE
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 w-full h-full overflow-hidden relative overflow-y-scroll custom-scrollbar">
                <div className="h-52 w-full bg-white px-2">
                  <div className="sticky bg-white h-auto z-10 top-0 flex justify-between place-items-center ">
                    <div className="text-2xl text-primary-color  font-bold">
                      {selectedItem.name}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2">
                      <div className="mt-2">
                        <label className="text-sm text-slate-800 font-semibold">
                          For:
                        </label>
                        <div className="text-sm text-primary-color font-semibold">
                          {selectedItem.customerType}
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="text-sm text-slate-800 font-semibold">
                          Category:
                        </label>
                        <div className="text-sm text-primary-color font-semibold">
                          {selectedItem.category}
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="text-sm text-slate-800 font-semibold">
                          Clothing Type:
                        </label>
                        <div className="text-sm text-primary-color font-semibold">
                          {selectedItem.type}
                        </div>
                      </div>
                    </div>

                    <div className="w-1/2 h-auto relative ">
                      <div className=" mr-2 justify-center right-5 place-items-end">
                        <div className="place-items-center mr-2">
                          <div className="text-yellow-500 text-5xl flex place-items-center font-bold text-center">
                            {selectedItem.rating}
                            <box-icon
                              type="solid"
                              color="#FFB200"
                              size="40px"
                              name="star"
                            ></box-icon>
                          </div>
                          <label className="text-sm text-slate-800 font-semibold">
                            Customers rating
                          </label>
                        </div>
                      </div>
                      <div className="justify-center right-5 place-items-center bottom-0 absolute">
                        <div
                          className={
                            selectedItem.qty < 11
                              ? "text-red-500 text-2xl font-bold text-center"
                              : "text-primary-color text-2xl font-bold text-center"
                          }
                        >
                          {selectedItem.qty}
                        </div>
                        <label className="text-sm text-slate-800 font-semibold">
                          Quantity
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-52 w-full bg-slate-200"> </div>
                <div className="h-52 w-full bg-slate-500"> </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white relative rounded-lg p-5 h-auto w-full md:w-3/12  m-2 md:m-0 auto">
            <div className="min-h-80 bg-violet-300 w-full">
             {selectedVariantIndex !== null ? (
              uploadedImages[selectedVariantIndex] ? (
                <div className="h-80 bg-violet-300 w-full">
                <img
                  src={uploadedImages[selectedVariantIndex]}
                  alt={`Variant ${selectedVariantIndex}`}
                  className=" mb-4 object-fill h-full w-auto place-self-center"
                />
              </div>
              ) : (
                <p className="text-center text-gray-500 mb-4">
                  No image uploaded for this item.
                </p>
              )
            ) : null}
            </div>
            <div className="flex gap-2">
              <button
                className="bg-white absolute top-0 right-2 text-red-600 font-bold px-3 py-1 mt-2 rounded-lg hover:text-red-300 duration-200"
                onClick={handleViewImageClose}
              >
                X
              </button>
              <div className="w-full">
                {selectedVariantIndex !== null && (
                  <div className="mt-3">
                    <p className="font-bold uppercase text-center text-slate-700">
                      {submittedVariants[selectedVariantIndex].text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
