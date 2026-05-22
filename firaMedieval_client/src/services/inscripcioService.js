import api from "./api";
const inscripcioService = {
  getAll: (params = {}) => api.get("/inscripcions", { params }),
  create: (data) => api.post("/inscripcions", data),
  delete: (id) => api.delete(`/inscripcions/${id}`),
};
export default inscripcioService;
