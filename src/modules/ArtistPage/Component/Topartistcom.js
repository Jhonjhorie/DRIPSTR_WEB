import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/constants/supabase";
import { useNavigate } from "react-router-dom";
import successEmote from "../../../assets/emote/success.png";

const Topartistcom = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAllTopArtists, setShowAllTopArtists] = useState(false);

  useEffect(() => {
    fetchArtistsWithLikes();
  }, []);

  const fetchArtistsWithLikes = async () => {
    try {
      const { data: artistData, error: artistError } = await supabase
        .from("artist")
        .select("*");

      if (artistError) {
        console.error("Error fetching artists:", artistError);
        return;
      }

      const { data: artworks, error: artworkError } = await supabase
        .from("artist_Arts")
        .select("artist_Id, likes");

      if (artworkError) {
        console.error("Error fetching artworks:", artworkError);
        return;
      }

      const likeCounts = {};
      artworks.forEach(({ artist_Id, likes }) => {
        if (artist_Id) {
          likeCounts[artist_Id] =
            (likeCounts[artist_Id] || 0) + (likes?.length || 0);
        }
      });

      const artistsWithLikes = artistData.map((artist) => ({
        ...artist,
        likes: likeCounts[artist.id] || 0,
      }));

      const sortedArtists = [...artistsWithLikes].sort(
        (a, b) => b.likes - a.likes
      );

      setArtists(sortedArtists);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Search and filter
  const filteredArtists = artists
    .filter((artist) => {
      const matchesFilter = filter === "All" || artist.art_Type === filter;
      const name = artist.artist_Name ? artist.artist_Name.toLowerCase() : "";
      const fullName = artist.full_Name ? artist.full_Name.toLowerCase() : "";
      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        fullName.includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    })

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-1 text-slate-900 border text-sm rounded-md bg-white shadow-md cursor-pointer"
        />

        <select
        className="px-4 py-1 text-slate-900 border text-sm rounded-md bg-white shadow-md cursor-pointer"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {[
            "All",
            ...new Set(
              artists.map((artist) => artist.art_Type).filter(Boolean)
            ),
          ].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

       
      </div>

      <div className="overflow-x-auto rounded-box md:p-5 border-base-content/5 shadow-inner shadow-slate-600 bg-base-300 border-2 border-white text-slate-900">
        <table className="table">
          <thead>
            <tr className="text-black text-center text-[15px]">
              <th>Placement</th>
              <th>Name</th>
              <th>Art Type</th>
              <th>Artist Information</th>
              <th>Likes</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredArtists.map((artist, index) => (
              <tr key={artist.id} className="h-10">
                <td className="text-4xl text-slate-900 text-center font-thin opacity-75">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle bg-slate-100 h-12 w-12">
                        <img
                          src={artist.artist_Image || successEmote}
                          alt={artist.artist_Name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{artist.artist_Name}</div>
                    </div>
                  </div>
                </td>
                <td className="text-center w-3/4">
                  {artist.art_Type || "N/A"}
                  <br />
                  <span
                    className={`badge  ${
                      artist.is_Premium
                        ? "bg-yellow-500 text-sm text-black glass"
                        : "bg-custom-purple text-sm text-white glass"
                    }`}
                  >
                    {artist.is_Premium ? "Premium Artist" : "Standard Artist"}
                  </span>
                </td>
                <td className="w-2/4 h-16 overflow-hidden text-ellipsis p-2 whitespace-nowrap">
                  {artist.artist_Bio
                    ? artist.artist_Bio.length > 50
                      ? artist.artist_Bio.substring(0, 50) + "..."
                      : artist.artist_Bio
                    : "No Bio Available"}
                </td>
                <td className="text-center font-bold">{artist.likes}</td>
                <td className="">
                  <button
                   onClick={() => {
                    sessionStorage.setItem("previousPage", window.location.pathname); 
                    navigate(`/arts/ArtistPage/${artist.id}`);
                  }}
                    className="btn btn-ghost z-20 btn-xs rounded-sm"
                  >
                    Details
                  </button>
                </td>
              
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Topartistcom;
