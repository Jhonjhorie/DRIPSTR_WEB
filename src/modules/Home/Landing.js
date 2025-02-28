// src/pages/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import AuthModal from "../../shared/login/Auth";
// Data

import useProducts from "../Products/hooks/useProducts";
import useMediaQueryChecker from "../../shared/hooks/useMediaQueryChecker";

function LandingPage() {
  const [showAbout, setShowAbout] = useState(true);
  const [showArt, setShowArt] = useState(false);
  const [showMer, setShowMer] = useState(false);
   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
   const isMobile = useMediaQueryChecker();
  const navigate = useNavigate();

  const handleShow = (action) => {
    if (action === "login") {
      setIsAuthModalOpen(true)
    }else if (action === "loginArtist") {
      setIsAuthModalOpen(true)
    }else if (action === "loginMerchant") {
      setIsAuthModalOpen(true)
    } 
    else if (action === "shop") {
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
    if (action === "login") {
      setIsAuthModalOpen(true)
    }else if (action === "loginArtist") {
      setIsAuthModalOpen(true)
    }else if (action === "loginMerchant") {
      setIsAuthModalOpen(true)
    } 
    // navigate(`/login`, { state: { action } });
  };

  return (
    <div className="w-full relative inset-0 bg-slate-300 flex flex-col">
         {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
      {/* Hero Section */}
      <div className="flex group flex-col-reverse gap-8 md:gap-0 md:flex-row overflow-hidden items-center justify-center px-1 lg:p-4 relative bg-slate-50 ">
        <img
          src={require("@/assets/images/home/dripMasa.png")}
          alt="No Images Available"
          className="object-cover w-[95%] rounded-lg h-[400px]"
        />
        <img
          src={require("@/assets/images/home/DrpTxt.png")}
          alt="No Images Available"
          className="absolute object-contain mb-2 mt-1 w-full z-10 h-[40vw] sm:h-[25vw] max-h-[400px] drop-shadow-customViolet right-0 sm:right-10 group-hover:right-[30rem] md:group-hover:right-80 scale-100 group-hover:scale-50 group-hover:drop-shadow-customWhite transition-all duration-300"
        />
        <div className="absolute font-[iceland] text-white top-5 sm:top-10 text-xl duration-300 transition-all group-hover:text-3xl tracking-[2rem] text-center">
          <h1>WELCOME</h1>
          <h1>TO</h1>
        </div>
        <div className="absolute right-10 sm:right-40 h-40 w-96 overflow-hidden flex">
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
        <div className="h-40 w-1 group-hover:drop-shadow-customViolet drop-shadow-custom duration-300 transition-all bg-white absolute right-8 sm:right-36 rounded-lg"></div>
      </div>

      <div className="flex flex-col gap-10 md:gap-4 md:flex-row justify-evenly bg-slate-50 items-center p-4 h-[39%] lg:h-[38%] font-[iceland]">
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
        <div className="flex justify-center text-center flex-col gap-2">
          <p className="text-lg">Scroll Down to Know more</p>
          <span
            onClick={() => handleShow("about")}
            className="text-secondary-color text-3xl hover:translate-y-4 duration-300 transition-all"
          >
            <FontAwesomeIcon icon={faAnglesDown} />
          </span>
        </div>
      </div>
      <div className="w-full pt-20 px-8 bg-slate-50 flex flex-col gap-4 pb-12">
        {/* Title Section */}
        <div className="text-center ">
          <h2 className="text-2xl font-[iceland] ">
            What is <span className="text-primary-color text-4xl  font-bold">Dripstr?</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Discover the future of online shopping with Dripstr.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-4 md:flex-col justify-evenly bg-slate-50 items-center mb-8 h-[39%] lg:h-[38%] font-[iceland]">
          <div className="flex-col md:flex-row gap-2 md:gap-0 flex w-2/3 justify-evenly items-center h-[39%] lg:h-[38%]">
            <div className="flex justify-center text-center flex-col gap-2">
            <p className={`${
                  isMobile ? "text-xl" : showAbout ? "text-3xl" : "text-xl"} transition-all duration-300`}>As an</p>
              <button
                onClick={() => handleShow("customer")}
                className={`${
                  showAbout ? "text-primary-color text-4xl underline" : "text-secondary-color text-2xl"
                }   hover:text-2xl hover:bg-secondary-color hover:text-white hover:p-1 rounded-lg hover:glass hover:scale-125 duration-300 transition-all drop-shadow-lg font-[iceland] text-2xl w-56`}
              >
                CUSTOMER
              </button>
         
            </div>

            <div className="flex justify-center text-center flex-col gap-2">
             {!isMobile && <p className={`${
                  showMer? "text-3xl" : "text-xl"} transition-all duration-300`}>As an</p>}
              <button
                onClick={() => handleShow("merchant")}
                className={`${
                  showMer ? "text-primary-color text-4xl underline" : "text-secondary-color text-2xl"
                }   hover:text-2xl hover:bg-secondary-color hover:text-white hover:p-1 rounded-lg hover:glass hover:scale-125 duration-300 transition-all drop-shadow-lg font-[iceland] text-2xl w-56`}
              >
                MERCHANT
              </button>
            </div>
            <div className="flex justify-center text-center flex-col gap-2">
              {!isMobile &&  <p className={`${
                  showArt ? "text-3xl" : "text-xl"} transition-all duration-300`}>As an</p>
                  }
             
              <button
                onClick={() => handleShow("artist")}
                className={`${
                  showArt ? "text-primary-color text-4xl underline" : "text-secondary-color text-2xl"
                }   hover:text-2xl hover:bg-secondary-color hover:text-white hover:p-1 rounded-lg hover:glass hover:scale-125 duration-300 transition-all drop-shadow-lg font-[iceland]  w-56`}
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
          <div className="z-10 flex flex-col gap-8">
            <div className="text-center ">
              <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
                Become Customer
              </h2>
              <p className="mt-2 text-lg text-slate-600">
                Join DRIPSTR and Experience the Future of Shopping: Personalized
                Avatars and 3D Fitting for the Perfect Style!
              </p>
            </div>

            {/* Details Section with Parallax Effect */}
            <div className="flex flex-col md:flex-row items-end gap-8">
              <img
                src={require("@/assets/emote/mascot.png")}
                alt="No Images Available"
                className=" drop-shadow-customViolet  z-0 hidden sm:flex h-96 "
              />
              <div className="join join-vertical w-full">
                {/* Accordion Item 1: Browse & Discover Unique Products */}
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="dripstr-accordion" defaultChecked />
                  <div className="collapse-title text-xl font-medium">
                    Browse & Discover Unique Products
                  </div>
                  <div className="collapse-content">
                    <p>
                      Shopping on DRIPSTR begins with exploring a wide
                      collection of apparel crafted by skilled designers. The
                      platform features a diverse range of clothing, from trendy
                      streetwear to high-performance activewear and luxury
                      fashion pieces.
                    </p>
                    <p>
                      DRIPSTR also fosters a community of artists, allowing them
                      to showcase their designs, which merchants can bring to
                      life as custom apparel. Whether you're seeking a bold
                      statement piece or a timeless classic, DRIPSTR makes
                      discovering new fashion easy and exciting.
                    </p>
                  </div>
                </div>

                {/* Accordion Item 2: Try Before You Buy with Virtual Fitting */}
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="dripstr-accordion" />
                  <div className="collapse-title text-xl font-medium">
                    Try Before You Buy with Virtual Fitting
                  </div>
                  <div className="collapse-content">
                    <p>
                      One of DRIPSTR’s standout features is its avatar-based
                      virtual fitting technology, which allows you to try on
                      clothes digitally before making a purchase. By entering
                      your body measurements, the system creates a personalized
                      3D avatar that closely matches your physique.
                    </p>
                    <p>
                      With real-time 3D visualization, you can rotate, zoom in,
                      and examine how a garment fits from every angle. This
                      feature eliminates the uncertainty of online shopping,
                      helping you make confident purchases while reducing the
                      need for returns and exchanges.
                    </p>
                  </div>
                </div>

                {/* Accordion Item 3: Customize Your Order to Match Your Style */}
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="dripstr-accordion" />
                  <div className="collapse-title text-xl font-medium">
                    Customize Your Order to Match Your Style
                  </div>
                  <div className="collapse-content">
                    <p>
                      DRIPSTR gives you the freedom to personalize your orders
                      based on the options provided by each merchant. You can
                      choose from different sizes, colors, and styles, ensuring
                      that your purchase aligns perfectly with your preferences.
                    </p>
                    <p>
                      Some sellers even offer customization services, allowing
                      you to add unique touches such as personalized prints,
                      embroidery, or monograms. With these flexible options,
                      DRIPSTR enables you to express your individuality and
                      stand out with one-of-a-kind fashion pieces.
                    </p>
                  </div>
                </div>

                {/* Accordion Item 4: Secure Checkout & Multiple Payment Options */}
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="dripstr-accordion" />
                  <div className="collapse-title text-xl font-medium">
                    Secure Checkout & Multiple Payment Options
                  </div>
                  <div className="collapse-content">
                    <p>
                      Once you’ve found the perfect items, checking out is a
                      smooth and secure process. Add your selections to the
                      shopping cart, review your order, and proceed to checkout
                      with confidence.
                    </p>
                    <p>
                      DRIPSTR supports a variety of secure payment methods,
                      including digital wallets. After placing your order,
                      you’ll receive an instant confirmation email containing
                      your purchase details, expected delivery date, and
                      tracking information, so you’re always updated on your
                      order status.
                    </p>
                  </div>
                </div>

                {/* Accordion Item 5: Track & Receive Your Order with Ease */}
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="dripstr-accordion" />
                  <div className="collapse-title text-xl font-medium">
                    Track & Receive Your Order with Ease
                  </div>
                  <div className="collapse-content">
                    <p>
                      Once your order is placed, you can track its progress in
                      real time through your account. Stay informed with regular
                      shipping updates and estimated delivery times, so you know
                      exactly when to expect your package.
                    </p>
                    <p>
                      DRIPSTR partners with reliable shipping services to ensure
                      fast and secure delivery. When your order arrives, you can
                      enjoy a perfectly fitted, high-quality fashion piece that
                      matches your expectations, thanks to the advanced virtual
                      fitting and customization options.
                    </p>
                  </div>
                </div>

                {/* Accordion Item 6: Hassle-Free Returns & Exchanges */}
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="dripstr-accordion" />
                  <div className="collapse-title text-xl font-medium">
                    Hassle-Free Returns & Exchanges
                  </div>
                  <div className="collapse-content">
                    <p>
                      In case you need to make a return or exchange, DRIPSTR
                      provides a straightforward and transparent process to
                      ensure customer satisfaction. If an item doesn’t meet your
                      expectations, you can initiate a return request within the
                      allowed timeframe.
                    </p>
                    <p>
                      The platform offers guidance on return eligibility,
                      including conditions such as unworn items and original
                      packaging requirements. Exchanges are also available for
                      select products, allowing you to swap sizes or styles
                      effortlessly.
                    </p>
                    <p>
                      DRIPSTR prioritizes customer experience, ensuring that
                      returns and exchanges are handled efficiently and fairly.
                    </p>
                  </div>
                </div>

                {/* Accordion Item 7: Stay Connected & Explore the DRIPSTR Community */}
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="dripstr-accordion" />
                  <div className="collapse-title text-xl font-medium">
                    Stay Connected & Explore the DRIPSTR Community
                  </div>
                  <div className="collapse-content">
                    <p>
                      DRIPSTR isn’t just a shopping platform—it’s a
                      fashion-forward community where designers, artists, and
                      customers come together to celebrate creativity and style.
                      Artists can showcase their unique fashion designs, which
                      may be produced as real apparel by merchants, giving them
                      a platform to reach a wider audience.
                    </p>
                    <p>
                      Stay updated with the latest fashion trends, upcoming
                      collections, and special promotions by following DRIPSTR’s
                      social media pages and newsletters. Engage with fellow
                      fashion enthusiasts, participate in exclusive style
                      challenges, and showcase your customized outfits for a
                      chance to be featured.
                    </p>
                    <p>
                      With DRIPSTR, shopping becomes more than just a
                      transaction—it’s an experience that connects you to the
                      future of digital fashion.
                    </p>
                  </div>
                </div>
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
                    onClick={() => {
                      handleShow("login");
                    }}
                    className="btn glass bg-primary-color w-full text-white hover:text-secondary-color"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      handleShow("shop");
                    }}
                    className="btn glass bg-primary-color w-full text-white hover:text-secondary-color"
                  >
                    Browse as Guest
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showArt && (
          <div className="z-10 flex flex-col gap-8">
  <div className="text-center ">
    <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
      Become an Artist
    </h2>
    <p className="mt-2 text-lg text-slate-600">
      Join DRIPSTR and showcase your creativity to the world. Turn your designs into income and collaborate with merchants to bring your art to life!
    </p>
  </div>

  {/* Details Section with Parallax Effect */}
  <div className="flex flex-row-reverse items-end gap-8">
    <img
      src={require("@/assets/emote/mascot.png")}
      alt="No Images Available"
      className="drop-shadow-customViolet z-0 flex h-96"
    />
    <div className="join join-vertical w-full">
      {/* Accordion Item 1: Sign Up & Set Up Your Artist Portfolio */}
      <div className="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="dripstr-accordion" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          Sign Up & Set Up Your Artist Portfolio
        </div>
        <div className="collapse-content">
          <p>
            Getting started on DRIPSTR is simple. First, register as an artist and create your profile. Your artist portfolio serves as your digital gallery, allowing you to showcase your best work, style, and design expertise.
          </p>
          <p>
            A well-curated portfolio increases your visibility and helps potential clients—whether they are apparel merchants or fellow artists—discover your creative talents. You can customize your profile with a bio, social media links, and a description of your artistic style. This is your space to express your creative identity and make a lasting impression on potential collaborators.
          </p>
        </div>
      </div>

      {/* Accordion Item 2: Upload & Monetize Your Designs */}
      <div className="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="dripstr-accordion" />
        <div className="collapse-title text-xl font-medium">
          Upload & Monetize Your Designs
        </div>
        <div className="collapse-content">
          <p>
            Once your profile is set up, you can start uploading your digital artwork in compatible file formats. DRIPSTR provides an easy-to-use interface where you can organize your designs, categorize them, and make them available for merchants and customers to explore.
          </p>
          <p>
            Additionally, DRIPSTR allows artists to accept commissions directly through messages, giving you the flexibility to work on custom projects tailored to a merchant’s specific vision. Whether it’s designing a logo, creating limited-edition prints, or crafting exclusive apparel graphics, commissions offer a great way to expand your creative reach and earnings.
          </p>
        </div>
      </div>

      {/* Accordion Item 3: Earn, Build Your Brand & Grow Your Audience */}
      <div className="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="dripstr-accordion" />
        <div className="collapse-title text-xl font-medium">
          Earn, Build Your Brand & Grow Your Audience
        </div>
        <div className="collapse-content">
          <p>
            Being an artist on DRIPSTR is more than just selling designs—it’s about building a personal brand and growing a loyal audience. Through the artist marketplace, your work gets exposure to a wide range of buyers, including merchants seeking fresh designs for their clothing lines.
          </p>
          <p>
            You’ll earn from every commission and have the opportunity to establish long-term partnerships with apparel brands. By consistently uploading high-quality artwork and engaging with the community, you can increase your visibility, attract more clients, and elevate your reputation as a top-tier designer on the platform.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Call-to-Action Section */}
 <div className="flex flex-col items-center ">
                <div className="flex flex-col gap-2 items-center w-fit ">
                  <h1 className="text-sm">
                    You must Login/Register First to Become an Artist
                  </h1>
                  <div className="divider my-0">
                    <FontAwesomeIcon icon={faAngleDown} />
                  </div>
                  <button
                    onClick={() => {
                      handleLogin("loginArtist");
                    }}
                    className="btn glass bg-primary-color w-full text-white hover:text-secondary-color"
                  >
                    Login
                  </button>
                </div>
              </div>
 
</div>
        )}
        {showMer && (
          <div className="z-10  flex flex-col gap-8">
          <div className="text-center ">
            <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
              Become a Merchant
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              Join DRIPSTR and showcase your unique designs to a global audience. Leverage our integrated e-commerce platform and 3D design tools to grow your fashion business.
            </p>
          </div>
        
          {/* Details Section with Parallax Effect */}
          <div className="flex flex-row-reverse items-end gap-8">
            <img
              src={require("@/assets/emote/mascot.png")}
              alt="No Images Available"
              className="drop-shadow-customViolet z-0 flex h-96"
            />
            <div className="join join-vertical w-full">
              {/* Accordion Item 1: Sign Up & Set Up Your Store */}
              <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="dripstr-accordion" defaultChecked />
                <div className="collapse-title text-xl font-medium">
                  Sign Up & Set Up Your Store
                </div>
                <div className="collapse-content">
                  <p>
                    Getting started as a merchant on DRIPSTR is quick and straightforward. Simply create a merchant account, set up your store profile, and customize it to match your brand identity.
                  </p>
                  <p>
                    Your store profile allows you to introduce your brand, showcase your design style, and communicate your policies to potential customers. Merchants can also connect a preferred payment method to enable seamless transactions, ensuring a smooth buying experience for shoppers while making it easy to receive payouts.
                  </p>
                </div>
              </div>
        
              {/* Accordion Item 2: Upload & Manage Your Products with Ease */}
              <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="dripstr-accordion" />
                <div className="collapse-title text-xl font-medium">
                  Upload & Manage Your Products with Ease
                </div>
                <div className="collapse-content">
                  <p>
                    Once your store is set up, you can begin uploading and managing your apparel products using DRIPSTR’s powerful merchant dashboard. Our 3D design software allows you to create realistic apparel mockups, helping customers visualize how your designs will look on different clothing styles.
                  </p>
                  <p>
                    Each product listing includes essential details such as pricing, available sizes, materials, colors, and descriptions, ensuring that buyers have all the information they need to make informed purchases.
                  </p>
                  <p>
                    Through the merchant dashboard, you can easily track inventory, manage orders, and communicate with customers. This centralized system ensures that you have full control over your store operations while providing buyers with a seamless shopping experience.
                  </p>
                </div>
              </div>
        
              {/* Accordion Item 3: Sell, Promote & Grow Your Business */}
              <div className="collapse collapse-arrow join-item border border-base-300">
                <input type="radio" name="dripstr-accordion" />
                <div className="collapse-title text-xl font-medium">
                  Sell, Promote & Grow Your Business
                </div>
                <div className="collapse-content">
                  <p>
                    Once your products are live, you can start selling and expanding your brand presence on DRIPSTR. Our platform provides various tools to help you attract and retain customers, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Exclusive subscriptions that allow buyers to follow and access special offers from your store.</li>
                    <li>Built-in analytics to track sales performance, customer preferences, and product demand.</li>
                    <li>Marketing support and promotional opportunities to boost visibility and increase conversions.</li>
                  </ul>
                  <p>
                    By leveraging these features, you can optimize your sales strategy, engage with your audience, and continuously improve your product offerings. DRIPSTR is designed to empower merchants with the resources they need to build a successful and sustainable online fashion business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        
          {/* Call-to-Action Section */}
        <div className="flex flex-col items-center ">
                        <div className="flex flex-col gap-2 items-center w-fit ">
                          <h1 className="text-sm">
                            You must Login/Register First to Become a Merchant
                          </h1>
                          <div className="divider my-0">
                            <FontAwesomeIcon icon={faAngleDown} />
                          </div>
                          <button
                            onClick={() => {
                              handleLogin("loginMerchant");
                            }}
                            className="btn glass bg-primary-color w-full text-white hover:text-secondary-color"
                          >
                            Login
                          </button>
                        </div>
                    
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
