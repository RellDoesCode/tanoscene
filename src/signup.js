import { signup } from "../common/auth.js";

const form = document.querySelector("form");
let err = form.querySelector(".form-error");
if (!err) {
  err = document.createElement("p");
  err.className = "form-error";
  form.appendChild(err);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  err.textContent = "";
  const username = form.querySelector("#username")?.value?.trim() || "";
  const email = form.querySelector("#email")?.value?.trim() || "";
  const password = form.querySelector("#password")?.value || "";
  try {
    signup({ username, email, password });
    window.location.href = "./index.html";
  } catch (ex) {
    err.textContent = ex.message || "Sign up failed";
  }
});
