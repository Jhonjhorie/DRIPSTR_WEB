import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../constants/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar';
import Toast from '@/shared/alerts';

const FollowedArtists = () => {
  const [followedArtists, setFollowedArtists] = useState([]);
  const [followedMerchants, setFollowedMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowedArtists();
  }, []);

  const fetchFollowedArtists = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setToast({
          show: true,
          message: 'Please login to view followed creators',
          type: 'warning'
        });
        return;
      }

      // Fetch followed artists
      const { data: artists, error: artistError } = await supabase
        .from('artist')
        .select('*')
        .not('followers_Detail', 'is', null)
        .filter('followers_Detail', 'cs', `{"id":"${user.id}"}`);

      if (artistError) throw artistError;

      // Fetch followed merchants
      const { data: merchants, error: merchantError } = await supabase
        .from('merchant_Followers')
        .select(`
          id,
          shop:shop_id (
            id,
            shop_name,
            description,
            shop_image,
            address,
            is_Premium
          )
        `)
        .eq('acc_id', user.id);

      if (merchantError) throw merchantError;

      setFollowedArtists(artists || []);
      setFollowedMerchants(merchants?.map(m => m.shop).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching followed creators:', error);
      setToast({
        show: true,
        message: 'Failed to load followed creators',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (artistId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: artist, error: fetchError } = await supabase
        .from('artist')
        .select('followers_Detail')
        .eq('id', artistId)
        .single();

      if (fetchError) throw fetchError;

      const updatedFollowers = (artist.followers_Detail || [])
        .filter(follower => follower.id !== user.id);

      const { error: updateError } = await supabase
        .from('artist')
        .update({ followers_Detail: updatedFollowers })
        .eq('id', artistId);

      if (updateError) throw updateError;

      setFollowedArtists(prev => prev.filter(artist => artist.id !== artistId));
      
      setToast({
        show: true,
        message: 'Successfully unfollowed artist',
        type: 'success'
      });
    } catch (error) {
      console.error('Error unfollowing artist:', error);
      setToast({
        show: true,
        message: 'Failed to unfollow artist',
        type: 'error'
      });
    }
  };

  const handleUnfollowMerchant = async (shopId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('merchant_Followers')
        .delete()
        .match({ acc_id: user.id, shop_id: shopId });

      if (error) throw error;

      setFollowedMerchants(prev => prev.filter(shop => shop.id !== shopId));
      
      setToast({
        show: true,
        message: 'Successfully unfollowed shop',
        type: 'success'
      });
    } catch (error) {
      console.error('Error unfollowing shop:', error);
      setToast({
        show: true,
        message: 'Failed to unfollow shop',
        type: 'error'
      });
    }
  };

  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full">
        <Sidebar />
      </div>

      <div className="flex-1 p-4">
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-full absolute top-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1 rounded-t-md" />
          
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Followed Creators</h1>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-purple-600" />
            </div>
          ) : followedArtists.length > 0 || followedMerchants.length > 0 ? (
            <>
              {/* Artists Section */}
              {followedArtists.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Artists</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Existing artist cards code */}
                    {followedArtists.map((artist) => (
                      <div 
                        key={artist.id} 
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={artist.artist_Image || '/placeholder.png'}
                            alt={artist.artist_Name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                          />
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {artist.artist_Name}
                              {artist.is_Premium && (
                                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  Premium
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{artist.art_Type}</p>
                          </div>
                        </div>

                        <p className="text-gray-600 line-clamp-2 mb-4">{artist.artist_Bio}</p>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => navigate(`/arts/ArtistPage/${artist.id}`)}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Visit Profile
                          </button>
                          <button
                            onClick={() => handleUnfollow(artist.id)}
                            className="px-4 py-1 text-red-600 hover:text-red-800 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Unfollow
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Merchants Section */}
              {followedMerchants.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Merchants</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {followedMerchants.map((shop) => (
                      <div 
                        key={shop.id} 
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={shop.shop_image || '/placeholder.png'}
                            alt={shop.shop_name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                          />
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {shop.shop_name}
                              {shop.is_Premium && (
                                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  Premium
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{shop.address}</p>
                          </div>
                        </div>

                        <p className="text-gray-600 line-clamp-2 mb-4">{shop.description}</p>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => navigate(`/shop/${shop.id}`)}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Visit Shop
                          </button>
                          <button
                            onClick={() => handleUnfollowMerchant(shop.id)}
                            className="px-4 py-1 text-red-600 hover:text-red-800 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Unfollow
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <img src="/emote/sad.png" alt="No creators" className="w-32 h-32 mb-4" />
              <p className="text-gray-500">You haven't followed any creators yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowedArtists;