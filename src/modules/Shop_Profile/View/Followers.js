import React, { useState, useEffect } from "react";
import SideBar from "../Component/Sidebars";
import girl from "../../../assets/shop/erica.jpg";
import shop from "../../../assets/shop/nevercry.jpg";
import store2 from "../../../assets/shop/store2.jpg";
import blackLogo from "../../../assets/logoWhite.png";
import { supabase } from "../../../constants/supabase";
import sadEmote from "../../../../src/assets/emote/sad.png";
import successEmote from "../../../assets/emote/success.png";

function Followers() {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedReport, setSelectedReport] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [followersCount, setTotalFollowers] = useState(0); // Initialize with 0
  const [followerDetails, setFollowerDetails] = useState([]); // Initialize followers info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [merchantId, setMerchantId] = useState(null);
  const [showAlert, setShowAlert] = React.useState(false);

  const handleReportClick = (customer) => {
    setSelectedCustomer(customer);
    setIsReportModalOpen(true);
  };
  const handleReportSubmit = async () => {
    const finalReason = reportReason === "Others" ? otherReason : reportReason;

    if (!finalReason.trim()) {
      alert("Please provide a reason for reporting.");
      return;
    }

    const { data, error } = await supabase.from("customer_Report").insert([
      {
        cust_Id: selectedCustomer?.id,
        merchant_Id: merchantId,
        reason: finalReason,
        status: "Pending",
      },
    ]);

    if (error) {
      console.error("Error submitting report:", error.message);
      alert("Failed to report customer.");
    } else {
      setIsReportModalOpen(false);
      setReportReason("");
      setOtherReason("");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedOption2(event.target.value);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setIsModalOpen3(false);
    setIsModalOpen4(false);
  };

  const handleUnfollowClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleRemoveClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen3(true);
  };

  const handleVoucherClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen2(true);
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      // Fetch the current user
      const { data: userData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.error("Authentication error:", authError.message);
        setError(authError.message);
        setLoading(false);
        return;
      }

      const user = userData.user;
      if (!user) {
        console.log("No user is signed in");
        setError("No user is signed in");
        setLoading(false);
        return;
      }

      console.log("Current user:", user);

      // Fetch shop data for the current user
      const { data: shops, error: shopError } = await supabase
        .from("shop")
        .select("id, shop_name, shop_Rating")
        .eq("owner_Id", user.id);

      if (shopError) {
        console.error("Error fetching shops:", shopError.message);
        setError(shopError.message);
        setLoading(false);
        return;
      }

      if (!shops || shops.length === 0) {
        console.log("No shops found for the user");
        setError("No shops found for the user");
        setLoading(false);
        return;
      }

      console.log("Fetched shops:", shops);

      // Store the current shop's merchant_Id
      setMerchantId(shops[0].id);

      // Fetch followers
      const { data: followers, error: followerError } = await supabase
        .from("merchant_Followers")
        .select("id, acc_id, shop_id, created_at")
        .in(
          "shop_id",
          shops.map((shop) => shop.id)
        );

      if (followerError) {
        console.error("Error fetching followers:", followerError.message);
        setError(followerError.message);
        setLoading(false);
        return;
      }

      if (!followers || followers.length === 0) {
        console.log("No followers found");
        setFollowerDetails([]);
        setTotalFollowers(0);
        setLoading(false);
        return;
      }

      console.log("Fetched followers:", followers);

      // Fetch profile details for each follower's acc_id
      const followerAccIds = followers.map((f) => f.acc_id);
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, profile_picture")
        .in("id", followerAccIds);

      if (profileError) {
        console.error(
          "Error fetching follower profiles:",
          profileError.message
        );
        setError(profileError.message);
        setLoading(false);
        return;
      }

      console.log("Fetched follower profiles:", profiles);

      // Merge follower data with profile details
      const detailedFollowers = followers.map((follower) => ({
        ...follower,
        profile: profiles.find((p) => p.id === follower.acc_id) || null,
      }));

      setFollowerDetails(detailedFollowers);
      setTotalFollowers(detailedFollowers.length);
    } catch (err) {
      console.error("Unexpected error:", err.message);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once on mount

  //remove followers na makulit
  const handleRemoveFollower = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from("merchant_Followers")
        .delete()
        .eq("acc_id", selectedUser.id);

      if (error) {
        console.error("Error removing follower:", error);
        return;
      }

      console.log("Follower removed successfully");
      alert("Followers has been removed successfully!");
      setSelectedUser(null);
      setIsModalOpen3(false);
      fetchData();
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  //search a follower
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter followers
  const filteredFollowers = followerDetails
    .filter((follower) => {
      const nameMatch =
        searchTerm.trim() === "" ||
        follower.profile?.full_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const joinDateString = follower.created_at;
      if (!joinDateString) return true;
      const joinDate = new Date(joinDateString);
      if (isNaN(joinDate.getTime())) return true;

      const now = new Date();
      let dateMatch = true;

      switch (selectedOption2) {
        case "option3": // Month ago
          dateMatch = now - joinDate >= 30 * 24 * 60 * 60 * 1000;
          break;
        case "option4": // Year ago
          dateMatch = now - joinDate >= 365 * 24 * 60 * 60 * 1000;
          break;
        case "option5":
        case "option2":
        case "option1":
        default:
          dateMatch = true;
          break;
      }

      return nameMatch && dateMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || "");
      const dateB = new Date(b.created_at || "");

      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
      if (selectedOption2 === "option2") return dateB - dateA;
      if (selectedOption2 === "option5") return dateA - dateB;

      return 0;
    });

  return (
    <div className="h-full w-full  bg-slate-300 md:flex">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      <div className="w-full h-full bg-slate-300 md:px-10 lg:px-16 py-2">
        <div className="rounded-sm px-2  place-items-center  md:px-5 lg:mx-7 mt-2 font-bold md:flex justify-between">
          <div className="text-custom-purple place-self-start px-5 md:px-0 text-xl sm:text-2xl md:text-3xl">
            SHOP FOLLOWERS
          </div>

          <div className="mt-10 md:mt-0 md:mr-14 flex group ">
            <input
              type="text"
              placeholder="Search name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-slate-100 text-slate-900 rounded-l-md text-sm font-normal w-72 h-10 p-2"
            ></input>
            <div className="bg-custom-purple px-2 hover:bg-primary-color duration-300 rounded-r-md cursor-pointer flex place-items-center">
              <box-icon name="search-alt" color="#FFF"></box-icon>
            </div>
          </div>
        </div>
        <div className=" w-full  h-auto md:flex md:gap-5 px-5 md:px-40 ">
          <div className="  w-full md:w-full h-full p-1 ">
            <div className="mt-2 w-full bg-slate-300 h-full rounded-md shadow-md p-1">
              <div className="w-full bg-custom-purple rounded-t-md p-1 place-items-center text-white font-semibold flex justify-between">
                Followers
                <div className="relative bg-slate-300 rounded-md flex place-items-center ">
                  <select
                    id="options"
                    value={selectedOption2}
                    onChange={handleChange}
                    className="w-full bg-slate-400 text-slate-800  border py-1 px-4 rounded-md text-sm"
                  >
                    <option value="option1">All</option>
                    <option value="option2">Newest</option>
                    <option value="option3">Month Ago</option>
                    <option value="option4">Year Ago</option>
                    <option value="option5">Oldest</option>
                  </select>
                  <box-icon name="filter"></box-icon>
                </div>
              </div>
              <div className="h-[500px] w-full bg-slate-100 rounded-b-md overflow-y-scroll custom-scrollbar relative p-1 ">
                {/* Sample Followers */}
                {filteredFollowers.length > 0 ? (
                  filteredFollowers.map((follower, index) => (
                    <div
                      key={index}
                      className="w-full h-12 hover:bg-custom-purple cursor-pointer bg-slate-400 duration-200 glass mb-1 flex rounded-sm p-1 justify-between"
                    >
                      <div className="flex">
                        <div className="rounded-md bg-white h-full w-10">
                          <img
                            src={
                              follower.profile?.profile_picture || successEmote
                            }
                            alt={`Profile picture of ${
                              follower.profile?.full_name || "Unknown"
                            }`}
                            className="drop-shadow-custom h-full w-full object-cover rounded-md"
                            sizes="100%"
                          />
                        </div>
                        <div>
                          <div className="text-slate-900 pl-2">
                            {follower.profile?.full_name || "Unknown"}
                          </div>
                          <div className="text-slate-800 text-sm pl-2 -mt-1">
                            Followers
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 place-items-center">
                        <box-icon
                          onClick={() => handleRemoveClick(follower.profile)}
                          onMouseEnter={(e) =>
                            e.currentTarget.setAttribute("color", "#FFF")
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.setAttribute("color", "#FF2929")
                          }
                          type="solid"
                          name="user-x"
                          color="#FF2929"
                        ></box-icon>
                        <box-icon
                          onClick={() => handleReportClick(follower.profile)}
                          onMouseEnter={(e) =>
                            e.currentTarget.setAttribute("color", "#FFF")
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.setAttribute("color", "#4335A7")
                          }
                          type="solid"
                          name="message-alt-error"
                          color="#4335A7"
                        ></box-icon>
                        <box-icon
                          onMouseEnter={(e) =>
                            e.currentTarget.setAttribute("color", "#FFF")
                          }
                          onMouseLeave={(e) =>
                            e.currentTarget.setAttribute("color", "#FAB12F")
                          }
                          type="solid"
                          name="coupon"
                          color="#FAB12F"
                        ></box-icon>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full">
                    <div className="w-fill h-full justify-items-center place-content-center content-center">
                      <div className="">
                        <img
                          src={sadEmote}
                          alt="Success Emote"
                          className="object-contain h-24 rounded-lg p-1 drop-shadow-customViolet"
                        />
                      </div>
                      <div className="">
                        {" "}
                        <h1 className="text-2xl text-custom-purple iceland-regular font-extrabold">
                          No Followers
                        </h1>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <div className="  w-full md:w-1/2 h-full p-1">
            <div className="mt-2 w-full bg-slate-300 h-full rounded-md shadow-md p-1">
              <div className="w-full bg-primary-color rounded-t-md p-1 place-items-center text-white font-semibold flex justify-between">
                Following
                <div className="relative bg-slate-300 rounded-md flex place-items-center ">
                  <select
                    id="options2"
                    value={selectedOption2}
                    onChange={handleChange2}
                    className="w-full bg-slate-400 text-slate-800  border py-1 px-4 rounded-md text-sm"
                  >
                    <option value="option1">All</option>
                    <option value="option2">Newest</option>
                    <option value="option3">Month Ago</option>
                    <option value="option4">Year Ago</option>
                    <option value="option5">Oldest</option>
                  </select>
                  <box-icon name="filter"></box-icon>
                </div>
              </div>
              <div className="h-[500px] w-full bg-slate-100 rounded-b-md overflow-y-scroll custom-scrollbar relative p-1 ">
                {/* Sample Order Notif 

                <div className="w-full h-12 place-items-center hover:bg-primary-color cursor-pointer justify-between bg-slate-400  hover:duration-200 glass mb-1 flex rounded-sm p-1">
                  <div className="flex">
                    <div className="rounded-md bg-white h-full w-10">
                      <img
                        src={shop}
                        alt="Shop Logo"
                        className="drop-shadow-custom h-full w-full object-cover rounded-md"
                        sizes="100%"
                      />
                    </div>
                    <div className="">
                      <div className=" text-slate-900 pl-2">
                        {" "}
                        NeverCry TOP WEAR{" "}
                      </div>
                      <div className=" text-slate-800 text-sm pl-2 -mt-1">
                        Followed{" "}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div onClick={handleOpenModal}>
                      <box-icon
                        onMouseEnter={(e) =>
                          e.currentTarget.setAttribute("color", "#FFF")
                        }
                        onMouseLeave={(e) =>
                          e.currentTarget.setAttribute("color", "#FF2929")
                        }
                        name="user-x"
                        type="solid"
                        color="red"
                      ></box-icon>
                    </div>
                  </div>
                </div>

                <div className="w-full h-12 place-items-center hover:bg-primary-color cursor-pointer justify-between bg-slate-400  hover:duration-200 glass mb-1 flex rounded-sm p-1">
                  <div className="flex">
                    <div className="rounded-md bg-white h-full w-10">
                      <img
                        src={store2}
                        alt="Shop Logo"
                        className="drop-shadow-custom h-full w-full object-cover rounded-md"
                        sizes="100%"
                      />
                    </div>
                    <div className="">
                      <div className=" text-slate-900 pl-2"> built me UP </div>
                      <div className=" text-slate-800 text-sm pl-2 -mt-1">
                        Followed{" "}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div onClick={handleOpenModal}>
                      <box-icon
                        onMouseEnter={(e) =>
                          e.currentTarget.setAttribute("color", "#FFF")
                        }
                        onMouseLeave={(e) =>
                          e.currentTarget.setAttribute("color", "#FF2929")
                        }
                        name="user-x"
                        type="solid"
                        color="red"
                      ></box-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Remove following */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white rounded-lg p-6 w-full md:w-1/2 lg:w-1/4 m-2 md:m-0 auto">
            <h2 className="text-lg font-medium text-slate-800 mb-4 text-center ">
              <span className="font-bold text-2xl">UNFOLLOW</span>
              <br /> NeverCry TOP WEAR?
            </h2>
            <div className="flex justify-between w-full">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleCloseModal}
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Voucher */}
      {isModalOpen2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white rounded-lg p-6 w-full md:w-1/2 lg:w-1/3 m-2 md:m-0 auto">
            <h2 className="text-lg font-medium text-slate-800 mb-4 text-center ">
              <span className="font-bold text-2xl">
                GIFT A <span className="text-primary-color">VOUCHER</span> TO{" "}
              </span>
              <br /> user: {selectedUser?.full_name || "Unknown"}
            </h2>
            <div className="h-full w-full bg-slate-300 rounded-sm shadow-lg">
              <div className="h-auto text-white p-1 w-full bg-custom-purple rounded-t-sm ">
                Select Voucher
              </div>
              <div className="h-[250px] w-full bg-slate-300 rounded-b-sm px-2 overflow-y-scroll custom-scrollbar ">
                <div className="h-14 w-full relative bg-slate-800  mt-1 flex place-items-center rounded-sm">
                  <div className=" absolute -ml-2">
                    <div className="bg-slate-300 h-3 w-3 mb-1 rounded-full"></div>
                    <div className="bg-slate-300 h-3 w-3 rounded-full"></div>
                  </div>
                  <div className="bg-slate-400 md:h-5 md:w-5 h-3 w-3 rounded-full absolute right-3 place-content-center flex place-items-center">
                    <input
                      type="checkbox"
                      default
                      className="checkbox rounded-full "
                    />
                  </div>
                  <div>
                    <div className="h-10 w-10 rounded-full mx-5">
                      <img
                        src={blackLogo}
                        alt="Shop Logo"
                        className="drop-shadow-custom object-cover l"
                      />
                    </div>
                  </div>

                  <div className="h-full w-full bg-slate-100 p-1 px-2">
                    <div>
                      <p className=" text-slate-800 font-medium text-sm md:text-lg ">
                        Shop Voucher{" "}
                        <span className="text-custom-purple font-semibold">
                          100% OFF
                        </span>
                      </p>
                      <p className=" text-slate-800 font-normal text-sm">
                        Minimun spend of{" "}
                        <span className="text-custom-purple font-semibold">
                          ₱700
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-14 w-full relative bg-slate-800 mt-1 flex place-items-center rounded-sm">
                  <div className=" absolute -ml-2">
                    <div className="bg-slate-300 h-3 w-3 mb-1 rounded-full"></div>
                    <div className="bg-slate-300 h-3 w-3 rounded-full"></div>
                  </div>
                  <div className="bg-slate-400 md:h-5 md:w-5 h-3 w-3 rounded-full absolute right-3 place-content-center flex place-items-center">
                    <input
                      type="checkbox"
                      default
                      className="checkbox rounded-full "
                    />
                  </div>
                  <div>
                    <div className="h-10 w-10 rounded-full mx-5">
                      <img
                        src={blackLogo}
                        alt="Shop Logo"
                        className="drop-shadow-custom object-cover l"
                      />
                    </div>
                  </div>

                  <div className="h-full w-full bg-slate-100 p-1 px-2">
                    <div>
                      <p className=" text-slate-800 font-medium text-sm md:text-lg  ">
                        Shop Voucher{" "}
                        <span className="text-custom-purple font-semibold">
                          20% OFF
                        </span>
                      </p>
                      <p className=" text-slate-800 font-normal text-sm">
                        Minimun spend of{" "}
                        <span className="text-custom-purple font-semibold">
                          ₱100
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between w-full mt-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleCloseModal}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove followers */}
      {isModalOpen3 && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white rounded p-4 w-full md:w-1/2 lg:w-1/4 m-2 md:m-0 auto">
            <h2 className="text-lg font-medium text-slate-800 mb-4 text-center ">
              <span className="font-semibold text-xl">REMOVE FOLLOWERS</span>
              <br />

              <span className="text-sm ">
                user: {selectedUser?.full_name || "Unknown"}
              </span>
            </h2>
            <div className="flex justify-between w-full">
              <button
                className="bg-gray-400 px-4 py-2 text-white text-sm rounded hover:bg-gray-500"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 px-4 py-2 text-white text-sm rounded hover:bg-blue-700"
                onClick={handleRemoveFollower}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report followers */}
      {isReportModalOpen && selectedCustomer && (
        <div
          onClick={() => setIsReportModalOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-96 h-auto rounded-md relative bg-slate-100"
          >
            <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-2 rounded-t-md"></div>

            <div className="text-violet-900 flex justify-center px-3 text-2xl iceland-bold py-2 rounded-md">
              Report {selectedCustomer?.full_name || "Unknown"}?
            </div>

            <div className="w-full h-auto bg-slate-300 rounded-b-md overflow-hidden overflow-y-scroll p-4">
              <p className="text-gray-900 font-semibold">Select a reason:</p>

              {/* Report Options */}
              <div className="mt-2 flex text-sm flex-col gap-2">
                {[
                  "Fraudulent Activity",
                  "Harassment",
                  "Inappropriate Behavior",
                  "Scam or Misleading",
                  "Threats or Violence",
                  "Spam or Fake Account",
                  "Hate Speech",
                ].map((reason, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      className="form-radio text-violet-500"
                      onChange={() => setReportReason(reason)}
                    />
                    <span className="text-gray-800">{reason}</span>
                  </label>
                ))}

                {/* Other reason option */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reportReason"
                    value="Others"
                    className="form-radio text-violet-500"
                    onChange={() => setReportReason("Others")}
                  />
                  <span className="text-gray-800">Others</span>
                </label>

                {reportReason === "Others" && (
                  <textarea
                    className="w-full mt-2 p-2 border bg-slate-50 text-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Please describe your concern..."
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                className="mt-4 w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition"
                onClick={handleReportSubmit}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlert && selectedCustomer && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {" "}
              Customer {selectedCustomer?.full_name || "Unknown"} reported
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Followers;
