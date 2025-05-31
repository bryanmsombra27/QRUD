import { Component, input, output } from '@angular/core';
import { Modulo } from '../../../interfaces/modulos.interface';
import { ModuleType } from '../../../interfaces/permission.interface';

@Component({
  selector: 'app-switch-box',
  imports: [],
  templateUrl: './switch-box.component.html',
  styleUrl: './switch-box.component.css',
})
export class SwitchBoxComponent {
  activado = output<any>();
  permisosModulo = output<Modulo & { type: ModuleType; submoduleId: string }>();

  id = input<string>('');
  tipoPermiso = input<ModuleType>();
  modulo = input<Modulo>();
  submodulo = input<string>();
  defaultValue = input<boolean>(false);

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
