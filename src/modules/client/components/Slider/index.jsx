import {
  Pagination,
  A11y,
  EffectCoverflow,
  Mousewheel,
  Keyboard,
  Navigation,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/mousewheel";
import "swiper/css/effect-coverflow";

function Slider() {
  const slides = [1,2,3,4,5,6];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center py-20">
      <div className="max-w-4xl px-4">
        <Swiper
          modules={[
            Navigation,
            Pagination,
            Keyboard,
            Mousewheel,
            A11y,
            EffectCoverflow,
          ]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={5} // hiển thị 5 ảnh
          spaceBetween={10}
          coverflowEffect={{
            rotate: -10,
            stretch: -45,
            depth: 90,
            modifier: 1,
            slideShadows: false,
          }}
          loop={true}
          className="w-full h-[200px]"
        >
          {slides.map((slide) => (
            <SwiperSlide
              key={slide.id}
              style={{
                width: "50px", // mỗi ảnh rộng 50px
                height: "150px", // mỗi ảnh cao 100px
                // display: "flex",
              }}
              className="!flex items-center justify-center bg-amber-300"
            >
              <img
                src="/assets/client/bg-doraemon.jpg"
                alt={`slide-${slide.id}`}
                style={{
                  width: "100px",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Slider;
