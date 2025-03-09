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

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase.from("artist").select("*");
      if (error) {
        console.error("Error fetching artists:", error);
      } else {
        setArtists(data);
      }
    };

    fetchArtists();
  }, []);

  //search with filter
  const filteredArtists = artists.filter((artist) => {
    const matchesFilter = filter === "All" || artist.art_Type === filter;
    const name = artist.artist_Name ? artist.artist_Name.toLowerCase() : "";
    const fullName = artist.full_Name ? artist.full_Name.toLowerCase() : "";
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      fullName.includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const artTypes = [
    "All",
    ...new Set(artists.map((artist) => artist.art_Type).filter(Boolean)),
  ];

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search artist..."
            className="px-4 py-1 rounded-md input-bordered w-60 bg-white text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <select
            className="px-4 py-1 text-slate-900 border w-56 text-sm rounded-md bg-white shadow-md cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {artTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box p-5  border-base-content/5 bg-base-300 border-2 border-white text-slate-200">
        <table className="table">
          {/* head */}
          <thead className="">
            <tr className="text-white text-[15px]">
              <th></th>
              <th>Name</th>
              <th>Art Type</th>
              <th>Bio</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="h overflow-hidden">
            {filteredArtists.map((artist, index) => (
              <tr className="h-10" key={artist.id}>
                <th>
                  <div className="text-4xl text-white font-thin opacity-30 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </th>
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
                      <div className="text-sm opacity-50">
                        {artist.full_Name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  {artist.art_Type || "N/A"}
                  <br />
                  <span
                    className={`badge badge-sm ${
                      artist.is_Premium
                        ? "bg-yellow-500  text-black"
                        : "bg-gray-200 text-black"
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

                <th>
                  <button
                    onClick={() => {
                      if (artist.id) {
                        navigate(`/arts/ArtistPage/${artist.id}`);
                      } else {
                        console.error(
                          "Artist ID is undefined! Check if artist_Id exists in your database."
                        );
                      }
                    }}
                    className="btn btn-ghost btn-xs"
                  >
                    Details
                  </button>
                </th>
              </tr>
            ))}
          </tbody>

          {/* foot */}
        </table>
      </div>
    </div>
  );
};

export default Topartistcom;
