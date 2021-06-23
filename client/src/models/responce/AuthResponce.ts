import { IUSer } from "../User";

export interface AuthResponce{
  accessToken:string;
  refreshToken:string;
  user: IUSer;
}