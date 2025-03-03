// src/pages/Home.js
import React, { useState, useEffect } from "react";
import Carousel from "./components/Carousel";

import ProductsView from "../Products/components/ProductsView";
import LandingPage from "./Landing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faShoppingCart,
  faStore,
  faTags,
  faFileContract,
  faQuestion,
  faContactCard,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import SectionWrapper from "./components/SectionWrapper";
import { useNavigate } from "react-router-dom";
import Contact from "@/shared/products/Contact";

//Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from "@/constants/categories.ts";
import CategoriesRibbon from "../Products/components/CategoriesRibbon";
import { Images } from "@/constants/sampleData";
import useProducts from "../Products/hooks/useProducts";
import useUserProfile from "@/shared/mulletCheck";
import useAds from "./hooks/useAds";
import InvitationCard from "./components/invitationCard";
import LoadingMullet from "@/shared/Loading";
import TermsCon from "@/shared/products/termsCon";
import FaQCom from "../../shared/products/faqCom";
import VoucherStream from "./components/VoucherStream";
import ChatSupport from "./components/ChatSupport";
import useMediaQueryChecker from "../../shared/hooks/useMediaQueryChecker";
import useResponsiveItems from "../../shared/hooks/useResponsiveItems";
import Mall from "../Products/Mall";
import AdsBanner from "./components/AdsBanner";
import PremShop from "../Products/components/premiumShop";

