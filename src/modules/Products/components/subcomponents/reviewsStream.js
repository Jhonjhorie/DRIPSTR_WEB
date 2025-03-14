import React, { useState, useEffect } from "react";
import RateSymbol from "@/shared/products/rateSymbol";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import useUserProfile from "@/shared/mulletCheck.js";
import LoginFirst from "@/shared/mulletFirst";
import { supabase } from "@/constants/supabase";
import LoadingMullet from "../../../../shared/Loading";

export default function ReviewStream({ fetchReviews, reviews, loading }) {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();

  const toggleLike = async (reviewId) => {
    if (!isLoggedIn) {
      document.getElementById("login_Modal").showModal();
      return;
    }

    try {
      const { data: review, error: fetchError } = await supabase
        .from("reviews")
        .select("likes")
        .eq("id", reviewId)
        .single();

      if (fetchError) throw fetchError;

      const likesArray = review.likes || [];
      const isLiked = likesArray.includes(profile.id);

      let newLikesArray;

      if (isLiked) {
        newLikesArray = likesArray.filter((id) => id !== profile.id);
      } else {
        newLikesArray = [...likesArray, profile.id];
      }

      const { error: updateError } = await supabase
        .from("reviews")
        .update({ likes: newLikesArray })
        .eq("id", reviewId);

      if (updateError) throw updateError;

      // Re-fetch reviews to update the UI
      await fetchReviews();
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  if (loading) {
    return <div className="text-center flex items-center justify-start w-1/2 py-4 text-gray-600">
   Loading<span class="loading loading-bars loading-md"></span>
  </div>;
  }

  if (reviews.length > 0) {
    return (
      <div className="flex flex-col w-full bg-gray-50 z-10">
        {!isLoggedIn && (
          <dialog
            id="login_Modal"
            className="modal modal-bottom sm:modal-middle absolute right-4 sm:right-0"
          >
            <LoginFirst />
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => document.getElementById("login_Modal").close()}></button>
            </form>
          </dialog>
        )}

        {/* Stream of Review Cards */}
        <div className="rounded-md w-full h-40 text-secondary-color relative flex overflow-x-auto space-x-4">
          <div className="items-center flex gap-2 justify-start custom-scrollbar">
            {reviews.map((review) => {
              const isLiked = review.likes.includes(profile.id);
              return (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-64 h-full shadow-md relative border border-black border-opacity-20 rounded-lg p-4 flex flex-col justify-between"
                >
                  {/* User Info */}
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
                          {review.userName ? review.userName.charAt(0).toUpperCase() : "A"}
                        </span>
                      </div>
                    )}
                    <h3 className="text-sm font-semibold">
                      {review.userName || "Anonymous"}
                    </h3>
                  </div>

                  {/* Product Name */}
                  <p className="text-sm mt-2 text-gray-600">
                    {review.productName}
                  </p>

                  {/* Rating and Comment */}
                  <div className="space-y-2 absolute top-1 right-2">
                    <div className="flex items-center gap-1 font-[iceland]">
                      <span className="text-gray-800 text-lg font-bold">{review.rate}</span>
                      <RateSymbol item={review.rate} size={5} />
                    </div>
                  </div>

                  {/* Like Button */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {review.note}
                    </p>
                    <button
                      onClick={() => toggleLike(review.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded ${
                        isLiked ? "text-primary-color" : "text-gray-600"
                      }`}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                      <span>{review.likes.length}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center flex items-start justify-start w-1/2 py-4 text-gray-600">
        No reviews yet
      </div>
    );
  }
}