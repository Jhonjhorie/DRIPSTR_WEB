import { useState } from "react";
import { supabase } from "../../../constants/supabase";

const ProfilePictureUploadModal = ({ isOpen, onClose, userId, currentImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentImage);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // Success alert state

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadProfilePicture = async () => {
    if (!selectedFile || !userId) return;
    setLoading(true);

    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("ProfilePicture")
      .upload(filePath, selectedFile, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      setLoading(false);
      return;
    }

    // Get public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("ProfilePicture")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Update profile in database
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_picture: imageUrl })
      .eq("id", userId);

    if (updateError) {
      console.error("Database update error:", updateError);
    } else {
      setUploadSuccess(true); // Show success message
      setTimeout(() => setUploadSuccess(false), 3000); // Hide after 3 seconds
      onClose(imageUrl); // Update parent state
    }

    setLoading(false);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? "block" : "hidden"}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Upload Profile Picture</h2>

        <div className="flex flex-col items-center">
          <img src={preview || "/default-avatar.png"} alt="Preview" className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 mb-4" />
          
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            onClick={uploadProfilePicture}
            disabled={loading || !selectedFile}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <button className="mt-4 text-gray-500 hover:underline" onClick={() => onClose(null)}>
          Cancel
        </button>

        {/* Success Alert */}
        {uploadSuccess && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
            ✅ Upload Successful!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUploadModal;
