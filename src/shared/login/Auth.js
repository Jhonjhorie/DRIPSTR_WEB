import React, { useState, useEffect } from "react";
import axios from 'axios';
import "daisyui/dist/full.css";
import logo from "./auth/logoBlack.png";
import Fb from "./auth/facebook.png";
import Google from "./auth/google.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { supabase } from "../../constants/supabase";  
import { useNavigate } from "react-router-dom";  
import useUserProfile from "@/shared/mulletCheck.js";
import addToCart from "@/modules/Products/hooks/useAddtoCart.js";
import SuccessModal from './components/SuccessModal';
import { useAddressFields } from './hooks/useAddressFields';
import ForgotPasswordModal from './components/ForgotPasswordModal';

const modalTransitionClass = "transition-all duration-300 ease-in-out";
const formTransitionClass = "transition-all duration-500 ease-in-out transform";

const validatePhilippinePhone = (phone) => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it starts with +63 or 0 and has 10-11 digits
  const pattern = /^(09|\+639)\d{9}$/;
  
  return {
    isValid: pattern.test(cleanPhone),
    formattedNumber: cleanPhone.startsWith('0') ? cleanPhone : `0${cleanPhone.slice(2)}`
  };
};

const AuthModal = ({ isOpen, onClose, actionLog, item }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [loadingP, setLoadingP] = useState(false);
  const [profile, setProfile] = useState(null);

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const navigate = useNavigate();  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const {
    addressData: { regions, provinces, cities, barangays },
    selected,
    loading,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    setSelected
  } = useAddressFields(isOpen, isSignIn);


  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    fullName: "",
    mobile: "",
    gender: "",
    birthDate: "",
    postcode: "",
  });

  

  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    
    if (form === "signUp" && name === "mobile") {
      // Only allow numbers and + symbol
      const sanitizedValue = value.replace(/[^\d+]/g, '');
      
      // Validate phone number
      const { isValid, formattedNumber } = validatePhilippinePhone(sanitizedValue);
      
      // Update the input field
      setSignUpData(prev => ({
        ...prev,
        [name]: sanitizedValue,
        mobileValid: isValid
      }));
      
      // Show validation message
      if (value && !isValid) {
        setValidationErrors(prev => ({
          ...prev,
          mobile: "Please enter a valid Philippine mobile number (e.g., 09123456789 or +639123456789)"
        }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          mobile: null
        }));
      }
      return;
    }
  
    // Handle other inputs normally
    form === "signIn"
      ? setSignInData({ ...signInData, [name]: value })
      : setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSignIn = async () => {
    const { email, password } = signInData;
    if (!email || !password) return alert("Please enter both email and password.");
    setLoadingP(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setLoadingP(false);
      return alert(`Sign In Error: ${error.message}`);
    }

    // Show success modal
    setIsSuccessModalOpen(true);
    
    // Close success modal and proceed after 2 seconds
    setTimeout(async () => {
      setIsSuccessModalOpen(false);
      onClose();
      
      if(actionLog === "cart" || actionLog === "placeOrder") {
        try {
          // ...existing cart/order logic...
        } catch (err) {
          console.log(err.message || "An error occurred while fetching the profile.");
        } finally {
          setLoadingP(false);
        }
      } else {
        navigate("/");
        window.location.reload();
      }
    }, 2000);
  };


  
  const handleSignUp = async () => {
    const {
      email,
      password,
      fullName,
      mobile,
      gender,
      birthDate,
      postcode,
    } = signUpData;

const { isValid, formattedNumber } = validatePhilippinePhone(mobile);
      if (!isValid) {
        throw new Error("Please enter a valid Philippine mobile number");
      }

    if (
      !email ||
      !password ||
      !fullName ||
      !mobile ||
      !gender ||
      !birthDate ||
      !postcode || 
          !selected.region || !selected.city || !selected.barangay)
      return alert("Please fill in all fields.");

 const fullAddress = `${selected.barangay}, ${selected.city}, ${selected.province}, ${selected.region}`;


    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullName, mobile, gender, birthDate },
      },
    });

  if (error) throw new Error(error.message);

const user = data.user;
      if (!user) throw new Error("User creation failed");

   const { error: addressError } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          address: fullAddress,
          full_address: fullAddress,
          region: selected.region,
          province: selected.province,
          city: selected.city,
          barangay: selected.barangay,
          postcode,
          is_default_shipping: true
        });

 if (addressError) throw new Error(addressError.message);
