let weatherAPIKey = 'd228430a7837ca7c487f6914f626939d';
let weatherBaseEndpoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherAPIKey;

let getWeatherByCityName = async (city) => {
    let endpoint = weatherBaseEndpoint + '&q=' + city;
    let response = await fetch(endpoint);
    let weather = await response.json();

    console.log(weather);
}

getWeatherByCityName('New York');