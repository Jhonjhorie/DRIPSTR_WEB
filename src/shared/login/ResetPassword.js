import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../constants/supabase';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage('Password updated successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reset Password</h2>
        
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="input input-bordered bg-gray-100 w-full"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="input input-bordered bg-gray-100 w-full"
              required
            />
          </div>

          {message && (
            <p className={`text-sm ${
              message.includes('successfully') ? 'text-green-500' : 'text-red-500'
            }`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 border-none"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;