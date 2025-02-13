// src/pages/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAngleDown } from "@fortawesome/free-solid-svg-icons";

// Data

import useProducts from "../Products/hooks/useProducts";

function LandingPage() {
  const [showAbout, setShowAbout] = useState(true);
  const [showArt, setShowArt] = useState(false);
  const [showMer, setShowMer] = useState(false);
  const navigate = useNavigate();

  const handleShow = (action) => {
    if (action === "login") {
      navigate(`/login`);
    } else if (action === "shop") {
      navigate(`/guest`);
    } else if (action === "customer") {
      setShowAbout(true);
      setShowArt(false);
      setShowMer(false);
    } else if (action === "artist") {
      setShowAbout(false);
      setShowArt(true);
      setShowMer(false);
    } else if (action === "merchant") {
      setShowAbout(false);
      setShowArt(false);
      setShowMer(true);
    }
  };

  const handleLogin = (action) => {
    navigate(`/login`, { state: { action } });
  };

  return (
    <div className="w-full relative inset-0 bg-slate-300 flex flex-col">
      {/* Hero Section */}
      <div className="flex group flex-col-reverse gap-8 md:gap-0 md:flex-row overflow-hidden items-center justify-center px-1 lg:p-4 bg-slate-50 ">
        <img
          src={require("@/assets/images/home/dripMasa.png")}
          alt="No Images Available"
          className="object-cover w-[95%] rounded-lg h-[400px]"
        />
        <img
          src={require("@/assets/images/home/DrpTxt.png")}
          alt="No Images Available"
          className="absolute object-none mb-2 mt-1 w-full z-10 h-[400px] drop-shadow-customViolet right-10 group-hover:right-80 scale-100 group-hover:scale-50 group-hover:drop-shadow-customWhite transition-all duration-300"
        />
        <div className="absolute font-[iceland] text-white top-10 text-xl duration-300 transition-all group-hover:text-3xl tracking-[2rem] text-center">
          <h1>WELCOME</h1>
          <h1>TO</h1>
        </div>
        <div className="absolute right-40 h-40 w-96 overflow-hidden flex">
          <p className="font-[iceland] absolute right-[-10rem] w-96 text-white group-hover:right-0 transition-all opacity-0 group-hover:opacity-100 duration-300">
            <span className="font-bold text-lg text-primary-color">
              DRIPSTR
            </span>{" "}
            provides a unique and immersive online shopping experience by
            integrating 3D apparel visualization and avatar-based sizing to
            ensure the perfect fit and style. Whether you’re looking for
            custom-designed apparel or exclusive digital assets, DRIPSTR makes
            shopping seamless and enjoyable.
          </p>
        </div>
        <div className="h-40 w-1 group-hover:drop-shadow-customViolet drop-shadow-custom duration-300 transition-all bg-white absolute right-36 rounded-lg"></div>
      </div>

      <div className="flex flex-col-reverse gap-4 md:flex-row justify-evenly bg-slate-50 items-center p-4 h-[39%] lg:h-[38%] font-[iceland]">
        <div className="flex justify-center text-center flex-col gap-2">
          <p className="text-lg">Already have an account?</p>
          <div class="divider my-0">
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          <button
            onClick={() => handleShow("login")}
            className="   text-primary-color hover:text-2xl hover:bg-primary-color hover:text-white rounded-lg hover:p-1 hover:glass hover:scale-125 duration-300 transition-all drop-shadow-lg font-[iceland] text-2xl w-56"
          >
            Login
          </button>
        </div>

        <div className="flex justify-center text-center flex-col gap-2">
          <p className="text-lg">Scroll Down to Know more</p>
          <span
            onClick={() => handleShow("about")}
            className="text-secondary-color text-3xl hover:translate-y-4 duration-300 transition-all"
          >
            <FontAwesomeIcon icon={faAnglesDown} />
          </span>
        </div>
        <div className="flex justify-center text-center flex-col gap-2">
          <p className="text-lg">Browse Shop as a Guest?</p>
          <div class="divider my-0">
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          <button
            onClick={() => handleShow("shop")}
            className="   text-primary-color hover:text-2xl hover:bg-primary-color hover:text-white rounded-lg hover:p-1 hover:glass hover:scale-125 duration-300 transition-all drop-shadow-lg font-[iceland] text-2xl w-56"
          >
            Browse Shop
          </button>
        </div>
      </div>
      <div className="w-full pt-20 bg-slate-50 flex flex-col gap-4 pb-12">
        {/* Title Section */}
        <div className="text-center ">
          <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
            What is Dripstr?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Discover the future of online shopping with Dripstr.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-4 md:flex-col justify-evenly bg-slate-50 items-center mb-8 h-[39%] lg:h-[38%] font-[iceland]">
          <div className="flex-row flex w-2/3 justify-evenly items-center h-[39%] lg:h-[38%]">
            <div className="flex justify-center text-center flex-col gap-2">
              <p className="text-3xl">As a</p>
              <button
                onClick={() => handleShow("customer")}
                className={`btn ${
                  showAbout ? "bg-primary-color" : "bg-secondary-color"
                } glass text-white hover:bg-secondary-color drop-shadow-lg font-[iceland] text-2xl w-56`}
              >
                CUSTOMER
              </button>
            </div>

            <div className="flex justify-center text-center flex-col gap-2">
              <p className="text-3xl">As a</p>
              <button
                onClick={() => handleShow("merchant")}
                className={`btn ${
                  showMer ? "bg-primary-color" : "bg-secondary-color"
                } glass text-white hover:bg-secondary-color drop-shadow-lg font-[iceland] text-2xl w-56`}
              >
                MERCHANT
              </button>
            </div>
            <div className="flex justify-center text-center flex-col gap-2">
              <p className="text-3xl">As an</p>
              <button
                onClick={() => handleShow("artist")}
                className={`btn ${
                  showArt ? "bg-primary-color" : "bg-secondary-color"
                } glass text-white hover:bg-secondary-color drop-shadow-lg font-[iceland] text-2xl w-56`}
              >
                ARTIST
              </button>
            </div>
          </div>
          <div className="mt-6 animate-bounce">
            <FontAwesomeIcon
              icon={faAnglesDown}
              className="text-2xl text-primary-color"
            />
          </div>
        </div>

        {/* About Section */}
        {showAbout && (
          <div className="z-10">
            {/* Details Section with Parallax Effect */}
            <div className="space-y-8 ">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
                  Become Customer
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                  Join DRIPSTR and Experience the Future of Shopping:
                  Personalized Avatars and 3D Fitting for the Perfect Style!
                </p>
              </div>
              {/* Section 1: Browse & Discover Products */}
              <div className="flex flex-col items-start ">
                <div className="p-6 glass w-[60%]  text-secondary-color drop-shadow-customViolet  rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Browse & Discover Products
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Explore a wide collection of custom apparel designed by
                      merchants.
                    </li>
                    <li>
                      Shop for exclusive digital assets created by artists.
                    </li>
                    <li>
                      Use filters and categories to find the perfect design.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 2: Try Before You Buy */}
              <div className="flex flex-col items-end ">
                <div className="p-6 glass w-[60%] text-secondary-color drop-shadow-custom rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Try Before You Buy (Virtual Fitting)
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Create a personalized avatar based on your measurements.
                    </li>
                    <li>
                      Use 3D previews to see how clothes fit and look before
                      purchasing.
                    </li>
                  </ul>
                </div>
              </div>
              {/* Section 3: Customize Your Order */}
              <div className="flex flex-col items-start ">
                <div className="p-6 glass w-[80%] text-secondary-color drop-shadow-customViolet rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Customize Your Order (If Available)
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Select sizes, colors, and styles from merchant-offered
                      options.
                    </li>
                  </ul>
                </div>
              </div>
              {/* Section 4: Secure Checkout & Payment */}
              <div className="flex flex-col items-end ">
                <div className="p-6 glass w-[40%]  text-secondary-color drop-shadow-custom rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Secure Checkout & Payment
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Add items to your cart and proceed to secure checkout.
                    </li>
                    <li>Multiple payment options available for convenience.</li>
                    <li>Receive order confirmation and tracking details.</li>
                  </ul>
                </div>
              </div>
              {/* Section 5: Track & Receive Your Order */}
              <div className="flex flex-col items-start ">
                <div className="p-6 glass w-[90%] text-secondary-color drop-shadow-customViolet rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Track & Receive Your Order
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Monitor your order status through your account.</li>
                    <li>
                      Get updates on shipping and estimated delivery times.
                    </li>
                    <li>Enjoy your customized, perfectly fitted apparel! 🎉</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-center ">
                <div className="flex flex-col gap-2 items-center w-fit ">
                  <h1 className="text-sm">
                    Login to start Shopping and Ordering or Enter as a guest
                  </h1>
                  <div className="divider my-0">
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-center">
                  <button
                    onClick={() => {handleShow('login')}}
                    className="btn glass bg-primary-color w-full text-white hover:text-secondary-color"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {handleShow('shop')}}
                    className="btn glass bg-primary-color w-full text-white hover:text-secondary-color"
                  >
                    Browse as Guest
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showArt && (
          <div className="z-10">
            {/* Title Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
                Become an Artist
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Join DRIPSTR and showcase your creativity to the world.
              </p>
            </div>

            {/* Details Section with Randomized Layout */}
            <div className="space-y-8">
              {/* Section 1: Sign Up & Set Up Your Portfolio */}
              <div className="flex flex-col items-start">
                <div className="p-6 glass w-[70%] text-secondary-color drop-shadow-custom rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Sign Up & Set Up Your Portfolio
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Register as an artist on DRIPSTR.</li>
                    <li>
                      Customize your artist profile with a portfolio showcasing
                      your work.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 2: Upload & Monetize Your Designs */}
              <div className="flex flex-col items-end">
                <div className="p-6 glass w-[50%] text-secondary-color drop-shadow-customViolet rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Upload & Monetize Your Designs
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Upload your digital artwork in compatible formats.</li>
                    <li>Accept commissions via messages.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3: Earn & Build Your Brand */}
              <div className="flex flex-col items-start">
                <div className="p-6 glass w-[80%] text-secondary-color drop-shadow-custom rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Earn & Build Your Brand
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Gain exposure through DRIPSTR’s artist marketplace.</li>
                    <li>Earn royalties from every commission.</li>
                    <li>
                      Connect with merchants looking for unique designs for
                      their apparel.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4: Collaborate with Merchants */}
              <div className="flex flex-col items-end">
                <div className="p-6 glass w-[60%] text-secondary-color drop-shadow-customViolet rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Collaborate with Merchants
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Work directly with merchants to create custom designs.
                    </li>
                    <li>Expand your network and grow your brand.</li>
                  </ul>
                </div>
              </div>

              {/* Section 5: Showcase Your Creativity */}
              <div className="flex flex-col items-start">
                <div className="p-6 glass w-[90%] text-secondary-color drop-shadow-custom rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Showcase Your Creativity
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Display your unique style and creativity to a global
                      audience.
                    </li>
                    <li>Get recognized for your talent and hard work.</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-center ">
                <div className="flex flex-col gap-2 items-center w-fit ">
                  <h1 className="text-sm">
                    You must Login/Register First to Become an Artist
                  </h1>
                  <div className="divider my-0">
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                  <button
                    onClick={() => {handleLogin("toArtist")}}
                    className="btn glass bg-primary-color w-full text-white hover:text-secondary-color"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showMer && (
          <div className="z-10">
            {/* Title Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
                Become a Merchant
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Join DRIPSTR and grow your business with our integrated
                e-commerce and 3D design platform.
              </p>
            </div>

            {/* Details Section with Randomized Layout */}
            <div className="space-y-8">
              {/* Section 1: Sign Up & Set Up Your Store */}
              <div className="flex flex-col items-end">
                <div className="p-6 glass w-[60%] text-secondary-color drop-shadow-customViolet rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Sign Up & Set Up Your Store
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Create a merchant account on DRIPSTR.</li>
                    <li>
                      Set up your store profile, including branding,
                      descriptions, and policies.
                    </li>
                    <li>Connect a payment method for seamless transactions.</li>
                  </ul>
                </div>
              </div>

              {/* Section 2: Upload & Manage Products */}
              <div className="flex flex-col items-start">
                <div className="p-6 glass w-[80%] text-secondary-color drop-shadow-custom rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Upload & Manage Products
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Use our 3D design software to create and upload your
                      apparel designs.
                    </li>
                    <li>
                      Add product details such as pricing, sizes, and
                      descriptions.
                    </li>
                    <li>
                      Manage inventory, orders, and customer interactions
                      through the merchant dashboard.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 3: Sell & Grow Your Business */}
              <div className="flex flex-col items-end">
                <div className="p-6 glass w-[70%] text-secondary-color drop-shadow-customViolet rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Sell & Grow Your Business
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Offer exclusive subscriptions to attract more buyers.
                    </li>
                    <li>
                      Track sales performance and customer insights through
                      analytics.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4: Leverage 3D Design Tools */}
              <div className="flex flex-col items-start">
                <div className="p-6 glass w-[50%]  text-secondary-color drop-shadow-custom rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Leverage 3D Design Tools
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Create realistic 3D previews of your apparel designs.
                    </li>
                    <li>
                      Enhance customer experience with virtual fitting options.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 5: Expand Your Reach */}
              <div className="flex flex-col items-end">
                <div className="p-6 glass w-[90%]  text-secondary-color drop-shadow-customViolet rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold font-[iceland] mb-4">
                    Expand Your Reach
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Reach a global audience of fashion enthusiasts.</li>
                    <li>Collaborate with artists to create unique designs.</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-center ">
                <div className="flex flex-col gap-2 items-center w-fit ">
                  <h1 className="text-sm">
                    You must Login/Register First to Become a Merchant
                  </h1>
                  <div className="divider my-0">
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                  <button
                    onClick={() => {handleLogin("toMerchant")}}
                    className="btn glass bg-primary-color w-full text-white hover:text-secondary-color"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <img
          src={require("@/assets/emote/success.png")}
          alt="No Images Available"
          className=" drop-shadow-customViolet absolute bottom-[35rem] w-80 left-10 z-0  "
        />
        <img
          src={require("@/assets/emote/mascot.png")}
          alt="No Images Available"
          className=" drop-shadow-customViolet absolute bottom-8 w-80 right-10 z-0  "
        />
      </div>
    </div>
  );
}

export default LandingPage;
