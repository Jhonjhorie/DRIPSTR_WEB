import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/logoBlack.png";
import logoName from "../../../assets/logoName.png";
import DateTime from "../Hooks/DateTime";
import { supabase } from "../../../constants/supabase";
import { BarChart } from "@mui/x-charts/BarChart";

function PrintSales() {
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  const Dripstr = "partnered with Dripstr";
  const TotalReturnItems = "20";
  const PossitiveFB =
    '"Great outfit my Girlfriend will fall in love to me over and over again wearing this T-shirt is so comfy❤️‍🔥💌"';
  const NegativeFB =
    '"So small the outfit is pretty, but the size URGH... Stresss"';
  const [shopName, setShopName] = useState("");
  const [shopRating, setShopRating] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalReturnItems, setTotalReturnItems] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [totalCompletedOrders, setTotalCompletedOrders] = useState(0);

  useEffect(() => {
    const fetchOrdersByMonth = async () => {
      try {
        setLoading(true);

        const { data: userData, error: authError } =
          await supabase.auth.getUser();
        if (authError) {
          console.error("Auth Error:", authError.message);
          setLoading(false);
          return;
        }

        const user = userData?.user;
        if (!user) {
          console.error("No user is signed in.");
          setLoading(false);
          return;
        }

        const { data: shop, error: shopError } = await supabase
          .from("shop")
          .select("id, shop_name, shop_Rating")
          .eq("owner_Id", user.id)
          .single();

        if (shopError) {
          console.error("Error fetching shop:", shopError.message);
          setLoading(false);
          return;
        }

        if (!shop) {
          console.warn("No shop found for this user.");
          setLoading(false);
          return;
        }

        setShopName(shop.shop_name || "Unknown Shop");
        setShopRating(shop.shop_Rating || 0);
        const shopId = shop.id;

        const { data: orders, error: orderError } = await supabase
          .from("orders")
          .select("id, quantity, total_price, shipping_status, date_of_order")
          .eq("shop_id", shopId)
          .order("date_of_order", { ascending: true });

        if (orderError) {
          console.error("Error fetching orders:", orderError.message);
          setLoading(false);
          return;
        }

        if (!orders || orders.length === 0) {
          console.warn("No orders found for this shop.");
          setMonthlyOrders([]);
          setLoading(false);
          return;
        }

        console.log("Fetched Orders:", orders);

        let totalIncome = 0;
        let totalOrders = 0;
        let totalCompletedOrders = 0;
        let totalReturnItems = 0;
        const dataByMonth = {};

        orders.forEach((order) => {
          if (!order.date_of_order) return;

          const orderDate = new Date(order.date_of_order);
          if (isNaN(orderDate)) return;

          const monthYearKey = `${orderDate.getFullYear()}-${String(
            orderDate.getMonth() + 1
          ).padStart(2, "0")}`;

          if (!dataByMonth[monthYearKey]) {
            dataByMonth[monthYearKey] = {
              totalOrders: 0,
              totalSales: 0,
              totalReturns: 0,
            };
          }

          dataByMonth[monthYearKey].totalOrders += order.quantity || 0;

          // Count only completed orders
          if (order.shipping_status === "Completed") {
            totalCompletedOrders += order.quantity || 0;

            // Subtract 3% from the final price for completed orders
            const discountedPrice = (order.total_price || 0) * 0.97; // Deduct 3%
            dataByMonth[monthYearKey].totalSales += discountedPrice;
            totalIncome += discountedPrice;
          }

          if (order.shipping_status === "Returned") {
            dataByMonth[monthYearKey].totalReturns += order.quantity || 0;
            totalReturnItems += order.quantity || 0;
          }

          totalOrders += order.quantity || 0;
        });

        const formattedData = Object.keys(dataByMonth).map((month) => ({
          month,
          ...dataByMonth[month],
        }));

        console.log("Formatted Monthly Data:", formattedData);
        setMonthlyOrders(formattedData);
        setTotalIncome(totalIncome);
        setTotalOrders(totalOrders);
        setTotalCompletedOrders(totalCompletedOrders); //Set total completed orders
        setTotalReturnItems(totalReturnItems);
      } catch (error) {
        console.error("Error in fetchOrdersByMonth:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersByMonth();
  }, []);

  // Process Data for the Bar Chart
  const monthlyOrderLabels = monthlyOrders.map((entry) => entry.month); // Month names
  const pData = monthlyOrders.map((entry) => entry.totalOrders); // Orders per month
  const uData = monthlyOrders.map((entry) => entry.totalSales); // Income per month
  const rData = monthlyOrders.map((entry) => entry.totalReturns); // Returns per month

  return (
    <div>
      {/* Onclick show print modal */}
      <div
        className="w-full h-full text-slate-800"
        onClick={() => document.getElementById("print").showModal()}
      >
        Print Report
      </div>

      {/* MODAL PRINT SALES STATISTICS */}
      <dialog id="print" className="modal h-f">
        <div className="modal-box rounded-md bg-slate-950  glass h-[100%]">
          {/* Main Content */}
          <div className="h-[91%] w-full overflow-hidden bg-slate-100 rounded-sm">
            <div ref={contentRef} className="p-2 h-full w-full">
              {/* Header Section */}
              <div className="flex justify-between items-center h-20 w-full p-2">
                {/* Logo */}
                <div className="h-[70%] w-[30%] m-2">
                  <img
                    src={logoName}
                    alt="Shop Logo"
                    className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className="h-[75%] w-[10%] mr-2">
                  <img
                    src={logo}
                    alt="Shop Logo"
                    className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-0.5 rounded-full bg-custom-purple"></div>
              <div className="text-xl text-center text-t">
                {new Date().toLocaleString("en-US", { month: "long" })} report for <span className="text-custom-purple">{shopName || "N/A"}</span>
              </div>
              <div className="h-44">
                <BarChart
                  className="text-sm"
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
              {/* Shop Details */}
              <div className="w-full h-72 p-5 -mt-10 mb-5">
                <div className="text-black text-sm">
                  {loading ? (
                    <p className="text-center text-lg font-bold">Loading...</p>
                  ) : (
                    <>
                      <div className="flex gap-2 items-center">
                        <div className="h-3 w-3 bg-teal-500 "></div>
                        <div className="p-1 text-slate-950 text-sm font-semibold">
                          Monthly Orders:{" "}
                          <span className="font-normal">
                            {totalOrders ?? 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="h-3 w-3 bg-blue-500"></div>
                        <div className="p-1 text-slate-950 text-sm font-semibold">
                          Total Orders Completed:{" "}
                          <span className="font-normal">
                            {totalCompletedOrders ?? 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="h-3 w-3 bg-violet-500"></div>
                        <div className="p-1 text-slate-950 text-sm font-semibold ">
                          No. of Return Items:{" "}
                          <span className="font-normal">
                            {totalReturnItems ?? 0}
                          </span>
                        </div>
                      </div>
                      <div className="p-1 text-slate-950 text-sm font-semibold">
                        Shop Name:{" "}
                        <span className="font-normal">{shopName || "N/A"}</span>
                      </div>
                      <div className="p-1 text-slate-950 text-sm font-semibold">
                        Shop rating:{" "}
                        <span className="font-normal">
                          {shopRating ?? "N/A"}
                        </span>
                      </div>
                      <div className="p-1 text-slate-950 text-sm font-semibold">
                        Total Income:{" "}
                        <span className="font-normal">{totalIncome ?? 0}</span>
                      </div>

                      <div className="p-1 text-slate-950 text-sm font-semibold">
                        Most Positive Feedback: <br />
                        <span className="font-normal">
                          {PossitiveFB || "No feedback yet"}
                        </span>
                      </div>
                      <div className="p-1 text-slate-950 text-sm font-semibold mb-10">
                        Least Likely Feedback: <br />
                        <span className="font-normal">
                          {NegativeFB || "No feedback yet"}
                        </span>
                      </div>
                      <div className="p-1 text-slate-950 text-sm font-semibold">
                        <DateTime />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-0.5 rounded-full bg-custom-purple"></div>

              {/* Footer */}
              <div className="w-full z-10 bg-slate-400">
                <div className="text-sm text-slate-600 bottom-5 right-6 absolute">
                  {Dripstr}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="modal-action flex z-20 mt-4 justify-start h-[4%]">
            <button
              className="h-12 text-custom-purple font-semibold hover:bg-custom-purple hover:duration-300 glass w-28 bg-slate-100 rounded-md flex justify-center items-center gap-2"
              onClick={handlePrint}
            >
              <box-icon type="solid" color="#563A9C" name="printer"></box-icon>
              Print
            </button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default PrintSales;
