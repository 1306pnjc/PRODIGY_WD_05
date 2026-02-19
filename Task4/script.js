const API_KEY = '05d061867262cc7b8c69e930609c0c92';

// Unsplash Source — free, no API key needed
// Query combines city name + weather condition for relevant photos
const UNSPLASH = (query) =>
  `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;

const input          = document.getElementById('locationInput');
const searchBtn      = document.getElementById('searchBtn');
const weatherBox     = document.getElementById('weatherBox');
const weatherDetails = document.getElementById('weatherDetails');
const bgScene        = document.getElementById('bgScene');
const bgTint         = document.getElementById('bgTint');

// ── Search triggers ───────────────────────────────
searchBtn.addEventListener('click', fetchWeather);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchWeather();
});

// ── Fetch & render ───────────────────────────────
async function fetchWeather() {
  const location = input.value.trim();
  if (!location) { showError('Please enter a city name.'); return; }

  showLoading();

  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();

    if (data.cod === '404' || data.cod === 401) {
      showError('Location not found. Try another city.');
      return;
    }

    renderWeather(data);
    setBackground(data);

  } catch (err) {
    showError('Network error — check your connection.');
    console.error(err);
  }
}

// ── Render weather card ───────────────────────────
function renderWeather(data) {
  const { name, main, weather, wind, sys } = data;
  const icon = weather[0].icon;
  const desc = weather[0].description;

  // Local time using timezone offset from API
  const utc      = Date.now() + new Date().getTimezoneOffset() * 60000;
  const localTime = new Date(utc + data.timezone * 1000);
  const timeStr  = localTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dateStr  = localTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

  weatherBox.innerHTML = `
    <div class="weather-content">
      <p class="city-name">${name}, ${sys.country}</p>
      <p class="local-time">${dateStr} · ${timeStr}</p>
      <img class="weather-icon"
           src="https://openweathermap.org/img/wn/${icon}@2x.png"
           alt="${desc}" />
      <div class="temp-row">
        <span class="temp-value">${Math.round(main.temp)}</span>
        <span class="temp-unit">°C</span>
      </div>
      <p class="weather-desc">${desc}</p>
    </div>
  `;

  document.getElementById('humidityVal').textContent = `${main.humidity}%`;
  document.getElementById('windVal').textContent     = `${wind.speed} m/s`;
  document.getElementById('feelsVal').textContent    = `${Math.round(main.feels_like)}°C`;
  weatherDetails.style.display = 'flex';
}

// ── Set dynamic background ────────────────────────
function setBackground(data) {
  const city      = data.name;
  const condition = data.weather[0].main.toLowerCase();   // e.g. "rain", "clear"
  const icon      = data.weather[0].icon;
  const isNight   = icon.endsWith('n');

  // Build Unsplash query: city + weather condition
  // This pulls a real photo of e.g. "New York rain" or "Tokyo clear sky"
  const weatherWord = conditionWord(condition, isNight);
  const query = `${city} ${weatherWord} cityscape`;

  // Fade out → swap image → fade in
  bgScene.classList.remove('visible');

  setTimeout(() => {
    bgScene.style.backgroundImage = `url('${UNSPLASH(query)}')`;
    bgScene.classList.add('visible');
  }, 400);

  // Apply colour tint
  const tintClass = getTintClass(condition, isNight);
  bgTint.className = `bg-tint ${tintClass}`;
  setTimeout(() => bgTint.classList.add('visible'), 200);
}

function conditionWord(condition, isNight) {
  const map = {
    clear:        isNight ? 'night stars'   : 'sunny day',
    clouds:       'cloudy overcast',
    rain:         'rain rainy',
    drizzle:      'drizzle misty rain',
    thunderstorm: 'storm thunderstorm',
    snow:         'snow winter',
    mist:         'fog mist',
    fog:          'fog misty',
    haze:         'haze',
    smoke:        'smoke hazy',
    dust:         'dust hazy',
    sand:         'desert sand',
    ash:          'ash volcanic',
    squall:       'wind storm',
    tornado:      'storm tornado',
  };
  return map[condition] || condition;
}

function getTintClass(condition, isNight) {
  if (condition === 'clear') return isNight ? 'tint-clear-night' : 'tint-clear-day';
  const map = {
    clouds: 'tint-clouds',
    rain:   'tint-rain',
    drizzle:'tint-drizzle',
    thunderstorm: 'tint-thunderstorm',
    snow:   'tint-snow',
    mist:   'tint-mist',
    fog:    'tint-mist',
    haze:   'tint-mist',
  };
  return map[condition] || 'tint-clouds';
}

// ── UI states ─────────────────────────────────────
function showLoading() {
  weatherBox.innerHTML = `<div class="loading-ring"></div>`;
  weatherDetails.style.display = 'none';
}

function showError(msg) {
  weatherBox.innerHTML = `
    <div class="empty-state">
      <i class='bx bx-error-circle'></i>
      <p class="error-msg">${msg}</p>
    </div>
  `;
  weatherDetails.style.display = 'none';
}
