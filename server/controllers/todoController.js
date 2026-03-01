const todoModel = require("../models/todoModel");
const Todo = require("../models/todoModel");

// CREATE TODO
const createTodoController = async (req, res) => {
  try {
    const { title, description, createdBy, deadline } = req.body;
    if (!title || !description || !deadline) {
      return res.status(400).send({
        success: false,
        message: "Please provide title, description, and deadline",
      });
    }

    // ensure deadline is not before today
    if (new Date(deadline) < new Date()) {
      return res.status(400).send({
        success: false,
        message: "Deadline cannot be in the past",
      });
    }

    const todo = new todoModel({ title, description, createdBy, deadline });
    const result = await todo.save();

    res.status(201).send({
      success: true,
      message: "Your task has been created",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in create todo API",
      error: error.message,
    });
  }
};

// GET TODO
const getTodoController = async (req, res) => {
  try {
    //get user
    const { userId } = req.params;
    //validate
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "Please provide a valid user ID",
      });
    }

    const todos = await todoModel
      .find({ createdBy: userId })
      .sort({ deadline: 1 });

    if (!todos || todos.length === 0) {
      return res.status(200).send({
        success: true,
        message: "You have no todos",
        todos: [],
      });
    }

    res.status(200).send({
      success: true,
      message: "Your todos",
      todos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in get todo API",
      error: error.message,
    });
  }
};

// DELETE TODO
const deleteTodoController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Please provide todo ID",
      });
    }

    const todo = await todoModel.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).send({
        success: false,
        message: "No task found with this ID",
      });
    }

    res.status(200).send({
      success: true,
      message: "Your task has been deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in delete todo API",
      error: error.message,
    });
  }
};

// UPDATE TODO
const updateTodoController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Please provide todo ID",
      });
    }

    const data = req.body;

    // validate deadline
    if (data.deadline && new Date(data.deadline) < new Date()) {
      return res.status(400).send({
        success: false,
        message: "Deadline cannot be in the past",
      });
    }

    const todo = await todoModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!todo) {
      return res.status(404).send({
        success: false,
        message: "No task found with this ID",
      });
    }

    res.status(200).send({
      success: true,
      message: "Your task has been updated",
      todo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in update todo API",
      error: error.message,
    });
  }
};

// controllers/todoController.js
const getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID missing" });
    }

    const allTasks = await todoModel.find({ createdBy: userId });
    const now = new Date();
    const todayStr = now.toISOString().substring(0, 10);

    const summary = {
      totalCount: allTasks.length,
      completedCount: allTasks.filter((t) => t.isCompleted).length,
      overdueCount: allTasks.filter(
        (t) => t.deadline && new Date(t.deadline) < now && !t.isCompleted
      ).length,
      todayCount: allTasks.filter(
        (t) =>
          t.deadline &&
          new Date(t.deadline).toISOString().substring(0, 10) === todayStr &&
          !t.isCompleted
      ).length,
      upcomingCount: allTasks.filter(
        (t) =>
          t.deadline &&
          new Date(t.deadline) > now &&
          new Date(t.deadline) - now <= 7 * 24 * 60 * 60 * 1000
      ).length,
      productivityScore: Math.round(
        (allTasks.filter((t) => t.isCompleted).length /
          (allTasks.length || 1)) *
          100
      ),
      progress: Math.round(
        (allTasks.filter((t) => t.isCompleted).length /
          (allTasks.length || 1)) *
          100
      ),
    };

    const todayTasks = allTasks.filter(
      (t) =>
        t.deadline &&
        new Date(t.deadline).toISOString().substring(0, 10) === todayStr &&
        !t.isCompleted
    );

    const overdueTasks = allTasks.filter(
      (t) => t.deadline && new Date(t.deadline) < now && !t.isCompleted
    );

    const upcomingTasks = allTasks.filter(
      (t) =>
        t.deadline &&
        new Date(t.deadline) > now &&
        new Date(t.deadline) - now <= 7 * 24 * 60 * 60 * 1000
    );

    res.json({
      success: true,
      summary,
      todayTasks,
      overdueTasks,
      upcomingTasks,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ success: false, message: "Dashboard error" });
  }
};

// Update task status
const updateTaskStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Todo.findByIdAndUpdate(id, { status }, { new: true });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task status updated", task });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  createTodoController,
  getTodoController,
  deleteTodoController,
  updateTodoController,
  updateTaskStatusController,
};
