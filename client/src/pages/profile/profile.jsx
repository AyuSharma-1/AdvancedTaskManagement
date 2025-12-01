import React, { useState, useEffect } from "react";
import Navbar from "../../components/Layout/Navbar";
import toast from "react-hot-toast";
import "./profile.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("todoapp"));
    setUsername(userData?.user?.username || "");
    setProfilePic(userData?.user?.profilePic || null);
  }, []);

  // ---------- Upload Profile Picture ----------
  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    const userData = JSON.parse(localStorage.getItem("todoapp"));
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await fetch("http://localhost:8000/api/v1/user/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${userData?.token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setProfilePic(
          data.user.profilePic
            ? `http://localhost:8000/${data.user.profilePic}`
            : null
        );
        localStorage.setItem(
          "todoapp",
          JSON.stringify({ ...userData, user: data.user })
        );
        toast.success("Profile photo updated!");
      } else toast.error(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  // ---------- Remove Profile Picture ----------
  const handleRemovePhoto = async () => {
    const userData = JSON.parse(localStorage.getItem("todoapp"));

    try {
      const res = await fetch("http://localhost:8000/api/v1/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({ removePhoto: true }),
      });

      const data = await res.json();
      if (data.success) {
        setProfilePic(null);
        localStorage.setItem(
          "todoapp",
          JSON.stringify({ ...userData, user: data.user })
        );
        toast.success("Profile photo removed");
      } else toast.error(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove photo");
    }
  };

  // ---------- Change Username ----------
  const handleUsernameChange = async () => {
    const userData = JSON.parse(localStorage.getItem("todoapp"));
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await res.json();
      if (data.success) {
        setUsername(data.user.username);
        setNewUsername("");
        localStorage.setItem(
          "todoapp",
          JSON.stringify({ ...userData, user: data.user })
        );
        toast.success("Username updated!");
      } else toast.error(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update username");
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">
          <h2>Profile Settings</h2>

          {/* ---------- Profile Picture Section ---------- */}
          <div className="profile-section">
            <div className="profile-picture">
              {profilePic ? (
                <img src={profilePic} alt="profile" />
              ) : (
                <div className="profile-placeholder">
                  <i className="fa-solid fa-user"></i>
                </div>
              )}
            </div>

            <h4 className="username-display">{username}</h4>

            <label className="upload-btn">
              Change Photo
              <input type="file" accept="image/*" onChange={handlePicUpload} />
            </label>

            {profilePic && (
              <button className="remove-btn" onClick={handleRemovePhoto}>
                Remove Photo
              </button>
            )}
          </div>

          {/* ---------- Username Section ---------- */}
          <div className="username-card">
            <h3>Change Username</h3>
            <input
              type="text"
              placeholder="Enter new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button className="update-btn" onClick={handleUsernameChange}>
              Update Username
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
