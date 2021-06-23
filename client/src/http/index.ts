import axios from 'axios';
import { AuthResponce } from '../models/responce/AuthResponce';

export const API_URL = 'http://localhost:3030/api'; 

const api = axios.create({
  withCredentials: true, // add cookie to every query
  baseURL: API_URL
});

api.interceptors.request.use((config)=>{
  config.headers.Autorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

api.interceptors.response.use((config)=>{
  return config;
}, async (error)=>{
  const originalRequest = error.config;
  if(error.responce.staus === 401 && originalRequest && !originalRequest._isRetry){
    originalRequest._isRetry = true;
    try {
      const responce = await axios.get<AuthResponce>(`${API_URL}\refresh`, {withCredentials: true});
      localStorage.setItem('token', responce.data.accessToken);
      return api.request(originalRequest);
    } catch (error) {
      console.log(error)
    }
  }
  throw error;
});

export default api;

