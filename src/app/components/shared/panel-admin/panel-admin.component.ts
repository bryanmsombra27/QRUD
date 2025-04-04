import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-panel-admin',
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css',
})
export default class PanelAdminComponent {
  /**
   * propiedad que permite expandir el menu con las opciones para realizar el crud de usuarios
   */
  mostrarOpcionesMenuUsuario: boolean = false;

  /**
   * propiedad que permite expandir el menu con las opciones para realizar el crud de personal
   */
  mostrarOpcionesMenuPersonal: boolean = false;
  /**
   * propiedad que permite expandir el menu con las opciones para realizar el crud de rol
   */
  mostrarOpcionesMenuRol: boolean = false;
  /**
   * propiedad que permite expandir el menu con la opcion de escanear codigo qr
   */
  mostrarOpcionesMenuQR: boolean = false;
  /**
   * propiedad que permite expandir el menu con las opciones para realizar el cambio de contraseña
   */
  mostrarOpcionesMenuContrasena: boolean = false;
  /**
   * propiedad que permite expandir el menu lateral
   */
  expandirMenu: boolean = true;
  /**
   * guarda la referencia  del body
   */
  sidebar: any;
  //controla las rutas del personal logueado
  /**
   * propiedad que permite mostrar las rutas del personal cuyo rol coincida con el rol del personal logueado
   */
  esAdmin: boolean = false;
  /**
   * propiedad que permite mostrar las rutas del personal cuyo rol coincida con el rol del personal logueado
   */
  esMaster: boolean = false;
  /**
   * propiedad que permite mostrar las rutas del personal cuyo rol coincida con el rol del personal logueado
   */
  esAux: boolean = false;

  /**
   * almacena las rutas a las que el personal logueado tendra acceso dependiendo del rol
   */
  rutas: any[] = [];

  /**
   * almacena la referencia a la funcion de cambio de color
   */
  funcionCambioDecolor: any;

  /**
   * rutas que controla el rol master
   */
  rutasMaster: any[] = [
    [
      { ruta: '', nombre: 'Crear ' },
      { ruta: '/ver-usuarios', nombre: 'Ver' },
      { ruta: '/usuarios-eliminados', nombre: 'Eliminados' },
    ],
    [
      { ruta: '/registro-personal', nombre: 'Registrar ' },
      { ruta: '/ver-personal', nombre: 'Ver' },
      { ruta: '/personal-eliminado', nombre: 'Eliminados' },
    ],
    [
      { ruta: '/registro-rol', nombre: 'Crear' },
      { ruta: '/ver-rol', nombre: 'Ver' },
    ],
  ];
  /**
   * rutas que controla el rol admin
   */
  rutasAdmin: any[] = [
    [
      { ruta: '/ver-usuarios', nombre: 'Ver' },
      { ruta: '', nombre: 'Crear' },
      { ruta: '/usuarios-eliminados', nombre: 'Eliminados' }, //rutas usuario
    ],
    [{ ruta: '/ver-personal', nombre: 'Ver' }],
  ];
  /**
   * rutas que controla el rol aux
   */
  rutasAux: any[] = [
    { ruta: '', nombre: 'Crear' },
    { ruta: '/ver-usuarios', nombre: 'Ver' },
  ];
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

  /**
   * cuando el componente se destruye se elimina la funcion de cambio de color y se remueve las clases al body
   */
  ngOnDestroy(): void {
    this.sidebar?.classList.remove('body-pd');
    clearTimeout(this.funcionCambioDecolor);
  }
  /**
   * obtiene el nombre del personal, la letra inicial del nombre y las rutas que le corresponden al rol del personal logueado
   */
  ngOnInit(): void {
    this.obtenerNombre();
    this.verRol();
    this.generarColorRandom();
    this.mostrarMenu();
  }
  /**
   * muestra/oculta las acciones del menu lateral cuando se hace click en la opcion de usuarios
   */
  mostrarOpcionesUsuario() {
    this.mostrarOpcionesMenuUsuario = !this.mostrarOpcionesMenuUsuario;
  }
  /**
   * muestra/oculta las acciones del menu lateral cuando se hace click en la opcion de personal
   */
  mostrarOpcionesPersonal() {
    this.mostrarOpcionesMenuPersonal = !this.mostrarOpcionesMenuPersonal;
  }
  /**
   * muestra/oculta las acciones del menu lateral cuando se hace click en la opcion de rol
   */
  mostrarOpcionesRol() {
    this.mostrarOpcionesMenuRol = !this.mostrarOpcionesMenuRol;
  }
  /**
   * muestra/oculta las acciones del menu lateral cuando se hace click en la opcion escaneo qr
   */
  mostrarOpcionesQR() {
    this.mostrarOpcionesMenuQR = !this.mostrarOpcionesMenuQR;
  }
  /**
   * muestra/oculta las acciones del menu lateral cuando se hace click en la opcion de contraseña
   */
  mostrarOpcionesContrasena() {
    this.mostrarOpcionesMenuContrasena = !this.mostrarOpcionesMenuContrasena;
  }
  /**
   * muesta/oculta el menu lateral
   */
  mostrarMenu() {
    this.expandirMenu = !this.expandirMenu;
    this.sidebar = document.querySelector('body#body-pd');
    if (this.expandirMenu) {
      this.sidebar?.classList.add('body-pd');
    } else {
      this.sidebar?.classList.remove('body-pd');
    }
  }
  /**
   * obtiene el rol del personal logueado y asigna las rutas a las que tiene acceso
   */
  verRol() {
    const rol = this.StorageService.desencriptar('rol');
    if (rol == 'root') {
      this.esMaster = true;
      this.esAdmin = false;
      this.esAux = false;
      this.rutas = this.rutasMaster;
    } else if (rol == 'ADMIN_ROLE') {
      this.esAdmin = true;
      this.esMaster = false;
      this.esAux = false;
      this.rutas = this.rutasAdmin;
    } else {
      this.esAdmin = false;
      this.esMaster = false;
      this.esAux = true;
      this.rutas = this.rutasAux;
    }
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
}
