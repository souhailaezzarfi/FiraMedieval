import api from "./api";

const programaService = {
  getPdf: () => api.get("/programa-pdf"),
  uploadPdf: (file) => {
    const fd = new FormData();
    fd.append("pdf", file);
    return api.post("/programa-pdf", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default programaService;