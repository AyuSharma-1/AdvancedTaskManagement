import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import "./AuthStyles.css";
import { getErrorMessage } from "../../Utils/ErrorMessage";
import { forgotPassword } from "../../Services/AuthServices";
import forgotAnimation from "../../assets/animation/Error 404 Page.json";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success("Reset link sent to your email!");
      setEmail("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="login-page">
      {/* --- Animation Section --- */}
      <div className="login-animation">
        <Lottie animationData={forgotAnimation} loop={true} />
      </div>

      {/* --- Forgot Password Card --- */}
      <div className="login-card">
        <div className="login-brand">
          <h1>Forgot Password?</h1>
          <p>Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn login-btn">
            SEND RESET LINK
          </button>
        </form>

        <div className="login-footer">
          <p>
            Remember password? <Link to="/login">Login</Link>
          </p>
          <p>
            Not a user? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
