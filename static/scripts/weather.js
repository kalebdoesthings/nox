async function fetchWeather() {

const weatherH1 = document.getElementById("weather");


const weatherIcons = {
    1000: "sun",              // Sunny / Clear
    1003: "cloud-sun",        // Partly cloudy
    1006: "cloud",            // Cloudy
    1009: "cloudy",           // Overcast
    1030: "cloud-fog",        // Mist
    1063: "cloud-sun-rain",   // Patchy rain possible
    1066: "cloud-snow",       // Patchy snow possible
    1069: "cloud-hail",       // Patchy sleet possible
    1072: "cloud-drizzle",    // Patchy freezing drizzle
    1087: "cloud-lightning",  // Thundery outbreaks possible
    1114: "wind",             // Blowing snow
    1117: "cloud-snow",       // Blizzard
    1135: "cloud-fog",        // Fog
    1147: "cloud-fog",        // Freezing fog
    1150: "cloud-drizzle",    // Patchy light drizzle
    1153: "cloud-drizzle",    // Light drizzle
    1168: "cloud-drizzle",    // Freezing drizzle
    1171: "cloud-drizzle",    // Heavy freezing drizzle
    1180: "cloud-rain",       // Patchy light rain
    1183: "cloud-rain",       // Light rain
    1186: "cloud-rain",       // Moderate rain at times
    1189: "cloud-rain",       // Moderate rain
    1192: "cloud-rain-wind",  // Heavy rain at times
    1195: "cloud-rain-wind",  // Heavy rain
    1198: "cloud-drizzle",    // Light freezing rain
    1201: "cloud-rain",       // Moderate/heavy freezing rain
    1204: "cloud-hail",       // Light sleet
    1207: "cloud-hail",       // Moderate/heavy sleet
    1210: "cloud-snow",       // Patchy light snow
    1213: "cloud-snow",       // Light snow
    1216: "cloud-snow",       // Patchy moderate snow
    1219: "cloud-snow",       // Moderate snow
    1222: "cloud-snow",       // Patchy heavy snow
    1225: "cloud-snow",       // Heavy snow
    1237: "cloud-hail",       // Ice pellets
    1240: "cloud-rain",       // Light rain shower
    1243: "cloud-rain-wind",  // Moderate/heavy rain shower
    1246: "cloud-rain-wind",  // Torrential rain shower
    1249: "cloud-hail",       // Light sleet showers
    1252: "cloud-hail",       // Moderate/heavy sleet showers
    1255: "cloud-snow",       // Light snow showers
    1258: "cloud-snow",       // Moderate/heavy snow showers
    1261: "cloud-hail",       // Light ice pellet showers
    1264: "cloud-hail",       // Moderate/heavy ice pellet showers
    1273: "cloud-lightning",  // Patchy light rain with thunder
    1276: "cloud-lightning",  // Moderate/heavy rain with thunder
    1279: "cloud-lightning",  // Patchy light snow with thunder
    1282: "cloud-lightning",  // Moderate/heavy snow with thunder
};

const geo = await fetch("http://ip-api.com/json/");
const loc = await geo.json();

const response = await fetch("/getweather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude: loc.lat, longitude: loc.lon })
});
const data = await response.json();

const code = data.current.condition.code;
const isNight = data.current.is_day === 0;
let iconName = weatherIcons[code] || "cloud";

// Use moon variants at night for clear/partly cloudy
if (isNight && code === 1000) iconName = "moon-star";
if (isNight && code === 1003) iconName = "cloud-moon";
if (isNight && code === 1063) iconName = "cloud-moon-rain";

weatherH1.innerHTML = `
  <div class="weather-top">${Math.round(data.current.temp_f)}°F <img src="/static/svg/${iconName}.svg" class="weather-icon" /></div>
  <div class="weather-status">${data.current.condition.text}</div>
`;
}


fetchWeather()