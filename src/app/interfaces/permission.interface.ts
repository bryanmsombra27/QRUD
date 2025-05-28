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
}
