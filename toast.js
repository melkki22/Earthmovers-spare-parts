// toast.js
function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "✅";
  if (type === "error") icon = "❌";
  if (type === "warn") icon = "⚠️";

  toast.innerHTML = `<span class="icon">${icon}</span> ${message}`;
  
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
