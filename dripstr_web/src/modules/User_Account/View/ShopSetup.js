import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";

const shop = [{ label: "Shop", path: "/shop/MerchantCreate" }];

const Shop = () => {
  const [isArtist, setIsMerchant] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUserStatus = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error(
            "Error fetching user:",
            userError?.message || "No user found"
          );
          return;
        }

        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("isMerchant, isArtist")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          return;
        }

        if (isMounted) {
          setIsMerchant(profiles?.isArtist === true);
        }

        const { data: shop, error: shopError } = await supabase
          .from("shop")
          .select("is_Approved")
          .eq("owner_Id", user.id)
          .single();

        if (shopError) {
          console.error("Error fetching shop:", shopError.message);
          return;
        }

        if (isMounted) {
          setIsApproved(shop?.is_Approved === true);
          setIsDeclined(shop?.is_Approved === false);
          
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserStatus();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmount
    };
  }, []);

  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full ">  
      <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 px-9">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-800 mb-6">
            Become a Seller on DRPSTR
          </h1>
          <p className="text-lg text-gray-600">
            Join DRPSTR’s thriving community of sellers and expand your business
            reach with ease. Here’s everything you need to know to get started.
          </p>
        </div>

        {/* Benefits Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Why Sell on DRPSTR?
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card bg-white shadow-md p-4">
              <h3 className="font-semibold text-gray-800">Reach Customers</h3>
              <p className="text-gray-600">
                Instantly connect with millions of potential buyers worldwide.
              </p>
            </div>
            <div className="card bg-white shadow-md p-4">
              <h3 className="font-semibold text-gray-800">Boost Sales</h3>
              <p className="text-gray-600">
                Utilize powerful tools to increase visibility and revenue.
              </p>
            </div>
            <div className="card bg-white shadow-md p-4">
              <h3 className="font-semibold text-gray-800">
                Support & Training
              </h3>
              <p className="text-gray-600">
                Access direct support and training to succeed as a seller.
              </p>
            </div>
            <div className="card bg-white shadow-md p-4">
              <h3 className="font-semibold text-gray-800">Secure Payments</h3>
              <p className="text-gray-600">
                Enjoy reliable payment options and trusted shipping partners.
              </p>
            </div>
          </div>
        </section>

        {/* Steps to Get Started Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            How to Get Started
          </h2>
          <ol className="steps steps-vertical lg:steps-horizontal">
            <li
              className={`step ${
                !isApproved && !isDeclined ? "step-primary" : ""
              }`}
            >
              <h3 className="font-medium text-gray-800">
                1. Register Your Account
              </h3>
              <p className="text-gray-600">
                Sign up as a seller and provide your business details to get
                started.
              </p>
            </li>

            <li
              className={`step ${
                !isApproved && !isDeclined ? "step-primary" : ""
              }`}
            >
              <h3 className="font-medium text-gray-800">
                2. Wait for admin approval
              </h3>
              <p className="text-gray-600">
                The admin will decide if you're valid to sell in DRPSTR.
              </p>
            </li>

            <li className={`step ${isApproved ? "step-success" : ""}`}>
              <h3 className="font-medium text-gray-800">3. Start Selling</h3>
              <p className="text-gray-600">
                Once approved, your products go live on DRPSTR, and you can
                start selling.
              </p>
            </li>

            <li className={`step ${isDeclined ? "step-error" : ""}`}>
              <h3 className="font-medium text-gray-800">
                4. Declined by the admin
              </h3>
              <p className="text-gray-600">
                Contact the web moderator or re-create a new application.
              </p>
            </li>
          </ol>
        </section>

        {/* Get Started Button */}
        <div className=" flex flex-row items-center justify-center gap-10">
          <div className="text-center">
            <button
              className={` ${
                isApproved || loading
                  ? "btn-lg rounded-md hover:bg-slate-800 cursor-not-allowed bg-slate-900 text-gray-100 "
                  : "btn-lg bg-primary rounded-md font-semibold hover:bg-opacity-80 text-slate-900"
              }`}
              disabled={isApproved || loading}
            >
              {loading || isApproved ? (
                loading ? (
                  "Loading..."
                ) : (
                  "You're Already a Merchant"
                )
              ) : (
                <Link
                  to="/shop/MerchantCreate"
                  className="text-white text-inherit no-underline"
                >
                  Be a Merchant
                </Link>
              )}
            </button>
          </div>
          <div className="text-center">
          <div className="text-center">
            <button
              className={` ${
                isApproved || loading
                  ? "btn-lg rounded-md hover:bg-slate-800 cursor-not-allowed bg-slate-900 text-gray-100 "
                  : "btn-lg bg-primary rounded-md font-semibold hover:bg-opacity-80 text-slate-900"
              }`}
              disabled={isArtist || loading}
            >
              {loading || isArtist ? (
                loading ? (
                  "Loading..."
                ) : (
                 "You're Already an Artist"
                )
              ) : (
                <Link to="/shop/ArtistCreate" className="text-white text-inherit no-underline">
                  Be an Artist
                </Link>
              )}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
