let users = JSON.parse(localStorage.getItem("users")) || [];
let authToken = localStorage.getItem("authToken");
let loggedInUser = localStorage.getItem("loggedInUser");

// Generate a random authentication token
const generateAuthToken = () => {
  return Math.random().toString(36).substring(2) + Math.random().toString(36);
};

// Login function
const login_btn=document.getElementById('login-form')
login_btn.addEventListener('submit',()=>{
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    authToken = generateAuthToken();
    loggedInUser = email;
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("loggedInUser", loggedInUser);
    window.location.href = "../shop/index.html"; 
    alert("Login successful!"); 
  } else {
    alert("Invalid email or password!");
  }
})
