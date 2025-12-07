import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/api/users/login`, { username, password });
  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};

export const signup = async (username, email, password) => {
  const res = await axios.post(`${API_URL}/api/users/signup`, { username, email, password });
  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};
