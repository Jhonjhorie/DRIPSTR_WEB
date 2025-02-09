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
      <h1 className="text-center pt-5 text-5xl text-slate-50  bg-violet-500 font-extrabold  iceland-regular">
        DRIPSTR TOP ARTIST
      </h1>
      <div className="w-full place-content-center py-16 gap-10 bg-slate-200 relative h-auto flex">
        <div className="absolute w-full h-full bg-gradient-to-b  from-violet-500 to-fuchsia-500 inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, index) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const colors = [
              "red",
              "green",
              "yellow",
              "purple",
              "pink",
              "orange",
              "teal",
              "indigo",
            ];
            const randomColor =
              colors[Math.floor(Math.random() * colors.length)];

            return (
              <div
                key={index}
                className={`absolute w-5 h-5 bg-${randomColor}-500 rounded-sm confetti`}
                style={{
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                  animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                }}
              ></div>
            );
          })}
        </div>
        <img
          src={drplogo}
          alt="Artist"
          className="h-80  blur-sm w-80  rounded-md absolute bottom-2 right-2"
        />
        <img
          src={drplogo}
          alt="Artist"
          className="h-80  blur-sm w-80 -scale-x-100 rounded-md absolute bottom-2 left-2"
        />
        {[
          {
            name: "Paolo Corporal",
            color: "sky-400",
            image: cust2,
            mt: "mt-24",
            tag: "2",
          },
          {
            name: "Pablo Jabo",
            color: "yellow-400",
            image: cust1,
            mt: "mt-10",
            tag: "1",
          },
          {
            name: "Paolo Corporal",
            color: "pink-400",
            image: cust2,
            mt: "mt-32",
            tag: "3",
          },
        ].map((person, index) => (
          <div
            key={index}
            className={`w-[150px] hover:scale-105 duration-150 h-[300px] rounded-sm bg-${person.color} relative ${person.mt}`}
          >
            <div
              className={`rounded-full z-10 shadow-lg  h-[170px] w-[170px] absolute p-1 -top-20 left-1/2 -translate-x-1/2 bg-${person.color}`}
            >
              <img alt="top2" src={person.image} className="rounded-full" />
            </div>
            <div
              className={`absolute z-20 px-3 -translate-x-1/2 text-slate-50 font-semibold iceland-regular left-1/2 top-1/4 shadow-md border-slate-50 border-2   bg-${person.color} rounded-full p-1`}
            >
              {person.tag}
            </div>

            <div
              className={`w-[150px] h-[250px]  rounded-sm overflow-hidden bg-${person.color} mt-20 relative `}
            >
              <div className="place-content-center pb-12 justify-items-center h-full w-full">
                <div className="text-lg font-semibold text-slate-100">
                  {person.name}
                </div>
                <div className="text-sm mt-2 text-slate-50 bg-custom-purple shadow-md rounded-full px-5 p-1 font-semibold">
                  Digital Art
                </div>
              </div>
              <div className="bg-fuchsia-500 h-36 w-36 rotate-45 absolute -bottom-24 right-1"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-b  from-fuchsia-500 to-slate-300 h-40"></div>
      <div className="h-auto p-10 w-full bg-slate-300 ">
        {loading && (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2  gap-10">
          {artistData.map((art) => (
            <div
              key={art.id}
              className="bg-white relative group p-2 shadow-lg h-auto rounded-md"
            >
              <div className=" w-full absolute top-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                {" "}
              </div>
              <div className="flex  justify-between  items-center p-4">
                <div className="flex gap-2">
                  <img
                    src={art.artists?.artist_Image || "default-profile.png"}
                    alt="Artist"
                    className="h-14 w-14 rounded-full border border-gray-300"
                  />
                  <div className="text-xl mt-3 text-slate-800 font-bold">
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

              <p className="text-gray-900 p-2 px-10 mt-1 font-semibold">
                {art.art_Description}
              </p>
              <div className="w-full px-5 border shadow-md border-custom-purple  rounded-md p-2">
                <div
                  className={`mt-3 overflow-hidden cursor-pointer  ${
                    imageOrientations[art.id] === "landscape"
                      ? "w-full h-[300px] flex justify-center"
                      : "w-[300px] h-[300px] mx-auto"
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
