import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // <-- Base da sua API no backend
});

export default api;
