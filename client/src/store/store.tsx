import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import { AuthResponce } from "../models/responce/AuthResponce";
import { IUSer } from "../models/User";
import AuthService from "../services/AuthService";


export default class Store {
  user = {} as IUSer;
  isAuth = false;
  isLoading = false;

  constructor(){
    makeAutoObservable(this);
  }

  setAuth(bool: boolean){
    this.isAuth = bool;
  }

  setUser(user:IUSer){
    this.user = user;
  }

  setLoading(bool:boolean){
    this.isLoading = bool;
  }

  async login(email:string, password: string){
    try {
      const responce = await AuthService.login(email, password);
      
      localStorage.setItem('token', responce.data.accessToken);
      this.setAuth(true);
      this.setUser(responce.data.user);
    } catch (error) {
        console.log(error.responce?.data?.message);
    }
  }

  async register(email:string, password: string){
    try {
      const responce = await AuthService.register(email, password);
      localStorage.setItem('token', responce.data.accessToken);
      this.setAuth(true);
      this.setUser(responce.data.user);
       
    } catch (error) {
        console.log(error.responce?.data?.message);
    }
  }

  async logout(){
    try {
      const responce = await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUSer);
       
    } catch (error) {
        console.log(error.responce?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const responce = await axios.get<AuthResponce>(`${API_URL}/refresh`, {withCredentials: true});
      localStorage.setItem('token', responce.data.accessToken);
      this.setAuth(true);
      this.setUser(responce.data.user);
    } catch (error) {
      console.log(error.responce?.data?.message);
      
    } finally{
      this.setLoading(false);
    }
  }

}