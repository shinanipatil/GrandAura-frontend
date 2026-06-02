import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Menu
export const menuAPI = {
  getCategories: () => api.get('/menu/categories'),
  getDishes: (params) => api.get('/menu/dishes', { params }),
  getDish: (id) => api.get(`/menu/dishes/${id}`),
};

// Orders
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMy: (params) => api.get('/orders/my', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Reservations
export const reservationAPI = {
  create: (data) => api.post('/reservations', data),
  getMy: (params) => api.get('/reservations/my', { params }),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  cancel: (id) => api.delete(`/reservations/${id}`),
};

// Services
export const serviceAPI = {
  getAll: (params) => api.get('/services', { params }),
  getBySlug: (slug) => api.get(`/services/${slug}`),
  getReviews: () => api.get('/reviews'),
  contact: (data) => api.post('/contact', data),
  eventBooking: (data) => api.post('/event-bookings', data),
};

// User
export const userAPI = {
  dashboard: () => api.get('/users/dashboard'),
  updateProfile: (data) => api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// Admin
export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  customers: (params) => api.get('/admin/customers', { params }),
  updateCustomerStatus: (id, status) => api.put(`/admin/customers/${id}/status`, { status }),
  customerActivity: (id) => api.get(`/admin/customers/${id}/activity`),
  dishes: (params) => api.get('/menu/admin/dishes', { params }),
  createDish: (data) => api.post('/menu/admin/dishes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateDish: (id, data) => api.put(`/menu/admin/dishes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteDish: (id) => api.delete(`/menu/admin/dishes/${id}`),
  categories: () => api.get('/menu/admin/categories'),
  createCategory: (data) => api.post('/menu/admin/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCategory: (id, data) => api.put(`/menu/admin/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCategory: (id) => api.delete(`/menu/admin/categories/${id}`),
  orders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  reservations: (params) => api.get('/reservations/admin', { params }),
  assignTable: (id, table_id) => api.put(`/reservations/admin/${id}/assign-table`, { table_id }),
  updateReservationStatus: (id, data) => api.put(`/reservations/admin/${id}/status`, data),
  tables: () => api.get('/reservations/admin/tables'),
  createTable: (data) => api.post('/reservations/admin/tables', data),
  updateTable: (id, data) => api.put(`/reservations/admin/tables/${id}`, data),
  deleteTable: (id) => api.delete(`/reservations/admin/tables/${id}`),
  eventBookings: (params) => api.get('/admin/event-bookings', { params }),
  updateEventBooking: (id, data) => api.put(`/admin/event-bookings/${id}`, data),
  contacts: (params) => api.get('/admin/contacts', { params }),
};
