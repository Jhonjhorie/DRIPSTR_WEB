import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../constants/supabase";
import Sidebar from "./Shared/Sidebar";

function Headline() {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedImages, setSelectedImages] = useState(new Set());
    const fileInputRef = useRef(null);

    // Fetch Uploaded Images from Supabase
    useEffect(() => {
        const fetchImages = async () => {
            const { data, error } = await supabase.from("carousel_images").select("id, image_url");
            if (error) console.error("Error fetching images:", error.message);
            else setUploadedImages(data);
        };

        fetchImages();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleRemovePreview = () => {
        setSelectedFile(null);
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const uploadImageToSupabase = async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from("carousel_images").upload(fileName, file);
        if (error) {
            console.error("Upload failed:", error.message);
            return null;
        }
        const { data: publicData } = supabase.storage.from("carousel_images").getPublicUrl(fileName);
        return publicData.publicUrl;
    };

    const handleUploadClick = async () => {
        if (!selectedFile) {
            alert("Please select an image first!");
            return;
        }

        setUploading(true);
        const imageUrl = await uploadImageToSupabase(selectedFile);

        if (imageUrl) {
            const { data, error: dbError } = await supabase
                .from("carousel_images")
                .insert([{ image_url: imageUrl }])
                .select();

            if (dbError) {
                console.error("Error saving image URL to DB:", dbError.message);
                alert("Error saving image URL to the database.");
            } else {
                setUploadedImages((prev) => [...prev, ...data]);
                alert("Image uploaded successfully!");
                if (fileInputRef.current) fileInputRef.current.value = "";
                setSelectedFile(null);
                setPreviewImage(null);
            }
        }

        setUploading(false);
    };

    const handleCheckboxChange = (id) => {
        setSelectedImages((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleDeleteSelected = async () => {
        const idsToDelete = Array.from(selectedImages);
        const { error } = await supabase
            .from("carousel_images")
            .delete()
            .in("id", idsToDelete);

        if (error) {
            console.error("Error deleting images:", error.message);
            alert("Failed to delete images.");
        } else {
            setUploadedImages((prev) => prev.filter((img) => !selectedImages.has(img.id)));
            setSelectedImages(new Set());
            alert("Selected images deleted successfully.");
        }
    };

    return (
        <div className="flex">
            
            <div className="w-full flex flex-col items-center">
                <div className="bg-slate-900 rounded-3xl shadow-lg w-full h-full">
                    <p className="text-white text-2xl font-bold">Upload Headline Image</p>

                    <div className="border-dashed border-2 border-gray-400 p-6 flex flex-col items-center justify-center mt-4 w-full">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="mt-4 text-white"
                            ref={fileInputRef}
                        />
                        {previewImage && (
                            <div className="relative mt-4">
                                <img 
                                    src={previewImage} 
                                    alt="Preview" 
                                    className="w-32 h-32 object-cover rounded-md" 
                                />
                                <button
                                    onClick={handleRemovePreview}
                                    className="absolute top-0 right-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center -translate-y-2 translate-x-2 hover:bg-red-700 transition-colors"
                                >
                                    X
                                </button>
                            </div>
                        )}
                        <button
                            onClick={handleUploadClick}
                            disabled={uploading}
                            className={`mt-4 px-6 py-2 rounded-lg text-white font-bold ${uploading ? "bg-gray-500" : "bg-violet-600 hover:scale-105 transition-transform"}`}
                        >
                            {uploading ? "Uploading..." : "Upload Image"}
                        </button>
                    </div>
                    <div className="flex justify-between items-center w-full mt-6">
                        <p className="text-white text-xl">Uploaded Images:</p>
                        {selectedImages.size > 0 && (
                            <button
                                onClick={() => {
                                    if (window.confirm(selectedImages.size > 1 ? "Are you sure you want to delete these images?" : "Are you sure you want to delete this image?")) {
                                        handleDeleteSelected();
                                    }
                                }}
                                className="px-4 py-1 rounded-lg text-white font-bold bg-red-600 hover:scale-105 transition-transform"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <div className="flex flex-row gap-4 mt-4">
                        {uploadedImages.map(({ id, image_url }) => (
                            <div key={id} className="relative">
                                <input
                                    type="checkbox"
                                    checked={selectedImages.has(id)}
                                    onChange={() => handleCheckboxChange(id)}
                                    className="absolute top-2 left-2 w-5 h-5 z-10"
                                />
                                <img src={image_url} alt="Uploaded" className="w-32 h-32 object-cover rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Headline;