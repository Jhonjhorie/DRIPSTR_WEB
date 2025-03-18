import React from "react";
import SideBar from "../Component/Sidebars";
import sampleads from "../../../assets/shop/s2.jpg";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import { blockInvalidChar } from "../Hooks/ValidNumberInput";
import sadEmote from "../../../../src/assets/emote/sad.png";
import successEmote from "../../../../src/assets/emote/success.png";
import questionEmote from "../../../../src/assets/emote/question.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfo,
  faImages,
  faStar,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

const { useState, useEffect } = React;

function Products() {
  const navigate = useNavigate();
  const [activeTabs, setActiveTab] = useState("manage-products");
  const [isModalOpenItems, setIsModalOpenItem] = useState(false); //Modal for Items
  const [isModalOpenAds, setIsModalOpenAds] = useState(false); //Modal for ads
  const [isModalImage, setIsModalOpenImage] = useState(false); //View Image
  const [adAdsAlert, setAdAdsAlert] = useState(false);
  const [imageSrc, setImageSrc] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false); // Alert
  const [showAlertMI, setShowAlertMI] = React.useState(false); // Alert FOR MISSING YOU
  const [showAlertAd, setShowAlertAD] = React.useState(false); // Alert
  const [showAlertUnpost, setShowAlertUnpost] = React.useState(false); // Alert Unpost
  const [showAlertdelAD, setShowAlertDelad] = React.useState(false); // Alert Unpost
  const [showAlertdelInfo, setShowAlertDelInfo] = React.useState(false); // Alert Unpost
  const [showAlertDelConAd, setShowAlertDelConad] = React.useState(false); // Alert Unpost
  const [showAlertDel, setShowAlertDel] = React.useState(false); // Alert Delete Item
  const [showAlert2, setShowAlert2] = React.useState(false); // Alert Confirm Post
  const [showAlertEditDone, setShowAlertEditDone] = React.useState(false); // Alert
  const [showAlertDelCon, setShowAlertDelCon] = React.useState(false); // Alert Confirmation to Delete the selected Item
  const [showAlertUnP, setShowAlertUnP] = React.useState(false); // Alert Confirmation to Unpost the selected Item
  const [ConfirmUpdate, setShowAlertCOnfirmUpdate] = React.useState(false); // Alert Confirmation to Update the selected Item
  const [viewItem, setViewPost] = React.useState(false); // Confirmation for posting item
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [submittedVariants, setSubmittedVariants] = useState([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [uploadedImages, setUploadedImages] = useState({});
  const [shopData, setShopData] = useState(null);
  const [shopAds, setShopAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopItem, setShopProducts] = useState("");
  const [editableVariants, setEditableVariants] = useState({}); // Track editable states for each variant
  const [currentVariantIndex, setCurrentVariantIndex] = useState(null);
  const [adName, setAdName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageSrcAd, setImageSrcAd] = useState("");
  const [imageSrcAds, setImageSrcAds] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  //mali ako huhu pinagsamasama ko mga to di ko matrack minsan kong anong modal, alert, etc yung may kulang HAHAHAHHUHU
  const fetchUserProfileAndShop = async () => {
    setLoading(true);

    try {
      // Get the current authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Authentication error:", authError.message);
        setError(authError.message);
        return;
      }

      if (user) {
        console.log("Current user:", user);

        // Fetch shop data for the current user
        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id, shop_name, shop_Rating, shop_Ads")
          .eq("owner_Id", user.id);

        if (shopError) {
          console.error("Shop fetch error:", shopError.message);
          setError(shopError.message);
          return;
        }

        if (shops && shops.length > 0) {
          setShopData(shops);
          console.log("Fetched shops:", shops);

          const selectedShopId = shops[0].id;
          setSelectedShopId(selectedShopId);

          const ads = shops[0].shop_Ads || [];

          const updatedAds = await Promise.all(
            ads.map(async (ad) => {
              console.log("Ad ID:", ad.id);
              console.log("Ad Image Path:", ad.ad_Image);

              let imageUrl = null;

              if (ad.ad_Image) {
                const fullImagePath = ad.ad_Image.startsWith(
                  "shop_profile/shop_Ads/"
                )
                  ? ad.ad_Image
                  : `shop_profile/shop_Ads/${ad.ad_Image}`;

                const { data: publicUrlData, error: publicUrlError } =
                  supabase.storage
                    .from("shop_profile")
                    .getPublicUrl(fullImagePath);

                if (publicUrlError) {
                  console.error(
                    "Error fetching ad URL:",
                    publicUrlError.message
                  );
                }

                console.log("Generated image URL:", publicUrlData?.publicUrl);

                imageUrl = publicUrlData?.publicUrl || null;
              }

              return {
                id: ad.id,
                ad_Name: ad.ad_Name,
                imageUrl, // Use the fetched or existing image URL
              };
            })
          );

          console.log("Updated Ads with URLs:", updatedAds); // Log the updated ads
          setShopAds(updatedAds); // Set the updated ads

          // get the total sold items


          const { data: products, error: productError } = await supabase
            .from("shop_Product")
            .select(
              "id, item_Name, item_Description, item_Tags, item_Rating, item_Orders, item_Variant, is_Post, item_Category"
            )
            .eq("shop_Id", selectedShopId);

          if (productError) {
            console.error("Product fetch error:", productError.message);
            setError(productError.message);
          } else {
            console.log("Fetched products for the shop:", products);

            // Process products to calculate total quantity and fetch image paths for each variant
            const updatedProducts = await Promise.all(
              products.map(async (product) => {
                const totalQuantity = product.item_Variant?.reduce(
                  (total, variant) =>
                    total +
                    variant.sizes?.reduce(
                      (sizeTotal, size) => sizeTotal + parseInt(size.qty || 0),
                      0
                    ),
                  0
                );

                // Extract the first variant for external use
                const firstVariant = product.item_Variant?.[0] || null;

                // Fetch the public URL for the first variant's image
                const { data: firstVariantUrlData } = supabase.storage
                  .from("product")
                  .getPublicUrl(firstVariant?.img || "");

                const updatedFirstVariant = firstVariant
                  ? {
                    ...firstVariant,
                    imagePath: firstVariantUrlData?.publicUrl || null,
                  }
                  : null;

                // Fetch image paths for all variants
                const updatedVariants = await Promise.all(
                  product.item_Variant?.map(async (variant) => {
                    const { data: publicUrlData } = supabase.storage
                      .from("product")
                      .getPublicUrl(variant.img || "");
                    return {
                      ...variant,
                      imagePath: publicUrlData?.publicUrl || null,
                    };
                  }) || []
                );

                // Return the updated product with the first variant accessible separately
                return {
                  ...product,
                  firstVariant: updatedFirstVariant,
                  item_Variant: updatedVariants,
                  totalQuantity,
                };
              })
            );

            setShopProducts(updatedProducts);
          }
        } else {
          console.warn("No shops found for the user.");
          setError("No shops found for the current user.");
        }
      } else {
        console.warn("No user is signed in");
        setError("No user is signed in");
      }
    } catch (error) {
      console.error("Error fetching shop and product data:", error);
      setError("An error occurred while fetching shop data.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  useEffect(() => {
    fetchUserProfileAndShop();
  }, []);
  //count sold items
  const [soldItems, setSoldItems] = useState(0);

  const [productReviews, setProductReviews] = useState([]);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]); // Store all images
  const [isRevImage, setIsRevImage] = useState(false);

  // Close modal
  const closeRevImage = () => {
    setIsRevImage(false);
    setSelectedImages([]);
    setSelectedImageIndex(0);
  };

  // Show next image
  const showNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex < selectedImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Show previous image
  const showPrevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : selectedImages.length - 1
    );
  };

  const fetchProductReviews = async (productId) => {
    if (!productId) {
      console.error("No product ID provided.");
      return;
    }

    setLoading(true);

    try {
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select(
          `id, created_at, user_id, rating, comment, images, variant_name, size, is_edited, is_hidden, likes,
          profiles(full_name, profile_picture)`
        )
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Fetched reviews:", reviews);

      // Fetch public URLs for each image
      const updatedReviews = await Promise.all(
        reviews.map(async (review) => {
          let imagePaths = Array.isArray(review.images) ? review.images : [];

          const imageUrls = await Promise.all(
            imagePaths.map(async (imgPath) => {
              const { data } = supabase.storage
                .from("reviews")
                .getPublicUrl(imgPath);

              return data?.publicUrl || null;
            })
          );

          return {
            ...review,
            images: imageUrls.filter(Boolean),
            totalLikes: review.likes?.length || 0,
          };
        })
      );

      console.log("Updated Reviews with Image URLs:", updatedReviews);
      setProductReviews(updatedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      setProductReviews([]);
    } finally {
      setLoading(false);
    }
  };

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
  const handleUpdate = async (variantIndex) => {
    try {
      const updatedVariant = selectedItem.item_Variant[variantIndex];

      const { error } = await supabase
        .from("shop_Product")
        .update({ item_Variant: selectedItem.item_Variant })
        .eq("id", selectedItem.id);

      if (error) {
        console.error("Error updating the variant:", error);
        alert("Failed to update the variant.");
      } else {
        setShowAlertEditDone(true);
        setTimeout(() => setShowAlertEditDone(false), 3000);
        toggleEdit(variantIndex); // Exit edit mode after successful update
      }
    } catch (error) {
      console.error("Error updating the variant:", error);
    }
  };
  const handleDeleteSize = (variantIndex, sizeIndex) => {
    setSelectedItem((prevItem) => {
      const updatedVariants = [...prevItem.item_Variant];

      // Remove the size at the specified index
      updatedVariants[variantIndex].sizes = updatedVariants[
        variantIndex
      ].sizes.filter((_, index) => index !== sizeIndex);

      return {
        ...prevItem,
        item_Variant: updatedVariants,
      };
    });
    setShowAlertDelInfo(true);
    setTimeout(() => setShowAlertDelInfo(false), 3000);
  };

  const PostNotify = async () => {
    try {
      // Check if selected item has variants with size info
      if (
        !selectedItem.item_Variant ||
        selectedItem.item_Variant.length === 0 ||
        selectedItem.item_Variant.some(
          (variant) => !variant.sizes || variant.sizes.length === 0
        )
      ) {
        setShowAlertMI(true);
        setTimeout(() => setShowAlertMI(false), 3000);
        return;
      }

      // Update the `is_Post` status
      const { error } = await supabase
        .from("shop_Product")
        .update({ is_Post: true })
        .eq("id", selectedItem.id);

      if (error) throw error;

      const { data: updatedItem, error: fetchError } = await supabase
        .from("shop_Product")
        .select("*")
        .eq("id", selectedItem.id)
        .single();

      if (fetchError) throw fetchError;

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

      fetchUserProfileAndShop();

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
      fetchUserProfileAndShop();

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
      const { error: cartError } = await supabase
        .from("cart")
        .delete()
        .eq("prod_id", selectedItem.id);

      if (cartError) throw cartError;

      const { error: ordersError } = await supabase
        .from("orders")
        .delete()
        .eq("prod_num", selectedItem.id);

      if (ordersError) throw ordersError;

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
  const handleCloseModal = async () => {
    // Close all modals and reset data
    setIsModalOpenItem(false);
    setViewPost(false);
    setSelectedItem(null);
    // Fetch updated shop and product details
    await fetchUserProfileAndShop();
  };
  const handleCloseModalAD = async () => {
    // Close all modals and reset data
    setIsModalOpenAds(false);
    setImageSrcAd(null);
    setImageSrcAds(null);
    setImageFile(null);
    setAdName("");
    document.getElementById("imageInput").value = "";
    // Fetch updated shop and product details
    await fetchUserProfileAndShop();
  };
  const handlePostItem = () => {
    setShowAlert2(true);
  };
  const handleUpdateItem = (variantIndex) => {
    setCurrentVariantIndex(variantIndex);
    setShowAlertCOnfirmUpdate(true);
  };
  const handleConfirmedUpdate = async () => {
    if (currentVariantIndex !== null) {
      const updatedVariants = [...selectedItem.item_Variant];
      const currentVariant = updatedVariants[currentVariantIndex];

      // Validate sizes
      const hasInvalidFields = currentVariant.sizes.some(
        (size) => !size.size.trim() || size.qty <= 0 || size.price <= 0
      );

      if (hasInvalidFields) {
        setconfirmField(true);
        setTimeout(() => setconfirmField(false), 3000);
        return;
      }

      // Proceed with the update if validation passes
      try {
        const success = await handleUpdate(currentVariantIndex);
        if (success) {
          toggleEdit(currentVariantIndex);
        }
        setShowAlertCOnfirmUpdate(false);
      } catch (error) {
        console.error("Error during update:", error);
      }
    }
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
  const handleViewClick = async (item) => {
    setSelectedItem(item);
    console.log("Viewing item:", item);
    if (item.id) {
      await fetchProductReviews(item.id);
      await fetchSoldItems(item.id);
    }
  };
  const fetchSoldItems = async (productId) => {
    try {
      const { data: completedOrders, error } = await supabase
        .from("orders")
        .select("quantity")
        .eq("prod_num", productId)
        .eq("shop_id", selectedShopId) // Ensure it's for the current shop
        .eq("shipping_status", "Completed");

      if (error) {
        console.error("Error fetching sold items:", error.message);
        setSoldItems(0); // Default to 0 if an error occurs
        return;
      }

      // Calculate total sold quantity
      const totalSold =
        completedOrders?.reduce(
          (total, order) => total + (order.quantity || 0),
          0
        ) || 0;

      setSoldItems(totalSold); // Update the UI
    } catch (error) {
      console.error("Unexpected error fetching sold items:", error);
      setSoldItems(0);
    }
  };

  const handleAddSize = (variantIndex) => {
    const updatedVariants = [...selectedItem.item_Variant];
    updatedVariants[variantIndex].sizes = [
      ...(updatedVariants[variantIndex].sizes || []),
      { size: "", qty: 0, price: 0 },
    ];
    setSelectedItem({
      ...selectedItem,
      item_Variant: updatedVariants,
    });
  };
  const handleDeleteAd = async () => {
    if (!selectedAd) return;

    try {
      const { data: shopData, error: fetchError } = await supabase
        .from("shop")
        .select("shop_Ads")
        .eq("id", selectedShopId)
        .single();

      if (fetchError) {
        console.error("Error fetching shop ads:", fetchError);
        alert("Failed to fetch shop ads.");
        return;
      }

      const updatedAds = shopData.shop_Ads.filter(
        (ad) => ad.id !== selectedAd.id
      );

      const { error: updateError } = await supabase
        .from("shop")
        .update({ shop_Ads: updatedAds })
        .eq("id", selectedShopId);

      if (updateError) {
        console.error("Error deleting ad:", updateError);
        alert("Failed to delete the ad.");
        return;
      }

      setIsViewModalOpen(false);
      await fetchUserProfileAndShop();

      setShowAlertDelad(true);
      setTimeout(() => setShowAlertDelad(false), 3000);
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };
  const [showMaxalert, setShowAlertDeladMax] = React.useState(false);
  //Shops ads images
  const handleAddAd = async () => {
    if (!imageSrcAd || !adName) {
      setShowAlertAD(true);
      setTimeout(() => setShowAlertAD(false), 3000);
      return;
    }

    setLoading(true);

    try {
      // Fetch existing ads for the current shop
      const { data: shopData, error: fetchError } = await supabase
        .from("shop")
        .select("shop_Ads")
        .eq("id", selectedShopId)
        .single();

      if (fetchError) {
        console.error("Error fetching shop ads:", fetchError);
        setError(fetchError.message);
        return;
      }

      const existingAds = shopData?.shop_Ads || [];

      // Check if the number of ads exceeds the limit
      if (existingAds.length >= 5) {
        setShowAlertDeladMax(true);
        setTimeout(() => setShowAlertDeladMax(false), 3000);
        return;
      }

      // Upload the selected image to Supabase storage
      const fileName = `${Date.now()}-${imageFile.name}`; // Unique file name
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("shop_profile/shop_Ads")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Image upload error:", uploadError.message);
        alert("Failed to upload image.");
        return;
      }

      // Get the public URL for the uploaded image
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from("shop_profile/shop_Ads")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Error fetching public URL:", urlError.message);
        alert("Failed to fetch image URL.");
        return;
      }

      const imageUrl = publicUrlData?.publicUrl;

      if (!imageUrl) {
        alert("Failed to get image URL.");
        return;
      }

      const newAd = {
        id: Date.now(),
        ad_Name: adName,
        ad_Image: imageUrl,
      };

      const updatedAds = [...existingAds, newAd];

      // Update the shop_Ads field in the database
      const { error: updateError } = await supabase
        .from("shop")
        .update({ shop_Ads: updatedAds })
        .eq("id", selectedShopId);

      if (updateError) {
        console.error("Error adding ad:", updateError.message);
        alert("Failed to add ad.");
      } else {
        setAdAdsAlert(true);
        setTimeout(() => setAdAdsAlert(false), 3000);

        setImageSrcAd(null);
        setImageSrcAds(null);
        setImageFile(null);
        setAdName("");
        document.getElementById("imageInput").value = "";
        handleCloseModal();
        setIsModalOpenAds(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  const handleAddAds = () => {
    //ADS
    setIsModalOpenAds(true);
  };
  const handleViewAd = (ad) => {
    setSelectedAd(ad);
    setIsViewModalOpen(true);
  };
  //Ads image appear in the div
  const handleImagePick = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      console.log("Preview URL:", previewUrl);
      setImageSrcAd(previewUrl); // Show preview
      setImageSrcAds(URL.createObjectURL(file)); // Show preview
    } else {
      setImageSrcAd("");
      setImageSrcAds(null);
    }
  };
  const cancelImage = () => {
    setImageSrcAds(null);
    document.getElementById("imageInput").value = "";
  };

  //isCustomizable?
  const [isAlertUpdateCustomize, setShowIsCustomize] = useState(false);
  const [isCustomizable, setIsCustomizable] = useState(false);
  useEffect(() => {
    if (!selectedItem || !selectedItem.id) return;

    const fetchCustomizationStatus = async () => {
      const { data, error } = await supabase
        .from("shop_Product")
        .select("isCustomizable")
        .eq("id", selectedItem.id)
        .single();

      if (error) {
        console.error("Error fetching isCustomizable:", error.message);
      } else {
        setIsCustomizable(data?.isCustomizable || false);
      }
    };

    fetchCustomizationStatus();
  }, [selectedItem]);

  const handleToggle = async (event) => {
    if (!selectedItem || !selectedItem.id) return;

    const newValue = event.target.checked;

    const { error } = await supabase
      .from("shop_Product")
      .update({ isCustomizable: newValue })
      .eq("id", selectedItem.id);

    if (error) {
      console.error("Error updating isCustomizable:", error.message);
    } else {
      setIsCustomizable(newValue);
      setShowIsCustomize(true);
      setTimeout(() => setShowIsCustomize(false), 3000);
    }
  };
  const [confirmField, setconfirmField] = React.useState(false);
  return (
    <div className="h-full w-full  bg-slate-300 px-2 md:px-10 lg:px-20 ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>

      <div className="w-full h-full bg-slate-300 ">
        <div className=" text-2xl md:text-4xl text-custom-purple font-semibold p-2 py-3">
          Manage Products
        </div>
        <div className="h-[550px] mt-2 mb-20 md:mt-0 md:mb-0   p-2 w-full overflow-hidden rounded-md shadow-md bg-slate-100">
          <div className=" w-full flex gap-5 place-items-center justify-between mb-2">
            <div className="md:flex md:gap-2  text-slate-400">
              <div
                className={
                  activeTabs === "manage-products"
                    ? "bg-custom-purple text-white  px-4 py-2 rounded-md"
                    : "bg-gray-300 text-slate-700  px-4 py-2 rounded-md"
                }
                onClick={() => setActiveTab("manage-products")}
              >
                <span className=" rounded-md duration-300 cursor-pointer  ">
                  Manage Products
                </span>
              </div>
              <div
                className={
                  activeTabs === "manage-adds"
                    ? "bg-custom-purple text-white  px-4 py-2 rounded-md"
                    : "bg-gray-300 text-slate-700  px-4 py-2 rounded-md"
                }
                onClick={() => setActiveTab("manage-adds")}
              >
                <span className=" rounded-md duration-300 cursor-pointer  ">
                  Manage Ads
                </span>
              </div>
            </div>

            {/* <div className="flex  md:gap-2 text-slate-50 rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 glass p-1 md:p-2">
              Create New Design
              <box-icon type="solid" color="#e2e8f0" name="palette"></box-icon>
            </div> */}
          </div>
          <div className="w-full h-full custom-scrollbar bg-slate-200 shadow-inner rounded-md p-4 overflow-y-scroll overflow-x-auto">
            {activeTabs === "manage-products" && (
              <div className="mb-8 min-w-[800px]">
                <div className="flex justify-between">
                  <h2 className="text-xl md:text-3xl text-custom-purple iceland-regular mt-3 md:mt-0 font-bold mb-4 flex place-items-center gap-1 md:gap-5">
                    Manage Product
                    <div
                      className="tooltip tooltip-bottom "
                      data-tip=" Once the Item is added, it doesn't mean it automatically added to the shop preview, but it will
                        only store to this page, you can still have the decision to post it. "
                    >
                      <button className="hover:bg-slate-600 glass bg-custom-purple p-1 text-sm px-2 text-white duration-300 shadow-md place-items-center flex rounded-full">
                        <FontAwesomeIcon icon={faInfo} />
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
                            {item.firstVariant.imagePath ? (
                              <img
                                src={item.firstVariant.imagePath}
                                alt={`Image of ${item.item_Name}`}
                                className="shadow-lg shadow-slate-400 bg-slate-100 h-full w-full object-cover rounded-md"
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
                  <div className="">
                    <div className="w-full h-full justify-items-center content-center">
                      <div className="mt-10">
                        <img
                          src={sadEmote}
                          alt="Success Emote"
                          className="object-contain h-[100px]  rounded-lg p-1 drop-shadow-customViolet"
                        />
                      </div>
                      <div className="">
                        {" "}
                        <h1 className="text-2xl text-custom-purple iceland-regular font-extrabold">
                          No Products
                        </h1>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTabs === "manage-adds" && (
              <div className="mb-8 min-w-[800px]">
                <div className="flex justify-between">
                  <h2 className="text-xl md:text-3xl text-custom-purple iceland-regular mt-3 md:mt-0 font-bold mb-4 flex place-items-center gap-1 md:gap-5">
                    Manage Shop Advertisement
                    <div
                      className="tooltip tooltip-bottom"
                      data-tip=" Maximum advertisement photos to be posted is 3 to 5 Images only."
                    >
                      <button className="hover:bg-slate-600 glass p-1 text-sm px-2 text-white bg-custom-purple duration-300 shadow-md place-items-center flex rounded-full">
                        <FontAwesomeIcon icon={faInfo} />
                      </button>
                    </div>
                  </h2>
                  <div className="flex gap-2 justify-center place-items-center">
                    <div
                      onClick={handleAddAds}
                      className="bg-custom-purple text-sm p-1 md:px-2 text-slate-50 cursor-pointer duration-200 hover:scale-95 rounded-sm"
                    >
                      Add photo Ads
                    </div>
                  </div>
                </div>

                <div className="flex font-semibold justify-between px-2 text-slate-800">
                  <li className="list-none">Ads Photo</li>
                  <li className="list-none">Name</li>
                  <li className="list-none pr-4">Action</li>
                </div>
                {shopData.length > 0 &&
                  shopData[0].shop_Ads &&
                  shopData[0].shop_Ads.length > 0 ? (
                  shopData[0].shop_Ads.map((ad, index) => {
                    return (
                      <div
                        key={index}
                        className="p-2 mt-2 text-slate-900 h-16 shadow-sm w-full bg-slate-100 flex justify-between gap-2"
                      >
                        <div className="h-full w-20 place-items-center justify-center flex">
                          {`${index + 1}`}
                        </div>
                        <div className="h-full w-24 flex justify-center items-center bg-slate-200 rounded-md">
                          {ad.ad_Image ? (
                            <img
                              src={ad.ad_Image}
                              alt={ad.ad_Name || "Advertisement"}
                              className="h-full w-full object-cover rounded-md shadow-lg"
                              sizes="100%"
                            />
                          ) : (
                            <p>No image available</p>
                          )}
                        </div>
                        <div className="h-full w-full place-items-center flex justify-center">
                          {ad.ad_Name || "No Name"}
                        </div>
                        <div
                          onClick={() => handleViewAd(ad)}
                          className="h-full w-24 bg-slate-500 place-content-center items-center rounded-md font-semibold
            hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95 flex"
                        >
                          View
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="">
                    <div className="w-fill h-full justify-items-center content-center">
                      <div className="mt-10">
                        <img
                          src={sadEmote}
                          alt="Success Emote"
                          className="object-contain  h-[100px] rounded-lg p-1 drop-shadow-customViolet"
                        />
                      </div>
                      <div className="">
                        {" "}
                        <h1 className="text-2xl text-custom-purple iceland-regular font-extrabold">
                          No Advertisement yet.
                        </h1>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="bg-slate-600 w-full h-9"></div>
        </div>
      </div>
      {/* Add Advertisement Modal */}
      {isModalOpenAds && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white relative rounded-md p-5 h-auto w-full md:w-3/4 pt-2 lg:w-1/2 m-2 md:m-0 auto">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md">
              {" "}
            </div>
            <div className="font-medium text-slate-800 py-2 w-full flex justify-between place-items-center  ">
              <span className="font-bold text-[20px] md:text-2xl">
                Add Shop Advertisement Photo
              </span>
              <FontAwesomeIcon icon={faImages} />
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
                    value={adName}
                    onChange={(e) => setAdName(e.target.value)}
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
              <div className="w-full h-2/3 md:w-full md:h-64 bg-custom-purple shadow-md glass rounded-sm p-2">
                <div className="bg-slate-100 h-[200px] md:h-full rounded-sm shadow-md place-items-center flex place-content-center">
                  {imageSrcAds ? (
                    <img
                      src={imageSrcAds}
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
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
                onClick={handleCloseModalAD}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleAddAd}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-dots loading-sm"></span>
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ALLERTS */}
      {showAlert && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-44 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
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
      {showAlertMI && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-10 -z-10 justify-items-center content-center">
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
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple  text-slate-50 font-semibold rounded-md"
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
            <span>Item can't be post, there's missing size information</span>
          </div>
        </div>
      )}
      {showAlertAd && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain h-40 w-40 rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-info shadow-md flex items-center p-4 bg-gradient-to-r from-violet-500 to-fuchsia-900 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>

            <span>Please Complete all the Field!</span>
          </div>
        </div>
      )}
      {showAlertDel && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-44 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain h-40 w-40 rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-red-600 text-slate-50 font-semibold rounded-md"
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
          <div className="absolute -top-44 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain h-40 w-40 rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-gradient-to-r from-violet-500 to-fuchsia-900 text-slate-50 font-semibold rounded-md"
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
            <span>Item is Unposted in Dripstr.</span>
          </div>
        </div>
      )}
      {showMaxalert && (
        <div className="md:bottom-5   w-auto px-10 bottom-10 z-50 right-0 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-white font-semibold rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Advertisement limit reach, 5 ad images only.</span>
          </div>
        </div>
      )}
      {/* EDIT, VIEW, POST, REMOVE ITEM */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(false)}
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900 bg-opacity-75 p-2"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg  md:w-2/3 h-3/4 -mt-14 md:-mt-10 md:h-2/2 w-full "
          >
            <div className=" bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 w-full rounded-t-md  " />
            <div className=" flex justify-between items-center pr-2 ">
              <div className="text-custom-purple font-semibold iceland-regular text-2xl p-2">
                ITEM INFORMATION
              </div>
              <div className="h-full w-auto md:w-2/12 flex items-center justify-center">
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

            <div className="h-full bg-white w-full relative  p-2 md:flex gap-2">
              <div className="w-full md:w-4/12 h-auto md:h-full relative">
                <div className=" w-[200px] md:w-full place-self-center h-[200px] rounded-sm bg-slate-100 p-2 shadow-inner shadow-custom-purple mb-2">
                  <img
                    src={selectedItem.firstVariant.imagePath}
                    alt={`Image of ${selectedItem.item_Name}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className=" w-auto h-auto relative p-2 rounded-sm ">
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
                  {/* Set to customize */}
                  <div className="text-sm text-center mt-2 text-slate-800 bg-slate-100 shadow-sm shadow-slate-500 p-1 rounded">
                    <div>Allow customize request?</div>
                    <div className="mt-1 flex justify-center items-center gap-1">
                      no{" "}
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={isCustomizable}
                        onChange={handleToggle}
                      />{" "}
                      yes
                    </div>
                  </div>
                </div>

                <div
                  onClick={handleCloseModal}
                  className="bg-custom-purple w-full md:bottom-2 scale-95 p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-90 duration-300 cursor-pointer absolute text-black font-semibold hover:bg-primary-color"
                >
                  CLOSE
                </div>
              </div>
              <div className="bg-slate-900 w-full mt-10 md:mt-0 h-full overflow-hidden relative overflow-y-scroll custom-scrollbar">
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
                        <div className="text-sm h-[100px] overflow-hidden overflow-y-scroll text-primary-color font-semibold">
                          {selectedItem.item_Description}
                        </div>
                      </div>
                      <div className="mt-2 flex gap-1">
                        <label className="text-sm text-slate-800 font-semibold">
                          Category:
                        </label>
                        <div className="text-sm text-primary-color font-semibold">
                          {selectedItem.item_Category}
                        </div>
                      </div>
                      <div className="mt-2 mb-2">
                        <label className="text-sm text-slate-800 font-semibold">
                          Item Tags:
                        </label>
                        <div className="text-sm text-white font-normal  flex flex-wrap gap-2">
                          {selectedItem.item_Tags?.map((tag) => (
                            <span
                              key={tag}
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
                      <div className="justify-center right-5 place-items-center gap-2 top-20 absolute">
                        <div className="text-primary-color text-2xl font-bold text-center">
                          {soldItems}
                        </div>
                        <label className="text-sm text-slate-800 font-semibold">
                          Sold
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
                        {variant.imagePath ? (
                          <img
                            src={variant.imagePath}
                            alt={`Image of ${variant.variant_Name}`}
                            className="h-16 w-16 shadow-md object-cover rounded-md"
                          />
                        ) : (
                          <div className="h-20 w-20 bg-gray-200 flex items-center justify-center rounded-md">
                            <span className="text-gray-500 text-sm">
                              No Image
                            </span>
                          </div>
                        )}
                        <div className="text-lg font-bold text-slate-800">
                          {variant.variant_Name}
                        </div>
                        <div className="flex gap-2">
                          {editableVariants[variantIndex] && (
                            <button
                              onClick={() => handleAddSize(variantIndex)}
                              className="bg-primary-color hover:bg-primary-dark text-white text-sm px-3 py-1 rounded-md"
                            >
                              Add Size
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (editableVariants[variantIndex]) {
                                // Save changes
                                handleUpdateItem(variantIndex);
                              } else {
                                // Enter edit mode
                                toggleEdit(variantIndex);
                              }
                            }}
                            className={`${editableVariants[variantIndex]
                              ? "bg-green-500"
                              : "bg-blue-500"
                              } text-white text-sm px-3 py-1 rounded-md`}
                          >
                            {editableVariants[variantIndex] ? "Save" : "Edit"}
                          </button>
                        </div>
                      </div>

                      {/* Sizes, Quantities, and Prices */}
                      {variant.sizes?.length > 0 ? (
                        variant.sizes?.map((size, sizeIndex) => (
                          <div key={`${variantIndex}-${sizeIndex}`}>
                            <div className="flex justify-between items-center mb-2 border-b pb-2">
                              <div>
                                <label className="text-slate-900 text-sm font-medium">
                                  Size:
                                </label>
                                <input
                                  className={`bg-slate-100 text-sm text-slate-700 font-medium p-1 rounded-sm w-20 ml-2 ${editableVariants[variantIndex]
                                    ? "bg-slate-300"
                                    : "bg-slate-100"
                                    }`}
                                  type="text"
                                  required
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
                                  className={`bg-slate-100 text-sm text-slate-700 font-medium p-1 rounded-sm w-20 ml-2 ${editableVariants[variantIndex]
                                    ? "bg-slate-300"
                                    : "bg-slate-100"
                                    }`}
                                  type="number"
                                  value={size.qty}
                                  required
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
                                  className={`bg-slate-100 text-sm text-slate-700 font-medium p-1 rounded-sm w-20 ml-2 ${editableVariants[variantIndex]
                                    ? "bg-slate-300"
                                    : "bg-slate-100"
                                    }`}
                                  type="number"
                                  value={size.price}
                                  required
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
                              <div>
                                {editableVariants[variantIndex] && (
                                  <button
                                    onClick={() =>
                                      handleDeleteSize(variantIndex, sizeIndex)
                                    }
                                    className="text-red-600"
                                  >
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500">
                          No sizes available for this variant
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="h-auto w-full bg-slate-200 overflow-y-auto p-4">
                  {productReviews.length > 0 ? (
                    productReviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white p-3 mb-2 rounded shadow"
                      >
                        {/* Profile Image & Name */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex gap-1 items-center">
                            <img
                              src={
                                review.profiles?.profile_picture || successEmote
                              }
                              alt="User Profile"
                              className="h-10 w-10 object-cover rounded-full border border-gray-300"
                            />
                            <p className="font-semibold">
                              {review.profiles?.full_name || "Customer"}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 mt-2 text-gray-600">
                            {review.totalLikes}{" "}
                            <FontAwesomeIcon icon={faThumbsUp} />
                          </div>
                        </div>

                        {/* Review Details */}
                        <p className="text-sm text-gray-600">
                          {new Date(review.created_at).toLocaleString()}
                        </p>
                        <p className="font-semibold">
                          Rating: <FontAwesomeIcon icon={faStar} />{" "}
                          {review.rating}
                        </p>
                        <p className="text-gray-800 text-sm">
                          {review.comment}
                        </p>

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {review.images.map((img, index) =>
                              img ? (
                                <img
                                  key={index}
                                  src={img}
                                  onClick={() => {
                                    setSelectedImages(review.images);
                                    setSelectedImageIndex(index);
                                    setIsRevImage(true);
                                  }}
                                  alt="Review Image"
                                  className="h-20 w-20 object-cover cursor-pointer rounded-md border border-gray-300"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              ) : null
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {isRevImage && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
              onClick={closeRevImage}
            >
              <div
                className="relative p-2 bg-white rounded-lg shadow-lg max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  className="absolute top-1 right-1 text-slate-950 bg-white rounded-full p-1 px-2.5"
                  onClick={closeRevImage}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>

                {/* Left Arrow */}
                {selectedImages.length > 1 && (
                  <button
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      showPrevImage();
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                )}

                {/* Display Image */}
                <img
                  src={selectedImages[selectedImageIndex]}
                  alt="Full Image"
                  className="w-full h-auto object-contain rounded"
                />

                {/* Right Arrow */}
                {selectedImages.length > 1 && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      showNextImage();
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Post Variant Confirmation */}
          {showAlert2 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 flex justify-center items-center"
            >
              <div className="bg-white p-5 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-slate-800">
                  Are you sure you want to post this Item{" "}
                  <span className="font-semibold text-primary-color">
                    {selectedItem.item_Name}
                  </span>
                  ?
                </h2>
                <div className="flex w-full gap-2 justify-between">
                  <button
                    onClick={handleClosePostItem}
                    className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={PostNotify}
                    className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Unpost Variant Confirmation */}
          {showAlertUnP && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 flex justify-center items-center"
            >
              <div className="bg-white p-5 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 text-center">
                  Are you sure you want to unpost this <br />
                  <span className="font-semibold text-primary-color">
                    {selectedItem.item_Name}
                  </span>
                  ?
                </h2>
                <div className="flex w-full gap-2 justify-between">
                  <button
                    onClick={handleClosePostItem}
                    className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={unPostNotify}
                    className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Delete Variant Confirmation */}
          {showAlertDelCon && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 flex justify-center items-center"
            >
              <div className="bg-white p-5 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 text-center">
                  Are you sure you want to Delete this <br />
                  <span className="font-semibold text-primary-color">
                    {selectedItem.item_Name}
                  </span>
                  ?
                </h2>
                <div className="flex w-full gap-2 justify-between">
                  <button
                    onClick={handleClosePostItem}
                    className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={DeleteItem}
                    className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Delete Variant Confirmation */}
          {ConfirmUpdate && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 flex justify-center items-center"
            >
              <div className="bg-white p-5 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 text-center">
                  Are you sure you want to Update this <br />
                  <span className="font-semibold text-primary-color">
                    {selectedItem.item_Name}
                  </span>
                  ?
                </h2>
                <div className="flex w-full gap-2 justify-between">
                  <button
                    onClick={() => {
                      const updatedVariants = [...selectedItem.item_Variant];
                      if (currentVariantIndex !== null) {
                        updatedVariants[currentVariantIndex].sizes =
                          updatedVariants[currentVariantIndex].sizes.filter(
                            (size) =>
                              size.size.trim() !== "" ||
                              size.qty > 0 ||
                              size.price > 0
                          );
                      }
                      setSelectedItem({
                        ...selectedItem,
                        item_Variant: updatedVariants,
                      });

                      setShowAlertCOnfirmUpdate(false);
                      setCurrentVariantIndex(null);
                      toggleEdit(currentVariantIndex);
                    }}
                    className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmedUpdate}
                    className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alert Update Variant Confirmation */}
          {showAlertEditDone && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100"
            >
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
                <span>Item {selectedItem.item_Name} Updated in the Shop</span>
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
      {adAdsAlert && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
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
            <span>Advertisement photo is Added in the Shop.</span>
          </div>
        </div>
      )}
      {isViewModalOpen && selectedAd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-lg p-5 w-full max-w-md shadow-lg relative">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>
            <h2 className="text-xl font-bold text-custom-purple mb-3">
              {selectedAd.ad_Name}
            </h2>
            <div className="w-full h-64 flex justify-center items-center bg-slate-200 rounded-md">
              <img
                src={selectedAd.ad_Image}
                alt={selectedAd.ad_Name || "Advertisement"}
                className="w-full h-full object-contain rounded-md shadow-md"
              />
            </div>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
              >
                Close
              </button>

              <button
                onClick={handleDeleteAd}
                className="duration-200  hover:bg-red-700  text-slate-900 bg-red-500 px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlertdelAD && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-red-600 text-slate-50 font-semibold rounded-md"
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
            <span>Advertisement is Successfully Deleted.</span>
          </div>
        </div>
      )}
      {showAlertdelInfo && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-40 right-0 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-red-600 text-slate-50 font-semibold rounded-md"
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
            <span>Item variant information deleted</span>
          </div>
        </div>
      )}
      {confirmField && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-40 right-0 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Sizes for variant is required.</span>
          </div>
        </div>
      )}
      {/* Update to allow customize */}
      {isAlertUpdateCustomize && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-40 right-0 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
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
            <span>Allow customize request updated.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
