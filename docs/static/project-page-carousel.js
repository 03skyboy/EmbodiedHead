(function () {
  const carousels = document.querySelectorAll("[data-comparison-carousel]");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll(".comparison-carousel-slide"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    const videos = slides.map((slide) => slide.querySelector("video"));
    let activeIndex = 0;

    function normalizeIndex(index) {
      const slideCount = slides.length;
      return ((index % slideCount) + slideCount) % slideCount;
    }

    function pauseInactiveVideos() {
      videos.forEach((video, index) => {
        if (!video || index === activeIndex) {
          return;
        }
        video.pause();
      });
    }

    function updatePosterState(video, slide) {
      const shouldHidePoster = !video.paused || video.currentTime > 0.05;
      slide.classList.toggle("is-poster-hidden", shouldHidePoster);
    }

    function updateCarousel(nextIndex) {
      activeIndex = normalizeIndex(nextIndex);

      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === activeIndex);
        slide.setAttribute("aria-hidden", index === activeIndex ? "false" : "true");
      });

      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });

      pauseInactiveVideos();

      slides.forEach((slide, index) => {
        const video = videos[index];
        if (!video) {
          return;
        }
        updatePosterState(video, slide);
      });
    }

    prevBtn?.addEventListener("click", function () {
      updateCarousel(activeIndex - 1);
    });

    nextBtn?.addEventListener("click", function () {
      updateCarousel(activeIndex + 1);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", function () {
        updateCarousel(index);
      });
    });

    slides.forEach((slide, index) => {
      const video = videos[index];
      if (!video) {
        return;
      }

      ["loadedmetadata", "seeked", "play", "pause", "ended"].forEach((eventName) => {
        video.addEventListener(eventName, function () {
          updatePosterState(video, slide);
        });
      });

      slide.addEventListener("click", function (event) {
        if (index !== activeIndex) {
          return;
        }
        if (slide.classList.contains("is-poster-hidden")) {
          return;
        }
        if (event.target.closest(".comparison-carousel-arrow, .comparison-carousel-dot")) {
          return;
        }
        video.play().catch(() => {});
      });
    });

    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateCarousel(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        updateCarousel(activeIndex + 1);
      }
    });

    updateCarousel(0);
  });
})();
