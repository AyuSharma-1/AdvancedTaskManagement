import axios from "axios";

// Load user fresh every time
const getUser = () => JSON.parse(localStorage.getItem("todoapp"));

// Attach token dynamically
axios.interceptors.request.use((config) => {
  const userData = getUser();
  if (userData?.token) {
    config.headers.Authorization = `Bearer ${userData.token}`;
  }
  return config;
});

// CREATE TODO
const createTodo = (data) => {
  return axios.post("/api/v1/todo/create", data);
};

// GET ALL TODO
const getAllTodo = (id) => {
  if (!id) {
    throw new Error("User ID is required to fetch todos");
  }
  return axios.get(`/api/v1/todo/getAll/${id}`);
};

// UPDATE TODO
const updateTodo = (id, data) => {
  return axios.patch(`/api/v1/todo/update/${id}`, data);
};

// DELETE TODO
const deleteTodo = (id) => {
  return axios.delete(`/api/v1/todo/delete/${id}`);
};

const TodoServices = { createTodo, getAllTodo, updateTodo, deleteTodo };
export default TodoServices;
