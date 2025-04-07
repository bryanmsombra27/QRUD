import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-switch-box',
  imports: [],
  templateUrl: './switch-box.component.html',
  styleUrl: './switch-box.component.css',
})
export class SwitchBoxComponent {
  id = input<string>('');
  activado = output<any>();

  async switchBox(e: any) {
    const input = e.currentTarget.children[0];

    if (input.checked) {
      input.checked = true;
      this.activado.emit(this.id());
    } else {
      input.checked = false;
    }
  }
}
