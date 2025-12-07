import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authprovider.jsx";
import axios from "axios";

export default function Settings() {
  const { user, setUser } = useAuth(); // get logged-in user from context
  const [form, setForm] = useState({ username: "", bio: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ username: user.username, bio: user.bio || "" });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/users/me`,
        { username: form.username, bio: form.bio },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setUser(res.data); // update context with new user data
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
