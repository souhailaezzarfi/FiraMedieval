import api from "./api";
const categoriaService = {
  getAll: () => api.get("/categories"),
};
export default categoriaService;
