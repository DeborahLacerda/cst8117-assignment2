// toggle to dark mode
function themeToggle() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    mode = document.querySelector(".theme-mode");
    mode.innerHTML = mode.innerHTML === "dark mode" ? "light mode" : "dark mode";
}