// Date helpers — kept in their own file so app.js stays focused
// on UI logic.
(function () {
  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function lastNDays(n) {
    var days = [];
    var base = new Date();
    for (var i = n - 1; i >= 0; i--) {
      var d = new Date(base);
      d.setDate(base.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }

  // How many consecutive days (ending today, or yesterday if today
  // hasn't been ticked yet) the habit has been completed.
  function computeStreak(completed) {
    var set = {};
    for (var i = 0; i < completed.length; i++) set[completed[i]] = true;

    var streak = 0;
    var cursor = new Date();
    var key = cursor.toISOString().slice(0, 10);

    if (!set[key]) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (set[cursor.toISOString().slice(0, 10)]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  window.DateUtils = {
    todayISO: todayISO,
    lastNDays: lastNDays,
    computeStreak: computeStreak,
  };
})();
