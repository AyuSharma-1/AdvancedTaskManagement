import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthStyles.css";
import AuthServices from "../../Services/AuthServices";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../Utils/ErrorMessage";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/animation/Error 404 Page.json";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password };
      const res = await AuthServices.loginUSer(data);
      toast.success(res.data.message);
      localStorage.setItem("todoapp", JSON.stringify(res.data));
      navigate("/home");
    } catch (err) {
      toast.error(getErrorMessage(err));
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      {/* --- Lottie Animation Box --- */}
      <div className="login-animation">
        <Lottie animationData={loginAnimation} loop={true} />
      </div>

      {/* --- Login Card --- */}
      <div className="login-card">
        <div className="login-brand">
          <h1>Welcome Back</h1>
          <p>Login to continue managing your productivity</p>
        </div>

        <form onSubmit={loginHandler}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn login-btn">
            LOGIN
          </button>
        </form>

        <div className="login-footer">
          <Link to="/forgot-Password">Forgot Password?</Link>
          <p>
            Not a user? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
