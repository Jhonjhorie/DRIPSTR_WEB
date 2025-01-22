import React, { useEffect, useState } from "react";
import logo from "../../../assets/shop/logoWhite.png";
import "../../../assets/shop/fonts/font.css";
import { useNavigate } from "react-router-dom";
import "boxicons";

function ArtistCreate() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");

  const phonedigit = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhoneNumber(value);
  };

  return (
    <div className="h-full w-full">
      <div className="h-auto w-full lg:flex bg-slate-300 p-1  ">
        {/* SECOND CONTAINER */}

        {/* FIRST CONTAINER */}
        <div className=" h-auto w-full lg:w-[55%] md:p-10 overflow-hidden ">
          <div className="flex md:gap-2 md:justify-start justify-center mt-5 md:mt-0  ">
            <box-icon
              name="palette"
              type="solid"
              color="#4D077C"
              size="md"
            ></box-icon>
            <div className="font-bold text-2xl  flex p-2 text-custom-purple iceland-regular ">
              Create Artist Account
            </div>
          </div>
          <div className="font-bold text-5xl text-center md:text-left p-2 text-custom-purple iceland-bold">
            Get Started
          </div>
          <div className="md:flex w-full place-items-center h-[50%] gap-2 lg:gap-8  p-2 ">
            <div className="w-full md:w-1/2 h-full flex items-center justify-center">
              <div className="w-full max-w-xs">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-slate-800 font-semibold">
                      What is your Artist Name?
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered text-black bg-slate-100 border-violet-950 border-[2px] w-full"
                  />
                </label>
                <label className="form-control w-full max-w-xs mt-2">
                  <div className="label">
                    <span className="label-text text-slate-800 font-semibold">
                      What is your contact number?
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    placeholder="Type here"
                    onChange={phonedigit}
                    className="input input-bordered bg-slate-100 text-black border-violet-950 border-[2px] w-full"
                  />
                </label>
                <div className="label">
                  <span className="label-text-alt text-slate-700">
                    Phone number should be 11 digits.
                  </span>
                </div>

                <label className="form-control w-full max-w-xs ">
                  <div className="label">
                    <span className="label-text font-semibold text-slate-800">
                      What is your Art Style?
                    </span>
                  </div>
                  <select className="select select-bordered bg-slate-100 text-black border-violet-950 border-[2px] w-full">
                    <option value="">Select an option</option>
                    <option value="">Street Art/Graffiti</option>
                    <option value="">Digital Art</option>
                    <option value="">Comic/Cartoon Art</option>
                    <option value="">Anime/Manga</option>
                    <option value="">Chibi Style</option>
                    <option value="">Pixel Art</option>
                    <option value="">Cubism</option>
                    <option value="">Realism</option>
                    <option value="">etc</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="w-full md:w-1/2 h-full rounded-md  place-items-center justify-center p-2">
              <div className="bg-slate-100 w-72 h-52 flex items-center justify-center mt-5 border-violet-950 border-2 rounded-md">
                {/* SHOP LOGO GOES HERE */}
                <box-icon
                  name="image"
                  type="solid"
                  size="100px"
                  color="#6803a0"
                ></box-icon>
              </div>
              <div className="h-auto w-full flex mt-6 justify-center ">
                <input
                  type="file"
                  className="file-input bg-slate-100 border-violet-950 border-2 max-w-xs  bottom-0 file-input-bordered w-full"
                />
              </div>
            </div>
          </div>

          <label className="form-control mx-2 flex justify-center items-center md:items-start ">
            <div className="label">
              <span className="label-text font-semibold text-slate-800">
                Introduce yourself
              </span>
            </div>
            <textarea
              className="textarea resize-none textarea-bordered w-[90%] md:w-full bg-slate-100 text-black border-violet-950 border-[2px] h-24"
              placeholder="Type your Shop Address here"
            ></textarea>
          </label>
          <div className="w-full h-auto justify-end flex m-2  mb-14 md:mb-0">
           
            <button
              onClick={() => navigate("/shop/Artist/ArtistDashboard")}
              className="btn glass bg-custom-purple   mr-5 iceland-regular tracking-wide text-lg text-white "
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistCreate;
