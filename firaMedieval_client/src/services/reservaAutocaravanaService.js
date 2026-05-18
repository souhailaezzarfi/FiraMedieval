import api from "./api";
const reservaService = {
  getAll: () => api.get("/reserves"),
  create: (data) => api.post("/reserves", data),
  update: (id, data) => api.put(`/reserves/${id}`, data),
  update: (id, data) => api.put(`/reserves/${id}`, data),
  delete: (id) => api.delete(`/reserves/${id}`),
};
export default reservaService;
