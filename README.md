# TheTracker

A small, friendly habit tracker for students. Built with plain HTML, CSS,
and JavaScript — no build step, no frameworks, no dependencies.

## Run it locally

Just open `index.html` in a browser. That's it.

Or, if you'd like a local server (recommended so `localStorage` behaves the
same as on a real site):

```bash
# Python 3
python -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo settings, open **Pages**.
3. Set the source to your `main` branch, root folder.
4. Wait a minute, then open the URL GitHub gives you.

## Project layout

```
thetracker/
├── index.html        Markup and page structure
├── css/
│   ├── reset.css     Small base reset
│   └── styles.css    Theme tokens, layout, components
└── js/
    ├── storage.js    localStorage read/write helpers
    ├── dates.js      Date helpers (today, last N days, streaks)
    └── app.js        UI logic — render, add, toggle, delete
```

## How it works

- Habits are stored in `localStorage` under the key `thetracker.habits.v1`,
  so they survive page reloads but stay on your device.
- Each habit keeps a list of ISO date strings (`YYYY-MM-DD`) for the days
  it was completed.
- The streak counter walks backwards day-by-day from today (or yesterday,
  if today hasn't been ticked yet) and counts consecutive completions.

## License

MIT — do whatever you want with it.
