import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Swiper, { Navigation, Pagination } from "swiper";

document.addEventListener("DOMContentLoaded", (e) => {
  // COURUSEL
  const similarListParams = {
    modules: [Navigation],
    freeMode: true,
    navigation: {
      nextEl: ".similar-companies-next",
      prevEl: ".similar-companies-prev",
    },
    spaceBetween: 10,
    slidesPerView: "auto",
  };

  const corousel = new Swiper(".swiper--similar-companies", similarListParams);
  corousel.update();
});
