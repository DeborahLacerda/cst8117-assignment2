let searchInp = document.querySelector(".weather_search");
let city = document.querySelector(".weather_city");
let day = document.querySelector(".weather_day");
let humidity = document.querySelector(".weather_indicator-humidity>.value");
let wind = document.querySelector(".weather_indicator-wind>.value");
let pressure = document.querySelector(".weather_indicator-pressure>.value");
let image = document.querySelector(".weather_image");
let temperature = document.querySelector(".weather_temperature>.value");
let forecastBlock = document.querySelector(".weather_forecast");
let citysearch = document.querySelector(".citysearch");
let suggestions = document.querySelector("#suggestions");
let searchBtn = document.querySelector("#weather_search");

let weatherAPIKey = "d228430a7837ca7c487f6914f626939d";
let weatherBaseUrl = "https://api.openweathermap.org/data/2.5";
let cityBaseUrl = "https://api.teleport.org/api";

let weatherImages = [
  {
    url: "images/clear-sky.png",
    ids: [800],
  },
  {
    url: "images/broken-clouds.png",
    ids: [803, 804],
  },
  {
    url: "images/few-clouds.png",
    ids: [801],
  },
  {
    url: "images/mist.png",
    ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  },
  {
    url: "images/rain.png",
    ids: [500, 501, 502, 503, 504],
  },
  {
    url: "images/scattered-clouds.png",
    ids: [802],
  },
  {
    url: "images/shower-rain.png",
    ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321],
  },
  {
    url: "images/snow.png",
    ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  },
  {
    url: "images/thunderstorm.png",
    ids: [200, 201, 202, 210, 211, 212, 211, 230, 231, 232],
  },
];

showToastRequest = (type, content) => {
  Toastify({
    text: `${content}`,
    duration: 2000,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: `${type == "error" ? "#BA0E25" : "#3f4739"}`,
    },
  }).showToast();
};

let getWeatherByCityName = async (cityString) => {
  let city;
  if (cityString.includes(",")) {
    city =
      cityString.substring(0, cityString.indexOf(",")) +
      cityString.substring(cityString.lastIndexOf(","));
  } else {
    city = cityString;
  }
  let weather = await $.ajax({
    url: `${weatherBaseUrl}/weather`,
    type: "GET",
    data: {
      units: "metric",
      appid: weatherAPIKey,
      q: city,
    },
    error: (error) => {
      showToastRequest("error", error.responseJSON.message);
    },
  });
  return weather;
};

let getForecastByCityID = async (id) => {
  let forecast = await $.ajax({
    url: `${weatherBaseUrl}/forecast`,
    type: "GET",
    data: {
      units: "metric",
      appid: weatherAPIKey,
      id: id,
    },
    error: (error) => {
      showToastRequest("error", error.responseJSON.message);
    },
  });

  let forecastList = forecast.list;
  let daily = [];

  forecastList.forEach((day) => {
    let date = new Date(day.dt_txt.replace(" ", "T"));
    let hours = date.getHours();
    if (hours === 12) {
      daily.push(day);
    }
  });
  return daily;
};

let weatherForCity = async (city) => {
  let weather = await getWeatherByCityName(city);
  if (!weather) {
    return;
  }
  let cityID = weather.id;
  updateCurrentWeather(weather);
  let forecast = await getForecastByCityID(cityID);
  updateForecast(forecast);
};

let init = () => {
  weatherForCity("Ottawa").then(() => (document.body.style.filter = "blur(0)"));
};

init();

citysearch.addEventListener("submit", (e) => {
  e.preventDefault();

  weatherForCity(searchInp.value);
});

let updateCurrentWeather = (data) => {
  city.textContent = data.name + ", " + data.sys.country;
  day.textContent = dayOfWeek();
  humidity.textContent = data.main.humidity + "%";
  pressure.textContent = data.main.pressure + "hPa";
  let windDirection;
  let deg = data.wind.deg;
  if (deg > 45 && deg <= 135) {
    windDirection = "East";
  } else if (deg > 135 && deg <= 225) {
    windDirection = "South";
  } else if (deg > 225 && deg <= 315) {
    windDirection = "West";
  } else {
    windDirection = "North";
  }
  wind.textContent = windDirection + ", " + data.wind.speed + "m/s";
  temperature.textContent = parseFloat(data.main.temp).toFixed(1);
  let imgID = data.weather[0].id;
  weatherImages.forEach((obj) => {
    if (obj.ids.includes(imgID)) {
      image.src = obj.url;
    }
  });
};

let updateForecast = (forecast) => {
  forecastBlock.innerHTML = "";
  forecast.forEach((day) => {
    let iconUrl =
      "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";
    let dayName = dayOfWeek(day.dt * 1000);
    let temperature = parseFloat(day.main.temp).toFixed(1);
    let forecastItem = `
            <div class="weather_forecast_item">
                <img src="${iconUrl}" alt="${day.weather[0].description}" class="weather_forecast_icon">
                <h3 class="weather_forecast_day">${dayName}</h3>
                <p class="weather_forecast_temperature"><span class="value">${temperature}</span>&deg;C</p>
            </div>
        `;
    forecastBlock.insertAdjacentHTML("beforeend", forecastItem);
  });
};

const updateCitySuggestions = async () => {
  let result = await $.ajax({
    url: `${cityBaseUrl}/cities`,
    type: "GET",
    data: {
      search: searchInp.value,
    },
    error: (error) => {
      showToastRequest("error", error.responseJSON.message);
    },
  });

  suggestions.innerHTML = "";
  let cities = result._embedded["city:search-results"];
  let length = cities.length > 5 ? 5 : cities.length;
  for (let i = 0; i < length; i++) {
    let option = document.createElement("option");
    option.value = cities[i].matching_full_name;
    suggestions.appendChild(option);
  }
};
searchInp.addEventListener("input", updateCitySuggestions);

searchBtn.addEventListener("click", () => {
  weatherForCity(searchInp.value);
});

searchInp.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    weatherForCity(searchInp.value);
  }
});

let dayOfWeek = (dt = new Date().getTime()) => {
  return new Date(dt).toLocaleDateString("en-En", { weekday: "long" });
};

// toggle to dark mode

const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

// validate email
function ValidateEmail(input) {
  var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return validRegex.test(input);
}

const emailInp = document.querySelector("#email");
const form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!ValidateEmail(emailInp.value)) {
    showToastRequest("error", "Email is invalid");
  }
});
