$(document).ready(() => {
  const baseUrlNews = "https://newsapi.org/v2";
  const baseUrlWeather = "https://api.openweathermap.org/data/2.5/";
  const apiKeyNews = "2199460b902247be9f80e58b6078abe9";
  const apiKeyWeather = "d228430a7837ca7c487f6914f626939d";

  clearList = (fullList) => {
    return fullList.filter(
      (el) => el.author && el.content && el.title && el.urlToImage
    );
  };

  showBannerHeader = (news) => {
    $("#banner").append(`
      <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-8">
                <img src="${
                  news.urlToImage
                }" class="img-fluid rounded-start" alt="banner-image" />
              </div>

              <div class="col-md-4">
                <div class="card-body">
                  <h5 class="card-title">${news.title}"</h5>
                  <p class="card-text">${news.description}"</p>
                  <p class="card-text">
                    <small class="text-muted">${news.author || "-"}</small>
                  </p>
                </div>
              </div>
          </div>
        </div>
    `);
  };

  showInformation = (listOfNews, divId) => {
    let totalItems = listOfNews.length >= 5 ? 5 : listOfNews.length;
    for (i = 1; i < totalItems; i++) {
      let currentNews = listOfNews[i];
      $(`#${divId}`).append(
        `<div class="col card mb-3">
          <div class="row g-0">
            <div class="col-md-5">
              <img
                src="${currentNews.urlToImage}"
                class="img-fluid rounded-start"
                alt="img${i}-${divId}"
              />
            </div>

            <div class="col-md-7">
              <div class="card-body">
                <h5 class="card-title">${currentNews.title}</h5>
                <p class="card-text">${currentNews.description}</p>
                <p class="card-text">
                  <small class="text-muted">Author: ${
                    currentNews.author || "-"
                  }</small>
                </p>
              </div>
            </div>
         </div>`
      );
    }
  };

  showCurrentDayInformation = (data) => {
    let currentTemperature = data.main.temp.toFixed(2) + "ºC";
    let currentCity = data.name;
    let currentDate = new Date().toDateString();
    $(".weather").append(`
    <span class="d-flex ">
      <h4 class="pe-4">${currentCity} ${currentTemperature}</h4>
      <h4>${currentDate}</h4>
    </span>
    `);
  };

  getNews = (type, country, search, section) => {
    const news = $.ajax({
      url: `${baseUrlNews}/${type}`,
      type: "GET",
      data: {
        country: country,
        q: search,
        apiKey: apiKeyNews,
      },
    }).done((data) => {
      if (data.articles) {
        cleanedData = clearList(data.articles);
        if (section == "trending-news") showBannerHeader(cleanedData[0]);
        showInformation(cleanedData, section);
      }
    });

    return news;
  };

  getWeather = (type, cityName) => {
    const news = $.ajax({
      url: `${baseUrlWeather}/${type}`,
      type: "GET",
      data: {
        q: cityName,
        appid: apiKeyWeather,
        units: "metric",
      },
    }).done((data) => {
      showCurrentDayInformation(data);
    });

    return news;
  };

  getNews("top-headlines", "ca", "", "trending-news");
  getNews("everything", "", "ottawa", "city-news");
  getNews("everything", "", "sports", "sports-news");
  getWeather("weather", "ottawa");
});
