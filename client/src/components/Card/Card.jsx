import React, { useState } from "react";
import EditTodo from "../EditTodo";
import toast from "react-hot-toast";
import TodoServices from "../../Services/TodoServices";
import "./card.css"; 

const Card = ({ allTask, getUserTask }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // handle edit
  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  // handle delete
  const handleDelete = async (id) => {
    try {
      await TodoServices.deleteTodo(id);
      toast.success("Task Deleted Successfully");
      getUserTask();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  // calculate progress
  const calculateProgress = (createdAt, deadline) => {
    if (!deadline || new Date(deadline) < new Date(createdAt)) return 0;
    const start = new Date(createdAt);
    const end = new Date(deadline);
    const now = new Date();
    if (now >= end) return 100;
    const total = end - start;
    const elapsed = now - start;
    return Math.min((elapsed / total) * 100, 100);
  };

  return (
    <>
      <div className="card-container">
        {allTask?.map((task) => {
          const progress = calculateProgress(task.createdAt, task.deadline);

          return (
            <div className="card shadow-sm border-primary task-card" key={task._id}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{task?.title.substring(0, 10)}</h6>
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
                <p className="card-text">{task?.description || "No description"}</p>
                <small>
                  Created: {task?.createdAt?.substring(0, 10) || "Unknown"} <br />
                  Deadline: {task?.deadline ? task.deadline.substring(0, 10) : "Not set"}
                </small>

                {/* Progress bar */}
                {task?.deadline && (
                  <div className="progress mt-3" style={{ height: "10px" }}>
                    <div
                      className={`progress-bar ${
                        progress < 50
                          ? "bg-success"
                          : progress < 90
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                      role="progressbar"
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                    </div>
                  </div>
                )}
              </div>

              <div className="card-footer d-flex justify-content-end">
                <button
                  className="btn btn-warning btn-sm"
                  title="Edit Task"
                  onClick={() => handleEdit(task)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  title="Delete Task"
                  onClick={() => handleDelete(task?._id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render modal once, with selectedTask */}
      {showModal && selectedTask && (
        <EditTodo
          task={selectedTask}
          setShowModal={setShowModal}
          getUserTask={getUserTask}
        />
      )}
    </>
  );
};

export default Card;