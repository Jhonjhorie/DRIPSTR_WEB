import React, { useState } from "react";
import RateSymbol from "@/shared/products/rateSymbol";
import {averageRate} from "../hooks/useRate.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";

export default function RatingSection ({item}) {
const supabaseBaseUrl = "https://pbghpzmbfeahlhmopapy.supabase.co/storage/v1/object/public/";
 const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [likesData, setLikesData] = useState(
    item.reviews.reduce((acc, review) => {
      acc[review.id] = { likes: review.likes, isLiked: false };
      return acc;
    }, {})
  );

  const itemR = (min, max) => {
    return item.reviews.filter((review) => min < review.rate && review.rate <= max).length;
  };
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleLike = (reviewId) => {
    if(isLoggedIn){
      setLikesData((prev) => {
        const updatedData = { ...prev };
        const isLiked = updatedData[reviewId].isLiked;
        updatedData[reviewId] = {
          isLiked: !isLiked,
          likes: isLiked ? updatedData[reviewId].likes - 1 : updatedData[reviewId].likes + 1,
        };
        return updatedData;
      });
    }else{
      setTimeout(() => {
        document.getElementById('login_Modal').showModal();
      }, 50);
    }
   
  };
  
  const closeModalL = () => {
    document.getElementById('login_Modal').close();
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviewImages, setReviewImages] = useState([]);
 
  const handlePrevSlide = () => {
    if (selectedItem?.images.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length);
    }
  };

  const handleNextSlide = () => {
    if (selectedItem?.images.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % selectedItem.images.length);
    }
  };
  
  const openModal = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      document.getElementById("my_modal_R").showModal();
    }, 50);
  };

  const closeModal = () => {
    document.getElementById("my_modal_R").close();
    setSelectedItem(null);
  };
      
    return (
       
      <div className="flex flex-col mt-4 w-full z-10 px-4">
  {!isLoggedIn && <dialog id="login_Modal" className=" modal modal-bottom sm:modal-middle absolute right-4 sm:right-0">
                   <LoginFirst />
                   <form method="dialog" class="modal-backdrop">
                    <button onClick={closeModalL}></button>
                  </form>
      </dialog>}
        <div class="my-0 divider"></div>
        <p className="text-2xl font-bold">Rating & Reviews</p>

        <div className="mt-2 rounded-md gap-2 flex flex-col bg-slate-100 p-4  overflow-y-auto custom-scrollbar">
          <p className="text-2xl font-bold">Rating</p>
          <div className="flex items-center gap-12">
            <div className="flex items-end gap-1">
              <h1 className="text-5xl font-bold">
                {averageRate(item.reviews) || "0.0"}
              </h1>
              <p className="text-3xl font-semibold opacity-75 text-secondary-color">
                /5
              </p>
            </div>
            <p className="text-xl  text-secondary-color">
              || {item.reviews.length} Reviews
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="border-primary-color p-2 flex border-2 rounded-md w-fit">
              <RateSymbol item={averageRate(item.reviews)} size={28} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <div className="flex gap-4 items-center">
                  <progress
                    class="progress ml-4 h-4 w-56"
                    value={itemR(4.7, 5.0)}
                    max={item.reviews.length}
                  ></progress>
                  <p>{itemR(4.7, 5.0)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <RateSymbol item={0} size={6} />
                <div className="flex gap-4 items-center">
                  <progress
                    class="progress ml-4 h-4 w-56"
                    value={itemR(3.9, 4.7)}
                    max={item.reviews.length}
                  ></progress>
                  <p>{itemR(3.9, 4.7)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <RateSymbol item={0} size={6} />
                <RateSymbol item={0} size={6} />
                <div className="flex gap-4 items-center">
                  <progress
                    class="progress ml-4 h-4 w-56"
                    value={itemR(2.9, 3.9)}
                    max={item.reviews.length}
                  ></progress>
                  <p>{itemR(2.9, 3.9)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <RateSymbol item={5} size={6} />
                <RateSymbol item={5} size={6} />
                <RateSymbol item={0} size={6} />
                <RateSymbol item={0} size={6} />
                <RateSymbol item={0} size={6} />
                <div className="flex gap-4 items-center">
                  <progress
                    class="progress ml-4 h-4 w-56"
                    value={itemR(1.9, 2.9)}
                    max={item.reviews.length}
                  ></progress>
                  <p>{itemR(1.9, 2.9)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <RateSymbol item={5} size={6} />
                <RateSymbol item={0} size={6} />
                <RateSymbol item={0} size={6} />
                <RateSymbol item={0} size={6} />
                <RateSymbol item={0} size={6} />
                <div className="flex gap-4 items-center">
                  <progress
                    class="progress ml-4 h-4 w-56"
                    value={itemR(0.9, 1.9)}
                    max={item.reviews.length}
                  ></progress>
                  <p>{itemR(0.9, 1.9)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="flex mt-4 flex-col gap-2">
            <p className="text-2xl font-bold">Reviews</p>
            <div className="flex flex-col items-star gap-2">
              {item.reviews.map((review) => {
                const { likes, isLiked } = likesData[review.id] || {
                  likes: review.likes,
                  isLiked: false,
                };
                return (
                  <div
                    key={review.id}
                    className="border border-gray-300 p-4 rounded-lg shadow-md space-y-2"
                  >
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold">
                        {review.userName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{review.rate} / 5</span>
                        <RateSymbol item={review.rate} size={5} />
                      </div>
                      <p className="text-gray-600 text-sm">{review.date}</p>
                    </div>
                    <div className="flex gap-4 text-secondary-color opacity-75 text-sm">
                      <div className="flex space-x-2">
                        <span>Variant:</span>
                        <span className="font-bold">{review.colorOrder}</span>
                      </div>

                      <div className="flex space-x-2">
                        <span>Size:</span>
                        <span className="font-bold">{review.sizeOrder}</span>
                      </div>
                    </div>

                    <p className="text-gray-800">{review.note}</p>
                    {review.images.length > 0 && (
                      <div className="stack">
                        {review.images.map((image, index) => (
                          <div
                            key={index}
                            className="border-base-content card bg-base-100 w-36 border text-center"
                          >
                       
                            <div className="card-body">
                              <img
                                src={`${supabaseBaseUrl}${image}`}
                                alt={`Review image ${index + 1}`}
                                onClick={() => openModal(review)}
                                className="w-full h-24 object-fill rounded-md cursor-pointer"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleLike(review.id)}
                          className="text-blue-500"
                         
                        >
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            className={`${
                              isLiked
                                ? "text-primary-color"
                                : "text-secondary-color"
                            } cursor-pointer duration-300 transition-all h-5`}
                          />
                        </button>
                        <span>{likes}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
   
      {selectedItem && (
        <dialog id="my_modal_R" className="modal">
          <div className="modal-box">
            <div className="carousel w-full h-[70vh] bg-slate-50 rounded-md overflow-y-hidden">
              {selectedItem.images.length > 0 ? (
                <div className="carousel-item relative w-full justify-center items-center">
                  <img
                    src={`${supabaseBaseUrl}${selectedItem.images[currentSlide]}`}
                    alt={`Review Image ${currentSlide}`}
                    className="w-[40rem] h-[90%] object-contain"
                  />
                  {selectedItem.images.length > 1 && (
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <button onClick={handlePrevSlide} className="btn btn-circle">
                        ❮
                      </button>
                      <button onClick={handleNextSlide} className="btn btn-circle">
                        ❯
                      </button>
                    </div>
                  )}
                    {/* Dots Navigation */}
                    <div className="absolute bottom-0 bg-slate-300 rounded-t-lg left-[10%] flex justify-center space-x-2 w-24 h-4 p-1">
                    {selectedItem.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full drop-shadow-lg transition-all duration-300 ${
                          currentSlide === index
                            ? "bg-slate-50 w-4"
                            : currentSlide === index - 1 || currentSlide === index + 1
                            ? "bg-primary-color w-3"
                            : "bg-secondary-color w-2"
                        }`}
                      ></button>
                    ))}
                  </div>
           
                </div>
              ) : (
                <p className="text-center w-full py-4">No images available.</p>
              )}
            </div>
            <button
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost fixed right-2 top-2"
              >
                ✕
              </button>
           
          </div>
          <form method="dialog" class="modal-backdrop">
                    <button onClick={closeModal}>Close</button>
            </form>
        </dialog>
      )}
    </div>
    );
}