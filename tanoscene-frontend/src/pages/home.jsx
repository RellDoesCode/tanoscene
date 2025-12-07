import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (e) => {
    e.preventDefault();
    if (!text && !file) return;
    try {
      const formData = new FormData();
      formData.append("content", text);
      if (file) formData.append("media", file);

      const res = await axios.post(`${API_URL}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPosts([res.data, ...posts]);
      setText("");
      setFile(null);
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const updatePost = (updated) =>
    setPosts((cur) => cur.map((p) => (p._id === updated._id ? updated : p)));

  const likePost = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updatePost(res.data);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const repostPost = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/api/posts/${id}/repost`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updatePost(res.data);
    } catch (err) {
      console.error("Repost failed:", err);
    }
  };

  const addComment = async (postId, content) => {
    if (!content?.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/api/posts/${postId}/comment`, { content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updatePost(res.data);
    } catch (err) {
      console.error("Add comment failed:", err);
    }
  };

  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url) || url?.includes("/api/media/");

  return (
    <main className="home-container">
      <section className="create-post">
        <h2>Create a Post</h2>
        <form onSubmit={createPost}>
          <textarea
            placeholder="What's on your mind?"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input type="file" accept="image/*,video/*,.gif" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {file && <span>{file.name}</span>}
          <button type="submit">Post</button>
        </form>
      </section>

      <section className="feed">
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((p) => (
            <article key={p._id} className="post">
              <img className="post-avatar" src={p.author?.avatar || "/images/avatar-placeholder.png"} alt="avatar" />
              <div className="post-body">
                <p>
                  <strong>{p.author?.username}</strong> —{" "}
                  <small>{new Date(p.createdAt).toLocaleString()}</small>
                </p>
                <p>{p.content}</p>

                {p.media?.map((m, i) => isVideo(m) ? (
                  <video key={i} src={m} controls style={{ maxWidth: "100%" }} />
                ) : (
                  <img key={i} src={m} alt="media" style={{ maxWidth: "100%" }} />
                ))}

                <div className="post-actions">
                  <button onClick={() => likePost(p._id)}>Like ({p.likes?.length || 0})</button>
                  <button onClick={() => repostPost(p._id)}>Repost ({p.reposts?.length || 0})</button>
                </div>

                <div>
                  <strong>Comments:</strong>
                  {p.comments?.length ? p.comments.map((c, i) => (
                    <p key={i}><strong>{c.author?.username || "Unknown"}</strong>: {c.content}</p>
                  )) : <p>No comments</p>}

                  {token && (
                    <input
                      placeholder="Add a comment..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addComment(p._id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
