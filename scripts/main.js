const baseUrl = "https://newsapi.org/v2";
const apiKey = "2199460b902247be9f80e58b6078abe9";

getAllNews = async () => {
  const news = await $.ajax({
    url: `${baseUrl}/top-headlines`,
    type: "GET",
    data: {
      country: "ca",
      apiKey: apiKey,
    },
  });

  showBannerInformation(news);
  return news;
};

let i = getAllNews();

showBannerInformation = (news) => {
  const firstNews = news.articles[0];
  $("img").attr("src", firstNews.urlToImage);
  $(".banner-title").text(firstNews.title);
  $(".banner-title").text(firstNews.description);
};

showBannerInformation();
