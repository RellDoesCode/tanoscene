import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar.jsx";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  // Fetch feed
  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create post
  const createPost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        "/api/posts",
        { content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts([res.data, ...posts]);
      setText("");
    } catch (err) {
      console.error("Failed to post:", err);
    }
  };

  // Like
  const likePost = async (id) => {
    try {
      const res = await axios.post(
        `/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((p) => (p._id === id ? res.data : p)));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // Repost
  const repostPost = async (id) => {
    try {
      const res = await axios.post(
        `/api/posts/${id}/repost`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((p) => (p._id === id ? res.data : p)));
    } catch (err) {
      console.error("Repost failed:", err);
    }
  };

  // Add comment
  const addComment = async (postId, content) => {
    if (!content.trim()) return;
    try {
      const res = await axios.post(
        `/api/posts/${postId}/comment`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the post in local state
      setPosts(posts.map((p) => (p._id === postId ? res.data : p)));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <>
      <main className="home-container" id="home-page">

        {/* CREATE POST */}
        <section className="create-post">
          <h2>Create a Post</h2>

          <form onSubmit={createPost}>
            <textarea
              className="post-input"
              placeholder="What's on your mind?"
              rows="3"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="post-button">Post</button>
          </form>
        </section>

        {/* FEED */}
        <section className="feed">
          <div className="posts-list">
            {posts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              posts.map((p) => (
                <article key={p._id} className="post">

                  <img
                    className="post-avatar"
                    src={p.author.avatar || "/images/avatar-placeholder.png"}
                    alt="avatar"
                  />

                  <div className="post-body">
                    <p>
                      <strong>{p.author.username}</strong> —{" "}
                      <small>{new Date(p.createdAt).toLocaleString()}</small>
                    </p>

                    <p>{p.content}</p>

                    {p.media?.map((m, i) => {
                      const ext = m.split(".").pop().toLowerCase();
                      if (["mp4", "ogg", "webm"].includes(ext)) {
                        return <video key={i} src={m} controls className="post-media" />;
                      }
                      return <img key={i} src={m} alt="media" className="post-media" />;
                    })}

                    <div className="post-actions">
                      <button className="post-button" onClick={() => likePost(p._id)}>
                        Like ({p.likes?.length || 0})
                      </button>
                      <button className="post-button" onClick={() => repostPost(p._id)}>
                        Repost ({p.reposts?.length || 0})
                      </button>
                    </div>

                    {/* COMMENTS */}
                    <div className="post-comments" style={{ marginTop: 8 }}>
                      <strong>Comments:</strong>
                      {p.comments?.length ? (
                        p.comments.map((c, i) => (
                          <p key={i}>
                            <strong>{c.author?.username || "Deleted User"}</strong>: {c.content}
                          </p>
                        ))
                      ) : (
                        <p>No comments</p>
                      )}

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
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 TanoScene</p>
      </footer>
    </>
  );
}
