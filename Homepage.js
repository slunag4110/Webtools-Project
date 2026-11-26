// Replaces the React useState logic from App.jsx

const site = document.getElementById("site");
const nav = document.getElementById("nav");
const menuButton = document.getElementById("menuButton");
const themeToggle = document.getElementById("themeToggle");

// Dark mode: add/remove the class "dark" on the page wrapper
// (only runs on pages that have the toggle button, e.g. not the contact page)
if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    const isDark = site.classList.toggle("dark");
    themeToggle.setAttribute("aria-pressed", isDark);
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  });
}

// Mobile menu: add/remove the class "open" on the nav
if (menuButton && nav) {
  menuButton.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", isOpen);
  });
}

// Close the mobile menu when a link is clicked
nav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});