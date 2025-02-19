import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faX } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

const FaQCom = ({ onClose }) => {
  const [showAbout, setShowAbout] = useState(true);
  const [showArt, setShowArt] = useState(false);
  const [showMer, setShowMer] = useState(false);

  const handleShow = (action) => {
    if (action === "customer") {
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

  return (
    <div className="fixed  flex items-center justify-center bg-opacity-50 z-50">
      <div className="font-sans sm:w-full max-w-[60.40rem] h-[40rem] bg-slate-50 rounded-lg shadow-lg  mx-4 flex flex-col overflow-hidden">
        {/* Title Section */}
        <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-white">
          <div className="flex flex-col items-center justify-center h-6 w-6">
            <img
              src={require("@/assets/images/blackLogo.png")}
              alt="Dripstr"
              className="object-contain  "
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Frequently Asked Questions
          </h2>
          <button
            onClick={onClose}
            className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
        <div className=" overflow-y-auto p-2 text-sm custom-scrollbar text-gray-700 gap-4 flex flex-col">
          <div className="text-center ">
            <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
              What is Dripstr?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
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
          <div className="flex flex-col-reverse md:flex-col justify-evenly bg-slate-50 items-center h-[39%] lg:h-[38%] font-[iceland]">
            <div className="flex-row flex w-2/3 gap-2 justify-evenly items-center h-[39%] lg:h-[38%]">
              <div className="flex justify-center text-center flex-col gap-2">
              
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
           
          </div>

          {showAbout && (
            <div className="z-10 flex flex-col gap-8">
              <div className="text-center ">
                <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
                  Become Customer
                </h2>
                <p className="mt-2 text-lg text-slate-600">
                  Join DRIPSTR and Experience the Future of Shopping:
                  Personalized Avatars and 3D Fitting for the Perfect Style!
                </p>
              </div>

              {/* Details Section with Parallax Effect */}
              <div className="flex flex-row-reverse items-end gap-8">
                <img
                  src={require("@/assets/emote/mascot.png")}
                  alt="No Images Available"
                  className=" drop-shadow-customViolet  z-0 flex h-96 "
                />
                <div className="join join-vertical w-full">
                  {/* Accordion Item 1: Browse & Discover Unique Products */}
                  <div className="collapse collapse-arrow join-item border border-base-300">
                    <input
                      type="radio"
                      name="dripstr-accordion"
                      defaultChecked
                    />
                    <div className="collapse-title text-xl font-medium">
                      Browse & Discover Unique Products
                    </div>
                    <div className="collapse-content">
                      <p>
                        Shopping on DRIPSTR begins with exploring a wide
                        collection of apparel crafted by skilled designers. The
                        platform features a diverse range of clothing, from
                        trendy streetwear to high-performance activewear and
                        luxury fashion pieces.
                      </p>
                      <p>
                        DRIPSTR also fosters a community of artists, allowing
                        them to showcase their designs, which merchants can
                        bring to life as custom apparel. Whether you're seeking
                        a bold statement piece or a timeless classic, DRIPSTR
                        makes discovering new fashion easy and exciting.
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
                        your body measurements, the system creates a
                        personalized 3D avatar that closely matches your
                        physique.
                      </p>
                      <p>
                        With real-time 3D visualization, you can rotate, zoom
                        in, and examine how a garment fits from every angle.
                        This feature eliminates the uncertainty of online
                        shopping, helping you make confident purchases while
                        reducing the need for returns and exchanges.
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
                        choose from different sizes, colors, and styles,
                        ensuring that your purchase aligns perfectly with your
                        preferences.
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
                        shopping cart, review your order, and proceed to
                        checkout with confidence.
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
                        real time through your account. Stay informed with
                        regular shipping updates and estimated delivery times,
                        so you know exactly when to expect your package.
                      </p>
                      <p>
                        DRIPSTR partners with reliable shipping services to
                        ensure fast and secure delivery. When your order
                        arrives, you can enjoy a perfectly fitted, high-quality
                        fashion piece that matches your expectations, thanks to
                        the advanced virtual fitting and customization options.
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
                        ensure customer satisfaction. If an item doesn’t meet
                        your expectations, you can initiate a return request
                        within the allowed timeframe.
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
                        returns and exchanges are handled efficiently and
                        fairly.
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
                        customers come together to celebrate creativity and
                        style. Artists can showcase their unique fashion
                        designs, which may be produced as real apparel by
                        merchants, giving them a platform to reach a wider
                        audience.
                      </p>
                      <p>
                        Stay updated with the latest fashion trends, upcoming
                        collections, and special promotions by following
                        DRIPSTR’s social media pages and newsletters. Engage
                        with fellow fashion enthusiasts, participate in
                        exclusive style challenges, and showcase your customized
                        outfits for a chance to be featured.
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
            </div>
          )}

          {showArt && (
            <div className="z-10 flex flex-col gap-8">
              <div className="text-center ">
                <h2 className="text-4xl font-bold font-[iceland] text-primary-color">
                  Become an Artist
                </h2>
                <p className="mt-2 text-lg text-slate-600">
                  Join DRIPSTR and showcase your creativity to the world. Turn
                  your designs into income and collaborate with merchants to
                  bring your art to life!
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
                    <input
                      type="radio"
                      name="dripstr-accordion"
                      defaultChecked
                    />
                    <div className="collapse-title text-xl font-medium">
                      Sign Up & Set Up Your Artist Portfolio
                    </div>
                    <div className="collapse-content">
                      <p>
                        Getting started on DRIPSTR is simple. First, register as
                        an artist and create your profile. Your artist portfolio
                        serves as your digital gallery, allowing you to showcase
                        your best work, style, and design expertise.
                      </p>
                      <p>
                        A well-curated portfolio increases your visibility and
                        helps potential clients—whether they are apparel
                        merchants or fellow artists—discover your creative
                        talents. You can customize your profile with a bio,
                        social media links, and a description of your artistic
                        style. This is your space to express your creative
                        identity and make a lasting impression on potential
                        collaborators.
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
                        Once your profile is set up, you can start uploading
                        your digital artwork in compatible file formats. DRIPSTR
                        provides an easy-to-use interface where you can organize
                        your designs, categorize them, and make them available
                        for merchants and customers to explore.
                      </p>
                      <p>
                        Additionally, DRIPSTR allows artists to accept
                        commissions directly through messages, giving you the
                        flexibility to work on custom projects tailored to a
                        merchant’s specific vision. Whether it’s designing a
                        logo, creating limited-edition prints, or crafting
                        exclusive apparel graphics, commissions offer a great
                        way to expand your creative reach and earnings.
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
                        Being an artist on DRIPSTR is more than just selling
                        designs—it’s about building a personal brand and growing
                        a loyal audience. Through the artist marketplace, your
                        work gets exposure to a wide range of buyers, including
                        merchants seeking fresh designs for their clothing
                        lines.
                      </p>
                      <p>
                        You’ll earn from every commission and have the
                        opportunity to establish long-term partnerships with
                        apparel brands. By consistently uploading high-quality
                        artwork and engaging with the community, you can
                        increase your visibility, attract more clients, and
                        elevate your reputation as a top-tier designer on the
                        platform.
                      </p>
                    </div>
                  </div>
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
                  Join DRIPSTR and showcase your unique designs to a global
                  audience. Leverage our integrated e-commerce platform and 3D
                  design tools to grow your fashion business.
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
                    <input
                      type="radio"
                      name="dripstr-accordion"
                      defaultChecked
                    />
                    <div className="collapse-title text-xl font-medium">
                      Sign Up & Set Up Your Store
                    </div>
                    <div className="collapse-content">
                      <p>
                        Getting started as a merchant on DRIPSTR is quick and
                        straightforward. Simply create a merchant account, set
                        up your store profile, and customize it to match your
                        brand identity.
                      </p>
                      <p>
                        Your store profile allows you to introduce your brand,
                        showcase your design style, and communicate your
                        policies to potential customers. Merchants can also
                        connect a preferred payment method to enable seamless
                        transactions, ensuring a smooth buying experience for
                        shoppers while making it easy to receive payouts.
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
                        Once your store is set up, you can begin uploading and
                        managing your apparel products using DRIPSTR’s powerful
                        merchant dashboard. Our 3D design software allows you to
                        create realistic apparel mockups, helping customers
                        visualize how your designs will look on different
                        clothing styles.
                      </p>
                      <p>
                        Each product listing includes essential details such as
                        pricing, available sizes, materials, colors, and
                        descriptions, ensuring that buyers have all the
                        information they need to make informed purchases.
                      </p>
                      <p>
                        Through the merchant dashboard, you can easily track
                        inventory, manage orders, and communicate with
                        customers. This centralized system ensures that you have
                        full control over your store operations while providing
                        buyers with a seamless shopping experience.
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
                        Once your products are live, you can start selling and
                        expanding your brand presence on DRIPSTR. Our platform
                        provides various tools to help you attract and retain
                        customers, including:
                      </p>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          Exclusive subscriptions that allow buyers to follow
                          and access special offers from your store.
                        </li>
                        <li>
                          Built-in analytics to track sales performance,
                          customer preferences, and product demand.
                        </li>
                        <li>
                          Marketing support and promotional opportunities to
                          boost visibility and increase conversions.
                        </li>
                      </ul>
                      <p>
                        By leveraging these features, you can optimize your
                        sales strategy, engage with your audience, and
                        continuously improve your product offerings. DRIPSTR is
                        designed to empower merchants with the resources they
                        need to build a successful and sustainable online
                        fashion business.
                      </p>
                    </div>
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
