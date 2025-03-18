import React, { useState, useEffect } from "react";
import SideBar from "../Component/Sidebars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/constants/supabase";
import successEmote from "../../../assets/emote/success.png";

const FILTER_OPTIONS = {
  ALL: "all",
  NEWEST: "newest",
  MONTH: "month",
  YEAR: "year",
  OLDEST: "oldest"
};

function Notifications() {
  const [selectedOption, setSelectedOption] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the current user and their notifications in one go
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!userData?.user) {
          console.log("No user found");
          setLoading(false);
          return;
        }

        setCurrentUser(userData.user);

        // Get merchant's shop data
        const { data: shopData, error: shopError } = await supabase
          .from("shop")
          .select("id, shop_name")
          .eq("owner_Id", userData.user.id)
          .single();

        if (shopError) throw shopError;
        if (!shopData) {
          console.log("No shop found for this user");
          setLoading(false);
          return;
        }

        // Get notifications for this merchant
        const { data: notifData, error: notifError } = await supabase
          .from("notifications")
          .select(`
    id,
    type,
    title,
    message,
    timestamp,
    read,
    deleted,
    user_id,
    profiles:user_id (
      full_name,
      profile_picture
    ),
    shop:merchantId ( id)
  `)
          .eq("merchantId", shopData.id)
          .order("timestamp", { ascending: false });


        if (notifError) throw notifError;

        console.log("Fetched notifications:", notifData);
        setNotifications(notifData || []);

      } catch (error) {
        console.error("Error in notification flow:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  const handleNotificationClick = async (notification) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: false })
        .eq('id', notification.id);

      if (error) throw error;

      // Update local state to reflect the change
      setNotifications(notifications.map(notif =>
        notif.id === notification.id
          ? { ...notif, read: true }
          : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getFilteredNotifications = () => {
    const now = new Date();

    switch (selectedOption) {
      case FILTER_OPTIONS.NEWEST:
        // Last 24 hours
        return notifications.filter(notif =>
          new Date(notif.timestamp) >= new Date(now - 24 * 60 * 60 * 1000)
        );

      case FILTER_OPTIONS.MONTH:
        // Last 30 days
        return notifications.filter(notif =>
          new Date(notif.timestamp) >= new Date(now.setMonth(now.getMonth() - 1))
        );

      case FILTER_OPTIONS.YEAR:
        // Last year
        return notifications.filter(notif =>
          new Date(notif.timestamp) >= new Date(now.setFullYear(now.getFullYear() - 1))
        );

      case FILTER_OPTIONS.OLDEST:
        // Sort by oldest first
        return [...notifications].sort((a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
        );

      case FILTER_OPTIONS.ALL:
      default:
        // Return all notifications (newest first - default order)
        return notifications;
    }
  };

  return (
    <div className="h-full w-full  bg-slate-300 ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      <div className="w-full h-full md:px-10 lg:px-16">
        <div className="w-full h-full bg-slate-300 px-5 md:px-10 place-items-center">
          <div className="w-full md:w-2/3 lg:w-1/2 h-full bg-slate-100 p-2 shadow-md mb-16 md:mb-0">
            <div className="text-3xl text-custom-purple font-bold p-2 justify-between w-full flex place-items-center">
              Notifications
              <div className="flex gap-2 place-items-center">
                <select
                  id="options"
                  value={selectedOption}
                  onChange={handleChange}
                  className="w-full bg-slate-300 text-slate-800 font-medium border py-1 px-2 rounded-md text-sm"
                >
                  <option value={FILTER_OPTIONS.ALL}>All</option>
                  <option value={FILTER_OPTIONS.NEWEST}>Last 24 Hours</option>
                  <option value={FILTER_OPTIONS.MONTH}>Last Month</option>
                  <option value={FILTER_OPTIONS.YEAR}>Last Year</option>
                  <option value={FILTER_OPTIONS.OLDEST}>Oldest First</option>
                </select>
                <FontAwesomeIcon icon={faBell} className="text-xl" />
              </div>
            </div>
            <div className="bg-slate-200 h-[550px] rounded-md w-full custom-scrollbar overflow-y-scroll p-2">
              {loading ? (
                <div className="text-center text-gray-500">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center text-gray-500">No notifications yet.</div>
              ) : (
                getFilteredNotifications().map((notification) => (
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    key={notification.id}
                    className={`w-full h-auto min-h-[3rem] hover:bg-custom-purple cursor-pointer 
                      ${notification.read ? 'bg-slate-400' : 'bg-slate-300'} 
                      hover:duration-200 glass mb-1 flex rounded-sm p-1 justify-between`}
                  >
                    <div className="flex w-full items-center p-1">
                      <div className="rounded-md bg-white h-12 w-12 flex-shrink-0">
                        <img
                          src={notification.profiles?.profile_picture || successEmote}
                          alt={`Profile of ${notification.profiles?.username || 'user'}`}
                          className="shadow-sm h-full w-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-grow pl-2">
                        <div className="text-slate-900 font-medium">
                          {notification.profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-slate-800 text-sm">
                          {notification.message}
                        </div>
                        <div className="text-xs text-slate-600">
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
