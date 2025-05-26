import { Component, input, output } from '@angular/core';
import { Modulo } from '../../../interfaces/modulos.interface';

@Component({
  selector: 'app-switch-box',
  imports: [],
  templateUrl: './switch-box.component.html',
  styleUrl: './switch-box.component.css',
})
export class SwitchBoxComponent {
  id = input<string>('');
  activado = output<any>();
  permisosModulo = output<Modulo & { type: 'edit' | 'delete' | 'write' }>();
  tipoPermiso = input<'edit' | 'delete' | 'write'>();
  modulo = input<Modulo>();

  async switchBox(e: any) {
    const input = e.currentTarget.children[0];

    if (input.checked) {
      input.checked = true;
      this.activado.emit(this.id());
    } else {
      input.checked = false;

      if (this.modulo()) {
        this.permisosModulo.emit({
          ...this.modulo()!,
          type: this.tipoPermiso()!,
        });
      }
    }
  }
}
