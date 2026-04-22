import api from './api';

const activitatService = {
    getAll: () => api.get('/activitats'),
    
    getById: (id) => api.get(`/activitats/${id}`),
    
    create: (data) => api.post('/activitats', data),
    
    update: (id, data) => api.post(`/activitats/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    
    delete: (id) => api.delete(`/activitats/${id}`),
};

export default activitatService;