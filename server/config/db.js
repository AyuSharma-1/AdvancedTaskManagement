const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://ayushkumarsharma102_db_user:vxdojwvWqwC5f9Bx@cluster0.bljnaqi.mongodb.net/todo-mern')
    console.log(`Connected To Mongodb ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`Mongodb Error ${error}`);
  }
};

module.exports = connectDB;
