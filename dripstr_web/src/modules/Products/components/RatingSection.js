import React from "react";
import RateSymbol from "@/shared/products/rateSymbol";
import {averageRate} from "../hooks/useRate.ts";

export default function RatingSection ({item}) {
    const itemR = (min, max) =>{
        return item.reviews.filter(review => min < review.rate && review.rate <= max).length
      }

    return (
      <div className="flex flex-col mt-4 w-full px-4">
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
          <div className="flex flex-row gap-5 items-center">
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
          <div className="flex mt-4 flex-col gap-2">
            <p className="text-2xl font-bold">Reviews</p>
          </div>
        </div>
      </div>
    );
} 