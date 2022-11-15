let searchInp = document.querySelector('.weather_search');
let city = document.querySelector('.weather_city');
let day = document.querySelector('.weather_day');
let humidity = document.querySelector('.weather_indicator-humidity>.value');
let wind = document.querySelector('.weather_indicator-wind>.value');
let pressure = document.querySelector('.weather_indicator-pressure>.value');
let image = document.querySelector('.weather_image');
let temperature = document.querySelector('.weather_temperature>.value');
let forecastBlock = document.querySelector('.weather_forecast');

let weatherAPIKey = 'd228430a7837ca7c487f6914f626939d';
let weatherBaseEndpoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherAPIKey;
let forecaseBaseEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' + weatherAPIKey;

let getWeatherByCityName = async (city) => {
    let endpoint = weatherBaseEndpoint + '&q=' + city;
    let response = await fetch(endpoint);
    let weather = await response.json();
    return weather;
}

let getForecastByCityID = async (id) => {
    let endpoint = forecaseBaseEndpoint + '&id=' + id;
    let result = await fetch(endpoint);
    let forecast = await result.json();
    let forecastList = forecast.list;
    let daily = [];

    forecastList.forEach(day => {
        let date = new Date(day.dt_txt.replace(' ', 'T'));
        let hours = date.getHours();
        if (hours === 12) {
            daily.push(day);
        }
    });
    console.log(daily);
    return daily;
}

searchInp.addEventListener('keydown', async (e) => {
    if (e.keyCode === 13) {
        let weather = await getWeatherByCityName(searchInp.value);
        let cityID = weather.id;
        updateCurrentWeather(weather);
        let forecast = await getForecastByCityID(cityID);
        updateForecast(forecast);
    }
})

let updateCurrentWeather = (data) => {
    console.log(data);
    city.textContent = data.name + ', ' + data.sys.country;
    day.textContent = dayOfWeek();
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;
    let windDirection;
    let deg = data.wind.deg;
    if (deg > 45 && deg <= 135) {
        windDirection = 'East';
    } else if (deg > 135 && deg <= 225) {
        windDirection = 'South';
    } else if (deg > 225 && deg <= 315) {
        windDirection = 'West';
    } else {
        windDirection = 'North';
    }
    wind.textContent = windDirection + ', ' + data.wind.speed;
    temperature.textContent = data.main.temp > 0 ?
        '+' + parseFloat(data.main.temp).toFixed(1) : parseFloat(data.main.temp).toFixed(1);
}

let updateForecast = (forecast) => {
    forecastBlock.innerHTML = '';
    forecast.forEach(day => {
        let iconUrl = 'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png';
        let dayName = dayOfWeek(day.dt * 1000);
        let temperature = day.main.temp > 0 ?
            '+' + parseFloat(day.main.temp).toFixed(1) : parseFloat(day.main.temp).toFixed(1);
        let forecastItem = `
            <article class="weather_forecast_item">
                <img src="${iconUrl}" alt="${day.weather[0].description}" class="weather_forecast_icon">
                <h3 class="weather_forecast_day">${dayName}</h3>
                <p class="weather_forecast_temperature"><span class="value">${temperature}</span>&deg;C</p>
            </article>
        `;
        forecastBlock.insertAdjacentHTML('beforeend', forecastItem);
    })
}

let dayOfWeek = (dt = new Date().getTime()) => {
    return new Date(dt).toLocaleDateString('en-En', { 'weekday': 'long' })
}