setIsSuccessModalOpen(true);
    setShowAlert(true);

    handlePostLoginAction();
  };

  const handlePostLoginAction = (isLogin) => {
    if (item) {
      setTimeout(() => {
        navigate(`/product/${item.item_Name}`, { state: { item } });
        window.location.reload();
        setShowAlert(false);
      }, 3000);
    } else {
      if(isLogin) {
            setTimeout(() => {
              navigate("/");
              window.location.reload();
              setShowAlert(false);
            }, 3000);
      }else{
            setTimeout(() => {
              setIsSuccessModalOpen(false);
              onClose();
              navigate("/login");
      setShowAlert(false);
            }, 2000);
      }
    }
  }
    useEffect(() => {
      console.log('Address Data:', { regions, provinces, cities, barangays });
      console.log('Selected:', selected);
      console.log('Loading:', loading);
    }, [regions, provinces, cities, barangays, selected, loading]);

  const handleToggle = () => setIsSignIn(!isSignIn);


  
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white p-6 rounded-lg shadow-xl relative ${modalTransitionClass} ${
            isSignIn ? 'w-[400px]' : 'w-[800px]'
          }`}>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl">
              &times;
            </button>

            <h2 className={`text-2xl font-bold text-gray-800 mb-4 ${formTransitionClass}`}>
              {isSignIn ? "Login" : "Sign Up"}
            </h2>

            {/* Form Fields */}
            <div className={`form-control w-full ${formTransitionClass}`}>
              {!isSignIn ? (
                <div className="flex gap-6 opacity-100 transition-opacity duration-500">
                  {/* Left Column - Personal Information */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h3>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      className="input input-bordered bg-gray-100 w-full"
                      value={signUpData.fullName}
                      onChange={(e) => handleInputChange(e, "signUp")}
                    />
                    <select
                      name="gender"
                      className="select select-bordered bg-gray-100 w-full"
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
                      className="input input-bordered bg-gray-100 w-full"
                      value={signUpData.birthDate}
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
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="input input-bordered bg-gray-100 w-full"
                      value={signUpData.password}
                      onChange={(e) => handleInputChange(e, "signUp")}
                    />
                  </div>

                  {/* Right Column - Address Information */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Set up delivery Information</h3>
                    <select
                      name="region"
                      className="select select-bordered bg-gray-100 w-full"
                      value={selected.region}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      disabled={loading.regions}
                    >
                      <option value="">
                        {loading.regions ? 'Loading regions...' : 'Select Region'}
                      </option>
                      {regions.map(region => (
                        <option key={region.code} value={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>

                    <select
                      name="city"
                      className="select select-bordered bg-gray-100 w-full"
                      value={selected.city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      disabled={!selected.region || loading.cities}
                    >
                      <option value="">
                        {loading.cities ? 'Loading cities...' : 'Select City/Municipality'}
                      </option>
                      {cities.map(city => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                    </select>

                    <select
                      name="barangay"
                      className="select select-bordered bg-gray-100 w-full"
                      value={selected.barangay}
                      onChange={(e) => setSelected(prev => ({ ...prev, barangay: e.target.value }))}
                      disabled={!selected.city || loading.barangays}
                    >
                      <option value="">
                        {loading.barangays ? 'Loading barangays...' : 'Select Barangay'}
                      </option>
                      {barangays.map(barangay => (
                        <option key={barangay.code} value={barangay.code}>
                          {barangay.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      name="exactLocation"
                      placeholder="Street, Block, Building, Floor, etc."
                      className="input input-bordered bg-gray-100 w-full"
                      value={selected.exactLocation}
                      onChange={(e) => setSelected(prev => ({ ...prev, exactLocation: e.target.value }))}
                    />

                    <input
                      type="text"
                      name="postcode"
                      placeholder="Postcode"
                      className="input input-bordered bg-gray-100 w-full"
                      value={signUpData.postcode}
                      onChange={(e) => handleInputChange(e, "signUp")}
                    />
                    <div className="relative">
                      <input
                        type="text"
                        name="mobile"
                        placeholder="Mobile Number (e.g., 09123456789)"
                        className={`input input-bordered bg-gray-100 w-full ${
                          validationErrors.mobile ? 'border-red-500' : ''
                        }`}
                        value={signUpData.mobile}
                        onChange={(e) => handleInputChange(e, "signUp")}
                        maxLength="13"
                      />
                      {validationErrors.mobile && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.mobile}
                        </p>
                      )}
                      {signUpData.mobileValid && (
                        <span className="absolute right-3 top-3 text-green-500">
                          <i className="fas fa-check-circle"></i>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 opacity-100 transition-opacity duration-500">
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
                    className="input input-bordered bg-gray-100 w-full mb-4"
                    value={signInData.password}
                    onChange={(e) => handleInputChange(e, "signIn")}
                  />
                  
                  {/* Add Forgot Password link */}
                  <button
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-sm text-purple-600 hover:text-purple-700 self-end"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* Button and toggle section remains at the bottom */}
            <button 
              className={`btn btn-primary w-full bg-purple-600 hover:bg-purple-700 border-none mt-6 ${formTransitionClass}`}
              onClick={isSignIn ? handleSignIn : handleSignUp}
            >
              {isSignIn ? "Login" : "Sign Up"}
            </button>

            <p className={`mt-4 text-gray-600 text-center ${formTransitionClass}`}>
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={handleToggle} className="text-purple-500 hover:underline font-medium transition-colors duration-300">
                {isSignIn ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Add Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
};

export default AuthModal;
