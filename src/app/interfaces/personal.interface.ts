import { Meta } from './pagination';
import { RolRelation } from './rol.interface';

export interface Personal {
  nombre: string;
  telefono: string;
  email: string;
  isActive: boolean;
  qr: boolean;
  id: string;
  rol: RolRelation;
}

export interface RegistroPersonal {
  nombre: string;
  telefono: string;
  email: string;
  password: string;
  rolId: string;
}

export interface GetAllPersonal {
  message: string;
  personal: Personal[];
  meta: Meta;
}
export interface createPersonalResponse {
  message: string;
  personal: Personal;
}

export interface ActualizarRegistroPersonal
  extends Pick<RegistroPersonal, 'nombre' | 'telefono' | 'rolId'> {}

export interface DeletePersonalResponse {
  message: string;
  personal: Personal;
}
export interface UpdatePassword {
  last_password: string;
  new_password: string;
  new_password_confirmation: string;
}
