import React from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import avatar from "../../../../assets/car.jpg";
import drplogo from "../../../../assets/logoBlack.png";
import rank from "../../../../assets/starrank.png";
import art1 from "../../../../assets/art1.jpg";
import art2 from "../../../../assets/art2.jpg";
import art3 from "../../../../assets/art3.jpg";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";

function MerchantDashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full bg-slate-300 overflow-hidden   ">
      <div className="w-full h-full bg-slate-300 ">
        <div className="w-full h-20  top-0 bg-violet-600 shadow-md px-16 ">
          <div className="w-full h-full flex gap-3 p-2">
            <div className="flex justify-between w-full ">
              <div className="flex gap-2">
                <div className="h-full w-24 rounded-md border bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1">
                <img
                  src={avatar}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                />
                </div>
                <div className="">
                  <h1 className="text-[20px] pt-1 font-semibold text-slate-100">
                    Cat perspective
                  </h1>
                  <h2 className="text-[13px]  text-slate-50">Digital Art</h2>
                </div>
                <div></div>
              </div>

              <div className="flex gap-5">
                <div className="h-full w-20 ">
                  <div className="h-full w-20 justify-items-center ">
                    <div className="flex align-middle gap-2  justify-center ">
                      <div className="text-2xl text-slate-100">10</div>
                      <div className="pt-1">
                        {" "}
                        <box-icon
                          color="white"
                          size="100%"
                          name="group"
                          type="solid"
                        ></box-icon>
                      </div>
                    </div>

                    <div className="text-slate-50 text-sm">Followers</div>
                  </div>
                </div>
                <div className="h-full w-20 ">
                  <div className="h-full w-20 justify-items-center ">
                    <div className="flex align-middle gap-2  justify-center ">
                      <div className="text-2xl text-slate-100">2</div>
                      <div className="pt-1">
                        {" "}
                        <box-icon color="white" type='solid' name='book-heart'></box-icon>
                      </div>
                    </div>

                    <div className="text-slate-50  text-sm">Arts</div>
                  </div>
                </div>
           
                <div className="h-full w-20 duration-300 hover:scale-95 cursor-pointer">
                  <div className="h-full w-20 justify-items-center bg-slate-50 bg-opacity-25 shadow-md rounded-md ">
                    <div className="flex align-middle gap-2  justify-center ">
                      <div className="pt-1">
                        {" "}
                        <box-icon color='white' type='solid' name='edit'></box-icon>
                      </div>
                    </div>

                    <div className="text-slate-50  text-sm">Post Art</div>
                  </div>
                </div>
                <div className="h-full w-20 duration-300 hover:scale-95 cursor-pointer">
                  <div className="h-full w-20 justify-items-center bg-slate-900 bg-opacity-30 shadow-md rounded-md ">
                    <div className="flex align-middle gap-2  justify-center ">
                      <div className="pt-1">
                        {" "}
                        <box-icon color='white' type='solid' name='user-pin'></box-icon>
                      </div>
                    </div>

                    <div className="text-slate-50  text-sm">Account</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full gap-1  bg-slate-100 shadow-md justify-between flex">
          <div className="w-80  h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 bg-opacity-10 p-2 overflow-hidden overflow-y-scroll custom-scrollbar">
            <div className="w-full h-16 bg-slate-50"></div>
          </div>
          <div className="w-full h-full bg-slate-900"></div>
          <div className="w-52 h-full bg-slate-400"></div>
        </div>
      </div>
    </div>
  );
}

export default MerchantDashboard;
