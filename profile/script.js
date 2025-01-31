let users = JSON.parse(localStorage.getItem("users")) || [];
let authToken = localStorage.getItem("authToken");
let loggedInUser = localStorage.getItem("loggedInUser");

document.addEventListener("DOMContentLoaded", () => {
  // If not logged in, redirect to the login page
  if (!loggedInUser) {
    alert("You must log in to access this page.");
    window.location.href = "../index.html"; // Redirect to login page
  }
});

// Change password
const changePassword = () => {
  const old_pass = document.getElementById("old-password").value;
  const new_pass = document.getElementById("new-password").value;
  const conf_pass = document.getElementById("confirm-new-password").value;

  if (new_pass !== conf_pass) {
    alert("New password and confirm password do not match.");
    return;
  }

  const user = users.find((u) => u.password === old_pass);

  if (user) {
    user.password = new_pass;
    user.confirm_password = new_pass;
    saveUsersToLocalStorage();
    alert("Password changed successfully and updated in local storage.");
  } else {
    alert("Invalid old password.");
  }
};

const changeDetails = () => {
  const first_name = document.getElementById("first-name").value
  const last_name = document.getElementById("last-name").value;

  const user = users.find((u) => u.email === loggedInUser)

  if (user) {
    user.first_name = first_name;
    user.last_name = last_name;
    saveUsersToLocalStorage();
    alert("name changed successfully and updated in local storage.");
  }
};

const saveUsersToLocalStorage = () => {
  localStorage.setItem("users", JSON.stringify(users));
};

// Load users from local storage on page load (optional)
document.addEventListener("DOMContentLoaded", () => {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    users.splice(0, users.length, ...JSON.parse(storedUsers));
  }
});

// Logout function
const logout = () => {
  authToken = null;
  loggedInUser = null;
  localStorage.removeItem("authToken");
  localStorage.removeItem("loggedInUser");
  window.location.href = "../index.html";
  alert("Logged out successfully!");
};

const dis=()=>{
  const user = users.find((u) => u.email === loggedInUser)
  document.getElementById("first-name").value =user.first_name
  document.getElementById("last-name").value =user.last_name
}

dis();