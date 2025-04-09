import { Component, EventEmitter, inject, output, Output } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-buscador',
  imports: [],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
})
export class BuscadorComponent {
  // userService = inject(UsuarioService);

  refresh = output<boolean>();
  search = output<string>();

  busquedaRegistros(e: any, search: string) {
    // console.log(search, 'BUSQUEDA');
    if (search.length >= 3) {
      // this.userService.search = search;
      this.search.emit(search);
      this.refresh.emit(true);
    } else {
      // this.userService.search = '';
      this.search.emit('');
    }
    if (search.length == 0) {
      this.refresh.emit(true);
    }
  }
}
