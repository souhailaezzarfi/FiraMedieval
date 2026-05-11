import api from "./api";

const activitatService = {
  getAll: () => api.get("/activitats"),

  getById: (id) => api.get(`/activitats/${id}`),

  create: (data) => api.post("/activitats", data),

  update: (id, data) => {
    data.append("_method", "PUT");

    return api.post(`/activitats/${id}`, data);
  },

  delete: (id) => api.delete(`/activitats/${id}`),
};

export default activitatService;
