import React, { useEffect, useState } from "react";
import Navbar from "../../components/Layout/Navbar";
import toast from "react-hot-toast";
import "./kanban.css";
import TodoServices from "../../Services/TodoServices";

const statuses = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "blocked", label: "Blocked" },
];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("todoapp"));
  const id = userData?.user?.id;
  const token = userData?.token;

  // Fetch tasks
  const getUserTask = async () => {
    setLoading(true);
    try {
      const { data } = await TodoServices.getAllTodo(id);
      const fetchedTasks = data?.todos || [];
      setTasks(fetchedTasks);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTask();
  }, []);

  // Update task status
  const handleDrop = async (taskId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/todo/status/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
        toast.success(`Task moved to ${newStatus}`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  // Drag handlers
  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const onDrop = (e, statusKey) => {
    const taskId = e.dataTransfer.getData("taskId");
    handleDrop(taskId, statusKey);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-center">🗂 Kanban Board</h2>
        {loading ? (
          <p className="text-center">Loading tasks...</p>
        ) : (
          <div className="kanban-board d-flex gap-3">
            {statuses.map(({ key, label }) => (
              <div
                key={key}
                className="kanban-column flex-fill"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, key)}
              >
                <div className="kanban-header">{label}</div>
                <div className="kanban-tasks">
                  {tasks
                    .filter((t) => t.status === key)
                    .map((task) => (
                      <div
                        key={task._id}
                        className="kanban-task card p-2 mb-2 shadow-sm"
                        draggable
                        onDragStart={(e) => onDragStart(e, task._id)}
                      >
                        <strong>{task.title}</strong>
                        <small className="text-muted d-block">
                          {task.deadline
                            ? `Due: ${new Date(
                                task.deadline
                              ).toLocaleDateString()}`
                            : "No deadline"}
                        </small>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default KanbanBoard;
