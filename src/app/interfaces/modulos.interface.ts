import { Meta } from './pagination';

export interface ModulosResponse {
  message: string;
  meta: Meta;
  modulos: Modulo[];
}

export interface Modulo {
  id: string;
  name: string;
  route: string;
  icon: string;
  Submodulos?: Modulo[];
  module_id?: string;
}

export interface CreateModule {
  name: string;
  route?: string;
  icon: string;
  submodules?: CreateSubmodule[];
}

export interface UpdateModule
  extends Pick<CreateModule, 'icon' | 'name' | 'route'> {}

export interface Submodulo {
  id: string;
  name: string;
  icon: string;
  route: string;
}

export interface CreateSubmodule {
  name: string;
  route: string;
  icon: string;
}

export interface CreateModuleResponse {
  message: string;
  modulo: Modulo;
}
export interface DeleteModuleResponse {
  message: string;
  modulo: Modulo;
}

export interface UpdateModuleResponse {
  message: string;
  modulo: Modulo;
}
