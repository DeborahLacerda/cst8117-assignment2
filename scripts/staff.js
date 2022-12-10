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

// toggle to dark mode

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
  }
});
