import { inject, Injectable, signal } from '@angular/core';
import { Modulo } from '../interfaces/modulos.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ModuloActualService {
  private storageService = inject(StorageService);
  private moduloSeleccionado = signal<string>(
    this.storageService.obtenerDeLocalStorage('modulo_actual') ?? ''
  );

  moduloActual(id: string) {
    this.moduloSeleccionado.set(id);
  }

  permisosDelModuloSeleccionado() {
    const permisos = this.storageService.consultarPermisosMenu();
    this.storageService.guardarSesionStorage(
      'modulo_actual',
      this.moduloSeleccionado()
    );

    return permisos.find(
      (permiso: any) => permiso.module_id === this.moduloSeleccionado()
    );
  }
}
