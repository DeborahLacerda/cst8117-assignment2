const baseUrl = "https://newsapi.org/v2";
const apiKey = "2199460b902247be9f80e58b6078abe9";

setBannerHeader = (news) => {
  $(document).ready(() => {
    $(".banner").append(`
      <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-8">
                <img src="${
                  news.urlToImage
                }" class="img-fluid rounded-start" alt="..." />
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
  });
};

showInformation = (listOfNews, divId) => {
  for (i = 1; i < 3; i++) {
    let currentNews = listOfNews[i];
    $(document).ready(() => {
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
    });
  }
};

getNews = (type, country, search, section) => {
  const news = $.ajax({
    url: `${baseUrl}/${type}`,
    type: "GET",
    data: {
      country: country,
      q: search,
      apiKey: apiKey,
    },
  }).done((data) => {
    if (section == "trending-news") setBannerHeader(data.articles[0]);
    showInformation(data.articles, section);
  });

  return news;
};

getNews("top-headlines", "ca", "", "trending-news");
getNews("everything", "", "ottawa", "city-news");
getNews("everything", "", "sports", "sports-news");
