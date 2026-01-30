// VoidSMP Google Auth - With Session Protection

(function () {
  "use strict";

  const CLIENT_ID = "1070356258235-167rqnfked4jqpmksa1r2lfsr96tspeh.apps.googleusercontent.com";

  // Protected pages that require authentication
  const protectedPages = ["home.html", "store.html", "perks.html", "buy.html", "ranks.html"];
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Check if current page requires authentication
  function checkAuth() {
    if (protectedPages.includes(currentPage)) {
      const token = localStorage.getItem("voidsmp_token");
      const captchaVerified = sessionStorage.getItem("voidsmp_captcha_verified");

      if (!token || !captchaVerified) {
        // Clear any incomplete session data
        localStorage.removeItem("voidsmp_token");
        sessionStorage.removeItem("voidsmp_captcha_verified");
        // Redirect to sign-in page
        window.location.replace("signin.html");
        return false;
      }
    }
    return true;
  }

  // Run auth check immediately
  if (!checkAuth()) {
    return; // Stop execution if redirecting
  }

  function loadGoogle() {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }

  function initGoogle() {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse
    });

    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      google.accounts.id.renderButton(
        loginBtn,
        { theme: "outline", size: "large" }
      );
    }

    updateAuthUI();
  }

  function handleCredentialResponse(response) {
    const payload = JSON.parse(atob(response.credential.split(".")[1]));
    localStorage.setItem("voidsmp_token", JSON.stringify(payload));
    updateAuthUI();
    showNotification("Signed in!", "success");
  }

  function getUser() {
    const data = localStorage.getItem("voidsmp_token");
    return data ? JSON.parse(data) : null;
  }

  function updateAuthUI() {
    const user = getUser();

    const loginBtn = document.getElementById("loginBtn");
    const userMenu = document.getElementById("userMenu");
    const avatar = document.getElementById("userAvatar");
    const name = document.getElementById("userName");

    if (!loginBtn || !userMenu) return;

    if (user) {
      loginBtn.style.display = "none";
      userMenu.style.display = "flex";

      if (avatar) avatar.src = user.picture;
      if (name) name.textContent = user.name;
    } else {
      loginBtn.style.display = "block";
      userMenu.style.display = "none";
    }
  }

  window.handleLogin = function () {
    google.accounts.id.renderButton(
      document.getElementById("loginBtn"),
      { theme: "outline", size: "large" }
    );
  };

  window.handleLogout = function () {
    localStorage.removeItem("voidsmp_token");
    sessionStorage.removeItem("voidsmp_captcha_verified");
    showNotification("Logged out", "success");
    // Redirect to sign-in page after logout
    setTimeout(() => {
      window.location.href = "signin.html";
    }, 1000);
  };

  function showNotification(msg, type) {
    const n = document.createElement("div");
    n.textContent = msg;
    n.style.position = "fixed";
    n.style.top = "80px";
    n.style.right = "20px";
    n.style.padding = "10px 20px";
    n.style.background = type === "success" ? "#10b981" : "#ef4444";
    n.style.color = "white";
    n.style.borderRadius = "8px";
    n.style.zIndex = "10000";
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2000);
  }

  loadGoogle();
})();
