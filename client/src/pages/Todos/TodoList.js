import React, { useEffect, useState } from "react";
import Navbar from "../../components/Layout/Navbar";
import TodoServices from "../../Services/TodoServices";
import Spinner from "../../components/Spinner";
import "./todoList.css";

const TodoList = () => {
  const [todoStatus, setTodosStatus] = useState("");
  const [filteredTask, setFilteredTask] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allTask, setAllTask] = useState([]);

  // get User todos
  const userData = JSON.parse(localStorage.getItem("todoapp"));
  const id = userData?.user?.id;

  const getUserTask = async () => {
    setLoading(true);
    try {
      const { data } = await TodoServices.getAllTodo(id);
      const tasks = data?.todos || [];
      setAllTask(tasks);
      setFilteredTask(tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTask();
  }, []);

  // filter tasks when status changes
  useEffect(() => {
    if (todoStatus === "incomplete") {
      setFilteredTask(allTask.filter((item) => !item?.isCompleted));
    } else if (todoStatus === "completed") {
      setFilteredTask(allTask.filter((item) => item?.isCompleted));
    } else {
      setFilteredTask(allTask);
    }
  }, [todoStatus, allTask]);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {/* Filter dropdown */}
        <div className="filter-container d-flex align-items-center mb-3">
          <h4 className="me-3">Filter Todos by</h4>
          <select
            className="form-select"
            style={{ maxWidth: "200px" }}
            onChange={(e) => setTodosStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="incomplete">Incomplete</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Task cards */}
        {loading ? (
          <Spinner />
        ) : (
          <div className="card-container">
            {filteredTask?.length === 0 ? (
              <h5 className="text-muted">No task found</h5>
            ) : (
              filteredTask.map((task) => (
                <div
                  className="card shadow-sm border-primary task-card"
                  key={task._id}
                >
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      {task?.title?.substring(0, 10) || "Untitled"}
                    </h6>
                    <span
                      className={`badge ${
                        task?.isCompleted ? "bg-success" : "bg-warning"
                      }`}
                    >
                      {task?.isCompleted ? "Completed" : "Incomplete"}
                    </span>
                  </div>
                  <div className="card-body">
                    <h6 style={{ fontWeight: "bold" }}>{task?.title}</h6>
                    <p className="card-text">
                      {task?.description || "No description"}
                    </p>
                    <small>
                      Created:{" "}
                      {task?.createdAt
                        ? task.createdAt.substring(0, 10)
                        : "Unknown"}{" "}
                      <br />
                      Deadline:{" "}
                      {task?.deadline
                        ? task.deadline.substring(0, 10)
                        : "Not set"}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TodoList;
