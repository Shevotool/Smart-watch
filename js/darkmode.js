// Dark mode
const $themeBtn = document.querySelector("#dark-mode");
const $selectors = document.querySelectorAll("[data-dark]");

// Dark mode
const light = "🤍";
const dark = "🖤";
const darkBlue = "#333";
const pink = "#faf4ee";

const lightMode = () => {
  $selectors.forEach((el) => el.classList.remove("dark-mode"));
  $themeBtn.textContent = dark;
  localStorage.setItem("theme", "light");
};

const darkMode = () => {
  $selectors.forEach((el) => el.classList.add("dark-mode"));
  $themeBtn.textContent = light;
  localStorage.setItem("theme", "dark");
};

const toggleMode = () => {
  if ($themeBtn.textContent === dark) {
    darkMode();
  } else {
    lightMode();
  }
};

const setMode = () => {
  const theme = localStorage.getItem("theme") || "light";
  if (theme === "light") {
    lightMode();
  } else {
    darkMode();
  }
};

const init = () => {
  setMode();
  $themeBtn.addEventListener("click", toggleMode);
};

init();
