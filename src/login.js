import { login } from "../common/auth.js";

const form = document.getElementById("loginForm");
const err = document.getElementById("error");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  err.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  try {
    login({ email, password });
    window.location.href = "./index.html";
  } catch (ex) {
    err.textContent = ex.message || "Login failed";
  }
});
