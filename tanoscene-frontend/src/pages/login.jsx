import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../common/auth.js";
import { useAuth } from "../context/authprovider.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await apiLogin(form.username, form.password);
      if (userData?.user && userData?.token) {
        login(userData); // update context & localStorage
        navigate("/"); // redirect home
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          disabled={loading}
        />

        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
