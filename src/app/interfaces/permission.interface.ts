export interface PermisionAsignation {
  id: string;
  edit: boolean;
  delete: boolean;
  write: boolean;
  submodules?: {
    id: string;
    edit: boolean;
    delete: boolean;
    write: boolean;
  }[];
}

export interface PermissionAsssignationByRolResponse {
  message: string;
  permisos: Permisos_modulos[];
}

export interface Permisos_modulos {
  id: string;
  read: boolean;
  edit: boolean;
  write: boolean;
  delete: boolean;
  role_id: string;
  module_id: string;
  Permisos_submodulos: Permisos_submodulos[];
}

interface Permisos_submodulos {
  id: string;

  read: boolean;
  edit: boolean;
  write: boolean;
  delete: boolean;
  module_permission_id: string;
  submodule_id: string;
}

export interface PermisoModulo
  extends Pick<Permisos_modulos, 'id' | 'read' | 'edit' | 'write' | 'delete'> {}

export type ModuleType = 'edit' | 'delete' | 'write' | 'read';
