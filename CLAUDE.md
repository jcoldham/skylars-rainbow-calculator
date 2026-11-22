# Skylar's Rainbow Calculator

A kid-friendly calculator web app, built for Skylar. Plain HTML, CSS and JavaScript with no build step, no framework and no npm packages. It runs by opening `index.html` in a browser and is published on GitHub Pages:
https://jcoldham.github.io/skylars-rainbow-calculator/

## Files

- `calc.js`: the calculator's math and key-press rules. It has no DOM, sound or animation code, and it's shared by the app and the tests. It exposes `Calc.createCalculator()`, `Calc.evaluate()` and `Calc.fmt()` (and also works through `module.exports`).
- `index.html`: everything the user sees. Layout, CSS, Web Audio sounds, the cartoon face, sparkles, confetti and keyboard handling are all in this one file.
- `tests.html`: unit tests for `calc.js`, using a small built-in runner (`describe` / `test` / `expectEqual`).
- `README.md`: written for a non-technical reader. Keep that tone if you edit it.
- `.claude/launch.json` and `.claude/serve.ps1`: a small PowerShell server on port 8765 for previewing the app in Claude's browser pane. The app itself doesn't need them.

## How to run and test

- Preview: start the `rainbow-calc` launch config (pwsh `.claude/serve.ps1`, http://localhost:8765/), or just open `index.html`.
- Tests: open `tests.html` (http://localhost:8765/tests.html). A green bar means everything passed, and any failures are listed in red. Refresh to run the tests again.
- After any change to `calc.js`, run the tests and confirm the bar is green before you say the work is done.

## Rules for changes

- Keep math and key logic in `calc.js` and keep the presentation in `index.html`. Don't put calculator logic in the page.
- For a behavior change or bug fix in `calc.js`, add or update a test in `tests.html` in the matching `describe` group. Write a failing test first, then make it pass.
- Tests type keys with stand-ins: `*` for ×, `/` for ÷, `-` for −, `<` for ⌫ and `C` for clear. The calculator itself uses the real symbols (`× ÷ − ⌫`).
- `press()` returns a result string (`"digit"`, `"op"`, `"back"`, `"clear"`, `"equals"`, `"zero"`, `"big"` or `null`). `index.html` uses these to pick the sounds and faces, so any new outcome must be handled there too.
- Keep current behavior: × and ÷ are worked out before + and −, answers are rounded to 12 significant digits (so 0.1 + 0.2 shows 0.3), entries are limited to 12 digits, and errors are friendly ("Oops! 🙈") instead of NaN or Infinity.
- Don't add dependencies, build tools or a framework. The app must keep working when `index.html` is double-clicked. (The Google Fonts link is fine, since it falls back to other fonts when offline.)
- Every animation must respect `prefers-reduced-motion` (check `reduceMotion()` in JS, plus the CSS media query). The sound toggle must keep working.
- The audience is a child. Keep all on-screen text short, friendly and encouraging.
- Comments are written in plain language for a beginner. Keep that style.

## Git and publishing

- One branch, `main`, with the remote at `github.com/jcoldham/skylars-rainbow-calculator`.
- The live GitHub Pages site comes from this repo, so treat pushing to `main` as publishing. Ask before you push.
- Write short, plain commit messages that say what changed ("Add percent key", "Fix backspace after =").
