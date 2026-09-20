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
  var stepLabel = document.getElementById("demoStepLabel");
  var taskItem = document.getElementById("demoTaskItem");
  if (!panes.length) return;

  var stepScreens = ["thought1", "threads", "thoughtdetail", "schedule"];
  var stepCaptions = {
    thought1: "DEMO : Thought Screen (1) · Clean intent separation",
    threads: "DEMO : Living Threads · Automatic routing without tags",
    thoughtdetail: "DEMO : Thought Detail · Context and voice preserved",
    schedule: "DEMO : Schedule Screen · Calendar holds & tasks ticked off",
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
    if (stepLabel && stepCaptions[screenName]) {
      stepLabel.textContent = stepCaptions[screenName];
    }

    // Schedule task checkoff interaction
    if (taskTimeout) {
      clearTimeout(taskTimeout);
      taskTimeout = null;
    }

    if (taskItem) {
      if (screenName === "schedule") {
        taskItem.classList.remove("checked");
        taskTimeout = setTimeout(function () {
          taskItem.classList.add("checked");
        }, 850);
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
    loopTimer = setInterval(advanceStep, 3800);
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
      // Resume loop after 7 seconds of user inactivity
      setTimeout(startLoop, 7000);
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
  if (!section || !cards.length) return;

  var activeIndex = 0;
  var ticking = false;
  var boundaryJumping = false;
  var nextPage = null;

  function jumpToPage(target, keepSnapDisabled) {
    var root = document.documentElement;
    var previousBehavior = root.style.scrollBehavior;
    var previousSnap = root.style.scrollSnapType;
    root.style.scrollBehavior = "auto";
    root.style.scrollSnapType = "none";
    document.scrollingElement.scrollTop = target;
    if (!keepSnapDisabled) {
      window.requestAnimationFrame(function () {
        root.style.scrollBehavior = previousBehavior;
        root.style.scrollSnapType = previousSnap;
      });
    }
  }

  function setActive(index) {
    activeIndex = Math.max(0, Math.min(cards.length - 1, index));
    cards.forEach(function (card, i) {
      var isActive = i === activeIndex;
      card.classList.toggle("active", isActive);
      card.setAttribute("aria-hidden", String(!isActive));
    });
  }

  function updateFromScroll() {
    var scrollableHeight = section.offsetHeight - window.innerHeight;
    var distanceIntoSection = -section.getBoundingClientRect().top;
    var progress =
      scrollableHeight > 0
        ? Math.max(0, Math.min(1, distanceIntoSection / scrollableHeight))
        : 0;
    var nextIndex =
      progress === 0
        ? 0
        : progress >= 0.78
          ? cards.length - 1
          : Math.min(
              cards.length - 2,
              Math.ceil(progress * (cards.length - 1)),
            );
    setActive(nextIndex);

    var sectionEnd =
      section.offsetTop + section.offsetHeight - window.innerHeight;
    if (
      nextIndex === cards.length - 1 &&
      nextPage &&
      window.scrollY >= sectionEnd - 2 &&
      !boundaryJumping
    ) {
      boundaryJumping = true;
      jumpToPage(nextPage.offsetTop);
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      window.requestAnimationFrame(updateFromScroll);
      ticking = true;
    },
    { passive: true },
  );

  nextPage = section.nextElementSibling;
  window.addEventListener(
    "wheel",
    function (event) {
      if (!nextPage || event.deltaY === 0) {
        return;
      }

      var sectionStart = section.offsetTop;
      var nextPageStart = nextPage.offsetTop;
      var currentScroll = window.scrollY;
      var sectionScrollDistance = section.offsetHeight - window.innerHeight;
      var friendsRangeStart =
        sectionStart + Math.max(0, sectionScrollDistance * 0.5);
      var movingToNextPage =
        event.deltaY > 0 &&
        currentScroll >= friendsRangeStart &&
        currentScroll < nextPageStart - 2;
      var returningToFriends =
        event.deltaY < 0 &&
        currentScroll >= nextPageStart - 2 &&
        currentScroll <= nextPageStart + 2;

      if (!movingToNextPage && !returningToFriends) return;

      event.preventDefault();
      boundaryJumping = true;
      if (movingToNextPage) {
        document.documentElement.style.scrollSnapType = "y mandatory";
      }
      jumpToPage(
        movingToNextPage
          ? nextPageStart
          : sectionStart + section.offsetHeight - window.innerHeight,
        returningToFriends,
      );
    },
    { passive: false, capture: true },
  );

  setActive(0);
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
