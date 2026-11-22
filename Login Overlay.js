// Opens and closes the login popup (overlay).
// Works on any page that has the overlay markup (homepage + contact).

var loginOverlay = document.getElementById("loginOverlay");

if (loginOverlay) {
  var closeButton = document.getElementById("loginClose");
  var loginForm = document.getElementById("loginForm");
  var loginEmail = document.getElementById("loginEmail");
  var loginPassword = document.getElementById("loginPassword");
  var togglePassword = document.getElementById("togglePassword");
  var loginStatus = document.getElementById("loginStatus");

  // ----- Open the popup -----
  function openLogin() {
    loginOverlay.classList.add("open");
    document.body.style.overflow = "hidden"; // stop the page behind from scrolling
    loginEmail.focus();
  }

  // ----- Close the popup -----
  function closeLogin() {
    loginOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Any link or button that should open the login popup:
  //   - the yellow "Login" button in the header
  //   - anything with the attribute data-open-login
  var openers = document.querySelectorAll(".nav a.login, [data-open-login]");
  openers.forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault(); // don't jump to the link's page/section
      openLogin();
    });
  });

  // X button
  closeButton.addEventListener("click", closeLogin);

  // Clicking the dark area outside the card
  loginOverlay.addEventListener("click", function (event) {
    if (event.target === loginOverlay) {
      closeLogin();
    }
  });

  // Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && loginOverlay.classList.contains("open")) {
      closeLogin();
    }
  });

  // ----- Show / hide password -----
  togglePassword.addEventListener("click", function () {
    var isHidden = loginPassword.type === "password";
    loginPassword.type = isHidden ? "text" : "password";
    togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    togglePassword.title = isHidden ? "Hide password" : "Show password";
    togglePassword.classList.toggle("is-visible", isHidden);
  });

  // ----- Form messages (placeholders until a real login system is connected) -----
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    loginStatus.textContent = "Demo only: connect this form to your authentication system to log in.";
  });
  document.getElementById("googleButton").addEventListener("click", function () {
    loginStatus.textContent = "Google sign-in needs to be connected to your authentication provider.";
  });
  document.getElementById("forgotLink").addEventListener("click", function (event) {
    event.preventDefault();
    loginStatus.textContent = "Connect this link to your password-reset page.";
  });
  document.getElementById("signupLink").addEventListener("click", function (event) {
    event.preventDefault();
    loginStatus.textContent = "Connect this link to your account registration page.";
  });
}