// Tiny wrapper around localStorage so the rest of the app
// doesn't have to think about JSON parsing or missing keys.
(function () {
  var KEY = "thetracker.habits.v1";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("Could not read saved habits:", err);
      return [];
    }
  }

  function save(habits) {
    try {
      localStorage.setItem(KEY, JSON.stringify(habits));
    } catch (err) {
      console.warn("Could not save habits:", err);
    }
  }

  // Expose on window so other scripts can use it.
  window.Storage = { load: load, save: save };
})();
