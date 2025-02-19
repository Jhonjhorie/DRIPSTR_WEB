import React from "react";
import star from "@/assets/starrank.png";
import hmmEmote from "@/assets/emote/hmmm.png";
import successEmote from "@/assets/emote/success.png";
import qrCode from "@/assets/qr.png";
import { blockInvalidChar } from "../Hooks/validNumber";
import { supabase } from "@/constants/supabase";
import { useParams } from "react-router-dom";

const { useState, useEffect } = React;
function FormCommision() {
  const [accepted, setAccepted] = useState(false);
  const { id } = useParams();
  const [opencommisionQR, setCommissioncloseQR] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [artistArts, setArtistArts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentType, setPaymentType] = useState("Pay Full");

  const userId = currentUser?.id;
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      setCurrentUser(data?.user || null);
    };

    fetchUser();
  }, []);

  //Fetch artist arts
  useEffect(() => {
    const fetchArtistArts = async () => {
      try {
        console.log("Fetching artworks for artist ID:", id);

        const { data, error } = await supabase
          .from("artist_Arts")
          .select("*")
          .eq("artist_Id", id);

        if (error) {
          console.error("Error fetching artworks:", error);
        } else {
          console.log("Fetched Artworks:", data);
          setArtistArts(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    if (id) fetchArtistArts();
  }, [id]);

  const handleFileUpload = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    let { error, data } = await supabase.storage
      .from("art_messages/art_commissions")
      .upload(filePath, file);

    if (error) {
      console.error("File upload error:", error.message);
      return null;
    }

    return supabase.storage
      .from("art_messages/art_commissions")
      .getPublicUrl(filePath).data.publicUrl;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!currentUser?.id || !id) {
      console.error("Missing user ID or artist ID");
      alert("Error: Unable to submit commission. Please try again.");
      setLoading(false);
      return;
    }

    // Upload receipt if present
    let imageUrl = null;
    if (receipt) {
      imageUrl = await handleFileUpload(receipt);
    }

    const { error } = await supabase.from("art_Commision").insert([
      {
        client_Id: currentUser.id,
        artist_Id: id,
        title,
        description,
        deadline,
        payment_Type: paymentType,
        image: imageUrl,
        payment: budget,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Error submitting commission:", error.message);
      alert("Failed to submit commission.");
    } else {
      alert("Commission submitted successfully!");
      setTitle("");
      setDescription("");
      setDeadline("");
      setBudget("");
      setReceipt(null);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white relative w-auto h-auto rounded-sm p-2">
      <div className="w-full text-center h-auto">
        <h1 className="iceland-regular text-2xl font-bold text-custom-purple">
          Terms and Conditions
        </h1>
      </div>
      <div className="shadow-inner w-[500px] h-[400px] p-4 overflow-y-auto">
        {!accepted ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-900">
              Please read and accept the terms and conditions before proceeding.
            </p>
            <div className="text-sm text-gray-600 h-[250px] overflow-y-auto p-2 border rounded-md bg-gray-100">
              <p>
                <strong>1. Scope of Work:</strong> The artist will create
                artwork based on the client’s specifications. Any major changes
                after approval may incur additional fees.
              </p>
              <p>
                <strong>2. Payment:</strong> Clients must pay the agreed amount
                either upfront or in installments. Non-payment may result in
                commission cancellation.
              </p>
              <p>
                <strong>3. Deadlines:</strong> The artist will strive to meet
                deadlines but may require extensions in unforeseen
                circumstances.
              </p>
              <p>
                <strong>4. Revisions:</strong> Clients are allowed a limited
                number of revisions. Excessive revisions may incur additional
                costs.
              </p>
              <p>
                <strong>5. Usage Rights:</strong> The artist retains copyright
                unless otherwise agreed upon. Clients may use the artwork for
                personal use but must negotiate commercial rights separately.
              </p>
              <p>
                <strong>6. Refund Policy:</strong> Refunds are available only
                before work has started. Partial refunds may be issued based on
                the completion stage.
              </p>
            </div>
            <button
              onClick={() => setAccepted(true)}
              className="w-full p-2 bg-custom-purple text-white font-bold rounded-md hover:bg-purple-700"
            >
              Accept Terms
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="text-sm font-semibold text-gray-700">
              Commission Title
              <input
                type="text"
                className="w-full p-2 mt-1 bg-slate-300 border rounded-md"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label className="text-sm font-semibold text-gray-700">
              Description
              <textarea
                className="w-full p-2 mt-1 bg-slate-300 border rounded-md"
                rows="3"
                placeholder="Describe your request"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </label>

            <label className="text-sm font-semibold text-gray-700">
              Deadline
              <input
                type="date"
                className="w-full p-2 mt-1 bg-slate-300 border rounded-md"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </label>

            <label className="text-sm font-semibold text-gray-700">
              Budget (₱)
              <input
                type="number"
                className="w-full p-2 mt-1 bg-slate-300 border rounded-md"
                placeholder="Enter budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                onKeyDown={blockInvalidChar}
                required
              />
            </label>
            <label className="text-sm font-semibold text-gray-700">
              Payment Type
              <select
                className="w-full p-2 mt-1 bg-slate-300 border rounded-md"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                required
              >
                <option value="Pay Full">Pay Full</option>
                <option value="Downpayment">Downpayment</option>
              </select>
            </label>
            <div className="flex gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Gcash Payment (Upload Receipt)
                <input
                  type="file"
                  className="w-full p-2 mt-1 border rounded-md"
                  onChange={(e) => setReceipt(e.target.files[0])}
                  accept="image/*"
                  required
                />
              </label>
              <div
                onClick={() => {
                  setCommissioncloseQR(true);
                }}
                className="w-auto px-2 rounded-sm hover:glass duration-300 hover:scale-95 hover:bg-custom-purple cursor-pointer h-auto flex items-center justify-center bg-custom-purple"
              >
                <box-icon name="qr-scan" size="40px" color="white"></box-icon>
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-custom-purple text-white font-bold rounded-md hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Commission"}
            </button>
          </form>
        )}
      </div>

      {opencommisionQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative bg-custom-purple h-auto w-auto p-2 rounded-md ">
            <div className="h-80 w-80">
              <img src={qrCode}></img>
            </div>
            <button
              onClick={() => {
                setCommissioncloseQR(false);
              }}
              className="absolute -top-2 right-0 text-custom-purple text-3xl p-2 drop-shadow-lg "
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormCommision;
