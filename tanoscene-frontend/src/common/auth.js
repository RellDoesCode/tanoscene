import axios from "axios";

export const login = async (username, password) => {
  const res = await axios.post("/api/users/login", { username, password });
  const { token, user } = res.data;

  // Save token
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};

export const signup = async (username, email, password) => {
  const res = await axios.post("/api/users/signup", { username, email, password });
  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};
