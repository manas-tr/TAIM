/* ─── EXCEPTIONAL TAIM INTRO ─── */
(function () {
  function resetPagePosition() {
    if (!window.location.hash) window.scrollTo(0, 0);
  }

  if (!window.location.hash) {
    window.history.scrollRestoration = "manual";
    resetPagePosition();
    window.addEventListener("pageshow", resetPagePosition);
  }

  var loader = document.getElementById("pageLoader");
  if (!loader) return;

  document.body.style.overflow = "hidden";

  function dismissIntro() {
    loader.classList.add("loaded");
    document.body.style.overflow = "";
    setTimeout(function () {
      if (loader && loader.parentNode) loader.remove();
    }, 850);
  }

  /* Brief cinematic moment (950ms) then smoothly blooms out */
  setTimeout(dismissIntro, 950);
})();

/* ─── HEADER SCROLL GLASS STATE ─── */
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;
  function onScroll() {
    if (window.scrollY > 15) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ─── HANDWRITING EFFECT ─── */
(function () {
  function writeByHand(el) {
    var text = el.textContent.trim();
    if (!text) return;
    el.textContent = "";
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement("span");
      span.textContent = text[i];
      span.style.display = text[i] === " " ? "inline" : "inline-block";
      span.style.transform =
        "translateY(" +
        ((i % 3) - 1) * 0.7 +
        "px) rotate(" +
        ((i % 5) - 2) * 1.1 +
        "deg)";
      el.appendChild(span);
    }
  }
  /* Only apply to .hand elements that are purely decorative (not nav/buttons) */
  document
    .querySelectorAll(
      ".hero-kicker, .hero-handnote, .hand-note, .persona-note, .loader-logo, .footer-tagline, .step-num",
    )
    .forEach(writeByHand);
})();

/* ─── SCROLL REVEAL ─── */
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -50px 0px" },
  );

  els.forEach(function (el) {
    /* Stagger siblings that are direct children of the same parent */
    var siblings = el.parentElement
      ? el.parentElement.querySelectorAll(".reveal")
      : [];
    var idx = Array.prototype.indexOf.call(siblings, el);
    el.style.transitionDelay = Math.min(idx * 0.1, 0.4) + "s";
    observer.observe(el);
  });
})();

/* ─── HERO ROLLING WORDS LOOP ─── */
(function () {
  var track =
    document.getElementById("heroRoller") ||
    document.getElementById("heroRollerTrack");
  if (!track) return;
  var items = track.querySelectorAll(".hero-roll-item");
  if (!items.length) return;

  var currentIndex = 0;
  var count = items.length;

  function updateRoller(index) {
    items.forEach(function (item, i) {
      if (i === index) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
    var itemHeight =
      items[0].offsetHeight || items[0].getBoundingClientRect().height;
    if (itemHeight > 0) {
      track.style.transform = "translateY(-" + index * itemHeight + "px)";
    } else {
      track.style.transform = "translateY(-" + index * 1.25 + "em)";
    }
  }

  window.addEventListener(
    "resize",
    function () {
      updateRoller(currentIndex);
    },
    { passive: true },
  );

  setInterval(function () {
    currentIndex = (currentIndex + 1) % count;
    updateRoller(currentIndex);
  }, 2600);
})();

/* ─── 2-IPHONE INTERACTIVE & LOOPING DEMO ─── */
(function () {
  var stepBtns = document.querySelectorAll(".demo-steps-nav .step-btn");
  var panes = document.querySelectorAll(".demo-screen-pane");
  var stepCaption = document.getElementById("demoStepCaption");
  var taskItem = document.getElementById("demoTaskItem");
  if (!panes.length) return;

  var stepScreens = ["routing", "threads", "schedule"];
  var stepCaptions = {
    routing: "Routing - thoughts into threads and tasks",
    threads: "Threads - notes, ideas, and the stuff you keep forgetting",
    schedule: "Schedule - what is next and when it is due",
  };

  var currentStepIdx = 0;
  var loopTimer = null;
  var taskTimeout = null;

  function setScreen(screenName) {
    // Update active pane
    panes.forEach(function (pane) {
      pane.classList.toggle("active", pane.id === "pane-" + screenName);
    });

    // Update active step button
    stepBtns.forEach(function (btn) {
      btn.classList.toggle(
        "active",
        btn.getAttribute("data-screen") === screenName,
      );
    });

    // Update descriptive caption
    if (stepCaption && stepCaptions[screenName]) {
      var captionText = stepCaption.querySelector("span:last-child");
      if (captionText) {
        captionText.textContent = stepCaptions[screenName];
      }
    }

    // Schedule task checkoff interaction for schedule screen
    if (taskTimeout) {
      clearTimeout(taskTimeout);
      taskTimeout = null;
    }

    if (taskItem) {
      if (screenName === "schedule") {
        taskItem.classList.remove("checked");
        taskTimeout = setTimeout(function () {
          taskItem.classList.add("checked");
        }, 900);
      } else {
        taskItem.classList.remove("checked");
      }
    }
  }

  function advanceStep() {
    currentStepIdx = (currentStepIdx + 1) % stepScreens.length;
    setScreen(stepScreens[currentStepIdx]);
  }

  function startLoop() {
    stopLoop();
    loopTimer = setInterval(advanceStep, 4500);
  }

  function stopLoop() {
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
  }

  // Interactive buttons: allow user to click and inspect
  stepBtns.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
      stopLoop();
      var targetScreen = btn.getAttribute("data-screen");
      currentStepIdx = stepScreens.indexOf(targetScreen);
      if (currentStepIdx === -1) currentStepIdx = index;
      setScreen(targetScreen);
      // Resume loop after 8 seconds of user inactivity
      setTimeout(startLoop, 8000);
    });
  });

  // Task item click to toggle checkmark manually
  if (taskItem) {
    taskItem.addEventListener("click", function () {
      taskItem.classList.toggle("checked");
    });
  }

  // Start the demo loop
  setScreen(stepScreens[0]);
  startLoop();
})();

