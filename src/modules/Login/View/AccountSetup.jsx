import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../constants/supabase';
import { useAddressFields } from '../../../shared/login/hooks/useAddressFields';
import { v4 as uuidv4 } from 'uuid';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const AccountSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileData, setMobileData] = useState({
    mobile: '',
    verificationCode: '',
    sentCode: null
  });
  const [addressData, setAddressData] = useState({
    exact_location: '',
    postcode: ''
  });
  const [phoneError, setPhoneError] = useState('');

  const {
    addressData: addressFields,
    selected,
    loading: addressLoading,
    handleRegionChange,
    handleCityChange,
    setSelected
  } = useAddressFields(true, false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email_confirmed_at) {
          navigate('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const formatPhoneNumber = (value) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(value, 'PH');
      if (phoneNumber) {
        return phoneNumber.format('NATIONAL');
      }
      return value;
    } catch (error) {
      return value;
    }
  };

  const validatePhoneNumber = (value) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(value, 'PH');
      if (!phoneNumber) {
        setPhoneError('Invalid phone number format');
        return false;
      }
      if (!phoneNumber.isValid()) {
        setPhoneError('Please enter a valid Philippine phone number');
        return false;
      }
      setPhoneError('');
      return true;
    } catch (error) {
      setPhoneError('Invalid phone number');
      return false;
    }
  };

  const handleSendVerificationCode = async () => {
    if (!mobileData.mobile) {
      setPhoneError('Please enter a mobile number');
      return;
    }

    if (!validatePhoneNumber(mobileData.mobile)) {
      return;
    }

    setLoading(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setMobileData(prev => ({ ...prev, sentCode: code }));
      
      alert(`Demo verification code: ${code}`);
    } catch (error) {
      console.error('Error sending code:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = () => {
    if (mobileData.verificationCode === mobileData.sentCode) {
      handleFinalSubmit();
    } else {
      alert('Invalid verification code');
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No authenticated user found');

      const selectedRegion = addressFields.regions.find(r => r.code === selected.region)?.name;
      const selectedCity = addressFields.cities.find(c => c.code === selected.city)?.name;
      const selectedBarangay = addressFields.barangays.find(b => b.code === selected.barangay)?.name;

      const fullAddress = `${selectedBarangay}, ${selectedCity}, ${selectedRegion}`;

      const { error: addressError } = await supabase
        .from('addresses')
        .insert([{
          id: uuidv4(),
          user_id: user.id,
          region: selectedRegion,
          city: selectedCity,
          barangay: selectedBarangay,
          exact_location: addressData.exact_location,
          postcode: addressData.postcode,
          full_address: `${addressData.exact_location}, ${fullAddress}`,
          is_default_shipping: true
        }]);

      if (addressError) throw addressError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ mobile: mobileData.mobile })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      navigate('/');
    } catch (error) {
      console.error('Setup error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Setup Delivery Address
            </h2>
            
            {/* Enhanced input group styling */}
            <div className="grid grid-cols-1 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Region</span>
                </label>
                <select
                  className="select select-bordered w-full bg-gray-50 hover:bg-white"
                  value={selected.region}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  disabled={addressLoading.regions}
                  required
                >
                  <option value="">Select Region</option>
                  {addressFields.regions.map(region => (
                    <option key={region.code} value={region.code}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">City</span>
                </label>
                <select
                  className="select select-bordered w-full bg-gray-50 hover:bg-white"
                  value={selected.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  disabled={!selected.region || addressLoading.cities}
                  required
                >
                  <option value="">Select City</option>
                  {addressFields.cities.map(city => (
                    <option key={city.code} value={city.code}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Barangay</span>
                </label>
                <select
                  className="select select-bordered w-full bg-gray-50 hover:bg-white"
                  value={selected.barangay}
                  onChange={(e) => setSelected(prev => ({ ...prev, barangay: e.target.value }))}
                  disabled={!selected.city || addressLoading.barangays}
                  required
                >
                  <option value="">Select Barangay</option>
                  {addressFields.barangays.map(barangay => (
                    <option key={barangay.code} value={barangay.code}>
                      {barangay.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Exact Location</span>
                </label>
                <input
                  type="text"
                  placeholder="House/Unit No., Street Name, Building"
                  className="input input-bordered w-full bg-gray-50 hover:bg-white"
                  value={addressData.exact_location}
                  onChange={(e) => setAddressData({ ...addressData, exact_location: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Postcode</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Postcode"
                  className="input input-bordered w-full bg-gray-50 hover:bg-white"
                  value={addressData.postcode}
                  onChange={(e) => setAddressData({ ...addressData, postcode: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Verify Mobile Number
            </h2>
            
            <div className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">Mobile Number</span>
                </label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        placeholder="Enter mobile number (e.g., 0917 123 4567)"
                        className={`input input-bordered w-full bg-gray-50 hover:bg-white pl-20 ${
                          phoneError ? 'input-error' : ''
                        }`}
                        value={mobileData.mobile}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          setMobileData(prev => ({ ...prev, mobile: formatted }));
                          if (formatted) validatePhoneNumber(formatted);
                        }}
                        required
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        +63 |
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary px-6 hover:shadow-md transition-shadow"
                      onClick={handleSendVerificationCode}
                      disabled={loading || !mobileData.mobile || phoneError}
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Send
                        </>
                      )}
                    </button>
                  </div>
                  {phoneError && (
                    <span className="text-error text-sm animate-fadeIn">
                      {phoneError}
                    </span>
                  )}
                </div>
              </div>

              {mobileData.sentCode && (
                <div className="form-control animate-fadeIn">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">Verification Code</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="input input-bordered w-full bg-gray-50 hover:bg-white text-center text-xl tracking-wider"
                    value={mobileData.verificationCode}
                    onChange={(e) => setMobileData(prev => ({ ...prev, verificationCode: e.target.value }))}
                    maxLength={6}
                    required
                  />
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[600px] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full translate-y-16 -translate-x-16 opacity-20"></div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 relative z-10">
          <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-counter">
              {currentStep > 1 ? (
                <i className="fas fa-check text-sm"></i>
              ) : (
                <span>1</span>
              )}
            </div>
            <p className="text-sm mt-2 font-medium">Delivery Address</p>
          </div>
          <div className="step-divider"></div>
          <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-counter">2</div>
            <p className="text-sm mt-2 font-medium">Mobile Verification</p>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === 1) {
            setCurrentStep(2);
          } else {
            verifyCode();
          }
        }} className="space-y-6 relative z-10">
          {renderStep()}

          <div className="flex justify-between mt-12 gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-outline border-2 hover:bg-purple-50 px-8"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </button>
            )}
            <button
              type="submit"
              className={`btn ${currentStep === 1 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none`}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : currentStep === 1 ? (
                <>
                  Next
                  <i className="fas fa-arrow-right ml-2"></i>
                </>
              ) : (
                <>
                  Complete Setup
                  <i className="fas fa-check ml-2"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .step-item {
          @apply flex flex-col items-center relative;
        }
        .step-counter {
          @apply w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-200 bg-white text-gray-500 font-semibold transition-all duration-300;
        }
        .step-divider {
          @apply w-24 h-0.5 mx-4 bg-gray-200 transition-all duration-300;
        }
        .step-item.active .step-counter {
          @apply border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-200;
        }
        .step-item.active + .step-divider {
          @apply bg-purple-600;
        }
        
        /* Input field enhancements */
        .input, .select {
          @apply transition-all duration-300 shadow-sm focus:ring-2 focus:ring-purple-200;
        }
        
        /* Label animations */
        label {
          @apply transition-all duration-300;
        }
        
        .input:focus + label,
        .select:focus + label {
          @apply text-purple-600;
        }

        /* Phone number input animations */
        .animate-fadeIn {
          @apply opacity-0;
          animation: fadeIn 0.3s ease-in-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .input-error {
          @apply border-error focus:border-error;
        }
      `}</style>
    </div>
  );
};

export default AccountSetup;