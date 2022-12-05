showToastRequest = (type, content) => {
    Toastify({
        text: `${content}`,
        duration: 2000,
        close: false,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: `${type == 'error' ? 'red' : 'green'}`
        },
    }).showToast();
};

// toggle to dark mode
function themeToggle() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    mode = document.querySelector(".theme-mode");
    mode.innerHTML = mode.innerHTML === "dark mode" ? "light mode" : "dark mode";
    forcastCard = document.querySelectorAll('.weather_forecast_item');
    forcastCard.forEach(card => {
        card.style.background = mode.innerHTML === "light mode" ? "#3f473977" : "#3f473977";
        card.style.color = mode.innerHTML === "light mode" ? "white" : "#654f6f";
    })
}

// validate email
function ValidateEmail(input) {
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return validRegex.test(input);
}

const emailInp = document.querySelector('#email');
const form = document.querySelector('.form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!ValidateEmail(emailInp.value)) {
        showToastRequest('error', "Email is invalid");
    }
})