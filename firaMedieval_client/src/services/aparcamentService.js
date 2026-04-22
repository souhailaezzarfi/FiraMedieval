import api from "./api";
const aparcamentService = {
  getAll: () => api.get("/aparcaments"),
  create: (data) => api.post("/aparcaments", data),
  update: (id, data) => api.put(`/aparcaments/${id}`, data),
  delete: (id) => api.delete(`/aparcaments/${id}`),
};
export default aparcamentService;
