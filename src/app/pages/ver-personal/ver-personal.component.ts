import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from '../../components/shared/modal/modal.component';
import { BuscadorComponent } from '../../components/shared/buscador/buscador.component';
import { SpinnerComponent } from '../../components/shared/spinner/spinner.component';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import { CommonModule } from '@angular/common';
import { Personal } from '../../interfaces/personal.interface';
import { SwitchBoxComponent } from '../../components/shared/switch-box/switch-box.component';
import { Meta } from '../../interfaces/pagination';
import { PaginacionComponent } from '../../components/shared/paginacion/paginacion.component';
import { PersonalService } from '../../services/personal.service';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { StorageService } from '../../services/storage.service';
import { firstValueFrom } from 'rxjs';
import { ActualizarPersonalComponent } from '../../components/formularios/actualizar-personal/actualizar-personal.component';
import { OpenCustomModalComponent } from '../../components/shared/open-custom-modal/open-custom-modal.component';
import RegistroPersonalComponent from '../registro-personal/registro-personal.component';
import { PermisoModulo } from '../../interfaces/permission.interface';
import { ModuloActualService } from '../../services/modulo-actual.service';

@Component({
  selector: 'app-ver-personal',
  imports: [
    ModalComponent,
    BuscadorComponent,
    SpinnerComponent,
    ExitoComponent,
    CommonModule,
    SwitchBoxComponent,
    PaginacionComponent,
    ActualizarPersonalComponent,
    OpenCustomModalComponent,
    RegistroPersonalComponent,
  ],
  templateUrl: './ver-personal.component.html',
  styleUrl: './ver-personal.component.css',
})
export default class VerPersonalComponent {
  personal = signal<Personal[]>([]);
  metaData = signal<Meta>({
    totalPages: 0,
    actualPage: 0,
    totalCount: 0,
  });
  mostrarFormularioEmergente = signal<boolean>(false);
  msgExito = signal<string>('');
  personalparaActualizar = signal<Personal | null>(null);
  personalParaEliminar = signal<Personal | null>(null);
  permiso = signal<PermisoModulo>({
    delete: false,
    edit: false,
    id: '',
    read: false,
    write: false,
  });

  /**
   * inyeccion de servicios
   */
  private ErrorServidor = inject(ErrorServidorService);
  private personalService = inject(PersonalService);
  private selectedModuleService = inject(ModuloActualService);

  /**
   * metodo que se ejecuta al iniciar el componente el cual obtiene todos los registros de los usuarios activos y verifica el rol del personal logueado
   */
  ngOnInit(): void {
    this.obtenerPersonal();
    this.permisos();
  }

  permisos() {
    const permiso = this.selectedModuleService.permisosDelModuloSeleccionado();

    this.permiso.set({
      delete: permiso.delete,
      edit: permiso.edit,
      id: permiso.module_id,
      read: permiso.read,
      write: permiso.write,
    });
  }

  /**
   * metodo que obtiene todos los registros de los usuarios activos
   */
  async obtenerPersonal() {
    try {
      const response = await firstValueFrom(
        this.personalService.getAllPersonal()
      );

      this.personal.set(response.personal);
      this.metaData.set(response.meta);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
  /**
   * metodo que guarda la referencia del usuario que se desea eliminar
   */
  referenciaUsuarioEliminar(personal: Personal) {
    this.personalParaEliminar.set(personal);
    // this.usuarioActual = usuario;
  }

  /**
   * metodo que elimina el registro del usuario
   */
  async eliminarUsuario() {
    try {
      const response = await firstValueFrom(
        this.personalService.deletePersonal(this.personalParaEliminar()?.id!)
      );
      this.msgExito.set(response.message);
      this.personalParaEliminar.set(null);
      this.obtenerPersonal();
      setTimeout(() => {
        this.msgExito.set('');
      }, 1500);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }

  async eliminacionDefinitiva() {
    try {
      const response = await firstValueFrom(
        this.personalService.removeUser(this.personalParaEliminar()?.id!)
      );
      this.msgExito.set(response.message);
      this.personalParaEliminar.set(null);
      this.obtenerPersonal();
      setTimeout(() => {
        this.msgExito.set('');
      }, 1500);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }

  /**
   *  metodo que muestra el formulario emergente para actualizar el usuario y  guarda la referencia del usuario que se desea actualizar
   */
  actualizarUsuario(usuario: Personal) {
    this.mostrarFormularioEmergente.set(true);
    this.personalparaActualizar.set(usuario);
  }

  refetchPersonal(msg: string, page?: number) {
    this.msgExito.set(msg);
    if (page) {
      this.personalService.page = page;
    }

    this.obtenerPersonal();

    setTimeout(() => {
      this.msgExito.set('');
    }, 1500);
  }

  async activarUsuario(id: any) {
    try {
      const response = await firstValueFrom(
        this.personalService.activateUser(id)
      );
      this.msgExito.set(response.message);
      this.obtenerPersonal();

      setTimeout(() => {
        this.msgExito.set('');
      }, 1500);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }

  search(search: string) {
    console.log(search, 'BUSQUEDA');
    this.personalService.search = search;
  }

  async generateQRForLogin(id: string) {
    try {
      const response = await firstValueFrom(
        this.personalService.generateQrForLogin(id)
      );
      // response.message
      this.msgExito.set(response.message);
      setTimeout(() => {
        this.msgExito.set('');
      }, 1500);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
}