/* ─── PAGE 3: VERTICAL PERSONA CARD FLOW ─── */
(function () {
  var section = document.querySelector(".personas-cards-section");
  var cards = section ? section.querySelectorAll(".persona-fade-card") : [];
  var dots = section ? section.querySelectorAll(".persona-dot") : [];
  if (!section || !cards.length) return;

  var activeIndex = 0;
  var ticking = false;

  function setActive(index) {
    activeIndex = Math.max(0, Math.min(cards.length - 1, index));
    cards.forEach(function (card, i) {
      var isActive = i === activeIndex;
      card.classList.toggle("active", isActive);
      card.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === activeIndex);
    });
  }

  function updateFromScroll() {
    var rect = section.getBoundingClientRect();
    var scrollableHeight = section.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) {
      setActive(0);
      ticking = false;
      return;
    }

    // Distance scrolled into the sticky persona section
    var distanceIntoSection = -rect.top;
    var progress = Math.max(
      0,
      Math.min(1, distanceIntoSection / scrollableHeight),
    );

    // Evenly divide scroll progress across all 6 cards so each card has ample scroll duration:
    // Card 0 (Creatives): [0.00, 0.166)
    // Card 1 (ADHD):      [0.166, 0.333)
    // Card 2 (Students):  [0.333, 0.500)
    // Card 3 (Founders):  [0.500, 0.666)
    // Card 4 (Daily):     [0.666, 0.833)
    // Card 5 (Friends):   [0.833, 1.000]
    var nextIndex = Math.min(
      cards.length - 1,
      Math.floor(progress * cards.length),
    );
    setActive(nextIndex);

    ticking = false;
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      var targetIdx = parseInt(dot.getAttribute("data-target"), 10);
      if (isNaN(targetIdx)) return;
      var scrollableHeight = section.offsetHeight - window.innerHeight;
      var targetScroll =
        section.offsetTop + (targetIdx / cards.length) * scrollableHeight + 10;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    });
  });

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      window.requestAnimationFrame(updateFromScroll);
      ticking = true;
    },
    { passive: true },
  );

  window.addEventListener(
    "resize",
    function () {
      updateFromScroll();
    },
    { passive: true },
  );

  setActive(0);
  updateFromScroll();
})();

/* ─── GSAP ANIMATIONS ─── */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  /* Manifesto items slide in from left */
  gsap.utils.toArray(".manifesto-item").forEach(function (item, i) {
    gsap.fromTo(
      item,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        delay: i * 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      },
    );
  });
})();