function Home() {
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState(categories[0].label);
 
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const { ads, pShop, loading2, error2 } = useAds();
  const [showItem, setShowItem] = useState(3);
  const { products, loading, error } = useProducts(profile);
  const navigate = useNavigate();

  const itemsToShow = useResponsiveItems({ mb: 2, sm: 2, md: 3, lg: 3 });

  if (loadingP) return <LoadingMullet />;

  if (!isLoggedIn) return <LandingPage />;
  const openModalTerms = () => {
    const modal = document.getElementById("my_modal_terms");
    if (modal) {
      modal.showModal();
    }
  };
  const closeModalTerms = () => {
    const modal = document.getElementById("my_modal_terms");
    if (modal) {
      modal.close();
    }
  };
  const openModalFaq = () => {
    const modal = document.getElementById("my_modal_faq");
    if (modal) {
      modal.showModal();
    }
  };
  const closeModalFaq = () => {
    const modal = document.getElementById("my_modal_faq");
    if (modal) {
      modal.close();
    }
  };
  const openModalCont = () => {
    const modal = document.getElementById("my_modal_Cont");
    if (modal) {
      modal.showModal();
    }
  };
  const closeModalCont = () => {
    const modal = document.getElementById("my_modal_Cont");
    if (modal) {
      modal.close();
    }
  };
  const openModalChatBot = () => {
    const modal = document.getElementById("my_modal_Chatbot");
    if (modal) {
      modal.showModal();
    }
  };
  const closeModalChatBot = () => {
    const modal = document.getElementById("my_modal_Chatbot");
    if (modal) {
      modal.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <section className="w-full py-4 bg-gray-50 flex justify-center">
        <div className="container mx-2 h-96 flex flex-col md:flex-row justify-center">
          <Carousel images={Images} />
          <AdsBanner ads={ads} />
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-2 md:py-6">
        {/* Categories and Vouchers Row */}
        <div className="flex flex-col lg:flex-row w-full gap-4 mb-8">
          <div className="w-full lg:w-3/4">
            <CategoriesRibbon
              active={filCat}
              categories={categories}
              onItemClick={(label) => setFilCat(label)}
            />
          </div>
          <PremShop shops={pShop} />
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SectionWrapper
            title="Discounted Products"
            icon={faTags}
            buttonText="See More"
          >
            <ProductsView
              products={products}
              shopFil={0}
              categories={filCat}
              filter={3}
              loading={loading}
              error={error}
              showItem={itemsToShow}
              sort="top"
              isSmall={true}
            />
          </SectionWrapper>

          <SectionWrapper
            title="Followed Stores"
            icon={faStore}
            buttonText="See More"
          >
            <ProductsView
              products={products}
              shopFil={0}
              categories={filCat}
              filter={filMall}
              loading={loading}
              error={error}
              showItem={itemsToShow}
              sort={"top"}
              isSmall={true}
            />
          </SectionWrapper>
        </div>
        <div className="flex flex-col lg:flex-row w-full gap-2 md:gap-10 mb-8 items-center justify-between">
        
            {isLoggedIn && (
              <div className="w-[95%] mr-2 md:mr-0 lg:w-[40%] ">
                <VoucherStream profile={profile} />
              </div>
            )}
            {isLoggedIn && (
              <div className="w-full lg:w-[65%] ">
                <InvitationCard
                  profile={profile}
                  loadingP={loadingP}
                  errorP={errorP}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            )}
   
        </div>
        {/* Full Width Recommendations */}
        <SectionWrapper
          title="Recommended For You"
          icon={faShoppingCart}
          buttonText="Go to Mall"
        >
          <ProductsView
            products={products}
            shopFil={0}
            categories={filCat}
            filter={filMall}
            loading={loading}
            error={error}
            showItem={0}
            sort={"top"}
          />
        </SectionWrapper>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24   sm:bottom-16 right-6 flex flex-col space-y-3 z-10">
        <button
          onClick={openModalChatBot}
          className="p-1 md:p-3 bg-white  z-0 opacity-50 hover:opacity-100 rounded-full shadow-md text-secondary-color hover:bg-secondary-color hover:text-white transition-colors duration-200"
          aria-label="Chat Support"
        >
          <FontAwesomeIcon icon={faHeadset} className=" text-base md:text-lg" />
        </button>

        <button
          onClick={openModalFaq}
          className="p-1 md:p-3 bg-white  z-0 opacity-50 hover:opacity-100 rounded-full shadow-md text-secondary-color hover:bg-secondary-color hover:text-white transition-colors duration-200"
          aria-label="FAQ"
        >
          <FontAwesomeIcon
            icon={faQuestion}
            className=" text-base md:text-lg"
          />
        </button>

        <button
          onClick={openModalTerms}
          className="p-1 md:p-3 bg-white z-0 opacity-50 hover:opacity-100 rounded-full shadow-md text-secondary-color hover:bg-secondary-color hover:text-white transition-colors duration-200"
          aria-label="Terms and Conditions"
        >
          <FontAwesomeIcon
            icon={faFileContract}
            className=" text-base md:text-lg"
          />
        </button>
      </div>

      {/* Modals */}
      <dialog
        id="my_modal_terms"
        className="modal modal-bottom sm:modal-middle"
      >
        <TermsCon onClose={closeModalTerms} />
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModalTerms}></button>
        </form>
      </dialog>

      <dialog id="my_modal_faq" className="modal modal-bottom sm:modal-middle">
        <FaQCom onClose={closeModalFaq} />
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModalFaq}></button>
        </form>
      </dialog>

      <dialog id="my_modal_Cont" className="modal modal-bottom sm:modal-middle">
        <Contact onClose={closeModalCont} />
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModalCont}></button>
        </form>
      </dialog>

      <dialog
        id="my_modal_Chatbot"
        className="modal modal-bottom sm:modal-middle"
      >
        <ChatSupport onClose={closeModalChatBot} profile={profile} />
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModalChatBot}></button>
        </form>
      </dialog>

      {/* Footer */}
      <footer className="bg-slate-50 border-t w-full border-gray-200 mb-8 md:mb-0 py-4">
        <div className="container mx-auto px-4 flex flex-row justify-between items-center">
          <div className="flex items-center md:mb-0">
            <img
              src={require("@/assets/logoBlack.png")}
              alt="Logo"
              className="h-6 mr-2"
            />
            <p className="text-sm text-gray-600">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="text-gray-600 hover:text-primary-color font-medium text-sm"
              onClick={() => navigate("/About")}
            >
              About Us
            </button>
            <button
              onClick={openModalCont}
              className="p-1 md:p-3 bg-white rounded-full shadow-md text-secondary-color hover:bg-secondary-color hover:text-white transition-colors duration-200"
              aria-label="Contact Us"
            >
              <FontAwesomeIcon icon={faContactCard} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
