import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../constants/supabase';
import { useAddressFields } from '../../../shared/login/hooks/useAddressFields';
import { v4 as uuidv4 } from 'uuid';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ReactComponent as Logo } from '../../../assets/images/BlackLongLogo.svg'; // Adjust path as needed

const AccountSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobileData, setMobileData] = useState({
    mobile: ''
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

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header with DaisyUI navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="container mx-auto px-4">
          <Logo className="h-8 w-24 sm:h-10 sm:w-32 md:h-12 md:w-36 lg:h-16 lg:w-52" alt="Company Logo" />
        </div>
      </div>

      {/* Main Content */}
      <div className="hero min-h-[calc(100vh-4rem)] py-8">
        <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
          <div className="card-body relative">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Setup Delivery Address
            </h2>

            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Mobile Number Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">Mobile Number</span>
                  </label>
                  <div className="input-group flex flex-row">
                    <span className="bg-base-300 px-4 flex items-center">+63</span>
                    <input
                      type="tel"
                      placeholder="917 123 4567"
                      className={`input input-primary flex-1 ${phoneError ? 'input-error' : ''}`}
                      value={mobileData.mobile}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        setMobileData(prev => ({ ...prev, mobile: formatted }));
                        if (formatted) validatePhoneNumber(formatted);
                      }}
                      required
                    />
                  </div>
                  {phoneError && (
                    <label className="label">
                      <span className="label-text-alt text-error">{phoneError}</span>
                    </label>
                  )}
                </div>

                {/* Region Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">Region</span>
                  </label>
                  <select
                    className="select select-primary w-full"
                    value={selected.region}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    disabled={addressLoading.regions}
                    required
                  >
                    <option value="" disabled>Select Region</option>
                    {addressFields.regions.map(region => (
                      <option key={region.code} value={region.code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">City</span>
                  </label>
                  <select
                    className="select select-primary w-full"
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

                {/* Barangay Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">Barangay</span>
                  </label>
                  <select
                    className="select select-primary w-full"
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

                {/* Exact Location Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">Exact Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="House/Unit No., Street Name, Building"
                    className="input input-primary w-full"
                    value={addressData.exact_location}
                    onChange={(e) => setAddressData({ ...addressData, exact_location: e.target.value })}
                    required
                  />
                </div>

                {/* Postcode Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">Postcode</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Postcode"
                    className="input input-primary w-full"
                    value={addressData.postcode}
                    onChange={(e) => setAddressData({ ...addressData, postcode: e.target.value })}
                    required
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading || phoneError}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      <>Complete Setup<i className="fas fa-check ml-2"></i></>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetup;