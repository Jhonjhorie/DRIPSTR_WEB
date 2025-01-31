import React from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../constants/supabase";

const { useState, useEffect } = React;
function ArtistAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [artistData, setArtistData] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  const fetchUserProfileAndArt = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (user) {
        console.log("Current user:", user);

        const { data: artists, error: artistError } = await supabase
          .from("artist")
          .select("artist_Name, id, artist_Bio, art_Type, artist_Image")
          .eq("owner_Id", user.id);

        if (artistError) {
          throw artistError;
        }

        if (artists && artists.length > 0) {
          const artist = artists[0];
          setArtistData(artist);
          setSelectedArtistId(artist.id);
          console.log("Artist Name:", artist.artist_Name);
          console.log("Artist ID:", artist.id);
        } else {
          console.log("No artist page found for the current user.");
          setError("No artist page found for the current user.");
        }
      } else {
        console.log("No user is signed in.");
        setError("No user is signed in.");
      }
    } catch (error) {
      console.error("Error fetching user/shop data:", error.message);
      setError("An error occurred while fetching user/shop data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProfileAndArt();
  }, []); // Run once on mount

  return (
    <div className="h-full w-full bg-slate-300 overflow-y-scroll custom-scrollbar  ">
      <div className="absolute mx-3 right-0 z-10">
        <ArtistSideBar></ArtistSideBar>
      </div>
      <div className="text-3xl font-bold w-full text-center text-custom-purple p-3">
        Manage Account
      </div>
      <div className=" h-auto  w-full  px-10 flex justify-center ">
        <div className="w-1/2 h-[70vh] bg-slate-50 justify-items-center p-5 shadow-lg rounded-md">
          <div className="bg-slate-100 relative h-44 w-60 border-2 p-1 border-custom-purple rounded-md">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="loading loading-bars loading-lg"></span>
              </div>
            )}

            {artistData && (
              <img
                src={artistData.artist_Image}
                alt={artistData.artist_Name}
                className={`drop-shadow-custom h-full w-full object-cover rounded-md ${
                  imageLoading ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            )}
          </div>
          {!loading ? (
            <div className="">
              <div className="text-slate-900 text-2xl text-center mt-2 iceland-bold font-semibold">
                {artistData.artist_Name}
              </div>
              <div className=" text-slate-700 text-sm font-semibold text-left">
                Your Bio
              </div>
              <div className="text-custom-purple font-medium h-64 rounded-md p-2 bg-red-100 overflow-hidden overflow-y-scroll ">
                " {artistData.artist_Bio} "
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span>Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtistAccount;
