// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import HeaderDefault from "../../components/Header";
import FooterDefault from "../../components/Footer";
import { Outlet } from "react-router-dom";

function LayoutDefault() {
  return (
    <>
      <HeaderDefault />
      <main>
       <Outlet/>
      </main>
      <FooterDefault />
    </>
  );
}

export default LayoutDefault;
