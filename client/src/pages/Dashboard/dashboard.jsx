import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Layout/Navbar";
import toast from "react-hot-toast";
import "./dashboard.css";
import CircularProgress from "../../components/CircularProgress"; // your circular progress component

// Stat card (inline inside main container)
const StatCard = ({ title, value, accent = "primary", sub }) => (
  <div className={`card shadow-sm border-${accent} mb-2`}>
    <div className="card-body p-2">
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">{title}</h6>
        <span className={`badge bg-${accent}`}>{value}</span>
      </div>
      {sub ? <small className="text-muted d-block mt-1">{sub}</small> : null}
    </div>
  </div>
);

// Calculate progress for individual tasks
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

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useMemo(() => {
    const userData = JSON.parse(localStorage.getItem("todoapp"));
    return userData?.token || "";
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/v1/todo/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) {
          toast.error(data.message || "Failed to load dashboard");
          return;
        }
        setSummary(data.summary);
        setTodayTasks(data.todayTasks || []);
        setOverdueTasks(data.overdueTasks || []);
        setUpcomingTasks(data.upcomingTasks || []);
      } catch (err) {
        console.error(err);
        toast.error("Unable to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  const allTasks = [...todayTasks, ...overdueTasks, ...upcomingTasks];

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0">Smart Overview</h3>
              {summary ? (
                <small className="text-muted">
                  {summary.totalCount} total • {summary.completedCount} done •{" "}
                  {summary.overdueCount} overdue
                </small>
              ) : null}
            </div>

            {loading ? (
              <p className="text-center text-muted">Loading dashboard…</p>
            ) : (
              <>
                {/* Stats row */}
                <div className="row g-3 mb-3">
                  <div className="col-6 col-md-3">
                    <StatCard
                      title="Today's tasks"
                      value={summary?.todayCount ?? 0}
                      accent="primary"
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <StatCard
                      title="Overdue"
                      value={summary?.overdueCount ?? 0}
                      accent="danger"
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <StatCard
                      title="Upcoming (7d)"
                      value={summary?.upcomingCount ?? 0}
                      accent="info"
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <StatCard
                      title="Productivity"
                      value={summary?.productivityScore ?? 0}
                      accent="success"
                      sub="Score based on completion vs overdue"
                    />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <h6 className="mb-1">Completion progress</h6>
                  <small className="text-muted">
                    {summary
                      ? `${summary.completedCount}/${summary.totalCount} tasks`
                      : ""}
                  </small>
                  <div className="progress mt-2" style={{ height: 16 }}>
                    <div
                      className="progress-bar progress-bar-striped bg-success"
                      role="progressbar"
                      style={{ width: `${summary?.progress ?? 0}%` }}
                      aria-valuenow={summary?.progress ?? 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {summary?.progress ?? 0}%
                    </div>
                  </div>
                </div>

                {/* List view of all tasks */}
                {allTasks.length ? (
                  <ul className="list-group list-group-flush">
                    {allTasks.map((task) => {
                      const progress = calculateProgress(
                        task.createdAt,
                        task.deadline
                      );
                      return (
                        <li
                          key={task._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{task.title}</strong>
                            <br />
                            <small className="text-muted">
                              {task.description || "No description"}
                            </small>
                            <br />
                            <small>
                              Status:{" "}
                              {task.isCompleted
                                ? "✅ Completed"
                                : "⏳ In Progress"}{" "}
                              | Deadline:{" "}
                              {task.deadline
                                ? new Date(task.deadline).toLocaleDateString()
                                : "Not set"}{" "}
                              | Priority: {task.priority || "Not set"}
                            </small>
                          </div>
                          <CircularProgress progress={progress} />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-muted">No tasks available</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
