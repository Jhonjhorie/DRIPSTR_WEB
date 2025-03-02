import React, { useState } from "react";
import "daisyui/dist/full.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { supabase } from "../../constants/supabase";  
import { useNavigate } from "react-router-dom";  
import SuccessModal from './components/SuccessModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import GmailConfirmationModal from './components/GmailConfirmationModal';
import Toast from "../../shared/alerts"; 
const modalTransitionClass = "transition-all duration-300 ease-in-out";
const formTransitionClass = "transition-all duration-500 ease-in-out transform";

const LOADING_ANIMATIONS = {
  DOTS: 'loading-dots',
  SPINNER: 'loading-spinner',
  RING: 'loading-ring',
  BALL: 'loading-ball'
};

const AuthModal = ({ isOpen, onClose, actionLog, item }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const navigate = useNavigate();  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    signIn: false,
    signUp: false
  });
   const [isLoading, setIsLoading] = useState({
    signIn: false,
    signUp: false
  });
  const [signInData, setSignInData] = useState({ 
    email: "", 
    password: "" 
  });

  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    fullName: ""  // Add this line
  });

  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    form === "signIn"
      ? setSignInData({ ...signInData, [name]: value })
      : setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSignIn = async () => {
    const { email, password } = signInData;
    if (!email || !password) {
      setToast({ 
        show: true, 
        message: "Please enter both email and password.", 
        type: 'warning' 
      });
      return;
    }
  
    setIsLoading(prev => ({ ...prev, signIn: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
  
      setIsSuccessModalOpen(true);
      // Add immediate refresh after successful login
      setTimeout(() => {
        if (item) {
          navigate(`/product/${item.item_Name}`, { state: { item } });
        } else {
          navigate("/");
        }
        window.location.reload();
      }, 1500); // Reduced to 1.5 seconds for better UX
    } catch (error) {
      setToast({ 
        show: true, 
        message: `Sign In Error: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(prev => ({ ...prev, signIn: false }));
    }
  };

  const handleSignUp = async () => {
    const { email, password, fullName } = signUpData;
    
    if (!email || !password || !fullName) {
      setToast({ 
        show: true, 
        message: "Please fill in all fields.", 
        type: 'warning' 
      });
      return;
    }
  
    setIsLoading(prev => ({ ...prev, signUp: true }));
    try {
      const { user, error } = await signUpUser({ email, password, fullName });
  
      if (error) throw new Error(error);
  
      setIsGmailModalOpen(true);
      setToast({ 
        show: true, 
        message: "Registration successful! Please check your email.", 
        type: 'success' 
      });
    } catch (error) {
      console.error('Signup error:', error);
      setToast({ 
        show: true, 
        message: `Sign Up Error: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(prev => ({ ...prev, signUp: false }));
    }
  };

  const handlePostLoginAction = (isLogin) => {
    if (item) {
      setTimeout(() => {
        navigate(`/product/${item.item_Name}`, { state: { item } });
        window.location.reload();
      }, 3000);   
    } else {
      if (isLogin) {
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 3000);   
      } else {
        setTimeout(() => {
          setIsSuccessModalOpen(false);
          onClose();
          navigate("/");
        }, 2000);   
      }
    }
  };

  const handleToggle = () => setIsSignIn(!isSignIn);

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />  
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className={`bg-white p-6 rounded-lg shadow-xl relative ${modalTransitionClass} w-[400px]`}>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl">
              &times;
            </button>

            <h2 className={`text-2xl font-bold text-gray-800 mb-4 ${formTransitionClass}`}>
              {isSignIn ? "Login" : "Register"}
            </h2>

            <div className={`form-control w-full ${formTransitionClass}`}>
              {!isSignIn ? (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    name="fullName" 
                    placeholder="Full Name" 
                    className="input input-bordered bg-gray-100 w-full" 
                    value={signUpData.fullName} 
                    onChange={(e) => handleInputChange(e, "signUp")} 
                  />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    className="input input-bordered bg-gray-100 w-full" 
                    value={signUpData.email} 
                    onChange={(e) => handleInputChange(e, "signUp")} 
                  />
                  <div className="relative">
                    <input
                      type={showPassword.signUp ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="input input-bordered bg-gray-100 w-full"
                      value={signUpData.password}
                      onChange={(e) => handleInputChange(e, "signUp")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(prev => ({...prev, signUp: !prev.signUp}))}
                    >
                      <i className={`fas ${showPassword.signUp ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 opacity-100 transition-opacity duration-500 w-full">
                  <input type="email" name="email" placeholder="Email" className="input input-bordered bg-gray-100 w-full mb-4" value={signInData.email} onChange={(e) => handleInputChange(e, "signIn")} />
                  <div className="relative w-full">
                    <input
                      type={showPassword.signIn ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="input input-bordered bg-gray-100 w-full pr-10"
                      value={signInData.password}
                      onChange={(e) => handleInputChange(e, "signIn")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(prev => ({...prev, signIn: !prev.signIn}))}
                    >
                      <i className={`fas ${showPassword.signIn ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  <button onClick={() => setIsForgotPasswordOpen(true)} className="text-sm text-purple-600 hover:text-purple-700 self-end">Forgot Password?</button>
                </div>
              )}
            </div>

            <button 
              className={`
                btn w-full bg-purple-600 hover:bg-purple-700 border-none mt-6 
                ${formTransitionClass} 
                ${(isSignIn ? isLoading.signIn : isLoading.signUp) ? `loading ${LOADING_ANIMATIONS.DOTS}` : ''}
              `}
              onClick={isSignIn ? handleSignIn : handleSignUp}
              disabled={isSignIn ? isLoading.signIn : isLoading.signUp}
            >
              {!isLoading.signIn && !isLoading.signUp && (
                <span className="inline-flex items-center">
                  {isSignIn ? (
                    <>
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Login
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus mr-2"></i>
                      Register
                    </>
                  )}
                </span>
              )}
            </button>

            <p className={`mt-4 text-gray-600 text-center ${formTransitionClass}`}>
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={handleToggle} className="text-purple-500 hover:underline font-medium transition-colors duration-300">
                {isSignIn ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>
      )}

      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <GmailConfirmationModal 
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        email={signUpData.email}
      />
    </>
  );
};

export default AuthModal;

export async function signUpUser({ email, password, fullName }) {
  try {
    // First, check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: `${window.location.origin}/account-setup`
      }
    });

    if (authError) throw authError;

    const user = authData.user;
    if (!user) throw new Error('User creation failed');

    // Create profile entry with upsert (will update if exists, insert if doesn't)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: user.id,
          full_name: fullName,
          email: email,
                  }
      ], 
      { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });

    if (profileError) throw profileError;

    return { user, error: null };

  } catch (error) {
    console.error('Error during sign up:', error.message);
    return { user: null, error: error.message };
  }
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

