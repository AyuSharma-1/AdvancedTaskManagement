const mongoose = require("mongoose");

//schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    tokenVersion: { 
      type: Number, 
      default: 0 },
    description:{
      type:String,
      default:"",
    },
    profilePic:{
      type:String,
      default:"",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
