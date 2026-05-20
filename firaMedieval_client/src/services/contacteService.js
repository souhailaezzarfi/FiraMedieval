import api from "./api";

const contacteService = {
  enviar: (data) => api.post("/contacte", data),
};

export default contacteService;