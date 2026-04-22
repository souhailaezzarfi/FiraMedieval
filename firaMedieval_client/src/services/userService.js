import api from "./api";
const userService = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  getAll: () => api.get("/users"), // Solo para el Admin
};
export default userService;
