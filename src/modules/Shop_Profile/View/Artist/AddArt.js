import React, { useEffect, useState } from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import { useNavigate } from "react-router-dom";
import hmmEmote from "../../../../../src/assets/emote/hmmm.png";
import { supabase } from "../../../../constants/supabase";
import successEmote from "../../../../../src/assets/emote/success.png";
import questionEmote from "../../../../../src/assets/emote/question.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark} from "@fortawesome/free-solid-svg-icons";

function ArtistAddArts() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDelArt, setShowAlertDel] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [artistArts, setArtistArts] = useState([]);
  const [artistData, setArtistData] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [artName, setArtName] = useState("");
  const [artDescription, setArtDescription] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [showAlertEditNochanges, setShowEditNochanges] = React.useState(false); // Alert No Complete Info
  const [showAlertSuccessEdit, setShowAlertSuccessEdit] = React.useState(false); // Alert Success Edit
  const [showAlertSuccessEditCon, setShowAlertSuccessEditCON] =
    React.useState(false); // Alert Success Edit Confirmation
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
        const { data: artists, error: artistError } = await supabase
          .from("artist")
          .select("artist_Name, id, artist_Bio, art_Type, artist_Image ")
          .eq("owner_Id", user.id);

        if (artistError) {
          throw artistError;
        }

        if (artists && artists.length > 0) {
          const artist = artists[0];
          setArtistData(artist);
          setSelectedArtistId(artist.id);

          const { data: arts, error: artsError } = await supabase
            .from("artist_Arts")
            .select("art_Name, id, art_Description, art_Image, status")
            .eq("artist_Id", artist.id);

          if (artsError) {
            throw artsError;
          }

          setArtistArts(arts);
        }
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
  }, []);

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedArt(null);
    fetchUserProfileAndArt();
    setArtName("");
    setArtDescription("");
    setShowAlertSuccessEdit(false);
    setShowAlertSuccessEditCON(false);
  };

  const handleImageClick = (artImage, artName, artDescription, artId) => {
    setSelectedImage(artImage);
    setSelectedArt({ artName, artDescription, id: artId });
    setArtName(artName);
    setArtDescription(artDescription);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = async () => {
    if (!selectedArt || !selectedArt.id) {
      console.error("No selected art or ID found.");
      setError("No selected art to update.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("artist_Arts")
        .update({
          art_Name: artName,
          art_Description: artDescription,
        })
        .eq("id", selectedArt.id)
        .select();

      console.log("Update Data:", data);

      if (error) {
        console.error("Error updating art:", error.message);
        setError("Error updating art.");
        return;
      }

      if (data && data.length > 0) {
        setSelectedArt(data[0]);
      } else {
        console.error("No data returned after update.");
        setError("No data returned after update.");
        return;
      }

      setIsEditable(false);
      setShowAlertSuccessEdit(true);
      setShowAlertSuccessEditCON(false);
    } catch (error) {
      console.error("Error during update:", error.message);
      setError("An error occurred while updating art.");
    } finally {
      setLoading(false);
    }
  };
  const DeleteArt = async () => {
    try {
      const { error } = await supabase
        .from("artist_Arts")
        .delete()
        .eq("id", selectedArt.id);
      setSelectedImage(null);
      setSelectedArt(null);
      fetchUserProfileAndArt();
      setArtName("");
      setShowAlertDel(true);
      setTimeout(() => {
        setShowAlertDel(false);
      }, 3000);
      setArtDescription("");
      if (error) throw error;
      console.log("Item deleted:", selectedArt);
    } catch (error) {
      console.error("Error updating the post status:", error);
    }
  };
  const handleCon = () => {
    setShowAlertSuccessEditCON(true);
  };
  const closeConfirmEditCon = () => {
    setShowAlertSuccessEditCON(false);
    setIsEditable(false);
    setShowAlertSuccessEdit(false);
  };

  return (
    <div className="h-full w-full bg-slate-300 ">
      <div className="absolute mx-3 right-0 z-10">
        <ArtistSideBar></ArtistSideBar>
      </div>
      <div className=" h-full w-full">
        <h1 className="text-3xl text-custom-purple font-bold text-left ml-2 md:ml-0 md:text-center py-5 p-2">
          MANAGE ARTS
        </h1>
        <div className="w-full h-auto px-2 md:px-16">
          <div className="bg-slate-100 shadow-inner shadow-slate-500 rounded-md overflow-hidden overflow-y-scroll p-4 h-[500px] w-full">
            <div className="columns-2 md:columns-4 lg:columns-5 gap-3 space-y-5">
              {artistArts.map((art) => (
                <div
                  key={art.id}
                  onClick={() =>
                    handleImageClick(
                      art.art_Image,
                      art.art_Name,
                      art.art_Description,
                      art.id
                    )
                  }
                  className="break-inside-avoid relative bg-custom-purple hover:scale-105 duration-200 cursor-pointer rounded-md glass p-2"
                >
                  <div className="w-full p-2 bg-slate-100 rounded-sm">
                    <img
                      src={art.art_Image}
                      alt={art.art_Name}
                      className="object-cover w-full rounded-lg p-1 drop-shadow-customViolet"
                    />
                  </div>
                  <div className="p-1">
                    <div className="text-slate-50 text-sm text-center">
                      {art.art_Name}
                    </div>
                  </div>
                  <div className="w-auto bg-slate-100 px-1 rounded-bl-md glass bg-transparent absolute top-2 right-2 flex ">
                    {art.status === "Pending" ? (
                      // Red dot and "Not Posted" text
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full bg-red-500"
                          title="Not Posted"
                        ></div>
                        <span className="text-sm text-red-500">Not Posted</span>
                      </div>
                    ) : (
                      // Green dot and "Posted" text
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full bg-green-500"
                          title="Posted"
                        ></div>
                        <span className="text-sm text-green-500">Posted</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedImage && selectedArt && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 p-2 md:p-0 flex justify-center items-center">
          <div className="bg-white h-auto md:w-[800px] w-full md:flex  p-5 rounded-lg shadow-lg relative">
            <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md"></div>
            <button
              className="absolute top-2 z-20 right-2 bg-white hover:bg-gray-200 duration-150 rounded-full p-1"
              onClick={closeModal}
            >
                 <FontAwesomeIcon icon={faCircleXmark} /> 
            </button>

            <div className="h-auto md:w-1/2 w-full rounded-md">
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

            <div className="h-auto md:w-1/2 w-full relative p-4 py-2">
              <h1 className="text-center text-custom-purple font-bold iceland-regular text-3xl">
                Art Information
              </h1>

              <label className="text-custom-purple text-sm font-semibold">
                Name of Art:
              </label>
              <input
                type="text"
                id="artName"
                value={artName}
                onChange={(e) => setArtName(e.target.value)}
                className={`w-full p-1 mb-2 rounded-md bg-slate-300 text-sm ${isEditable ? "text-custom-purple" : "text-slate-500"
                  }`}
                readOnly={!isEditable}
              />

              <label className="text-custom-purple text-sm font-semibold">
                Art Description:
              </label>
              <textarea
                id="artDescription"
                value={artDescription}
                onChange={(e) => setArtDescription(e.target.value)} // Update state on change
                className={`w-full resize-none p-1 rounded-md bg-slate-300 text-sm ${isEditable ? "text-custom-purple" : "text-slate-500"
                  }`}
                readOnly={!isEditable}
              />

              <div className="w-full md:pr-8 md:absolute bottom-2 justify-between flex">
                {isEditable ? (
                  <button
                    onClick={handleCon}
                    className="px-4 py-2 text-sm hover:bg-blue-700 bg-blue-500 duration-150 text-slate-50 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 text-sm hover:bg-green-700 bg-green-500 duration-150 text-slate-50 rounded"
                  >
                    Edit
                  </button>
                )}
                {/* <button
                  className="px-4 py-2 text-sm hover:bg-custom-purple bg-primary-color duration-150 text-slate-50 rounded"
                >
                  Unpost
                </button> */}
                <button
                  onClick={DeleteArt}
                  className="px-4 py-2 text-sm hover:bg-red-700 bg-red-500 duration-150 text-slate-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          {showAlertSuccessEditCon && (
            <div className="fixed z-20 p-2 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white w-96 p-5   justify-items-center rounded-md shadow-md relative">
                <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                  {" "}
                </div>
                <div className="p-5">
                  <img
                    src={questionEmote}
                    alt="Success Emote"
                    className="object-contain rounded-lg p-1  drop-shadow-customViolet"
                  />
                </div>

                <h2 className="text-2xl font-bold text-center iceland-regular mb-4 text-slate-900 ">
                  Update {selectedArt.artName} Information?
                </h2>
                <div className="w-full flex justify-between">
                  <div
                    onClick={closeConfirmEditCon}
                    className="bg-gray-300 cursor-pointer px-4 py-2 font-medium text-sm text-slate-900 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </div>

                  <div
                    onClick={handleSaveClick}
                    className="bg-blue-500 cursor-pointer font-medium text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Confirm
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {showAlertSuccessEdit && (
        <div className="fixed inset-0 z-50 p-2 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-96 p-5   justify-items-center rounded-md shadow-md relative">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>
            <div className="p-5">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1  drop-shadow-customViolet"
              />
            </div>

            <h2 className="text-2xl text-center font-bold iceland-regular mb-4 text-slate-900 ">
              {selectedArt.art_Name} Updated Successfully
            </h2>
            <div
              onClick={closeModal}
              className="bg-primary-color m-2 p-1 px-2 hover:scale-95 duration-300 rounded-sm text-white font-semibold cursor-pointer"
            >
              Okay!
            </div>
          </div>
        </div>
      )}

      {showAlertEditNochanges && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-20 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>No information change made!</span>
          </div>
        </div>
      )}
      {showDelArt && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-20 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-red-500 shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Art has been Successfully Deleted!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistAddArts;
