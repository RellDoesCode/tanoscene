import axios from "axios";

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/api/users/login`, { username, password });
  const { token, user } = res.data;

=======
export const login = async (username, password) => {
  const res = await axios.post("/api/users/login", { username, password });
  const { token, user } = res.data;

  // Save token
>>>>>>> 050f1f0d7bdcbc2a1e372586587c46ddda71d38a
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};

export const signup = async (username, email, password) => {
<<<<<<< HEAD
  const res = await axios.post(`${API_URL}/api/users/signup`, { username, email, password });
=======
  const res = await axios.post("/api/users/signup", { username, email, password });
>>>>>>> 050f1f0d7bdcbc2a1e372586587c46ddda71d38a
  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};
