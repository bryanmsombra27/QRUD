import { Meta } from './pagination';

export interface RegistroUsuario {
  email: string;
  direccion: string;
  nombre: string;
  rfc: string;
  telefono: string;
}
export interface User {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  isActive: boolean;
  rfc: string;
  direccion: string;
  qr: boolean;
  linkqr: string | null;
}

export interface UserResponse {
  message: string;
  usuario: User;
}

export interface GetAllUsersResponse {
  message: string;
  usuarios: User[];
  meta: Meta;
}

export interface DeleteUserResponse {
  message: string;
  usuario: User;
}

export interface UpdateUserResponse extends Partial<DeleteUserResponse> {}
