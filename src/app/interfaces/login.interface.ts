import { Personal } from './personal.interface';

export interface PersonalLogin {
  email: string;
  password: string;
}
export interface LoginResponse {
  message: string;
  token: string;
  personal: Personal;
}
