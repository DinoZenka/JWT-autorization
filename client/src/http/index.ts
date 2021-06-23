import axios from 'axios';
import { AuthResponse } from '../models/responce/AuthResponse';

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
  console.log('--------------RETURN CONFIG------------------')
  return config;
},  ( async (error)=>{
  console.log('--------------ERROR --------------------')
  console.log(error);

  const originalRequest = error.config;
  if(error.response.status == 401 && originalRequest && !originalRequest._isRetry){
    originalRequest._isRetry = true;
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
      localStorage.setItem('token', response.data.accessToken);
      return api.request(originalRequest);
    } catch (error) {
      console.log(error)
    }
  }
  throw error;
}));

export default api;

