import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import useCarts from "./hooks/useCart.js";
import ReportDialog from "./components/reportModal.js";
import CategoriesRibbon from "./components/CategoriesRibbon.js";
import AlertDialog from "./components/alertDialog2.js";
import ProductsView from "./components/ProductsView.js";

//Data
import { categories } from "@/constants/categories.ts";
import useProducts from "./hooks/useProducts";
import useUserProfile from "@/shared/mulletCheck";
import MerchantFollow from "./components/subcomponents/MerchantFollow.js";

function ShopPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const shop = location.state?.shop;
  const [showAlert, setShowAlert] = useState(false);
  const { fetchDataCart } = useCarts();
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState(categories[0].label);
  const { products, loading, error } = useProducts();

  const closeModalRepS = () => {
    document.getElementById("my_modal_reportS").close();
  };

  const mulletReport = () => {
    document.getElementById("my_modal_reportS").showModal();
  };

  const imagePreview = shop.shop_image != null ? shop.shop_image : null;

  if (!shop) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">
          No Shop data found. Please return to the Home page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full font-[iceland] relative inset-0  items-start justify-start bg-slate-300 flex flex-col gap-2 px-2 py-4">
      <dialog
        id="my_modal_reportS"
        className="modal modal-bottom sm:modal-middle absolute z-[60] right-4 sm:right-0"
      >
        <ReportDialog
          item={shop}
          onClose={closeModalRepS}
          accId={profile.id}
          type={"shop"}
        />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute "
        >
          <button onClick={closeModalRepS}></button>
        </form>
      </dialog>
      {showAlert && (
        <div className=" w-[95%] absolute -top-60 justify-center  flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
          <AlertDialog
            emote={require("@/assets/emote/success.png")}
            text={"Item added to cart successfully!"}
          />
        </div>
      )}
      <div className="justify-start w-full">
        <div className="max-w-[120rem] flex items-start justify-center p-4 hero-content flex-col  w-full lg:flex-col">
          <div className=" flex gap-4 items-start w-full h-full justify-between min-h-40 ">
            <div className="flex justify-center items-center  mt-1">
            {imagePreview != null || "" ? (
              <div className="relative  border-primary-color border rounded-md  flex min-h-40 w-[15rem] justify-center items-center">
                <img
                  src={imagePreview}
                  alt={`${shop.shop_name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <img
                  src={require("@/assets/emote/hmmm.png")}
                  alt="No Images Available"
                  className="w-full h-full  object-none"
                />
                <p className="text-center font-bold pr-8">
                  No images available.
                </p>
              </div>
            )}
</div>
            <div className="flex justify-between w-full min-h-[12.5rem] h-[100%]  items-center">
              <div className="flex flex-col w-full">
                <h1 className="text-5xl font-bold text-secondary-color p-1 pb-2 rounded-t-md line-clamp-2">
                  {shop.shop_name}
                </h1>
                <div className="divider p-0 m-0"></div>
                <p>{shop.description}</p>
              </div>
              {isLoggedIn && (
                <div className="flex gap-2 min-h-[12.5rem] items-start ">
                <MerchantFollow profile={profile} shop={shop} isLoggedIn={isLoggedIn} />
                  <button
                    onClick={mulletReport}
                    className="flex-none flex items-center justify-center  h-10 px-2 gap-1 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border font-[iceland] border-slate-400 hover:border-slate-800"
                  >
                    <FontAwesomeIcon icon={faTriangleExclamation} /> Report
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="h-0.5 mb-2 w-full bg-primary-color"></div>
          {/* Product  */}
          <div className=" w-full relative  bg-slate-300 flex flex-col ">
          <div className="flex flex-col-reverse gap-8 md:gap-0 md:flex-row-reverse items-center justify-center w-full  mt-1 ">
            <CategoriesRibbon
              active={filCat}
              categories={categories}
              onItemClick={(label) => setFilCat(label)}
            />
          </div>
          <div className="flex flex-wrap justify-center mb-4 p-4 gap-2">

            <ProductsView
              products={products}
              categories={filCat}
              shopFil={shop.id}
              filter={filMall}
              loading={loading}
              error={error}
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
