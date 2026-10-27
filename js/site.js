/* Aakarsh Consultancy - site script.
   The mobile menu is handled by the Bootstrap bundle, so this file only
   stamps the footer year. The enquiry form is handled by the inline
   Web3Forms script in contact.html. */
(function () {
  "use strict";

  var yr = document.getElementById("year");
  if (yr) {
    yr.textContent = String(new Date().getFullYear());
  }
})();

/* Recruitment steps carousel (recruitment.html).
   Continuous right-to-left scroll with a seamless loop, pausing on hover,
   focus and touch. The viewport is a real scroll container, so touch and
   trackpad gestures work natively and the arrows are just scrollBy calls. */
(function () {
  "use strict";

  var root = document.querySelector("[data-steps-carousel]");
  if (!root || !window.requestAnimationFrame) {
    return;
  }

  var viewport = root.querySelector(".steps-carousel__viewport");
  var track = root.querySelector(".steps-track");
  if (!viewport || !track || !track.children.length) {
    return;
  }

  /* Duplicate the sequence once. Scrolling past the first set lands on an
     identical second set, so resetting by exactly half the track is invisible
     and the loop never jumps back to the start. */
  var originals = Array.prototype.slice.call(track.children);
  originals.forEach(function (slide) {
    var clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    var img = clone.querySelector("img");
    if (img) {
      img.setAttribute("alt", "");
    }
    track.appendChild(clone);
  });

  var PX_PER_SECOND = 40;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var paused = false;
  var holdUntil = 0;
  var lastFrame = null;
  var resumeTimer = null;

  /* Distance from a slide to its clone, measured off the layout rather than
     derived from scrollWidth. Half the track is NOT the right figure: the
     track is 16 slides and 15 gaps, so scrollWidth / 2 is short by half a gap
     and the loop would jolt backwards every cycle. */
  function loopDistance() {
    var first = track.children[0];
    var clone = track.children[originals.length];
    if (!first || !clone) {
      return track.scrollWidth / 2;
    }
    return clone.offsetLeft - first.offsetLeft;
  }

  function slideStep() {
    var first = track.children[0];
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return first ? first.getBoundingClientRect().width + gap : 240;
  }

  /* Keep scrollLeft inside the first copy of the sequence. */
  function wrap() {
    var distance = loopDistance();
    if (distance > 0 && viewport.scrollLeft >= distance) {
      viewport.scrollLeft -= distance;
    }
  }

  function isRunning() {
    return !paused && !reduceMotion.matches && !document.hidden && Date.now() >= holdUntil;
  }

  function frame(now) {
    if (lastFrame === null) {
      lastFrame = now;
    }
    var elapsed = (now - lastFrame) / 1000;
    lastFrame = now;

    /* Clamp so returning to a backgrounded tab does not lurch forward. */
    if (elapsed > 0.1) {
      elapsed = 0.1;
    }

    if (isRunning()) {
      viewport.scrollLeft += PX_PER_SECOND * elapsed;
      wrap();
    }

    window.requestAnimationFrame(frame);
  }

  /* Arrows. Nudging forward past the last original slide wraps back to the
     start seamlessly via the duplicate set. Nudging back from the very start
     first hops forward to the matching spot in the duplicate set.
     holdUntil keeps the auto-scroll off while the smooth scroll plays out. */
  function nudge(direction) {
    var step = slideStep();
    var distance = loopDistance();

    /* Moving left from near the start: jump to clone set first */
    if (direction < 0 && viewport.scrollLeft < step + 2) {
      viewport.scrollLeft += distance;
    }

    /* Moving right past the original slides: wrap back to start */
    if (direction > 0 && viewport.scrollLeft >= distance - step) {
      viewport.scrollLeft -= distance;
    }

    /* Set hold time after any positioning jumps */
    holdUntil = Date.now() + 700;

    /* Honour reduced motion for the arrows too: jump instead of gliding. */
    var behavior = reduceMotion.matches ? "auto" : "smooth";
    if (typeof viewport.scrollBy === "function") {
      try {
        viewport.scrollBy({ left: direction * step, behavior: behavior });
        return;
      } catch (err) {
        /* older browsers reject the options object */
      }
    }
    viewport.scrollLeft += direction * step;
  }

  var prev = root.querySelector(".steps-nav--prev");
  var next = root.querySelector(".steps-nav--next");
  if (prev) {
    prev.addEventListener("click", function () {
      nudge(-1);
    });
  }
  if (next) {
    next.addEventListener("click", function () {
      nudge(1);
    });
  }

  function pause() {
    paused = true;
  }

  function resume() {
    paused = false;
  }

  root.addEventListener("mouseenter", pause);
  root.addEventListener("mouseleave", resume);
  root.addEventListener("focusin", pause);
  root.addEventListener("focusout", resume);

  /* Touch: hold while the finger is down, then let momentum settle. */
  viewport.addEventListener("touchstart", function () {
    if (resumeTimer) {
      window.clearTimeout(resumeTimer);
      resumeTimer = null;
    }
    pause();
  }, { passive: true });

  viewport.addEventListener("touchend", function () {
    resumeTimer = window.setTimeout(resume, 1500);
  }, { passive: true });

  /* Manual scrolling should wrap too, otherwise a swipe can run off the end. */
  viewport.addEventListener("scroll", function () {
    if (Date.now() >= holdUntil) {
      wrap();
    }
  }, { passive: true });

  window.requestAnimationFrame(frame);
})();

