import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const tasksApi = axios.create({
    //baseURL:'http://localhost:8000/tasks/api/v1/tasks/'
    baseURL: `${API_BASE}/tasks/api/v1/tasks/`
})

const statusTasksApi = axios.create({
    //baseURL:'http://localhost:8000/tasks/api/v1/status-task/'
    base : `${API_BASE}/tasks/api/v1/status-task/`
})


// Interceptores para agregar token JWT
const addAuthHeader = (config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

tasksApi.interceptors.request.use(addAuthHeader);
statusTasksApi.interceptors.request.use(addAuthHeader);
/*export const getAllTasks = () => {
    return tasksApi.get('/')
}

export const createTask = (task) =>{
    return tasksApi.post('/', task)
}*/
export const getAllTasks = () => tasksApi.get("/");
export const getTask = (id) => tasksApi.get(`/${id}/`);
export const createTask = (task) => tasksApi.post("/", task);
export const deleteTask = (id) => tasksApi.delete(`/${id}/`);
export const updateTask = (id, task) => tasksApi.put(`/${id}/`, task);

export const getStatusTask = () => statusTasksApi.get("/");

console.log("ejecuta---->");
console.log(getStatusTask);

// Login con JWT
export const login = (credentials) =>
  //axios.post("http://localhost:8000/tasks/token/", credentials);
  axios.post( `${API_BASE}/tasks/token/`, credentials);


// Opcional: refresh de token si lo implementas
export const refreshToken = (refresh) =>
  axios.post(`${API_BASE}/tasks/token/refresh/`, { refresh });