// Ek jagah axios setup, poore project me yahi use hoga
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;