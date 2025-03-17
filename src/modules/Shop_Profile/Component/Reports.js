import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/logoBlack.png";
import logoName from "../../../assets/logoName.png";
import DateTime from "../Hooks/DateTime";
import cat from "../../../../src/assets/emote/success.png"
import { supabase } from "../../../constants/supabase";

function Reports() {
    const [shopData, setShopData] = useState(null);
    const [reportedShops, setReportedShops] = useState([]);
    const [reportedProducts, setReportedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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


  return (
     <div className="mt-5 bg-slate-300 w-full md:p-10 p-5 rounded-lg">
      <h1 className="text-slate-900 text-center font-semibold text-lg md:text-xl mb-4">
        REPORTS RECEIVED
      </h1>

      {/* Reported Shops Section */}
      <div className="bg-white rounded-md shadow-md p-2">
        <h2 className="text-slate-900 font-semibold text-md md:text-lg mb-2">
          Shop Reported
        </h2>
        {reportedShops.length === 0 ? (
             <div className="place-items-center p-5">
             <img src={cat} />
              <p className="text-gray-700">No reports for your shop.</p>
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

      {/* Reported Products Section */}
      <div className="bg-white rounded-md shadow-md mt-5 p-2">
        <h2 className="text-slate-900 font-semibold text-md md:text-lg mb-2">
          Reported Products
        </h2>
        {reportedProducts.length === 0 ? (
             <div className="place-items-center p-5">
             <img src={cat} />
              <p className="text-gray-700">No reports for your shop products.</p>
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
  );
}

export default Reports;
