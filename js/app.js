// Main app logic for TheTracker.
// Plain DOM + localStorage — no frameworks, no build step.
(function () {
  var Storage = window.Storage;
  var DateUtils = window.DateUtils;

  // --- State ---
  var habits = Storage.load();
  var week = DateUtils.lastNDays(7);

  // --- Element refs ---
  var form = document.getElementById("habit-form");
  var input = document.getElementById("habit-input");
  var addBtn = document.getElementById("add-btn");
  var list = document.getElementById("habit-list");
  var emptyState = document.getElementById("empty-state");
  var doneCountEl = document.getElementById("done-count");
  var totalCountEl = document.getElementById("total-count");
  var pctEl = document.getElementById("progress-pct");
  var fillEl = document.getElementById("progress-fill");

  // --- SVG icon strings ---
  var ICON_CHECK =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var ICON_FLAME =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>';
  var ICON_TRASH =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>';

  // --- Helpers ---
  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "h_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  }

  function persist() {
    Storage.save(habits);
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
          c
        ] || c
      );
    });
  }

  // --- Actions ---
  function addHabit(name) {
    habits.push({
      id: uid(),
      name: name,
      createdAt: DateUtils.todayISO(),
      completed: [],
    });
    persist();
    render();
  }

  function toggleToday(id) {
    var today = DateUtils.todayISO();
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].id !== id) continue;
      var idx = habits[i].completed.indexOf(today);
      if (idx === -1) habits[i].completed.push(today);
      else habits[i].completed.splice(idx, 1);
      break;
    }
    persist();
    render();
  }

  function removeHabit(id) {
    habits = habits.filter(function (h) {
      return h.id !== id;
    });
    persist();
    render();
  }

  // --- Rendering ---
  function renderProgress() {
    var today = DateUtils.todayISO();
    var done = 0;
    for (var i = 0; i < habits.length; i++) {
      if (habits[i].completed.indexOf(today) !== -1) done++;
    }
    var total = habits.length;
    var pct = total === 0 ? 0 : Math.round((done / total) * 100);

    doneCountEl.textContent = done;
    totalCountEl.textContent = total;
    pctEl.textContent = pct;
    fillEl.style.width = pct + "%";
  }

  function buildHabitNode(habit) {
    var today = DateUtils.todayISO();
    var doneToday = habit.completed.indexOf(today) !== -1;
    var streak = DateUtils.computeStreak(habit.completed);

    var li = document.createElement("li");
    li.className = "habit";

    // Build the weekly grid HTML
    var weekHTML = "";
    for (var i = 0; i < week.length; i++) {
      var day = week[i];
      var cls = "day";
      if (habit.completed.indexOf(day) !== -1) cls += " done";
      else if (day === today) cls += " today";
      weekHTML += '<span class="' + cls + '" title="' + day + '"></span>';
    }

    var streakLabel =
      streak === 0 ? "Start your streak today" : streak + "-day streak";

    li.innerHTML =
      '<div class="habit-row">' +
      '<button class="check' +
      (doneToday ? " done" : "") +
      '" aria-pressed="' +
      doneToday +
      '" aria-label="Toggle today" data-action="toggle">' +
      (doneToday ? ICON_CHECK : "") +
      "</button>" +
      '<div class="habit-info">' +
      '<p class="habit-name">' +
      escapeHTML(habit.name) +
      "</p>" +
      '<div class="streak">' +
      ICON_FLAME +
      "<span>" +
      streakLabel +
      "</span>" +
      "</div>" +
      "</div>" +
      '<div class="week">' +
      weekHTML +
      "</div>" +
      '<button class="delete-btn" aria-label="Delete habit" data-action="remove">' +
      ICON_TRASH +
      "</button>" +
      "</div>";

    // Wire up the two buttons
    li.querySelector('[data-action="toggle"]').addEventListener(
      "click",
      function () {
        toggleToday(habit.id);
      },
    );
    li.querySelector('[data-action="remove"]').addEventListener(
      "click",
      function () {
        removeHabit(habit.id);
      },
    );

    return li;
  }

  function renderList() {
    list.innerHTML = "";
    if (habits.length === 0) {
      list.hidden = true;
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;
    list.hidden = false;
    for (var i = 0; i < habits.length; i++) {
      list.appendChild(buildHabitNode(habits[i]));
    }
  }

  function render() {
    renderProgress();
    renderList();
  }

  // --- Form wiring ---
  input.addEventListener("input", function () {
    addBtn.disabled = input.value.trim().length === 0;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = input.value.trim();
    if (!name) return;
    addHabit(name);
    input.value = "";
    addBtn.disabled = true;
    input.focus();
  });

  // First paint
  render();
})();
