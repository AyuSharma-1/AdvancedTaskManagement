const express = require("express");
const {
  createTodoController,
  getTodoController,
  deleteTodoController,
  updateTodoController,
  getDashboard,
  updateTaskStatusController,
} = require("../controllers/todoController");

const auth = require("../middlewares/authMiddleware");

const router = express.Router();

// CREATE TODO
router.post("/create", auth, createTodoController);

// GET TODO
router.get("/getAll/:userId", auth, getTodoController);

// DELETE TODO
router.delete("/delete/:id", auth, deleteTodoController);

// UPDATE TODO
router.patch("/update/:id", auth, updateTodoController);

//fetching the dashborad data
router.get("/dashboard", auth, getDashboard);

//Kanban 
router.patch("/status/:id", auth, updateTaskStatusController);


module.exports = router;
