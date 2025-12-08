import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authprovider.jsx";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Settings() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ username: "", bio: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ username: user.username, bio: user.bio || "" });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/users/me`,
        { username: form.username, bio: form.bio },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    }
  };

  return (
    <div className="page-container">
      <h2>Settings</h2>
      {saved && <p className="success-text">Saved!</p>}
      <form onSubmit={handleSubmit}>
        <label>Change Username:</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
        />

        <label>Change Bio:</label>
        <textarea
          name="bio"
          rows="4"
          value={form.bio}
          onChange={handleChange}
        ></textarea>

        <button type="submit" className="post-button">Save Changes</button>
      </form>
    </div>
  );
}
