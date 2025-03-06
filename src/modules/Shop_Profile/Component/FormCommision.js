import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/logoBlack.png";
import logoName from "../../../assets/logoName.png";
import DateTime from "../Hooks/DateTime";
import successEmote from "../../../../src/assets/emote/success.png";
import { supabase } from "../../../constants/supabase";
import hmmmEmote from "../../../../src/assets/emote/hmmm.png";

function FormCommision() {
  const [records, setRecords] = useState([]);
  const [sData, setSdata] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedRecordName, setSelectedRecordName] = useState("");

  useEffect(() => {
    const fetchUserProfileAndShop = async () => {
      try {
        // Get current authenticated user
        const { data: userData, error: authError } =
          await supabase.auth.getUser();
        if (authError) {
          console.error("Auth Error:", authError.message);
          return;
        }

        const user = userData?.user;
        if (!user) {
          console.error("No user is signed in.");
          return;
        }

        // Fetch the shop owned by the current user
        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id")
          .eq("owner_Id", user.id);

        if (shopError) throw shopError;
        setSdata(shops);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchUserProfileAndShop();
  }, []);

  //fetch orders commisions
  const fetchMerchantCommissions = async () => {
    const { data, error } = await supabase
      .from("merchant_Commission")
      .select("*")
      .eq("status", "Confirmed");

    if (error) {
      console.error("Error fetching merchant commissions:", error);
      return;
    }

    setRecords(data.filter((record) => record.status === "Confirmed"));
  };
  useEffect(() => {
    fetchMerchantCommissions();
  }, []);


  const handleAccept = async () => {
    if (!selectedRecordId) return;

    const { error } = await supabase
      .from("merchant_Commission")
      .update({ status: "Accepted" })
      .eq("id", selectedRecordId);

    if (error) {
      console.error("Error updating record:", error);
      return;
    }

    setShowModalComplete(false);
    fetchMerchantCommissions();
  };
  return (
    <div>
      <div className="overflow-x-auto rounded-md border border-base-content/5 bg-base-200">
        <table className="table h-auto w-full bg-slate-100">
          {/* head */}
          <thead className="w-full bg-custom-purple glass">
            <tr className="text-sm ">
              <th></th>
              <th className="text-white">Name</th>
              <th className="text-white">Image</th>
              <th className="text-white">Description</th>
              <th className="text-white">Pricing</th>
              <th className="text-white">Status</th>
              <th className="text-white">Action</th>
            </tr>
          </thead>
          {records.length > 0 ? (
            <tbody className="bg-slate-100 text-black">
              {records.map((record, index) => (
                <tr key={record.id}>
                  <th>{index + 1}</th>
                  <td>{record.fullName}</td>
                  <td>
                    <img
                      src={record.image || successEmote}
                      onClick={() => setSelectedImage(record.image)}
                      className="shadow-md shadow-slate-400 cursor-pointer bg-slate-100 h-12 w-12 object-cover rounded-md"
                      sizes="100%"
                      alt="Merchant"
                    />
                  </td>
                  <td className="whitespace-pre-line break-words max-w-[200px]">
                    {record.description}
                  </td>

                  <td>{record.pricing}</td>
                  <td>{record.status || "Accept"}</td>
                  <td>
                    <button
                      onClick={() => {
                        setShowModalComplete(true);
                        setSelectedRecordId(record.id);
                        setSelectedRecordName(record.fullName);
                      }}
                      className="text-white hover:scale-95 duration-200 shadow-sm shadow-slate-800 px-2 p-1 bg-custom-purple glass rounded-md"
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <img
                    src={hmmmEmote}
                    className="h-20 mx-auto"
                    alt="No Orders"
                  />
                  <div className="text-slate-800">
                    No commisions orders yet.
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Image to view  */}
      {selectedImage && (
        <div className="fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-lg relative">
            <button
              className="absolute top-1.5 right-1.5 text-xl text-gray-800 rounded-md px-1.5 bg-slate-50"
              onClick={() => setSelectedImage(null)}
            >
              ✖
            </button>
            <img
              src={selectedImage}
              className="max-w-[90vw] max-h-[90vh] rounded-md"
              alt="Selected Merchant"
            />
          </div>
        </div>
      )}
      {showModalComplete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Are you sure you want to accept{" "}
              <span className="font-bold text-primary-color">
                {selectedRecordName}
              </span>
              ?
            </h2>
            <div className="flex w-full justify-between">
              <button
                onClick={() => setShowModalComplete(false)}
                className="mt-4 p-2 px-4 bg-gray-500 hover:bg-gray-700 duration-300 text-sm text-white py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="mt-4 p-2 px-4 hover:bg-blue-700 text-sm duration-300 bg-blue-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormCommision;
