import { AxiosResponse } from "axios";
import api from "../http";
import { IUSer } from "../models/User";

export default class UserSeevice{
  static getAllUsers():Promise<AxiosResponse<IUSer[]>>{
    return api.get<IUSer[]>('/users');
  }

}