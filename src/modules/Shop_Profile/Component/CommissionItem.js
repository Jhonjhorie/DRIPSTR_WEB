import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/logoBlack.png";
import logoName from "../../../assets/logoName.png";
import DateTime from "../Hooks/DateTime";
import successEmote from "../../../../src/assets/emote/success.png";
import { supabase } from "../../../constants/supabase";
import hmmmEmote from "../../../../src/assets/emote/hmmm.png";

function CommissionItem() {
  const [records, setRecords] = useState([]);
  const [sData, setSdata] = useState([]);
  const [shopId, setShopId] = useState(null);
  const [modalCon, openModalCon] = useState(false);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedRecordName, setSelectedRecordName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); //Print order report
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientAddress, setClientAddress] = useState(null);

  useEffect(() => {
    if (selectedCommission?.client_Id) {
      const fetchClientAddress = async () => {
        const { data: addresses, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", selectedCommission.client_Id)
          .eq("is_default_shipping", true)
          .single();

        if (error) {
          console.error("Error fetching address:", error);
          setClientAddress(null);
        } else {
          setClientAddress(addresses);
        }
      };

      fetchClientAddress();
    }
  }, [selectedCommission]);

  useEffect(() => {
    const fetchUserProfileAndShop = async () => {
      try {
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

        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id, address, shop_name")
          .eq("owner_Id", user.id)
          .single();

        if (shopError) throw shopError;

        setShopId(shops?.id || null);
        setSdata(shops);
      } catch (error) {
        console.error("Error fetching shop data:", error.message);
      }
    };

    fetchUserProfileAndShop();
  }, []);
  const handleOpenModal = (commission) => {
    setSelectedCommission(commission);
    setIsModalOpen(true);
  };

  const fetchMerchantCommissions = async () => {
    if (!shopId) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("merchant_Commission")
        .select(
          `id, client_Id, fullName, image, description, pricing, status, merchantId, filePath, receipt, notes,
        profiles:client_Id(id, mobile)`
        )
        .eq("status", "To prepare")
        .eq("merchantId", shopId);

      if (error) {
        console.error("Error fetching merchant commissions:", error);
        return;
      }

      setRecords(data);
    } catch (err) {
      console.error("Unexpected error fetching merchant commissions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantCommissions();
  }, [shopId]);

  const handleAccept = async () => {
    if (!selectedRecordId) return;

    const { error } = await supabase
      .from("merchant_Commission")
      .update({ status: "To ship" })
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
      <div className="overflow-x-auto rounded-md border border-base-content/5 bg-slate-200">
        <table className="table">
          {/* head */}
          <thead className="w-full bg-custom-purple glass">
            <tr className="text-sm text-center ">
              <th></th>
              <th className="text-white">Name</th>
              <th className="text-white">Image</th>
              <th className="text-white">Description</th>
              <th className="text-white">Pricing</th>
              <th className="text-white">Status</th>
              <th className="text-white">Action</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <span className="loading loading-dots loading-lg"></span>
                  <p className="text-slate-800 mt-3">
                    Loading client commissions...
                  </p>
                </td>
              </tr>
            </tbody>
          ) : records.length > 0 ? (
            <tbody className="bg-slate-100 text-center text-black">
              {records.map((record, index) => (
                <tr key={record.id} className="text-center">
                  <th>{index + 1}</th>
                  <td>{record.fullName}</td>
                  <td className="justify-center flex">
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
                    <div className="gap-2 flex justify-center">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setSelectedRecordId(record.id);
                          setSelectedRecordName(record.fullName);
                          setSelectedCommission(record);
                        }}
                        className="bg-green-500 text-sm text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 "
                      >
                        Print
                      </button>
                      {/* <button
                        onClick={() => {
                          setShowModalComplete(true);
                          setSelectedRecordId(record.id);
                          setSelectedRecordName(record.fullName);
                        }}
                        className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Set to ship
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="7" className="text-center bg-white py-10">
                  <img
                    src={hmmmEmote}
                    className="h-20 mx-auto"
                    alt="No Orders"
                  />
                  <div className="text-slate-800">
                    No client commissions orders yet.
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Print */}
      {isModalOpen && selectedCommission && (
        <dialog
          id="print"
          className="fixed inset-0 w-full h-full py-10 bg-black bg-opacity-70 md:flex justify-center items-center z-50"
        >
          <div className="bg-slate-200 p-4 text-slate-800 rounded shadow-lg w-auto">
            <div
              ref={contentRef}
              className="max-w-md mx-auto bg-white shadow-lg border border-gray-300 px-5 py-4 rounded-lg"
            >
              {/* Header */}
              <div className="text-center border-b pb-4">
                <div className="h-7 justify-items-center">
                  <img
                    src={logoName}
                    alt="Dripstr Logo"
                    className="h-full w-auto"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Transaction ID:{" "}
                  <span className="font-medium">{selectedCommission.id}</span>
                </p>
              </div>

              {/* Commission Details */}
              <div className="flex gap-4 mt-4">
                <div className="p-1 rounded-md shadow-md h-36 w-36 bg-slate-800">
                  <img
                    src={selectedCommission.image || "placeholder.jpg"}
                    alt="Commission Image"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-slate-800">
                    <strong>Client:</strong>{" "}
                    {selectedCommission.fullName || "N/A"}
                  </p>
                  <p className="text-sm mt-1 text-slate-800">
                    <strong>Shop:</strong> {sData?.shop_name || "N/A"}
                  </p>
                  <p className="text-sm mt-1 text-slate-800">
                    <strong>Shop Address:</strong> {sData?.address || "N/A"}
                  </p>
                  <p className="text-sm text-slate-800">
                    <strong>Order type:</strong>{" "} Customize
                  </p>
                </div>
              </div>

              {/* Receipt & Notes */}
              <div className="mt-4 border-t pt-4">
                {/* Receipt & Notes */}

                <h3 className="text-md font-semibold text-slate-900">
                  Shipping Details
                </h3>
                <p className="text-sm  mt-1 text-slate-800">
                  <strong>Client:</strong>{" "}
                  {selectedCommission.fullName || "N/A"}
                </p>
                <p className="text-sm text-slate-800">
                  <strong>Phone Number:</strong>{" "}
                  {selectedCommission?.profiles?.mobile || "N/A"}
                </p>

                {/* Display Address */}
                <p className="text-sm text-slate-800">
                  <strong>Shipping Address: </strong>
                  {clientAddress
                    ? `${clientAddress.full_address}, ${clientAddress.postcode}`
                    : "No address found"}
                </p>

                <p className="text-sm  text-slate-800">
                  <strong>Description:</strong>{" "}
                  {selectedCommission.description || "N/A"}
                </p>

                {/* <p className="text-sm text-slate-800 ">
                  <strong>Notes:</strong>{" "}
                  {selectedCommission.notes || "No notes for this order."}
                </p> */}
              </div>
              <div className="mt-4 border-t pt-4">
                {/* Receipt & Notes */}

                <h3 className="text-md font-semibold text-slate-900">
                  Order Summary
                </h3>
                <p className="text-sm text-slate-800">
                  <strong>Subtotal: </strong> ₱
                  {selectedCommission.pricing - 50 || "N/A"}
                </p>
                <p className="text-sm text-slate-800">
                  <strong>Shipping fee:</strong> ₱50
                </p>
                <p className="text-sm text-slate-800">
                  <strong>Shipping method:</strong> Standard
                </p>
                <div className="flex justify-end gap-2 items-center mt-2 font-semibold text-lg">
                  <span className="text-slate-800 text-sm">Total Price:</span>
                  <span className="text-xl text-custom-purple">
                    ₱{selectedCommission.pricing}
                  </span>
                </div>

                {/* Display Address */}
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 mt-4 border-t pt-2">
                <p>Thank you for shopping with Dripstr!</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="hover:bg-gray-500 px-4 py-2 text-white text-sm rounded bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-custom-purple duration-200 text-white text-sm px-4 py-2 rounded hover:bg-primary-color"
                onClick={handlePrint}
              >
                Print Receipt
              </button>
            </div>
          </div>
        </dialog>
      )}

      {showModalComplete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Commission Order done for{" "}
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
    </div>
  );
}

export default CommissionItem;
