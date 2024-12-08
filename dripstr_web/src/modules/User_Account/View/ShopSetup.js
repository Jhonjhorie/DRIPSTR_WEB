import React,  { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";



const shop = [{ label: "Shop", path: "/shop/MerchantCreate" }];

const Shop = () => {

  const [isMerchant, setIsMerchant] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStatus = async () => {
      setLoading(true);
      try {
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Error fetching user:", userError?.message || "No user found");
          return;
        }

        // Fetch the user's profile from the 'profiles' table
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("isMerchant")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          return;
        }

        // Set the isMerchant status
        setIsMerchant(profiles.isMerchant === true);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, []);
  
  return (
    <div className="p-4 flex min-h-screen bg-slate-200">
      {/* Sidebar */}
      <Sidebar />

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
            <li className="step step-primary">
              <h3 className="font-medium text-gray-800">
                1. Register Your Account
              </h3>
              <p className="text-gray-600">
                Sign up as a seller and provide your business details to get
                started.
              </p>
            </li>
            <li className="step">
              <h3 className="font-medium text-gray-800">
                2. Set Up Your Store
              </h3>
              <p className="text-gray-600">
                Upload product details, add descriptions, and set your prices.
              </p>
            </li>
            <li className="step">
              <h3 className="font-medium text-gray-800">3. Start Selling</h3>
              <p className="text-gray-600">
                Once approved, your products go live on DRPSTR, and you can
                start selling.
              </p>
            </li>
            <li className="step">
              <h3 className="font-medium text-gray-800">
                4. Manage Orders and Payments
              </h3>
              <p className="text-gray-600">
                Track orders and payments in your seller dashboard and grow your
                business.
              </p>
            </li>
          </ol>
        </section>

        {/* Get Started Button */}
        <div className=" flex flex-row items-center justify-center gap-10">
          <div className="text-center">
            <button
              className={` ${
                isMerchant || loading
                  ? "btn-lg rounded-md hover:bg-slate-800 cursor-not-allowed bg-slate-900 text-gray-100 "
                  : "btn-lg bg-primary rounded-md font-semibold hover:bg-opacity-80 text-slate-900"
              }`}
              disabled={isMerchant || loading}
            >
              {loading || isMerchant ? (
                loading ? (
                  "Loading..."
                ) : (
                 "You Are Already a Merchant"
                )
              ) : (
                <Link to="/shop/MerchantCreate" className="text-white text-inherit no-underline">
                  Be a Merchant
                </Link>
              )}
            </button>
          </div>
          <div className="text-center">
            <Link to="/shop/ArtistCreate">
              <button className="btn btn-primary btn-lg">Be an Artist</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
