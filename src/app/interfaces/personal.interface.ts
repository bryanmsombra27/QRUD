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
