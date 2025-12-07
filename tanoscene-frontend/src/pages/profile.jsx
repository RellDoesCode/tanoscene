// frontend/src/pages/profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authprovider.jsx";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { username } = useParams(); // undefined if visiting own profile
  const navigate = useNavigate();
  const { user: currentUser, login: setAuthUser } = useAuth() || {};
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const bioRef = useRef(null);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const isOwnProfile = !username || currentUser?.username === username;

  // Load profile and posts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        if (!token && !username) {
          navigate("/login");
          return;
        }

        const profileUrl = username
          ? `${API_URL}/api/users/${username}`
          : `${API_URL}/api/users/me`;

        const profileRes = await axios.get(profileUrl, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        setUserProfile(profileRes.data);

        const postsRes = await axios.get(
          `${API_URL}/api/posts/user/${username || currentUser.username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(postsRes.data);

        if (!isOwnProfile) {
          const followRes = await axios.get(
            `${API_URL}/api/users/${username}/isFollowing`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setIsFollowing(Boolean(followRes.data.following));
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, token, currentUser, navigate, isOwnProfile]);

  // Save profile changes
  const handleEditToggle = async () => {
    if (!userProfile) return;

    if (editing) {
      try {
        const updated = {
          bio: bioRef.current?.value,
          avatar: userProfile.avatar,
          banner: userProfile.banner,
        };

        const res = await axios.put(`${API_URL}/api/users/me`, updated, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserProfile(res.data);

        // Update localStorage & auth context
        const saved = localStorage.getItem("user");
        if (saved) {
          const merged = { ...JSON.parse(saved), ...res.data };
          localStorage.setItem("user", JSON.stringify(merged));
          setAuthUser?.(merged);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to update profile.");
      }
    }

    setEditing(!editing);
  };

  // Upload helper
  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append(type, file);
    try {
      const res = await axios.post(`${API_URL}/api/users/me/${type}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      return res.data[`${type}Url`] || null;
    } catch (err) {
      console.error(`Failed to upload ${type}`, err);
      alert(`Failed to upload ${type}`);
      return null;
    }
  };

  // Avatar change
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUserProfile((u) => ({ ...u, avatar: URL.createObjectURL(file) })); // preview
    const uploadedUrl = await uploadFile(file, "avatar");
    if (uploadedUrl) setUserProfile((u) => ({ ...u, avatar: uploadedUrl }));
  };

  // Banner change
  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUserProfile((u) => ({ ...u, banner: URL.createObjectURL(file) })); // preview
    const uploadedUrl = await uploadFile(file, "banner");
    if (uploadedUrl) setUserProfile((u) => ({ ...u, banner: uploadedUrl }));
  };

  // Follow / unfollow
  const handleFollowToggle = async () => {
    if (!userProfile) return;
    try {
      const url = isFollowing
        ? `${API_URL}/api/users/${userProfile.username}/unfollow`
        : `${API_URL}/api/users/${userProfile.username}/follow`;

      const res = await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      setIsFollowing(!isFollowing);

      if (res.data.currentUser) {
        localStorage.setItem("user", JSON.stringify(res.data.currentUser));
        setAuthUser?.(res.data.currentUser);
      }
    } catch (err) {
      console.error(err);
      alert("Could not update follow status.");
    }
  };

  // Post actions
  const updatePost = (updatedPost) => {
    setPosts((cur) => cur.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const likePost = async (postId) => {
    try {
      const res = await axios.post(`${API_URL}/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updatePost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const repostPost = async (postId) => {
    try {
      const res = await axios.post(`${API_URL}/api/posts/${postId}/repost`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updatePost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (postId, content) => {
    if (!content.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/api/posts/${postId}/comment`, { content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updatePost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Loading / not found
  if (loading) return <p>Loading profile...</p>;
  if (notFound) return <p>User "{username}" not found.</p>;
  if (!userProfile) return null;

  return (
    <main className="profile-container">
      {/* BANNER */}
      <div className="profile-banner">
        <img
          src={userProfile.banner || "/images/banner-placeholder.png"}
          onClick={() => isOwnProfile && editing && bannerInputRef.current.click()}
        />
        {isOwnProfile && (
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleBannerChange}
          />
        )}
      </div>

      {/* HEADER */}
      <section className="profile-header">
        <div className="profile-avatar">
          <img
            src={userProfile.avatar || "/images/avatar-placeholder.png"}
            onClick={() => isOwnProfile && editing && avatarInputRef.current.click()}
          />
          {isOwnProfile && (
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          )}
        </div>

        <div className="profile-info">
          <h2>@{userProfile.username}</h2>

          {editing ? (
            <textarea ref={bioRef} defaultValue={userProfile.bio} className="bio-edit" />
          ) : (
            <p className="bio">{userProfile.bio || "No bio available."}</p>
          )}

          {isOwnProfile ? (
            <button className="edit-profile-button" onClick={handleEditToggle}>
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          ) : (
            <button className="edit-profile-button" onClick={handleFollowToggle}>
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </section>

      {/* POSTS */}
      <section className="profile-posts">
        <h3>Posts</h3>
        <div className="posts-list">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((p) => (
              <article key={p._id} className="post">
                <img className="post-avatar" src={p.author?.avatar || "/images/avatar-placeholder.png"} alt="" />
                <div className="post-body">
                  <p>
                    <strong>{p.author?.username}</strong> —{" "}
                    <small>{new Date(p.createdAt).toLocaleString()}</small>
                  </p>
                  <p>{p.content}</p>

                  {p.media?.map((m, i) => {
                    if (!m) return null;
                    const ext = m.split(".").pop();
                    if (["mp4", "webm", "ogg"].includes(ext)) {
                      return <video key={i} src={m} controls className="post-media" />;
                    }
                    return <img key={i} src={m} className="post-media" />;
                  })}

                  <div className="post-actions">
                    <button className="post-button" onClick={() => likePost(p._id)}>
                      Like ({p.likes?.length || 0})
                    </button>
                    <button className="post-button" onClick={() => repostPost(p._id)}>
                      Repost ({p.reposts?.length || 0})
                    </button>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <strong>Comments:</strong>
                    {p.comments?.length ? (
                      p.comments.map((c, i) => (
                        <p key={i}>
                          <strong>{c.author?.username}</strong>: {c.content}
                        </p>
                      ))
                    ) : (
                      <p>No comments</p>
                    )}

                    {currentUser && (
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
  );
}
