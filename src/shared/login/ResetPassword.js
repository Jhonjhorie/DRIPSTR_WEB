import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../constants/supabase';
import Toast from '../alerts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
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

      setToast({
        show: true,
        message: 'Password updated successfully!',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="input input-bordered bg-gray-100 w-full pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="input input-bordered bg-gray-100 w-full pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
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

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default ResetPassword;