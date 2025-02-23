import SideBar from "../Component/Sidebars";
import logo from "../../../assets/shop/shoplogo.jpg";
import boy from "../../../assets/shop/sample2.jpg";
import girl from "../../../assets/shop/erica.jpg";
import drip from "../../../assets/shop/drip.png";
import logo2 from "../../../assets/shop/logoWhite.png";
import "../../../assets/shop/fonts/font.css";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import PrintSales from "../Component/PrintSales";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import React, { useState, useEffect } from "react";
const data = [
  { label: "T-Shirt Alucard", value: 400 },
  { label: "Ben Brief", value: 300 },
  { label: "Bini Shirt", value: 300 },
  { label: "Bini Maloi", value: 20 },
  { label: "Xdinary Heroes", value: 278 },
  { label: "Guitar Sticker", value: 189 },
];

const uData = [
  4000, 3000, 2000, 2780, 1890, 2390, 3490, 5000, 2000, 278, 1890, 239,
];
const pData = [
  2400, 1398, 800, 3908, 4800, 3800, 4300, 700, 2000, 280, 190, 390,
];
const rData = [120, 1113, 98, 8, 80, 800, 300, 300, 20, 28, 10, 90];
const xLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

function MerchantDashboard() {
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [productCounts, setProductCounts] = useState([]); // Initialize with an empty array
  const [totalProductCount, setTotalProductCount] = useState(0); // Initialize with 0
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopRating, setShopRating] = useState(0);
  const [walletrevenue, setWalletData] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch the current user
        const { data: userData, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.error("Authentication error:", authError.message);
          setError(authError.message);
          setLoading(false);
          return;
        }

        const user = userData.user;
        if (!user) {
          console.log("No user is signed in");
          setError("No user is signed in");
          setLoading(false);
          return;
        }

        console.log("Current user:", user);

        // Fetch shop data for the current user
        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id, shop_name, shop_Rating")
          .eq("owner_Id", user.id);

        if (shopError) {
          console.error("Error fetching shops:", shopError.message);
          setError(shopError.message);
        } else if (shops && shops.length > 0) {
          setShopData(shops);
          console.log("Fetched shops:", shops);

          // Calculate and set the average shop rating
          const averageRating =
            shops.reduce((acc, shop) => acc + (shop.shop_Rating || 0), 0) /
            shops.length;
          setShopRating(averageRating || 0);

          // Fetch all products for the shops
          const { data: products, error: productError } = await supabase
            .from("shop_Product")
            .select("shop_Id");

          if (productError) {
            console.error("Error fetching products:", productError.message);
            setError(productError.message);
          } else {
            // Count products by shop
            const productCountByShop = shops.map((shop) => ({
              shopId: shop.id,
              productCount: products.filter(product => product.shop_Id === shop.id).length,
            }));

            console.log("Product counts by shop:", productCountByShop);
            setProductCounts(productCountByShop);


            const totalProductCount = productCountByShop.reduce((acc, shop) => acc + shop.productCount, 0);
            console.log("Total product count:", totalProductCount);
            setTotalProductCount(totalProductCount);
          }
        } else {
          console.log("No shops found for the user");
          setError("No shops found for the user");
        }
        // for wallet
        const { data: wallet, error: walletError } = await supabase
        .from("merchant_Wallet")
        .select("revenue")
        .eq("owner_ID", user.id)
        .single();
       
      if (walletError) {
        console.error("Error fetching wallet:", walletError.message);
        setError(walletError.message);
      } else {
        console.log("User's wallet:", wallet);
        setWalletData(wallet || { revenue: "0.00" });
         
        
      }

      } catch (err) {
        console.error("Unexpected error:", err.message);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run once on mount
  const formatRevenue = (revenue) => {
    const amount = parseFloat(revenue) || 0;
  
    return amount >= 1000
      ? (amount / 1000).toFixed(1).replace(".0", "") + "k"
      : amount.toLocaleString("en-PH", { minimumFractionDigits: "" });
  };
  return (
    <div className="h-full w-full bg-slate-300 pb-5 ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      {/* 1st Container -- Logo Shop -- Notification */}
      <div className="h-auto w-full md:flex gap-2  place-items-center p-2 align-middle ">
        <div className=" h-full w-full p-2  md:pl-10">
          <div className=" text-3xl md:text-5xl font-bold text-custom-purple md:pl-5 mb-5 flex justify-start">
            Dashboard
          </div>
          <div className="flex flex-wrap w-full justify-center  h-auto gap-2 md:gap-5 ">
            {/* BOXES STATS */}
            <div className="bg-custom-purple glass rounded-md h-20 md:h-28 w-40 md:w-44 p-1  ">
              <div className="text-white text-xl iceland-regular ">
                {" "}
                ORDERS{" "}
              </div>
              <div
                className="text-slate-950 text-4xl ml-5 md:ml-0 md:text-6xl iceland-regular "
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {" "}
                212{" "}
              </div>
              <div className="absolute bottom-0 right-0 blur-[2px] -z-10">
                <box-icon
                  name="package"
                  type="solid"
                  size="70px"
                  color="white"
                  className=""
                ></box-icon>
              </div>
            </div>
            <div className="bg-custom-purple glass rounded-md h-20 md:h-28 w-40 md:w-44 p-1">
              <div className="text-white text-xl iceland-regular">
                {" "}
                PRODUCTS{" "}
              </div>
              <div
                className="text-slate-950 text-4xl ml-5 md:ml-0 md:text-6xl iceland-regular "
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {" "}
                {totalProductCount}{" "}
              </div>
              <div className="absolute bottom-0 right-0 blur-[2px] -z-10 ">
                <box-icon
                  type="solid"
                  name="category"
                  size="70px"
                  color="white"
                  className=""
                ></box-icon>
              </div>
            </div>
            <div className="bg-custom-purple glass rounded-md h-20 md:h-28 w-40 md:w-44 p-1">
              <div className="text-white text-xl iceland-regular">
                {" "}
                FOLLOWERS{" "}
              </div>
              <div
                className="text-slate-950 text-4xl ml-5 md:ml-0 md:text-6xl iceland-regular "
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {" "}
                1,5k{" "}
              </div>
              <div className="absolute bottom-0 right-0 blur-[2px] -z-10">
                <box-icon
                  name="group"
                  type="solid"
                  size="70px"
                  color="#F3F3E0"
                  className=""
                ></box-icon>
              </div>
            </div>
            <div
             onClick={() => navigate("/shop/MerchantWallet")}
            className="bg-[#F09319] hover:scale-95 duration-200 hover:bg-yellow-500 cursor-pointer glass rounded-md h-20 md:h-28 w-40 md:w-44 p-1">
              <div className="text-white text-xl iceland-regular">
                {" "}
                TOT INCOME{" "}
              </div>
              <div
                className="text-slate-950 text-4xl ml-5 md:ml-0 md:text-6xl iceland-regular "
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {" "}
                <span className="text-3xl">₱</span>{formatRevenue(walletrevenue?.revenue || "0.00")}
              </div>
              <div className="absolute bottom-0 right-0 blur-[2px] -z-10">
                <box-icon
                  type="solid"
                  name="coin-stack"
                  size="70px"
                  color="white"
                ></box-icon>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-custom-purple glass rounded-md md:h-[200px] h-[170px] w-[70%] sm:w-[50%] md:w-[35%] lg:w-[25%] md:mr-12 lg:mr-16  p-2 mb-2 md:mb-0 ">
          <div className="bg-slate-100 h-full w-auto rounded-md">

            <div className="text-slate-900 font-semibold text-2xl md:text-5xl pt-[25%]  text-center">
              {" "}
              {shopRating}{" "}
              <box-icon
                type="solid"
                size="30px"
                color="#F09319"
                name="star"
              ></box-icon>{" "}
              <br />
              <div className="text-slate-800 text-xl"> SHOP RATING </div>
            </div>


          </div>
        </div>
      </div>

      {/* 2nd Container */}
      <div className="w-full lg:h-[325px]  p-2 lg:px-16 gap-3  md:flex  ">
        <div className="w-full md:w-[65%] lg:w-[78%] h-[400px] rounded-md lg:flex gap-3">
          <div></div>
          {/* Bar chart */}
          <div className="lg:w-[60%] md:[80%] mb-2 w-auto bg-slate-200 glass shadow-md p-1.5 rounded-md h-[70%] md:h-[75%]">
            <div className="w-full bg-slate-50 h-full rounded-md place-items-center">
              <BarChart
                series={[
                  {
                    data: pData,
                    label: "Orders",
                    id: "pvId",
                    yAxisId: "leftAxisId",
                  },
                  {
                    data: uData,
                    label: "Income",
                    id: "uvId",
                    yAxisId: "rightAxisId",
                  },
                  {
                    data: rData,
                    label: "Return Items",
                    id: "ruvId",
                    yAxisId: "leftAxisId",
                  },
                ]}
                xAxis={[{ data: xLabels, scaleType: "band" }]}
                yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
                rightAxis="rightAxisId"
              />
            </div>
          </div>
          {/* Pie chart for most sell product */}
          <div className="lg:w-[40%] w-full h-[75%] p-1.5 shadow-md mt-2 sm:mt-0 rounded-md bg-slate-200 ">
            <div className="flex justify-between w-full">
              <div className="text-slate-800 ">Top-seller</div>
              <box-icon type="solid" name="star" color="#F09319"></box-icon>
            </div>

            <div className="bg-slate-100 h-auto w-full flex rounded-md place-content-center place-items-center">
              <PieChart
                width={500}
                height={265}
                series={[
                  {
                    data: data,
                    innerRadius: 30,
                    outerRadius: 110,
                    paddingAngle: 5,
                    cornerRadius: 4,
                    startAngle: -45,
                    endAngle: 225,
                    cx: 150,
                    cy: 150,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        {/* Notificatoin div */}
        <div className="w-full md:w-[35%] shadow-md lg:w-[22%] h-[380px] mb-24 sm:mb-0 md:h-[610px] mt-52 md:mt-0 lg:h-[300px] bg-slate-400 glass rounded-md p-1.5">
          <div className="flex justify-between align-middle">
            <div className="text-slate-800 text-xl">Notification</div>
            <div>
              <box-icon type="solid" name="bell" color="#563A9C"></box-icon>
            </div>
          </div>

          <div className="h-[92%] md:h-[95%] lg:h-[90%] rounded-sm w-full  bg-slate-100 overflow-y-scroll custom-scrollbar p-1">
            {/* Sample Order Notif */}
            <div className="w-full h-12 hover:bg-primary-color cursor-pointer bg-slate-400  hover:duration-200 glass mb-1 flex rounded-sm p-1">
              <div className="rounded-md bg-white h-full w-10">
                <img
                  src={girl}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="">
                <div className=" text-slate-900 pl-2"> Erica mae </div>
                <div className=" text-slate-800 text-sm pl-2 -mt-1">
                  {" "}
                  Just order an item.{" "}
                </div>
              </div>
            </div>
            <div className="w-full h-12  hover:bg-primary-color cursor-pointer bg-slate-400 hover:duration-200 glass  mb-1 flex rounded-sm p-1">
              <div className="rounded-md bg-white h-full w-10">
                <img
                  src={boy}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="">
                <div className=" text-slate-900 pl-2"> Paolo </div>
                <div className=" text-slate-800 text-sm pl-2 -mt-1">
                  {" "}
                  Just order an item.{" "}
                </div>
              </div>
            </div>
            <div className="w-full h-12 hover:bg-primary-color cursor-pointer bg-violet-950 hover:duration-200 glass  mb-1 flex rounded-sm p-1">
              <div className="rounded-md bg-primary-color h-full w-10">
                <img
                  src={drip}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="">
                <div className=" text-slate-100 pl-2"> Dripstr </div>
                <div className=" text-slate-300 text-sm pl-2 -mt-1">
                  {" "}
                  New Updates...{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3rd Container */}
      <div className="  gap-2 h-24 -mt-20 sm:-mt-0 w-full mb-32 md:mb-0 px-3 lg:px-14 lg:flex">
        <div className=" h-auto lg:w-[65%] w-full py-2 md:px-5 rounded-md flex gap-1 lg:gap-5 justify-center lg:justify-start">
          <div
            onClick={() => navigate("/shop/MerchantProducts")}
            className="bg-slate-100 h-10 w-48 pl-1 md:p-2 rounded-md hover:bg-slate-400 cursor-pointer
           hover:duration-300 glass shadow-md flex place-items-center justify-center  "
          >
            <box-icon
              name="add-to-queue"
              type="solid"
              color="#563A9C"
            ></box-icon>
            <div className="text-slate-800 font-semibold h-full w-full md:pl-2 md:py-1 py-2.5 md:text-[15px]  text-xs ">
              Manage product
            </div>
          </div>
        <div
            onClick={() => navigate("/shop/MerchantVouchers")}
            className="bg-slate-100 h-10 w-48 md:p-2 rounded-md hover:bg-slate-400 cursor-pointer
           hover:duration-300 glass shadow-md flex place-items-center justify-center  "
          >
            <box-icon
              type="solid"
              name="purchase-tag-alt"
              color="#563A9C"
            ></box-icon>
            <div className="text-slate-800 font-semibold h-full w-full md:pl-2 py-3 md:py-0 md:text-[15px]  text-[11px] ">
              Manage Vouchers{" "}
            </div>
          </div>
          <div
            className="bg-slate-100 h-10 w-48 pl-1 md:p-2 rounded-md hover:bg-slate-400 cursor-pointer
           hover:duration-300 glass shadow-md flex place-items-center justify-center  "
          >
            <box-icon
              name="add-to-queue"
              type="solid"
              color="#563A9C"
            ></box-icon>
            <div className="text-slate-800 font-semibold h-full w-full md:pl-2 md:py-1 py-2.5 md:text-[15px]  text-xs ">
              <PrintSales></PrintSales>
            </div>
          </div>
        </div>
        <div className="bg-custom-purple rounded-md duration-300 shadow-md h-full w-full lg:w-[35%] hover:scale-95 cursor-pointer p-2 place-items-center flex justify-center ">
          <div className="iceland-regular text-slate-200">
            Create Design with
          </div>
          <div className="h-20 -mt-3 md:mt-0 w-56 md:w-64 md:h-24 lg:w-full rounded-md p-2  ">
            <img
              src={logo2}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MerchantDashboard;
