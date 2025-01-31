let users = JSON.parse(localStorage.getItem("users")) || [];

// Signup function
const signup_btn = document.getElementById("signup-form");
signup_btn.addEventListener("submit", () => {
  const first_name = document.getElementById("first-name").value;
  const last_name = document.getElementById("last-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm_password = document.getElementById(
    "signup-confirm-password"
  ).value;
  if (users.some((u) => u.email === email)) {
    alert("Email is already registered!");
    return;
  }
  const newUser = {
    first_name,
    last_name,
    email,
    password,
    confirm_password,
    cart: [],
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "../login/index.html";
  alert("Signup successful! Please log in.");
});

