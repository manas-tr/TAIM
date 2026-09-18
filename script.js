(function () {
  var handwritingFonts = [
    "Reenie Beanie",
    "Caveat",
    "Indie Flower",
    "Nothing You Could Do",
    "Shadows Into Light",
  ];

  function writeByHand(el) {
    var text = el.textContent;
    el.textContent = "";
    for (var i = 0; i < text.length; i += 1) {
      var span = document.createElement("span");
      span.textContent = text[i];
      span.style.fontFamily =
        "'" +
        handwritingFonts[
          (i * 3 + text.charCodeAt(i)) % handwritingFonts.length
        ] +
        "', cursive";
      span.style.display = text[i] === " " ? "inline" : "inline-block";
      span.style.transform =
        "translateY(" +
        ((i % 3) - 1) +
        "px) rotate(" +
        ((i % 5) - 2) * 1.6 +
        "deg)";
      el.appendChild(span);
    }
  }

  document.querySelectorAll(".hand-note").forEach(writeByHand);
})();

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
    for (var i = 0; i < words.length; i += 1) {
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
    if (active.length === 0) active.push("file");
    return active;
  }

  function describe(active) {
    var has = function (key) {
      return active.indexOf(key) !== -1;
    };
    if (has("calendar") && has("meetup") && has("action")) {
      return "Taim would keep the person, timing, and follow-up together instead of splitting them across three apps.";
    }
    if (has("calendar") && has("meetup")) {
      return "Taim would make a calendar hold and keep the relationship context in the same thread.";
    }
    if (has("action")) {
      return "Taim would turn this into something it can follow up on, not just another line in a note.";
    }
    if (has("todo")) {
      return "Taim would make the task plain and easy to complete.";
    }
    if (has("calendar")) {
      return "Taim would place the timing where it belongs, then keep the context attached.";
    }
    return "Taim would save this as a thread so it is searchable when it matters again.";
  }

  var input = document.getElementById("demoInput");
  var chips = document.querySelectorAll(".output-chip");
  var hint = document.getElementById("demoHint");

  if (!input || !chips.length || !hint) return;

  function render(value) {
    var text = value.trim();
    var active = text ? classify(text) : [];
    chips.forEach(function (chip) {
      var key = chip.getAttribute("data-key");
      chip.classList.toggle("active", active.indexOf(key) !== -1);
    });
    hint.textContent = text ? describe(active) : "";
  }

  input.addEventListener("input", function () {
    render(input.value);
  });

  input.value = "coffee with Sarah next Tuesday morning";
  render(input.value);
})();

(function () {
  var personas = {
    creators: {
      kicker: "Taim for creators",
      title: "Ideas out of your head and into the right place.",
      body: "Voice notes from walks, rough lines for scripts, sponsor follow-ups, launch tasks, and half-finished thoughts. Taim keeps the creative mess usable without making it feel clinical.",
      bullets: [
        "Captures ideas before they disappear",
        "Keeps tasks and references in the same thread",
        "Makes follow-ups easier to spot",
      ],
    },
    adhd: {
      kicker: "Taim for ADHD minds",
      title: "Less sorting, more starting.",
      body: "When your mind is busy, the real problem is not forgetting. It is trying to decide where something belongs before it even begins. Taim helps with that friction.",
      bullets: [
        "Catches thoughts without a setup ritual",
        "Turns scattered notes into next steps",
        "Notices patterns without making you feel behind",
      ],
    },
    founders: {
      kicker: "Taim for founders",
      title: "Keep the moving pieces from drifting apart.",
      body: "Investor notes, follow-ups, customer conversations, launch details, and personal reminders all pile up quickly. Taim keeps the thread alive so speed does not erase context.",
      bullets: [
        "Finds the follow-up hidden inside a meeting",
        "Keeps decisions tied to the original context",
        "Works as a quiet layer underneath the day",
      ],
    },
    corporate: {
      kicker: "Taim for professionals",
      title: "Turn meetings into memory and motion.",
      body: "A workday creates small obligations faster than a file system can handle. Taim catches the action items and gives them a place to live.",
      bullets: [
        "Captures loose tasks from meetings",
        "Keeps personal reminders reachable",
        "Cuts down the end-of-day tidy-up",
      ],
    },
  };

  var buttons = document.querySelectorAll(".tab-button");
  var card = document.getElementById("persona-panel");
  if (!buttons.length || !card) return;

  function renderPersona(key) {
    var persona = personas[key];
    if (!persona) return;

    buttons.forEach(function (button) {
      var selected = button.getAttribute("data-persona") === key;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
      if (selected) {
        card.setAttribute("aria-labelledby", button.id);
      }
    });

    card.innerHTML =
      '<p class="persona-kicker">' +
      persona.kicker +
      "</p>" +
      "<h3>" +
      persona.title +
      "</h3>" +
      "<p>" +
      persona.body +
      "</p>" +
      "<ul>" +
      persona.bullets
        .map(function (item) {
          return "<li>" + item + "</li>";
        })
        .join("") +
      "</ul>";
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      renderPersona(button.getAttribute("data-persona"));
    });
  });
})();

(function () {
  var items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  function setAnswerHeight(item) {
    var answer = item.querySelector(".faq-answer");
    if (!answer) return;
    answer.style.maxHeight = item.classList.contains("open")
      ? answer.scrollHeight + "px"
      : "0px";
  }

  items.forEach(function (item) {
    setAnswerHeight(item);
    var question = item.querySelector(".faq-question");
    if (!question) return;
    question.addEventListener("click", function () {
      var wasOpen = item.classList.contains("open");
      items.forEach(function (other) {
        other.classList.remove("open");
        setAnswerHeight(other);
      });
      if (!wasOpen) {
        item.classList.add("open");
        setAnswerHeight(item);
      }
    });
  });

  window.addEventListener("resize", function () {
    items.forEach(setAnswerHeight);
  });
})();
