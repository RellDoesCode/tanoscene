import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../common/auth.js";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await signup(form.username, form.email, form.password);
      if (userData?.user && userData?.token) {
        localStorage.setItem("user", JSON.stringify(userData.user));
        localStorage.setItem("token", userData.token);
        navigate("/profile");
      } else {
        setError("Invalid signup response");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
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
        <input name="email" value={form.email} onChange={handleChange} />

        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
