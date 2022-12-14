$(document).ready(() => {
  const baseUrlNews = "https://newsapi.org/v2";
  const apiKeyNews = "82bdca288945450d9ad20f5253a5f8e3";

  clearList = (fullList) => {
    return fullList.filter(
      (el) => el.author && el.content && el.title && el.urlToImage
    );
  };

  showInformation = (listOfNews, divId) => {
    let totalItems = listOfNews.length >= 10 ? 10 : listOfNews.length;
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

  getNews = (type, search, section) => {
    const news = $.ajax({
      url: `${baseUrlNews}/${type}`,
      type: "GET",
      data: {
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

  getNews("everything", "world-cup", "world-cup");
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
      background: `${type == "error" ? "#BA0E25" : "#00D100"}`,
    },
  }).showToast();
};

// toggle to dark mode

const checkbox = document.getElementById("checkbox");

checkbox.addEventListener("change", () => {
  if (document.body.classList.toggle("dark-mode")) {
    localStorage.setItem("isDarkModeOn", true);
  } else {
    localStorage.setItem("isDarkModeOn", false);
  }
});

const currentMode = localStorage.getItem("isDarkModeOn");
if (currentMode == "true") {
  document.body.classList.toggle("dark-mode");
}

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
  } else {
    showToastRequest("success", "Email sent!");
    emailInp.value = "";
  }
});
