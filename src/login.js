import { login } from "../common/auth.js";

const form = document.getElementById("loginForm");
const err = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  err.textContent = "";
  const email = form.email.value;
  const password = form.password.value;

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const json = await res.json();

  if (!res.ok) {
    document.getElementById("error").textContent = json.message || "Login failed";
    return;
  }

  localStorage.setItem("token", json.token);
  localStorage.setItem("user", JSON.stringify(json.user));

  alert("Login successful!");
  window.location.href = "./index.html";
});
