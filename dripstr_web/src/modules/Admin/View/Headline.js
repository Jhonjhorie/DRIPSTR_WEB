import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../constants/supabase"; // Import Supabase client
import Sidebar from "./Shared/Sidebar";

function Headline() {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null); // Reference for resetting the file input

    // Fetch Uploaded Images from Supabase
    useEffect(() => {
        const fetchImages = async () => {
            const { data, error } = await supabase.from("carousel_images").select("image_url");
            if (error) console.error("Error fetching images:", error.message);
            else setUploadedImages(data.map((item) => item.image_url));
        };

        fetchImages();
    }, []);

    // Handle File Selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file)); // Preview selected image before upload
    };

    // Handle Image Upload to Supabase
    const uploadImageToSupabase = async (file) => {
        const fileName = `${Date.now()}-${file.name}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage.from("carousel_images").upload(fileName, file);
        if (error) {
            console.error("Upload failed:", error.message);
            return null;
        }

        // Get Public URL of the Image
        const { data: publicData } = supabase.storage.from("carousel_images").getPublicUrl(fileName);
        return publicData.publicUrl;
    };

    // Handle Upload Button Click
    const handleUploadClick = async () => {
        if (!selectedFile) {
            alert("Please select an image first!");
            return;
        }

        setUploading(true);
        const imageUrl = await uploadImageToSupabase(selectedFile);

        if (imageUrl) {
            console.log("Generated image URL:", imageUrl); // Debugging

            // Attempt to insert the image URL into the database
            const { data, error: dbError } = await supabase.from("carousel_images").insert([{ image_url: imageUrl }]);

            if (dbError) {
                console.error("Error saving image URL to DB:", dbError.message); // Debugging
                alert("Error saving image URL to the database. Check console for details.");
            } else {
                console.log("Successfully inserted into DB:", data); // Debugging
                setUploadedImages((prev) => [...prev, imageUrl]); // Update state

                // ✅ Show success alert
                alert("Image uploaded successfully!");

                // ✅ Reset File Input (removes selected file name)
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                // ✅ Clear preview and selected file after upload
                setSelectedFile(null);
                setPreviewImage(null);
            }
        }

        setUploading(false);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full h-screen flex flex-col items-center">
                <div className="bg-slate-900 p-6 rounded-3xl shadow-lg w-full h-full">
                    <p className="text-white text-2xl font-bold">Upload Headline Image</p>
                    
                    <div className="border-dashed border-2 border-gray-400 p-6 flex flex-col items-center justify-center mt-4 w-full">
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="mt-4 text-white" 
                            ref={fileInputRef} // Reference for resetting file input
                        />
                        {previewImage && <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-md mt-4" />}
                        <button
                            onClick={handleUploadClick}
                            disabled={uploading}
                            className={`mt-4 px-6 py-2 rounded-lg text-white font-bold ${uploading ? "bg-gray-500" : "bg-violet-600 hover:scale-105 transition-transform"}`}
                        >
                            {uploading ? "Uploading..." : "Upload Image"}
                        </button>
                    </div>

                    <p className="text-white text-xl mt-6">Uploaded Images:</p>
                    <div className="flex flex-row gap-1 mt-4">
                        {/* Display uploaded images */}
                        {uploadedImages.map((url, index) => (
                            <img key={index} src={url} alt={`Uploaded ${index}`} className="w-32 h-32 object-cover rounded-md" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Headline;
