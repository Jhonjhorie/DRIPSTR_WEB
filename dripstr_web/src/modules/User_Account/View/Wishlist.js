import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";

const FollowedStores = () => {
  const [selectedTab, setSelectedTab] = useState("Artists");
  const [followedArtists, setFollowedArtists] = useState([]);
  const [followedMerchants, setFollowedMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFollowed();
  }, []);

  const fetchFollowed = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch followed artists
      const { data: artistFollowers, error: artistError } = await supabase
        .from('artist_followers')
        .select(`
          id,
          created_at,
          name,
          artist_name,
          artist:artist_name (
            id,
            artist_Name,
            artist_Bio,
            art_Type,
            artist_Image
          )
        `)
        .eq('name', user.id);

      if (artistError) throw artistError;

      // Fetch followed merchants
      const { data: merchantFollowers, error: merchantError } = await supabase
        .from('merchant_Followers')
        .select(`
          id,
          time,
          shop:shop_id (
            id,
            shop_name,
            description,
            address,
            shop_image
          )
        `)
        .eq('acc_id', user.id);

      if (merchantError) throw merchantError;

      setFollowedArtists(artistFollowers?.map(f => f.artist) || []);
      setFollowedMerchants(merchantFollowers?.map(f => f.shop) || []);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const unfollowArtist = async (artistId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('artist_followers')
        .delete()
        .match({ 
          name: user.id,
          artist_name: artistId 
        });

      if (error) throw error;
      
      // Update local state
      setFollowedArtists(prev => prev.filter(artist => artist.id !== artistId));
    } catch (error) {
      console.error('Error unfollowing artist:', error);
    }
  };

  const unfollowMerchant = async (merchantId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('merchant_Followers')
        .delete()
        .match({ 
          acc_id: user.id,
          shop_id: merchantId 
        });

      if (error) throw error;
      
      // Update local state
      setFollowedMerchants(prev => prev.filter(merchant => merchant.id !== merchantId));
    } catch (error) {
      console.error('Error unfollowing merchant:', error);
    }
  };

  const tabs = ["Artists", "Merchants"];

  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 px-9">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Followed Creators
        </h1>

        {loading ? (
          <div className="flex mt-36 flex-col h-100 justify-center items-center">
            <img src="/emote/hmmm.png" alt="Loading..." className="w-25 h-25" />
            <label>Loading...</label>
          </div>
        ) : (
          <div>
            <div className="bg-white p-6 rounded-lg relative shadow-md mb-6">
              <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md" />
              
              <div className="tabs flex flex-row justify-around mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-6 py-2 text-gray-700 font-medium relative ${
                      selectedTab === tab
                        ? "text-purple-600 border-b-2 border-purple-600"
                        : "hover:text-black"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {selectedTab === "Artists" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followedArtists.map((artist) => (
                    <div key={artist.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <img
                          src={artist.artist_Image || "/placeholder.png"}
                          alt={artist.artist_Name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800">{artist.artist_Name}</h3>
                          <p className="text-sm text-gray-600">{artist.art_Type}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 line-clamp-2">{artist.artist_Bio}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <Link
                          to={`/arts/ArtistPage/${artist.id}`}
                          className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Visit Profile
                        </Link>
                        <button
                          onClick={() => unfollowArtist(artist.id)}
                          className="px-4 py-1 text-red-600 hover:text-red-800 border border-red-600 rounded-md hover:bg-red-50"
                        >
                          Unfollow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followedMerchants.map((merchant) => (
                    <div key={merchant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <img
                          src={merchant.shop_image || "/placeholder.png"}
                          alt={merchant.shop_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                        />
                        <div>
                          <h3 className="font-bold text-gray-800">{merchant.shop_name}</h3>
                          <p className="text-sm text-gray-600">{merchant.address}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 line-clamp-2">{merchant.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <Link
                          to={`/shop/${merchant.id}`}
                          className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Visit Shop
                        </Link>
                        <button
                          onClick={() => unfollowMerchant(merchant.id)}
                          className="px-4 py-1 text-red-600 hover:text-red-800 border border-red-600 rounded-md hover:bg-red-50"
                        >
                          Unfollow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {((selectedTab === "Artists" && followedArtists.length === 0) ||
                (selectedTab === "Merchants" && followedMerchants.length === 0)) && (
                <div className="flex flex-col items-center justify-center py-10">
                  <img src="/emote/sad.png" alt="No data" className="w-32 h-32 mb-4" />
                  <p className="text-gray-500">No followed {selectedTab.toLowerCase()} yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedStores;
