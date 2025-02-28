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
import InvitationCard from "./components/invitationCard";
import LoadingMullet from "@/shared/Loading";
import TermsCon from "@/shared/products/termsCon";
import FaQCom from "../../shared/products/faqCom";
import VoucherStream from "./components/VoucherStream";
import ChatSupport from "./components/ChatSupport";
import useMediaQueryChecker from "../../shared/hooks/useMediaQueryChecker";
import useResponsiveItems from "../../shared/hooks/useResponsiveItems";

function Home() {
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState(categories[0].label);
  const { products, loading, error } = useProducts();
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [showItem, setShowItem] = useState(3);
  const navigate = useNavigate();

 const itemsToShow = useResponsiveItems({mb: 2, sm: 2, md: 3, lg: 3})


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
    <div className=" w-full relative inset-0 bg-slate-300 flex flex-col">
      <div className="flex  gap-4 md:flex-row justify-center items-center p-4 h-[49%] lg:h-[48%]">
        <Carousel images={Images} />
      </div>
      <div className="flex  gap-4 md:flex-row w-full justify-center items-center p-4 ">
        {isLoggedIn &&  <VoucherStream profile={profile}/> }
     
      </div>
      <CategoriesRibbon
          active={filCat}
          categories={categories}
          onItemClick={(label) => setFilCat(label)}
        />
      <div className="flex flex-col lg:flex-row  flex-wrap w-full px-10 justify-center items-center mb-4 gap-10 ">
        <SectionWrapper
          title="Discounted Products"
          icon={faTags}
          buttonText="See More"
          bgColor="bg-secondary-color"
          width="w-[90%] md:w-[77%] lg:w-[45%]"
          filter={3}
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
          title="Followed Store"
          icon={faStore}
          buttonText="See More"
          bgColor="bg-stone-700"
          width="w-[90%] md:w-[77%] lg:w-[45%]"
        
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
          />
        </SectionWrapper>

        <SectionWrapper
          title="Recommended For You"
          icon={faShoppingCart}
          buttonText="Go to Mall"
          bgColor="bg-transparent"
          textColor="text-secondary-color"
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
      </div>
      <button
        onClick={openModalTerms}
        class="flex-none flex fixed bottom-16 right-5 items-center justify-center w-10 h-10 bg-secondary-color opacity-70 hover:opacity-100 rounded-md text-slate-400 hover:text-primary-color hover:bg-slate-50 duration-300 transition-all border border-slate-400 hover:border-primary-color"
      >
        <FontAwesomeIcon icon={faFileContract} />
      </button>
      <button
        onClick={openModalFaq}
        class="flex-none flex fixed bottom-28 right-5 items-center justify-center w-10 h-10 bg-secondary-color opacity-70 hover:opacity-100 rounded-md text-slate-400 hover:text-primary-color hover:bg-slate-50 duration-300 transition-all border border-slate-400 hover:border-primary-color"
      >
        <FontAwesomeIcon icon={faQuestion} />
      </button>
      <button
        onClick={openModalChatBot}
        class="flex-none flex fixed bottom-40 right-5 items-center justify-center w-10 h-10 bg-secondary-color opacity-70 hover:opacity-100 rounded-md text-slate-400 hover:text-primary-color hover:bg-slate-50 duration-300 transition-all border border-slate-400 hover:border-primary-color"
      >
        <FontAwesomeIcon icon={faHeadset} />
      </button>
      <dialog
        id="my_modal_terms"
        className="modal modal-bottom sm:modal-middle absolute z-50 right-4 sm:right-0"
      >
        <TermsCon onClose={closeModalTerms} />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute "
        >
          <button onClick={closeModalTerms}></button>
        </form>
      </dialog>
      <dialog
        id="my_modal_faq"
        className="modal modal-bottom sm:modal-middle absolute z-50 right-4 sm:right-0"
      >
        <FaQCom onClose={closeModalFaq} />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute "
        >
          <button onClick={closeModalFaq}></button>
        </form>
      </dialog>
      <dialog
        id="my_modal_Cont"
        className="modal modal-bottom sm:modal-middle absolute z-50 right-4 sm:right-0"
      >
        <Contact onClose={closeModalCont} />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute "
        >
          <button onClick={closeModalCont}></button>
        </form>
      </dialog>
      <dialog
        id="my_modal_Chatbot"
        className="modal modal-bottom sm:modal-middle absolute z-50 right-4 sm:right-0"
      >
        <ChatSupport onClose={closeModalChatBot} profile={profile} />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute "
        >
          <button onClick={closeModalChatBot}></button>
        </form>
      </dialog>
      <footer class="footer bg-secondary-color text-neutral-content items-center p-2 ">
  <aside class="grid-flow-col items-center">
  <img
                src={require("@/assets/logoWhite.png")}
                alt="No Images Available"
                className=" h-6  "
              />
    <p className="text-sm">Copyright © {new Date().getFullYear()} - All right reserved</p>
  </aside>
  <nav class="grid-flow-col gap-4 md:place-self-center place-items-center md:justify-self-end">
        <button className="hover:underline font-semibold" onClick={() => {navigate("/About")}}>
      About Us
    </button>
    <button
        onClick={openModalCont}
        class="flex-none flex items-center justify-center w-10 h-10 bg-secondary-color opacity-70 hover:opacity-100 rounded-md text-slate-400 hover:text-primary-color hover:bg-slate-50 duration-300 transition-all border border-slate-400 hover:border-primary-color"
      >
        <FontAwesomeIcon icon={faContactCard} />
      </button>
    
  </nav>
</footer>
    </div>
  );
}

export default Home;
