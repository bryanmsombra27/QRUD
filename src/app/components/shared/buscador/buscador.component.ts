import { Component, EventEmitter, inject, output, Output } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-buscador',
  imports: [],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
})
export class BuscadorComponent {
  userService = inject(UsuarioService);

  refresh = output<boolean>();

  busquedaRegistros(e: any, search: string) {
    // console.log(search, 'BUSQUEDA');
    if (search.length >= 3) {
      console.log('ENTRA');
      this.userService.search = search;
      console.log(this.userService.search, 'BUSQUEDA SERVICIO');
      this.refresh.emit(true);
    } else {
      this.userService.search = '';
      console.log(this.userService.search, 'LIMPIEZA BUSQUEDA ');
    }
    if (search.length == 0) {
      this.refresh.emit(true);
    }
  }
}
