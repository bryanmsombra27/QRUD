import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  msg = input<string>('');
  funcion = input<any>();
  titulo = input<string>('');
  modal = input<string>('');

  ejecutarAccion() {
    this.funcion()?.();
  }
}
