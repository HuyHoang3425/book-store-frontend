// src/Slider.jsx
import {
  Pagination,
  A11y,
  EffectCoverflow,
  Mousewheel,
  Keyboard,
  Navigation,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import { useRef } from "react";

export default function Slider() {
  const colors = ["red", "blue", "green", "orange", "purple", "pink"];
  const swiperRef = useRef(null);
  return (
    <>
      {/* CSS nội tuyến giống file HTML gốc */}
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background-color: rgb(255,148,148); }

        .slider-section {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .custom-swiper {
          width: 600px;
          padding: 60px 0;
        }
        .custom-swiper .swiper-slide {
          width: 100px;   /* mỗi slide rộng 100px */
          height: 200px;  /* cao 200px */
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        
      `}</style>

      <section className="slider-section">
        <div>
          <Swiper
            modules={[
              Navigation,
              Pagination,
              Keyboard,
              Mousewheel,
              A11y,
              EffectCoverflow,
            ]}
            // onSwiper={(swiper) => (swiperRef.current = swiper)}
            navigation={true}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: false,
            }}
            slideToClickedSlide={true}
            className="custom-swiper bg-amber-100"
          >
            {colors.map((c, i) => (
              <SwiperSlide
                key={i}
                onClick={() => swiperRef.current.slideToLoop(i)}
                className="h-[400px]"
              >
                <div
                  className="slide-img h-full w-[150px] rounded-2xl"
                  style={{ background: c }}
                  aria-hidden="true"
                  >
                    <img src="/assets/client/dragon-ball.jpg" alt="" />
                  </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}
