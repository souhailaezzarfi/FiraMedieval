import api from "./api";
const inscripcioService = {
  getAll: () => api.get("/inscripcions"),
  create: (data) => api.post("/inscripcions", data),
  delete: (id) => api.delete(`/inscripcions/${id}`),
};
export default inscripcioService;
