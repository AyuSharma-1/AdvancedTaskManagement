import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import heroAnimation from "../../assets/animation/Man writing.json";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-container">
      {/* === Left Side Text === */}
      <div className="landing-text">
        <h1 className="landing-title">
          Organize your <span>work</span> and your <span>life</span>.
        </h1>

        <p className="landing-subtitle">
          Turn your thoughts into organized tasks. Manage your day with smart
          productivity tools.
        </p>

        <div className="landing-buttons">
          <Link to="/register" className="btn primary-btn">
            Get Started
          </Link>

          <Link to="/login" className="btn secondary-btn">
            Login
          </Link>
        </div>
      </div>

      {/* === Right Side Lottie Animation === */}
      <div className="landing-animation">
        <Lottie animationData={heroAnimation} loop={true} />
      </div>
    </div>
  );
};

export default Landing;
