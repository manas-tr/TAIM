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

  els.forEach(function (el, i) {
    /* Stagger siblings that are direct children of the same parent */
    var siblings = el.parentElement
      ? el.parentElement.querySelectorAll(".reveal")
      : [];
    var idx = Array.prototype.indexOf.call(siblings, el);
    el.style.transitionDelay = Math.min(idx * 0.1, 0.4) + "s";
    observer.observe(el);
  });
})();

/* ─── DEMO CLASSIFIER ─── */
(function () {
  var CALENDAR_TIME = /\b\d{1,2}(:\d{2})?\s?(am|pm)\b/i;
  var CALENDAR_WORDS = [
    "today",
    "tomorrow",
    "tonight",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
    "next week",
    "next month",
    "weekend",
    "morning",
    "afternoon",
    "evening",
    "date",
    "deadline",
  ];
  var MEETUP_WORDS = [
    "coffee",
    "lunch",
    "dinner",
    "meet",
    "meeting",
    "catch up",
    "drinks",
    "hang out",
    "call with",
    "grab a",
    "mom",
    "friend",
    "client",
    "sarah",
    "james",
    "jake",
    "amir",
    "priya",
  ];
  var ACTION_WORDS = [
    "call",
    "email",
    "send",
    "book",
    "pay",
    "submit",
    "reply",
    "renew",
    "cancel",
    "confirm",
    "sign",
    "schedule",
    "follow up",
    "draft",
  ];
  var TODO_WORDS = [
    "buy",
    "pick up",
    "grab",
    "get",
    "order",
    "drop off",
    "return",
    "fix",
    "clean",
    "wash",
    "research",
    "check",
  ];
  var FILE_WORDS = [
    "idea",
    "note",
    "notes",
    "thought",
    "thoughts",
    "brainstorm",
    "remember",
    "project",
    "write",
    "plan",
  ];

  function containsAny(text, words) {
    for (var i = 0; i < words.length; i++) {
      var pattern = new RegExp(
        "\\b" + words[i].replace(/\s+/g, "\\s+") + "\\b",
        "i",
      );
      if (pattern.test(text)) return true;
    }
    return false;
  }

  function classify(text) {
    var active = [];
    if (CALENDAR_TIME.test(text) || containsAny(text, CALENDAR_WORDS))
      active.push("calendar");
    if (containsAny(text, MEETUP_WORDS)) active.push("meetup");
    if (containsAny(text, ACTION_WORDS)) active.push("action");
    if (containsAny(text, TODO_WORDS)) active.push("todo");
    if (containsAny(text, FILE_WORDS)) active.push("file");
    if (!active.length) active.push("file");
    return active;
  }

  function describe(active) {
    var has = function (key) {
      return active.indexOf(key) !== -1;
    };
    if (has("calendar") && has("meetup") && has("action"))
      return "Taim keeps the person, timing, and follow-up together - not split across three apps.";
    if (has("calendar") && has("meetup"))
      return "Taim creates a calendar hold and keeps the relationship context in the same thread.";
    if (has("action"))
      return "Taim turns this into something it can follow up on, not just another line in a note.";
    if (has("todo"))
      return "Taim makes the task plain and easy to complete. No folder required.";
    if (has("calendar"))
      return "Taim places the timing where it belongs, then keeps the context attached.";
    return "Taim saves this as a thread so it is searchable and actionable when it matters again.";
  }

  var input = document.getElementById("demoInput");
  var chips = document.querySelectorAll(".output-chip");
  var hint = document.getElementById("demoHint");

  if (!input || !chips.length || !hint) return;

  function render(value) {
    var text = value.trim();
    var active = text ? classify(text) : [];
    chips.forEach(function (chip) {
      chip.classList.toggle(
        "active",
        active.indexOf(chip.getAttribute("data-key")) !== -1,
      );
    });
    hint.textContent = text ? describe(active) : "";
  }

  input.addEventListener("input", function () {
    render(input.value);
  });
  input.value = "coffee with Sarah next Tuesday morning";
  render(input.value);
})();

/* ─── PERSONA TAB SWITCHER & INTERACTIVE MINI DEMO ─── */
(function () {
  var tabs = document.querySelectorAll(".persona-tab");
  var panes = document.querySelectorAll(".persona-pane");
  if (!tabs.length || !panes.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var targetId = tab.getAttribute("data-target");
      tabs.forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");

      panes.forEach(function (pane) {
        if (pane.id === "pane-" + targetId) {
          pane.classList.add("active");
        } else {
          pane.classList.remove("active");
        }
      });
    });
  });

  /* Interactive prompt chips */
  document.querySelectorAll(".prompt-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var pane = chip.closest(".persona-pane");
      if (!pane) return;
      var input = pane.querySelector(".mini-demo-input");
      var taskText = pane.querySelector(".task-label-text");
      var inputVal = chip.getAttribute("data-input") || chip.textContent.trim();
      var taskVal = chip.getAttribute("data-task") || inputVal;

      if (input) input.value = inputVal;
      if (taskText) {
        taskText.textContent = taskVal;
        var taskItem = pane.querySelector(".capsule-interactive-task");
        if (taskItem) taskItem.classList.remove("completed");
      }
    });
  });

  /* Capture button handler */
  document.querySelectorAll(".mini-demo-submit-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pane = btn.closest(".persona-pane");
      if (!pane) return;
      var input = pane.querySelector(".mini-demo-input");
      var taskText = pane.querySelector(".task-label-text");
      var taskItem = pane.querySelector(".capsule-interactive-task");
      if (!input || !taskText) return;

      var val = input.value.trim();
      if (!val) return;

      taskText.textContent = val;
      if (taskItem) {
        taskItem.classList.remove("completed");
        taskItem.style.transform = "scale(1.02)";
        setTimeout(function () {
          taskItem.style.transform = "";
        }, 200);
      }
    });
  });

  /* Allow enter key in demo input */
  document.querySelectorAll(".mini-demo-input").forEach(function (inp) {
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var pane = inp.closest(".persona-pane");
        if (!pane) return;
        var btn = pane.querySelector(".mini-demo-submit-btn");
        if (btn) btn.click();
      }
    });
  });

  /* Clickable interactive task checkbox (instant satisfaction) */
  document
    .querySelectorAll(".capsule-interactive-task")
    .forEach(function (task) {
      task.addEventListener("click", function () {
        var isCompleted = task.classList.toggle("completed");
        task.setAttribute("aria-checked", isCompleted ? "true" : "false");
      });
      task.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          task.click();
        }
      });
    });

  /* Interactive audio memo toggle */
  document.querySelectorAll(".capsule-audio-pill").forEach(function (pill) {
    pill.addEventListener("click", function () {
      pill.classList.toggle("playing");
    });
  });
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
