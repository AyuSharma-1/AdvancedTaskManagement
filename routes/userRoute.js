const express = require("express");
const {
  registerController,
  changePassword,
  updateProfile,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Change Password
router.put("/change-password", authMiddleware, changePassword);

// Update Profile (username + profilePic)
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePic"),
  updateProfile
);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Reset Password
router.patch("/reset-password/:token", resetPasswordController);

module.exports = router;
