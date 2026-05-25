import api from "./api";
const aparcamentService = {
  getAll: () => api.get("/aparcaments"),
  getActiu: () => api.get("/aparcament-actiu"), 
  create: (data) => api.post("/aparcaments", data),
  update: (id, data) => api.put(`/aparcaments/${id}`, data),
  delete: (id) => api.delete(`/aparcaments/${id}`),
};
export default aparcamentService;
