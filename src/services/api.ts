import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Book service
export const bookService = {
  getBooks: async (query: string = '') => {
    const response = await api.get(`/books?${query}`);
    return response.data;
  },

  getBook: async (id: number) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  getGenres: async () => {
    const response = await api.get('/books/meta/genres');
    return response.data;
  },

  getAuthors: async () => {
    const response = await api.get('/books/meta/authors');
    return response.data;
  },

  createBook: async (bookData: any) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (id: number, bookData: any) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: number) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

export default api;