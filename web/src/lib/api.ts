import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // Sua API Node
  withCredentials: true, // <--- OBRIGATÓRIO: Envia/Recebe os Cookies
});