// Login popup for the homepage (admin and member).
// The user stays on the homepage after logging in.
//
// DEMO ONLY: passwords written in JavaScript can be read by anyone.
// A real website must check passwords on a server.

var ACCOUNTS = [
  { username: "admin",  password: "admin",     role: "Admin" },
  { username: "member", password: "member123", role: "Member" }
];

var loginOverlay = document.getElementById("loginOverlay");
var loginForm = document.getElementById("loginForm");
var loginStatus = document.getElementById("loginStatus");
var usernameInput = document.getElementById("loginEmail");
var passwordInput = document.getElementById("loginPassword");
var toggleButton = document.getElementById("togglePassword");
var headerButton = document.querySelector(".nav a.login");
var closeTimer;

// ---------- Who is logged in ----------
function getUser() {
  var saved = sessionStorage.getItem("ytrUser") || localStorage.getItem("ytrUser");
  return JSON.parse(saved);
}

// The header button reads "Logout" while someone is logged in
function updateHeader() {
  headerButton.lastChild.textContent = getUser() ? " Logout" : " Login";
}

function logout() {
  sessionStorage.removeItem("ytrUser");
  localStorage.removeItem("ytrUser");
  updateHeader();
}

// ---------- Open / close the popup ----------
function showMessage(text, type) {
  loginStatus.textContent = text;
  loginStatus.className = "status-message " + (type || "");
}

function setPasswordVisible(visible) {
  var label = visible ? "Hide password" : "Show password";
  passwordInput.type = visible ? "text" : "password";
  toggleButton.setAttribute("aria-label", label);
  toggleButton.title = label;
  toggleButton.classList.toggle("is-visible", visible);
}

function openLogin() {
  clearTimeout(closeTimer);
  loginOverlay.classList.add("open");
  document.body.style.overflow = "hidden";

  var user = getUser();
  if (user) {
    showMessage("You are already signed in as " + user.username + ".", "success");
  }
  usernameInput.focus();
}

function closeLogin() {
  clearTimeout(closeTimer);
  loginOverlay.classList.remove("open");
  document.body.style.overflow = "";
  loginForm.reset();
  setPasswordVisible(false);
  showMessage("");
}

// Header button: Login or Logout
headerButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (getUser()) {
    logout();
  } else {
    openLogin();
  }
});

// "Member Login" button and anything else with data-open-login
document.querySelectorAll("[data-open-login]").forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.preventDefault();
    openLogin();
  });
});

document.getElementById("loginClose").addEventListener("click", closeLogin);

// Click on the dark area outside the card
loginOverlay.addEventListener("click", function (event) {
  if (event.target === loginOverlay) {
    closeLogin();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && loginOverlay.classList.contains("open")) {
    closeLogin();
  }
});

toggleButton.addEventListener("click", function () {
  setPasswordVisible(passwordInput.type === "password");
});

// ---------- Sign in ----------
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var username = usernameInput.value.trim().toLowerCase();
  var password = passwordInput.value;

  var account = ACCOUNTS.find(function (item) {
    return item.username === username && item.password === password;
  });

  if (!account) {
    showMessage("Incorrect username or password.", "error");
    return;
  }

  // "Remember Me" keeps the user logged in after the browser is closed
  logout();
  var storage = loginForm.elements.remember.checked ? localStorage : sessionStorage;
  storage.setItem("ytrUser", JSON.stringify({ username: account.username, role: account.role.toLowerCase() }));
  updateHeader();

  showMessage("Welcome, " + account.role + "! You are now signed in.", "success");
  clearTimeout(closeTimer);
  closeTimer = setTimeout(closeLogin, 1500); // stay on the homepage
});

// ---------- Not connected yet ----------
document.getElementById("googleButton").addEventListener("click", function () {
  showMessage("Google sign-in is not connected yet.");
});
document.getElementById("forgotLink").addEventListener("click", function (event) {
  event.preventDefault();
  showMessage("Password reset is not connected yet.");
});

updateHeader();
