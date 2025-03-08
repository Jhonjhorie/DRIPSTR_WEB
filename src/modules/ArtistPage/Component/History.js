import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/constants/supabase";

const CommissionHistory = ({ artistId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [commissions, setCommissions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  useEffect(() => {
    console.log("Current artistId:", artistId);
    if (isOpen && artistId && currentUser?.id) {
      fetchCommissions();
    }
  }, [isOpen, artistId, currentUser?.id]);

  const fetchCommissions = async () => {
    if (!artistId || !currentUser?.id) return;

    const { data, error } = await supabase
      .from("art_Commision")
      .select("id, title, payment, commission_Status, created_at")
      .eq("artist_Id", artistId)
      .eq("client_Id", currentUser.id) 
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching commissions:", error);
    } else {
      console.log("Fetched commissions:", data);
      setCommissions(data);
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <div
        data-tip="See Commission History"
        bgColor="bg-transparent"
        textColor="text-secondary-color"
        className="flex-none flex fixed bottom-16 md:bottom-4 cursor-pointer right-5 items-center justify-center w-10 h-10 bg-secondary-color opacity-70 hover:opacity-100 rounded-md hover:text-black text-slate-400 hover:text-primary-color hover:bg-slate-50 duration-300 transition-all border border-slate-400 hover:border-primary-color"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faHistory} />
      </div>

      {/* Commission History Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex px-2 justify-center items-center z-20">
          <div className="bg-white rounded-md shadow-lg w-96">
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1 rounded-t-md"></div>
            <div className="p-2 bg-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Commission History
              </h2>
              <div className="bg-slate-200 p-2 rounded-md">
                {commissions.length > 0 ? (
                  <ul className="space-y-2">
                    {commissions.map((commission) => (
                      <li key={commission.id} className="border-b pb-2">
                        <strong className="text-slate-700 text-sm font-medium">
                          {commission.title}
                        </strong>{" "}
                        -{" "}
                        <strong className="text-slate-700 text-sm font-medium">
                          {" "}
                          ₱ {commission.payment}
                        </strong>
                        <strong className="text-slate-700 text-sm font-medium">
                          {" "}
                          ({commission.commission_Status})
                        </strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No commissions found.</p>
                )}
              </div>

              <button
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 duration-200"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionHistory;
