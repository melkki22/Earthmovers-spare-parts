// auth.js
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const username = localStorage.getItem("username") || "Admin";

  // Check top-bar-links
  const topBarLinks = document.querySelector(".top-bar-links");
  
  if (topBarLinks && isLoggedIn) {
    // Replace "Sign In / Register" with "Welcome! | Sign Out | Dashboard"
    topBarLinks.innerHTML = `
      <a href="admin.html">📊 Dashboard</a>
      <a href="#">Order Tracking</a>
      <span style="color:#fbb034; font-weight:700; margin-left:20px;">👤 ${username}</span>
      <a href="#" id="signOutBtn" style="color:#ef4444; font-weight:700;">Sign Out</a>
    `;

    document.getElementById("signOutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("username");
      
      if (typeof showToast === "function") {
        showToast("Signed out successfully.", "warn");
        setTimeout(() => window.location.href = "index.html", 1000);
      } else {
        window.location.href = "index.html";
      }
    });
  }

  // Rewrite Login & Register page behaviors if logged in
  if (isLoggedIn && (window.location.pathname.includes("login.html") || window.location.pathname.includes("register.html"))) {
    window.location.href = "admin.html";
  }
});
