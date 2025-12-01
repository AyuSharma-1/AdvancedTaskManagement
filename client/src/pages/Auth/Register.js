import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthStyles.css";
import AuthServices from "../../Services/AuthServices";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../Utils/ErrorMessage";
import Lottie from "lottie-react";
import registerAnimation from "../../assets/animation/Error 404 Page.json"; // use your animation file

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password, username };
      const res = await AuthServices.registerUser(data);

      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      {/* --- Lottie Animation --- */}
      <div className="login-animation">
        <Lottie animationData={registerAnimation} loop={true} />
      </div>

      {/* --- Register Card --- */}
      <div className="login-card">
        <div className="login-brand">
          <h1>Create Account</h1>
          <p>Join us and start managing your tasks efficiently</p>
        </div>

        <form onSubmit={registerHandler}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            REGISTER
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
