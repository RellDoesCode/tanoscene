// tanoscene-frontend/pages/home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch feed
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/posts/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create post
  const createPost = async (e) => {
    e.preventDefault();
    if (!text && !file) return;

    try {
      const formData = new FormData();
      formData.append("content", text);
      if (file) formData.append("media", file);

      const res = await axios.post("/api/posts", formData, {
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

  // Update a single post in state
  const updatePost = (updated) => {
    setPosts((cur) => cur.map((p) => (p._id === updated._id ? updated : p)));
  };

  // Like post
  const likePost = async (id) => {
    try {
      const res = await axios.post(`/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updatePost(res.data);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // Repost post
  const repostPost = async (id) => {
    try {
      const res = await axios.post(`/api/posts/${id}/repost`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updatePost(res.data);
    } catch (err) {
      console.error("Repost failed:", err);
    }
  };

  // Add comment
  const addComment = async (postId, content) => {
    if (!content || !content.trim()) return;
    try {
      const res = await axios.post(
        `/api/posts/${postId}/comment`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updatePost(res.data);
    } catch (err) {
      console.error("Add comment failed:", err);
    }
  };

  // Helper to determine if media is video
  const isVideo = (url) => {
    return /\.(mp4|webm|ogg)$/i.test(url) || url.includes("/api/media/");
  };

  return (
    <>
      <main className="home-container" id="home-page">
        {/* CREATE POST */}
        <section className="create-post">
          <h2>Create a Post</h2>
          <form onSubmit={createPost} encType="multipart/form-data">
            <textarea
              className="post-input"
              placeholder="What's on your mind?"
              rows="3"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div style={{ marginTop: 8 }}>
              <input
                type="file"
                name="media"
                accept="image/*,video/*,.gif"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file && <span style={{ marginLeft: 8 }}>{file.name}</span>}
            </div>
            <button className="post-button" style={{ marginTop: 8 }}>
              Post
            </button>
          </form>
        </section>

        {/* FEED */}
        <section className="feed">
          {loading ? (
            <p>Loading posts...</p>
          ) : (
            <div className="posts-list">
              {posts.length === 0 ? (
                <p>No posts yet.</p>
              ) : (
                posts.map((p) => (
                  <article key={p._id} className="post">
                    <img
                      className="post-avatar"
                      src={p.author?.avatar || "/images/avatar-placeholder.png"}
                      alt="avatar"
                    />
                    <div className="post-body">
                      <p>
                        <strong>{p.author?.username}</strong> —{" "}
                        <small>{new Date(p.createdAt).toLocaleString()}</small>
                      </p>

                      <p>{p.content}</p>

                      {/* Media rendering */}
                      {p.media?.length > 0 &&
                        p.media.map((m, i) =>
                          isVideo(m) ? (
                            <video
                              key={i}
                              src={m}
                              controls
                              className="post-media"
                              style={{ maxWidth: "100%" }}
                            />
                          ) : (
                            <img
                              key={i}
                              src={m}
                              alt="media"
                              className="post-media"
                              style={{ maxWidth: "100%" }}
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          )
                        )}

                      {/* Post actions */}
                      <div className="post-actions" style={{ marginTop: 8 }}>
                        <button className="post-button" onClick={() => likePost(p._id)}>
                          Like ({p.likes?.length || 0})
                        </button>
                        <button className="post-button" onClick={() => repostPost(p._id)}>
                          Repost ({p.reposts?.length || 0})
                        </button>
                      </div>

                      {/* Comments */}
                      <div style={{ marginTop: 8 }}>
                        <strong>Comments:</strong>
                        {p.comments?.length ? (
                          p.comments.map((c, i) => (
                            <p key={i}>
                              <strong>{c.author?.username || "Unknown"}</strong>: {c.content}
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
          )}
        </section>
      </main>
    </>
  );
}
