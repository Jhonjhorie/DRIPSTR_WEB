import React, { useState } from "react";
import "daisyui/dist/full.css";
import loginBg from "../Assets/loginBg.jpg";
import logo from "../Assets/logoBlack.png";
import Fb from "../Assets/facebook.png";
import Google from "../Assets/google.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { supabase } from "../../../constants/supabase";  
import { useNavigate } from "react-router-dom";  
import AuthModal from "../../../shared/login/Auth";

const AuthScreen = () => {
  const [authOpen, setAuthOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ fullName: "", email: "", password: "" });
  const navigate = useNavigate();  

  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    form === "signIn"
      ? setSignInData({ ...signInData, [name]: value })
      : setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSignIn = async () => {
    const { email, password } = signInData;
    if (!email || !password) return alert("Please enter both email and password.");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(`Sign In Error: ${error.message}`);
    alert("Sign In successful!");
    navigate("/");
  };

  const handleSignUp = async () => {
    const { email, password, fullName } = signUpData;
    if (!email || !password || !fullName) return alert("Please fill in all fields.");
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { fullName } } });
    if (error) return alert(`Sign Up Error: ${error.message}`);
    alert("Sign Up successful! Check your email for confirmation.");
    navigate("/Login");
  };

  const toggleAuthModal = () => setIsModalOpen(!isModalOpen);
  const toggleAuthMode = () => setIsSignIn(!isSignIn);

  return (
    <div className="hero min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${loginBg})` }}>
      <button onClick={toggleAuthModal} className="btn btn-primary">Sign In / Sign Up</button>



 
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />


      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{isSignIn ? "Sign In" : "Sign Up"}</h3>
            <div className="form-control w-full">
              {!isSignIn && (
                <input type="text" name="fullName" placeholder="Full Name" className="input input-bordered bg-gray-100 w-full mb-2" value={signUpData.fullName} onChange={(e) => handleInputChange(e, "signUp")} />
              )}
              <input type="email" name="email" placeholder="Email" className="input input-bordered bg-gray-100 w-full mb-2" value={isSignIn ? signInData.email : signUpData.email} onChange={(e) => handleInputChange(e, isSignIn ? "signIn" : "signUp")} />
              <input type="password" name="password" placeholder="Password" className="input input-bordered bg-gray-100 w-full mb-4" value={isSignIn ? signInData.password : signUpData.password} onChange={(e) => handleInputChange(e, isSignIn ? "signIn" : "signUp")} />
            </div>
            <button className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 border-none mb-2" onClick={isSignIn ? handleSignIn : handleSignUp}>{isSignIn ? "Sign In" : "Sign Up"}</button>
            <p className="text-gray-600 text-center">{isSignIn ? "Don't have an account?" : "Already have an account?"} <button onClick={toggleAuthMode} className="text-purple-500 hover:underline font-medium">{isSignIn ? "Sign Up" : "Sign In"}</button></p>
            <button onClick={toggleAuthModal} className="btn btn-outline w-full mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthScreen;
