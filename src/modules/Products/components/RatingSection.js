import React, { useState, useEffect } from "react";
import RateSymbol from "@/shared/products/rateSymbol";
import { averageRate } from "../hooks/useRate.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";
import { supabase } from "../../../constants/supabase.js";  // Adjust path as needed

export default function RatingSection({ item }) {
  const supabaseBaseUrl = "https://pbghpzmbfeahlhmopapy.supabase.co/storage/v1/object/public/";
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  
  // Initialize likesData safely
  const [likesData, setLikesData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safe itemR calculation
  const itemR = (min, max) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.filter((review) => min < review.rating && review.rating <= max).length;
  };

  // Update the fetchReviews function
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:user_id (
            full_name,
            profile_picture
          )
        `)
        .eq('product_id', item.id)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReviews = data.map(review => ({
        id: review.id,
        userName: review.user?.full_name || 'Anonymous',
        profilePicture: review.user?.profile_picture || null,
        rate: review.rating,
        date: new Date(review.created_at).toLocaleDateString(),
        colorOrder: review.variant_name,
        sizeOrder: review.size,
        note: review.comment,
        images: review.images || [],
        likes: review.likes || 0,
        isEdited: review.is_edited
      }));

      setReviews(formattedReviews);
      
      // Initialize likesData after fetching reviews
      const initialLikesData = formattedReviews.reduce((acc, review) => {
        acc[review.id] = { likes: review.likes || 0, isLiked: false };
        return acc;
      }, {});
      setLikesData(initialLikesData);

    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data when component mounts or item changes
  useEffect(() => {
    if (item?.id) {
      fetchReviews();
    }
  }, [item?.id]);

  // Calculate average rating safely
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rate, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const toggleLike = async (reviewId) => {
    if (!isLoggedIn) {
      document.getElementById('login_Modal').showModal();
      return;
    }

    try {
      const updatedData = { ...likesData };
      const isLiked = updatedData[reviewId].isLiked;
      const newLikesCount = isLiked ? 
        updatedData[reviewId].likes - 1 : 
        updatedData[reviewId].likes + 1;

      setLikesData(prev => ({
        ...prev,
        [reviewId]: {
          isLiked: !isLiked,
          likes: newLikesCount
        }
      }));

      const { error } = await supabase
        .from('reviews')
        .update({ likes: newLikesCount })
        .eq('id', reviewId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

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

  const closeModalL = () => {
    document.getElementById('login_Modal').close();
  };

  // Add this function at the top of your component
  const getRatingCount = (rating) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.filter(review => Math.floor(review.rate) === rating).length;
  };

  return (
    <div className="flex flex-col mt-4 w-full z-10 px-4">
      {!isLoggedIn && <dialog id="login_Modal" className="modal modal-bottom sm:modal-middle absolute right-4 sm:right-0">
        <LoginFirst />
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModalL}></button>
        </form>
      </dialog>}
      <div className="my-0 divider"></div>
      <p className="text-2xl font-bold">Rating & Reviews</p>

      <div className="mt-2 rounded-md gap-2 flex flex-col bg-slate-100 p-4 overflow-y-auto custom-scrollbar">
        <p className="text-2xl font-bold">Rating</p>
        <div className="flex items-center gap-12">
          <div className="flex items-end gap-1">
            <h1 className="text-5xl font-bold">
              {calculateAverageRating()}
            </h1>
            <p className="text-3xl font-semibold opacity-75 text-secondary-color">
              /5
            </p>
          </div>
          <p className="text-xl text-secondary-color">
            || {reviews.length} Reviews
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="border-primary-color p-2 flex border-2 rounded-md w-fit">
            <RateSymbol item={averageRate(item.reviews)} size={28} />
          </div>
          <div className="flex flex-col w-full">
            {/* 5 stars */}
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <RateSymbol key={i} item={5} size={6} />
              ))}
              <div className="flex gap-4 items-center flex-1">
                <progress
                  className="progress ml-4 h-4 flex-1"
                  value={getRatingCount(5)}
                  max={reviews.length || 1}
                ></progress>
                <p className="w-8 text-right">{getRatingCount(5)}</p>
              </div>
            </div>

            {/* 4 stars */}
            <div className="flex items-center">
              {[1, 2, 3, 4].map((_, i) => (
                <RateSymbol key={i} item={5} size={6} />
              ))}
              <RateSymbol item={0} size={6} />
              <div className="flex gap-4 items-center flex-1">
                <progress
                  className="progress ml-4 h-4 flex-1"
                  value={getRatingCount(4)}
                  max={reviews.length || 1}
                ></progress>
                <p className="w-8 text-right">{getRatingCount(4)}</p>
              </div>
            </div>

            {/* 3 stars */}
            <div className="flex items-center">
              {[1, 2, 3].map((_, i) => (
                <RateSymbol key={i} item={5} size={6} />
              ))}
              {[1, 2].map((_, i) => (
                <RateSymbol key={i} item={0} size={6} />
              ))}
              <div className="flex gap-4 items-center flex-1">
                <progress
                  className="progress ml-4 h-4 flex-1"
                  value={getRatingCount(3)}
                  max={reviews.length || 1}
                ></progress>
                <p className="w-8 text-right">{getRatingCount(3)}</p>
              </div>
            </div>

            {/* 2 stars */}
            <div className="flex items-center">
              {[1, 2].map((_, i) => (
                <RateSymbol key={i} item={5} size={6} />
              ))}
              {[1, 2, 3].map((_, i) => (
                <RateSymbol key={i} item={0} size={6} />
              ))}
              <div className="flex gap-4 items-center flex-1">
                <progress
                  className="progress ml-4 h-4 flex-1"
                  value={getRatingCount(2)}
                  max={reviews.length || 1}
                ></progress>
                <p className="w-8 text-right">{getRatingCount(2)}</p>
              </div>
            </div>

            {/* 1 star */}
            <div className="flex items-center">
              <RateSymbol item={5} size={6} />
              {[1, 2, 3, 4].map((_, i) => (
                <RateSymbol key={i} item={0} size={6} />
              ))}
              <div className="flex gap-4 items-center flex-1">
                <progress
                  className="progress ml-4 h-4 flex-1"
                  value={getRatingCount(1)}
                  max={reviews.length || 1}
                ></progress>
                <p className="w-8 text-right">{getRatingCount(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="flex mt-4 flex-col gap-2">
          <p className="text-2xl font-bold">Reviews</p>
          <div className="flex flex-col items-star gap-2">
            {loading ? (
              <div className="text-center py-4">Loading reviews...</div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => {
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
                      <div className="flex items-center gap-2">
                        {review.profilePicture ? (
                          <img
                            src={review.profilePicture}
                            alt={review.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">
                              {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                            </span>
                          </div>
                        )}
                        <h3 className="text-xl font-semibold">
                          {review.userName || 'Anonymous'}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{review.rate} / 5</span>
                        <RateSymbol item={review.rate} size={5} />
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-600 text-sm">{review.date}</p>
                        {review.isEdited && (
                          <span className="text-xs text-gray-500">(edited)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 text-secondary-color opacity-75 text-sm">
                      {review.colorOrder && (
                        <div className="flex space-x-2">
                          <span>Variant:</span>
                          <span className="font-bold">{review.colorOrder}</span>
                        </div>
                      )}
                      {review.sizeOrder && (
                        <div className="flex space-x-2">
                          <span>Size:</span>
                          <span className="font-bold">{review.sizeOrder}</span>
                        </div>
                      )}
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLike(review.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          likesData[review.id]?.isLiked
                            ? 'text-primary-color'
                            : 'text-gray-600'
                        }`}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>{likesData[review.id]?.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-600">
                No reviews yet
              </div>
            )}
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
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}>Close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}