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
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import { blockInvalidChar } from "../Hooks/ValidNumberInput";
const { useState, useEffect } = React;

function Products() {
  const navigate = useNavigate();
  const [activeTabs, setActiveTab] = useState("manage-products");
  const [isModalOpenItems, setIsModalOpenItem] = useState(false); //Modal for Items
  const [isModalOpenAds, setIsModalOpenAds] = useState(false); //Modal for ads
  const [isModalImage, setIsModalOpenImage] = useState(false); //View Image
  const [imageSrc, setImageSrc] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false); // Alert
  const [showAlertUnpost, setShowAlertUnpost] = React.useState(false); // Alert Unpost
  const [showAlertDel, setShowAlertDel] = React.useState(false); // Alert Delete Item
  const [showAlert2, setShowAlert2] = React.useState(false); // Alert Confirm Post
  const [showAlertDelCon, setShowAlertDelCon] = React.useState(false); // Alert Confirmation to Delete the selected Item
  const [showAlertUnP, setShowAlertUnP] = React.useState(false); // Alert Confirmation to Unpost the selected Item
  const [viewItem, setViewPost] = React.useState(false); // Confirmation for posting item
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [submittedVariants, setSubmittedVariants] = useState([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [uploadedImages, setUploadedImages] = useState({});
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [shopItem, setShopProducts] = useState("");
  const [editableVariants, setEditableVariants] = useState({}); // Track editable states for each variant

  const toggleEdit = (variantIndex) => {
    setEditableVariants((prev) => ({
      ...prev,
      [variantIndex]: !prev[variantIndex],
    }));
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    setSelectedItem((prevItem) => {
      const updatedVariants = [...prevItem.item_Variant];
      updatedVariants[variantIndex].sizes[sizeIndex][field] = value;
  
      return {
        ...prevItem,
        item_Variant: updatedVariants,
      };
    });
  };
  

  useEffect(() => {
    // call the shop product details
    const fetchUserProfileAndShop = async () => {
      setLoading(true); // Start loading state

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

        // Fetch shop data for the current user
        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id, shop_name, shop_Rating")
          .eq("owner_Id", user.id);

        if (shopError) {
          setError(shopError.message);
          setLoading(false);
          return;
        }

        if (shops && shops.length > 0) {
          setShopData(shops); // Store the fetched shop data
          console.log("Fetched shops:", shops);

          const selectedShopId = shops[0].id; // Assuming the first shop is selected

          const { data: products, error: productError } = await supabase
            .from("shop_Product")
            .select(
              "id, item_Name, item_Description, item_Tags, item_Rating, item_Orders, item_Variant, is_Post"
            )
            .eq("shop_Id", selectedShopId);

          if (productError) {
            setError(productError.message);
          } else {
            console.log("Fetched products for the shop:", products);

            // Process each product and add the image path of the first variant
            const updatedProducts = products.map((product) => {
              const totalQuantity = product.item_Variant?.reduce(
                (total, variant) =>
                  total +
                  variant.sizes?.reduce(
                    (sizeTotal, size) => sizeTotal + parseInt(size.qty || 0),
                    0
                  ),
                0
              );

              const firstVariant =
                product.item_Variant && product.item_Variant[0];
              const { data: publicUrlData } = supabase.storage
                .from("product")
                .getPublicUrl(firstVariant?.img || "");

              const imagePath = publicUrlData?.publicUrl || null;

              console.log("First Variant:", firstVariant);
              console.log("Image Path:", firstVariant?.img);

              return { ...product, imagePath, totalQuantity };
            });

            setShopProducts(updatedProducts); // Store the products with imagePath in state
          }
        } else {
          console.log("No shops found for the user.");
          setError("No shops found for the current user.");
        }
      } else {
        console.log("No user is signed in");
        setError("No user is signed in");
      }

      setLoading(false); // Stop loading state
    };

    fetchUserProfileAndShop();
  }, []);

  const PostNotify = async () => {
    try {
      // Update the `is_Post` status
      const { error } = await supabase
        .from("shop_Product")
        .update({ is_Post: true })
        .eq("id", selectedItem.id);

      if (error) throw error;

      // Re-fetch the updated product and image URL
      const { data: updatedItem, error: fetchError } = await supabase
        .from("shop_Product")
        .select("*")
        .eq("id", selectedItem.id)
        .single();

      if (fetchError) throw fetchError;

      // Fetch the image path for the first variant
      const { data: publicUrlData } = supabase.storage
        .from("product")
        .getPublicUrl(updatedItem.item_Variant?.[0]?.img || "");
      const totalQuantity = updatedItem.item_Variant?.reduce(
        (total, variant) =>
          total +
          variant.sizes?.reduce(
            (sizeTotal, size) => sizeTotal + parseInt(size.qty || 0),
            0
          ),
        0
      );
      // Update state with the new product details
      setShopProducts((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedItem.id
            ? {
                ...updatedItem,
                imagePath: publicUrlData?.publicUrl,
                totalQuantity,
              }
            : item
        )
      );

      // Notify user and reset states
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setSelectedItem(null);
      setShowAlert2(false);
    } catch (error) {
      console.error("Error updating the post status:", error);
    }
  };
  const unPostNotify = async () => {
    try {
      // Update the `is_Post` status
      const { error } = await supabase
        .from("shop_Product")
        .update({ is_Post: false })
        .eq("id", selectedItem.id);

      if (error) throw error;

      // Re-fetch the updated product and image URL
      const { data: updatedItem, error: fetchError } = await supabase
        .from("shop_Product")
        .select("*")
        .eq("id", selectedItem.id)
        .single();

      if (fetchError) throw fetchError;

      // Fetch the image path for the first variant
      const { data: publicUrlData } = supabase.storage
        .from("product")
        .getPublicUrl(updatedItem.item_Variant?.[0]?.img || "");
      const totalQuantity = updatedItem.item_Variant?.reduce(
        (total, variant) =>
          total +
          variant.sizes?.reduce(
            (sizeTotal, size) => sizeTotal + parseInt(size.qty || 0),
            0
          ),
        0
      );
      // Update state with the new product details
      setShopProducts((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedItem.id
            ? {
                ...updatedItem,
                imagePath: publicUrlData?.publicUrl,
                totalQuantity,
              }
            : item
        )
      );

      // Notify user and reset states
      setShowAlertUnpost(true);
      setTimeout(() => setShowAlertUnpost(false), 3000);
      setSelectedItem(null);
      setShowAlertUnP(false);
      setShowAlert2(false);
    } catch (error) {
      console.error("Error updating the post status:", error);
    }
  };
  const DeleteItem = async () => {
    try {
      const { error } = await supabase
        .from("shop_Product")
        .delete()
        .eq("id", selectedItem.id);

      setShopProducts((prevItems) =>
        prevItems.filter((item) => item.id !== selectedItem.id)
      );
      setSelectedItem(null);
      setShowAlertDel(true);
      setTimeout(() => setShowAlertDel(false), 3000);
      setShowAlertDelCon(false);
      if (error) throw error;
      console.log("Item deleted:", selectedItem);
    } catch (error) {
      console.error("Error updating the post status:", error);
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
  const handlePostItem = () => {
    setShowAlert2(true);
  };
  const handleUnPostItem = () => {
    setShowAlertUnP(true);
  };
  const handleDelItem = () => {
    setShowAlertDelCon(true);
  };

  const handleClosePostItem = () => {
    setShowAlert2(false);
    setShowAlertDelCon(false);
    setShowAlertUnpost(false);
    setShowAlertUnP(false);
  };
  const handleViewClick = (item) => {
    setSelectedItem(item);
    console.log("Viewing item:", item);
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
                      onClick={() => navigate("/shop/AddItem")}
                      className="bg-custom-purple p-1 md:px-2 text-slate-50 cursor-pointer text-sm  duration-200 hover:scale-95 rounded-sm "
                    >
                      Add Items
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 font-semibold justify-around md:justify-between px-2 text-slate-800">
                  <li className="list-none w-1/12 text-center">Item ID</li>
                  <li className="list-none w-2/12 text-center">Photo</li>
                  <li className="list-none w-4/12 text-center">Name</li>
                  <li className="list-none w-1/12 text-center">Quantity</li>
                  <li className="list-none w-2/12 text-center">Status</li>
                  <li className="list-none w-2/12 text-center">Action</li>
                </div>

                {shopItem.length > 0 ? (
                  shopItem.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="p-2 text-slate-900 h-16 shadow-sm w-full bg-slate-100 flex justify-between gap-2 mb-2"
                      >
                        <div className="h-full w-1/12 flex items-center justify-center">
                          {item.id}
                        </div>
                        <div className="h-full w-2/12 flex items-center justify-center">
                          <div className="h-14 w-14 rounded-sm bg-slate-200">
                            {item.imagePath ? (
                              <img
                                src={item.imagePath}
                                alt={`Image of ${item.item_Name}`}
                                className="drop-shadow-custom bg-slate-100 h-full w-full object-cover rounded-md"
                                sizes="100%"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                                No Image
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="h-full w-4/12 flex items-center justify-center">
                          {item.item_Name}
                        </div>
                        <div className="h-full w-1/12 flex items-center justify-center">
                          <span
                            className={
                              item.totalQuantity <= 10
                                ? "text-red-500 font-semibold"
                                : "text-slate-700 font-bold"
                            }
                          >
                            {item.totalQuantity || "0"}
                          </span>
                        </div>
                        <div className="h-full w-2/12 flex items-center justify-center">
                          {item.is_Post === false ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full bg-red-500"
                                title="Not Posted"
                              ></div>
                              <span className="text-sm">Not Posted</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full bg-green-500"
                                title="Posted"
                              ></div>
                              <span className="text-sm">Posted</span>
                            </div>
                          )}
                        </div>
                        <div className="h-full w-2/12 flex items-center justify-end gap-2">
                          <div
                            onClick={() => handleViewClick(item)}
                            className="h-full px-2 md:w-24 bg-slate-500 flex items-center justify-center rounded-md font-semibold hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95"
                          >
                            View
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-slate-500">
                    No products found.
                  </div>
                )}
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
      {showAlertDel && (
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
            <span>Item is Successfully Deleted.</span>
          </div>
        </div>
      )}
      {showAlertUnpost && (
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
            <span>Item is Unposted.</span>
          </div>
        </div>
      )}

      {/* EDIT, VIEW, POST, REMOVE ITEM */}
      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 p-2">
          <div className="bg-white rounded-lg  md:w-1/2 h-2/3 w-full ">
            <div className=" bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 w-full rounded-t-md  " />
            <div className=" flex justify-between items-center ">
              <div className="text-custom-purple font-semibold iceland-regular text-2xl p-2">
                ITEM INFORMATION
              </div>
              <div className="h-full w-2/12 flex items-center justify-center">
                {selectedItem.is_Post === false ? (
                  // Red dot and "Not Posted" text
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full bg-red-500"
                      title="Not Posted"
                    ></div>
                    <span className="text-sm text-red-500">Not Posted</span>
                  </div>
                ) : (
                  // Green dot and "Posted" text
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full bg-green-500"
                      title="Posted"
                    ></div>
                    <span className="text-sm text-green-500">Posted</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-full bg-white w-full p-2 flex gap-2">
              <div className=" w-4/12 h-auto">
                <div className="w-full h-[200px] rounded-sm bg-slate-100 p-2 shadow-inner shadow-custom-purple mb-2">
                  <img
                    src={selectedItem.imagePath}
                    alt={`Image of ${selectedItem.item_Name}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className=" w-auto h-auto p-2 rounded-sm ">
                  {selectedItem.is_Post === false ? (
                    <div
                      onClick={handlePostItem}
                      className="bg-green-700 p-1 justify-center flex iceland-regular rounded-sm glass 
                    hover:scale-95 duration-300 cursor-pointer mt-2 text-black font-semibold hover:bg-green-500"
                    >
                      POST
                    </div>
                  ) : (
                    // Green dot and "Posted" text
                    <div
                      onClick={handleUnPostItem}
                      className="bg-gray-700 p-1 justify-center flex iceland-regular rounded-sm glass 
                   hover:scale-95 duration-300 cursor-pointer mt-2 text-black font-semibold hover:bg-gray-500"
                    >
                      UNPOST
                    </div>
                  )}
                  <div
                    onClick={handleDelItem}
                    className="bg-red-700 p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-2 text-black font-semibold hover:bg-red-500"
                  >
                    REMOVE
                  </div>
                  <div
                    onClick={handleCloseModal}
                    className="bg-custom-purple p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-10 md:mt-32 text-black font-semibold hover:bg-primary-color"
                  >
                    CLOSE
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 w-full h-full overflow-hidden relative overflow-y-scroll custom-scrollbar">
                <div className=" w-full bg-white h-auto px-2 ">
                  <div className="sticky bg-white h-auto z-10 top-0 flex justify-between place-items-center ">
                    <div className="text-2xl text-primary-color  font-bold">
                      {selectedItem.item_Name}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 h-auto">
                      <div className="mt-2">
                        <label className="text-sm text-slate-800 font-semibold">
                          Description:
                        </label>
                        <div className="text-sm text-primary-color font-semibold">
                          {selectedItem.item_Description}
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
                      <div className="mt-2 mb-2">
                        <label className="text-sm text-slate-800 font-semibold">
                          Item Tags:
                        </label>
                        <div className="text-sm text-white font-normal  flex flex-wrap gap-2">
                          {selectedItem.item_Tags?.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-color glass  rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-1/2 h-auto relative ">
                      <div className=" mr-2 justify-center right-5 place-items-end">
                        <div className="place-items-center mr-2">
                          <div className="text-yellow-500 text-5xl flex place-items-center font-bold text-center">
                            {selectedItem.item_Rating}
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
                      <div className="justify-center  right-5 place-items-center gap-2 top-20 absolute">
                        <div
                          className={
                            selectedItem.qty < 11
                              ? "text-red-500 text-2xl font-bold text-center"
                              : "text-primary-color text-2xl font-bold text-center"
                          }
                        >
                          {selectedItem.item_Orders}
                        </div>
                        <label className="text-sm text-slate-800 font-semibold">
                          Orders
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-auto w-full bg-slate-200 p-4 flex flex-col gap-4">
                  {selectedItem.item_Variant?.map((variant, variantIndex) => (
                    <div
                      key={variantIndex}
                      className="p-4 bg-white shadow-md rounded-lg"
                    >
                      {/* Variant Name */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-bold text-slate-800">
                          {variant.variant_Name}
                        </div>
                        <button
                          onClick={() => toggleEdit(variantIndex)}
                          className={`${
                            editableVariants[variantIndex]
                              ? "bg-green-500"
                              : "bg-blue-500"
                          } text-white text-sm px-3 py-1 rounded-md`}
                        >
                          {editableVariants[variantIndex] ? "Save" : "Edit"}
                        </button>
                      </div>

                      {/* Sizes, Quantities, and Prices */}
                      {variant.sizes?.map((size, sizeIndex) => (
                        <div
                          key={sizeIndex}
                          className="flex justify-between items-center mb-2 border-b pb-2"
                        >
                          <div>
                            <label className="text-slate-900 text-sm font-medium">
                              Size:
                            </label>
                            <input
                              className={`bg-slate-100 text-sm text-slate-700 font-medium p-1 rounded-sm w-20 ml-2 ${
                                editableVariants[variantIndex]
                                  ? "bg-slate-300"
                                  : "bg-slate-100"
                              }`}
                              type="text"
                              value={size.size}
                              onChange={(e) =>
                                handleSizeChange(
                                  variantIndex,
                                  sizeIndex,
                                  "size",
                                  e.target.value
                                )
                              }
                              readOnly={!editableVariants[variantIndex]}
                            />
                          </div>
                          <div>
                            <label className="text-slate-900 text-sm font-medium">
                              Quantity:
                            </label>
                            <input
                              onKeyDown={blockInvalidChar}
                              className={`bg-slate-100 text-sm text-slate-700 font-medium p-1 rounded-sm w-20 ml-2 ${
                                editableVariants[variantIndex]
                                  ? "bg-slate-300"
                                  : "bg-slate-100"
                              }`}
                              type="number"
                              value={size.qty}
                              onChange={(e) =>
                                handleSizeChange(
                                  variantIndex,
                                  sizeIndex,
                                  "qty",
                                  e.target.value
                                )
                              }
                              readOnly={!editableVariants[variantIndex]}
                            />
                          </div>
                          <div>
                            <label className="text-slate-900 text-sm font-medium">
                              Price:
                            </label>
                            <input
                              onKeyDown={blockInvalidChar}
                              className={`bg-slate-100 text-sm text-slate-700 font-medium p-1 rounded-sm w-20 ml-2 ${
                                editableVariants[variantIndex]
                                  ? "bg-slate-300"
                                  : "bg-slate-100"
                              }`}
                              type="number"
                              value={size.price}
                              onChange={(e) =>
                                handleSizeChange(
                                  variantIndex,
                                  sizeIndex,
                                  "price",
                                  e.target.value
                                )
                              }
                              readOnly={!editableVariants[variantIndex]}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="h-52 w-full bg-slate-500"> </div>
              </div>
            </div>
          </div>
          {/* Post Variant Confirmation */}
          {showAlert2 && (
            <div className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-5 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-slate-800">
                  Post this Item{" "}
                  <span className="font-bold text-primary-color">
                    {selectedItem.item_Name}
                  </span>
                  ?
                </h2>
                <div className="flex w-full gap-2 justify-between">
                  <button
                    onClick={handleClosePostItem}
                    className="mt-4 p-2 hover:bg-red-700 duration-300 bg-red-500 text-white rounded-md"
                  >
                    No! go back.
                  </button>
                  <button
                    onClick={PostNotify}
                    className="mt-4 p-2 hover:bg-green-700 duration-300 bg-green-500 text-white rounded-md"
                  >
                    Yeah sure!
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Unpost Variant Confirmation */}
          {showAlertUnP && (
            <div className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-5 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 text-center">
                  Are you sure you want to Unpost this <br />
                  <span className="font-bold text-primary-color">
                    {selectedItem.item_Name}
                  </span>
                  ?
                </h2>
                <div className="flex w-full gap-2 justify-between">
                  <button
                    onClick={handleClosePostItem}
                    className="mt-4 p-2 hover:bg-red-700 duration-300 bg-red-500 text-white rounded-md"
                  >
                    No! go back.
                  </button>
                  <button
                    onClick={unPostNotify}
                    className="mt-4 p-2 hover:bg-green-700 duration-300 bg-green-500 text-white rounded-md"
                  >
                    Yeah sure!
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Delete Variant Confirmation */}
          {showAlertDelCon && (
            <div className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-5 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 text-center">
                  Are you sure you want to Delete this <br />
                  <span className="font-bold text-primary-color">
                    {selectedItem.item_Name}
                  </span>
                  ?
                </h2>
                <div className="flex w-full gap-2 justify-between">
                  <button
                    onClick={handleClosePostItem}
                    className="mt-4 p-2 hover:bg-red-700 duration-300 bg-red-500 text-white rounded-md"
                  >
                    No! go back.
                  </button>
                  <button
                    onClick={DeleteItem}
                    className="mt-4 p-2 hover:bg-green-700 duration-300 bg-green-500 text-white rounded-md"
                  >
                    Yeah sure!
                  </button>
                </div>
              </div>
            </div>
          )}
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
