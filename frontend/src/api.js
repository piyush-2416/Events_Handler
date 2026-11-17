// // Ek jagah axios setup, poore project me yahi use hoga
// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// export default api;// Ek jagah axios setup, poore project me yahi use hoga
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Login ke baad jo token localStorage me hai, wo har request ke saath jaye.
// (Bookings jaise protected routes ko iski zarurat hai.)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
