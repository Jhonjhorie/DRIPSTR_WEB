import React, { useEffect, useState } from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import { useNavigate } from "react-router-dom";
import hmmEmote from "../../../../../src/assets/emote/hmmm.png";
import { supabase } from "../../../../constants/supabase";

function ArtistAddArts() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [artistArts, setArtistArts] = useState([]);
  const [artistData, setArtistData] = useState([]);

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

          const { data: arts, error: artsError } = await supabase
            .from("artist_Arts")
            .select("art_Name, id, art_Description, art_Image")
            .eq("artist_Id", artist.id);

          if (artsError) {
            throw artsError;
          }

          setArtistArts(arts); // Assuming `setArtistArts` is a state setter
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

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="h-full w-full bg-slate-300 overflow-y-scroll custom-scrollbar  ">
      <div className="absolute mx-3 right-0 z-10">
        <ArtistSideBar></ArtistSideBar>
      </div>
      <div className=" h-full w-full">
        <h1 className="text-3xl text-custom-purple font-bold text-center py-5 p-2">
          MANAGE ARTS
        </h1>
        <div className=" w-full h-auto px-16  ">
          <div className=" bg-slate-100 shadow-md  flex flex-wrap gap-5 place-items-center rounded-md overflow-hidden overflow-y-scroll p-4 h-[500px] w-full">
            {artistArts.map((art) => (
              <div
                key={art.id}
                onClick={() => handleImageClick(art.art_Image)}
                className="h-auto bg-custom-purple hover:scale-105 duration-200 cursor-pointer rounded-md glass w-44 p-2"
              >
                <div className="h-40 w-40 p-2 bg-slate-100 rounded-sm">
                  <img
                    src={art.art_Image}
                    alt={art.art_Name}
                    className="object-contain h-full w-full rounded-lg p-1 drop-shadow-customViolet"
                  />
                </div>
                <div className="p-1">
                  <div className="text-slate-50 text-center">
                    {art.art_Name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 p-10 md:p-0 flex justify-center items-center">
          <div className="bg-white h-auto w-[800px] md:flex p-5 rounded-lg shadow-lg relative">
          <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-2 rounded-t-md">
              {" "}
            </div>
            <button
              className="absolute top-2 right-2 bg-white hover:bg-gray-200 duration-150 rounded-full p-1"
              onClick={closeModal}
            >
              ❌
            </button>

            <div className="h-auto md:w-1/2 w-full rounded-md ">
              <div className="bg-custom-purple p-1 w-auto h-auto place-content-center rounded-md glass">
                <div className="bg-slate-100 p-2 rounded-md h-[300px]">
                <img
                  src={selectedImage}
                  alt="Selected Art"
                  className="h-full w-full object-contain rounded-md drop-shadow-customViolet"
                />
                </div>
              </div>
            </div>

            <div className="h-auto  md:w-1/2 w-full relative  p-4 py-2">
              <h1 className="text-center text-custom-purple font-bold iceland-regular text-3xl"> Art Information</h1>
              <label className="text-custom-purple text-sm font-semibold">Name of Art:</label>
              <input type="text" placeholder={artistArts.art_Name} className="w-full p-1 mb-2 rounded-md bg-slate-300 text-custom-purple font-semibold" />
              <label className="text-custom-purple text-sm font-semibold">Art Description:</label>
              <textarea  type="text" className="w-full resize-none  p-1 rounded-md bg-slate-300 text-custom-purple font-semibold" />

              <div className="w-full md:pr-8 md:absolute bottom-2 justify-between flex ">
                <button className="px-4 p-1 hover:bg-green-700 bg-green-500 duration-150 text-slate-50 rounded-md ">EDIT</button>
                <button className="px-4 p-1 hover:bg-blue-700 bg-blue-500 duration-150 text-slate-50 rounded-md ">POST</button>
                <button className="px-4 p-1 hover:bg-red-700 bg-red-500 duration-150 text-slate-50 rounded-md ">DELETE</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistAddArts;
