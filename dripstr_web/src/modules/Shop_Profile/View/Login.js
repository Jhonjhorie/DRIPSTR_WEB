import React, {useEffect, useState} from 'react';
import logo from '../../../assets/shop/logoWhite.png';
import '../../../assets/shop/fonts/font.css'
import { useNavigate } from 'react-router-dom';
import 'boxicons'
import { supabase } from "../../../constants/supabase";  
function Login() { 
    const navigate = useNavigate();
    const [shopName, setShopName] = useState(""); 
    const [phoneNumber, setPhoneNumber] = useState('');
    const [shopDescription, setShopDescription] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [showAlert, setShowAlert] = React.useState(false); // AlertShopname
    const [showAlert2, setShowAlert2] = React.useState(false); // AlertContact
    const [showAlert3, setShowAlert3] = React.useState(false); // AlertDescription
    const [showAlert4, setShowAlert4] = React.useState(false); // Alert11digits
    const [showAlert5, setShowAlert5] = React.useState(false); // AlertAddress
    const [user, setUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);  // State to hold the image file

    const handleFileChange = (e) => {
      const file = e.target.files[0]; // Get the selected file
      if (file) {
        setImageFile(file); // Store the file in state
        console.log("Selected file:", file);
      }
    };
    
    useEffect(() => {
      const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log("Current user:", user);
      };
  
      getUser();
    }, []);
    const phonedigit = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, '').slice(0, 11); 
        setPhoneNumber(value);
      };

        // Handle input change 
      const handleShopNameChange = (e) => setShopName(e.target.value);
      const handleShopAddressChange = (e) => setShopAddress(e.target.value);
      const handleShopDescriptionChange = (e) => setShopDescription(e.target.value);


     // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (!shopName.trim()) {
        console.error("Shop name is required");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
      }, 3000);
      return; // Do not proceed if the field is empty
      }
      if (!phoneNumber.trim()) {
        console.error('Phone Number is required');
        setShowAlert2(true);
        setTimeout(() => {
          setShowAlert2(false);
      }, 3000);
        return; // Do not proceed if the phone number is empty
      }
      if (phoneNumber.length !== 11) {
        console.error('Phone Number must be 11 digits');
        setShowAlert4(true);
        setTimeout(() => {
          setShowAlert4(false);
      }, 3000);
        return; // Ensure phone number is exactly 11 digits
      }
      if (!shopDescription.trim()) {
        console.error("Shop Description is required");
        setShowAlert5(true);
        setTimeout(() => {
          setShowAlert5(false);
      }, 3000);
        return; // Do not proceed if the field is empty
      }
      if (!shopAddress.trim()) {
        console.error("Shop Address is required");
        setShowAlert3(true);
        setTimeout(() => {
          setShowAlert3(false);
      }, 3000);
        return; // Do not proceed if the field is empty
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No user found");
        return;
      }

      let uploadedImageUrl = null;
      if (imageFile) {
        try {
          // Upload the image to Supabase storage
          const { data, error: uploadError } = await supabase.storage
            .from('shop_profile')  // Replace with your storage bucket name
            .upload(`shop_profile/${imageFile.name}`, imageFile);
    
          if (uploadError) {
            console.error("Error uploading image:", uploadError.message);
            return; // Exit if there's an error uploading the image
          }
 if (data?.path) {
      const { publicURL, error: urlError } = supabase.storage
        .from('shop_profile')
        .getPublicUrl(data.path);

      if (urlError) {
        console.error("Error fetching image URL:", urlError.message);
        return; // Exit if there's an error fetching the image URL
      }

      uploadedImageUrl = publicURL; // Correctly assign the public URL
      console.log("Image uploaded successfully:", uploadedImageUrl);
    }
  } catch (err) {
    console.error("Unexpected error while uploading image:", err);
    return; // Exit if there's an unexpected error during image upload
  }
      }
  
      const userId = user.id;  // Get the current user's ID

      try {
        // Fetch current user ID
      
    
        // Insert the shop with the user ID as the owner ID
        const { data: shopData, error: shopError } = await supabase
          .from("shop")
          .insert([
            {
              shop_name: shopName,
              contact_number: phoneNumber,
              description: shopDescription,
              address: shopAddress,
              owner_Id: userId,  // Set the owner_id to the current user's ID
              shop_image: uploadedImageUrl, 
            },
          ])
          .single();  // Insert a single shop and get the inserted row
    
        if (shopError) {
          console.error("Error inserting shop data:", shopError.message);
          return; // Exit early if there's an error inserting the shop data
        }
    
        console.log("Shop created successfully:", shopData);
    
        // Now, update the user's profile to set merchant_id to the new shop's shop_id
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ isMerchant: true })
          .eq("id", userId);  // Update the user's profile with ismerchant = true
    
        if (updateError) {
          console.error("Error updating user profile:", updateError.message);
          return; // Exit if there's an error updating the user profile
        }
    
        console.log("User profile updated with merchant_id and ismerchant = true");
        console.log("Inserting shop with data:", {
          shop_name: shopName,
          contact_number: phoneNumber,
          description: shopDescription,
          address: shopAddress,
          owner_Id: userId,
      });
        // Reset form fields after successful insertion
        setShopName("");
        setPhoneNumber("");
        setShopDescription("");
        
    
        // Navigate to the Merchant Dashboard
        navigate('/shop/MerchantDashboard');
      } catch (err) {
        console.error("Unexpected error:", err);
      }
  };

  return (
<div className="h-full w-full relative">
  <div className="h-auto w-full lg:flex bg-slate-300 p-1  ">
    {/* FIRST CONTAINER */}
   
    <div className=' h-auto w-full lg:w-[55%] md:p-10 overflow-hidden '>
        <div className='flex md:gap-2 md:justify-start justify-center  '>
            <box-icon name='store' type='solid' color='#4D077C' size='md'  ></box-icon>
            <div className='font-bold text-2xl  flex p-2 text-custom-purple iceland-regular '>Create Merchant Account</div>
        </div>
        <div className='font-bold text-5xl text-center md:text-left p-2 text-custom-purple iceland-bold'>Get Started</div>
        <form onSubmit={handleSubmit}>

        <div className='md:flex w-full place-items-center h-[50%] gap-2 lg:gap-8  p-2 '>
            <div className='w-full lg:w-1/2 h-full flex  items-center justify-center'>
                <div className='w-full max-w-xs'>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-slate-800 font-semibold">What is your SHOP name?</span>
                        </div>
                        <input
                        id="shopName"
                        value={shopName}
                        onChange={handleShopNameChange}
                        type="text" placeholder="Type here" className="input input-bordered text-black bg-slate-100 border-violet-950 border-[2px] w-full" />
                    </label>
                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text text-slate-800 font-semibold">What is your SHOP contact number?</span>
                        </div>
                        <input 
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            placeholder="Type here"
                            onChange={phonedigit}
                            className="input input-bordered bg-slate-100 text-black border-violet-950 border-[2px] w-full"
                        />
                    </label>
                    <div className="label">
                        <span className="label-text-alt text-slate-700">Phone number should be 11 digits.</span>
                    </div>

                    <label className="form-control w-full max-w-xs ">
                        <div className="label">
                            <span className="label-text font-semibold text-slate-800 ">Shop description?</span>
                        </div>
                       <textarea
                       id="shopDescription"
                       value={shopDescription}
                       onChange={handleShopDescriptionChange}
                       className='w-full textarea h-14 textarea-bordered bg-slate-100 text-black border-violet-950 rounded-md border-[2px] p-1 resize-none' ></textarea>
                    </label>
                </div>
            </div>

            <div className="w-full md:w-1/2 h-full rounded-md  place-items-center justify-center p-2">
                <div className="bg-slate-100 w-72 h-52 flex items-center justify-center mt-5 border-violet-950 border-2 rounded-md">
                    {/* SHOP LOGO GOES HERE */}
                    <box-icon name="image" type="solid" size="100px" color="#6803a0"></box-icon>
                </div>
                <div className="h-auto w-full flex mt-6 justify-center ">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input bg-slate-100 border-violet-950 border-2 max-w-xs  bottom-0 file-input-bordered w-full"
                    />
                </div>
            </div>

        </div>

            <label className="form-control mx-2 flex justify-center items-center md:items-start ">
                <div className="label">
                    <span className="label-text font-semibold text-slate-800">What is your SHOP address?</span>
                 
                </div>
                <textarea
                value={shopAddress}
                 onChange={handleShopAddressChange}
                className="textarea resize-none textarea-bordered w-[90%] md:w-full bg-slate-100 text-black border-violet-950 border-[2px] h-24" placeholder="Type your Shop Address here"></textarea>
            </label>
            <button 
                className="btn mt-2 ml-2 glass bg-custom-purple mr-5 iceland-regular tracking-wide text-lg text-white ">SUBMIT</button>
            </form>
            <div className='w-full bg-slate-400 h-auto relative justify-between flex m-2 '>
               
                <button
                onClick={() => navigate('/shop/ArtistCreate')}
                className="  text-slate-600 iceland-bold absolute right-0 bottom-1 hover:text-custom-purple hover:duration-300 self-end mx-5 m-2">
                    BE A DRIPSTR ARTIST? </button> 
            </div>
    </div>
    
    {/* SECOND CONTAINER */}
    <div className=' bg-primary-color mb-14 md:mb-0 glass h-auto lg:h-screen relative w-full  lg:m-2   lg:w-[45%] lg:rounded-[3%] place-content-center place-items-center p-2'>       
   
        <div 
        className='text-2xl font-bold iceland-bold text-slate-50  ' >SELL WITH</div>
        <img src={logo} alt="Dynamic Logo Name" className='drop-shadow-custom '/>

    </div>

 
  </div>

  {showAlert && (
          <div className="md:bottom-5  w-full px-10 bottom-10 z-10  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
            <div role="alert" className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              <span>Shop name is required!</span>
            </div>
          </div>
      )} 
        {showAlert2 && (
          <div className="md:bottom-5  w-full px-10 bottom-10 z-10  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
            <div role="alert" className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              <span>Shop Contact Number is Required!</span>
            </div>
          </div>
      )}
        {showAlert3 && (
          <div className="md:bottom-5  w-full px-10 bottom-10 z-10  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
            <div role="alert" className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              <span>Shop Address is Required!</span>
            </div>
          </div>
      )}
      {showAlert4 && (
          <div className="md:bottom-5  w-full px-10 bottom-10 z-10  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
            <div role="alert" className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              <span>Phone number should be 11 digits!</span>
            </div>
          </div>
      )}
      {showAlert5 && (
          <div className="md:bottom-5  w-full px-10 bottom-10 z-10  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
            <div role="alert" className="alert alert-error shadow-md flex items-center p-4  font-semibold rounded-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              <span>Shop Description is Required!</span>
            </div>
          </div>
      )}
</div>


  );
}



export default Login;