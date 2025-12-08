import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authprovider.jsx";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { username } = useParams();
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
  const validToken = token && token !== "null" && token !== "undefined";
  const authHeader = validToken ? { Authorization: `Bearer ${token}` } : {};

  const isOwnProfile = !username || currentUser?.username === username;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        if (!validToken && !username) {
          navigate("/login");
          return;
        }

        const profileUrl = username
          ? `${API_URL}/api/users/${username}`
          : `${API_URL}/api/users/me`;

        const profileRes = await axios.get(profileUrl, {
          headers: authHeader,
        });

        setUserProfile(profileRes.data);

        const postsRes = await axios.get(
          `${API_URL}/api/posts/user/${username || currentUser?.username}`,
          { headers: authHeader }
        );

        setPosts(postsRes.data);

        if (!isOwnProfile && validToken) {
          const followRes = await axios.get(
            `${API_URL}/api/users/${username}/isFollowing`,
            { headers: authHeader }
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
  }, [username, validToken, currentUser, navigate, isOwnProfile]);

  const handleEditToggle = async () => {
    if (!userProfile) return;

    if (editing) {
      try {
        const formData = new FormData();
        if (bioRef.current) formData.append("bio", bioRef.current.value);
        if (userProfile.avatarFile) formData.append("avatar", userProfile.avatarFile);
        if (userProfile.bannerFile) formData.append("banner", userProfile.bannerFile);

        const res = await axios.put(`${API_URL}/api/users/me`, formData, {
          headers: { ...authHeader, "Content-Type": "multipart/form-data" },
        });

        setUserProfile({ ...res.data });
        setAuthUser?.(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error(err);
        alert("Failed to save profile changes.");
      }
    }

    setEditing(!editing);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUserProfile((u) => ({
      ...u,
      avatar: URL.createObjectURL(file),
      avatarFile: file,
    }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUserProfile((u) => ({
      ...u,
      banner: URL.createObjectURL(file),
      bannerFile: file,
    }));
  };

  const handleFollowToggle = async () => {
    if (!userProfile) return;
    try {
      const url = isFollowing
        ? `${API_URL}/api/users/${userProfile.username}/unfollow`
        : `${API_URL}/api/users/${userProfile.username}/follow`;

      const res = await axios.post(url, {}, { headers: authHeader });
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

  const updatePost = (updatedPost) => {
    setPosts((cur) => cur.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const likePost = async (postId) => {
    try {
      const res = await axios.post(`${API_URL}/api/posts/${postId}/like`, {}, {
        headers: authHeader,
      });
      updatePost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const repostPost = async (postId) => {
    try {
      const res = await axios.post(`${API_URL}/api/posts/${postId}/repost`, {}, {
        headers: authHeader,
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
        headers: authHeader,
      });
      updatePost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (notFound) return <p>User "{username}" not found.</p>;
  if (!userProfile) return null;

  return (
    <main className="profile-container">
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

          {/* Follower counts preserved */}
          <p className="bio">
            Followers: {userProfile.followers?.length || 0} • Following: {userProfile.following?.length || 0}
          </p>

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

      <section className="profile-posts">
        <h3>Posts</h3>
        <div className="posts-list">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((p) => (
              <article key={p._id} className="post">
                <img
                  className="post-avatar"
                  src={p.author?.avatar || "/images/avatar-placeholder.png"}
                  alt=""
                />
                <div className="post-body">
                  <p>
                    <strong>{p.author?.username}</strong> —{" "}
                    <small>{new Date(p.createdAt).toLocaleString()}</small>
                  </p>
                  <p>{p.content}</p>

                  {p.media?.map((m, i) => {
                    if (!m) return null;

                    const filename = m.split("/").pop();
                    const mediaUrl = `${API_URL}/api/media/${filename}`;
                    const ext = filename.split(".").pop();

                    if (["mp4", "webm", "ogg"].includes(ext)) {
                      return <video key={i} src={mediaUrl} controls className="post-media" />;
                    }
                    return <img key={i} src={mediaUrl} className="post-media" />;
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
