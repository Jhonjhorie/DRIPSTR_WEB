import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

const FaQCom = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("customer");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="font-sans w-full h-full sm:h-[90vh] sm:max-w-lg bg-slate-50 rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-6 w-6">
              <img
                src={require("@/assets/images/blackLogo.png")}
                alt="Dripstr"
                className="object-contain"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">FAQ</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
          >
            <FontAwesomeIcon icon={faX} size="xs" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto flex-1 p-3 custom-scrollbar text-gray-700 flex flex-col gap-3">
          {/* What is Dripstr Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold font-[iceland] text-primary-color">
              What is Dripstr?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-bold text-primary-color">DRIPSTR</span> provides a
              unique shopping experience with 3D apparel visualization and
              avatar-based sizing for perfect fit and style.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center w-full my-2">
            <div className="tabs tabs-boxed bg-gray-100 w-full flex">
              <button
                onClick={() => handleTabChange("customer")}
                className={`tab flex-1 text-sm ${
                  activeTab === "customer"
                    ? "bg-primary-color text-white"
                    : "text-gray-700"
                }`}
              >
                CUSTOMER
              </button>
              <button
                onClick={() => handleTabChange("merchant")}
                className={`tab flex-1 text-sm ${
                  activeTab === "merchant"
                    ? "bg-primary-color text-white"
                    : "text-gray-700"
                }`}
              >
                MERCHANT
              </button>
              <button
                onClick={() => handleTabChange("artist")}
                className={`tab flex-1 text-sm ${
                  activeTab === "artist"
                    ? "bg-primary-color text-white"
                    : "text-gray-700"
                }`}
              >
                ARTIST
              </button>
            </div>
          </div>

          {/* Content Based on Active Tab */}
          {activeTab === "customer" && (
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <h2 className="text-xl font-bold font-[iceland] text-primary-color">
                  Become Customer
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Join DRIPSTR and Experience the Future of Shopping:
                  Personalized Avatars and 3D Fitting for the Perfect Style!
                </p>
              </div>

              {/* Customer FAQs */}
              <div className="join join-vertical w-full">
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="customer-accordion" defaultChecked />
                  <div className="collapse-title text-sm font-medium">
                    Browse & Discover Unique Products
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      Shopping on DRIPSTR begins with exploring a wide collection
                      of apparel crafted by skilled designers.
                    </p>
                    <p>
                      DRIPSTR also fosters a community of artists, allowing them
                      to showcase their designs, which merchants can bring to
                      life as custom apparel.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="customer-accordion" />
                  <div className="collapse-title text-sm font-medium">
                    Try Before You Buy with Virtual Fitting
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      DRIPSTR's avatar-based virtual fitting technology allows
                      you to try on clothes digitally before purchasing.
                    </p>
                    <p>
                      With real-time 3D visualization, you can examine how a
                      garment fits from every angle, reducing returns and
                      exchanges.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="customer-accordion" />
                  <div className="collapse-title text-sm font-medium">
                    Customize Your Order to Match Your Style
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      DRIPSTR gives you the freedom to personalize your orders
                      based on the options provided by each merchant.
                    </p>
                    <p>
                      Some sellers offer customization services, allowing you to
                      add unique touches to express your individuality.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="customer-accordion" />
                  <div className="collapse-title text-sm font-medium">
                    Secure Checkout & Multiple Payment Options
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      DRIPSTR supports a variety of secure payment methods,
                      including digital wallets.
                    </p>
                    <p>
                      After placing your order, you'll receive a confirmation
                      email with tracking information.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="customer-accordion" />
                  <div className="collapse-title text-sm font-medium">
                    Track & Receive Your Order with Ease
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      Track your order in real-time through your account with
                      regular shipping updates.
                    </p>
                    <p>
                      DRIPSTR partners with reliable shipping services to ensure
                      fast and secure delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "artist" && (
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <h2 className="text-xl font-bold font-[iceland] text-primary-color">
                  Become an Artist
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Join DRIPSTR and showcase your creativity to the world. Turn
                  your designs into income and collaborate with merchants!
                </p>
              </div>

              {/* Artist FAQs */}
              <div className="join join-vertical w-full">
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="artist-accordion" defaultChecked />
                  <div className="collapse-title text-sm font-medium">
                    Sign Up & Set Up Your Artist Portfolio
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      Register as an artist and create your profile. Your
                      portfolio serves as your digital gallery to showcase your
                      best work.
                    </p>
                    <p>
                      Customize your profile with a bio, social media links, and
                      a description of your artistic style.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="artist-accordion" />
                  <div className="collapse-title text-sm font-medium">
                    Upload & Monetize Your Designs
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      Upload your digital artwork in compatible file formats
                      through DRIPSTR's easy-to-use interface.
                    </p>
                    <p>
                      Accept commissions directly through messages, working on
                      custom projects tailored to merchants' specific visions.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="artist-accordion" />
                  <div className="collapse-title text-sm font-medium">
                    Earn, Build Your Brand & Grow Your Audience
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      Build a personal brand and grow a loyal audience through
                      the artist marketplace.
                    </p>
                    <p>
                      Earn from every commission and establish long-term
                      partnerships with apparel brands.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "merchant" && (
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <h2 className="text-xl font-bold font-[iceland] text-primary-color">
                  Become a Merchant
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Join DRIPSTR and showcase your unique designs to a global
                  audience. Leverage our integrated e-commerce platform.
                </p>
              </div>

              {/* Merchant FAQs */}
              <div className="join join-vertical w-full">
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="merchant-accordion" defaultChecked />
                  <div className="collapse-title text-sm font-medium">
                    Sign Up & Set Up Your Store
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      Create a merchant account, set up your store profile, and
                      customize it to match your brand identity.
                    </p>
                    <p>
                      Connect a preferred payment method to enable seamless
                      transactions and easy payouts.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="merchant-accordion" />
                  <div className="collapse-title text-sm font-medium">
                    Upload & Manage Your Products with Ease
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      Use our 3D design software to create realistic apparel
                      mockups for your products.
                    </p>
                    <p>
                      Track inventory, manage orders, and communicate with
                      customers through the merchant dashboard.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="merchant-accordion" />
                  <div className="collapse-title text-sm font-medium">
                    Sell, Promote & Grow Your Business
                  </div>
                  <div className="collapse-content text-xs">
                    <p className="mb-2">
                      Offer exclusive subscriptions for customers to access
                      special offers from your store.
                    </p>
                    <p>
                      Use built-in analytics to track sales performance and
                      optimize your product offerings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaQCom;