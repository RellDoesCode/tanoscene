import { signup } from "../common/auth.js";

const form = document.getElementById("signupForm");
let err = form.querySelector(".form-error");
if (!err) {
  err = document.createElement("p");
  err.className = "form-error";
  form.appendChild(err);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  err.textContent = "";
  const data = {
    username: form.username.value,
    email: form.email.value,
    password: form.password.value
  };

  const res = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();

  if (!res.ok) {
    err.textContent = json.message || "Sign up failed";
    return;
  }

  localStorage.setItem("token", json.token);
  localStorage.setItem("user", JSON.stringify(json.user));

  alert("Signup successful!");
  window.location.href = "./index.html";

//   try {
//     signup({ username, email, password });
//     window.location.href = "./index.html";
//   } catch (ex) {
//     err.textContent = ex.message || "Sign up failed";
//   }
});
