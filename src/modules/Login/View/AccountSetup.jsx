import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../constants/supabase'; // Adjust the path based on your project structure

const AccountSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    bio: '',
    avatar: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email_confirmed_at) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: userData.username,
          bio: userData.bio,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      navigate('/');
    } catch (error) {
      console.error('Profile update error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              value={userData.bio}
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
              className="textarea textarea-bordered w-full"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Complete Setup'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSetup;