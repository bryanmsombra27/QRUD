import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarmenuService } from '../../../services/sidebarmenu.service';
import { firstValueFrom } from 'rxjs';
import { Modulo } from '../../../interfaces/modulos.interface';
import {
  CustomError,
  ErrorServidorService,
} from '../../../services/errorServidor.service';
import { ModuloActualService } from '../../../services/modulo-actual.service';
import { ClientSocketIoService } from '../../../services/client-socket-io.service';

@Component({
  selector: 'app-panel-admin',
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css',
})
export default class PanelAdminComponent {
  /**
   * almacena la referencia a la funcion de cambio de color
   */
  funcionCambioDecolor: any;

  /**
   * obtiene el nombre del personal logueado
   */
  nombrePersonal: string = '';
  /**
   * obtiene la letra inicial del nombre del personal logueado
   */
  inicial: string = '';

  /**
   * inyeccion de dependencias
   */
  AuthService = inject(AuthService);
  StorageService = inject(StorageService);
  sidebarServices = inject(SidebarmenuService);
  ErrorServidor = inject(ErrorServidorService);
  selecteModuleService = inject(ModuloActualService);
  socketService = inject(ClientSocketIoService);

  modulos = signal<Modulo[]>([]);
  toggleOpenMenu = signal<boolean>(false);
  hoverSubMenu = signal<boolean>(false);
  /**
   * cuando el componente se destruye se elimina la funcion de cambio de color y se remueve las clases al body
   */
  ngOnDestroy(): void {
    clearTimeout(this.funcionCambioDecolor);
  }
  /**
   * obtiene el nombre del personal, la letra inicial del nombre y las rutas que le corresponden al rol del personal logueado
   */
  ngOnInit(): void {
    this.obtenerNombre();
    this.actualizarPermisos();
    // this.generarColorRandom();
    this.getAllModules();
  }

  // TODO: IMPLEMENTAR LA FUNCIONALIDAD DE LOS SUBMODULOS
  async getAllModules() {
    const menu = this.StorageService.consultarPermisosMenu();

    // console.log(menu, 'menu');
    const sidebarMenu: Modulo[] = [];

    for (const item of menu) {
      sidebarMenu.push(item.ModulosPermissions);
    }

    this.modulos.set(sidebarMenu);

    // try {
    //   const response = await firstValueFrom(
    //     this.sidebarServices.getModulesForsidebar()
    //   );
    //   this.modulos.set(response.modulos);
    // } catch (error) {
    //   this.ErrorServidor.invalidToken(error as CustomError);
    // }
  }

  /**
   * metodo para cerrar la sesion del personal logueado
   */
  logout() {
    this.AuthService.logout();
  }
  /**
   * obtiene el nombre del personal logueado
   */
  obtenerNombre() {
    this.nombrePersonal = this.StorageService.desencriptar('nombre');

    this.inicial = this.nombrePersonal.split('')[0].toUpperCase();
  }
  /**
   * genera un color aleatorio cada 3s
   */
  generarColorRandom() {
    this.funcionCambioDecolor = setInterval(() => {
      const color = Math.floor(Math.random() * 16777215).toString(16);
      const colorRandom = '#' + ('000000' + color).slice(-6);
      (document.querySelector('#cambioColor') as any).style.backgroundColor =
        colorRandom;
    }, 3000);
  }

  toogleMenu() {
    this.toggleOpenMenu.update((state) => !state);
  }

  showSubMenu(id: string) {
    const menuOptions = document.querySelectorAll('.submenu');
    const menu = document.querySelector(`#menu-${id}`);
    const menuArrow = document.querySelector(`#submenu-arrow-${id}`);

    const arrows = document.querySelectorAll('.arrows');

    menuOptions.forEach((option) => {
      if (option.id === id) return;

      option.classList.remove('active');
    });

    arrows.forEach((option) => {
      const optid = option.id.split('arrow-')[1];

      if (optid == id) return;

      option.classList.remove('rotate');
    });

    menuArrow?.classList.toggle('rotate');
    menu?.nextElementSibling?.classList.toggle('active');
    // menu?.children[2].classList.toggle('rotate');
  }

  hoverSubMenuHoverClass(id: string) {
    // const item = document.querySelector(`#submenu-item-${id}`);
    const wrappers = document.querySelectorAll('.submenu-wrapper');

    wrappers.forEach((wrapper: any) => {
      wrapper.classList.remove('active-subroutes');
      // console.log(wrapper, 'WRAPPER');
      const itemId = wrapper.dataset.module;
      // console.log(itemId, 'dataser');

      if (itemId == id) {
        wrapper?.classList.add('active-subroutes');
      } else {
        wrapper?.classList.remove('active-subroutes');
      }
    });
  }

  hoverSubMenuClassLeave() {
    const wrappers = document.querySelectorAll('.submenu-wrapper');
    wrappers.forEach((wrapper: any) => {
      wrapper.classList.remove('active-subroutes');
    });
  }

  // TODO: AGREGAR LA FUNCIONALIDAD PARA SELECCIONAR UN SUBMODULO
  selectModule(id: string) {
    this.selecteModuleService.moduloActual(id);
  }

  actualizarPermisos() {
    this.socketService.onUpdatePermissions().subscribe((data) => {
      console.log(data, 'PERMISOS ACTUALIZADOS');

      const menu = this.StorageService.consultarPermisosMenu() as [];
      console.log(menu, 'MENU ACTUAL');
      const newPermissionsForMenu = data.Permisos_modulos;

      console.log(newPermissionsForMenu, 'NUEVO MENU');

      this.StorageService.encryptar(
        'menu',
        JSON.stringify(newPermissionsForMenu)
      );
      this.getAllModules();
    });
  }

  private mergeArraysById(oldArray: any[], newArray: any[]): any[] {
    const map = new Map<number, any>();

    // Primero agrega los elementos del arreglo antiguo
    for (const item of oldArray) {
      map.set(item.id, item);
    }

    // Luego sobrescribe (o añade nuevos) desde el arreglo nuevo
    for (const item of newArray) {
      map.set(item.id, item);
    }

    return Array.from(map.values());
  }
}
