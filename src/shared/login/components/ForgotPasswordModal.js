import React, { useState } from 'react';
import { supabase } from '../../../constants/supabase';
import ResetPasswordConfirmationModal from './ResetPasswordConfirmationModal';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://dripstr-web.vercel.app/reset-password',
      });

      if (error) throw error;

      setShowConfirmation(true);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-[400px] relative">
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input input-bordered bg-gray-100 w-full"
                required
              />
            </div>

            {message && (
              <p className={`text-sm ${
                message.includes('error') ? 'text-red-500' : 'text-green-500'
              }`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 border-none"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>
        </div>
      </div>

      <ResetPasswordConfirmationModal
        isOpen={showConfirmation}
        onClose={handleClose}
        email={email}
      />
    </>
  );
};

export default ForgotPasswordModal;