/* Overlapping photo stack reveal (index.html, "Our commitments").
   The cards start hidden in the stylesheet; this adds .is-visible the first
   time a stack scrolls into view, and the stagger and easing are CSS. The
   no-scripting case is covered by the <noscript> override in the page head. */
(function () {
  "use strict";

  var stacks = document.querySelectorAll("[data-photo-stack]");
  if (!stacks.length) {
    return;
  }

  var each = function (fn) {
    Array.prototype.forEach.call(stacks, fn);
  };

  var reveal = function (stack) {
    stack.classList.add("is-visible");
  };

  var reduceMotion = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* No observer, or the visitor asked for less movement: show them outright.
     The stylesheet starts the cards hidden, so this branch must always run. */
  if (reduceMotion || !("IntersectionObserver" in window)) {
    each(reveal);
    return;
  }

  var observer = new IntersectionObserver(function (entries, self) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        reveal(entry.target);
        self.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });

  each(function (stack) {
    observer.observe(stack);
  });
})();

/* Hero Carousel - Auto-scrolling image slider
   Automatically cycles through images every 4 seconds with smooth fade transitions.
   Clicking dots allows manual navigation. */
(function () {
  "use strict";

  var carousel = document.querySelector(".hero-carousel");
  if (!carousel) {
    return;
  }

  var slides = carousel.querySelectorAll(".carousel-slide");
  var dots = carousel.querySelectorAll(".carousel-dots .dot");
  
  if (!slides.length || !dots.length) {
    return;
  }

  var currentSlide = 0;
  var autoPlayInterval = null;
  var SLIDE_DURATION = 4000; // 4 seconds per slide

  function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(function(slide) {
      slide.classList.remove("active");
    });
    dots.forEach(function(dot) {
      dot.classList.remove("active");
    });

    // Add active class to current slide and dot
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  }

  function nextSlide() {
    var next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // Add click event to dots
  dots.forEach(function(dot, index) {
    dot.addEventListener("click", function() {
      showSlide(index);
      stopAutoPlay();
      // Restart autoplay after manual interaction
      setTimeout(startAutoPlay, SLIDE_DURATION);
    });
  });

  // Pause on hover
  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);

  // Pause when page is not visible
  document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  // Start the carousel
  startAutoPlay();
})();
