import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthStyles.css"; 

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:8000"; 

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      const { data } = await axios.patch(
        `${API_URL}/api/v1/user/reset-password/${token}`,
        { newPassword }
      );

      if (data.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Failed to reset password");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Reset Password</h1>
        <p>Enter your new password below</p>
        <form onSubmit={handleReset}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Reset Password
          </button>
          {message && <p className="reset-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
