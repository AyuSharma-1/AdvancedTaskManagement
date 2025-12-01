import React, { useEffect, useState } from "react";
import Navbar from "../../components/Layout/Navbar";
import PopModal from "../../components/PopModal";
import TodoServices from "../../Services/TodoServices";
import Card from "../../components/Card/Card";
import Spinner from "../../components/Spinner";
import "./homePage.css";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [allTask, setAllTask] = useState([]);
  const [filteredTask, setFilteredTask] = useState([]);

  // open modal
  const openModalHandler = () => setShowModal(true);

  // search tasks
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredTask(allTask);
      return;
    }

    const filtered = allTask.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
    setFilteredTask(filtered);
  };

  // get user todos
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
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserTask();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="add-task d-flex justify-content-between align-items-center my-4">
          <div>
            <h1>Your Tasks!</h1>
            <input
              type="search"
              className="form-control mt-2"
              placeholder="Search your task"
              value={searchQuery}
              onChange={handleSearch}
              style={{ maxWidth: "300px" }}
            />
          </div>
          <button className="btn btn-primary" onClick={openModalHandler}>
            Create Task <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <Card allTask={filteredTask} getUserTask={getUserTask} />
        )}

        {/* ========== modal =========== */}
        <PopModal
          getUserTask={getUserTask}
          showModal={showModal}
          setShowModal={setShowModal}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          deadline={deadline}
          setDeadline={setDeadline}
        />
      </div>
    </>
  );
};

export default HomePage;
