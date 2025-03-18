import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/logoBlack.png";
import logoName from "../../../assets/logoName.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import DateTime from "../Hooks/DateTime";
import cat from "../../../../src/assets/emote/success.png"
import { supabase } from "../../../constants/supabase";

function Reports() {
    const [shopData, setShopData] = useState(null);
    const [reportedShops, setReportedShops] = useState([]);
    const [reportedProducts, setReportedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMonthRating, setCurrentMonthRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

  // Fetch shop details
  useEffect(() => {
    const fetchUserProfileAndShop = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("No user signed in");

        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id, shop_name")
          .eq("owner_Id", user.id);

        if (shopError) throw shopError;
        if (shops.length === 0) throw new Error("No shop found for this user");

        setShopData(shops[0]);
        await fetchCurrentMonthRating(shops[0].id);
      } catch (error) {
        console.error("Error fetching shop:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndShop();
  }, []);

  // Fetch reported shops
  useEffect(() => {
    if (!shopData?.id) return;

    const fetchReportedShops = async () => {
      try {
        const { data, error } = await supabase
          .from("reported_Calma")
          .select("id, created_at, reason, action, shop_Name, shop_Id")
          .eq("shop_Id", shopData.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReportedShops(data);
      } catch (error) {
        console.error("Error fetching reported shops:", error.message);
      }
    };

    fetchReportedShops();
  }, [shopData?.id]);

  // Fetch reported products
  useEffect(() => {
    if (!shopData?.id) return;

    const fetchReportedProducts = async () => {
      try {
        const { data: products, error: productError } = await supabase
          .from("shop_Product")
          .select("id, product_name")
          .eq("shop_Id", shopData.id);

        if (productError) throw productError;
        if (products.length === 0) return;

        const productIds = products.map((product) => product.id);

        const { data: reports, error: reportError } = await supabase
          .from("reported_Chinese")
          .select("id, created_at, reason, action, prod_Name, prod_Id")
          .in("prod_Id", productIds)
          .order("created_at", { ascending: false });

        if (reportError) throw reportError;
        setReportedProducts(reports);
      } catch (error) {
        console.error("Error fetching reported products:", error.message);
      }
    };

    fetchReportedProducts();
  }, [shopData?.id]);

  const fetchCurrentMonthRating = async (shopId) => {
    try {
      // Get first day of current month
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
  
      // Get all products for this shop
      const { data: products, error: productError } = await supabase
        .from("shop_Product")
        .select("id")
        .eq("shop_Id", shopId);
  
      if (productError) throw productError;
  
      if (products && products.length > 0) {
        // Get all reviews for these products in current month
        const { data: reviews, error: reviewError } = await supabase
          .from("reviews")
          .select("rating")
          .in(
            "product_id",
            products.map(product => product.id)
          )
          .eq("is_hidden", false)
          .gte("created_at", firstDay)
          .lte("created_at", lastDay);
  
        if (reviewError) throw reviewError;
  
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = (totalRating / reviews.length).toFixed(1);
          setCurrentMonthRating(averageRating);
          setTotalReviews(reviews.length);
        } else {
          setCurrentMonthRating(0);
          setTotalReviews(0);
        }
      }
    } catch (error) {
      console.error("Error fetching current month rating:", error);
    }
  };

  // Update the main return statement to include scrollable sections
  return (
    <div className="mt-5 bg-slate-300 w-full md:p-10 p-5 rounded-lg flex flex-col h-[calc(100vh-100px)]">
      <h1 className="text-slate-900 text-center font-semibold text-lg md:text-xl mb-4">
        REPORTS RECEIVED
      </h1>

      {/* Fixed Current Month Rating Section */}
      <div className="bg-white rounded-md shadow-md p-4 mb-5 flex-shrink-0">
        <h2 className="text-slate-900 font-semibold text-lg md:text-xl mb-2">
          Current Month Performance
        </h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-gray-600 text-sm mb-1">Average Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {currentMonthRating > 0 ? currentMonthRating : "No"}
              </span>
              {currentMonthRating > 0 && (
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={faCheckCircle} 
                    className="text-yellow-500 text-xl"
                  />
                  <span className="text-sm text-gray-500 ml-2">
                    from {totalReviews} reviews
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-sm mb-1">
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
            {currentMonthRating === 0 && (
              <p className="text-sm text-gray-500">
                ratings this month
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Reports Container */}
      <div className="overflow-y-auto flex-1 space-y-5">
        {/* Shop Reports Section */}
        <div className="bg-white rounded-md shadow-md p-4">
          <h2 className="text-slate-900 font-semibold text-md md:text-lg mb-2 sticky top-0 bg-white">
            Shop Reported
          </h2>
          {reportedShops.length === 0 ? (
            <div className="place-items-center p-5">
              <img src={cat} alt="No reports" className="mx-auto" />
              <p className="text-gray-700 text-center">No reports for your shop.</p>
            </div>   
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-slate-700 text-white">
                    <th className="p-2 text-left">Date</th>
                
                    <th className="p-2 text-left">Action</th>
                    <th className="p-2 text-left">Shop Name</th>
                    <th className="p-2 text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {reportedShops.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-gray-100">
                      <td className="p-2 text-sm">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                    
                      <td className="p-2 text-sm">{report.action || "Pending"}</td>
                      <td className="p-2 text-sm">{report.shop_Name || "Unknown"}</td>
                      <td className="p-2 text-sm">{report.reason || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Products Reports Section */}
        <div className="bg-white rounded-md shadow-md p-4">
          <h2 className="text-slate-900 font-semibold text-md md:text-lg mb-2 sticky top-0 bg-white">
            Reported Products
          </h2>
          {reportedProducts.length === 0 ? (
            <div className="place-items-center p-5">
              <img src={cat} alt="No reports" className="mx-auto" />
              <p className="text-gray-700 text-center">No reports for your shop products.</p>
            </div>   
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-slate-700 text-white">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Reason</th>
                    <th className="p-2 text-left">Action</th>
                    <th className="p-2 text-left">Product Name</th>
                  </tr>
                </thead>
                <tbody>
                  {reportedProducts.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-gray-100">
                      <td className="p-2 text-sm">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-sm">{report.reason || "N/A"}</td>
                      <td className="p-2 text-sm">{report.action || "Pending"}</td>
                      <td className="p-2 text-sm">{report.prod_Name || "Unknown"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
