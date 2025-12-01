import React, { useEffect, useState } from "react";
import Navbar from "../../components/Layout/Navbar";
import TodoServices from "../../Services/TodoServices";
import Spinner from "../../components/Spinner";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "./analytics.css";

const Analytics = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    overdue: 0,
    productivity: 0,
  });
  const [tasks, setTasks] = useState([]);

  const userData = JSON.parse(localStorage.getItem("todoapp"));
  const id = userData?.user?.id;

  const getAnalyticsData = async () => {
    setLoading(true);
    try {
      const { data } = await TodoServices.getAllTodo(id);
      const fetchedTasks = data?.todos || [];
      setTasks(fetchedTasks);

      // summary calculations
      const completed = fetchedTasks.filter((t) => t.isCompleted).length;
      const overdue = fetchedTasks.filter(
        (t) => t.deadline && new Date(t.deadline) < new Date() && !t.isCompleted
      ).length;

      setSummary({
        total: fetchedTasks.length,
        completed,
        overdue,
        productivity: fetchedTasks.length
          ? Math.round((completed / fetchedTasks.length) * 100)
          : 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnalyticsData();
  }, []);

  // Chart data
  const lineData = {
    labels: tasks.map((t) => new Date(t.createdAt).toLocaleDateString("en-GB")),
    datasets: [
      {
        label: "Tasks Created",
        data: tasks.map(() => 1),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
      },
      {
        label: "Tasks Completed",
        data: tasks.map((t) => (t.isCompleted ? 1 : 0)),
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.2)",
      },
    ],
  };

  const barData = {
    labels: ["Completed", "Overdue"],
    datasets: [
      {
        label: "Task Status",
        data: [summary.completed, summary.overdue],
        backgroundColor: ["green", "red"],
      },
    ],
  };

  const pieData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          tasks.filter((t) => t.priority === "high").length,
          tasks.filter((t) => t.priority === "medium").length,
          tasks.filter((t) => t.priority === "low").length,
        ],
        backgroundColor: ["red", "orange", "blue"],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4">Analytics & Insights</h2>

        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h6>Total Tasks</h6>
                    <h4>{summary.total}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h6>Completed</h6>
                    <h4>{summary.completed}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h6>Overdue</h6>
                    <h4>{summary.overdue}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h6>Productivity</h6>
                    <h4>{summary.productivity}%</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card shadow-sm p-3">
                  <Line data={lineData} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="card shadow-sm p-3">
                  <Bar data={barData} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="card shadow-sm p-3">
                  <Pie data={pieData} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Analytics;
