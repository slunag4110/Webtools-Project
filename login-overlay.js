// Opens and closes the Login popup and the Sign Up popup.
// Works on any page that has the overlay markup (homepage, contact, about).

var loginOverlay  = document.getElementById("loginOverlay");
var signupOverlay = document.getElementById("signupOverlay");

if (loginOverlay && signupOverlay) {

  // ---------- Open / close helpers ----------
  function showOverlay(overlay, focusId) {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden"; // stop the page behind from scrolling
    document.getElementById(focusId).focus();
  }

  function hideOverlay(overlay) {
    overlay.classList.remove("open");
  }

  function closeAll() {
    hideOverlay(loginOverlay);
    hideOverlay(signupOverlay);
    document.body.style.overflow = "";

    // Clear the forms and old messages
    document.getElementById("loginForm").reset();
    document.getElementById("signupForm").reset();
    document.getElementById("loginStatus").textContent = "";
    document.getElementById("signupStatus").textContent = "";
  }

  // Switch from one popup to the other (page stays locked, no flicker)
  function openLogin() {
    hideOverlay(signupOverlay);
    showOverlay(loginOverlay, "loginEmail");
  }
  function openSignup() {
    hideOverlay(loginOverlay);
    showOverlay(signupOverlay, "signupEmail");
  }

  // ---------- What opens the LOGIN popup ----------
  //   - the yellow "Login" button in the header
  //   - anything with the attribute data-open-login
  document.querySelectorAll(".nav a.login, [data-open-login]").forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      // The header button logs out if someone is already signed in
      if (item.matches(".nav a.login") && getUser()) {
        logout();
        return;
      }
      openLogin();
    });
  });

  // ---------- Switching between the two popups ----------
  // "Sign Up" link inside the Login popup  -> open Sign Up popup
  document.getElementById("signupLink").addEventListener("click", function (event) {
    event.preventDefault();
    openSignup();
  });
  // "Log in" link inside the Sign Up popup -> go back to Login popup
  document.getElementById("backToLogin").addEventListener("click", function (event) {
    event.preventDefault();
    openLogin();
  });

  // ---------- Closing ----------
  document.getElementById("loginClose").addEventListener("click", closeAll);
  document.getElementById("signupClose").addEventListener("click", closeAll);

  // Click on the dark area outside the card
  [loginOverlay, signupOverlay].forEach(function (overlay) {
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeAll();
      }
    });
  });

  // Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAll();
    }
  });

  // ---------- Show / hide password (works for both popups) ----------
  function setupPasswordToggle(buttonId, inputId) {
    var button = document.getElementById(buttonId);
    var input = document.getElementById(inputId);
    button.addEventListener("click", function () {
      var isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      button.title = isHidden ? "Hide password" : "Show password";
      button.classList.toggle("is-visible", isHidden);
    });
  }
  setupPasswordToggle("togglePassword", "loginPassword");
  setupPasswordToggle("toggleSignupPassword", "signupPassword");

  // ---------- Accounts ----------
  // DEMO ONLY: everything here runs in the browser, so it is not secure.
  // A real website must check passwords on a server.
  var ADMIN_USERNAME = "admin";
  var ADMIN_PASSWORD = "admin";

  var loginStatus = document.getElementById("loginStatus");
  var signupStatus = document.getElementById("signupStatus");
  var loginForm = document.getElementById("loginForm");
  var signupForm = document.getElementById("signupForm");

  // type is "error" (red) or "success" (green); leave it out for a normal note
  function showMessage(box, text, type) {
    box.textContent = text;
    box.className = "status-message " + (type || "");
  }

  // Member accounts are saved in this browser only
  function getMembers() {
    return JSON.parse(localStorage.getItem("ytrMembers") || "[]");
  }
  function findMember(username) {
    return getMembers().find(function (member) {
      return member.username === username;
    });
  }

  // Who is logged in right now (null if nobody)
  function getUser() {
    var saved = sessionStorage.getItem("ytrUser") || localStorage.getItem("ytrUser");
    return JSON.parse(saved);
  }
  // "Remember Me" keeps the user logged in after the browser is closed
  function saveUser(username, role, remember) {
    logout();
    var storage = remember ? localStorage : sessionStorage;
    storage.setItem("ytrUser", JSON.stringify({ username: username, role: role }));
  }
  function logout() {
    sessionStorage.removeItem("ytrUser");
    localStorage.removeItem("ytrUser");
    updateHeader();
  }

  // The header button reads "Logout" while someone is logged in
  function updateHeader() {
    var text = getUser() ? " Logout" : " Login";
    document.querySelectorAll(".nav a.login").forEach(function (link) {
      link.lastChild.textContent = text;
    });
  }

  // ---------- Member format rules ----------
  // Email:    name@example.com
  // Username: 4 to 20 letters, numbers, dots or underscores
  function isValidName(value) {
    var email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var username = /^[a-z0-9._]{4,20}$/;
    return email.test(value) || username.test(value);
  }

  // ---------- Sign in (admin and member) ----------
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var username = document.getElementById("loginEmail").value.trim().toLowerCase();
    var password = document.getElementById("loginPassword").value;
    var remember = loginForm.elements.remember.checked;

    // 1. Admin
    if (username === ADMIN_USERNAME) {
      if (password !== ADMIN_PASSWORD) {
        showMessage(loginStatus, "Incorrect username or password.", "error");
        return;
      }
      saveUser(username, "admin", remember);
      window.location.href = "admin.html";
      return;
    }

    // 2. Member
    if (!isValidName(username)) {
      showMessage(loginStatus, "Enter a valid email, or a username of 4-20 letters, numbers, dots or underscores.", "error");
      return;
    }
    var member = findMember(username);
    if (!member || member.password !== password) {
      showMessage(loginStatus, "Incorrect username or password.", "error");
      return;
    }
    saveUser(username, "member", remember);
    updateHeader();
    loginForm.reset();
    showMessage(loginStatus, "Welcome, " + username + "! You are now signed in.", "success");
  });

  // ---------- Sign up (members only) ----------
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var username = document.getElementById("signupEmail").value.trim().toLowerCase();
    var password = document.getElementById("signupPassword").value;

    if (!isValidName(username)) {
      showMessage(signupStatus, "Enter a valid email, or a username of 4-20 letters, numbers, dots or underscores.", "error");
      return;
    }
    if (username === ADMIN_USERNAME || findMember(username)) {
      showMessage(signupStatus, "That account name is already taken.", "error");
      return;
    }
    if (password.length < 8) {
      showMessage(signupStatus, "Password must be at least 8 characters.", "error");
      return;
    }

    var members = getMembers();
    members.push({ username: username, password: password });
    localStorage.setItem("ytrMembers", JSON.stringify(members));

    // Go to the sign-in popup with the new name filled in
    signupForm.reset();
    showMessage(signupStatus, "");
    loginForm.reset();
    openLogin();
    document.getElementById("loginEmail").value = username;
    document.getElementById("loginPassword").focus();
    showMessage(loginStatus, "Account created. Enter your password to sign in.", "success");
  });

  // ---------- Not connected yet ----------
  document.getElementById("googleButton").addEventListener("click", function () {
    showMessage(loginStatus, "Google sign-in needs to be connected to your authentication provider.");
  });
  document.getElementById("forgotLink").addEventListener("click", function (event) {
    event.preventDefault();
    showMessage(loginStatus, "Connect this link to your password-reset page.");
  });
  document.getElementById("googleSignupButton").addEventListener("click", function () {
    showMessage(signupStatus, "Google sign-up needs to be connected to your authentication provider.");
  });
  document.getElementById("signupForgotLink").addEventListener("click", function (event) {
    event.preventDefault();
    showMessage(signupStatus, "Connect this link to your password-reset page.");
  });

  updateHeader();
}
