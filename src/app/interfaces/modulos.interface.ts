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
