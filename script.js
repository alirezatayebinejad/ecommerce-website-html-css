// Focus the cursor on the email input when page loads
const emailField = document.getElementById("email-address-input");
if (emailField) {
  emailField.focus({ preventScroll: true });
}

// Feature 1: Dark / Light Mode Toggle
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    toggleBtn.textContent = body.classList.contains("dark-mode")
      ? "Light Mode"
      : "Dark Mode";
  });
}

// Feature 2: Back to Top Button
const topBtn = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
});
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Feature 3: Form Validation for Email
const form = document.getElementById("newsletter-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailField.value.trim();
  const message = document.getElementById("form-message");

  if (!email) {
    message.textContent = "Please enter your email address.";
    message.style.color = "red";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    message.textContent = "Please enter a valid email.";
    message.style.color = "red";
  } else {
    message.textContent = "Subscribed successfully!";
    message.style.color = "green";
    emailField.value = "";
  }
});

// Feature 4: Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
