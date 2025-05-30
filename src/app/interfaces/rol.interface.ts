import { Meta } from './pagination';

export interface RolRelation {
  id: string;
  name: string;
  Permisos_modulos: ModulePermission[];
}

interface ModulePermission {
  id: string;
  name: string;
  route: string;
  icon: string;
}

export interface RegistroRol {
  name: string;
  description: string;
}
export interface Rol {
  name: string;
  id: string;
  isActive: boolean;
  description: string;
}

export interface GetAllRoles {
  message: string;
  roles: Rol[];
  meta: Meta;
}

export interface CreateRolResponse {
  message: string;
  rol: Rol;
}

export interface CommonResponse {
  message: string;
}

export interface ActualizarRol extends Pick<Rol, 'description' | 'name'> {}
