import React, { useState, useEffect } from "react";
import "daisyui/dist/full.css";
import logo from "./auth/logoBlack.png";
import Fb from "./auth/facebook.png";
import Google from "./auth/google.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { supabase } from "../../constants/supabase";  
import { useNavigate } from "react-router-dom";  
import useUserProfile from "@/shared/mulletCheck.js";
import addToCart from "@/modules/Products/hooks/useAddtoCart.js";

const AuthModal = ({ isOpen, onClose, actionLog, order }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [loadingP, setLoadingP] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();  
  
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    fullName: "",
    mobile: "",
    gender: "",
    sbirthDate: "",
    address: "",
    potcode: "",
  });

  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    form === "signIn"
      ? setSignInData({ ...signInData, [name]: value })
      : setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSignIn = async () => {
    const { email, password } = signInData;
    if (!email || !password) return alert("Please enter both email and password.");
    setLoadingP(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(`Sign In Error: ${error.message}`);
    alert("Sign In successful!");
    onClose();
    if(actionLog === "cart" || actionLog === "placeOrder"){
    try {
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session || !session.session || !session.session.user) {
        throw new Error("User not logged in or session invalid.");
      }

      const userId = session.session.user.id;
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, mobile , birthday, gender, profile_picture")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      if (actionLog === "cart" && order) {
        const response = await addToCart(
          profileData.id,
          order.itemT.id,
          order.qty,
          order.variant,
          order.size
        );

        if (response.success) {
          console.log("Item added to cart successfully:", response.data);
        } else {
          console.error("Failed to add item to cart:", response.error);
        }

        setTimeout(() => {
          setShowAlert(false);
          navigate("/");
          window.location.reload();
        }, 3000);
      } else if (actionLog === "placeOrder") {
        // Handle place order logic here
      }
    } catch (err) {
      console.log(err.message || "An error occurred while fetching the profile.");
    } finally {
      setLoadingP(false);
    }
  }else{
    
    navigate("/");
    window.location.reload();
  }
  };

  const handleSignUp = async () => {
    const { email, password, fullName, mobile, gender, birthDate, address, postcode } = signUpData;
    if (!email || !password || !fullName || !mobile || !gender || !birthDate || !address || !postcode)
      return alert("Please fill in all fields.");
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { fullName, mobile, gender, birthDate } 
      },
    });

    if (error) return alert(`Sign Up Error: ${error.message}`);
    
    const user = data.user;
    if (user) {
      await supabase.from("addresses").insert({
        user_id: user.id,
        address,
        postcode,
        is_default_shipping: true,
      });
    }

    alert("Sign Up successful! Check your email for confirmation.");
    onClose();
    navigate("/");
    window.location.reload();
  };

  const handleToggle = () => setIsSignIn(!isSignIn);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl">
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{isSignIn ? "Sign In" : "Sign Up"}</h2>

            {/* Form Fields */}
            <div className="form-control w-full">
            {!isSignIn && (
                <>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className="input input-bordered bg-gray-100 w-full mb-4"
                    value={signUpData.fullName}
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number"
                    className="input input-bordered bg-gray-100 w-full mb-4"
                    value={signUpData.mobile}
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                  <select
                    name="gender"
                    className="select select-bordered bg-gray-100 w-full mb-4"
                    value={signUpData.gender}
                    onChange={(e) => handleInputChange(e, "signUp")}
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input
                    type="date"
                    name="birthDate"
                    className="input input-bordered bg-gray-100 w-full mb-4"
                    value={signUpData.birthDate}
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="input input-bordered bg-gray-100 w-full mb-4"
                    value={signUpData.address}
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                  <input
                    type="text"
                    name="postcode"
                    placeholder="Postcode"
                    className="input input-bordered bg-gray-100 w-full mb-4"
                    value={signUpData.postcode}
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                </>
              )}

              
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered bg-gray-100 w-full mb-4"
                value={isSignIn ? signInData.email : signUpData.email}
                onChange={(e) => handleInputChange(e, isSignIn ? "signIn" : "signUp")}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered bg-gray-100 w-full mb-4"
                value={isSignIn ? signInData.password : signUpData.password}
                onChange={(e) => handleInputChange(e, isSignIn ? "signIn" : "signUp")}
              />
            </div>

            <button 
              className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 border-none mt-4"
              onClick={isSignIn ? handleSignIn : handleSignUp}
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>

            <p className="mt-4 text-gray-600 text-center">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={handleToggle} className="text-purple-500 hover:underline font-medium">
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;