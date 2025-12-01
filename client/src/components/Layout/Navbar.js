import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../Layout/navbar.css";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // logout function
  const logoutHandler = () => {
    localStorage.removeItem("todoapp");
    toast.success("Logout successfully");
    navigate("/login");
  };

  // get username
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("todoapp"));
    setUsername(userData?.user?.username || "");
  }, []);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm m-3">
      <div className="container-fluid">
        {/* Brand */}
        <NavLink to="/home" className="navbar-brand fw-bold text-white">
          <i className="fa-solid fa-user-tie me-2"></i>
          Welcome {username}!
        </NavLink>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-2">
            <li className="nav-item">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <i className="fa-solid fa-house me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/kanban"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <i class="fa-solid fa-grip"></i> Kanban
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <i className="fa-solid fa-chart-line me-1"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/todoList"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <i className="fa-solid fa-list-check me-1"></i> ToDo List
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <i className="fa-solid fa-user me-1"></i> Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-danger ms-2 rounded-circle"
                title="Logout"
                onClick={logoutHandler}
              >
                <i className="fa-solid fa-power-off"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;