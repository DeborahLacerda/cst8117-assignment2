$(document).ready(() => {
  const baseUrlNews = "https://newsapi.org/v2";
  const baseUrlWeather = "https://api.openweathermap.org/data/2.5/";
  const apiKeyNews = "2199460b902247be9f80e58b6078abe9";
  const apiKeyWeather = "d228430a7837ca7c487f6914f626939d";

  const listOfSubjects = [
    "business",
    "ottawa",
    "sports",
    "basketball",
    "hockey",
    "food",
    "car",
    "entertainment",
    "movies",
    "music",
    "world",
  ];

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

  createMainSections = (itemsStored) => {
    let totalSubjects = itemsStored.length;
    for (let i = 0; i < totalSubjects; i++) {
      let currentSubject = itemsStored[i];
      getNews("everything", "", `${currentSubject}`, `${currentSubject}-news`);
    }
  };

  showSection = (listOfNews, section) => {
    $("#main-news").append(`
    <section class="${section}">
      <h2>${section.split("-").join(" ").toUpperCase()}</h2>
      <div id="${section}" class="row row-cols-1 row-cols-md-2 g-4">
      </div>
    </section>
  `);
    showInformation(listOfNews, section);
  };

  showInformation = (listOfNews, divId) => {
    let totalItems = listOfNews.length >= 5 ? 5 : listOfNews.length;
    for (let i = 1; i < totalItems; i++) {
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

        showSection(cleanedData, section);
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
  getWeather("weather", "ottawa");

  showFavoriteList = (listOfSubjects) => {
    let totalSubjects = listOfSubjects.length;
    for (let i = 0; i < totalSubjects; i++) {
      let currentSubject = listOfSubjects[i];
      $("#modal-body").append(`
        <div class="checkbox">
          <input type="checkbox" id=${currentSubject} name="subjects" value="${currentSubject}" />
          <label for="${currentSubject}">${currentSubject}</label>
        </div>
      `);
    }
  };

  let itemsStored = [];

  savePreferences = () => {
    const itemsChecked = $('input[name="subjects"]:checked');
    itemsStored = [];
    localStorage.setItem("preferences", JSON.stringify(itemsChecked));
    $.each(itemsChecked, (index, element) => {
      itemsStored.push(element.value);
    });
    localStorage.setItem("preferences", itemsStored);
    createMainSections(itemsStored);
    $("#favoriteModal").modal("hide");
  };

  showFavoriteList(listOfSubjects);

  getPreferences = () => {
    let currentPreferences = localStorage.getItem("preferences").split(",");
    createMainSections(currentPreferences);
  };

  showModal = () => {
    $("#favoriteModal").modal("show");
  };

  if (!localStorage.getItem("preferences")) {
    showModal();
  } else {
    getPreferences();
  }
});

showToastRequest = (type, content) => {
  Toastify({
    text: `${content}`,
    duration: 2000,
    close: false,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: `${type == "error" ? "#5c5d8d" : "#3f4739"}`,
    },
  }).showToast();
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
