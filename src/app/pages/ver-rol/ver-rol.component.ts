import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { ModalComponent } from '../../components/shared/modal/modal.component';
import { ActualizarUsuarioComponent } from '../../components/formularios/actualizar-usuario/actualizar-usuario.component';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import { SpinnerComponent } from '../../components/shared/spinner/spinner.component';
import { BuscadorComponent } from '../../components/shared/buscador/buscador.component';
import { SwitchBoxComponent } from '../../components/shared/switch-box/switch-box.component';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { firstValueFrom } from 'rxjs';
import { Meta } from '../../interfaces/pagination';
import { StorageService } from '../../services/storage.service';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../interfaces/rol.interface';
import { CommonModule } from '@angular/common';
import { ActualizarRolComponent } from '../../components/formularios/actualizar-rol/actualizar-rol.component';
import RegistroRolComponent from '../registro-rol/registro-rol.component';
import { OpenCustomModalComponent } from '../../components/shared/open-custom-modal/open-custom-modal.component';
import { RouterModule } from '@angular/router';
import { PermisoModulo } from '../../interfaces/permission.interface';
import { ModuloActualService } from '../../services/modulo-actual.service';

@Component({
  selector: 'app-ver-rol',
  imports: [
    ModalComponent,
    ExitoComponent,
    SpinnerComponent,
    BuscadorComponent,
    SwitchBoxComponent,
    CommonModule,
    ActualizarRolComponent,
    RegistroRolComponent,
    OpenCustomModalComponent,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ver-rol.component.html',
  styleUrl: './ver-rol.component.css',
})
export default class VerRolComponent {
  roles = signal<Rol[]>([]);
  metaData = signal<Meta>({
    totalPages: 0,
    actualPage: 0,
    totalCount: 0,
  });
  mostrarFormularioEmergente = signal<boolean>(false);
  msgExito = signal<string>('');
  permiso = signal<PermisoModulo>({
    delete: false,
    edit: false,
    id: '',
    read: false,
    write: false,
  });

  rolparaActualizar = signal<Rol | null>(null);
  rolparaEliminar = signal<Rol | null>(null);

  /**
   * inyeccion de servicios
   */
  private StorageService = inject(StorageService);
  private ErrorServidor = inject(ErrorServidorService);
  private rolService = inject(RolService);
  private selectedModuleService = inject(ModuloActualService);

  /**
   * metodo que se ejecuta al iniciar el componente el cual obtiene todos los registros de los usuarios activos y verifica el rol del personal logueado
   */
  ngOnInit(): void {
    this.restriccionPorRol();
    this.obtenerRoles();
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
  async obtenerRoles() {
    try {
      const response = await firstValueFrom(this.rolService.getAllRoles());

      this.roles.set(response.roles);
      this.metaData.set(response.meta);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
  /**
   * metodo que guarda la referencia del usuario que se desea eliminar
   */
  referenciaRolEliminar(user: Rol) {
    this.rolparaEliminar.set(user);
    // this.usuarioActual = usuario;
  }

  /**
   * metodo que elimina el registro del usuario
   */
  async eliminarRol() {
    try {
      const response = await firstValueFrom(
        this.rolService.deleteRol(this.rolparaEliminar()?.id!)
      );
      this.msgExito.set(response.message);
      this.rolparaEliminar.set(null);
      this.obtenerRoles();
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
        this.rolService.removeRol(this.rolparaEliminar()?.id!)
      );
      this.msgExito.set(response.message);
      this.rolparaEliminar.set(null);
      this.obtenerRoles();
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
  actualizarUsuario(rol: Rol) {
    this.mostrarFormularioEmergente.set(true);
    this.rolparaActualizar.set(rol);
  }

  refetchRoles(msg: string, page?: any) {
    this.msgExito.set(msg);
    if (page) {
      this.rolService.page = page;
    }

    this.obtenerRoles();

    setTimeout(() => {
      this.msgExito.set('');
    }, 1500);
  }

  async activarUsuario(id: any) {
    try {
      const response = await firstValueFrom(this.rolService.activate(id));
      this.msgExito.set(response.message);
      this.obtenerRoles();

      setTimeout(() => {
        this.msgExito.set('');
      }, 1500);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }

  /**
   * metodo que verifica la el rol del personal logueado para restringir el acceso a ciertas acciones
   */
  restriccionPorRol() {
    const rol = this.StorageService.desencriptar('rol');

    return rol == 'root' ? true : false;
  }

  search(search: string) {
    this.rolService.search = search;
  }
}
