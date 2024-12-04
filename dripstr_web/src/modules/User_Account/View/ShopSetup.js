import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const shop = [{ label: "Shop", path: "/shop/MerchantCreate" }];

const Shop = () => {
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
            <Link to={shop[0].path}>
              <button className="btn btn-primary btn-lg">Be a Merchant </button>
            </Link>
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
