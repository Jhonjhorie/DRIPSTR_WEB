import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";

const shop = [{ label: "Shop", path: "/shop/MerchantCreate" }];

const Shop = () => {
  const navigate = useNavigate();
  const [isArtist, setIsMerchant] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('merchant');

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

      <div className="flex-1 p-4 px-9">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-store mr-3 text-primary-color"></i>
          Become a Seller
        </h1>

        <div className="bg-white p-6 rounded-xl relative shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-xl"></div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('merchant')}
              className={`px-4 py-2 font-medium relative ${
                activeTab === 'merchant'
                  ? "text-primary-color border-b-2 border-primary-color"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Become a Merchant
            </button>
            <button
              onClick={() => setActiveTab('artist')}
              className={`px-4 py-2 font-medium relative ${
                activeTab === 'artist'
                  ? "text-primary-color border-b-2 border-primary-color"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Become an Artist
            </button>
          </div>

          {/* Merchant Content */}
          {activeTab === 'merchant' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800">Join as a Merchant</h2>
                <p className="text-gray-600 mt-2">
                  Showcase your unique designs to a global audience. Leverage our integrated e-commerce platform and 3D design tools to grow your fashion business.
                </p>
              </div>

              <div className="flex justify-center mt-8">
                {isApproved ? (
                  <button
                    onClick={() => navigate("/shop/MerchantDashboard")}
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    You're already a Merchant
                  </button>
                ) : (
                  <Link 
                    to="/shop/MerchantCreate"
                    className="px-6 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors"
                  >
                    Apply as Merchant
                  </Link>
                )}
              </div>

              <div className="join join-vertical w-full">
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="merchant-accordion" defaultChecked />
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

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="merchant-accordion" />
                  <div className="collapse-title text-xl font-medium">
                    Upload & Manage Your Products with Ease
                  </div>
                  <div className="collapse-content">
                    <p>
                      Once your store is set up, you can begin uploading and managing your apparel products using DRIPSTR's powerful merchant dashboard. Our 3D design software allows you to create realistic apparel mockups, helping customers visualize how your designs will look on different clothing styles.
                    </p>
                    <p>
                      Each product listing includes essential details such as pricing, available sizes, materials, colors, and descriptions, ensuring that buyers have all the information they need to make informed purchases.
                    </p>
                    <p>
                      Through the merchant dashboard, you can easily track inventory, manage orders, and communicate with customers. This centralized system ensures that you have full control over your store operations while providing buyers with a seamless shopping experience.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="merchant-accordion" />
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
          )}

          {/* Artist Content */}
          {activeTab === 'artist' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800">Join as an Artist</h2>
                <p className="text-gray-600 mt-2">
                  Share your creativity and collaborate with merchants to bring your designs to life. Turn your artistic vision into a thriving business.
                </p>
              </div>

              <div className="flex justify-center mt-8">
                {isArtist ? (
                  <button
                    onClick={() => navigate("/shop/Artist/ArtistDashboard")}
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    You're already an Artist
                  </button>
                ) : (
                  <Link 
                    to="/shop/ArtistCreate"
                    className="px-6 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors"
                  >
                    Apply as Artist
                  </Link>
                )}
              </div>

              <div className="join join-vertical w-full">
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="artist-accordion" defaultChecked />
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

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="artist-accordion" />
                  <div className="collapse-title text-xl font-medium">
                    Upload & Monetize Your Designs
                  </div>
                  <div className="collapse-content">
                    <p>
                      Once your profile is set up, you can start uploading your digital artwork in compatible file formats. DRIPSTR provides an easy-to-use interface where you can organize your designs, categorize them, and make them available for merchants and customers to explore.
                    </p>
                    <p>
                      Additionally, DRIPSTR allows artists to accept commissions directly through messages, giving you the flexibility to work on custom projects tailored to a merchant's specific vision. Whether it's designing a logo, creating limited-edition prints, or crafting exclusive apparel graphics, commissions offer a great way to expand your creative reach and earnings.
                    </p>
                  </div>
                </div>

                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="artist-accordion" />
                  <div className="collapse-title text-xl font-medium">
                    Earn, Build Your Brand & Grow Your Audience
                  </div>
                  <div className="collapse-content">
                    <p>
                      Being an artist on DRIPSTR is more than just selling designs—it's about building a personal brand and growing a loyal audience. Through the artist marketplace, your work gets exposure to a wide range of buyers, including merchants seeking fresh designs for their clothing lines.
                    </p>
                    <p>
                      You'll earn from every commission and have the opportunity to establish long-term partnerships with apparel brands. By consistently uploading high-quality artwork and engaging with the community, you can increase your visibility, attract more clients, and elevate your reputation as a top-tier designer on the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Benefits of Becoming a {activeTab === 'merchant' ? 'Merchant' : 'Artist'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeTab === 'merchant' ? (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-primary-color mb-2">Powerful Tools</h4>
                    <p className="text-gray-600">Access our 3D visualization tools and e-commerce features to showcase your products effectively.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-primary-color mb-2">Global Reach</h4>
                    <p className="text-gray-600">Connect with customers worldwide and expand your fashion business beyond borders.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-primary-color mb-2">Artist Network</h4>
                    <p className="text-gray-600">Collaborate with talented artists to create unique designs for your clothing line.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-primary-color mb-2">Creative Freedom</h4>
                    <p className="text-gray-600">Express your artistic vision and see your designs come to life on real products.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-primary-color mb-2">Monetize Your Art</h4>
                    <p className="text-gray-600">Earn from commissions and build long-term partnerships with fashion brands.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-primary-color mb-2">Growing Community</h4>
                    <p className="text-gray-600">Join a thriving community of artists and fashion enthusiasts.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
