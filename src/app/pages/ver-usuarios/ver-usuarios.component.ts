import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import {
  CustomError,
  ErrorServidorService,
} from '../../services/errorServidor.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ErroresBackendComponent } from '../../components/shared/errores-backend/errores-backend.component';
import { ExitoComponent } from '../../components/shared/exito/exito.component';
import { User } from '../../interfaces/usuario.interface';
import { firstValueFrom } from 'rxjs';
import { BuscadorComponent } from '../../components/shared/buscador/buscador.component';
import { SpinnerComponent } from '../../components/shared/spinner/spinner.component';
import { PaginacionComponent } from '../../components/shared/paginacion/paginacion.component';
import { ModalComponent } from '../../components/shared/modal/modal.component';
import { ActualizarUsuarioComponent } from '../../components/formularios/actualizar-usuario/actualizar-usuario.component';
import { Meta } from '../../interfaces/pagination';
import { SwitchBoxComponent } from '../../components/shared/switch-box/switch-box.component';

@Component({
  selector: 'app-ver-usuarios',
  imports: [
    CommonModule,
    ExitoComponent,
    BuscadorComponent,
    SpinnerComponent,
    PaginacionComponent,
    ModalComponent,
    ActualizarUsuarioComponent,
    SwitchBoxComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ver-usuarios.component.html',
  styleUrl: './ver-usuarios.component.css',
})
export default class VerUsuariosComponent {
  usuarios = signal<User[]>([]);
  metaData = signal<Meta>({
    totalPages: 0,
    actualPage: 0,
    totalCount: 0,
  });
  mostrarFormularioEmergente = signal<boolean>(false);
  msgExito = signal<string>('');
  usuarioparaActualizar = signal<User | null>(null);
  usuarioparaEliminar = signal<User | null>(null);

  /**
   * propiedad que restringe el acceso a ciertas acciones que esten delimitadas por el rol del personal logueado
   */
  accesoDenegado: boolean = true;

  /**
   * inyeccion de servicios
   */
  private StorageService = inject(StorageService);
  private ErrorServidor = inject(ErrorServidorService);
  private UsuarioService = inject(UsuarioService);

  /**
   * metodo que se ejecuta al iniciar el componente el cual obtiene todos los registros de los usuarios activos y verifica el rol del personal logueado
   */
  ngOnInit(): void {
    this.restriccionPorRol();
    this.obtenerUsuarios();
  }

  /**
   * metodo que obtiene todos los registros de los usuarios activos
   */
  async obtenerUsuarios() {
    try {
      const response = await firstValueFrom(this.UsuarioService.getAllUsers());

      this.usuarios.set(response.usuarios);
      this.metaData.set(response.meta);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
  /**
   * metodo que guarda la referencia del usuario que se desea eliminar
   */
  referenciaUsuarioEliminar(user: User) {
    this.usuarioparaEliminar.set(user);
    // this.usuarioActual = usuario;
  }

  /**
   * metodo que elimina el registro del usuario
   */
  async eliminarUsuario() {
    try {
      const response = await firstValueFrom(
        this.UsuarioService.deleteUser(this.usuarioparaEliminar()?.id!)
      );
      this.msgExito.set(response.message);
      this.usuarioparaEliminar.set(null);
      this.obtenerUsuarios();
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
        this.UsuarioService.removeUser(this.usuarioparaEliminar()?.id!)
      );
      this.msgExito.set(response.message);
      this.usuarioparaEliminar.set(null);
      this.obtenerUsuarios();
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
  actualizarUsuario(usuario: User) {
    this.mostrarFormularioEmergente.set(true);
    this.usuarioparaActualizar.set(usuario);
  }

  refetchUsuarios(msg: string, page?: number) {
    this.msgExito.set(msg);
    if (page) {
      this.UsuarioService.page = page;
    }

    this.obtenerUsuarios();

    setTimeout(() => {
      this.msgExito.set('');
    }, 1500);
  }

  async activarUsuario(id: any) {
    try {
      const response = await firstValueFrom(
        this.UsuarioService.activateUser(id)
      );
      this.msgExito.set(response.message);
      this.obtenerUsuarios();

      setTimeout(() => {
        this.msgExito.set('');
      }, 1500);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }

  /**
   * metodo que genera el codigo QR del usuario
   */
  async enviarQR(id: string) {
    try {
      const response = await firstValueFrom(this.UsuarioService.generateQR(id));

      this.msgExito.set(response.message);
      this.obtenerUsuarios();
      setTimeout(() => {
        this.msgExito.set('');
      }, 2000);
    } catch (error) {
      this.ErrorServidor.invalidToken(error as CustomError);
    }
  }
  /**
   * metodo que verifica la el rol del personal logueado para restringir el acceso a ciertas acciones
   */
  restriccionPorRol() {
    const rol = this.StorageService.desencriptar('rol');

    if (rol == 'aux') {
      this.accesoDenegado = false;
    }
  }

  search(search: string) {
    this.UsuarioService.search = search;
  }
}
