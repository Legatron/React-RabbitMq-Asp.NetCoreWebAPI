import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7165'
});

export default api;