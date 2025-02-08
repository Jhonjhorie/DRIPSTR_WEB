import React from "react";
import cust1 from "../../../assets/shop/erica.jpg";
import cust2 from "../../../assets/shop/sample2.jpg";
import cust3 from "../../../assets/shop/nevercry.jpg";
import style from "../Style/style.css";
import drplogo from "@/assets/logoBlack.png";
import { supabase } from "@/constants/supabase";

const { useState, useEffect } = React;
function Artists() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [artistData, setArtistData] = useState([]);
  const [imageOrientations, setImageOrientations] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [likes, setLikes] = useState({});
  const [userId, setUserId] = useState(null);

  const handleImageLoad = (event, artId) => {
    const { naturalWidth, naturalHeight } = event.target;
    setImageOrientations((prev) => ({
      ...prev,
      [artId]: naturalWidth > naturalHeight ? "landscape" : "portrait",
    }));
  };

  useEffect(() => {
    const fetchUserAndArtworks = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching user:", userError.message);
          return;
        }

        if (userData?.user) {
          setUserId(userData.user.id);
        }

        await fetchArtworks();
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };

    fetchUserAndArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const { data: arts, error } = await supabase.from("artist_Arts").select(`
        id, 
        art_Name, 
        art_Image, 
        art_Description, 
        likes, 
        artists:artist_Id (artist_Name, artist_Image) 
      `);

      if (error) throw error;

      setArtistData(arts);
    } catch (error) {
      console.error("Error fetching artworks:", error.message);
    }
  };
  const handleLike = async (artId, currentLikes) => {
    try {
      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !userData?.user) {
        console.error("Authentication error:", authError?.message);
        return;
      }

      const userId = userData.user.id;
      const likesArray = Array.isArray(currentLikes) ? currentLikes : [];

      const updatedLikes = likesArray.includes(userId)
        ? likesArray.filter((id) => id !== userId)
        : [...likesArray, userId];

      const { error } = await supabase
        .from("artist_Arts")
        .update({ likes: updatedLikes })
        .eq("id", artId);

      if (error) throw error;

      setArtistData((prevData) =>
        prevData.map((art) =>
          art.id === artId ? { ...art, likes: updatedLikes } : art
        )
      );
    } catch (error) {
      console.error("Error updating likes:", error.message);
    }
  };

  return (
    <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar  ">
      <h1 className="text-center text-5xl text-custom-purple font-bold iceland-regular">
        Our top Dripstr Artist
      </h1>
      <div className="h-[350px] relative overflow-hidden mt-5 pt-20 place-content-center  flex gap-3 px-28 w-full">
        <div className="absolute w-full h-full inset-0">
          {[
            ..."red green yellow purple pink orange teal indigo".split(" "),
          ].map((color, index) => (
            <div
              key={index}
              className={`absolute w-5 h-5 bg-${color}-500 ml-16 rounded-sm confetti`}
            ></div>
          ))}
        </div>

        <div className="w-1/4 h-[300px] rounded-sm  bg-fuchsia-600 mt-20 relative">
          <div className="rounded-full border-2 border-slate-300 h-[150px] w-[150px] absolute p-1 -top-20 left-1/2 -translate-x-1/2  bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <img alt="top2" src={cust2} className="rounded-full" />
          </div>
          <div className=" place-content-center pb-12 justify-items-center h-full w-full ">
            <div className="text-xl font-semibold text-slate-100">
              Paolo Corporal
            </div>
            <div className="text-sm mt-2 text-slate-50 bg-custom-purple shadow-slate-300 shadow-md rounded-full glass px-5 p-1 font-semibold ">
              Digital Art
            </div>
          </div>
        </div>
        <div className="w-1/4 h-[300px] rounded-sm bg-gradient-to-bl from-violet-500 to-fuchsia-500 relative ">
          <div className="rounded-full  border-2 border-slate-300 h-[150px] w-[150px] absolute p-1 -top-20 left-1/2 -translate-x-1/2  bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <img alt="top2" src={cust1} className="rounded-full" />
          </div>
          <div className=" place-content-center pb-12 justify-items-center h-full w-full ">
            <div className="text-xl font-semibold text-slate-100">
              Pablo jabo
            </div>
            <div className="text-sm mt-2 text-slate-50 bg-custom-purple shadow-slate-300 shadow-md rounded-full glass px-5 p-1 font-semibold ">
              Digital Art
            </div>
          </div>
        </div>
        <div className="w-1/4 h-[300px] rounded-sm bg-fuchsia-500  mt-32 relative">
          <div className="rounded-full border-2 border-slate-300 h-[150px] w-[150px] absolute p-1 -top-20 left-1/2 -translate-x-1/2  bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <img
              alt="top2"
              src={cust3}
              className="rounded-full h-full w-full object-fill"
            />
            <div className=" place-content-center pb-16 justify-items-center h-full w-full ">
              <div className="text-xl font-semibold text-slate-100">
                Erina sta Cruz
              </div>
              <div className="text-sm mt-2 text-slate-50 bg-custom-purple shadow-slate-300 shadow-md rounded-full glass px-5 p-1 font-semibold ">
                Digital Art
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-auto p-10 w-full bg-gradient-to-b from-violet-500 to-fuchsia-100 ">
        {loading && (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2  gap-10">
          {artistData.map((art) => (
            <div
              key={art.id}
              className="bg-white relative group px-5 shadow-lg h-auto rounded-md p-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <img
                    src={art.artists?.artist_Image || "default-profile.png"}
                    alt="Artist"
                    className="h-14 w-14 rounded-full border border-gray-300"
                  />
                  <div className="text-xl text-slate-800 font-bold">
                    {art.artists?.artist_Name || "Unknown Artist"}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xl text-slate-800 font-bold">
                    {art.likes?.length || 0}
                    <box-icon
                      name="heart"
                      color={art.likes?.includes(userId) ? "red" : "gray"} 
                      onClick={() => handleLike(art.id, art.likes)}
                      className="cursor-pointer"
                      type="solid"
                    ></box-icon>
                  </div>
                  <div className="flex items-center gap-1 text-xl text-slate-800 font-bold">
                    <box-icon name="message-dots" type="solid"></box-icon>
                  </div>
                </div>
              </div>

              <p className="text-gray-900 p-2 mt-1 font-semibold">
                {art.art_Description}
              </p>

              <div
                className={`mt-3 overflow-hidden cursor-pointer rounded-md border shadow-md border-custom-purple ${
                  imageOrientations[art.id] === "landscape"
                    ? "w-full h-[300px] flex justify-center"
                    : "w-[300px] h-[400px] mx-auto"
                }`}
                onDoubleClick={() => handleLike(art.id, art.likes)}
              >
                <img
                  src={art.art_Image}
                  alt="Art"
                  onLoad={(event) => handleImageLoad(event, art.id)}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="bg-custom-purple glass transition-transform duration-300 group-hover:scale-125 flex place-content-center gap-2 right-5 text-slate-50 font-semibold rounded-md absolute w-auto bottom-5 h-auto p-3">
                <img
                  src={drplogo}
                  alt="Art"
                  className="h-6 w-6 object-contain drop-shadow-custom"
                />
                {art.art_Name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Artists;
