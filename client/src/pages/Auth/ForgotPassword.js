import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../Utils/ErrorMessage";
import {forgotPassword} from "../../Services/AuthServices"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email)
      toast.success("Reset Link sent to your email");
    } catch (err) {
      console.log(err);
      toast.error(getErrorMessage(err));
    }
  };
  return (
    <div className="form-container">
      <div className="form">
        <div className="mb-3">
          <h1 className="text-center">Forgot Password</h1>
          <i className="fa-solid fa-circle-user"></i>
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-bottom">
          <p className="text-center">
            not a user? please
            <Link to="/register"> Register</Link>
          </p>
          <button type="submit" className="login-btn" onClick={handleSubmit}>
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
