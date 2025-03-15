import React from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import { useNavigate } from "react-router-dom";
import successEmote from "../../../../../src/assets/emote/success.png";
import questionEmote from "../../../../../src/assets/emote/question.png";
import hmmmEmote from "../../../../../src/assets/emote/hmmm.png";
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
  const [filteredCommissions, setFilteredCommissions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Confirmed");

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
          `id, title, description, deadline, image, payment, commission_Status,
            client_Id,
            profiles(full_name, profile_picture)`
        )
        .eq("artist_Id", artistId);

      if (commissionError) {
        console.error("Error fetching commissions:", commissionError.message);
        return;
      }

      const formattedCommissions = commissions.map((commission) => ({
        ...commission,
        senderName: commission.profiles?.full_name || "Unknown",
        senderProfile: commission.profiles?.profile_picture || successEmote,
      }));

      setNewCommissions(formattedCommissions);
      setFilteredCommissions(
        formattedCommissions.filter(
          (commission) => commission.commission_Status !== "Completed"
        )
      ); // Default to pending
    } catch (error) {
      console.error("Unexpected error:", error.message);
    }
  };
  useEffect(() => {
    if (userId) fetchNewCommissions();
  }, [userId]);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCommission(null);
  };
  //filter if pending and completed
  const filterCommissions = (status) => {
    setSelectedStatus(status);
    setFilteredCommissions(
      newCommissions.filter(
        (commission) =>
          (status === "Completed" &&
            commission.commission_Status === "Completed") ||
          (status === "Confirmed" &&
            commission.commission_Status !== "Completed")
      )
    );
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
      fetchNewCommissions();
    } catch (error) {
      console.error("Unexpected error updating status:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-slate-300 px-2 md:px-10 ">
      <div className="absolute mx-3 right-0 z-20">
        <ArtistSideBar />
      </div>
      <div className=" p-5 text-xl md:text-3xl font-bold  text-custom-purple flex justify-center">
        ART COMMISIONS
      </div>
      <div className="bg-slate-100 rounded-md p-5 shadow-inner overflow-scroll shadow-slate-500 h-[80%]">
        <div className="bg-slate-100">
          {/* Buttons for filtering commissions */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => filterCommissions("Confirmed")}
              className={`px-4 text-sm py-2 rounded-md ${
                selectedStatus === "Confirmed"
                  ? "bg-custom-purple text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              Pending Commissions
            </button>
            <button
              onClick={() => filterCommissions("Completed")}
              className={`px-4 text-sm py-2 rounded-md ${
                selectedStatus === "Completed"
                  ? "bg-custom-purple text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              Completed Art
            </button>
          </div>

          {filteredCommissions.length === 0 ? (
            <div className="w-full h-full  mt-10 place-items-center justify-items-center">
              <img src={hmmmEmote} className="h-20 " />
              <p className="text-slate-800 text-sm">
                No {selectedStatus.toLowerCase()} commissions.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-md w-auto h-auto">
              <table className="w-full text-left ">
                <thead>
                  <tr className="border-b text-slate-100 bg-custom-purple rounded-t-md  glass">
                    <th className="py-2 px-4 font-normal">Sender Name</th>
                    <th className="py-2 px-4 font-normal">Reference Image</th>
                    <th className="py-2 px-4 font-normal">Deadline</th>
                    <th className="py-2 px-4 font-normal">Payment</th>
                    <th className="py-2 px-4 font-normal">Status</th>
                    <th className="py-2 px-4 font-normal">Action</th>
                  </tr>
                </thead>
                <tbody className="w-full shadow-md rounded-md bg-slate-100">
                  {filteredCommissions.map((commission) => (
                    <tr
                      key={commission.id}
                      className="hover:bg-gray-100 w-full bg-slate-100 text-slate-900"
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
                        {commission.payment}
                      </td>
                      <td
                        className={`py-2 px-4 ${
                          commission.commission_Status === "Processed"
                            ? "text-green-500 font-normal"
                            : "text-slate-900"
                        }`}
                      >
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
        <div className="fixed inset-0 bg-black p-2 z-50 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white relative text-slate-900 p-6 rounded-md shadow-lg w-auto">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md">
              {" "}
            </div>
            <div className=" w-full gap-2">
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
                  <strong>Description:</strong> {selectedCommission.description}
                </p>
                <p className="mb-2">
                  <strong>Deadline:</strong> {selectedCommission.deadline}
                </p>
              </div>
              <div
                onClick={() => {
                  setSelectedCommission(selectedCommission);
                  setModalOpenRefImage(true);
                }}
                className="rounded-md cursor-pointer place-items-center  p-2 md:h-[400px] h-[200px] bg-custom-purple glass"
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

            <div className="w-full flex justify-end gap-3 py-3">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-sm text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 "
              >
                Close
              </button>

              {selectedCommission.commission_Status !== "Completed" && (
                <button
                  onClick={() => updateCommissionStatus(selectedCommission.id)}
                  className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {modalOpenRefImage && selectedCommission && (
        <div className="fixed inset-0 bg-black z-50 p-2 bg-opacity-50 flex justify-center items-center">
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
