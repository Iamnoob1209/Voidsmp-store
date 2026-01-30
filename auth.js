// VoidSMP Google Auth - Fixed Version

(function () {
  "use strict";

  const CLIENT_ID = "1070356258235-otreum69ja5cha95tntqcabamd03uv7h.apps.googleusercontent.com";

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

  google.accounts.id.renderButton(
    document.getElementById("loginBtn"),
    { theme: "outline", size: "large" }
  );

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
    updateAuthUI();
    showNotification("Logged out", "success");
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
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2000);
  }

  loadGoogle();
})();
