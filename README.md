# Basic Weather App with emphasis on API usage

> A weather app built two years ago to learn API integration. Rebuilt yesterday into something that looks the part.

---

## Background

Two years ago, the goal with this project was straightforward, learn how to work with a real external API. Fetch data, handle the response, deal with errors, display what comes back. The fundamentals of how modern web apps actually work.

**Recently**, in my final year, the app got a complete visual overhaul, a glassmorphism card over a dynamic photo backdrop, condition-based colour tints, smooth transitions, and a design system consistent with the rest of the VI project series. The API logic underneath is the same solid foundation, now wrapped in a UI that communicates the data as well as it collects it.

---

## What This Project Demonstrates

**JavaScript & API skills (the original focus):**
- `async/await` with the Fetch API — clean, readable async code
- Real API integration with OpenWeatherMap — live weather data including temperature, humidity, wind speed, feels-like, and weather condition codes
- Proper error handling for network failures, 404s, and invalid responses
- Local time calculation using the API's timezone offset — not just browser time, but the actual local time at the searched location
- Dynamic DOM rendering — the entire weather card is built from the API response using template literals
- Loading and error UI states — the app always shows the user something meaningful

**UI & design (the revamp):**
- Dynamic photo backdrop via Unsplash Source — searches for a real photo matching the city + weather condition (e.g. "Tokyo rain cityscape")
- 15 weather condition mappings with `conditionWord()` and `getTintClass()` — each condition gets its own colour tint overlaid on the photo
- Day/night awareness from the API icon code — the background and tint shift based on whether it's currently night at the searched location
- Fade-out → image-swap → fade-in transition on background change, preventing jarring jumps
- Glassmorphism card with `backdrop-filter: blur(26px)` and layered box shadows
- Loading spinner and error states with smooth animations

---

## Features

| Feature | Detail |
|---------|--------|
| Live weather | Temperature, description, humidity, wind, feels-like |
| Dynamic background | Real Unsplash photo matched to city + condition |
| Condition tints | 8 colour overlays for different weather states |
| Day/night mode | Background and tint shift based on local time |
| Local time display | Accurate local time at searched city using API timezone offset |
| Error handling | Network errors, city not found, empty input — all handled gracefully |
| Enter key support | Search triggers on Enter or button click |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Markup | HTML5 |
| Styling | Pure CSS (custom properties, glassmorphism, animations) |
| Behaviour | Vanilla JavaScript — `async/await`, Fetch API |
| Weather data | OpenWeatherMap API (free tier) |
| Photos | Unsplash Source (no API key required) |
| Icons | Boxicons |
| Fonts | Google Fonts — Cormorant Garamond, DM Mono |

---

## Project Structure

```
vi-aether/
├── index.html      # Card layout, search, weather display, detail bar
├── style.css       # Full design system — glassmorphism, tints, animations
├── script.js       # API calls, rendering logic, background system
└── README.md
```

---

## How to Run

> ⚠️ This app requires a live server — the Fetch API is blocked by browsers when opening `index.html` directly as a file due to CORS restrictions.

**VS Code Live Server (easiest):**
Right-click `index.html` → *Open with Live Server*

**Python:**
```bash
python -m http.server 8000
# open http://localhost:8000
```

**Node:**
```bash
npx serve .
```

---

## API Setup

The app uses the [OpenWeatherMap API](https://openweathermap.org/api). The current API key in `script.js` is a free-tier key used for development. If it stops working:

1. Sign up at [openweathermap.org](https://openweathermap.org)
2. Go to *API Keys* in your account
3. Replace the `API_KEY` value at the top of `script.js`

---

## Technical Notes

**Local time calculation:**
```js
const utc       = Date.now() + new Date().getTimezoneOffset() * 60000;
const localTime = new Date(utc + data.timezone * 1000);
```
The API returns a `timezone` field — the offset in seconds from UTC for the searched location. By normalising to UTC first and then adding the city's offset, the displayed time is accurate regardless of where the user is running the app.

**Dynamic background system:**
`conditionWord()` maps 15 weather conditions to descriptive phrases. `getTintClass()` maps those conditions to CSS classes with specific gradient tints. Both functions consider the `isNight` flag (detected from whether the API icon ends in `'n'`), so searching "London clear" at 9pm and 9am will produce visually different results.

---

## Context

Part of the road to building a portfolio. Where the Tic Tac Toe project proved pure JS logic and the Stopwatch proved timer mechanics, Weather app proves the next level, working with real world data from external APIs and building a UI that responds to it dynamically.

---

*Real data. Real design.*
