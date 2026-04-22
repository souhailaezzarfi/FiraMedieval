import api from "./api";
const authService = {
  login: (credentials) => api.post("/login", credentials),
  register: (data) => api.post("/register", data),
  logout: () => api.post("/logout"),
};
export default authService;
