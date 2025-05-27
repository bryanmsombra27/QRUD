import { Component, input, output } from '@angular/core';
import { Modulo } from '../../../interfaces/modulos.interface';

@Component({
  selector: 'app-switch-box',
  imports: [],
  templateUrl: './switch-box.component.html',
  styleUrl: './switch-box.component.css',
})
export class SwitchBoxComponent {
  activado = output<any>();
  permisosModulo = output<
    Modulo & { type: 'edit' | 'delete' | 'write'; submoduleId: string }
  >();

  id = input<string>('');
  tipoPermiso = input<'edit' | 'delete' | 'write'>();
  modulo = input<Modulo>();
  submodulo = input<string>();

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
          submoduleId: this.submodulo()!,
        });
      }
    }
  }
}
