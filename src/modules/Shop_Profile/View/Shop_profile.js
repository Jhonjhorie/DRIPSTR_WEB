import React, { useState, useEffect } from "react";
import SideBar from "../Component/Sidebars";
import logo from "../../../assets/shop/shoplogo.jpg";
import logo1 from "../../../assets/shop/s1.jpg";
import logo2 from "../../../assets/shop/s2.jpg";
import logo3 from "../../../assets/shop/s3.jpg";
import logo4 from "../../../assets/shop/s4.jpg";
import starrate from "../../../assets/images/others/fillfull.png";
import blackLogo from "../../../assets/images/blackLogo.png";
import sample1 from "../../../assets/images/samples/5.png";
import sample2 from "../../../assets/images/samples/10.png";
import sample3 from "../../../assets/images/samples/3.png";
import sample4 from "../../../assets/images/samples/4.png";
import sample5 from "../../../assets/images/samples/6.png";
import sample6 from "../../../assets/images/samples/7.png";
import sample7 from "../../../assets/images/samples/9.png";
import sample8 from "../../../assets/images/samples/11.png";
import sample9 from "../../../assets/images/samples/12.png";
import { supabase } from "../../../constants/supabase";

function Shop_profile() {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopItem, setShopProducts] = useState("");
  const [shopImageUrl, setShopImageUrl] = useState("");
  const [shopName, setShopName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shopAds, setShopAds] = useState([]);

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
          .select("id, shop_name, shop_Rating, shop_image, shop_Ads")
          .eq("owner_Id", user.id)

        if (shopError) {
          console.error("Shop fetch error:", shopError.message);
          setError(shopError.message);
          return;
        }
        if (error) {
          console.error("Error fetching shop image:", error.message);
          setErrorMessage("Unable to fetch shop image.");
          return;
        }

        if (shops) {
          console.log("Shop data:", shops);
          setShopImageUrl(shops[0]?.shop_image || "");
          setShopName(shops[0]?.shop_name || "");
        } else {
          console.warn("No shop data found for this user.");
          setErrorMessage("No shop image found.");
        }

        if (shops && shops.length > 0) {
          setShopData(shops);
          console.log("Fetched shops:", shops);

          const selectedShopId = shops[0].id; // Assuming the first shop is selected

          // Fetch ads for the selected shop
          const ads = shops[0].shop_Ads || []; // Correctly initialize `ads`

          const updatedAds = ads.map((ad) => {
            console.log("Ad ID:", ad.id); // Debugging
            console.log("Ad Image URL:", ad.ad_Image); // Debugging

            return {
              id: ad.id,
              ad_Name: ad.ad_Name,
              imageUrl: ad.ad_Image || "path/to/placeholder/image.jpg", // Use URL directly or add fallback
            };
          });

          console.log("Updated Ads with URLs:", updatedAds); // Log the updated ads
          setShopAds(updatedAds); // Set the updated ads

          // Fetch products for the selected shop
          const { data: products, error: productError } = await supabase
            .from("shop_Product")
            .select(
              "id, item_Name, item_Description, item_Tags, item_Rating, item_Orders, item_Variant, is_Post"
            )
            .eq("shop_Id", selectedShopId)
            .eq("is_Post", true);

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

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (shopAds.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shopAds.length);
      }, 3000); // Change ad every 3 seconds

      return () => clearInterval(interval);
    }
  }, [shopAds]);

  return (
    <div className="h-full w-full  bg-slate-300 px-2 ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      <div className="w-full h-auto bg-slate-300   gap-2 mx-auto py-5 ">
        <div className="w-full h-auto ">
          <div className="bg-slate-50 rounded-md p-3  mb-5">
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1/2 w-full rounded-sm shadow-md ">
              <div className="lg:flex w-[30%] h-[70%] place-items-center justify-center  ">
                <div className=" p-2 h-1/2 lg:h-[120px] w-1/2 lg:w-[120px]">
                  <div className="rounded-md bg-primary-color p-1 h-full w-full">
                    {shopImageUrl ? (
                      <img
                        src={shopImageUrl}
                        alt="Shop Profile"
                        className="drop-shadow-custom object-cover rounded-md h-full w-full"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span>Loading...</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className=" w-2/3 place-content-center place-items-center lg:place-items-start ">
                  {shopName ? (
                    <div className="text-slate-100 text-sm lg:text-lg font-semibold">
                      {" "}
                      {shopName}{" "}
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span>Loading...</span>
                    </div>
                  )}

                  <div className="text-slate-100 text-sm font-semibold flex place-items-center gap-2">
                    <div className="bg-green-400 h-2 w-2 rounded-md pl-4" />
                    <div className="text-sm font-normal"> Active </div>
                  </div>
                  <div className="text-slate-100 text-sm font-semibold flex gap-2 place-items-center">
                    <box-icon
                      name="group"
                      size="16px"
                      color="#FFFFFF"
                    ></box-icon>
                    <div className="text-sm font-normal">
                      {" "}
                      Followers: <a className="text-yellow-300">100k</a>
                    </div>
                  </div>
                  <div className="text-slate-100 text-sm font-semibold flex gap-2 place-items-center">
                    <box-icon
                      size="15px"
                      name="message-dots"
                      color="#FFFFFF"
                    ></box-icon>
                    <div className="text-sm font-normal">
                      {" "}
                      Chat response rating:{" "}
                      <a className="text-yellow-300">4.5%</a>{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-[30%]  flex">
                <div className=" h-full w-1/2 p-1 ">
                  <div className="border-slate-50 w-full p-1 h-full border-2 hover:bg-purple-700 duration-300 cursor-pointer rounded-sm flex justify-center place-items-center gap-3">
                    <box-icon
                      name="bookmark-alt-plus"
                      size="20px"
                      color="#FFFFFF"
                    ></box-icon>
                    <a className="text-white text-sm">Follow</a>
                  </div>
                </div>
                <div className=" h-full w-1/2 p-1">
                  <div className="border-slate-50 w-full p-1 h-full border-2 hover:bg-purple-700 duration-300 cursor-pointer rounded-sm flex justify-center place-items-center gap-3">
                    <box-icon
                      name="message-square-dots"
                      size="20px"
                      color="#FFFFFF"
                    ></box-icon>
                    <a className="text-white text-sm">Chat Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-2xl bg-slate-50 p-2 rounded-sm mx-auto">
            <div className="relative w-full h-80">
              {shopAds.map((ad, index) => (
                <div
                  key={ad.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={ad.imageUrl} 
                    alt={ad.ad_Name || "Ad image"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Dots for navigation */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center p-2">
                {shopAds.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 mx-1 rounded-full ${
                      index === currentIndex ? "bg-white" : "bg-gray-400"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-full  w-full   ">
          <div className="h-full  w-full mt-10 "></div>
          <div className="h-full pb-14 w-full md:px-10 px-2 py-5 rounded-md ">
            <div className="dropdown dropdown-bottom flex  justify-between gap-2 mt-2 place-items-center  ">
              <p className="font-semibold text-slate-800 flex gap-5 place-items-center iceland-regular text-3xl md:text-4xl  ">
                {" "}
                Shop products{" "}
              </p>

              <div className="flex place-items-center dropdown dropdown-bottom dropdown-end md:pr-10">
                <div className="text">filter items</div>
                <div
                  tabIndex={0}
                  role="button"
                  className="h-8 w-8 jus justify-center place-items-center flex rounded-md
            hover:bg-slate-900 hover:duration-300 bg-slate-700  m-1"
                >
                  <box-icon color="#FFFFFF" name="filter"></box-icon>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-sm z-[1] w-52 p-2 shadow"
                >
                  <li>
                    <a>Shirt</a>
                  </li>
                  <li>
                    <a>Brief</a>
                  </li>
                  <li>
                    <a>Boxers</a>
                  </li>
                  <li>
                    <a>Polo</a>
                  </li>
                  <li>
                    <a>Formal</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className=" justify-center mt-5 ">
              <div className="w-full justify-center  flex flex-wrap gap-2 md:gap-4">
                {shopItem.length > 0 ? (
                  shopItem.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className=" p-1 md:p-0 md:w-44 w-40 h- hover:scale-105 duration-200 rounded  shadow-lg bg-white group"
                      >
                        <div className="h-auto bg-slate-200 w-full relative justify-items-center">
                          <div className=" p-2 ">
                            {item.firstVariant.imagePath ? (
                              <img
                                src={item.firstVariant.imagePath}
                                alt={`Image of ${item.item_Name}`}
                                className="object-cover w-[150px] h-[170px]"
                                sizes="100%"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                                No Image
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="px-2 py-2">
                          <div className="font-bold text-slate-900 text-xl mb-2">
                            {item.item_Name}
                          </div>
                          <div className="flex w-full h-auto justify-between">
                            <p className="text-primary-color">₱100</p>
                            <div className="flex place-items-center ">
                              <div className="text-primary-color">4.1 </div>
                              <div>
                                <img
                                  src={starrate}
                                  alt="Placeholder image of a scenic landscape with mountains and a lake"
                                  className="w-[15px] h-[15px]"
                                />
                              </div>{" "}
                              | <div className=""> 0 sold </div>
                            </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop_profile;
