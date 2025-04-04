import { Component, input } from '@angular/core';

@Component({
  selector: 'app-exito',
  imports: [],
  templateUrl: './exito.component.html',
  styleUrl: './exito.component.css',
})
export class ExitoComponent {
  msg = input<string>('');
}
