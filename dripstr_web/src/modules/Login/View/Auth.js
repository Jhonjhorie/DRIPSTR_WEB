import React, { useState } from "react";
import "daisyui/dist/full.css";
import loginBg from "../Assets/loginBg.jpg";
import logo from "../Assets/logoBlack.png";
import Fb from "../Assets/facebook.png";
import Google from "../Assets/google.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { supabase } from "../../../constants/supabase";  
import { useNavigate } from "react-router-dom";  

const AuthScreen = () => {
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between Sign In and Sign Up
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); // State for modal visibility
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();  

  // Handle input changes for both forms
  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    if (form === "signIn") {
      setSignInData({ ...signInData, [name]: value });
    } else {
      setSignUpData({ ...signUpData, [name]: value });
    }
  };
  const checkAvatarAndRedirect = async (userId) => {
    try {
      // Fetch user profile data (including avatar) from Supabase
      const { data, error } = await supabase
        .from('avatars') // Querying the 'avatars' table
        .select('avatar_id') // Fetching the primary key to check for existence
        .eq('account_id', userId)
        .single();
  
      if (error) {
        console.error('Error fetching user profile:', error.message);
        return;
      }
  
      // Check if avatar exists
      if (data) {
        navigate('/'); // Redirect to homepage if avatar exists
      } else {
        navigate('/account/cc'); // Redirect to create avatar page if no avatar
      }
    } catch (err) {
      console.error('Unexpected error:', err.message);
    }
  };
  
  const handleSignIn = async () => {
    const { email, password } = signInData;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`Sign In Error: ${error.message} please check your email and confirm`);
    } else {
      alert("Sign In successful!");
      // Check if the user has an avatar and redirect accordingly
      checkAvatarAndRedirect(data.user.id);
    }
  };

  const handleSignUp = async () => {
    const { email, password, fullName } = signUpData;

    if (!email || !password || !fullName) {
      alert("Please fill in all the fields.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName, // Custom field to store additional user info
        },
      },
    });

    if (error) {
      alert(`Sign Up Error: ${error.message}`);
    } else {
      alert("Sign Up successful! Please check your email for confirmation.");
      navigate("/Login");  
    }
  };

  const handleToggle = () => {
    setIsSignIn((prev) => !prev);
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordOpen(true);
  };

  const closeForgotPassword = () => {
    setIsForgotPasswordOpen(false);
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      alert("Google login error: " + error.message);
    } else {
      console.log(`Google login successful. Welcome, ${user?.email}!`);
      // Check if the user has an avatar and redirect accordingly
      checkAvatarAndRedirect(user.id);
    }
  };

  // Facebook login handler
  const handleFacebookLogin = async () => {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
    });

    if (error) {
      alert("Facebook login error: " + error.message);
    } else {
      console.log(`Facebook login successful. Welcome, ${user?.email}!`);
      // Check if the user has an avatar and redirect accordingly
      checkAvatarAndRedirect(user.id);
    }
  };

  return (
    <div
      className="hero min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="relative bg-white shadow-2xl rounded-lg overflow-hidden lg:w-3/4 w-full h-[600px]">
        <div className={`absolute inset-0 flex transition-transform duration-500`}>
          {/* Sign In Section */}
          <div className="flex-1 flex flex-col justify-center items-center px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign In</h2>
            <p className="text-gray-600 mb-6">
              Sign in to manage your account and access the dashboard.
            </p>
            <div className="form-control w-full max-w-xs">
            <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered bg-gray-100 w-full mb-4"
                  value={signInData.email}
                  onChange={(e) => handleInputChange(e, "signIn")}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered bg-gray-100 w-full mb-2"
                  value={signInData.password}
                  onChange={(e) => handleInputChange(e, "signIn")}
                />
              <div className="text-right w-full">
                <button
                  onClick={handleForgotPassword}
                  className="text-sm text-purple-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
              <button
                className="btn btn-primary w-full max-w-xs mt-4 bg-purple-600 hover:bg-purple-700 border-none"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            <p className="text-gray-500 my-4">or sign in with</p>
            <div className="flex space-x-4">
              <button
                className="btn btn-outline w-36 text-gray-700 border-gray-300 hover:bg-gray-100"
                onClick={handleGoogleLogin}
              >
                <img src={Google} alt="Logo" className="w-7 mx-auto" /> Google
              </button>
              <button
                className="btn btn-outline w-36 text-gray-700 border-gray-300 hover:bg-gray-100"
                onClick={handleFacebookLogin}
              >
                <img src={Fb} alt="Logo" className="w-7 mx-auto" /> Facebook
              </button>
            </div>
            <p className="mt-4 text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={handleToggle}
                className="text-purple-500 hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Sign Up Section */}
          <div className="flex-1 flex flex-col justify-center items-center px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign Up</h2>
            <p className="text-gray-600 mb-6">
              Create an account and start your journey with us.
            </p>
            <div className="form-control w-full max-w-xs">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="input input-bordered bg-gray-100 w-full mb-4"
                  value={signUpData.fullName}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered bg-gray-100 w-full mb-4"
                  value={signUpData.email}
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered bg-gray-100 w-full mb-2"
                  value={signUpData.password}
                  onChange={handleInputChange}
                />
              </div>
            <button className="btn btn-primary w-full max-w-xs mt-4 bg-purple-600 hover:bg-purple-700 border-none"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            <p className="text-gray-500 my-4">or sign up with</p>
            <div className="flex space-x-4">
              <button
                className="btn btn-outline w-36 text-gray-700 border-gray-300 hover:bg-gray-100"
                onClick={handleGoogleLogin}
              >
                <img src={Google} alt="Logo" className="w-7 mx-auto" /> Google
              </button>
              <button
                className="btn btn-outline w-36 text-gray-700 border-gray-300 hover:bg-gray-100"
                onClick={handleFacebookLogin}
              >
                <img src={Fb} alt="Logo" className="w-7 mx-auto" /> Facebook
              </button>
            </div>
            <p className="mt-4 text-gray-600">
              Already have an account?{" "}
              <button
                onClick={handleToggle}
                className="text-purple-500 hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Logo Section */}
        <div
          className={`absolute inset-y-0 right-0 flex items-center justify-center w-1/2 bg-gradient-to-br from-purple-500 to-purple-700 transition-transform duration-500 ${
            isSignIn ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <img src={logo} alt="Logo" className="w-32 mx-auto" />
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Reset Password
            </h3>
            <p className="text-gray-600 mb-4">
              Enter your email address to reset your password.
            </p>
            <div className="form-control w-full">
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered bg-gray-100 w-full mb-4"
              />
            </div>
            <button className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 border-none mb-4">
              Send Reset Link
            </button>
            <button
              onClick={closeForgotPassword}
              className="btn btn-outline w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthScreen;
