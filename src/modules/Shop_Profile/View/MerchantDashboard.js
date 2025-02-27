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

function MerchantDashboard() {
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [productCounts, setProductCounts] = useState([]); // Initialize with an empty array
  const [totalProductCount, setTotalProductCount] = useState(0); // Initialize with 0
  const [totalOrderCount, setTotalOrderCount] = useState(0); // Initialize with 0
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopRating, setShopRating] = useState(0);
  const [monthlyOrderLabels, setMonthlyOrderLabels] = useState([]);
  const [monthlyOrderData, setMonthlyOrderData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch the current user
        const { data: userData, error: authError } =
          await supabase.auth.getUser();

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
          setLoading(false);
          return;
        }

        if (!shops || shops.length === 0) {
          console.log("No shops found for the user");
          setError("No shops found for the user");
          setLoading(false);
          return;
        }

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
          .select("id, shop_Id")
          .in(
            "shop_Id",
            shops.map((shop) => shop.id)
          );

        if (productError) {
          console.error("Error fetching products:", productError.message);
          setError(productError.message);
          setLoading(false);
          return;
        }

        console.log("Fetched products:", products);

        // Count products by shop
        const productCountByShop = shops.map((shop) => ({
          shopId: shop.id,
          productCount: products.filter(
            (product) => product.shop_Id === shop.id
          ).length,
        }));

        console.log("Product counts by shop:", productCountByShop);
        setProductCounts(productCountByShop);

        const totalProductCount = productCountByShop.reduce(
          (acc, shop) => acc + shop.productCount,
          0
        );
        console.log("Total product count:", totalProductCount);
        setTotalProductCount(totalProductCount);

        let totalOrders = 0;
        let monthlyOrders = {};

        // Fetch total orders based on products
        if (products.length > 0) {
          const { data: orders, error: orderError } = await supabase
            .from("orders")
            .select("id, prod_num, date_of_order")
            .in(
              "prod_num",
              products.map((product) => product.id)
            );

          if (orderError) {
            console.error("Error fetching orders:", orderError.message);
            setError(orderError.message);
          } else {
            console.log("Fetched orders:", orders);
            totalOrders = orders.length;

            // Step 1: Get all unique years from the dataset
            let years = new Set();
            orders.forEach((order) => {
              const orderYear = new Date(order.date_of_order).getFullYear();
              years.add(orderYear);
            });

            // Step 2: Initialize all months for each year
            let monthlyOrders = {};
            let allMonths = [];

            years.forEach((year) => {
              for (let i = 0; i < 12; i++) {
                const month = new Date(year, i);
                const monthLabel = `${month.getFullYear()}-${month.toLocaleString(
                  "en-US",
                  { month: "short" }
                )}`;
                monthlyOrders[monthLabel] = 0;
                allMonths.push(monthLabel);
              }
            });

            // Step 3: Fill monthly order counts
            orders.forEach((order) => {
              const date = new Date(order.date_of_order);
              const monthLabel = `${date.getFullYear()}-${date.toLocaleString(
                "en-US",
                { month: "short" }
              )}`;

              if (monthlyOrders.hasOwnProperty(monthLabel)) {
                monthlyOrders[monthLabel]++;
              }
            });

            // Step 4: Sort months correctly
            const sortedMonths = allMonths.sort((a, b) => {
              const [yearA, monthA] = a.split("-");
              const [yearB, monthB] = b.split("-");

              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              return (
                yearA - yearB ||
                monthNames.indexOf(monthA) - monthNames.indexOf(monthB)
              );
            });

            // Step 5: Convert to arrays for the chart
            const monthlyOrderCounts = sortedMonths.map(
              (month) => monthlyOrders[month]
            );

            // Step 6: Set states
            setTotalOrderCount(totalOrders);
            setPData(monthlyOrderCounts);
            setMonthlyOrderLabels(sortedMonths);
            setMonthlyOrderData(monthlyOrderCounts);

            console.log("Final Monthly Orders:", monthlyOrders);
            console.log("Sorted Months:", sortedMonths);
            console.log("Monthly Order Data:", monthlyOrderCounts);
          }
        } else {
          console.log("No products found for the shops");
          setTotalOrderCount(0);
          setPData([]);
        }

        // Fetch wallet data
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

  const [walletrevenue, setWalletData] = useState(0);
  const formatRevenue = (revenue) => {
    const amount = parseFloat(revenue) || 0;

    return amount >= 1000
      ? (amount / 1000).toFixed(1).replace(".0", "") + "k"
      : amount.toLocaleString("en-PH", { minimumFractionDigits: "" });
  };

  const [pData, setPData] = useState([0]); // Orders data
  const [uData, setUData] = useState([0]); // Income data
  const [rData, setRData] = useState([0]); // Return items data
  const [xLabels, setXLabels] = useState(["Orders"]); // X-axis labels

  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const { data: userData, error: authError } =
          await supabase.auth.getUser();
        if (authError) {
          console.error("Authentication error:", authError.message);
          return;
        }

        const user = userData.user;
        if (!user) {
          console.log("No user is signed in");
          return;
        }

        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id")
          .eq("owner_Id", user.id);

        if (shopError || !shops || shops.length === 0) {
          console.error(
            "Error fetching shops:",
            shopError?.message || "No shops found"
          );
          return;
        }

        const { data: products, error: productError } = await supabase
          .from("shop_Product")
          .select("id")
          .in(
            "shop_Id",
            shops.map((shop) => shop.id)
          );

        if (productError || !products || products.length === 0) {
          console.error(
            "Error fetching products:",
            productError?.message || "No products found"
          );
          return;
        }

        const { data: incomeData, error: incomeError } = await supabase
          .from("orders")
          .select("total_price, date_of_order")
          .in(
            "prod_num",
            products.map((product) => product.id)
          )
          .eq("order_status", "Delivered");

        if (incomeError) {
          console.error("Error fetching income:", incomeError.message);
          return;
        }

        if (!incomeData || incomeData.length === 0) {
          console.log("No delivered orders found");
          setUData([]); // Reset chart data
          return;
        }

        // Step 1: Get all unique years from the dataset
        let years = new Set();
        incomeData.forEach((order) => {
          const orderYear = new Date(order.date_of_order).getFullYear();
          years.add(orderYear);
        });

        // Step 2: Initialize all months for each year
        let monthlyIncome = {};
        let allMonths = [];

        years.forEach((year) => {
          for (let i = 0; i < 12; i++) {
            const month = new Date(year, i);
            const monthLabel = `${month.getFullYear()}-${month.toLocaleString(
              "en-US",
              { month: "short" }
            )}`;
            monthlyIncome[monthLabel] = 0;
            allMonths.push(monthLabel);
          }
        });

        // Step 3: Fill monthly income data
        incomeData.forEach((order) => {
          const date = new Date(order.date_of_order);
          const monthLabel = `${date.getFullYear()}-${date.toLocaleString(
            "en-US",
            { month: "short" }
          )}`;
          if (monthlyIncome.hasOwnProperty(monthLabel)) {
            monthlyIncome[monthLabel] += (order.total_price || 0) * 0.97; // Deduct 1%
          }
        });

        // Step 4: Sort months correctly
        const sortedMonths = allMonths.sort((a, b) => {
          const [yearA, monthA] = a.split("-");
          const [yearB, monthB] = b.split("-");
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return (
            yearA - yearB ||
            monthNames.indexOf(monthA) - monthNames.indexOf(monthB)
          );
        });

        // Step 5: Convert to arrays for the chart
        const monthlyIncomeData = sortedMonths.map(
          (month) => monthlyIncome[month]
        );

        // Step 6: Update states
        setUData(monthlyIncomeData);
        setMonthlyOrderLabels(sortedMonths);

        console.log("Monthly Income Data:", monthlyIncomeData);
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };

    fetchIncome();
  }, []);

  const [topProduct, setTopProduct] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const { data: userData, error: authError } =
          await supabase.auth.getUser();
        if (authError) {
          console.error("Authentication error:", authError.message);
          return;
        }

        const user = userData.user;
        if (!user) {
          console.log("No user is signed in");
          return;
        }

        // Fetch the shop ID of the authenticated user
        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id")
          .eq("owner_Id", user.id);

        if (shopError || !shops || shops.length === 0) {
          console.error(
            "Error fetching shops:",
            shopError?.message || "No shops found"
          );
          return;
        }

        const shopId = shops[0].id; // Assuming the user has only one shop

        // Fetch completed orders for the user's shop
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("prod_num")
          .eq("order_status", "Delivered");

        if (ordersError) throw ordersError;

        if (!orders || orders.length === 0) {
          console.log("No completed orders found.");
          setChartData([]);
          return;
        }

        // Count occurrences of each product
        const productCount = {};
        orders.forEach((order) => {
          productCount[order.prod_num] =
            (productCount[order.prod_num] || 0) + 1;
        });

        const productIds = Object.keys(productCount);
        if (productIds.length === 0) {
          setChartData([]);
          return;
        }

        // Fetch product names and sort by order count in descending order
        const { data: products, error: productError } = await supabase
          .from("shop_Product")
          .select("id, item_Name, item_Variant")
          .in("id", productIds)
          .eq("shop_Id", shopId);

        if (productError) throw productError;

        // Map product names to order counts
        const sortedProducts = products
          .map((product) => {
            const variants = product.item_Variant || []; // Ensure it's an array
            const firstVariant = variants.length > 0 ? variants[0] : null;

            return {
              id: product.id,
              label: product.item_Name,
              value: productCount[product.id] || 0,
              image: firstVariant ? firstVariant.imagePath : null, 
            };
          })
          .sort((a, b) => b.value - a.value);

        console.log("Top Selling Products:", sortedProducts);

        // Update chart data
        setChartData(sortedProducts);
      } catch (err) {
        console.error("Error fetching top-selling products:", err);
      }
    };

    fetchTopSellingProducts();
  }, []);

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
                {totalOrderCount}{" "}
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
              className="bg-[#F09319] hover:scale-95 duration-200 hover:bg-yellow-500 cursor-pointer glass rounded-md h-20 md:h-28 w-40 md:w-44 p-1"
            >
              <div className="text-white text-xl iceland-regular">
                {" "}
                TOT INCOME{" "}
              </div>
              <div
                className="text-slate-950 text-4xl ml-5 md:ml-0 md:text-6xl iceland-regular "
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {" "}
                <span className="text-3xl">₱</span>
                {formatRevenue(walletrevenue?.revenue || "0.00")}
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
          {/* Bar chart */}
          <div className=" md:w-full mb-2 w-auto bg-slate-200 glass shadow-md p-1.5 rounded-md h-[70%] md:h-[75%]">
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
                xAxis={[{ scaleType: "band", data: monthlyOrderLabels }]}
                yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
                rightAxis="rightAxisId"
              />
            </div>
          </div>
        </div>
        {/* Notificatoin div */}
        <div className="w-full md:w-[35%] -mt-24 shadow-md lg:w-[30%] h-[380px]  sm:mb-0 md:h-[610px] md:mt-0 lg:h-[300px] bg-slate-400 glass rounded-md p-1.5">
          <div className="flex justify-between align-middle">
            <div className="text-slate-800 text-xl">Top Selling</div>
            <div>
              <box-icon type="solid" name="star" color="gold">
                {" "}
              </box-icon>
            </div>
          </div>

          <div className="mt-3 bg-white shadow-md rounded-md p-2">
            <ul>
              {chartData.length > 0 ? (
                chartData.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between text-slate-700 border-b py-2 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.label}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                          No Image
                        </div>
                      )}

                      <span className="text-sm">
                        {index + 1}. {item.label}
                      </span>
                    </div>

                    <span className="font-semibold text-slate-900">
                      {item.value} sold
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-center py-2">
                  No data available
                </li>
              )}
            </ul>
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
