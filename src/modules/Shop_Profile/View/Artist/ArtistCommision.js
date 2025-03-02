import React from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import { useNavigate } from "react-router-dom";
import successEmote from "../../../../../src/assets/emote/success.png";
import questionEmote from "../../../../../src/assets/emote/question.png";
import {
  blockInvalidChar,
  validateMinLength2,
} from "../../Hooks/ValidNumberInput";
import { supabase } from "@/constants/supabase";

const { useState, useEffect } = React;
function ArtistCommision() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [artistData, setArtistData] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCommissions, setNewCommissions] = useState([]);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenRefImage, setModalOpenRefImage] = useState(false);

  //Fetch current User = Artist
  useEffect(() => {
    const fetchUser = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        console.error("Error fetching user:", error?.message);
        return;
      }
      setUserId(userData.user.id);
    };
    fetchUser();
  }, []);
  //Fetch Commissions
  useEffect(() => {
    const fetchNewCommissions = async () => {
      if (!userId) return;

      try {
        const { data: artistData, error: artistError } = await supabase
          .from("artist")
          .select("id")
          .eq("owner_Id", userId)
          .single();

        if (artistError || !artistData) {
          console.error("Artist not found:", artistError?.message);
          return;
        }

        const artistId = artistData.id;

        const { data: commissions, error: commissionError } = await supabase
          .from("art_Commision")
          .select(
            `
          id, title, description, deadline, image, payment, commission_Status,
          client_Id,
          profiles(full_name, profile_picture)
        `
          )
          .eq("artist_Id", artistId)
          .eq("commission_Status", "pending");

        if (commissionError) {
          console.error("Error fetching commissions:", commissionError.message);
          return;
        }

        const formattedCommissions = commissions.map((commission) => ({
          ...commission,
          senderName: commission.profiles?.full_name || "Unknown",
          senderProfile:
            commission.profiles?.profile_picture || "/default-avatar.png",
        }));
        setNewCommissions(formattedCommissions);
        console.log("New Commissions:", commissions);
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };

    if (userId) fetchNewCommissions();
  }, [userId]);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCommission(null);
  };

  const updateCommissionStatus = async (commissionId) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("art_Commision")
        .update({ commission_Status: "Completed" })
        .eq("id", commissionId);

      if (error) {
        console.error("Error updating commission status:", error.message);
        return;
      }

      setNewCommissions((prev) =>
        prev.filter((commission) => commission.id !== commissionId)
      );

      console.log(`Commission ${commissionId} marked as done.`);
      closeModal();
    } catch (error) {
      console.error("Unexpected error updating status:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-slate-300 px-10 ">
      <div className="absolute mx-3 right-0 z-20">
        <ArtistSideBar />
      </div>
      <div className=" p-5 text-xl md:text-3xl font-bold  text-custom-purple flex justify-center">
        ART COMMISIONS
      </div>
      <div className="bg-slate-100 rounded-md p-5 shadow-inner overflow-hidden overflow-y-auto shadow-slate-500 h-[80%] ">
        <div className="p-4 bg-slate-100">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : newCommissions.length === 0 ? (
            <p className="text-gray-500">No pending commissions.</p>
          ) : (
            <div className=" bg-white shadow-md rounded-md w-auto h-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-slate-100 bg-custom-purple glass">
                    <th className="py-2 px-4">Sender Name</th>
                    <th className="py-2 px-4">Reference Image</th>
                    <th className="py-2 px-4">Deadline</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newCommissions.map((commission) => (
                    <tr
                      key={commission.id}
                      className="hover:bg-gray-100 text-slate-900"
                    >
                      <td className="py-4 text-slate-900 px-4 flex items-center gap-2">
                        <img
                          src={commission.senderProfile}
                          alt="Sender"
                          className="w-12 h-12 object-cover bg-primary-color p-1 rounded-full"
                        />
                        {commission.senderName}
                      </td>
                      <td className="py-2 px-3">
                        <img
                          src={commission.image}
                          alt="Commission"
                          className="w-16 ml-5 h-16 object-cover p-1 bg-custom-purple rounded-md"
                        />
                      </td>
                      <td className="py-2 text-slate-900 px-4">
                        {commission.deadline}
                      </td>
                      <td className="py-2 text-slate-900 px-4">
                        {commission.commission_Status}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => {
                            setSelectedCommission(commission);
                            setModalOpen(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && selectedCommission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white relative text-slate-900 p-6 rounded-md shadow-lg w-auto">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md">
              {" "}
            </div>
            <div className="flex w-full gap-2">
              <div>
                <h3 className="text-2xl font-bold mb-2 ">
                  {selectedCommission.title}
                </h3>
                <p className="mb-2 mt-5 ">
                  <strong>Sender:</strong> {selectedCommission.senderName}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  {selectedCommission.commission_Status}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong> {selectedCommission.description}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong> {selectedCommission.deadline}
                </p>
              </div>
              <div
                onClick={() => {
                  setSelectedCommission(selectedCommission);
                  setModalOpenRefImage(true);
                }}
                className="rounded-md cursor-pointer p-2 bg-custom-purple glass"
              >
                {selectedCommission.image && (
                  <img
                    src={selectedCommission.image}
                    alt="Reference"
                    className="w-52 h-full object-cover rounded-md mb-3"
                  />
                )}
              </div>
            </div>

            <button
              onClick={() => updateCommissionStatus(selectedCommission.id)}
              className="bg-custom-purple glass text-white px-4 py-2 rounded-md w-full mb-2 hover:bg-primary-color mt-2 transition"
            >
              Mark as Done
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-400 text-white px-4 py-2 rounded-md w-full hover:bg-gray-500 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {modalOpenRefImage && selectedCommission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-custom-purple relative text-slate-900 p-4 rounded-md shadow-lg w-auto">
          <button
              onClick={() => {
                setModalOpenRefImage(false);
              }}
              className="absolute top-0 px-2 py-1 place-content-center right-0 text-slate-100 bg-custom-purple text-3xl rounded-full drop-shadow-lg "
            >
              &times;
            </button>
            <div className="rounded-md flex justify-center">
              {selectedCommission.image && (
                <img
                  src={selectedCommission.image}
                  alt="Reference"
                  className="max-w-full h-96 object-cover rounded-md "
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistCommision;
