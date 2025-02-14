import React from "react";
import style from "../Style/style.css";
import drplogo from "@/assets/logoBlack.png";
import star from "@/assets/starrank.png";
import hmmEmote from "@/assets/emote/hmmm.png";
import successEmote from "@/assets/emote/success.png";
import questionEmote from "@/assets/emote/question.png";
import { supabase } from "@/constants/supabase";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const { useState, useEffect } = React;

function ArtistPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [countArtist, setCountArtist] = useState(null);
  const [artistRank, setArtistRank] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);

  const fetchTotalLikes = async () => {
    try {
      // Fetch all artworks for the selected artist
      const { data: artworks, error } = await supabase
        .from("artist_Arts")
        .select("likes")
        .eq("artist_Id", id);

      if (error) {
        console.error("Error fetching likes:", error.message);
        return;
      }

      // Calculate total likes
      const total = artworks.reduce(
        (sum, art) => sum + (art.likes?.length || 0),
        0
      );
      setTotalLikes(total);
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  useEffect(() => {
    if (id) fetchTotalLikes();
  }, [id]);

  const fetchArtistRank = async () => {
    try {
      const { data: artworks, error } = await supabase
        .from("artist_Arts")
        .select("artist_Id, likes");

      if (error) {
        console.error("Error fetching artworks:", error.message);
        return;
      }

      const likeCounts = {};
      artworks.forEach(({ artist_Id, likes }) => {
        if (artist_Id) {
          likeCounts[artist_Id] =
            (likeCounts[artist_Id] || 0) + (likes?.length || 0);
        }
      });

      const sortedArtists = Object.entries(likeCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([id, likes], index) => ({
          id: parseInt(id, 10),
          likes,
          rank: index + 1,
        }));

      const selectedArtistRank = sortedArtists.find(
        (artist) => artist.id === parseInt(id, 10)
      );

      if (!selectedArtistRank) {
        console.warn("Artist not found in ranking.");
        setArtistRank(null);
        return;
      }

      setArtistRank(selectedArtistRank);
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  useEffect(() => {
    fetchArtistRank();
  }, [id]);

  useEffect(() => {
    const fetchArtist = async () => {
      console.log("Fetching artist with ID:", id);
      const { data, error } = await supabase
        .from("artist")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching artist:", error);
      } else {
        console.log("Fetched Artist Data:", data);
        setArtist(data);
      }
    };

    if (id) fetchArtist();
  }, [id]);

  const countArtists = async () => {
    const { count, error } = await supabase
      .from("artist")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error counting artists:", error);
    } else {
      console.log("Total Artists:", count);
      setCountArtist(count);
    }
  };

  countArtists();

  if (!artist) return <p>Loading...</p>;

  return (
    <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar  ">
      <div className="flex gap-2 w-full bg-gray-200 justify-center p-2 ">
        <div className=" h-52 w-52 bg-violet-900 glass rounded-md shadow-md p-2 ">
          <img
            src={artist.artist_Image}
            alt={artist.artist_Name}
            className="object-cover rounded-sm h-full w-full"
          />
        </div>
        <div className=" gap-2 ">
          <div className="flex mt-2 justify-between">
            <div>
              <h1 className="text-violet-900 font-bold text-2xl p-2">
                {artist.artist_Name}
              </h1>
            </div>
            <div className="flex gap-2">
            <div className="flex items-center gap-4 rounded-md hover:scale-95 hover:bg-violet-600 duration-200 cursor-pointer justify-center bg-violet-800 text-slate-100 font-semibold iceland-regular glass p-2">
                Message <box-icon name='message-dots' type='solid'  color="white"></box-icon>
              </div>
              <div className="flex items-center gap-4 rounded-md  hover:scale-95 hover:bg-violet-600 duration-200 cursor-pointer justify-center bg-violet-800 text-slate-100 font-semibold iceland-regular glass p-2">
                Follow <box-icon name="bookmark-plus" type='solid' color="white"></box-icon>
              </div>
            </div>
          </div>

          <div className=" h-32 mt-2 text-slate-900 my-auto relative rounded-t-md bg-slate-100 stats shadow">
            <div className=" w-full absolute top-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>

            <div className="stat">
              <div className="stat-figure text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title text-slate-900">Total Likes</div>
              <div className="stat-value text-primary">{totalLikes}</div>
              <div className="stat-desc text-slate-900">
                Across all artworks
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title text-slate-900">Followers</div>
              <div className="stat-value text-secondary">2.6M</div>
              <div className="stat-desc text-slate-900">All over DRIPSTR</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <div className="w-20 h-20">
                  <img src={star} alt="Star Icon" />
                </div>
              </div>

              <div className="stat-value">
                {artistRank ? (
                  <div className="flex items-center gap-2">
                    <span className="text-4xl  font-bold">
                      #{artistRank.rank}
                    </span>
                  </div>
                ) : (
                  <span>Not ranked yet</span>
                )}
              </div>

              <div className="stat-title text-slate-900">
                Rank based on Like
              </div>
              <div className="stat-desc text-secondary">
                <span>Out of {countArtist} artists</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full text-slate-900 flex justify-center">
        <p className="text-sm">{artist.artist_Bio}</p>
      </div>
    </div>
  );
}

export default ArtistPage;
