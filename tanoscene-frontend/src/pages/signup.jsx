import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authprovider.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/api/users/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      login(res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input name="username" value={form.username} onChange={handleChange} />

        <label>Email:</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />

        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" className="auth-button">Create Account</button>
      </form>
    </div>
  );
}
